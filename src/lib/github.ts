import { execFile } from 'node:child_process';

/**
 * Minimal GitHub adapter built on the `gh` CLI.
 *
 * Why the CLI and not the REST API: the worker already runs on a host with a
 * working `gh` auth session, so there is no second credential to rotate and
 * no token to leak into logs. Everything goes through argv (never a shell
 * string), so paths with spaces or quotes cannot turn into shell injection.
 */

export type PublishFile = { path: string; content: string };

export type PublishRequest = {
  repo: string;
  files: PublishFile[];
  title: string;
  body?: string;
  branch?: string;
  base?: string;
};

export type PublishResult = {
  url: string;
  number: number;
  branch: string;
  files: string[];
};

function gh(args: string[], input?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = execFile('gh', args, { maxBuffer: 32 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`gh ${args[0]} failed: ${String(stderr || err.message).trim().slice(0, 400)}`));
        return;
      }
      resolve(stdout);
    });
    if (input !== undefined) {
      child.stdin?.end(input);
    }
  });
}

async function ghJson<T = any>(args: string[]): Promise<T> {
  const out = await gh(args);
  return JSON.parse(out) as T;
}

/**
 * Commit one or more files on a fresh branch and open a pull request.
 *
 * Publishing is deliberately branch+PR only: it never force-pushes to a
 * default branch, so a bad skill can be closed or reverted without a revert
 * commit on the main history.
 */
export async function publishPullRequest(req: PublishRequest): Promise<PublishResult> {
  if (!req.repo || !/^[\w.-]+\/[\w.-]+$/.test(req.repo)) {
    throw new Error(`publish_skill: invalid repo "${req.repo}"`);
  }
  const files = (req.files ?? []).filter((f) => f.path && typeof f.content === 'string');
  if (files.length === 0) throw new Error('publish_skill: no files to publish');
  if (files.length > 20) throw new Error('publish_skill: too many files (max 20)');

  const base = req.base ?? 'main';
  const branch =
    req.branch ??
    `skill-publish/${Date.now().toString(36)}-${files[0].path.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`;

  const baseRef = await ghJson<{ object?: { sha?: string } }>([
    'api',
    `repos/${req.repo}/git/ref/heads/${base}`,
  ]);
  const baseSha = baseRef?.object?.sha;
  if (!baseSha) throw new Error(`publish_skill: cannot resolve base ${base}`);

  await gh(['api', `repos/${req.repo}/git/refs`, '--method', 'POST', '-f', `ref=refs/heads/${branch}`, '-f', `sha=${baseSha}`]);

  const committed: string[] = [];
  for (const file of files) {
    // Updating an existing file requires the current blob sha, otherwise the
    // API rejects the write with "sha wasn't supplied" (HTTP 422).
    const args = [
      'api',
      `repos/${req.repo}/contents/${file.path}`,
      '--method',
      'PUT',
      '-f',
      `message=publish: ${file.path}`,
      '-f',
      `content=${Buffer.from(file.content, 'utf8').toString('base64')}`,
      '-f',
      `branch=${branch}`,
    ];
    const existing = await ghJson<{ sha?: string } | null>([
      'api',
      `repos/${req.repo}/contents/${file.path}?ref=${base}`,
    ]).catch(() => null);
    if (existing?.sha) args.push('-f', `sha=${existing.sha}`);

    await gh(args);
    committed.push(file.path);
  }

  const pr = await ghJson<{ number: number; html_url: string }>([
    'api',
    `repos/${req.repo}/pulls`,
    '--method',
    'POST',
    '-f',
    `title=${req.title}`,
    '-f',
    `body=${req.body ?? ''}`,
    '-f',
    `head=${branch}`,
    '-f',
    `base=${base}`,
  ]);

  return { url: pr.html_url, number: pr.number, branch, files: committed };
}

export const githubAdapter = { publishPullRequest };
