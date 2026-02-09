import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const mockData = {
    events: [
      { id: 2, agent_id: 'sage', kind: 'dialog.reply', title: 'Reply', summary: 'to quill', payload: { fromAgent: 'sage', toAgent: 'quill' }, created_at: new Date().toISOString() },
      { id: 1, agent_id: 'quill', kind: 'pulse', title: 'Pulse', summary: 'idle', payload: {}, created_at: new Date().toISOString() },
    ],
    missions: [{ id: 7, title: 'Mission A', status: 'running', updated_at: new Date().toISOString() }],
    steps: [{ mission_id: 7, status: 'queued' }, { mission_id: 7, status: 'succeeded' }],
  };

  const client: any = {
    rpc: async () => ({ data: { missions: 1, proposals: 2, deploys: 0, insights: 0, events: 2 }, error: null }),
    from: (table: string) => {
      if (table === 'ops_agent_events') {
        return {
          select: () => ({
            order: () => ({
              limit: async () => ({ data: mockData.events, error: null }),
            }),
          }),
        };
      }
      if (table === 'ops_missions') {
        return {
          select: () => ({
            order: () => ({
              limit: async () => ({ data: mockData.missions, error: null }),
            }),
          }),
        };
      }
      if (table === 'ops_mission_steps') {
        return {
          select: () => ({
            in: async () => ({ data: mockData.steps, error: null }),
          }),
        };
      }
      return { select: () => ({ order: () => ({ limit: async () => ({ data: [], error: null }) }) }) };
    },
  };

  return { getSupabase: () => client };
});

import { getStageSummary, getStageAgents, getStageEvents, getStageTasks } from '../../src/api/stage.js';

describe('stage api', () => {
  it('returns summary object', async () => {
    const s = await getStageSummary();
    expect(s.missions).toBe(1);
  });

  it('maps agent cards', async () => {
    const a = await getStageAgents();
    expect(a.length).toBeGreaterThan(0);
    expect(a[0]).toHaveProperty('role');
  });

  it('maps events and tasks', async () => {
    const e = await getStageEvents(10);
    const t = await getStageTasks(10);
    expect(e.length).toBeGreaterThan(0);
    expect(t.length).toBe(1);
    expect(t[0].progress.succeeded).toBe(1);
  });
});
