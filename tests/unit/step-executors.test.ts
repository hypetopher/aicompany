import { describe, it, expect } from 'vitest';
import { executeStepByKind } from '../../src/executors/step-executors.js';

function mkDeps() {
  const state = { drafts: 0, insights: 0, content: 0, posted: 0, events: 0 };
  return {
    state,
    db: {
      async saveTweetDraft() { state.drafts++; },
      async saveInsight() { state.insights++; },
      async saveContentDraft() { state.content++; },
      async savePostedTweet() { state.posted++; },
      async insertEvent() { state.events++; },
    },
    llm: { async complete(prompt: string) { return `ok:${prompt.slice(0,10)}`; } },
    social: { async postTweet() { return { tweetId: 'tweet-1' }; } },
  };
}

describe('step executors', () => {
  it('executes draft_tweet', async () => {
    const d = mkDeps();
    const out = await executeStepByKind({ id: 1, kind: 'draft_tweet', payload: { topic: 'AI' } }, d as any);
    expect(out.kind).toBe('draft_tweet');
    expect(d.state.drafts).toBe(1);
  });

  it('executes analyze', async () => {
    const d = mkDeps();
    const out = await executeStepByKind({ id: 2, kind: 'analyze', payload: { target: 'x' } }, d as any);
    expect(out.kind).toBe('analyze');
    expect(d.state.insights).toBe(1);
  });

  it('executes write_content', async () => {
    const d = mkDeps();
    const out = await executeStepByKind({ id: 3, kind: 'write_content', payload: { brief: 'b' } }, d as any);
    expect(out.kind).toBe('write_content');
    expect(d.state.content).toBe(1);
  });

  it('executes post_tweet and emits event', async () => {
    const d = mkDeps();
    const out = await executeStepByKind({ id: 4, kind: 'post_tweet', payload: { text: 'hello' } }, d as any);
    expect(out.kind).toBe('post_tweet');
    expect(d.state.posted).toBe(1);
    expect(d.state.events).toBe(1);
  });

  it('throws on unknown kind', async () => {
    const d = mkDeps();
    await expect(executeStepByKind({ id: 5, kind: 'unknown', payload: {} }, d as any)).rejects.toThrow(/Unknown step kind/);
  });
});
