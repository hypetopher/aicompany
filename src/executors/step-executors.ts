export async function executeStepByKind(step: {
  id: number;
  kind: string;
  payload: Record<string, unknown>;
}, deps: {
  db: any;
  llm: { complete: (prompt: string) => Promise<string> };
  social: { postTweet: (text: string) => Promise<{ tweetId: string }> };
  github?: { publishPullRequest: (req: any) => Promise<{ url: string; number: number; branch: string; files: string[] }> };
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
    case 'publish_skill':
      return execPublishSkill(step, deps);
    default:
      throw new Error(`Unknown step kind: ${step.kind}`);
  }
}

/**
 * Ship a skill artifact as a pull request.
 *
 * Publishing is the step kind the pipeline was missing: until now every
 * proposal could only analyse or draft, so no proposal could ever produce a
 * shipped artifact. This step is deliberately branch+PR only (never a push to
 * a default branch) and is gated by the `publish_gate` policy at intake, so
 * an unattended proposal cannot publish to an arbitrary repo.
 */
async function execPublishSkill(step: any, deps: any) {
  if (!deps.github?.publishPullRequest) {
    throw new Error('publish_skill: github adapter is not configured');
  }
  const repo = String(step.payload.repo ?? '');
  const title = String(step.payload.title ?? 'Publish skill');
  const body = String(step.payload.body ?? '');
  const files = Array.isArray(step.payload.files) ? step.payload.files : [];

  const out = await deps.github.publishPullRequest({ repo, files, title, body });

  await deps.db.insertEvent({
    agent_id: 'scout',
    kind: 'skill.published',
    title: `Published ${repo}`,
    summary: out.url,
    payload: { repo, url: out.url, number: out.number, branch: out.branch, files: out.files },
  });
  return { kind: step.kind, url: out.url, number: out.number, files: out.files };
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
  // Producer writes payload.topic, executor used to read only payload.brief,
  // so ~99.9% of articles were the hardcoded default sentence.
  const brief = String(step.payload.brief ?? step.payload.topic ?? 'Write a short ops update.');
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
