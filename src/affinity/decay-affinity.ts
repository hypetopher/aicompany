import { getSupabase } from '../lib/supabase.js';

export async function runAffinityDecay(percent = 0.02) {
  const sb = getSupabase() as any;
  const { data, error } = await sb.rpc('apply_affinity_decay', { p_percent: percent });
  if (error) throw error;

  const { data: clamped, error: e2 } = await sb.rpc('clamp_affinity_scores');
  if (e2) throw e2;

  return { decayedRows: data ?? 0, clampedRows: clamped ?? 0, percent };
}
