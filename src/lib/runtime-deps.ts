import { githubAdapter } from './github.js';

export const runtimeDeps = {
  llm: {
    async complete(prompt: string): Promise<string> {
      // placeholder adapter: replace with OpenClaw session/sub-agent call or model SDK
      return `[mock-llm] ${prompt.slice(0, 220)}`;
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
