import { db } from '../lib/db.js';
import { createProposalAndMaybeAutoApprove } from '../services/proposal-service.js';

async function main() {
  const out = await createProposalAndMaybeAutoApprove(db, {
    agentId: process.argv[2] ?? 'coordinator',
    source: 'api',
    title: process.argv[3] ?? 'Draft a tweet about AI company progress',
    proposedSteps: [{ kind: 'draft_tweet', payload: { topic: 'AI company progress' } }],
  });
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
