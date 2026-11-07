import { db } from '../lib/db.js';
import { createProposalAndMaybeAutoApprove } from '../services/proposal-service.js';

type Step = { kind: string; payload: Record<string, unknown> };

async function main() {
  const agentId = process.argv[2] ?? 'coordinator';
  const title = process.argv[3] ?? 'Draft a tweet about AI company progress';
  const stepKind = process.argv[4] ?? 'draft_tweet';
  const payloadArg = process.argv[5];

  let parsed: Record<string, unknown> = { topic: 'AI company progress' };
  if (payloadArg) {
    try {
      parsed = JSON.parse(payloadArg);
    } catch {
      parsed = { topic: payloadArg };
    }
  }

  // Multi-step intake.
  // Previously proposedSteps was hardcoded to exactly one step whose kind came
  // from argv, so no agent could file a proposal that both analyses and ships.
  // A payload may now carry a steps array of { kind, payload } entries.
  const rawSteps = Array.isArray((parsed as any).steps) ? ((parsed as any).steps as any[]) : null;
  const proposedSteps: Step[] =
    rawSteps && rawSteps.length > 0
      ? rawSteps.map((s) => ({ kind: String(s?.kind ?? stepKind), payload: (s?.payload ?? {}) as Record<string, unknown> }))
      : [{ kind: stepKind, payload: parsed }];

  const out = await createProposalAndMaybeAutoApprove(db, {
    agentId,
    source: 'api',
    title,
    proposedSteps,
  });
  console.log(JSON.stringify(out));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
