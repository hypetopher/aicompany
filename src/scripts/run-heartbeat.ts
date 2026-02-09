import { runHeartbeat } from '../heartbeat/run-heartbeat.js';
import { db } from '../lib/db.js';
import { evaluateTriggers } from '../triggers/evaluate-triggers.js';
import { processReactionQueue } from '../reactions/process-reaction-queue.js';
import { createProposalAndMaybeAutoApprove } from '../services/proposal-service.js';

const noop = async () => ({ ok: true });

runHeartbeat({
  evaluateTriggers: async () => {
    const outcomes = await evaluateTriggers(db, 20);
    let created = 0;
    for (const o of outcomes) {
      if (!o.fired || !o.proposal) continue;
      await createProposalAndMaybeAutoApprove(db, {
        agentId: o.proposal.agentId,
        source: 'trigger',
        title: o.proposal.title,
        rationale: o.proposal.rationale,
        proposedSteps: o.proposal.proposedSteps,
      });
      created++;
    }
    return { outcomes: outcomes.length, created };
  },
  processReactionQueue: async () => processReactionQueue(db, 20),
  promoteInsights: noop,
  learnFromOutcomes: noop,
  recoverStaleSteps: noop,
  recoverStaleRoundtables: noop,
  logActionRun: db.logActionRun,
})
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
