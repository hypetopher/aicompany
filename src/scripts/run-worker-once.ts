import { runWorkerOnce } from '../workers/mission-worker.js';
import { db } from '../lib/db.js';

const workerId = `worker-${process.pid}`;
runWorkerOnce(db, workerId)
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
