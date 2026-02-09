import { updateAffinityFromRecentEvents } from '../affinity/update-affinity.js';

updateAffinityFromRecentEvents(300)
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
