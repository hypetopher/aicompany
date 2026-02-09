# aicompany

Closed-loop AI company runtime inspired by VoxYZ architecture:

`Proposal -> Approval -> Mission -> Steps -> Execution -> Event -> Trigger/Reaction -> Proposal`

## Stack
- OpenClaw (agent orchestration + cron)
- Supabase/Postgres (system of record)
- Node.js workers (deterministic execution)

## Implemented (phase 1 + 2 + 3)
- Supabase schema migration for core ops tables
- Proposal intake service (`createProposalAndMaybeAutoApprove`)
- Cap-gates (quota/policy checks at entry)
- Heartbeat runner with trigger + reaction integration
- Worker claim/execute with retry/backoff and dead-letter threshold
- Step executors: `draft_tweet`, `analyze`, `write_content`, `post_tweet` (adapter stubs)
- Supabase DB adapter wiring
- OpenClaw cron payload examples
- Frontend stage reference notes (from voxyz stage)
- Affinity graph model (`ops_agent_affinities`) + upsert function + stage affinity API

## Quick start
```bash
npm install
cp .env.example .env
npm run build
```

## Commands
```bash
npm run proposal:test
npm run heartbeat:run
npm run worker:once
npm run affinity:update
```

## Required env
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (optional)

## Notes
- Worker claiming uses `claim_one_step(p_worker_id)` Postgres function (`002_claim_one_step_fn.sql`) for race-safe `FOR UPDATE SKIP LOCKED` behavior.
- Expand step executors in `src/workers/mission-worker.ts` per your step kinds.
