export async function runHeartbeat(deps: {
  evaluateTriggers: () => Promise<unknown>;
  processReactionQueue: () => Promise<unknown>;
  promoteInsights: () => Promise<unknown>;
  learnFromOutcomes: () => Promise<unknown>;
  recoverStaleSteps: () => Promise<unknown>;
  recoverStaleRoundtables: () => Promise<unknown>;
  logActionRun: (row: { actor: string; action: string; success: boolean; result: unknown }) => Promise<void>;
}) {
  const started = Date.now();
  const result: Record<string, unknown> = {};
  let success = true;

  const safe = async (k: string, fn: () => Promise<unknown>) => {
    try {
      result[k] = await fn();
    } catch (e) {
      success = false;
      result[k] = { error: e instanceof Error ? e.message : String(e) };
    }
  };

  await safe('triggers', deps.evaluateTriggers);
  await safe('reactions', deps.processReactionQueue);
  await safe('learning.promoteInsights', deps.promoteInsights);
  await safe('learning.outcomes', deps.learnFromOutcomes);
  await safe('recovery.staleSteps', deps.recoverStaleSteps);
  await safe('recovery.roundtables', deps.recoverStaleRoundtables);

  await deps.logActionRun({
    actor: 'heartbeat',
    action: 'ops.heartbeat',
    success,
    result: { durationMs: Date.now() - started, ...result },
  });

  return { success, result };
}
