export type TriggerOutcome = {
  fired: boolean;
  name: string;
  proposal?: {
    agentId: string;
    title: string;
    rationale?: string;
    proposedSteps: Array<{ kind: string; payload?: Record<string, unknown> }>;
  };
};

export async function evaluateTriggers(db: any, limit = 20): Promise<TriggerOutcome[]> {
  const outcomes: TriggerOutcome[] = [];

  // Trigger 1: viral tweet -> analyze
  const viral = await db.findViralTweetCandidates(limit);
  for (const item of viral) {
    outcomes.push({
      fired: true,
      name: 'viral_tweet_auto_analyze',
      proposal: {
        agentId: 'sage',
        title: `Analyze viral tweet ${item.tweet_id}`,
        rationale: `Tweet crossed threshold ${item.views} views`,
        proposedSteps: [{ kind: 'analyze', payload: { tweetId: item.tweet_id, metric: 'engagement' } }],
      },
    });
  }

  // Trigger 2: failed mission -> diagnosis
  // findRecentFailedMissions already drops "resolutions" (duplicate/cancelled/probe)
  // and de-duplicates open postmortems, so this fires once per real incident.
  const failed = await db.findRecentFailedMissions(limit);
  for (const item of failed) {
    outcomes.push({
      fired: true,
      name: 'mission_failed_auto_diagnose',
      proposal: {
        agentId: 'observer',
        title: `Diagnose mission failure ${item.mission_id}`,
        rationale: item.reason ?? 'Mission failed',
        proposedSteps: [
          {
            kind: 'analyze',
            payload: {
              missionId: item.mission_id,
              mode: 'postmortem',
              failureClass: item.failure_class ?? 'transient',
              failingStepKind: item.failing_step_kind ?? null,
              error: item.reason ?? null,
            },
          },
        ],
      },
    });
  }

  return outcomes;
}
