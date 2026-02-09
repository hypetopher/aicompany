# aicompany

Closed-loop AI company runtime inspired by VoxYZ architecture:

`Proposal -> Approval -> Mission -> Steps -> Execution -> Event -> Trigger/Reaction -> Proposal`

## Stack
- OpenClaw (agent orchestration + cron)
- Supabase/Postgres (system of record)
- Node.js workers (deterministic execution)

## What is implemented
- Supabase schema migration for core ops tables
- Proposal intake service (`createProposalAndMaybeAutoApprove`)
- Cap-gates (quota/policy checks at entry)
- Heartbeat runner skeleton
- Worker claim/execute skeleton with idempotent claim query
- OpenClaw cron examples

## Quick start
```bash
npm install
cp .env.example .env
npm run build
```

## Suggested cron in OpenClaw
Use OpenClaw `cron` jobs (preferred) to trigger:
- heartbeat every 5m
- worker loop every 1m
- daily summary once/day

See `docs/openclaw-cron.md`.
