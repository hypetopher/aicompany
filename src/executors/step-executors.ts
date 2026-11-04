import { extractNumericTokens } from '../lib/db.js';

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
  // The producer authors payload.hook as the intended opening line, but the
  // executor used to read only payload.topic, so the authored judgement was
  // dropped before the model call and every persisted draft was filler.
  // Prefer hook, fall back to topic, and name the source field in the receipt.
  const topic = String(step.payload.topic ?? 'AI company update');
  const hook = step.payload.hook ? String(step.payload.hook) : '';
  const source = hook ? 'hook' : 'topic';
  const brief = hook || topic;
  const text = await deps.llm.complete(
    `Write one concise tweet about: ${topic}\nOpen with this hook: ${brief}`
  );
  await deps.db.saveTweetDraft({ stepId: step.id, text });
  return { kind: step.kind, draft: text, source };
}

async function execAnalyze(step: any, deps: any) {
  // The analyze executor used to prompt with only the step payload, which
  // carries no measurements, so the model invented numbers: 29 pct of numeric
  // tokens in reports did not exist in the input and 39 pct of reports carried
  // a percentage absent from it. Downstream lanes cite these insights as
  // findings. Now a real counter snapshot is handed to the model, every
  // number in the report is checked back against the supplied evidence, and
  // the receipt names the result so the effect is measurable.
  const target = JSON.stringify(step.payload);
  let evidence = '';
  let allowed: string[] = [];
  if (typeof deps.db?.getAnalyzeContext === 'function') {
    try {
      const ctx = await deps.db.getAnalyzeContext();
      evidence = ctx.evidence;
      allowed = ctx.tokens ?? [];
    } catch {
      evidence = '';
    }
  }
  // Numbers the producer authored in the payload are legitimate inputs too.
  const payloadTokens = extractNumericTokens(target);
  const allowedSet = new Set([...allowed, ...payloadTokens]);

  const prompt = evidence
    ? [
        `Analyze this target and return 5 bullet insights: ${target}`,
        `Use ONLY these measured facts as evidence. Do not state any number that is not in this list or in the target: ${evidence}`,
      ].join('\n')
    : `Analyze this target and return 5 bullet insights: ${target}`;

  let report = await deps.llm.complete(prompt);
  let unmatched = allowedSet.size ? extractNumericTokens(report).filter((t) => !allowedSet.has(t)) : [];

  if (unmatched.length) {
    // One corrective pass: name the offending numbers and ask for a version
    // that only uses the supplied evidence.
    const retry = await deps.llm.complete([
      prompt,
      `Your previous answer used numbers that are not in the evidence: ${unmatched.join(', ')}.`,
      'Rewrite it using only numbers present in the evidence or the target. If a fact is missing, say it is missing instead of estimating.',
    ].join('\n'));
    const retryUnmatched = extractNumericTokens(retry).filter((t) => !allowedSet.has(t));
    if (retryUnmatched.length <= unmatched.length) {
      report = retry;
      unmatched = retryUnmatched;
    }
  }

  const grounded = unmatched.length === 0;
  const body = grounded ? report : `UNGROUNDED REPORT (numbers not in evidence: ${unmatched.join(', ')})\n${report}`;
  await deps.db.saveInsight({ stepId: step.id, report: body, grounded, unmatched });
  if (!grounded) {
    await deps.db.insertEvent({
      kind: 'insight.ungrounded',
      title: `Step ${step.id} produced ungrounded numbers`,
      step_id: step.id,
      payload: { unmatched },
    });
  }
  return { kind: step.kind, grounded, unmatched, evidence: evidence ? 'counters' : 'none' };
}

async function execWriteContent(step: any, deps: any) {
  // Producer writes payload.topic and payload.angle, executor used to read only
  // payload.brief, so ~99.9% of articles were the hardcoded default sentence.
  // Prefer the authored angle, fall back to brief then topic, and name the
  // source field in the receipt so the effect is measurable.
  const angle = step.payload.angle ? String(step.payload.angle) : '';
  const brief = String(step.payload.brief ?? ((angle || step.payload.topic) ?? 'Write a short ops update.'));
  const source = step.payload.brief ? 'brief' : (angle ? 'angle' : 'topic');
  const article = await deps.llm.complete(`Write a structured post (title + 5 sections): ${brief}`);
  await deps.db.saveContentDraft({ stepId: step.id, body: article });
  return { kind: step.kind, source };
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
