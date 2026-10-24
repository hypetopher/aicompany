import { db } from '../lib/db.js';
import { evaluateGates } from '../services/proposal-service.js';

/**
 * Approve a pending proposal and turn it into a mission.
 *
 * Why this exists: `createProposalAndMaybeAutoApprove` only promotes a
 * proposal to a mission when the step kinds are in the auto-approve policy.
 * Kinds that need a human (post_tweet, publish_skill) therefore sat in
 * `pending` forever - there was no way to approve them at all. That made
 * "ship it as a proposal" impossible without hand-running the work.
 *
 * Usage: npm run proposal:approve -- <proposalId>
 */
async function main() {
  const id = Number(process.argv[2]);
  if (!Number.isFinite(id) || id <= 0) {
    console.error('usage: npm run proposal:approve -- <proposalId>');
    process.exit(1);
  }

  const proposal = await db.getProposal(id);
  if (!proposal) {
    console.error(`proposal ${id} not found`);
    process.exit(1);
  }
  if (proposal.status === 'accepted') {
    console.log(JSON.stringify({ proposalId: id, status: 'accepted', note: 'already approved' }));
    return;
  }
  if (proposal.status === 'rejected') {
    console.error(JSON.stringify({ proposalId: id, status: 'rejected', reason: proposal.reject_reason }));
    process.exit(1);
  }

  const steps = Array.isArray(proposal.proposed_steps) ? proposal.proposed_steps : [];
  if (steps.length === 0) {
    console.error(`proposal ${id} has no steps`);
    process.exit(1);
  }

  // Re-check the gates: a proposal created while a policy was permissive must
  // not become a mission after that policy tightened.
  const gate = await evaluateGates(db, steps);
  if (!gate.ok) {
    console.error(JSON.stringify({ proposalId: id, status: 'rejected', reason: gate.reason }));
    process.exit(1);
  }

  const mission = await db.createMissionFromProposal(id, proposal.agent_id, proposal.title, steps);
  await db.insertEvent({
    agent_id: proposal.agent_id,
    kind: 'proposal.approved',
    title: proposal.title,
    summary: `Approved proposal ${id} -> mission ${mission.id}`,
    payload: { proposalId: id, missionId: mission.id },
  });

  console.log(JSON.stringify({ proposalId: id, status: 'accepted', missionId: mission.id }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
