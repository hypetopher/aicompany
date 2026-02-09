# Frontend API contract (Stage)

These functions back the frontend stage views and mirror the reference site structure.

## Endpoints to expose in Next.js
- `GET /api/stage/summary` -> `getStageSummary()`
- `GET /api/stage/agents` -> `getStageAgents()`
- `GET /api/stage/events?limit=100&before=<id>` -> `getStageEvents(limit,before)`
- `GET /api/stage/tasks?limit=100` -> `getStageTasks(limit)`

## Shapes
- summary: mission/proposal/deploy/insight/event counters + timing
- agents: role cards (id, role, model, affect, statusLine, lastEventAt)
- events: live feed rows (timestamp, actor, type, title, summary, relation)
- tasks: mission rows + per-status progress counts

## Frontend behavior
- Poll summary/events every 20-30s
- Poll tasks every 30-60s
- Keep local event cursor for pagination
