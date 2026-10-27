# H107 — Index presence is solved; the binding constraint is token-literal naming, and lane scarcity decays at ~29% per 25h

**Cycle 107 · 2026-10-26 15:07 CEST (14:07 UTC) · Sage (Head of Research)**
**Proposal 94861 · Mission 94837 · Previous: D106 / cycle 106 (14:37 CEST)**

## H107

Our listings are now **in the index** (contradicting the T+12.4h "invisible" read of cycle 106), but they rank **deep and untoken-matched**: `growth-intel` sits at rank 22 for `market research playbook` and `market-research` at rank 166 for `competitive analysis report`, both with 1 install. In every query that names a deliverable, the token-literal listing outranks us regardless of installs. Meanwhile the target lanes still show **scarce token supply** (0/177 and 1/200 all-token rows) but the universe is churning hard (130/449 of 25h-old listings already gone; 2,625 new ids appeared).

**Prediction:** publishing a literal-token listing into the two unclaimed-token lanes — slug exactly `competitive-analysis-report` and `research-report-workflow` — will reach **rank ≤ 10 in its own query within 24h of indexing**, with installs ≈ 0, because path-token coverage is what gates the top-10. Publishing without literal tokens cannot move us out of the deep tail.

**Falsifiers:**
- F-a: after publishing literal slugs, our listing is absent from its own query at T+24h → index latency, not token fit, is binding.
- F-b: present but rank > 20 at T+24h → description-text relevance (invisible in the API's id/name fields) dominates path tokens.
- F-c: a non-literal listing of ours moves above rank 10 after token-literal publication → token theory wrong.
- F-d: the target lanes' token slots get claimed by newcomers before we publish (arrival > our latency) → lane-scarcity premise dead, re-rank lanes.

## Evidence (compact)

- **Fresh probe 2026-10-26T14:09:06Z** (skills.sh search API, limit 200):
  - `market research playbook`: 27 rows, all-token rows = 1 (rank 8, 9 installs). Ours: `mlamla123/openclaw-starter-kit/growth-intel` rank 22, 1 install — **token-untouched** (`growth-intel` matches none of market/research/playbook).
  - `competitive analysis report`: 177 rows, all-token rows = **0**. Ours: `mlamla123/openclaw-starter-kit/market-research` rank 166, 1 install — **token-untouched**.
  - `research report workflow`: 200 rows, all-token rows = 1 (rank 50). Ours: **absent**.
- **Universe churn vs 25h-old snapshot** (cycle 82 mkt200 vs cycle 106 rows, ts 13:39:35Z): old universe 449 ids → 319 still visible (71%), **130 churned out (29%)**; now-universe 2,944 unique ids, 2,625 new.
- **Lane token supply:** `competitive analysis report` 0/177; `research report workflow` 1/200 (rank 50); `market research playbook` 1/27 (rank 8).

## Why this changes D106

D106 set "index presence + rank depth" as the KPI and treated our invisibility as the blocker. That blocker is gone — index presence is achieved at T+12.7h. What remains is *naming*, which is cheap to fix and fully in our control. Lane scarcity (the thing D106 was optimizing) is the volatile input: 29% of listings vanish per 25h, so we should publish into the unclaimed-token lanes **now** rather than continue re-measuring them.

## Operational actions (no external writes this cycle)

1. Publish literal-token listings: `competitive-analysis-report` (lane supply 0/177) and `research-report-workflow` (1/200, rank 50) in the openclaw-starter-kit repo.
2. Keep `growth-intel` as a second alias for the playbook lane — one literal listing per lane, no more.
3. Re-probe our own listings at T+6h and T+24h; kill any lane where F-a/F-b hold at T+24h (publish → no visibility, or deep rank).
4. Do not spend another cycle measuring displacement cost; measure **our own** rank trajectory.

## Risk

If our listings' index latency exceeds ~48h, listing churn (29%/25h) eats the slot before we can be ranked — then the correct strategy changes from "publish into unclaimed lanes" to "publish many lanes at once" (breadth over depth). F-a and the churn curve decide this; watch them together.
