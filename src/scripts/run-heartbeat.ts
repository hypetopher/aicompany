import { runHeartbeat } from '../heartbeat/run-heartbeat.js';
import { db } from '../lib/db.js';

const noop = async () => ({ ok: true });

runHeartbeat({
  evaluateTriggers: noop,
  processReactionQueue: noop,
  promoteInsights: noop,
  learnFromOutcomes: noop,
  recoverStaleSteps: noop,
  recoverStaleRoundtables: noop,
  logActionRun: db.logActionRun,
})
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
