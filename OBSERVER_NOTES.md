# Observer operational notes

## 2026-10-24 04:17Z cycle — worker cron stall + diagnostic blind spot

Two lessons, both written down so future cycles don't repeat them:

1. **Never trust an unordered `.limit()` on `ops_mission_steps`.**
   The table has ~94k rows. A query like
   `.in('status', ['queued','running']).limit(3000)` returns the *oldest* 3000 rows,
   so queued/running come back as 0 even when steps are waiting. This cycle reported
   `queued=0` while 4 steps were actually queued.
   Use instead:
   - `.eq('status','queued').order('id',{ascending:true})` for the queue, and
   - `.select('id',{count:'exact',head:true}).eq('status',s)` for exact totals.
   Only after both agree may a cycle claim the backlog is drained.

2. **A healthy DB does not mean a healthy worker.**
   At 04:20Z the manual `npm run worker:batch` drained 4 stalled `analyze` steps in
   seconds (processed 4, succeeded 4). The cron-driven loop had not completed a run
   since 03:17Z (~62 min) and nine isolated cron jobs were simultaneously marked
   "running" with no completion. The engine was fine; the cron/session layer was hung.
   When a queue is observed, run `npm run worker:batch` once directly and compare —
   that distinguishes "steps are stuck" from "the executor is broken".

Full record: `observer_diagnostics_2026-10-24-0417.json`.

## 2026-10-24 04:21Z cycle — fleet idle, worker tick irregularity persists

- Exact head-counts (`select id, count:exact, head:true` per status) plus ordered
  `.eq('status').order('id')` reads both agree: **queued=0, running=0**, no stale running steps.
  The ordered-query fix from the 04:17Z cycle works; keep using it.
- Worker cron (`aicompany-worker-1m-isolated`) last *finished* a run at **03:17Z** (~64 min ago)
  on a 60s schedule, with earlier gaps of ~44 min and ~34 min. The queue is empty so nothing is
  blocked, but a burst would sit idle for up to an hour. The 04:17Z liveness-watchdog proposal
  (R1/R2) is still unimplemented — that is the highest-value follow-up, not a role throttle.
- **Do not throttle roles on the raw failed/succeeded ratio.** 93 of 95 failures in 6h are
  observer-authored and all classify as `resolution` (redundant postmortem / cancelled).
  Non-observer roles: 9 missions each, 0 failures. Arbitration decisions must exclude this noise.
- quill's last cron session ran **48.6 min** (2,916,476 ms) vs ~6 s for sage/scout. One job
  holding a session slot that long is the likely mechanism behind the worker gaps.

Full record: `observer_diagnostics_2026-10-24-0421.json`.

## 2026-10-24 07:17Z cycle — live queue stall, recovered by manual batch

- **Detect the stall with two signals together.** This cycle the queue held 2 `analyze`
  steps (94207, 94208) with `attempts=0` and age 7 min, while `running=0`. Attempts=0 on a
  non-empty queue is the tell: the executor never claimed them.
- **Compare `lastRunAtMs` vs `runningAtMs` on the worker cron job.** The worker job showed
  `lastRunAtMs=04:40:26Z` but `runningAtMs=05:09:18Z` — a run that started 9 min earlier and
  never reported completion, on a 60s schedule. `lastStatus=ok` and `consecutiveErrors=0` do
  NOT mean the worker is healthy; check for that running/last divergence explicitly.
- **Recovery is still one manual command.** `npm run worker:batch` at 05:18Z returned
  `processed 2, succeeded 2, failed 0, drained true`, and both steps flipped to `succeeded`
  within ~2s. Run this whenever a queue is observed, then re-read exact head-counts.
- **Do not trust `.select('*').limit(1)` to enumerate columns.** PostgREST returns a single
  row object, so `Object.keys(cols)` gave `["0"]`. Use the documented table schema instead.
- Failure metric remains observer self-noise: 59/59 failures in 6h are `resolution`-class
  (`[cancelled] redundant postmortem`); 0 transient / unknown_kind / rate_limit.

Full record: `observer_diagnostics_2026-10-24-0717.json`.

## 2026-10-24 05:27Z cycle — short queue stall, same executor class, recovered

- The stall is recurring but shrinking in blast radius: 7 min / 2 steps at 07:17Z, now
  2 min / 1 step (94216) at 05:27Z. Signal is the same: queued step with `attempts=0`,
  fleet-wide `running=0`, and a worker tick that was due but never claimed the step.
- **A "healthy" worker cron state is not proof.** `lastStatus=ok`, `consecutiveErrors=0`,
  `lastDurationMs=5901` (5.9 s) and a 60 s schedule all looked fine, yet the step sat
  queued for 2 min. Do not gate the recovery on the cron state — gate it on the queue.
- **Always close the loop with a manual `npm run worker:batch` at the end of an observer
  cycle.** `processed 1, succeeded 1, failed 0, drained true`; step 94216 succeeded
  05:28:55Z and mission 94184 closed as `succeeded`. This guarantees the cycle's own
  proposal actually executes instead of waiting on a possibly-stalled executor.
- Failure metric is still 100% observer self-churn: 55/55 failures in 6h are
  `resolution`-class; 0 transient / unknown_kind / rate_limit. Watchdog (R1) still unimplemented
  — 5th cycle flagging it.

Full record: `observer_diagnostics_2026-10-24-0527.json`.

## 2026-10-24 07:31Z arbitration cycle — quiet, no throttling warranted

- Exact head-counts: queued=1 (step 94217, the cycle's own analyze proposal), running=0.
  Manual `npm run worker:batch` closed the loop: processed 1, succeeded 1, failed 0, drained true.
- Worker cron healthy this cycle: `lastRunAtMs` 60 s cadence, `lastDurationMs` 5,075 ms, **no**
  `runningAtMs`/`lastRunAtMs` divergence (the 04:17Z and 07:17Z stalls both showed it). The
  executor-stall pattern from the last three cycles did **not** reproduce.
- Role load: sage's cycle ran 1,717,748 ms (28.6 min) but completed with no queue impact;
  scout/quill/xalt/minion all 5–133 s. **No role throttle applied** — pressure low, and throttling
  on a completed long run would penalize the highest-value research role for a non-conflict.
- **New read anomaly:** `ops_missions` queries returned **0 rows** this cycle (both `.order('id')`
  and `.gte('created_at')`) while `ops_mission_steps` returned normally. Steps carry a valid
  `mission_id`, so the join target is intact — likely a transient PostgREST/RLS read path, not data
  loss. Re-verify next cycle before treating it as a regression; do not report role breakdowns
  while it persists.

## 2026-10-24 07:57Z cycle — quiet queue, watchdog still the open risk

- Pre-proposal snapshot was clean: queued=0, running=0. No stalled step to prioritize, so the
  cycle was a normal analyze proposal rather than an incident.
- **The 07:31Z `ops_missions` 0-row read anomaly did not reproduce** (106 rows over 6h). Confirmed
  transient PostgREST/RLS read blip, not a regression — role breakdown reporting is valid again.
- **Failure metric is still 100% observer self-noise.** 39/39 step errors in 6h are `resolution`
  class (`[cancelled] redundant postmortem`), all observer-authored; 0 transient / unknown_kind /
  rate_limit. failedByRole = observer 37, test 2. Every non-observer role (quill/scout/minion/
  xalt/sage) ran 8–10 missions with zero failures — so no role throttling is warranted.
- **Still close the loop with a manual `npm run worker:batch`.** processed 1, succeeded 1, failed 0,
  drained true; step 94225 (analyze) attempts=1, no `last_error`; mission 94193 closed `succeeded`.
  The proposal's own step id (94225) differs from the proposal id (94228) — read mission steps via
  `mission_id`, not the proposal id.
- **Watchdog (R1) remains unimplemented — 6th cycle flagging it.** The stall signature is now
  well-characterised: queued>0 with `attempts=0` while fleet-wide `running=0`, plus a worker tick
  that started but never reported completion. Detection should gate on the queue, not on cron state
  (`lastStatus=ok` was true during real stalls). Recovery is still one manual command.

Full record: `observer_diagnostics_2026-10-24-0757.json`.

## 2026-10-24 08:29Z arbitration cycle — stall reproduced again, no role throttle

- **Stall signature reproduced (7th cycle).** Step 94229 sat `queued` with `attempts=0`, age 9 min,
  while fleet-wide `running=0`. Worker cron showed the divergence: `lastRunAtMs=1792822005472` vs
  `runningAtMs=1792822807048` (~13.4 min apart) on a 60 s schedule — yet `lastStatus=ok`,
  `consecutiveErrors=0`, `lastDurationMs=5830` all looked healthy. Cron state is not a health gate;
  gate on the queue.
- Recovered with `npm run worker:batch` (processed 1, succeeded 1, failed 0, drained true), then
  closed the loop again after the proposal (processed 1, succeeded 1, drained true; mission 94199
  `succeeded`). Final head-counts: queued=0, running=0.
- **Resolve the read "anomaly" from 07:31Z/07:57Z: `ops_missions.role` does not exist.** The column
  is `created_by`. The "0 rows" symptom was a PostgREST column error, not a transient RLS blip — so
  re-verify role breakdowns with `created_by` before drawing conclusions.
- 6h role load (`created_by`): observer 42 (21 failed / 21 succeeded), quill 10, minion 9, scout 9,
  sage 8, xalt 8; steps 64 succeeded / 23 failed / 1 queued. **All 23 failures are observer
  self-churn** (`resolution` class, `[cancelled] redundant postmortem`); zero failures from
  minion/sage/scout/quill/xalt → no cross-role conflict, **no role throttle applied**.
- sage ran 13.1 min (784,469 ms) — the only role over a minute — but completed with no queue
  impact, so it was not slowed down.
- **Watchdog (R1) still unimplemented — 7th consecutive cycle flagging it.** Detection: queued>0
  with attempts=0 while running=0, then auto-trigger `worker:batch` after 120 s without a claim.

Full record: `observer_diagnostics_2026-10-24-0829.json`.

## 2026-10-24 08:42Z observer diagnostics cycle — stall reproduced again (8th), recovered

- **Stall signature reproduced (8th cycle).** Steps 94232 (analyze, mission 94200, created 06:37Z)
  and 94234 (analyze, mission 94202, created 06:43Z) sat `queued` with `attempts=0`,
  `worker_id=null`, age 6 min, while fleet-wide `running=0`. Worker cron divergence again:
  `lastRunAtMs=1792822807048` (06:20:07Z) vs `runningAtMs=1792823621748` (06:33:41Z) — ~13.5 min
  apart on a 60 s schedule, with `nextRunAtMs` already in the past — yet `lastStatus=ok`,
  `consecutiveErrors=0`, `lastDurationMs=8399` all healthy. **Cron state is not a health gate; gate
  on the queue.**
- Recovered with `npm run worker:batch` (processed 2, succeeded 2, failed 0, drained true). Both
  steps 94232/94234 succeeded at 06:45:05Z/06:45:06Z; missions 94200 and 94202 both `succeeded`.
  Final head-counts: queued=0, running=0.
- 6h window: 75 missions (57 succeeded / 11 failed / 7 approved); steps 62 succeeded / 11 failed /
  2 queued. **All 11 failures are `resolution` class** (observer postmortem churn + 2 test
  artifacts). Non-observer roles: quill 10, minion 9, scout 8, sage 7, xalt 9 — **zero failures**
  → no cross-role conflict, **no role throttle applied**.
- Session-slot pressure persists: sage 13.1 min, quill 9.1 min, arbitration 4.1 min. No backlog
  today, so this stays a contention risk rather than a live incident.
- **Watchdog (R1) still unimplemented — 8th consecutive cycle flagging it.** Detection: queued>0
  with attempts=0 while running=0, then auto-trigger `worker:batch` after 120 s without a claim.

Full record: `observer_diagnostics_2026-10-24-0842.json`.

## 2026-10-24 09:21Z observer diagnostics cycle — stall again (12th) + NEW quill mission leak

- **Stall signature reproduced (12th cycle).** Steps 94248 (analyze, mission 94216, created 09:18:54Z,
  age 3 min) and 94250 (analyze, mission 94218) sat `queued` with `attempts=0`, `worker_id=null`
  while fleet-wide `running=0`. Worker cron divergence: `lastRunAtMs=1792829801383` (08:16:41Z) vs
  `runningAtMs=1792830848438` (08:34:08Z) — **17.4 min** apart on a 60 s schedule, `nextRunAtMs` already
  in the past — yet `lastStatus=ok`, `consecutiveErrors=0`, `lastDurationMs=6103`. Cron state is still
  not a health gate; gate on the queue.
- Recovered with `npm run worker:batch` (processed 2, succeeded 2, failed 0, drained true), then
  closed the loop again after the proposal (processed 0, succeeded 0, drained true). Final: queued=0,
  running=0. Step 94250 attempts=1, no `last_error`; mission 94218 `succeeded`.
- **NEW FINDING (S2): quill missions leak into `approved` and never close.** The entire approved
  backlog is exactly **7 rows, all `created_by=quill`**, created today 02:43Z–08:17Z (94150, 94162,
  94177, 94190, 94198, 94207, 94215). Every one of their `write_content` steps is already
  `succeeded` with `attempts=0`/`worker_id=null` — quill's cron script marks the **step** done
  directly and never closes the parent mission. `db.closeMissionIfComplete()` is only called from
  `src/workers/mission-worker.ts`, so any step completed outside the worker path orphans its
  mission. Proof by contrast: **xalt is clean** — 12/12 xalt missions today are `succeeded`, because
  `_xalt_write_20261024_1119.mjs:79` writes `ops_missions.status='succeeded'` itself.
  Action: backfill the 7 rows now, then make quill's apply path close the mission.
  This is the same class as the 93k-row `approved` graveyard that was previously backfilled — it is
  now re-accumulating from one role only.
- **NEW FINDING (S3): quill cron job is now the only non-ok job.** `2b1c84d6` → `lastStatus=error`,
  `consecutiveErrors=1`, `lastDurationMs=1,025,860` (17.1 min, the longest role run today),
  `lastError='Edit: drafts/quill-narrative-20261024-1017.md (114 chars) failed'`. The artifact is
  **intact** (11,938 bytes, all 8 sections, tables, publishing rules, negative results, method note)
  — cosmetic tail-edit failure only.
- 6h window: 56 missions (51 succeeded / 5 approved / 0 failed), 56 steps all succeeded, **0 failed**.
  failedByRole empty. No cross-role conflict, **no role throttle applied**.
- Observer volume 18/56 = 32% of missions; content roles 38 combined, zero failures.
- **Watchdog (R1) still unimplemented — 12th consecutive cycle flagging it.** Detection: queued>0
  with attempts=0 while running=0, then auto-trigger `worker:batch` after 120 s without a claim.

Full record: `observer_diagnostics_2026-10-24-1121.json`.

## 2026-10-24 12:41Z cycle — executor stall, not role overload

- Queue grew 3→4 while `running=0` and **every** queued step had `attempts=0`
  (94275 aged 16 min, 94276/94277 4 min, 94279 seconds old). attempts=0 on a non-empty
  queue = the executor never claimed them (same tell as 07:17Z).
- Cause was **not** role pressure: 23 missions in 3h, 20 succeeded / 3 approved / 0 failed.
  Role throttling is therefore wrong here — the fix belongs in the executor path.
- Worker cron `aicompany-worker-1m-isolated`: `lastRunAtMs=12:23:29Z`, `runningAtMs=12:24:45Z`,
  never finished → a hung run holding the 60s slot for ~17 min. Same signature as the
  04:17Z/07:17Z stalls.
- One manual `npm run worker:batch` drained everything (processed 4, succeeded 4, failed 0).
  Engine fine, cron/session layer broken.
- Long role sessions keep eating scheduler slots: minion `lastDurationMs=1,258,075` (~21 min),
  xalt 191s, sage 249s, quill 36s, scout 9s. Cap role agentTurn duration.

Full record: `observer_diagnostics_2026-10-24-1241.json`.

## 2026-10-24 12:51Z arbitration cycle — healthy fleet, executor stall again (13th)

- Live read: `queued=0`, `running=0`, **47/47 missions succeeded** in the 6h window, zero failed
  steps, zero `last_error` samples in 6h.
- Role volume 6h is balanced: observer 14, scout 8, quill 8, minion 7, xalt 6, sage 4.
  Last hour flatter: observer 4, xalt/minion/scout/quill 2 each, sage 1.
  → **no cross-role conflict, no role throttle applied** (previous cycle said "medium" — that was
  queue-driven, and the queue is now empty).
- New analyze proposal **94288** (mission 94252) created for this cycle.
- **Executor stall reproduced (13th cycle).** Step 94284 (analyze, mission 94252) sat `queued`
  with `attempts=0` for ~95 s while `running=0` — worker cron never claimed it. One manual
  `npm run worker:batch` drained it: processed 1, succeeded 1, failed 0, drained true.
  Engine fine, cron/session layer broken — throttling roles would be the wrong lever.
- **Watchdog (R1) still unimplemented — 13th consecutive cycle flagging it.**

Full record: `observer_diagnostics_2026-10-24-1251.json`.

## 2026-10-24 15:33Z cycle — healthy queue, arbitration cron is the outlier

- Queue was 1 (`analyze` 94308, `attempts=0`, age <1 min) with `running=0`; a single manual
  `npm run worker:batch` returned `processed 1, succeeded 1, failed 0, drained true` and the step
  flipped to `succeeded` immediately. Same "claim delay, executor healthy" signature as earlier cycles —
  not a failure mode, but keep closing the loop manually every cycle.
- 0 failed missions and 0 error-bearing steps in 6h (55 missions, 54 succeeded / 1 approved).
  Historical 305 failed steps are flat, not growing.
- **New signal: the arbitration 10m job runs 23.6 min on a 10 min schedule** (lastDurationMs 1,417,680).
  It is the only job overrunning its own interval; minion/sage are ~15.7 min on 30 min schedules, all others
  far under. That job can hold a session slot past its next tick and starve the 60s worker.
  Remediation: cap arbitration duration below its interval; re-check next cycle for duration < 600s.

Full record: `observer_diagnostics_2026-10-24-1533.json`.

## 2026-10-24 15:32Z cycle — queue empty, no throttle needed

- Live read: `queued=0`, `running=0`; 33/33 missions succeeded in the 3h window (observer 10, scout 6,
  minion 5, quill 4, xalt 4, sage 4) — zero failed, balanced role volume.
- **pressure=low, action=keep, target=none.** No cross-role conflict signal, nothing to slow down.
- New analyze proposal **94313** (mission 94277) created for this cycle.
- Note: `openclaw cron list` failed this cycle ("gateway closed (1000)") — the gateway CLI could not
  reach ws://127.0.0.1:18789, so per-job duration checks were skipped. Role-duration creep should be
  re-verified next cycle via the cron tool rather than the CLI.

## 2026-10-24 16:57Z cycle — execution path migrated to systemd timers, fleet clean

- **The worker no longer runs from cron.** `aicompany-worker-1m-isolated` and
  `aicompany-heartbeat-5m-isolated` are both **disabled** in the OpenClaw cron list; execution
  now runs through systemd user timers (`aicompany-worker.timer`, `aicompany-heartbeat.timer`).
  Verify with `systemctl --user list-timers` and `journalctl --user -u aicompany-worker.service`,
  not the cron job state. Last batch at 16:58:01Z: `processed 1, succeeded 1, failed 0, drained true`
  — it picked up this cycle's own analyze step within seconds of creation.
  **Consequence: `npm run worker:batch` recovery is no longer the reflex** — check the timer first,
  and only fall back to a manual batch if the timer itself is inactive.
- **`ops_missions` has no `agent_id` column — it is `created_by`.** A `select('...,agent_id,...)`
  errors out and `data` comes back null, which breaks role-level failure attribution silently.
  Also: `select('*').limit(1)` on PostgREST returns one row object, not an array.
- Fleet state at 16:57Z: queued=0, running=0, 67/68 missions succeeded over 6h. The one failure
  (step 94315) is an operator-probe duplicate — resolution class, not a coordinator capacity issue.
- quill and xalt cron sessions still show `runningAtMs=15:54:38Z` with no completion report
  (~63 min). This is the session-slot-hold pattern from earlier cycles. If it persists next cycle,
  reclaim the stale isolated session instead of letting it age.

Full record: `observer_diagnostics_2026-10-24-1857.json`.

## 2026-10-24 17:07Z cycle — fleet idle, tenth consecutive low-pressure arbitration

- Live read via `ops_mission_steps`: queued=0, running=0, failed=1 (known operator-probe duplicate, resolution class).
- Missions 6h: 70 total / 69 succeeded; observer 25, minion 11, sage 10, scout 10, quill 7, xalt 6, coordinator 1 — balanced, no role dominating.
- **pressure=low, action=keep, target=none.** No cross-role conflict signal.
- Diagnostics proposal 94337 / mission 94301 created (accepted).
- Carried watch: arbitration job must stay under its 10m interval; escalate only if queued > 5, running step > 20 min, or failed ratio > 1%.

## 2026-10-24 21:30Z cycle — root cause of the recurring stalls found: worker cron is DISABLED

- **The long-running "executor mystery" is solved.** The 1-minute worker cron
  `aicompany-worker-1m-isolated` has `enabled=false` (last run ~18:00Z) and
  `aicompany-heartbeat-5m-isolated` is also disabled. Every prior cycle diagnosed
  queued steps with `attempts=0` as an unexplained executor failure; the engine was
  never broken — **nothing was scheduled to pick the work up**.
- Cycle-start signal: step 94355 (mission 94323, prior cycle) still `queued`,
  `attempts=0`, fleet `running=0` — it survived a full cycle boundary unclaimed.
  This cycle's own step 94356 was also queued. Backlog excluding self-created steps = 1.
- Recovery is unchanged and still one command: `npm run worker:batch` →
  `processed 2, succeeded 2, failed 0, drained true`. Both steps → `succeeded`,
  both missions closed `succeeded`. Post-check head-counts: queued=0, running=0, blocked=0.
- **Action for the next cycle:** re-enable `aicompany-worker-1m-isolated` (and the 5m
  heartbeat). That single change supersedes the liveness-watchdog proposal (R1) that
  eight consecutive cycles have flagged as "unimplemented".
- Counts: failed 307/94316 cumulative (0.33%), flat vs prior cycle (0.33%), no new
  failures in 6h, no genuine failures of any class. Duplicate-proposal regression did
  not recur — one CLI invocation produced one proposal (94360) / mission (94324) / step (94356).
- Risk raised to **medium** on a single, well-understood fault (no automated executor),
  not on any quality regression. Pressure stays low; no role slowdown.

Full record: `observer_diagnostics_2026-10-24-2130.json`.

## 2026-10-24 20:05Z cycle — executor restored, fleet clean, eleventh consecutive low-pressure cycle

- **The R1 remediation landed.** `aicompany-worker-1m-isolated` is back to `enabled` and
  reports status `ok` (last run ~1 min before this check); the systemd timers
  (`aicompany-worker.timer`, `aicompany-heartbeat.timer`) are also listed active. The
  "no automated executor" fault from the 21:30Z cycle is resolved — no manual
  `npm run worker:batch` was needed this cycle.
- Live read: queued=0, running=0. The analyze step this cycle created (94365, mission 94333)
  was claimed and reached `succeeded` within ~25 s — first cycle where the executor picked up
  new work on its own without intervention.
- Missions 6h: 75 total / 73 succeeded / 2 failed. Both failures are **resolution class**
  (94315 operator probe duplicate, 94350 observer double-run duplicate). No genuine failures.
- Role volume 6h: observer 28, scout 13, sage 11, minion 8, quill 7, xalt 7, coordinator 1 —
  balanced. **pressure=low, action=keep, target=none.**
- **Standing constraint for this arbitration cycle:** invoke `npm run proposal:test` exactly
  once. A previous observer double-run (step 94350) produced a duplicate-proposal failure.
  If a second invocation is ever needed, expect a resolution-class failure, not a real defect.
- Full record: `observer_diagnostics_2026-10-24-2205.json`.

## 2026-10-24 23:27Z cycle — timeout<period enforced on all 12 jobs; mock-LLM path root-caused

- **Queue clean.** queued=0, running=0, blocked=0. 31/31 missions in 3h succeeded, zero failed
  steps in the window (last failure 18:58Z was a duplicate-resolution). Cumulative failed 307 =
  258 resolution + 48 stale dead-letters (latest 2026-10-21) + 1 other.
- **R1 is now ENFORCED, not just recommended.** Previous cycles only *asked* for
  `timeoutSeconds < period`. This cycle actually applied it via `openclaw cron edit`:
  sage/quill/xalt/scout/minion/observer 1500->900, observer-arbitration 1500->300 (10m period),
  worker 300->45 (1m period), heartbeat 600->240 (5m period). Verified by re-listing all 12 jobs:
  every job now satisfies timeout*1000 < period. Note the `cron.update` *tool* silently ignores
  `payload.timeoutSeconds` (it bumps `updatedAtMs` and changes nothing) — use the CLI.
  Three edits also failed transiently with "gateway closed (1000)"; retry works.
- **Sage still times out** (lastStatus=error, lastErrorReason=timeout, 1500009ms, consecutiveErrors=2,
  stale runningAtMs ~21min). With the timeout now at 900s a sage tick can no longer overlap its
  successor, but the tick still needs ~25min — other roles finish in 34s-2min. That is the next
  thing to chase (R2), not a timeout-tuning problem.
- **Quality finding that mattered: the mock-LLM path.** 348 of the last 400 output events were
  `[mock-llm]` prompt echoes (306/313 insights, 27/46 content, 15/41 tweets) while every step
  reported `succeeded` with an empty `last_error` — silent failure, nothing red. Root cause is
  already fixed (commit e0933bc, dist rebuilt 22:36Z): 10/10 outputs since 22:36Z are real LLM,
  direct API probe returns 200 in 1.9s, dist adapter returns source=llm in 4.1s. **The gap that
  remains: the fallback is still an invisible success path** — no event, no counter, no failure.
  R4 asks for an `llm.degraded` event (or a failed step) plus an hourly mock/llm counter.
- Observer share 8/31 missions (26%) vs <=15% target — unchanged, still R5.
- One analyze proposal created (94403 / mission 94367 / step 94398), single CLI invocation.
- Full record: `observer_diagnostics_2026-10-25-0127.json`.

## 2026-10-25 18:57Z cycle — queue drained, meta-overhead is the problem, minion paused

- Proposal **94599** → mission **94563** → step **94596** (analyze, succeeded 18:58:27Z). Single CLI invocation.
- **Queue fully drained.** queued=0 (own step only), running=0, blocked=0; 243 steps/24h, 242 succeeded, 1 failed. Missions approved=2, queued/running=0. Raw queue pressure LOW.
- Proposals 24h = 244: observer 67, scout 48, xalt 34, minion 33, sage 31, quill 30, coordinator 1. Last 6h = 60 — **byte-identical to the 18:46Z cycle**, so fleet output was flat over the 10-minute window (no new churn, no backlog).
- Output events 24h: insight.generated 179, content.drafted 40, tweet.drafted 49, research.completed 1, skill.published 1. Publish rail **still zero**: ops_social_posts 0, ops_reaction_queue 0, content.published 0, post_tweet steps 0.
- **New finding 1 — minion is a zero-output lane.** 33 proposals/24h, 9 in 6h, and **zero output events of any kind**: no insight, no artifact, no research, no draft. 7 of its last 8 proposals (6h) carry the byte-identical topic `priority balancing and blocker removal`; 33/33 had an empty `rationale`; its analyze steps emit the same generic boilerplate ("Establish clear health baselines…", "Clarify the underlying signal…"). Its priority/blocker lane duplicates observer's arbitration cycle.
- **New finding 2 — insight attribution is broken.** All 179 `insight.generated` events are stamped `agent_id=observer` regardless of which role's mission produced them (observer's own mission 94561 shows only `step.succeeded`). This mis-attribution is exactly what hid minion's zero-output lane, and it makes every role look equally productive.
- Verdict: pressure **medium**, action **slowdown**, target **minion**. Queue is drained so no throughput-bound role needs pausing; the waste is meta-overhead. **Target rotation is deliberate**: xalt was slowed at 15:28Z and quill at 18:46Z and both kept producing, so re-pausing the same lanes is a no-op — the pause moves to the redundant lane instead.
- Standing follow-ups: throttle observer itself (67/24h = 27% of all proposals vs the ≤15% target; observer is not an allowed targetRole); fix `insight.generated` attribution; require non-empty rationale + artifact reference on minion proposals; merge minion's priority lane into observer arbitration; stop opening new draft_tweet/write_content proposals until a publish surface exists.
- Full record: `observer_diagnostics_2026-10-25-1957.json`.

## 2026-10-26 01:01Z cycle — queue drained, proposal churn unchanged, throttle still inert

- **Schema reality check (cost me a cycle).** The live tables are `ops_mission_proposals`,
  `ops_missions`, `ops_mission_steps`, `ops_agent_events`, `ops_social_posts`, `ops_reaction_queue`.
  Bare `proposals`/`missions`/`steps`/`events` return "Could not find table in schema cache".
  The on-disk `proposals.db` / `missions.db` / `steps.db` / `data.db` / `events.db` are **empty stubs** —
  4 KB or 0 bytes. Never measure pressure from them.
- `ops_agent_events` has no `type` column; the kind column is `kind`, with dotted values
  (`step.succeeded`, `insight.generated`, `proposal.created`, `tweet.drafted`, `content.drafted`).
- Queue: queued=0, running=0, blocked=0, 36/36 missions succeeded in 3h. No throughput pressure.
- Real pressure is the proposal layer: 250 `proposal.created` in 24h, 233/248 with empty rationale,
  and minion/scout/sage still emit **zero** output events in 24h.
- Slowdown verdict for this cycle: **sage** (highest-volume zero-output lane not just throttled;
  scout was slowed at 00:51, minion's 3h volume is lower at 4).
- The 00:51 scout slowdown was unenforced within 10 minutes. The observer verdict has **no consumer** —
  that is the root defect, worth more than any role throttle.
- `insight.generated` is still stamped `agent_id=observer` for all 179 events/24h, so per-role output
  accounting (and any verdict based on it) is built on a broken metric.

Full record: `observer_diagnostics_2026-10-26-0101.json`.

## 2026-10-26 01:31Z cycle — queue drained, minion back on throttle rotation

- Proposal **94667** → mission **94631** (analyze, accepted). Single CLI invocation.
- Queue fully drained: 0 queued/running/blocked/pending steps; 254 missions/24h = 251 succeeded, 2 failed (both resolution-class), 1 approved.
- Proposals: 73/6h (observer 22 = 30%, sage 12, scout 11, xalt 11, quill 10, minion 7); 40/3h; 16/1h. Observer still exceeds the ≤15% target on self-monitoring.
- Artifacts 6h: quill 26, xalt 9; **minion/sage/scout = 0**. Only the artifact-producing lanes are worth full rate.
- Publish rail: first `content.published` event appeared (1/24h) but ops_social_posts / ops_reaction_queue / post_tweet steps are still 0 — no real distribution surface.
- Verdict: pressure **medium**, action **slowdown**, target **minion** (rotation back to the least-recently-throttled zero-output lane, 00:11 → 01:21 scout → 01:27 sage → minion; minion's priority/blocker lane also duplicates observer arbitration).
- Root defect unchanged: no ops_policy throttle key and no dispatch gate, so every slowdown verdict is advisory only. Also still broken: insight.generated stamped agent_id=observer for all 182 events/24h.
- Full record: `observer_diagnostics_2026-10-26-0131.json`.

## 2026-10-26 07:01Z cycle — cron timeouts, not data failures

- **Distinguish "cron job error" from "work failed".** The failure signal this cycle is in the
  cron layer, not the data layer: `aicompany-role-sage` timed out on both of its last two runs
  (durationMs 1500009 = the 1500s payload cap, consecutiveErrors=2), yet the proposals were
  created early each time (94733 @06:07Z, 94737 @06:37Z) and both missions succeeded. The turn
  dies *after* the write. So the run is logged as an error while the deliverable is fine — a
  naive "error count" view would blame the DB; the real cause is sage session size
  (385k–1.94M input tokens in recent runs).
- `aicompany-observer-arbitration-10m` also timed out (540004ms vs a 600s interval). A 540s
  budget on a 600s tick has no headroom — one slow run collides with the next.
- **The worker is fine and it is not the openclaw cron job.** Worker batches are served by the
  systemd *user* timer `aicompany-worker.timer` (1m, `drained: true`, last run 08:07:03), and
  the openclaw cron jobs `aicompany-worker-1m-isolated` / `aicompany-heartbeat-5m-isolated` are
  **disabled leftovers** (updatedAtMs ~1792946464557). Do not read them as the executor.
  Also: two gateways run at once — the main one (PID 1093424, port 18789) and the rescue profile
  (PID 1415729, port 19789, `OPENCLAW_STATE_DIR=/home/ax/.openclaw-rescue`). That is intentional,
  not a duplicate-process bug.
- Step-level truth (ordered reads + exact head-counts): queued=1 (our own step 94745), running=0,
  0 steps created in the last 6h are failed (307 failures are all historical), last 24 missions
  all `succeeded`. `ops_mission_steps` has no `agent_id` column — the role lives on
  `ops_missions.created_by`, and `ops_missions` has no `title` column (it is `created_by`,
  `proposal_id`, `title`… verify with a `select *` before writing queries).
- Proposal-layer defect persists: **every** proposal in the window has `rationale=null`,
  including the one this cycle just created. Enriching it post-hoc via a direct
  `ops_mission_proposals.update({rationale})` works and is the fastest fix until intake requires it.

Full record: proposal 94739 rationale (A1–A5, R1–R5, verification criteria).

## 2026-10-26 11:40 CEST cycle — rail green, ledger leak at 4, sage throttled

- Steps 6h: 70 created, 69 succeeded, 1 running (worker-batch-1598414), 0 queued, 0 stuck >15m, 0 failed. No execution pressure.
- Never-dispatched approved missions = 4: 94732 (sage, 123m), 94720 (sage, 159m), 94711 (quill, 206m), 94753 (minion, 1m fresh). Leak still growing vs the 3 seen at 10:42.
- Proposals 6h by agent: observer 20, scout 12, minion 11, xalt 11, quill 10, sage 10 -> observer 27% (target <=15%). 12/13 proposals in the last hour still have rationale=null (enriched post-hoc on 94790).
- Events 6h by agent: observer 70, quill 30, xalt 20, scout 12, sage 11, minion 11; sage emits proposals/insights only, zero artifacts -> throttled this cycle.
- Verdict: pressure medium (ledger), action slowdown, target sage. Full record: observer_diagnostics_2026-10-26-1140.json, proposal 94790, mission 94754.

## 2026-10-26 15:35Z cycle — stray `--help` agent lane runs real steps

- Execution layer is healthy: 0 failed steps in 24h, 0 failed missions in 6h, 1 queued step (94921, age 0),
  and the approved-never-dispatched leak that was 4 at 11:40 is now 0 (only 94861/xalt, age 1m).
- Rationale intake improved: 29/108 proposals null in 6h (was 233/248), and 0/17 in the last hour.
- **New concrete defect:** mission 94773 + proposal 94809 were created 2026-10-26T11:32Z with
  `agent_id=--help` / `created_by=--help` — `src/scripts/create-proposal.ts` reads `argv[2]` as agentId
  with no role allow-list, so a mis-invoked `npm run proposal:test` becomes a real role lane.
  Its step 94832 (`draft_tweet`) **succeeded**, and `--help` now shows up as a 7th creator in the 6h
  role counts, inflating the denominator of every per-role metric. Older `--help` missions exist from
  March, April and July, so the leak is recurring, not a one-off.
- Recommendation: allow-list roles + require non-empty rationale in create-proposal.ts before any write;
  archive the four existing `--help` rows.
- Verdict: pressure low-medium, action fix, target `src/scripts/create-proposal.ts` (arg validation).
  Proposal 94886 → mission 94862 (analyze, accepted).

## 2026-10-26 17:07 CEST cycle — the draft-volume policies are decorative

- Queue is clean, so no execution pressure: 0 queued, 0 running, 0 failed steps in 24h
  (307 failures are lifetime residue), 0 open missions, 109/109 missions in 6h succeeded.
- **Chosen risk: `ops_policy.content_policy` (max_drafts_per_day=8) is read by nothing.**
  No source file references `content_policy` or `max_drafts_per_day`; only
  `auto_approve`, `publish_gate` and `x_daily_quota` are read (proposal-service.ts:106/143/180).
  Meanwhile 24h ran 49 draft_tweet + 37 write_content = 86 draft-producing steps (10.75x cap),
  and today already emitted 51 tweet.drafted + 33 content.drafted events.
- `x_daily_quota` looks wired but is inert: `countTodayPostedTweets` (db.ts:93) counts
  `ops_agent_events` kind=`tweet.posted`, which has 0 rows lifetime, so it can never hit limit 8.
  `checkDailyLimit` (proposal-service.ts:74) is an empty placeholder.
- Publish rail still closed: 0 `post_tweet` steps in 30d, 0 gated proposals, 0 `ops_social_posts`
  rows, 11245 lifetime `tweet.drafted` events, social adapter still returns a `mock_` id.
- Fix: add `countTodayDrafts` to db.ts (tweet.drafted + content.drafted since UTC midnight),
  enforce `content_policy.max_drafts_per_day` in `checkStepKindGates` so intake fails closed,
  and wire `checkDailyLimit` to the same counter per agent.
- Proposal 94894 → mission 94870, step 94930 (analyze, executed and succeeded via worker:batch).
- Not re-proposed (already open): duplicate observer arbitration topic (94891), `--help` stray lane
  (94886), dead draft-to-publish lane (94879).

## 2026-10-26 18:27 CEST cycle — the auto-rationale fix hides the reviewer evidence

- Executor is clean, so no failed/stuck signal outranks diagnostics:
  321 steps in 24h (all succeeded), 0 queued, 0 running, 0 zero-step open missions,
  0 orphan steps (the 11:40 leak is gone), 0 failed steps in 24h (307 are lifetime residue).
  105 missions in 6h, all succeeded.
- **Chosen risk: `src/scripts/create-proposal.ts` drops `rationale` and `riskLevel` at intake.**
  `createProposalAndMaybeAutoApprove` accepts `input.rationale`, but create-proposal.ts never
  passes one — it only forwards `argv[5]` as the *step* payload. So the proposal row falls back to
  `deriveRationale()` (proposal-service.ts:69), a template string that restates the title.
  Measured on ops_mission_proposals since the 11:36Z fix:
    - pre-fix  (10-26 00:00→11:36Z): 226 rows — 205 blank (91%), 21 authored, 0 auto
    - post-fix (10-26 11:36Z→now):    99 rows —   0 blank, 91 auto (92%), 8 authored
  Blank dropped 91% → 0%, but only 8 of 99 carry a human/agent rationale. 39 of the 99 rows
  carried a real authored rationale inside `proposed_steps[0].payload.rationale` that was
  never promoted to the row.
- `riskLevel` has no column at all (`ops_mission_proposals` = id, agent_id, source, title,
  rationale, status, reject_reason, proposed_steps, created_at, updated_at), so the risk signal
  this role is asked to emit dies inside the step payload.
- **The metric now lies in our favour:** "blank rationale %" reads 0%, but 92% of rows carry a
  template echo of the title — a worse signal than blank because it looks populated.
  Counting blank vs auto vs authored as three separate numbers is the fix, not just promotion.
- Fix: in create-proposal.ts, promote `payload.rationale` and `payload.riskLevel` onto the
  proposal row before calling createProposalAndMaybeAutoApprove; add a `risk_level` column;
  keep deriveRationale as a true fallback only; report blank/auto/authored separately.
- Self-reproduction: this cycle's own proposal 94914 was accepted with
  `rationale = "[auto] observer api proposal \"Observer diagnostics cycle\" (steps: analyze)"`
  and payload keys topic/rationale/riskLevel — the defect demonstrating itself.
- Proposal 94914 → mission 94890 (analyze, accepted).
- Not re-proposed (already open): duplicate observer arbitration topic (94891), `--help` stray
  lane (94886), dead draft-to-publish lane (94879), decorative draft-volume policies (94894).

## 2026-10-26 18:57 CEST cycle — the draft lane passes placeholder garbage as success

- Executor is clean: 322 steps in 24h, 323 succeeded, 0 queued, 0 running, 0 failed in 24h,
  0 zero-step open missions, 0 orphan steps. 187 proposals in 12h (182 accepted, 5 rejected).
  3 failed missions (94711/94720/94732) are stale residue from the pre-11:36Z idempotency fix.
- **Chosen risk: `src/executors/step-executors.ts` has no output validation, and
  `src/lib/runtime-deps.ts` throws away the LLM source flag.**
  execDraftTweet and execWriteContent persist whatever `deps.llm.complete()` returns and the
  step is recorded succeeded. Measured over the last 24h of `ops_agent_events`:
    - 122 tweet.drafted / content.drafted receipts
    - 32 of them (26%) carry unfilled template slots (`[Company]`, `[audience]`, `[update]`,
      `[milestone]`, `[feature]`, `[key benefit]`) or a raw `[mock-llm] ` prompt echo
    - 10 events in 24h still carry the `[mock-llm]` marker, including 2 insight.generated from
      observer and 3 from sage, plus 5 step.succeeded receipts
  By kind/agent: tweet.drafted quill 21, tweet.drafted xalt 7, content.drafted quill 4.
  Every one of these steps shows `status=succeeded`.
- Root cause chain: `src/lib/llm-adapter.ts` returns `source: 'llm' | 'mock'` but
  `runtime-deps.llm.complete` returns only the text string, so the executor cannot tell a real
  completion from the mock fallback (`[mock-llm] ${prompt.slice(0,220)}`) that llm-adapter emits
  on missing token, non-2xx HTTP, empty content, or timeout. `llm-adapter` intentionally degrades
  to mock rather than throwing, so a credential or provider outage is silently recorded as a
  successful draft.
- Fix: in `step-executors.ts` add an output gate that throws when the produced text contains an
  unfilled bracket placeholder or the `[mock-llm]` marker, and change `runtime-deps.llm.complete`
  to return the source flag so a mock fallback fails the step (retryable) instead of succeeding.
  Verify: a `draft_tweet` step whose LLM call errors must end `failed` with a mock-source reason,
  not succeeded with a placeholder body.
- Note: the drafts/*.md files on disk look clean (0 strict-bad in the last 20 md files), so the
  disk artefacts are authored over the bad receipts — the defect is that the receipt/archive lane
  and the step status lane both treat junk as success.
- Not re-proposed (already open): duplicate observer arbitration topic (94891), `--help` stray
  lane (94886), dead draft-to-publish rail (94879), decorative draft-volume policies (94894),
  rationale/riskLevel dropped at proposal intake (94914).
- Proposal 94920 → mission 94896 (analyze, accepted).

## 2026-10-27 04:00 CEST cycle — proposal intake replays duplicate topics with no validation

- Fleet green: 602 steps in 48h all succeeded, 0 queued/running/failed, 0 non-terminal missions,
  0 retry steps, 0 duplicate idempotency keys, 0 last_error on a succeeded step. Trigger lane
  (5/5 accepted, "Diagnose mission failure N") is healthy. Blank rationale (107 rows in 24h) is
  pre-fix history only — 0 blanks since 2026-10-26T14Z. No regression of the 94914 fix.
- **Chosen risk: `src/scripts/create-proposal.ts` proposal intake into `ops_mission_proposals`
  validates nothing and dedupes nothing.**
  - Line 10 defaults the topic to "AI company progress" when the payload arg is not valid JSON;
    no check for topic/rationale/riskLevel; no check for an equivalent open proposal.
  - Last 24h: 346 proposals, only 191 distinct topic strings → 151 rows (43.6%) repeat a topic
    already in flight. Six canned strings account for 144 repeats:
    cross-role conflict/queue pressure x41, high-signal company update x25,
    growth opportunities and risks x23, system health anomalies x20,
    market signal review x19, priority balancing x16.
  - The same six strings recur across all six roles; observer alone sent 112 proposals for
    50 distinct topics (62 repeats), quill 45/33, sage 45/26, xalt 50/25, scout 48/26, minion 45/30.
  - Every repeat is auto-approved → a mission, a worker-batch slot, one LLM analyze call and
    another insight event. ~42% of the 434 analyze steps in 48h replays six identical prompts.
  - Payload riskLevel present on only 24 of 346 proposals (6.9%); 107 rows fall back to the
    auto template rationale, so the risk signal the role is asked to emit rarely exists.
- Fix at create-proposal.ts intake: reject payloads missing topic/rationale/riskLevel rather
  than defaulting the topic; add a `topic` column and a sha256 of agent_id + normalized topic;
  reject a proposal whose hash matches an accepted proposal from the last 6h, with a
  reject_reason naming the original proposal id.
- Verify: 0 repeat-topic rows in ops_mission_proposals over 24h and daily analyze steps
  falling from ~217 to the distinct-topic count.
- Proposal 95041 → mission 95017 (analyze, accepted).
- Not re-proposed (already open): duplicate observer arbitration topic (94891), --help stray lane
  (94886), dead draft-to-publish lane (94879), decorative draft-volume policies (94894),
  rationale/riskLevel promotion (94914), mock-llm placeholder gate (94920),
  zero-step failure telemetry (95036).
