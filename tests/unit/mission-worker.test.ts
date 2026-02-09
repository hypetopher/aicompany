import { describe, it, expect } from 'vitest';
import { runWorkerOnce } from '../../src/workers/mission-worker.js';

function mkDb(step: any | null) {
  const state = {
    succeeded: [] as number[],
    failed: [] as Array<{ id: number; msg: string }>,
    requeued: [] as Array<{ id: number; msg: string; runAfter: string }>,
    events: [] as any[],
  };

  return {
    state,
    async claimOneStep() { return step; },
    async markStepSucceeded(id: number) { state.succeeded.push(id); },
    async markStepFailed(id: number, msg: string) { state.failed.push({ id, msg }); },
    async requeueStep(id: number, msg: string, runAfter: string) { state.requeued.push({ id, msg, runAfter }); },
    async insertEvent(evt: any) { state.events.push(evt); },
    async saveInsight() { /* executor hook */ },
    async saveTweetDraft() { /* executor hook */ },
    async saveContentDraft() { /* executor hook */ },
    async savePostedTweet() { /* executor hook */ },
  };
}

describe('mission-worker', () => {
  it('returns claimed=false when no step is available', async () => {
    const db = mkDb(null);
    const deps = { llm: { complete: async () => 'x' }, social: { postTweet: async () => ({ tweetId: 't1' }) } };
    const out = await runWorkerOnce(db as any, 'w1', deps as any);
    expect(out.claimed).toBe(false);
  });

  it('marks step succeeded on successful execution', async () => {
    const db = mkDb({ id: 1, mission_id: 9, kind: 'analyze', payload: { target: 'x' }, attempts: 1 });
    const deps = { llm: { complete: async () => 'analysis' }, social: { postTweet: async () => ({ tweetId: 't1' }) } };

    const out = await runWorkerOnce(db as any, 'w1', deps as any);

    expect(out.status).toBe('succeeded');
    expect(db.state.succeeded).toContain(1);
    expect(db.state.events.some((e) => e.kind === 'step.succeeded')).toBe(true);
  });

  it('requeues when execution fails under dead-letter threshold', async () => {
    const db = mkDb({ id: 2, mission_id: 9, kind: 'post_tweet', payload: {}, attempts: 2 });
    const deps = { llm: { complete: async () => 'x' }, social: { postTweet: async () => { throw new Error('boom'); } } };

    const out = await runWorkerOnce(db as any, 'w1', deps as any);

    expect(out.status).toBe('failed');
    expect(db.state.requeued.length).toBe(1);
    expect(db.state.failed.length).toBe(0);
  });

  it('dead-letters when attempts exceed threshold', async () => {
    const db = mkDb({ id: 3, mission_id: 9, kind: 'post_tweet', payload: {}, attempts: 7 });
    const deps = { llm: { complete: async () => 'x' }, social: { postTweet: async () => { throw new Error('fatal'); } } };

    const out = await runWorkerOnce(db as any, 'w1', deps as any);

    expect(out.status).toBe('failed');
    expect(db.state.failed.length).toBe(1);
    expect(db.state.failed[0].msg).toContain('[dead-letter]');
  });
});
