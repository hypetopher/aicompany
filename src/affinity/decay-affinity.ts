import { getSupabase } from '../lib/supabase.js';

export async function runAffinityDecay(percent = 0.02) {
  const sb = getSupabase() as any;

  // Fetch all non-zero affinity rows
  const { data: rows, error: fetchError } = await sb
    .from('ops_agent_affinities')
    .select('id, score')
    .neq('score', 0);

  if (fetchError) throw fetchError;

  const decayedRows = rows?.length ?? 0;

  // Apply decay to each row via direct PATCH
  if (rows && rows.length > 0) {
    for (const row of rows) {
      const newScore = row.score > 0
        ? Math.max(0, Math.ceil(row.score * (1 - percent)))
        : row.score < 0
          ? Math.min(0, Math.floor(row.score * (1 - percent)))
          : 0;

      await sb
        .from('ops_agent_affinities')
        .update({ score: newScore, updated_at: new Date().toISOString() })
        .eq('id', row.id);
    }
  }

  // Fetch clamped rows (scores still out of bounds after decay — should be none normally)
  const { data: clampedRows, error: clampFetchError } = await sb
    .from('ops_agent_affinities')
    .select('id, score')
    .or('score.lt.-100,score.gt.100');

  if (clampFetchError) throw clampFetchError;

  const clampedCount = clampedRows?.length ?? 0;

  // Clamp out-of-bounds scores
  if (clampedRows && clampedRows.length > 0) {
    for (const row of clampedRows) {
      await sb
        .from('ops_agent_affinities')
        .update({ score: Math.max(-100, Math.min(100, row.score)), updated_at: new Date().toISOString() })
        .eq('id', row.id);
    }
  }

  return { decayedRows, clampedRows: clampedCount, percent };
}
