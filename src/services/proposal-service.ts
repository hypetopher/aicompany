export type StepInput = { kind: string; payload?: Record<string, unknown> };

export type ProposalServiceInput = {
  agentId: string;
  source: 'api' | 'trigger' | 'reaction';
  title: string;
  rationale?: string;
  proposedSteps: StepInput[];
};

export type ProposalServiceResult = {
  proposalId: number;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
  missionId?: number;
};

/**
 * Single entry point for every proposal source.
 * Real implementation should run in a DB transaction.
 */
export async function createProposalAndMaybeAutoApprove(
  db: any,
  input: ProposalServiceInput,
): Promise<ProposalServiceResult> {
  await checkDailyLimit(db, input.agentId);
  const kindGate = await checkStepKindGates(db, input.proposedSteps);
  const gate = kindGate.ok ? await checkPublishGate(db, input.proposedSteps) : kindGate;

  const proposal = await db.insertProposal({
    agent_id: input.agentId,
    source: input.source,
    title: input.title,
    rationale: input.rationale?.trim() || deriveRationale(input),
    proposed_steps: input.proposedSteps,
    status: gate.ok ? 'pending' : 'rejected',
    reject_reason: gate.ok ? null : gate.reason,
  });

  await db.insertEvent({
    agent_id: input.agentId,
    kind: gate.ok ? 'proposal.created' : 'proposal.rejected',
    title: input.title,
    summary: gate.ok ? 'Proposal created' : `Rejected: ${gate.reason}`,
    payload: { proposalId: proposal.id, source: input.source },
  });

  if (!gate.ok) {
    return { proposalId: proposal.id, status: 'rejected', reason: gate.reason };
  }

  const auto = await isAutoApproveAllowed(db, input.proposedSteps.map((s) => s.kind));
  if (!auto) return { proposalId: proposal.id, status: 'pending' };

  const mission = await db.createMissionFromProposal(proposal.id, input.agentId, input.title, input.proposedSteps);
  return { proposalId: proposal.id, status: 'accepted', missionId: mission.id };
}

/**
 * Fallback rationale for proposals submitted without one.
 *
 * 94% of 24h proposals carried a blank rationale, which made every review
 * (observer diagnostics, MC) unable to tell what the proposal was for. The
 * prefix marks the text as derived rather than agent-written so downstream
 * quality metrics can still tell the difference.
 */
function deriveRationale(input: ProposalServiceInput): string {
  const kinds = input.proposedSteps.map((s) => s.kind).join(', ');
  return `[auto] ${input.agentId} ${input.source} proposal "${input.title}" (steps: ${kinds})`;
}

async function checkDailyLimit(_db: any, _agentId: string): Promise<void> {
  // placeholder: enforce per-agent proposal/day cap
}

/**
 * Kinds that may be auto-approved when the policy read fails.
 * Deliberately excludes post_tweet: if we cannot read the policy we must not
 * auto-execute a publishing step against a possibly-mock social adapter.
 */
const SAFE_DEFAULT_AUTO_APPROVE_KINDS = ['analyze', 'draft_tweet', 'write_content'];

/**
 * publish_skill is never auto-approved: it opens a pull request on a real
 * repository. It requires the explicit approval path
 * (`npm run proposal:approve -- <id>`), even when the policy read fails.
 */
export const NEVER_AUTO_APPROVE_KINDS = ['publish_skill'];

/**
 * Auto-approve is a *policy* decision, not a constant. `ops_policy.auto_approve`
 * carries an explicit `allowed_step_kinds` list that omits `post_tweet` on
 * purpose. This function used to `return true` unconditionally, which meant
 * the policy table was decorative: a `post_tweet` proposal would be accepted,
 * executed, and would publish through `social.postTweet` — which is still the
 * mock adapter — writing a false publish record into ops_social_posts, the
 * exact table the publish-path criterion measures.
 *
 * Every step kind in the proposal must be allowed; unknown kinds fail closed.
 */
async function isAutoApproveAllowed(db: any, kinds: string[]): Promise<boolean> {
  if (!Array.isArray(kinds) || kinds.length === 0) return false;

  let allowed: string[] = SAFE_DEFAULT_AUTO_APPROVE_KINDS;
  try {
    const policy = await db.getPolicy('auto_approve');
    if (policy?.enabled === false) return false;
    if (Array.isArray(policy?.allowed_step_kinds) && policy.allowed_step_kinds.length > 0) {
      allowed = policy.allowed_step_kinds as string[];
    }
  } catch {
    // Policy unreadable: keep the safe default rather than failing open.
  }

  if (kinds.some((k) => NEVER_AUTO_APPROVE_KINDS.includes(k))) return false;

  return kinds.every((k) => allowed.includes(k));
}

type GateResult = { ok: true } | { ok: false; reason: string };

/** Kinds the worker can actually execute (see executors/step-executors.ts). */
export const EXECUTABLE_STEP_KINDS = [
  'analyze',
  'draft_tweet',
  'write_content',
  'post_tweet',
  'publish_skill',
] as const;

/**
 * Publishing is gated by an explicit repo allowlist (`publish_gate` policy).
 * Without it, any proposal carrying a publish_skill step could ship to any
 * repository. With it, the pipeline can finally ship a skill artifact, but
 * only to a repo an operator has named.
 */
async function checkPublishGate(db: any, steps: StepInput[]): Promise<GateResult> {
  const publishSteps = steps.filter((s) => s.kind === 'publish_skill');
  if (publishSteps.length === 0) return { ok: true };

  let policy: any = {};
  try {
    policy = await db.getPolicy('publish_gate');
  } catch {
    return { ok: false, reason: 'publish_gate policy unreadable' };
  }
  if (policy?.enabled === false) return { ok: false, reason: 'publishing disabled' };

  const allowed: string[] = Array.isArray(policy?.allowed_repos) ? policy.allowed_repos : [];
  if (allowed.length === 0) return { ok: false, reason: 'publish_gate has no allowed repos' };

  for (const step of publishSteps) {
    const repo = String(step.payload?.repo ?? '');
    if (!allowed.includes(repo)) {
      return { ok: false, reason: `repo not allowed to publish: ${repo || '(none)'}` };
    }
  }
  return { ok: true };
}

/**
 * Intake gates, exported so the approval path can re-check them.
 * A proposal that was created while a policy was permissive must not become
 * a mission after that policy tightened.
 */
export async function evaluateGates(db: any, steps: StepInput[]): Promise<GateResult> {
  const kindGate = await checkStepKindGates(db, steps);
  if (!kindGate.ok) return kindGate;
  return checkPublishGate(db, steps);
}

async function checkStepKindGates(db: any, steps: StepInput[]): Promise<GateResult> {
  for (const step of steps) {
    // Fail closed at intake: a kind the executor cannot run would otherwise be
    // retried 7 times and then dead-lettered, burning ~68 minutes of wall clock.
    if (!EXECUTABLE_STEP_KINDS.includes(step.kind as any)) {
      return { ok: false, reason: `Unknown step kind: ${step.kind}` };
    }
    if (step.kind === 'post_tweet') {
      const quota = await db.getPolicy('x_daily_quota');
      if (quota?.enabled === false) return { ok: false, reason: 'x autopost disabled' };
      const limit = Number(quota?.limit ?? 8);
      const count = await db.countTodayPostedTweets();
      if (count >= limit) return { ok: false, reason: `Daily tweet quota reached (${count}/${limit})` };
    }
  }
  return { ok: true };
}
