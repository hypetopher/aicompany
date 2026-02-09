# Frontend reference notes (from https://www.voxyz.space/stage)

## Key UI modules to mirror
- Header with nav + auth action
- Stage status bar: next tick countdown, live marker, event count, last update time
- Multi-view tabs: `Live Feed`, `Tasks`, `Social`
- Agent strip/cards (role, model, current pulse, affect)
- Mission card + timeline snippet
- Event feed with grouped pulses and directionality (`A -> B`)

## Suggested backend->frontend contracts
- `GET /api/stage/summary`
  - counters: missions/proposals/deploys/insights
  - nextTickAt, lastEventAt
- `GET /api/stage/agents`
  - id, name, role, model, affect, statusLine, lastTalkedTo
- `GET /api/stage/events?cursor=`
  - timestamp, actor, type(pulse|dialog|event), title, summary, relation
- `GET /api/stage/tasks`
  - mission title/status, step progress, updatedAt

## Mapping from DB
- `ops_agent_events` -> live feed rows
- `ops_missions` + `ops_mission_steps` -> tasks view
- `ops_action_runs` -> reliability overlays / admin diagnostics

## UX behavior
- Poll every 20-30s (or SSE/websocket)
- Group repetitive pulse events per agent
- Keep latest 200 events hot, older by pagination
