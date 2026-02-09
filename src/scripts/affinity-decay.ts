import { runAffinityDecay } from '../affinity/decay-affinity.js';

const pct = Number(process.argv[2] ?? '0.02');
runAffinityDecay(pct)
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
