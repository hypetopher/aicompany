import { getSupabase } from '../lib/supabase.js';
import { classifySentiment, sentimentDelta } from './sentiment.js';

export async function updateAffinityFromRecentEvents(limit = 200) {
  const sb = getSupabase() as any;
  const { data, error } = await sb
    .from('ops_agent_events')
    .select('id, agent_id, kind, payload, summary, created_at')
    .order('id', { ascending: false })
    .limit(limit);
  if (error) throw error;

  let updates = 0;
  for (const e of data ?? []) {
    const from = e.payload?.fromAgent ?? e.agent_id;
    const to = e.payload?.toAgent ?? inferToFromSummary(e.summary ?? '');
    if (!from || !to || from === to) continue;

    const delta = scoreDelta(e.kind, e.summary ?? '');
    await sb.rpc('upsert_affinity', {
      p_from: from,
      p_to: to,
      p_delta: delta,
      p_event_id: e.id,
    });
    updates++;
  }

  return { scanned: data?.length ?? 0, updates };
}

function scoreDelta(kind: string, summary: string): number {
  const s = `${kind} ${summary}`.toLowerCase();
  const sentiment = classifySentiment(s);
  let delta = sentimentDelta(sentiment);

  if (s.includes('failed') || s.includes('conflict') || s.includes('disagree')) delta -= 1;
  if (s.includes('help') || s.includes('collab') || s.includes('mentor')) delta += 1;
  if (s.includes('dialog') || s.includes('reply')) delta += 0;

  return Math.max(-5, Math.min(5, delta));
}

function inferToFromSummary(summary: string): string | null {
  const m = summary.match(/\bto\s+([a-z0-9_-]+)/i);
  return m?.[1]?.toLowerCase() ?? null;
}
