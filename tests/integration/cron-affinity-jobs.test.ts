import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { updateAffinityFromRecentEvents } from '../../src/affinity/update-affinity.js';
import { runAffinityDecay } from '../../src/affinity/decay-affinity.js';

const hasDbEnv = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

function sb() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
}

describe('integration: cron affinity jobs', () => {
  it.skipIf(!hasDbEnv)('hourly update job writes affinity edges from events', async () => {
    const c = sb() as any;
    const tag = `affinity-update-${Date.now()}`;

    const { data: ins, error: e1 } = await c.from('ops_agent_events').insert({
      agent_id: 'sage',
      kind: 'dialog.reply',
      title: `test-${tag}`,
      summary: 'great collab with quill',
      payload: { fromAgent: 'sage', toAgent: 'quill' },
    }).select('id').single();
    if (e1) throw e1;

    const out = await updateAffinityFromRecentEvents(200);
    expect(out.updates).toBeGreaterThan(0);

    const { data: edge, error: e2 } = await c
      .from('ops_agent_affinities')
      .select('from_agent_id,to_agent_id,score,interactions')
      .eq('from_agent_id', 'sage')
      .eq('to_agent_id', 'quill')
      .single();
    if (e2) throw e2;

    expect(edge.from_agent_id).toBe('sage');
    expect(edge.to_agent_id).toBe('quill');
    expect(Number(edge.interactions)).toBeGreaterThan(0);

    await c.from('ops_agent_events').delete().eq('id', ins.id);
  });

  it.skipIf(!hasDbEnv)('daily decay job reduces absolute scores over time', async () => {
    const c = sb() as any;
    const from = 'observer';
    const to = 'xalt';

    const { error: e1 } = await c.rpc('upsert_affinity', {
      p_from: from,
      p_to: to,
      p_delta: 20,
      p_event_id: null,
    });
    if (e1) throw e1;

    const { data: beforeRows, error: e2 } = await c
      .from('ops_agent_affinities')
      .select('score')
      .eq('from_agent_id', from)
      .eq('to_agent_id', to)
      .single();
    if (e2) throw e2;
    const before = Number(beforeRows.score);

    const out = await runAffinityDecay(0.1);
    expect(out.decayedRows).toBeGreaterThan(0);

    const { data: afterRows, error: e3 } = await c
      .from('ops_agent_affinities')
      .select('score')
      .eq('from_agent_id', from)
      .eq('to_agent_id', to)
      .single();
    if (e3) throw e3;
    const after = Number(afterRows.score);

    expect(Math.abs(after)).toBeLessThanOrEqual(Math.abs(before));
  });
});
