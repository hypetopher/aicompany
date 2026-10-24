/**
 * Real LLM adapter for the mission worker.
 *
 * Why this exists: the worker used to call a placeholder that returned
 * `[mock-llm] ${prompt.slice(0, 220)}`. Every `analyze` / `draft_tweet` /
 * `write_content` step therefore "succeeded" while producing garbage, and
 * `tweet.posted` lifetime stayed at 0 because the publish rail never had
 * anything real to publish.
 *
 * How it gets a credential: OpenClaw already holds working provider
 * credentials in its own auth-profile store
 * (`~/.openclaw/agents/main/agent/auth-profiles.json`). We read the
 * `minimax-portal:default` OAuth access token from there at call time and
 * talk to the Anthropic-compatible Messages API. Nothing is copied into
 * this repo's `.env`, so there is no second copy of a secret to rotate.
 *
 * If the profile or the network is unavailable, we fall back to the old
 * mock behaviour rather than throwing, so a credential problem degrades the
 * output quality instead of stalling the queue.
 */
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

type AnthropicContentBlock = { type?: string; text?: string };

type AnthropicResponse = {
  content?: AnthropicContentBlock[];
  error?: { message?: string };
};

const AUTH_PROFILES = join(
  homedir(),
  '.openclaw',
  'agents',
  'main',
  'agent',
  'auth-profiles.json',
);

const BASE_URL =
  process.env.LLM_BASE_URL ?? 'https://api.minimaxi.com/anthropic';
const MODEL = process.env.LLM_MODEL ?? 'MiniMax-M2.7-highspeed';
const MAX_TOKENS = Number(process.env.LLM_MAX_TOKENS ?? 1200);
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 90_000);

let cachedToken: { token: string; expiresAt: number } | null = null;

async function loadAccessToken(): Promise<string | null> {
  // Refresh a little before expiry so a long batch does not fail mid-run.
  if (cachedToken && cachedToken.expiresAt - Date.now() > 120_000) {
    return cachedToken.token;
  }
  let raw: string;
  try {
    raw = await readFile(AUTH_PROFILES, 'utf8');
  } catch {
    return null;
  }
  try {
    const store = JSON.parse(raw) as {
      profiles?: Record<string, { type?: string; access?: string; expires?: number }>;
    };
    const profile = store.profiles?.['minimax-portal:default'];
    if (!profile?.access) return null;
    cachedToken = {
      token: profile.access,
      expiresAt: Number(profile.expires ?? 0),
    };
    return profile.access;
  } catch {
    return null;
  }
}

export type LlmResult = {
  text: string;
  source: 'llm' | 'mock';
  model?: string;
  error?: string;
};

/**
 * Single-turn completion against the Anthropic-compatible Messages API.
 * Returns the concatenated text blocks (thinking blocks are skipped).
 */
export async function complete(prompt: string): Promise<LlmResult> {
  const token = await loadAccessToken();
  if (!token) {
    return {
      text: `[mock-llm] ${prompt.slice(0, 220)}`,
      source: 'mock',
      error: 'no minimax-portal access token in auth-profiles.json',
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return {
        text: `[mock-llm] ${prompt.slice(0, 220)}`,
        source: 'mock',
        error: `llm http ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as AnthropicResponse;
    const text = (data.content ?? [])
      .filter((b) => b.type === 'text' && typeof b.text === 'string')
      .map((b) => b.text as string)
      .join('\n')
      .trim();

    if (!text) {
      return {
        text: `[mock-llm] ${prompt.slice(0, 220)}`,
        source: 'mock',
        model: MODEL,
        error: 'llm returned no text blocks',
      };
    }
    return { text, source: 'llm', model: MODEL };
  } catch (err) {
    return {
      text: `[mock-llm] ${prompt.slice(0, 220)}`,
      source: 'mock',
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}
