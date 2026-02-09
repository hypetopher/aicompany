import { describe, it, expect } from 'vitest';
import { createProposalAndMaybeAutoApprove } from '../../src/services/proposal-service.js';

function mkDb(opts?: { quotaLimit?: number; postedCount?: number; autoApprove?: boolean }) {
  let proposalId = 1;
  let missionId = 10;
  const state = { proposals: [] as any[], missions: [] as any[], events: [] as any[], steps: [] as any[] };

  return {
    state,
    async getPolicy(key: string) {
      if (key === 'x_daily_quota') return { enabled: true, limit: opts?.quotaLimit ?? 8 };
      if (key === 'auto_approve') return { enabled: opts?.autoApprove ?? true, allowed_step_kinds: ['post_tweet', 'draft_tweet', 'analyze'] };
      return {};
    },
    async countTodayPostedTweets() {
      return opts?.postedCount ?? 0;
    },
    async insertProposal(row: any) {
      const p = { id: proposalId++, ...row };
      state.proposals.push(p);
      return { id: p.id };
    },
    async insertEvent(row: any) {
      state.events.push(row);
    },
    async createMissionFromProposal(pid: number, createdBy: string, title: string, steps: any[]) {
      const m = { id: missionId++, pid, createdBy, title };
      state.missions.push(m);
      state.steps.push(...steps);
      return { id: m.id };
    },
  };
}

describe('proposal-service', () => {
  it('accepts and creates mission when gate passes', async () => {
    const db = mkDb({ postedCount: 0, quotaLimit: 8 });
    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'xalt',
      source: 'api',
      title: 'post tweet',
      proposedSteps: [{ kind: 'post_tweet', payload: { text: 'hello' } }],
    });

    expect(out.status).toBe('accepted');
    expect(out.missionId).toBeTruthy();
    expect(db.state.proposals).toHaveLength(1);
    expect(db.state.missions).toHaveLength(1);
  });

  it('rejects when tweet quota is full', async () => {
    const db = mkDb({ postedCount: 8, quotaLimit: 8 });
    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'xalt',
      source: 'trigger',
      title: 'quota blocked',
      proposedSteps: [{ kind: 'post_tweet', payload: { text: 'blocked' } }],
    });

    expect(out.status).toBe('rejected');
    expect(String(out.reason).toLowerCase()).toContain('quota');
    expect(db.state.missions).toHaveLength(0);
  });
});
