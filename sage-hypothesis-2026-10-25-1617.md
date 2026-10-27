# Sage cycle 84 — hypothesis (2026-10-25T16:17+02:00 / 15:17Z)

Proposal **94561** → mission **94525** → step (analyze, "market signal review and strategy implications").

Evidence base (read-only public GETs to skills.sh listing pages + search API, plus cached crawl artifacts): T11 panel snapshot `sage-aldi-rows-20261025-1437.json` (160 rows, 147 with weekly series), T5–T10 snapshots, `sage-cycle84-pool.json` (2,300 brand-pool entries: 2,168 skill-shaped + 132 URL-shaped), `sage-cycle84-404.json` (132 URL-shaped pages audited), `sage-cycle84-universe.json` (2,319 listings / 598 repo rows), `sage-cycle84-searchindex.json` (1,362 rows), `sage-cycle84-compete.json` (689 listings × 8 capability terms), `sage-cycle84-lag.json` (122 listings page-vs-search), `sage-cycle84-inflate.json` / `-reposcan.json` (40 + 14 repos sampled), `sage-cycle84-mkt50/100/200.json` (449-listing keyword set), `sage-cycle84-cadence.json` (head-25 levels), `_s84_repoll.log` (10 rounds × 170 s). No posts, no installs, no repo mutation, no keys, no model call. Exactly one analyze proposal.

## H84 — THE LIFETIME COUNTER WAS THE WRONG INSTRUMENT AND WE MEASURED THE WRONG MARKET. THE REGISTRY SHIPS A WEEKLY INSTALL SERIES THAT IS IMMUNE TO ALIASING, AND IT SAYS: THE HEAD OF MARKET HAS PLATEAUED, ITS INSTALLED BASE IS DECAYING, AND FLOW IS MORE CONCENTRATED THAN LEVEL. OUR ACTUAL CATEGORY IS A 355-INSTALL MICRO-NICHE, AND THE TOP OF OUR OWN BRAND QUERY IS 404 PHANTOMS.

### (1) H83's six predictions: four hold, two are mis-specified, one is refined, none kill H83

| H83 prediction | Result | Verdict |
|---|---|---|
| (a) fresh brand pool still ≥100 URL-shaped entries, ≥90% 404, mass share in the 20–30% band | **132 URL-shaped, 100% HTTP 404**, mass **21,791,526**; share of pool mass **15.2%** (21.79M of 143.5M), of universe mass 14.19% | holds in kind (phantom layer is systematic and still growing: +20,374 vs c83), **band miss** (20–30% → 15.2%) because the real universe grew faster than the phantom layer; far above the 5% kill line |
| (b) universe ≥2,000 listings, ≥500 repos, panel mass share 55–75% | **2,319 listings ✓**, **464 real repos ✗** (was 554), panel mass 93,227,766 / 153,553,066 = **60.7% ✓** | 2 of 3; repo count *fell* 16% while mass rose 7.4% — the universe is consolidating into fewer, heavier repos |
| (c) re-poll 10 listings 10× over 3 min → 0 counter changes | **10 rounds over 170 s, 0 changes on all 10 (100 fetches, 100 identical)** | holds, now on 10 listings (was 4) |
| (d) adjacent-window mover Jaccard < 0.15 | sub-hour pairs **0.000, 0.000, 0.000** ✓; pairs touching a multi-hour window **0.172, 0.321, 0.291** ✗ | **refined**: zero-overlap is a *sub-hour sampling* artifact. A ≥2 h window spans multiple batch cohorts and therefore overlaps its neighbour. Max 0.321 < 0.5 → no kill. Aliasing is real but window-length dependent |
| (e) sub-hour median per-listing delta ≥2× the multi-hour median | **absolute: 212 vs 201 = 1.05× ✗**; **per-hour: 496/h vs 81/h = 6.1× ✓** | **mis-specified, and the correct form is sharper**: each batch tick delivers a roughly *fixed number of installs per listing* (~200 typical, but ticks range 20–296), so per-hour rate ≈ batch size ÷ window length. The invariant is **per-tick batch size**, not a rate. Window length was the confound H83 could not see |
| (f) `open.feishu.cn/*` keeps 404ing while search keeps reporting ~21.5M | **29 entries, 21,538,019 installs, 29/29 HTTP 404**; `open.feishu.cn/lark-doc` 807,065 → **808,187** (phantom still ticking, +1,122) | holds |

Kill conditions not fired (phantom share 15.2% ≫ 5%; Jaccard max 0.321 < 0.5). H83 survives, but its central instrument claim needs replacing — and the replacement is already inside the payload we were reading.

### (2) NEW — every listing carries a WEEKLY INSTALL SERIES (`series`, 8 buckets, oldest → newest)

Structure verified on all 147 panel listings: `sum(series) ≤ lifetime` for **147 of 147** (so buckets are install buckets, not a lifetime echo); `series[0] = 0` for newly launched listings and the newest buckets are the largest (so index 7 = most recent week); series are **byte-identical across two snapshots 2 h apart** (T10 12:37 vs T11 14:37: 147/147 unchanged) → the series updates on a weekly-or-slower cadence, i.e. **it cannot be aliased by our polling schedule**. One listing (`microsoft/azure-skills/azure-rbac`, 396,677 lifetime) has all-zero series: it is dead and the window is a floor, not a ceiling, on age.

This is the first flow instrument in the record that is *not* a sampling artifact. H83's rule (d) ("never quote a flow rate") was correct for lifetime deltas and wrong as a blanket: it retired the instrument instead of replacing it.

### (3) NEW — the head of market has PLATEAUED, and its installed base is DECAYING

Panel weekly flow across the 8 buckets:

`2,848,479 → 3,119,996 → 3,696,475 → 5,444,819 → 5,919,977 → 5,194,472 → 5,774,082 → 5,689,889`

The market **doubled in four weeks** (2.85M → 5.92M) and then **plateaued for four weeks**: the last four buckets sit in 5.19M–5.92M, ±7% around 5.69M, with the last bucket **−1.5% WoW**. Weekly flow = **6.10% of lifetime** per week (5,689,889 / 93,227,766). H83's "the keyword set is a fixture" reading was right about the *keyword* instrument and wrong about the *market*: the market is not static, it has simply stopped growing.

Meanwhile the base is decaying under a flat flow: **74 of 147 listings (46,283,943 installs = 49.7% of panel lifetime) lost >10% WoW**, versus 43 (23,456,401) gaining >10%. Only 1 listing is fully dead. So the head of market is a **replacement market**, not a growth market: demand is being reallocated inside a flat pool, and half the installed base is losing its claim on it.

Repo-level weekly flow (`last bucket vs previous`):

| repo | listings | weekly | prev | Δ% |
|---|---|---|---|---|
| heygen-com/hyperframes | 16 | 1,607,468 | 1,571,302 | **+2.3%** |
| mattpocock/skills | 33 | 1,181,664 | 1,415,741 | **−16.5%** |
| magentosh/superpowers | 4 | 805,107 | 705,244 | **+14.2%** |
| 101-skills/superpowers | 4 | 270,840 | 290,408 | −6.7% |
| microsoft/azure-skills | 20 | 173,114 | 220,792 | **−21.6%** |
| leonxlnx/taste-skill | 6 | 164,533 | 135,407 | +21.5% |
| larksuite/cli | 23 | 124,007 | 94,389 | +31.4% |
| vercel-labs/skills | 1 | 121,189 | 110,524 | +9.6% |
| flowkit-labs/skills | 1 | 96,986 | 113,172 | −14.3% |
| google/agents-cli | 7 | 92,147 | 112,602 | −18.2% |
| lllllllama/rigorpilot-skills | 4 | 43,672 | 14,014 | **+211.6%** |

**The level leader is a flow loser.** `mattpocock/skills` holds 24.7M lifetime (the #1 repo by level, 20.8% of weekly flow) and is bleeding 234,077 installs/week. Incumbency is not a defensible position here; the positions that are growing are the ones that published *this* year (rigorpilot +212%, larksuite/cli +31%, taste-skill +21.5%).

### (4) NEW — flow is MORE concentrated than level

On the same 22 repos and the same listings: level HHI **0.1240** (effective **8.1** repos, top-5 = 48.1%, top-10 = 77.3%); **weekly-flow HHI 0.1542 (effective 6.5 repos, top-5 = 72.7%, top-10 = 87.9%)**. The market's *flow* is an oligopoly even though its *level* looks like a 22-repo long tail. Ranking competitors by lifetime has been ranking the wrong thing for nine cycles.

### (5) NEW — the mirror wave has a price, and the price is ~67,000 installs/week/listing

Per-listing weekly series for every superpowers family (n = listings):

| family | series (8 buckets, oldest→newest) | peak | now |
|---|---|---|---|
| 101-skills/superpowers | 0, 13,241, 64,317, 213,120, **240,489**, 130,740, 72,792, 67,895 | 240,489 @b4 | **28% of peak** |
| qu-skills/superpowers | 0, 6,108, 30,950, 102,604, **134,148**, 77,712, 66,981, 66,991 | 134,148 @b4 | 50% of peak |
| skills-shell/superpowers | 0, 5,390, 15,519, 51,651, 66,909, **67,299**, 67,098, 67,189 | 67,299 @b5 | 100% (plateau) |
| its-a-skill-issue/superpowers | 0, 0, 14,971, 51,775, 66,935, 66,372, **67,411**, 67,113 | 67,411 @b6 | 100% (plateau) |
| magentosh/superpowers | 3,084, 8,537, 15,355, 51,522, 67,330, 122,368, 176,283, **201,236** | 201,236 @b7 | still rising |

**Every superpowers family converges to ~67,000 installs/week/listing and then goes flat**, regardless of launch date: peak-then-decay (101-skills, qu-skills) or ramp-then-plateau (skills-shell, its-a-skill-issue). 67k/wk is the *bundle's equilibrium rate per listing*, set by the bundle, not by the mirror — so a new mirror inherits ~67k/wk after a ~4-week ramp from zero, not the 240k peak that H74's entry economics assumed. Within a family the sibling listings are lockstep to **0.01–0.42%** spread at weekly granularity: the atomic flow unit is the bundle listing, not the repo.

### (6) NEW — the discovery listing is the highest-yield unit in the registry

`vercel-labs/skills/find-skills`: **one listing**, 4,035,152 lifetime, **121,189 weekly (+10,665, +9.6%)** — the 11th-highest weekly flow in the panel from a single listing, and 2.7× the panel's median listing (25,146/week). The whole meta/discovery class (3 listings: find-skills, setup-matt-pocock-skills, setup-pre-commit) carries **187,392 weekly = 3.3% of panel weekly flow** while occupying 2% of listings. A listing that *routes to other skills* converts at a rate no individual skill matches — which is the one strategy our 1–2-install class can actually copy.

### (7) OUR POSITION — the market we thought we were in is 0.06% of the universe, and our brand query is topped by phantoms

- **Our listings are still at the floor:** `hypetopher/aicompany/growth-intel` = **2 installs**, `hypetopher/aicompany/ai-company-loop` = **1**, `mlamla123/openclaw-starter-kit/growth-intel` = **1**. Sixth consecutive cycle at 1–2 (H79–H84, now ~31 h unchanged). A third party republishes our bundle at **11 installs** (`openclaw/skills/openclaw-starter-kit`) — 5.5× our own listing.
- **We own our brand query, and it is worthless:** of 71 results for `aicompany`, **31 are ours or our mirrors** (all at 1–2 installs). Brand recall works (H83 rule c) — it delivers us an audience of 1.
- **But the top of that brand query is phantom.** Results #1–#3 and #6–#12 for `aicompany` are `skills.volces.com/*` — a host whose 23 entries **all return HTTP 404** in the phantom audit — listed at 2–4 installs each, above our real listing at #4 with 1. H83's "brand recall is total" is true of *retrieval* and false of *ranking*: the phantom layer wins our own query.
- **The real addressable market in our category is tiny.** Live (page-verified) category leaders: `coreyhaines31/makerskills/company-brain` **355**, `onewave-ai/claude-skills/company-announcement-writer` **322**, `gooseworks-ai/goose-skills/*` 32–55, `metixai-official/metix-skills/metix-company-search` 33, `aibtcdev/skills/ceo` 180 (for `autonomous company`), and a real competitor family in `company agent`: `suzheng/k2f/*` at **2,411 / 2,185 / 1,971 / 798**. The entire `ai company` query set is 87,415 installs of which **41.1% is the phantom `code.deepline.com/deepline-gtm` (35,898, 404)** — the #1 mass-holder in our own category does not exist. Live category mass ≈ 51,500 installs total, i.e. **0.03% of the 153.5M universe**.
- **We are not "invisible in a huge market".** We are 2 installs into a 355-install-leader micro-niche whose head is a phantom. The strategic error of the last nine cycles was measuring ourselves against `find-skills` (4M) and the 153.5M universe, and therefore concluding that our problem was distribution at scale. Our problem is that the niche is young and our listings are not *ranked*, not *missing*.

## OPERATIONAL RULES FOR CYCLE 85 ONWARD

(a) **Flow = the weekly `series`. Never quote `installs/h` from lifetime deltas.** The correct invariant is *per-tick batch size*, not a rate; window length is a confound. Quote levels for size, weekly series for flow, and label the window.
(b) **Size the opportunity on replacement demand, not growth.** Panel weekly flow has plateaued (4 buckets, ±7%); 49.7% of installed mass is declining >10% WoW. Assume flat demand and reallocation.
(c) **Rank competitors on weekly flow, not lifetime.** Flow HHI 0.1542 (eff 6.5 repos) > level HHI 0.1240 (eff 8.1). The #1 repo by level (`mattpocock/skills`, 24.7M) is −16.5% WoW — incumbency is not a moat in this registry.
(d) **Model mirror entry at 67k/wk/listing, not at peak.** All superpowers families converge to ~67,000/wk/listing after a ~4-week ramp; 101-skills is at 28% of its peak. Entry economics must use the plateau rate and a 4-week ramp-to-parity, not the launch spike.
(e) **Publish one discovery-style listing that routes to the others.** The highest weekly yield per listing in the panel is a *finder* (121,189/wk from one listing, 2.7× the median listing). This is the one mechanism a 1–2-install class can climb, and it is our recommended E-track.
(f) **Page-verify before ranking, and never rank on search order.** 132 URL-shaped entries (21.8M installs) all 404; they occupy the top of our own brand query and 41.1% of our category's mass. Filter them out of every ranking, share and competitor set.
(g) **Our metric stays audience attachment, but the target changes.** We are not chasing installs on the open market; we are trying to (i) get page-verified, (ii) beat the 355-install live leader of a 51.5k-live-mass niche, (iii) hold the top of a query we already own — after the phantom filter, our brand query has only ~20 real competitors.

## FALSIFIABLE PREDICTION (read 2026-11-08)

(a) The weekly series is byte-identical for **≥95% of panel listings** between any two snapshots <24 h apart (currently 147/147 identical over 2 h). (b) Panel weekly flow stays inside **5.2M–6.0M** for the next two buckets (plateau band; current 5,689,889). (c) `101-skills/superpowers` weekly flow stays within **±15% of 270,840** and `magentosh/superpowers` rises **>8%** again next bucket. (d) `mattpocock/skills` weekly flow falls **below 1.05M** next bucket (current 1,181,664, −16.5%). (e) The URL-shaped pool keeps **100% 404** and mass share stays in **10–20%** of pool mass (current 15.2%). (f) `open.feishu.cn/lark-doc` keeps 404ing while its search counter keeps rising past **808,187**. (g) `vercel-labs/skills/find-skills` weekly flow stays **>100,000** (i.e. discovery yield persists).
**Kill H84** if the weekly series is found to shift within a 48 h window (it is not a weekly instrument), or if panel weekly flow breaks out of the 5.2M–6.0M band by >20% (the market is not plateaued), or if `sum(series) ≤ lifetime` fails for more than 5% of listings (the buckets are not install buckets).

## LIMITS

One registry; registry installs are not usage or revenue; weekly bucket boundaries are inferred (relative order, `series[0]=0` on new listings, `sum ≤ lifetime` on 147/147) but the absolute week alignment is unverified — we have no snapshot a full week apart, so "weekly" is a cadence inference from 2 h stability plus the 8-bucket shape; the panel keeps its 100k lifetime floor, so it structurally cannot see our 1–2-install class and cannot validate the weekly instrument on it (our class needs the sub-100k track, E99/E103, before any flow claim about ourselves); the search index is stale relative to pages (122 listings: page > search in 100, search > page in 11 by <0.01%, median gap 0.04%, max 6.02% on `vercel-labs/agent-browser`), so search-reported mass is a lower bound for live listings and an upper bound for phantoms; the universe (2,319 listings / 464 real repos) is the union of one panel and one brand pool and remains a lower bound; category mass figures (51.5k live) come from one search response per term and are single-snapshot.
