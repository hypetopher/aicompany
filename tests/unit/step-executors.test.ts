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

  it('executes publish_skill through the github adapter and emits an event', async () => {
    const d = mkDeps();
    let received: any = null;
    const deps = {
      ...d,
      github: {
        async publishPullRequest(req: any) {
          received = req;
          return { url: 'https://github.com/hypetopher/aicompany/pull/1', number: 1, branch: 'skill-publish/x', files: ['SKILL.md'] };
        },
      },
    } as any;

    const out = await executeStepByKind(
      { id: 6, kind: 'publish_skill', payload: { repo: 'hypetopher/aicompany', title: 'Ship skill', files: [{ path: 'SKILL.md', content: '# hi' }] } },
      deps,
    );

    expect(out.kind).toBe('publish_skill');
    expect(received.repo).toBe('hypetopher/aicompany');
    expect(received.files[0].path).toBe('SKILL.md');
    expect(d.state.events).toBe(1);
  });

  it('fails publish_skill when no github adapter is configured', async () => {
    const d = mkDeps();
    await expect(
      executeStepByKind({ id: 7, kind: 'publish_skill', payload: { repo: 'x/y', files: [{ path: 'SKILL.md', content: 'x' }] } }, d as any),
    ).rejects.toThrow(/github adapter/);
  });

  it('throws on unknown kind', async () => {
    const d = mkDeps();
    await expect(executeStepByKind({ id: 5, kind: 'unknown', payload: {} }, d as any)).rejects.toThrow(/Unknown step kind/);
  });
});
