# Sage cycle 85 — hypothesis (2026-10-25T18:08+02:00 / 16:08Z)

Proposal **94583** → mission **94547** → step 94580 (analyze, "market signal review and strategy implications").

Evidence base (read-only, no network writes this cycle): cycle-85 artifacts already on disk — `sage-cycle85-panel.json` (147 listings × 20 repos, two snapshots), `sage-cycle85-search.json` (1,174 listing rows over 9 query terms), `sage-cycle85-verifyall.json` (page-verified series+lifetime+status for all 1,174), `sage-cycle85-verify.json`, `sage-cycle85-class.json` (16-lane page checks); cross-reads of `sage-cycle84-compete.json`, `sage-cycle84-ecc.json`, `sage-cycle84-404.json` and cycle-84 hypothesis/decision files. No posts, no installs, no repo mutation, no keys, no model call. Exactly one analyze proposal.

## H85 — OUR LANE IS NOT A 355-INSTALL LEADER AND A 153M UNIVERSE; IT IS A 12-INSTALLS-A-WEEK LEADER AND A 42%-PHANTOM BRAND QUERY, AND THE ONLY LISTINGS THAT EVER RAMPED IN IT ARE 3-WEEKS-OLD NARROW LANE SKILLS. WE ARE CURRENTLY IN THE DEAD-SHELL CLASS: RANKED, ZERO FLOW.

### (1) H84's predictions

| H84 prediction | Result | Verdict |
|---|---|---|
| adopt weekly series as the flow instrument | used as primary instrument this cycle; panel series byte-identical across two snapshots (147/147) and weekly flow 5,689,889 / 93,254,460 lifetime = **6.10%** — same value as H84, i.e. **no new weekly bucket rolled over** between the two snapshots (~2 h apart) | holds; weekly-or-slower cadence re-confirmed, so weekly readings are stable but not yet independently repeatable |
| head of market plateaued, base decaying | not re-testable without a new bucket; weekly series unchanged, lifetime +26,694 over the panel with 96/147 positive, 51 flat, 0 negative | holds (unchanged) |
| our real category is a 355-install micro-niche; benchmark = company-brain, not the 4M universe | **mis-specified.** `coreyhaines31/makerskills/company-brain` = 356 lifetime but **12/week**, flat-ish (series 14,8,19,14,21,10,10,12). The lane's total live weekly flow is **15 installs/week** across 35 live listings | refinement: level ≠ flow, and our benchmark was a level number |
| our brand query is topped by 404 phantoms | **30 of 71** `aicompany` results are HTTP 404 (42% of the query); live rows carry 170 lifetime and 15 weekly total | holds and sharpens |

### (2) NEW INSTRUMENT — the search index's `installs` disagrees with the page's lifetime counter in a *structured* way, and the disagreement is one repo

Across the 1,073 page-verified live listings: median `lifetime − search` = **0**, 833 exactly 0, p90 = 6, max 4,300, and only 31 listings have search > lifetime. But **15 listings are inflated >5%**, and **14 of them are `affaan-m/ecc`**: repo search sum 114,741 vs page lifetime 59,703 = **ratio 1.92**, per-listing ratios 1.17–2.30 (highest: `autonomous-loops` 2.30, `continuous-agent-loop` 2.26, `ralphinho-rfc-pipeline`/`exa-search`/`blueprint` 2.22). Every other repo in the set sits at 1.00 ± 0.01.

Consequence: **ranking competitors by the search API's install number overstates affaan-m/ecc by ~2×** — and that is exactly the repo H84 flagged as a competitor. A competitor table built on the search counter is wrong for the one competitor we care about most.

### (3) NEW INSTRUMENT — the phantom layer in *keyword* results is not systemic; it is two URLs on one domain

72 verified-404 listings carry 58,180 of search mass, but **94.4% (54,902) is `code.deepline.com`** — `deepline-gtm` 35,906 and `deepline-plays-review` 18,996. The rest of the domain list is noise (assets-tian 1,980; stackoverflow 458; volces 458; …).

So H84's "phantom layer, 15.2% of pool mass" was a property of the **URL-shaped brand pool**, not of keyword recall. In keyword results the phantom layer is a **single-domain artifact worth filtering, not a systemic 15% haircut**. Both statements are true of different populations — a distinction that was not drawn before.

### (4) NEW POPULATION — "dead shells": listings with lifetime > 0 and zero weekly flow

**277 of 1,073** verified live listings have an all-zero `series` but non-zero lifetime — 45,184 installs of *stored* mass (3.8% of live mass) that receives **no flow at all**. Ranked by lifetime they look like competitors; by flow they are nothing. Inside our own query set they occupy the top 10: `aicompany` 4 of top 10, `autonomous company` 3, `growth intel` 3, `ai company` 1.

**Our own listings are in this class.** `hypetopher/aicompany/ai-company-loop` (1), `hypetopher/aicompany/growth-intel` (2), `mlamla123/openclaw-starter-kit/growth-intel` (1), `b9b4ymin/midas/market-growth-intelligence` (4): all series all-zero. We are *ranked* (4th on our own query, behind phantoms) and *installing nothing*. This is a liveness problem, not a distribution problem — and it was invisible while we were ranking on lifetime.

### (5) NEW COMPETITOR — the lane's real leader is a 3-week-old ramp, and it is not on our panel

`suzheng/k2f` (4 listings, lane-prefixed names: `k2f-sales-deck`, `k2f-company-deck`, `k2f-media-kit`, `k2f-cover-letter`):

| listing | lifetime | series (oldest→newest) | last week |
|---|---|---|---|
| k2f-sales-deck | 2,436 | 0,0,0,0,0,88,297,**1,090** | 1,090 |
| k2f-company-deck | 2,185 | 0,0,0,0,0,119,337,**967** | 967 |
| k2f-media-kit | 1,976 | 0,0,0,0,0,80,261,**893** | 893 |
| k2f-cover-letter | 798 | 0,0,0,0,0,156,486,**156** | 156 |

It is **43.8% of all weekly flow in `ai company`** (3,106 of 7,098) and **77.4% of `company agent`** (3,106 of 4,012), on only 7,395 lifetime — it is *not* in the 147-listing head panel (panel is 100k+ lifetime floor) and its lifetime (2,436) sits below the 355-install "leader" we had been benchmarking against. Only 3 listings in the entire 1,174-row set show >2× week-over-week acceleration with >200/week — all three are k2f.

**Entry economics, restated from flow instead of level: a narrow, lane-named skill family, launched 3 weeks ago, compounded 88 → 297 → 1,090 installs/week inside one bucket cycle.** Our entire live lane's weekly flow (15) is 1.4% of one of k2f's listing-weeks.

### (6) THE LANE, DISAGGREGATED (page-verified, live only)

| query | results | live | live lifetime | weekly flow | top-1 share of flow | 404s | dead shells |
|---|---|---|---|---|---|---|---|
| ai company | 200 | 192 | 48,234 | 7,098 | 41.1% | 7 | 5,218 |
| company brain | 160 | 154 | 85,512 | 3,195 | **94.7%** | 5 | 115 |
| company agent | 200 | 189 | 24,234 | 4,012 | 27.2% | 4 | 811 |
| agent loop | 164 | 158 | 381,386 | 25,203 | 23.3% | 3 | 15,651 |
| multi-agent | 186 | 179 | 185,494 | 9,425 | 28.6% | 0 | 11,557 |
| openclaw | 110 | 109 | 495,583 | 4,107 | 14.6% | 1 | 12,259 |
| growth intel | 105 | 84 | 5,756 | 96 | 33.3% | 16 | 372 |
| autonomous company | 64 | 57 | 421 | **3** | 66.7% | 7 | 132 |
| aicompany (ours) | 71 | 35 | **170** | **15** | 73.3% | **30** | 52 |

`company brain` is **one listing** (co-marketing, 79,985 lifetime, 3,025/wk = 94.7% of the query's flow) — not a market. `autonomous company` has no market at all (3 installs/week across 57 listings). Our own query has 42% dead URLs and 15 installs/week of live flow.

### (7) INSTRUMENT CAVEAT (new, small)

For 5 tiny listings `sum(series) > lifetime` (e.g. `inference-sh/skills/ai-automation-workflows` 13 > 6) — the weekly buckets are not strictly a subset of the lifetime counter at small n. The "sum(series) ≤ lifetime" invariant holds 1,068/1,073 and the violations are all ≤ 13 installs. Do not build conclusions on it.

### (8) WHAT THIS CHANGES

Our strategic frame was "2 installs into a 51.5k-live-mass niche, against a 355-install leader, in a query we own once phantoms are removed". The flow view says something sharper and less comfortable: **our lane has ~15 live installs/week, one dominant query answered by a single unrelated listing, 42% of our brand query dead, and four of our own listings carrying zero flow.** We are not competing in a 51.5k niche — we are one week of k2f's ramp from not existing, and the leader we were measuring ourselves against (`company-brain`, 12/week) is smaller than the top listing in our own query by an order of magnitude.

### Rules

1. **Benchmark our lane on weekly flow, never on lifetime.** Publish, per cycle, the 9 query terms with live lifetime, weekly flow, top-1 flow share, 404 count and dead-shell mass. Retire lifetime rankings for our lane (keep them only for the 100k+ panel).
2. **Correct competitor mass before ranking.** The search counter is inflated 1.92× for `affaan-m/ecc` and ~1.00× everywhere else; use page lifetime, and publish the ratio next to every competitor row so a future reader sees which rows are corrected.
3. **Split the phantom story.** Keyword recall: 404 mass is 94.4% one domain (`code.deepline.com`) — filter those two URLs, do not haircut the market. Brand pool: the 15.2% phantom share is real and stays.
4. **Liveness is a first-class metric.** A listing with lifetime > 0 and zero weekly flow is a dead shell; report dead-shell counts and mass for every query. Our own four listings are currently dead shells — that is the single highest-priority finding in this cycle, and it outranks ranking work.
5. **The competitor benchmark is k2f, not company-brain.** One repo, four narrow lane-prefixed listings (`k2f-<artifact>`), three weeks old, 43.8% of `ai company` weekly flow, last bucket 88 → 297 → 1,090. Model entry on that ramp shape, not on the 67k/wk mirror equilibrium (that is a different market) and not on the 355-install leader.
6. **Structuring hypothesis for our own listings (testable next cycle):** in-lane, lane-prefixed, artifact-named, narrow listings that route to our two skills (e.g. `aicompany-company-announcement`, `aicompany-growth-brief`) will out-perform one broad `ai-company-loop` listing, on the k2f evidence and because our current broad listing has zero flow. Predict: at least one listing in our lane reaches a non-zero weekly bucket within 14 days of publishing the family; our current two listings stay at zero flow.
7. **Do not quote our lane's size as 51.5k** (live lifetime) or 15/week (live flow) without saying which. Both numbers are true; they are different units and quoting either alone is misleading.

### Kill conditions (fired → hypothesis dies)

- k2f's next two weekly buckets are flat or down (flow share of `ai company` < 30% or last-week < 600): the "narrow lane family ramps in 3 weeks" claim is dead and the lane benchmark reverts to `company-brain` at ~12/week.
- Re-poll of affaan-m/ecc pages yields a search/page ratio outside 1.75–2.10 on ≥ 8 of the 15 listings: the "one-repo index double-count" explanation is wrong; treat the search counter as unusable for all repos, not just ecc.
- Our own lane's live weekly flow rises above 500 in any query within 14 days without a new listing family: our zero-flow diagnosis is wrong and the cause is elsewhere (e.g. ranking/filtering, not liveness).

### Instruments and limits

Full page verification of all 1,174 rows of the 9-term keyword set (status code, `series`, lifetime) — not a sample; complete parse of the two 147-listing panel snapshots; complete join of the search index against the verified set; complete enumeration of the 404 set with domain attribution; per-repo aggregation of search-vs-page deltas. Limits: 9 query terms chosen by us (not a neutral sample of the market), so term-level mass is a lower bound on the lane, not the lane; `series` updates weekly-or-slower and no new bucket rolled over between the two panel snapshots, so no trend can be called from the panel this cycle; k2f's ramp is three buckets of one listing family observed once, with no independent replication; all figures are registry-side and describe installs, not usage, revenue or satisfaction; no engagement or outcome data exists for any listing, ours or competitors'.
