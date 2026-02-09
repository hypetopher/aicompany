export async function executeStepByKind(step: {
  id: number;
  kind: string;
  payload: Record<string, unknown>;
}, deps: {
  db: any;
  llm: { complete: (prompt: string) => Promise<string> };
  social: { postTweet: (text: string) => Promise<{ tweetId: string }> };
}) {
  switch (step.kind) {
    case 'draft_tweet':
      return execDraftTweet(step, deps);
    case 'analyze':
      return execAnalyze(step, deps);
    case 'write_content':
      return execWriteContent(step, deps);
    case 'post_tweet':
      return execPostTweet(step, deps);
    default:
      throw new Error(`Unknown step kind: ${step.kind}`);
  }
}

async function execDraftTweet(step: any, deps: any) {
  const topic = String(step.payload.topic ?? 'AI company update');
  const text = await deps.llm.complete(`Write one concise tweet about: ${topic}`);
  await deps.db.saveTweetDraft({ stepId: step.id, text });
  return { kind: step.kind, draft: text };
}

async function execAnalyze(step: any, deps: any) {
  const target = JSON.stringify(step.payload);
  const report = await deps.llm.complete(`Analyze this target and return 5 bullet insights: ${target}`);
  await deps.db.saveInsight({ stepId: step.id, report });
  return { kind: step.kind, report };
}

async function execWriteContent(step: any, deps: any) {
  const brief = String(step.payload.brief ?? 'Write a short ops update.');
  const article = await deps.llm.complete(`Write a structured post (title + 5 sections): ${brief}`);
  await deps.db.saveContentDraft({ stepId: step.id, body: article });
  return { kind: step.kind };
}

async function execPostTweet(step: any, deps: any) {
  const text = String(step.payload.text ?? '');
  if (!text) throw new Error('post_tweet payload.text is required');
  const out = await deps.social.postTweet(text);
  await deps.db.savePostedTweet({ stepId: step.id, text, tweetId: out.tweetId });
  await deps.db.insertEvent({
    agent_id: 'xalt',
    kind: 'tweet.posted',
    title: 'Tweet posted',
    summary: out.tweetId,
    payload: { tweetId: out.tweetId, text },
  });
  return { kind: step.kind, tweetId: out.tweetId };
}
