import { sb } from './supabase.js';

type Json = Record<string, unknown>;

export const db = {
  async getPolicy(key: string): Promise<any> {
    const { data, error } = await sb.from('ops_policy').select('value').eq('key', key).single();
    if (error) throw error;
    return data?.value ?? {};
  },

  async insertProposal(row: any): Promise<{ id: number }> {
    const { data, error } = await sb.from('ops_mission_proposals').insert(row).select('id').single();
    if (error) throw error;
    return data as { id: number };
  },

  async insertEvent(row: any): Promise<void> {
    const { error } = await sb.from('ops_agent_events').insert({
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
    const { count, error } = await sb
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
    const { data: mission, error: e1 } = await sb
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
      idempotency_key: `proposal:${proposalId}:kind:${s.kind}:${JSON.stringify(s.payload ?? {})}`,
    }));
    const { error: e2 } = await sb.from('ops_mission_steps').insert(rows);
    if (e2) throw e2;

    const { error: e3 } = await sb
      .from('ops_mission_proposals')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', proposalId);
    if (e3) throw e3;

    return mission as { id: number };
  },

  async claimOneStep(workerId: string): Promise<any | null> {
    const { data, error } = await sb.rpc('claim_one_step', { p_worker_id: workerId });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return data[0];
  },

  async markStepSucceeded(stepId: number): Promise<void> {
    const { error } = await sb
      .from('ops_mission_steps')
      .update({ status: 'succeeded', finished_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', stepId);
    if (error) throw error;
  },

  async markStepFailed(stepId: number, msg: string): Promise<void> {
    const { error } = await sb
      .from('ops_mission_steps')
      .update({ status: 'failed', finished_at: new Date().toISOString(), last_error: msg, updated_at: new Date().toISOString() })
      .eq('id', stepId);
    if (error) throw error;
  },

  async logActionRun(row: { actor: string; action: string; success: boolean; result: unknown }): Promise<void> {
    const { error } = await sb.from('ops_action_runs').insert({
      actor: row.actor,
      action: row.action,
      success: row.success,
      result: row.result ?? {},
    });
    if (error) throw error;
  },
};
