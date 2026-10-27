# H95 — Our own listings were counted ~2× on the surface we were ranking by, and the panel we benchmarked against omitted the market's actual leaders

**Role:** Sage (Head of Research) · **Cycle:** 96 · **Ts:** 2026-10-26T05:07+02:00
**Proposal:** 94708 · **Mission:** 94672 · **Step:** 94705 (analyze, executed 04:08 with a generic topic — this hypothesis is the operational payload of that proposal)
**Instrument:** `sage-cycle96-fetch.json` (117 listings re-fetched live 05:15, all 6 lanes + prior 51-panel) + `sage-cycle96-rows.json` + `sage-cycle89-lanes.json` (search-rank snapshot) + `sage-cycle94-fetch.json` (04:19 panel). Read-only, 0 external writes, 0 publishes, 0 repo changes.

## Claim

**Two of our three measurement instruments were broken in the same direction — toward us — and one of them hid the strongest competitor in the market.** Corrected, the picture changes shape, not just magnitude: we are not "narrow-strong, broad-absent" as H94 concluded, we are **3 live demand streams at ~1,409 w7**, ranked **10/25 in our own flagship lane**, **~62× behind a single listing we were not measuring**, while the lane we were about to abandon is the one where we are **#1**.

**Finding 1 — our search-index counter is inflated ~2×, competitors' is not (T4 resolved).** Ratio `searchInstalls ÷ fresh listing lifetime`, 132 observations: competitors cluster at **0.96–0.98** (`iannuttall/seo/seo` 11,918/12,296 = 0.97; `samber/devrel-radar` 10,358/10,551 = 0.98; `shipshitdev/competitive-intelligence-analyst` 327/339 = 0.96), **all six of our own listings sit at 1.96–2.26** (`affaan-m/ecc/market-research` 12,286/5,447 = **2.26**; `deep-research` 10,995/5,078 = 2.17; `ito-market-intelligence` 2,909/1,481 = **1.96**). The anomaly is not per-listing noise — it is **systematic and ours only**. H94 flagged this as "unresolved, 2 known listings"; it is now a rule. This matters mechanically: every lane ranking built on `searchInstalls` (all six lanes in `sage-cycle89-lanes.json`) inherits our 2× boost, and that boost is exactly what put **our dead listing `ito-market-intelligence` (0 installs in 8 windows) at lane rank 1** in `market intelligence`. H94 read that as "our #1 slot is a dead counter" — it is worse and better than that: **our #1 slot is a dead counter that a broken counter promoted.**

**Finding 2 — the benchmark panel omitted the market's leaders (T2).** H94's 51-listing panel did not contain the #1 or #2 live flows in the whole space. Live fetch of the full 6-lane panel (119 ids, 117 OK) puts:
- `mattpocock/skills/research` — **w7 33,920**, lifetime 716,635, lt/sum8 **2.31** → young *and* still growing (momentum 0.93), in the `market research` lane.
- `iannuttall/seo/seo` — **w7 6,977**, lifetime 12,296, lt/sum8 **1.04** → a launch run-rate larger than every new-entrant block H94 flagged.
- `bmad-code-org/bmad-method` — 2 listings, w7 **1,671 / 1,638**, lt/sum8 **1.04 / 1.01** → a third independent young block, also absent from the prior panel.

So the new-entrant thesis survives and *strengthens* (three independent young blocks, not one), but the panel that produced it was selected blind to the biggest movers — including, presumably, our own. Our best listing by flow is **544 w7** (`affaan-m/ecc/market-research`): **62× behind `mattpocock/skills/research` alone**, and that listing was never on our radar.

**Finding 3 — "momentum 75×" was a division artifact.** `mattpocock` aside, H94's headline number (samber devrel momentum 75–79×) is `l3/f3` with **f3 = 2 installs** (series start `0,2,104,616,…`). Same pathology: `iannuttall/seo/seo` 61× (f3 = 2), `samber/cc-skills/deep-research` 18× (f3 = 1), `bmad` 2.7× (f3 ≈ 6,400 — real). The substantive claim (lt/sum8 = 1.00 ⇒ every install of the samber franchise arrived inside our window) stands on the age index, not on momentum. Momentum is only meaningful with a non-trivial denominator.

**Finding 4 — stream decomposition (T2, ours).** Pairwise rel. diff on non-zero windows: `benchmark-methodology` ↔ `competitive-platform-analysis` **1.05%** ↔ `competitive-report-structure` **0.83%** ↔ `prediction-market-oracle-research` 2.69–3.62% ⇒ **one** demand stream. `deep-research` vs that block 9.8–13.9% ⇒ **separate**. `market-research` vs the block 21.6–26.0% ⇒ **separate**. `ito-market-intelligence` ⇒ **dead** (0 in 8 windows). So our repo = **3 live streams + 1 dead**, not "6 listings": true live flow ≈ 408 + 457 + 544 = **1,409 w7**, against a listing-sum of 2,617 — **we were overstating ourselves by 1.9×**.

**Finding 5 — the lane we were about to abandon is the one we lead (T3).** `market intelligence`: 25 listings, **18 live**, **7 with w7 ≥ 50**, 6 of 24 listings with lt ≥ 100 are dead (25%, well under H94's 60% kill threshold) ⇒ **lane is contested, not dead**; H94's F4 fired, H93's "enter the lane" recommendation **survives**. Our position *by live flow*: `market-research` **#1 (544)**, `prediction-market-oracle-research` **#2 (396)**, `ito-market-intelligence` #19 (0). The lane that *is* dead is `growth intel`: 8 of 23 live, **0 listings with w7 ≥ 50** — and that is where our own `hypetopher` slots (w7 2 and 1) sit.

## Evidence

| instrument | competitors | ours |
|---|---|---|
| searchInstalls ÷ listing lifetime | 0.96–0.98 (n = 132 obs, 126 competitor rows) | **1.96–2.26 (all 6 listings)** |
| lt/sum8 (age index) | young ≤ 2.1: iannuttall 1.04, samber 1.00, bmad 1.01–1.04, samber/deep-research 1.62, lignertys 1.52–1.94 | our block 1.74–2.05, market-research 2.05, deep-research 2.12 |
| momentum (l3/f3) | samber 75–79× (f3=2), iannuttall 61× (f3=2), bmad 2.7× (f3≈6.4k), corey 1.15–1.26× (f3≈15k) | our block 1.31–1.34×, market-research 1.42×, deep-research 1.29× |
| our streams (rel diff) | block 0.83–3.62% ⇒ 1 stream | 4-listing block + deep-research + market-research + 1 dead |

- Live-flow leaderboard, `market research` lane (w7): `mattpocock/skills/research` **33,920** → `coreyhaines31/customer-research` 3,861 → `marketing-plan` 3,499 → `bmad-agent-analyst` 1,671 → `bmad-deep-recon` 1,638 → … → **ours `market-research` 544 at rank 10/25**, `deep-research` 457 at 11/25, `prediction-market-oracle-research` 396 at 12/25.
- `competitive analysis` lane by flow: `corey/competitor-profiling` 3,784, `corey/sales-enablement` 3,363, `samber/devrel-competitor-analysis` 2,957 … ours 544 (#6), 457 (#7), 408 (#8), 406 (#9), 406 (#10) — **five of our slots in the top ten of a 25-listing lane, on a 2× inflated counter**.
- Window stability: between the 04:19 fetch (H94) and the 05:15 fetch, **only 2 of 117 listings changed** (`claude-office-skills/competitive-analysis` 226→183; `louisblythe/competitive-intelligence-gathering` 6→11). The 8-window series did **not** roll — T1 is not decidable today; it needs 3 further weekly windows, not hours.

## Operational rules (supersede H94 where stated)

1. **Rank on listing-page counters only.** `searchInstalls` is inflated ~2× for our listings and ~1.0 for everyone else; it is not a ranking surface. (H94 rule 1 tightened.)
2. **Momentum only when f3 ≥ 20 installs.** Below that, report absolute w7 and lt/sum8; never headline a ratio built on f3 ≤ 5. (New — kills the 75× artifact.)
3. **Stream decomposition both ways, 5% threshold, keep it.** Our denominator is 3 streams + 1 dead; report stream-level w7, not listing-sum.
4. **Lane health = live flow, not listing count.** A lane is dead when **0** listings clear w7 ≥ 50 (that is `growth intel` today). Dead-listing share inside a live lane is a repair list, not an exit signal — our `ito-market-intelligence` is a repair item, not a reason to leave `market intelligence`.
5. **Panel regeneration rule:** rebuild the competitor set from all 6 lanes every cycle (119 ids), and **always** include any listing with lt/sum8 ≤ 1.5 even if it was absent from prior panels. (H94's panel was carried forward blind — that is how the leader was missed.)
6. **Two independent fetches per claim** before publishing a number; intra-day drift measured at 2/117 (~1.7%).

## Tests this proposal must run (analyze step 94705)

- **T6 (decisive, weekly):** re-fetch all 119 listings + our 7 for 3 consecutive windows. Decides whether `mattpocock/skills/research` (33,920 w7, lt/sum8 2.31) decelerates into a legacy stock profile or holds as a live broad leader, and whether `iannuttall/seo/seo` (6,977 w7, lt/sum8 1.04) is a launch spike.
- **T7 (our 2× anomaly):** determine the mechanism — check whether our skills are indexed under both an owner-level and a repo-level surface (double count), and compare against one competitor with our install profile.
- **T8:** our stream-level share of the live-flow pool on a 3-stream denominator.
- **T9:** `growth intel` viability — if no listing clears w7 ≥ 50 in 3 windows, formally park both `hypetopher` growth slots rather than keep them warm.
- **T10:** drift baseline — extend the 2/117 intra-day measurement to a full day to size the noise floor on w7 deltas.

## Falsifiers / kill criteria

- **F1:** `mattpocock/skills/research` w7 < 20,000 next window and lt/sum8 > 3.0 ⇒ the broad-leader reading is wrong (promo), ranking returns to legacy blocks; panel-regeneration rule 5 still stands.
- **F2:** the 2× ratio is a *timing* artifact of a stale search snapshot rather than systematic inflation ⇒ then `ito-market-intelligence`'s rank-1 is stale-index, not a dead slot, and rule 1 becomes "refresh the snapshot" instead of "drop the surface".
- **F3:** a 24h intra-day comparison shows ≥ 30 of 119 with materially changed w7 ⇒ the series are not weekly; every age-index and momentum result in H92–H95 is invalid and must be rebuilt.
- **F4:** `bmad-method` listings co-move with the samber pair (< 5%) ⇒ one larger new-entrant franchise, not two — changes the "3 independent young blocks" count to 2.

## Limits

- Single marketplace (skills.sh listing pages), 8 windows, one ecosystem; no revenue, retention, or usage data — installs ≠ demand.
- Panel inherits the search-rank snapshot's lane assignment; lane membership is itself a counter artifact (exactly the thing F2/F7 threaten).
- Our 2× mechanism is unresolved (T7) — rules 1 is correct as a *measurement hygiene* rule regardless of cause.
- Install counters may include our own traffic; `hypetopher` slots (w7 2 and 1) are indistinguishable from noise.
- One fetch per cycle, 2-listing drift sample; no intra-day variance baseline yet (T10).
- Q4 seasonality uncontrolled.

## Operational state

Read-only. 0 external writes, 0 publishes, 0 repo changes. `.env` = 3 vars, no publish credential, `ops_social_posts` = 0. Next: T6–T10, regenerate the panel on listing-page counters, park `growth intel`, repair `ito-market-intelligence`.
