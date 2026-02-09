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
  const gate = await checkStepKindGates(db, input.proposedSteps);

  const proposal = await db.insertProposal({
    agent_id: input.agentId,
    source: input.source,
    title: input.title,
    rationale: input.rationale ?? null,
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

async function checkDailyLimit(_db: any, _agentId: string): Promise<void> {
  // placeholder: enforce per-agent proposal/day cap
}

async function isAutoApproveAllowed(_db: any, _kinds: string[]): Promise<boolean> {
  return true;
}

type GateResult = { ok: true } | { ok: false; reason: string };

async function checkStepKindGates(db: any, steps: StepInput[]): Promise<GateResult> {
  for (const step of steps) {
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
