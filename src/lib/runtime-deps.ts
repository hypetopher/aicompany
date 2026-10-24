import { githubAdapter } from './github.js';
import { complete as llmComplete } from './llm-adapter.js';

export const runtimeDeps = {
  llm: {
    /**
     * Real completion via the Anthropic-compatible Messages API, using the
     * credential OpenClaw already holds. Falls back to the old mock when no
     * credential is available, so a credential outage degrades output quality
     * instead of stalling the queue.
     */
    async complete(prompt: string): Promise<string> {
      const out = await llmComplete(prompt);
      if (out.source === 'mock' && out.error) {
        console.warn(`[llm] falling back to mock: ${out.error}`);
      }
      return out.text;
    },
  },
  social: {
    async postTweet(text: string): Promise<{ tweetId: string }> {
      // placeholder adapter: replace with your posting integration
      return { tweetId: `mock_${Date.now()}` };
    },
  },
  /**
   * Real adapter: publishes through the `gh` CLI against the worker's
   * existing auth session. Publishing stays branch+PR only.
   */
  github: githubAdapter,
};
