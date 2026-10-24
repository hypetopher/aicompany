import { runWorkerOnce } from '../workers/mission-worker.js';
import { db } from '../lib/db.js';

/**
 * Drain several steps per tick. The single-step worker could not keep up with
 * proposal inflow, so the backlog grew every cycle.
 */
const BATCH = Number(process.env.WORKER_BATCH ?? 20);

async function main() {
  const workerId = `worker-batch-${process.pid}`;
  const results: any[] = [];
  for (let i = 0; i < BATCH; i++) {
    const r = await runWorkerOnce(db, workerId);
    results.push(r);
    if (!r.claimed) break;
  }
  const succeeded = results.filter((r) => r.status === 'succeeded').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  console.log(
    JSON.stringify(
      { processed: results.filter((r) => r.claimed).length, succeeded, failed, drained: !results.at(-1)?.claimed },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
