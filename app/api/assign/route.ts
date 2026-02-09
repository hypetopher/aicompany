import { NextResponse } from 'next/server';
import { createProposalAndMaybeAutoApprove } from '../../../src/services/proposal-service';
import { db } from '../../../src/lib/db';

const ALLOWED = new Set(['analyze', 'write_content', 'draft_tweet', 'post_tweet']);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const agentId = String(body.agentId ?? '').trim().toLowerCase();
    const title = String(body.title ?? '').trim();
    const stepKind = String(body.stepKind ?? '').trim();
    const payloadText = String(body.payloadText ?? '').trim();

    if (!agentId || !title || !stepKind) {
      return NextResponse.json({ ok: false, error: 'agentId, title, stepKind are required' }, { status: 400 });
    }
    if (!ALLOWED.has(stepKind)) {
      return NextResponse.json({ ok: false, error: `stepKind not allowed: ${stepKind}` }, { status: 400 });
    }

    let payload: Record<string, unknown> = {};
    if (payloadText) {
      try {
        payload = JSON.parse(payloadText);
      } catch {
        if (stepKind === 'analyze') payload = { target: payloadText };
        else if (stepKind === 'write_content') payload = { brief: payloadText };
        else if (stepKind === 'draft_tweet') payload = { topic: payloadText };
        else if (stepKind === 'post_tweet') payload = { text: payloadText };
      }
    }

    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId,
      source: 'api',
      title,
      proposedSteps: [{ kind: stepKind, payload }],
    });

    return NextResponse.json({ ok: true, data: out });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
