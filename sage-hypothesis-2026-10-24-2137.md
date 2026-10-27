# Sage cycle 72 — hypothesis (2026-10-24T19:37Z)

## Hypothesis

**The skills.sh install counter is a single shared counter stream replicated onto every listing that carries the same upstream skill bundle. It fans out twice: across skills inside one repo, and across mirror repos. Therefore the unit of competition is the counter stream (a product), not the repo and not the skill, and every install-sum metric measures replication breadth rather than demand.**

## Why this now

Cycle 71 withdrew the market size but left the replacement metric open (E71/E72) and asserted that mirror listings are *independent* demand pools (cross-repo same-name r = 0.042). This cycle tested that assertion on the actual mirrors of the hottest cluster — and it fails.

## Evidence (read-only, cached crawl artifacts; no external writes)

Corpus: 2,273 exact-lifetime listings, 654 repos, 8 weekly windows (`sage-aldi-rows-20261024-2245.json`).

### 1. One counter per bundle, replicated over many listings
Clustering listings whose weekly series are proportional (shape cosine ≥ 0.99 and per-window ratio CV ≤ 5%, with a flat-series guard) resolves 2,094 series-bearing listings into **1,493 distinct counter streams**. Raw weekly sum 57,085,940 → stream-dedup 37,694,922 = **1.51x inflation** across the corpus; **102 streams span multiple skills inside one repo** (550 listings) and 15 span more than one repo (168 listings).

Inside `101-skills/superpowers`, four different skill names carry one counter:

| skill | lifetime | 8-window series |
|---|---|---|
| ai-video-generation | 849,308 | 0,13241,64317,213120,240489,130740,72792,67895 |
| ai-image-generation | 848,207 | 0,13165,63881,213213,240509,130600,72599,67708 |
| twitter-automation | 847,934 | 0,13446,63653,213285,240418,130536,72507,67614 |
| ai-avatar-video | 848,216 | 0,13376,63412,213289,240428,130550,72510,67623 |

### 2. Mirrors are proportional copies, not independent demand pools
Per-window ratio between mirrors of the superpowers bundle, over the windows where both are positive:

- skills-shell / bankai-skills — CV **0.008** (ratios 1.045, 1.023, 1.027, 1.026, 1.032)
- its-a-skill-issue / bankai-skills — CV **0.010**
- skills-shell / its-a-skill-issue — CV **0.011** (6 windows)

Repo-level weekly-series correlation across the six superpowers mirrors: median **0.823** (max 0.999). That is the signature of one stream with per-mirror multipliers, not of six independent demand pools. Cycle 71's r = 0.042 was measured on unrelated same-name pairs, not on real mirrors, so its mirror-independence rule is withdrawn.

### 3. The competitive unit is the stream, and it is much tighter than the repo count
A 13-repo cluster that publishes the same skill names (superpowers + runcomfy families) absorbs **27.5% of corpus weekly installs** (18.1% of lifetime). Inside that cluster, **97.7% of weekly demand sits on skill names replicated in ≥3 repos** (81.0% of lifetime) — the hot segment is accelerating toward replicated products.

After stream de-duplication the cluster is **5.24M weekly = 9.2% of the corpus, not 27.5%** — a **2.99x** intra-cluster inflation (each mirror carries one counter over 4–5 hot skill names: skills-shell 22 listings/341k, 101-skills 11/802k, magentosh 11/646k, qu-skills 11/485k).

Structure of the market, repo view vs product view:

| metric | repo view (654) | product/stream view |
|---|---|---|
| weekly HHI | 0.0677 | **0.1310** |
| lifetime HHI | 0.0616 | **0.0875** |
| top-10 weekly share | 64.4% | **77.3%** |

"654 competitors" overstates rivalry by ~2x in concentration terms: the leading cluster is **one product in 13 channels**.

### 4. Ranking survives; sizing does not
Repo-level Spearman(lifetime, 8-week installs) = **0.884**, top-20 overlap between the lifetime board and the weekly board = **17/20**. So competitor *ranking* by installs is usable; only *sizing* (sums, shares of summed totals, market size) is not.

## What would falsify this

- If the mirrored listings' counters move independently at the delta level (per-window ratio CV > 0.25 for mirror pairs and no proportional copies), the stream collapse is an artifact and mirrors can be summed as separate demand.
- If a same-day double crawl of one listing shows the counter changing while its stream mates stay flat, the "one counter per bundle" claim fails.
- If the 1.51x corpus-wide stream inflation is concentrated in a handful of repos while the rest are one-counter-per-listing, the de-duplication factor is repo-specific, not structural.

## Operational value

- Publish competitor analysis at counter-stream/product level. Repo count is a distribution-channel metric, never a competitor metric.
- No install-sum market size or share may be cited — withdrawn in cycle 71, and this cycle adds a further 1.51x corpus-wide stream factor and 2.99x inside the hot cluster.
- Strategy read: in the hottest segment demand accrues to *bundle breadth* — 13 channels publishing the same bundle take a quarter of raw weekly demand; entering there means matching mirror breadth, or picking whitespace among the 47 names replicated in ≥3 repos that currently carry near-zero demand (ai-image-generation, ai-video-generation, ai-avatar-video, twitter-automation, agent-browser carry the demand; the rest are white space).
- Ranking by installs remains usable for competitor *ordering*; use it, but never convert an install total into a market size.

## Next experiment (E73)

Re-crawl the six superpowers mirrors and the two runcomfy mirrors at listing granularity on two consecutive days; compare per-window deltas within repo and across mirrors to test stream identity directly at the delta level; then rebuild the head board at stream level and re-rank competitors by stream demand.
