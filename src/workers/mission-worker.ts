export type ClaimedStep = {
  id: number;
  mission_id: number;
  kind: string;
  payload: Record<string, unknown>;
  attempts: number;
};

/**
 * Use a single SQL statement with FOR UPDATE SKIP LOCKED for safe claiming.
 */
export const CLAIM_SQL = `
with pick as (
  select id
  from ops_mission_steps
  where status = 'queued'
    and run_after <= now()
  order by id asc
  for update skip locked
  limit 1
)
update ops_mission_steps s
set status = 'running',
    attempts = s.attempts + 1,
    started_at = now(),
    updated_at = now(),
    worker_id = $1
from pick
where s.id = pick.id
returning s.id, s.mission_id, s.kind, s.payload, s.attempts;
`;

import { executeStepByKind } from '../executors/step-executors.js';
import { runtimeDeps } from '../lib/runtime-deps.js';
import { computeNextRunAfter, shouldDeadLetter } from './retry-policy.js';

export async function runWorkerOnce(db: any, workerId: string) {
  const step: ClaimedStep | null = await db.claimOneStep(workerId);
  if (!step) return { claimed: false };

  try {
    const result = await executeStepByKind(step, { db, ...runtimeDeps });
    await db.markStepSucceeded(step.id);
    await db.insertEvent({
      kind: 'step.succeeded',
      title: `Step ${step.id} succeeded`,
      step_id: step.id,
      mission_id: step.mission_id,
      payload: { kind: step.kind, result },
    });
    return { claimed: true, stepId: step.id, status: 'succeeded' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const attempts = Number(step.attempts ?? 1);

    if (shouldDeadLetter(attempts)) {
      await db.markStepFailed(step.id, `[dead-letter] ${msg}`);
    } else {
      await db.requeueStep(step.id, msg, computeNextRunAfter(attempts));
    }

    await db.insertEvent({
      kind: 'step.failed',
      title: `Step ${step.id} failed`,
      step_id: step.id,
      mission_id: step.mission_id,
      summary: msg,
      payload: { kind: step.kind, attempts },
    });
    return { claimed: true, stepId: step.id, status: 'failed', error: msg };
  }
}
