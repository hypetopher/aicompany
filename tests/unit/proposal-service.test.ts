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

  it('does not auto-approve a kind the policy omits', async () => {
    // ops_policy.auto_approve deliberately omits post_tweet.
    const db = mkDb({ postedCount: 0, quotaLimit: 8 });
    db.getPolicy = async (key: string) =>
      key === 'x_daily_quota'
        ? { enabled: true, limit: 8 }
        : { enabled: true, allowed_step_kinds: ['draft_tweet', 'crawl', 'analyze', 'write_content'] };

    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'xalt',
      source: 'api',
      title: 'publish attempt',
      proposedSteps: [{ kind: 'post_tweet', payload: { text: 'should not auto-run' } }],
    });

    expect(out.status).toBe('pending');
    expect(db.state.missions).toHaveLength(0);
  });

  it('rejects publish_skill to a repo outside the publish_gate allowlist', async () => {
    const db = mkDb({ postedCount: 0, quotaLimit: 8 });
    db.getPolicy = async (key: string) => {
      if (key === 'publish_gate') return { enabled: true, allowed_repos: ['hypetopher/aicompany'] };
      return { enabled: true, allowed_step_kinds: ['publish_skill', 'analyze'] };
    };

    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'scout',
      source: 'api',
      title: 'publish to a repo we do not own',
      proposedSteps: [{ kind: 'publish_skill', payload: { repo: 'someone/else', files: [{ path: 'SKILL.md', content: 'x' }] } }],
    });

    expect(out.status).toBe('rejected');
    expect(String(out.reason)).toContain('not allowed');
    expect(db.state.missions).toHaveLength(0);
  });

  it('rejects publish_skill when publish_gate is disabled', async () => {
    const db = mkDb({ postedCount: 0, quotaLimit: 8 });
    db.getPolicy = async (key: string) => {
      if (key === 'publish_gate') return { enabled: false, allowed_repos: ['hypetopher/aicompany'] };
      return { enabled: true, allowed_step_kinds: ['publish_skill'] };
    };

    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'scout',
      source: 'api',
      title: 'publish while disabled',
      proposedSteps: [{ kind: 'publish_skill', payload: { repo: 'hypetopher/aicompany', files: [{ path: 'SKILL.md', content: 'x' }] } }],
    });

    expect(out.status).toBe('rejected');
    expect(db.state.missions).toHaveLength(0);
  });

  it('never auto-approves publish_skill even when the policy allows the kind', async () => {
    const db = mkDb({ postedCount: 0, quotaLimit: 8 });
    db.getPolicy = async (key: string) => {
      if (key === 'publish_gate') return { enabled: true, allowed_repos: ['hypetopher/aicompany'] };
      return { enabled: true, allowed_step_kinds: ['publish_skill', 'analyze'] };
    };

    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'scout',
      source: 'api',
      title: 'publish wants human approval',
      proposedSteps: [{ kind: 'publish_skill', payload: { repo: 'hypetopher/aicompany', files: [{ path: 'SKILL.md', content: 'x' }] } }],
    });

    expect(out.status).toBe('pending');
    expect(db.state.missions).toHaveLength(0);
  });

  it('fails closed when the auto_approve policy cannot be read', async () => {
    const db = mkDb({ postedCount: 0, quotaLimit: 8 });
    db.getPolicy = async (key: string) => {
      if (key === 'x_daily_quota') return { enabled: true, limit: 8 };
      throw new Error('policy read failed');
    };

    const out = await createProposalAndMaybeAutoApprove(db as any, {
      agentId: 'xalt',
      source: 'api',
      title: 'publish attempt during policy outage',
      proposedSteps: [{ kind: 'post_tweet', payload: { text: 'should not auto-run' } }],
    });

    expect(out.status).toBe('pending');
    expect(db.state.missions).toHaveLength(0);
  });
});
