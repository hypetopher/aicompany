import { getStageSummary, getStageAgents, getStageEvents, getStageTasks } from '../api/stage.js';

(async () => {
  const [summary, agents, events, tasks] = await Promise.all([
    getStageSummary(),
    getStageAgents(),
    getStageEvents(30),
    getStageTasks(30),
  ]);

  console.log(JSON.stringify({ summary, agents, events, tasks }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
