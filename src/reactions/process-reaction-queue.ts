import { createProposalAndMaybeAutoApprove } from '../services/proposal-service.js';

export async function processReactionQueue(db: any, batch = 20): Promise<{ processed: number }> {
  const items = await db.fetchPendingReactions(batch);
  let processed = 0;

  for (const item of items) {
    const mapped = mapReactionToProposal(item);
    if (!mapped) {
      await db.markReactionDone(item.id, 'ignored');
      processed++;
      continue;
    }

    await createProposalAndMaybeAutoApprove(db, {
      agentId: mapped.agentId,
      source: 'reaction',
      title: mapped.title,
      rationale: mapped.rationale,
      proposedSteps: mapped.proposedSteps,
    });

    await db.markReactionDone(item.id, 'processed');
    processed++;
  }

  return { processed };
}

function mapReactionToProposal(item: any): null | {
  agentId: string;
  title: string;
  rationale?: string;
  proposedSteps: Array<{ kind: string; payload?: Record<string, unknown> }>;
} {
  if (item.kind === 'event:step_failed') {
    return {
      agentId: 'observer',
      title: `Investigate failed step ${item.step_id}`,
      rationale: item.summary,
      proposedSteps: [{ kind: 'analyze', payload: { stepId: item.step_id, reason: item.summary } }],
    };
  }

  if (item.kind === 'event:tweet_posted') {
    return {
      agentId: 'scout',
      title: `Monitor engagement for tweet ${item.tweet_id}`,
      proposedSteps: [{ kind: 'analyze', payload: { tweetId: item.tweet_id, mode: 'engagement-watch' } }],
    };
  }

  return null;
}
