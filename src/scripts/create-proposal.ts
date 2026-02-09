import { db } from '../lib/db.js';
import { createProposalAndMaybeAutoApprove } from '../services/proposal-service.js';

async function main() {
  const agentId = process.argv[2] ?? 'coordinator';
  const title = process.argv[3] ?? 'Draft a tweet about AI company progress';
  const stepKind = process.argv[4] ?? 'draft_tweet';
  const payloadArg = process.argv[5];

  let payload: Record<string, unknown> = { topic: 'AI company progress' };
  if (payloadArg) {
    try {
      payload = JSON.parse(payloadArg);
    } catch {
      payload = { topic: payloadArg };
    }
  }

  const out = await createProposalAndMaybeAutoApprove(db, {
    agentId,
    source: 'api',
    title,
    proposedSteps: [{ kind: stepKind, payload }],
  });
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
