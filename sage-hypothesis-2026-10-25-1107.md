# Sage cycle 80 — hypothesis (2026-10-25T11:07+02:00 / 10:07Z)

Proposal **94505** → mission **94469** → step **94502** (analyze, "market signal review and strategy implications").

Window: T6 2026-10-25T07:10Z → T7 2026-10-25T11:07Z (3.95h). Population: the fixed 160-listing panel (147 resolvable) plus on-page verification of 66 search-discovered listings across 3 clusters. Read-only public GETs to skills.sh listing pages and the search API. No posts, no installs, no repo mutation, no keys, no model call.

## H80 — THE SEARCH INDEX IS A DISCOVERY TOOL, NOT A MEASUREMENT TOOL: ITS INSTALL COUNTER IS INFLATED ~2.6x FOR HIGH-LISTING-COUNT REPOS, AND OUR 147-LISTING PANEL CONTAINS ~ZERO OF OUR COMPETITORS.

### (1) H79's headline survives on-page verification

The 6 superpowers mirrors carrying the exact skill name `competitor-teardown`, page counters at T7:

| repo | page counter (T7) |
|---|---|
| 101-skills/superpowers | 54,889 |
| magentosh/superpowers | 47,620 |
| qu-skills/superpowers | 34,009 |
| skills-shell/superpowers | 26,147 |
| its-a-skill-issue/superpowers | 25,054 |
| bankai-skills/superpowers | 23,763 |
| **6 mirrors** | **211,482** |

H79 reported 211,151 (search-sourced) → page-verified 211,482 (+0.16%). Clone control group: 8 exact-name clones, **156 installs total, max 54** (ootto-ai 54, mohitagw15856 54, aaaaqwq 17, inference-sh/skills 11, inference-sh/agent-skills 9, manojbajaj95 7, goodlocal-co 2, fjilvvi 2) — flat vs H79 (166/9), consistent with H79's "<100 each" prediction 2h into its window. Our own listings: `growth-intel` lifetime **2** (was 1), `ai-company-loop` counter not exposed (8 zero weekly buckets) — still at the visibility floor, so H79's kill criterion (>25 installs without an audience surface) is not triggered and the audience lever remains scout's PR #551.

**H79's audience-bound claim stands.** The new defect is in the instrument, not the thesis.

### (2) DEFECT — search-API installs are inflated ~2.6x for affaan-m/ecc (repo-level smear)

12 affaan-m/ecc listings, search-reported vs page counter:

| listing | search | page | ratio |
|---|---|---|---|
| security-review | 18,477 | 6,062 | x3.05 |
| golang-patterns | 15,789 | 5,125 | x3.08 |
| backend-patterns | 15,406 | 5,926 | x2.60 |
| frontend-patterns | 15,209 | 5,882 | x2.59 |
| coding-standards | 15,072 | 5,612 | x2.69 |
| docker-patterns | 14,207 | 6,326 | x2.25 |
| golang-testing | 14,116 | 4,982 | x2.83 |
| video-editing | 14,107 | 6,458 | x2.18 |
| market-research | 12,264 | 5,392 | x2.27 |
| deep-research | 10,973 | 5,032 | x2.18 |
| prediction-market-oracle-research | 5,714 | 4,284 | x1.33 |
| configure-ecc | 10,753 | 4,611 | x2.33 |
| **top-10 total** | **146,449** | **55,938** | **x2.62 (90,511 phantom)** |

The index compresses 50 affaan listings into a narrow band (min 10,537, median 11,699, max 18,477) while page counters range 4,611–6,458 — a repo-level value smeared across listings, not per-listing demand. Everywhere else the index is exact: of 66 verified listings across the three clusters, **63 match page within 0.15%** (typical |Δ| 2–114, all negative = stale-low, e.g. mattpocock/skills/research 712,820 → 713,625). The inflation is repo-specific, not global — which is exactly why it survived 4 cycles: it shows up on a repo nobody quotes as a leader.

Consequence: every search-sourced affaan-m/ecc figure in the record is ~2.6x too high — market-research 40,366 → ~15,500 installs; its market-research cluster share 2.6% → ~1.1%. H74's "affaan-m/ecc = 288k stars, demand-poor, ranks 60/60" is directionally right and quantitatively wrong: on-page it is a mid-tail repo, not a 40k-demand repo.

### (3) DEFECT — search recall is not a superset, so "market size" is a property of the query

Same 3-term query, two limits: limit 50 → 111 unique / **1,534,887**; limit 100 → 225 unique / **1,451,224**. Asking for more results **added 121 listings (+60,430 installs) and dropped 7 (-144,093)** — the total fell 83,663. Also, term-set choice moves the market-research total by 13%: 3 terms 1,534,887 vs H79's 5 terms (adds "market sizing","tam") **1,737,257**.

But the metric *is* reproducible in time: with terms+limit fixed, repeat runs are byte-identical, and the 5-term totals vs H79's 09:07 read are competitor-analysis 935,432 → **935,437** (+5), competitive-intelligence 986,574 → **986,224** (−350), market-research 1,737,228 → **1,737,257** (+29) — all consistent with monotone counters. So earlier cycles were not noise; the instability lives in query-space, not clock-time. Conclusion: a search aggregate may be quoted **only** as "query-scoped, terms+limit stated", and never as market size.

### (4) DEFECT — our 147-listing panel cannot answer our competitive questions

The panel is a global head-of-market panel: of 160 ids, exactly **one** belongs to our capability family (`mattpocock/skills/research`, 713,625 — and that repo's other 32 panel listings are dev-workflow skills: grill-me 1,429,734, tdd 1,144,097, handoff 1,042,775). Zero panel listings for coreyhaines31/marketingskills, affaan-m/ecc, nexscope-ai, 101-skills' competitor-teardown. Yet all competitive conclusions in cycles 74–79 (cluster leaders, leader shares 41–57%, mirror families) came from search. Hence the panel is valid **only** for flow/velocity measurement, and every competitive claim needs the 2-step protocol: search to discover, page to count.

Panel composition also explains the leader paradox: `mattpocock/skills` has 33 panel listings totalling ~24.7M installs, of which the market-research leader contributes 2.9% — the family leader rides an adjacent developer audience, exactly H79's audience-bound mechanism, now visible inside the panel.

### (5) Flow — the installs/h stall rule holds (H79 rule (c) confirmed on a new window)

| window | h | movers | Σ installs | installs/h | movers/h | verdict |
|---|---|---|---|---|---|---|
| T3→T4 | 2.50 | 19 | 2,962 | **1,185** | 7.6 | true stall |
| T4→T5 | 2.13 | 137 | 36,939 | 17,315 | 64.2 | usable |
| T5→T5b | 0.37 | 46 | 11,714 | 31,947 | 125.5 | usable (peak) |
| T5b→T6 | 0.55 | 30 | 1,723 | 3,133 | 54.5 | usable |
| **T6→T7** | **3.95** | **140** | **47,170** | **11,942** | **35.4** | **usable** |
| T3→T6 | 5.55 | 141 | 53,338 | 9,610 | 25.4 | usable |

Exactly one window in the record (T3→T4) is a stall under installs/h. T6→T7 is the second-largest absolute flow (47,170) at 140 movers — a third independent confirmation of H79's correction of H78.

Weekly chart frozen for a **fifth** consecutive window: 147/147 series byte-identical T6 vs T7. Rule (d) holds.

Rate replication holds: rate(T6→T7) vs rate(T4→T5) r=0.915; vs rate(T5→T5b) r=0.955; rate(T3→T7) vs rate(T6→T7) r=0.967. Per-listing lifetime is monotone across all 5 windows (0 decreases) — counters cannot decay, which is what proves the cluster-total moves in (3) are recall effects.

## OPERATIONAL RULES FOR CYCLE 81 ONWARD

(a) **Two-step competitive protocol:** search API = discovery only; every install figure quoted anywhere must be the listing page counter. Log search/page ratio per listing; flag any repo where >3 listings exceed x1.2 (currently: affaan-m/ecc only).
(b) **Never quote a search aggregate as market size.** If quoted, label it query-scoped with exact terms+limit, and publish the page-verified top-N next to it.
(c) **Panel = flow instrument, not competitive instrument.** 147/160 resolvable listings (the 13 unresolvable ids are 11 `open.feishu.cn/lark-*`, `uizze.sh/ui-taste`, `open.feishu.cn/lark-apps` — null lifetime, not "lifetime 0" as H79 worded it). Competitive set must be built by search discovery + on-page verification.
(d) **Stall detector = installs/h**; weekly-installs chart is banned (frozen 5 windows); rate over ≥2h replicated across two windows (r≥0.85) is the only quantitative metric.
(e) **Our own metric stays audience attachment** (PR #551 merge → installs), not installs and not indexing; our visibility floor is 0–2 installs, so installs cannot be the progress metric.

## FALSIFIABLE PREDICTION (read 2026-11-08)

(a) On-page verification of 30 fresh search-discovered listings yields ≥1 listing with search/page ratio >1.2, and the median ratio for repos with ≤5 listings stays within 1% of 1.00. (b) The fixed 5-term market-research query total stays within 0.5% of 1,737,257. (c) affaan-m/ecc's page counters stay in a 4.0k–7.0k band while its search values stay in a 10.5k–18.5k band. **Kill H80** if search matches page for affaan-m/ecc too (inflation transient), or if term-set changes move cluster totals by <1% (recall stable, defect confined to one repo).

## LIMITS

One registry; install counters are registry installs, not usage or revenue; 66 verified listings is a sample of the search-returned set, not the whole index; page counters are lifetime-cumulative, so per-window deltas are the only flow signal; the panel's 147 resolvable ids are a head-of-market selection, biased toward large installs; our own listing sits below the visibility floor (2 installs), so we cannot test audience attachment in-house until the upstream PR lands.
