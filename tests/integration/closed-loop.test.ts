import { describe, it, expect } from 'vitest';
import { createProposalAndMaybeAutoApprove } from '../../src/services/proposal-service.js';

function makeFakeDb(opts?: { tweetCount?: number; autoApprove?: boolean }) {
  let proposalId = 100;
  let missionId = 500;
  const state = {
    proposals: [] as any[],
    missions: [] as any[],
    events: [] as any[],
    steps: [] as any[],
  };

  return {
    state,
    async getPolicy(key: string) {
      if (key === 'x_daily_quota') return { enabled: true, limit: 2 };
      return {};
    },
    async countTodayPostedTweets() {
      return opts?.tweetCount ?? 0;
    },
    async insertProposal(row: any) {
      const p = { id: ++proposalId, ...row };
      state.proposals.push(p);
      return { id: p.id };
    },
    async insertEvent(row: any) {
      state.events.push(row);
    },
    async createMissionFromProposal(pId: number, createdBy: string, title: string, proposedSteps: any[]) {
      const m = { id: ++missionId, proposal_id: pId, createdBy, title };
      state.missions.push(m);
      state.steps.push(...proposedSteps.map((s) => ({ mission_id: m.id, ...s })));
      return { id: m.id };
    },
  };
}

describe('integration: closed loop proposal intake', () => {
  it('auto-approves and creates mission+steps when gate passes', async () => {
    const db = makeFakeDb({ tweetCount: 0, autoApprove: true });

    const res = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'xalt',
      source: 'api',
      title: 'post update',
      proposedSteps: [{ kind: 'post_tweet', payload: { text: 'hello' } }],
    });

    expect(res.status).toBe('accepted');
    expect(res.missionId).toBeTruthy();
    expect(db.state.proposals.length).toBe(1);
    expect(db.state.missions.length).toBe(1);
    expect(db.state.steps.length).toBe(1);
  });

  it('rejects at gate when quota reached', async () => {
    const db = makeFakeDb({ tweetCount: 2 });

    const res = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'xalt',
      source: 'trigger',
      title: 'post blocked',
      proposedSteps: [{ kind: 'post_tweet', payload: { text: 'blocked' } }],
    });

    expect(res.status).toBe('rejected');
    expect(res.reason).toMatch(/quota/i);
    expect(db.state.missions.length).toBe(0);
    expect(db.state.steps.length).toBe(0);
  });
});
