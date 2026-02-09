import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const calls: any[] = [];
  const rows = [
    {
      id: 1,
      agent_id: 'sage',
      kind: 'dialog.reply',
      summary: 'great collab with quill',
      payload: { fromAgent: 'sage', toAgent: 'quill' },
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      agent_id: 'observer',
      kind: 'step.failed',
      summary: 'conflict during handoff to xalt',
      payload: { fromAgent: 'observer', toAgent: 'xalt' },
      created_at: new Date().toISOString(),
    },
  ];

  const client = {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: async () => ({ data: rows, error: null }),
        }),
      }),
    }),
    rpc: async (_name: string, payload: any) => {
      calls.push(payload);
      return { data: null, error: null };
    },
    __calls: calls,
  };

  return { getSupabase: () => client };
});

import { updateAffinityFromRecentEvents } from '../../src/affinity/update-affinity.js';
import { getSupabase } from '../../src/lib/supabase.js';

describe('update-affinity', () => {
  it('creates affinity updates from event rows', async () => {
    const out = await updateAffinityFromRecentEvents(50);
    expect(out.scanned).toBe(2);
    expect(out.updates).toBe(2);

    const calls = (getSupabase() as any).__calls;
    expect(calls.length).toBe(2);
    expect(calls[0].p_from).toBe('sage');
    expect(calls[0].p_to).toBe('quill');
  });
});
