# aicompany

## LANE QUICKSTART (scout / sage / quill / xalt / minion / observer)

**One command files a proposal. Then you are done. Do not read `src/` to do it.**

```bash
cd /home/ax/.openclaw/workspace/aicompany
npm run proposal:test -- <agentId> "<short title>" <stepKind> '<json payload>'
#   agentId  : scout | sage | quill | xalt | minion | observer
#   stepKind : analyze | write_content | draft_tweet | post_tweet | publish_skill
```

Payload (single-quoted JSON):

```json
{"topic":"<one line>","rationale":"<2-4 sentences: what you found and why it matters>",
 "<your_role_field>":"<1-3 sentences>"}
```

`topic` + `rationale` + one role field (`scout_finding`, `sage_hypothesis`,
`quill_draft`, `xalt_citation`, `minion_recommendation`, `observer_note`) is all
that is required. Full contract: [`docs/PROPOSAL_FILING.md`](docs/PROPOSAL_FILING.md).

### Rules that save your cycle

1. **There is no payload-validator module in this repo.** No `evidence-grounding.ts`,
   no `ops-agent.ts`, no `insight_grounding`. Do not grep for them — searching for a
   module that does not exist has killed more cycles than anything else here.
2. **Don't read source to file a proposal.** `src/scripts/create-proposal.ts` is the
   only file worth opening, and only if the command above failed.
3. **One command, one proposal.** After it returns a proposal id, stop. Re-running
   "to verify" is what fills the DB with duplicates.
4. **Keep scratch files out of the repo.** Use `/tmp/<your-agent>/`, not `scripts/`.
5. **Budget: ≤ 12 tool calls per cycle.** Past that you are looping, not working.

Closed-loop AI company runtime - proposal -> mission -> steps -> execution -> verified outcome. Runnable as a Claude Code skill (`ai-company-loop`).

Architecture inspired by VoxYZ:

`Proposal -> Approval -> Mission -> Steps -> Execution -> Event -> Trigger/Reaction -> Proposal`

## Install

```bash
# list the skills in this repo
npx skills add hypetopher/aicompany --list

# install into Claude Code
npx skills add hypetopher/aicompany --skill ai-company-loop        -a claude-code -y
npx skills add hypetopher/aicompany --skill growth-intel          -a claude-code -y
npx skills add hypetopher/aicompany --skill market-research-playbook -a claude-code -y
```

[![skills.sh](https://skills.sh/b/hypetopher/aicompany)](https://skills.sh/hypetopher/aicompany)

All three skills are indexed on [skills.sh](https://skills.sh): search `ai-company-loop`, `growth-intel` or `market-research-playbook`.

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
npm run affinity:decay
```

## Required env
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (optional)

## Notes
- Worker claiming uses `claim_one_step(p_worker_id)` Postgres function (`002_claim_one_step_fn.sql`) for race-safe `FOR UPDATE SKIP LOCKED` behavior.
- Expand step executors in `src/workers/mission-worker.ts` per your step kinds.
