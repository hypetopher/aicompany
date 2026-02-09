# aicompany Test Plan v1

## 1. Objectives
Validate the system meets design requirements:
- Closed-loop autonomy
- Single-executor consistency
- Queue hygiene under policy limits
- Failure recovery (retry/backoff/dead-letter)
- Real-time observability (API/SSE/UI)
- Affinity graph correctness (update + decay)
- Operational control via OpenClaw cron

## 2. Scope
In scope:
- `proposal-service`, triggers, reactions, worker, executors
- Supabase migrations/RPC functions (001-005)
- Stage API + SSE + Stage UI
- Cron jobs for affinity update/decay

Out of scope (v1):
- Production-grade external posting adapters
- Full security pentest

## 3. Acceptance Criteria (Go/No-Go)
P0 gates:
- E2E closed-loop pass rate >= 95%
- Duplicate execution rate = 0 in concurrent claim tests
- Gate rejection correctness = 100% for blocked quotas
- Retry -> fail/dead-letter state transitions deterministic
- Stage APIs align with DB state (<1% mismatch)
- SSE stable 30min (reconnect allowed)
- Affinity update+decay produce expected directional changes

## 4. Test Matrix
### A. Schema/RPC
- A1 migrations are idempotent
- A2 unique/index constraints are effective
- A3 RPC callable: `claim_one_step`, `upsert_affinity`, `apply_affinity_decay`

### B. Unit
- B1 proposal gate behavior
- B2 retry backoff curve
- B3 sentiment classification/delta
- B4 affinity delta clamping

### C. Integration
- C1 proposal -> mission -> steps creation
- C2 concurrent claim lock correctness
- C3 fail/requeue/dead-letter progression
- C4 reaction queue state transitions
- C5 affinity upsert accumulation

### D. End-to-End
- D1 happy path closed-loop for 2+ cycles
- D2 quota-blocked proposal path
- D3 executor failures with backoff and terminal fail

### E. API/UI/SSE
- E1 stage endpoints shape/latency checks
- E2 SSE event stream continuity
- E3 Stage UI tabs + drawer + affinity panel

### F. Ops/Cron
- F1 hourly affinity update trigger
- F2 daily affinity decay trigger
- F3 manual cron run observability

## 5. Data Fixtures
Agents: `minion,sage,scout,quill,xalt,observer`
- 200 normal tasks
- 50 failing tasks
- 500 dialog events for affinity inference
- quota-block datasets

## 6. Execution Plan
- Day 1: schema + unit
- Day 2: integration core
- Day 3: e2e closed-loop + cron
- Day 4: ui/sse + perf smoke
- Day 5: regressions + release gate

## 7. Defect Severity
- P0: closed loop break/data corruption/duplicate execution
- P1: retry/cron instability/core API mismatch
- P2: non-critical UI/data freshness issues
