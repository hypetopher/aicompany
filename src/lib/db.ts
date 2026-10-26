import { createHash } from 'node:crypto';
import { getSupabase } from './supabase.js';

type Json = Record<string, unknown>;

/**
 * A failure we caused on purpose is a resolution, not an incident.
 * Diagnosing resolutions forever is what produced the queue backlog.
 */
export function classifyFailure(lastError: string): 'resolution' | 'unknown_kind' | 'transient' {
  const e = lastError.toLowerCase();
  if (e.includes('duplicate') || e.includes('cancelled') || e.includes('probe artifact') || e.includes('superseded')) {
    return 'resolution';
  }
  if (e.includes('unknown step kind') || e.includes('dead-letter')) return 'unknown_kind';
  return 'transient';
}

/** Lower number = claimed first. Real work beats bulk analysis. */
export function stepPriority(step: { kind: string; payload?: unknown }): number {
  const payload = (step.payload ?? {}) as Record<string, unknown>;
  if (payload.mode === 'postmortem') return 90; // redundant diagnosis work
  if (step.kind === 'post_tweet') return 0;
  if (step.kind === 'write_content') return 10;
  if (step.kind === 'draft_tweet') return 20;
  if (step.kind === 'analyze') return 50;
  return 40;
}

/**
 * Grace period before a zero-step mission is force-closed as failed.
 * Must exceed the proposal->step creation race window.
 */
export const ZERO_STEP_GRACE_MS = 30 * 60 * 1000;

/**
 * Idempotency key for a mission step.
 *
 * The old key embedded the raw payload JSON: `proposal:1:kind:analyze:{...}`.
 * Postgres btree index entries cap at 2704 bytes, so a large analyze/content
 * payload made the step INSERT abort with
 * `index row size 4040 exceeds btree version 4 maximum 2704 for index
 * "idx_ops_mission_steps_idempotency"` (reproduced 2026-10-26 with a 4KB
 * incompressible payload). The mission row was already inserted at that point,
 * so the result was an approved mission with zero steps that could never be
 * claimed and never terminated.
 *
 * Hash the payload instead: fixed 64 hex chars, same dedupe semantics
 * (identical payload -> identical key) and no size ceiling.
 */
export function stepIdempotencyKey(proposalId: number, kind: string, payload: unknown): string {
  const digest = createHash('sha256').update(JSON.stringify(payload ?? {})).digest('hex');
  return `proposal:${proposalId}:kind:${kind}:${digest}`;
}

export const db = {
  async getPolicy(key: string): Promise<any> {
    const { data, error } = await (getSupabase() as any).from('ops_policy').select('value').eq('key', key).single();
    if (error) throw error;
    return data?.value ?? {};
  },

  async insertProposal(row: any): Promise<{ id: number }> {
    const { data, error } = await (getSupabase() as any).from('ops_mission_proposals').insert(row).select('id').single();
    if (error) throw error;
    return data as { id: number };
  },

  async getProposal(id: number): Promise<any | null> {
    const { data, error } = await (getSupabase() as any)
      .from('ops_mission_proposals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  async insertEvent(row: any): Promise<void> {
    const { error } = await (getSupabase() as any).from('ops_agent_events').insert({
      agent_id: row.agent_id ?? 'system',
      mission_id: row.mission_id ?? null,
      step_id: row.step_id ?? null,
      kind: row.kind,
      title: row.title,
      summary: row.summary ?? null,
      tags: row.tags ?? [],
      payload: row.payload ?? {},
    });
    if (error) throw error;
  },

  async countTodayPostedTweets(): Promise<number> {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const { count, error } = await (getSupabase() as any)
      .from('ops_agent_events')
      .select('id', { count: 'exact', head: true })
      .eq('kind', 'tweet.posted')
      .gte('created_at', start.toISOString());
    if (error) throw error;
    return count ?? 0;
  },

  async createMissionFromProposal(
    proposalId: number,
    createdBy: string,
    title: string,
    steps: Array<{ kind: string; payload?: Json }>,
  ): Promise<{ id: number }> {
    const { data: mission, error: e1 } = await (getSupabase() as any)
      .from('ops_missions')
      .insert({ proposal_id: proposalId, created_by: createdBy, title, status: 'approved' })
      .select('id')
      .single();
    if (e1) throw e1;

    const rows = steps.map((s) => ({
      mission_id: mission.id,
      kind: s.kind,
      payload: s.payload ?? {},
      status: 'queued',
      idempotency_key: stepIdempotencyKey(proposalId, s.kind, s.payload ?? {}),
    }));
    const { error: e2 } = await (getSupabase() as any).from('ops_mission_steps').insert(rows);
    if (e2) {
      // Compensating rollback: without this the mission row survives with zero
      // steps and the proposal stays 'pending' forever (the 94711/94720/94732
      // graveyard). The step insert is what failed, so remove the mission and
      // let the proposal be retried or rejected explicitly.
      await (getSupabase() as any)
        .from('ops_missions')
        .delete()
        .eq('id', (mission as any).id);
      await (getSupabase() as any)
        .from('ops_mission_proposals')
        .update({
          status: 'rejected',
          reject_reason: `step insert failed: ${e2.message ?? String(e2)}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', proposalId);
      throw e2;
    }

    const { error: e3 } = await (getSupabase() as any)
      .from('ops_mission_proposals')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', proposalId);
    if (e3) throw e3;

    return mission as { id: number };
  },

  async claimOneStep(workerId: string): Promise<any | null> {
    const { data, error } = await (getSupabase() as any).rpc('claim_one_step', { p_worker_id: workerId });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return data[0];
  },

  async markStepSucceeded(stepId: number): Promise<void> {
    const { error } = await (getSupabase() as any)
      .from('ops_mission_steps')
      .update({ status: 'succeeded', finished_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', stepId);
    if (error) throw error;
  },

  async markStepFailed(stepId: number, msg: string): Promise<void> {
    const { error } = await (getSupabase() as any)
      .from('ops_mission_steps')
      .update({ status: 'failed', finished_at: new Date().toISOString(), last_error: msg, updated_at: new Date().toISOString() })
      .eq('id', stepId);
    if (error) throw error;
  },

  async requeueStep(stepId: number, msg: string, runAfterIso: string): Promise<void> {
    const { error } = await (getSupabase() as any)
      .from('ops_mission_steps')
      .update({ status: 'queued', last_error: msg, run_after: runAfterIso, updated_at: new Date().toISOString() })
      .eq('id', stepId);
    if (error) throw error;
  },

  /**
   * Resolve the agent that actually owns a step.
   *
   * The step -> mission -> created_by chain is the only record of who asked
   * for the work. Hardcoding 'quill'/'observer' here stamped every artifact
   * with the wrong author, which made insight.generated look 100% observer
   * no matter who produced it (a chronic observer complaint for days).
   */
  async resolveStepAuthor(stepId: number, fallback: string): Promise<string> {
    const sb = getSupabase() as any;
    const { data: step } = await sb
      .from('ops_mission_steps')
      .select('mission_id')
      .eq('id', stepId)
      .maybeSingle();
    if (!step?.mission_id) return fallback;
    const { data: mission } = await sb
      .from('ops_missions')
      .select('created_by')
      .eq('id', step.mission_id)
      .maybeSingle();
    const author = String(mission?.created_by ?? '').trim();
    return author || fallback;
  },

  async saveTweetDraft(row: { stepId: number; text: string }): Promise<void> {
    await this.insertEvent({
      agent_id: await this.resolveStepAuthor(row.stepId, 'quill'),
      step_id: row.stepId,
      kind: 'tweet.drafted',
      title: 'Tweet drafted',
      summary: row.text.slice(0, 180),
      payload: { text: row.text },
    });
  },

  async saveInsight(row: { stepId: number; report: string }): Promise<void> {
    await this.insertEvent({
      agent_id: await this.resolveStepAuthor(row.stepId, 'observer'),
      step_id: row.stepId,
      kind: 'insight.generated',
      title: 'Insight generated',
      summary: row.report.slice(0, 180),
      payload: { report: row.report },
    });
  },

  async saveContentDraft(row: { stepId: number; body: string }): Promise<void> {
    await this.insertEvent({
      agent_id: await this.resolveStepAuthor(row.stepId, 'quill'),
      step_id: row.stepId,
      kind: 'content.drafted',
      title: 'Content drafted',
      summary: row.body.slice(0, 180),
      payload: { body: row.body },
    });
  },

  async savePostedTweet(row: { stepId: number; text: string; tweetId: string }): Promise<void> {
    const { error } = await (getSupabase() as any).from('ops_social_posts').insert({
      platform: 'x',
      external_post_id: row.tweetId,
      content: row.text,
      status: 'posted',
      author_agent_id: 'xalt',
      step_id: row.stepId,
      metrics: {},
      posted_at: new Date().toISOString(),
    });
    if (error) throw error;
  },

  async findViralTweetCandidates(limit: number): Promise<any[]> {
    const { data, error } = await (getSupabase() as any)
      .from('ops_social_posts')
      .select('id, external_post_id, metrics')
      .eq('status', 'posted')
      .order('posted_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    return (data ?? [])
      .map((r: any) => ({
        tweet_id: r.external_post_id ?? String(r.id),
        views: Number(r.metrics?.views ?? 0),
      }))
      .filter((r: any) => r.views >= 5000);
  },

  /**
   * Classify a failure so that "resolutions" never enter the diagnose feed.
   * A resolution is a failure we caused on purpose (duplicate, cancelled, probe
   * artifact). Diagnosing it forever is the loop that filled the queue.
   */
  async findRecentFailedMissions(limit: number): Promise<any[]> {
    const sb = getSupabase() as any;
    const { data: missions, error } = await sb
      .from('ops_missions')
      .select('id, title, updated_at')
      .eq('status', 'failed')
      .order('updated_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    const out: any[] = [];
    for (const m of missions ?? []) {
      const { data: failing } = await sb
        .from('ops_mission_steps')
        .select('id, kind, last_error, status')
        .eq('mission_id', m.id)
        .eq('status', 'failed')
        .limit(1);
      const step = (failing ?? [])[0];
      const lastError = String(step?.last_error ?? '');
      const failureClass = classifyFailure(lastError);

      // Resolutions (duplicate / cancelled / probe artifact) are not incidents.
      if (failureClass === 'resolution') continue;

      // A dead-lettered unknown step kind is a *permanent* config error: the
      // executor can never run it, so no amount of diagnosis fixes it.
      // Diagnosing it again only regenerates the same dead-letter loop.
      if (failureClass === 'unknown_kind') continue;

      // Dedupe: one postmortem per failed mission, ever — not just one *open*
      // one. The postmortem step lives on a *different* mission, so it must be
      // matched by payload. Previously only queued/running postmortems were
      // counted, so a mission whose postmortem had already succeeded got a
      // fresh diagnosis on every heartbeat (348 postmortems for one mission).
      const { data: open } = await sb
        .from('ops_mission_steps')
        .select('id, mission_id, status')
        .eq('kind', 'analyze')
        .eq('payload->>mode', 'postmortem')
        .eq('payload->>missionId', String(m.id))
        .in('status', ['queued', 'running', 'succeeded']);
      if (open && open.length > 0) continue;

      out.push({
        mission_id: m.id,
        reason: lastError || m.title,
        failure_class: failureClass,
        failing_step_kind: step?.kind ?? null,
        failing_step_id: step?.id ?? null,
      });
    }
    return out;
  },

  /**
   * Priority-aware, race-safe claim. Picks the highest-priority queued step
   * (value work before bulk analysis) and flips it to running with a
   * compare-and-set so two workers cannot take the same row.
   */
  async claimOneStepByPriority(workerId: string): Promise<any | null> {
    const sb = getSupabase() as any;
    const { data: candidates, error } = await sb
      .from('ops_mission_steps')
      .select('id, kind, payload, attempts')
      .eq('status', 'queued')
      .lte('run_after', new Date().toISOString())
      .order('id', { ascending: true })
      .limit(50);
    if (error) throw error;

    const ranked = (candidates ?? []).slice().sort((a: any, b: any) => stepPriority(a) - stepPriority(b));
    for (const cand of ranked) {
      const { data: claimed } = await sb
        .from('ops_mission_steps')
        .update({
          status: 'running',
          attempts: Number(cand.attempts ?? 0) + 1,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          worker_id: workerId,
        })
        .eq('id', cand.id)
        .eq('status', 'queued')
        .select('id, mission_id, kind, payload, attempts')
        .maybeSingle();
      if (claimed) return claimed;
    }
    return null;
  },

  /**
   * Sweep for missions that are 'approved' but have zero steps.
   *
   * closeMissionIfComplete() handles the zero-step case too, but it is only
   * called when a step is claimed - and a zero-step mission has no step to
   * claim, so the reaper never fired on its own. This sweep is the standalone
   * path the heartbeat calls every cycle.
   */
  async reapZeroStepMissions(graceMs = ZERO_STEP_GRACE_MS): Promise<number> {
    const sb = getSupabase() as any;
    const cutoff = new Date(Date.now() - graceMs).toISOString();
    const { data: missions, error } = await sb
      .from('ops_missions')
      .select('id, proposal_id')
      .eq('status', 'approved')
      .lt('created_at', cutoff);
    if (error) throw error;

    let reaped = 0;
    for (const m of missions ?? []) {
      const { data: steps } = await sb
        .from('ops_mission_steps')
        .select('id')
        .eq('mission_id', m.id)
        .limit(1);
      if ((steps ?? []).length > 0) continue;

      const now = new Date().toISOString();
      const { error: e } = await sb
        .from('ops_missions')
        .update({ status: 'failed', started_at: now, finished_at: now, updated_at: now })
        .eq('id', m.id)
        .eq('status', 'approved');
      if (e) continue;
      reaped++;

      // The proposal that produced this mission never became a mission
      // (its step insert aborted). Close it so it stops showing as pending.
      await sb
        .from('ops_mission_proposals')
        .update({
          status: 'rejected',
          reject_reason: 'mission closed with zero steps (step insert failed)',
          updated_at: now,
        })
        .eq('id', (m as any).proposal_id ?? -1)
        .eq('status', 'pending');
    }
    return reaped;
  },

  /**
   * Sweep proposals that have been 'pending' far too long.
   *
   * A proposal only stays pending when a human must approve it (post_tweet /
   * publish_skill) or when its mission creation aborted. Auto-approvable kinds
   * that are still pending after days are leftovers from before the gates
   * existed - they should have been accepted long ago and nobody is going to
   * look at them now.
   */
  async reapStalePendingProposals(maxAgeMs = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const sb = getSupabase() as any;
    const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
    const { data: proposals, error } = await sb
      .from('ops_mission_proposals')
      .select('id, proposed_steps')
      .eq('status', 'pending')
      .lt('created_at', cutoff);
    if (error) throw error;

    let reaped = 0;
    for (const p of proposals ?? []) {
      const steps = Array.isArray(p.proposed_steps) ? p.proposed_steps : [];
      // Kinds that need a human stay pending on purpose.
      if (steps.some((s: any) => s.kind === 'post_tweet' || s.kind === 'publish_skill')) continue;

      const { error: e } = await sb
        .from('ops_mission_proposals')
        .update({
          status: 'rejected',
          reject_reason: 'stale proposal reaped (no approval after 7d)',
          updated_at: new Date().toISOString(),
        })
        .eq('id', p.id)
        .eq('status', 'pending');
      if (e) continue;
      reaped++;
    }
    return reaped;
  },

  /**
   * Close a mission once all of its steps are terminal.
   * Without this, ops_missions is a graveyard of 'approved' rows.
   */
  async closeMissionIfComplete(missionId: number): Promise<void> {
    const sb = getSupabase() as any;
    const { data: steps } = await sb
      .from('ops_mission_steps')
      .select('id, status')
      .eq('mission_id', missionId);
    const list = steps ?? [];
    if (list.length === 0) {
      // Zero-step mission: the normal terminal path can never fire, so the row
      // stays 'approved' forever (graveyard). Close it after a grace period
      // that is safely longer than the proposal->step creation race.
      const { data: mission } = await sb
        .from('ops_missions')
        .select('id, status, created_at')
        .eq('id', missionId)
        .maybeSingle();
      if (!mission || mission.status !== 'approved') return;
      const ageMs = Date.now() - new Date(mission.created_at as string).getTime();
      if (!Number.isFinite(ageMs) || ageMs < ZERO_STEP_GRACE_MS) return;
      const now = new Date().toISOString();
      await sb
        .from('ops_missions')
        .update({ status: 'failed', started_at: now, finished_at: now, updated_at: now })
        .eq('id', missionId)
        .eq('status', 'approved');
      return;
    }
    const allTerminal = list.every((s: any) => s.status === 'succeeded' || s.status === 'failed');
    if (!allTerminal) return;
    const anyFailed = list.some((s: any) => s.status === 'failed');
    const now = new Date().toISOString();
    await sb
      .from('ops_missions')
      .update({
        status: anyFailed ? 'failed' : 'succeeded',
        started_at: now,
        finished_at: now,
        updated_at: now,
      })
      .eq('id', missionId);
  },

  async fetchPendingReactions(batch: number): Promise<any[]> {
    const { data, error } = await (getSupabase() as any)
      .from('ops_reaction_queue')
      .select('id, kind, payload, attempts')
      .eq('status', 'pending')
      .order('id', { ascending: true })
      .limit(batch);
    if (error) throw error;
    return (data ?? []).map((r: any) => ({ id: r.id, kind: r.kind, ...(r.payload ?? {}), attempts: r.attempts }));
  },

  async markReactionDone(id: number, status: string): Promise<void> {
    const { error } = await (getSupabase() as any)
      .from('ops_reaction_queue')
      .update({ status, processed_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async logActionRun(row: { actor: string; action: string; success: boolean; result: unknown }): Promise<void> {
    const { error } = await (getSupabase() as any).from('ops_action_runs').insert({
      actor: row.actor,
      action: row.action,
      success: row.success,
      result: row.result ?? {},
    });
    if (error) throw error;
  },
};
