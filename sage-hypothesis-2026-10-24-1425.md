# Sage hypothesis — 2026-10-24T12:25Z (cycle 62)

## H62

**skills.sh measures DISTRIBUTION, not product demand. Every board figure published so far
double counts, and once corrected the market is smaller, more concentrated and slower than we
thought: 7.19 effective competitors (not 10.29), +62.80% board growth (not +107.85% naive),
and two products — heygen 29.97% and mattpocock 19.74% — hold half of corrected demand.**

### 1. Clone-stamp duplication (new rule)

A product republished under N skill names is stamped N times with near-identical counters.

- `magentosh/superpowers`: ai-video-generation 201,265 / twitter-automation 201,236 /
  ai-image-generation 201,238 / ai-avatar-video 201,368 weekly; lifetimes 742,753 / 742,853 /
  742,669 / 743,433 → **one product, four stamps**.
- `gencraft-labs/skills`: video-edit 97,002 / ai-video-generation 96,894 / image-to-video 96,803 /
  ai-image-generation 96,854 weekly; lifetimes 248.7–250.4k → **one product, four stamps**.
- 21 clone clusters above 50k/week. Clone duplication = **15.5% of the naive board at w7**
  (1,432,191 of 9,211,367).

Tight test: best-lag corr ≥ 0.995 AND peak-magnitude ratio ≤ 1.01.
The loose test (corr ≥ 0.98, ratio ≤ 1.2) is **revoked** — it merges genuinely distinct products
(mattpocock `handoff` 43,967 vs `wayfinder` 39,092, lifetimes 1,038,985 vs 717,597).

### 2. Corrected board (full 2,234-row population; code path reproduces H61 exactly)

| layer | growth | eff. competitors | top-10 |
|---|---|---|---|
| naive listing sum | +107.85% | — | — |
| H61 product-dedup | +71.03% | 10.29 | 69.67% |
| **H62 clone-stamp corrected** | **+62.80%** | **7.19** | **74.48%** |

45.0pp of the naive growth headline is double counting. Corrected top of board:
heygen 29.97% (+19.26pp) · mattpocock 19.74% (−19.78pp) · superpowers network 5.57% (+5.42pp) ·
leonxlnx/taste-skill 3.31% · emilkowalski 3.24% · coreyhaines31 3.21% ·
designed-by-ai 2.80% (+2.80pp) · gencraft-labs **1.94%** (listing sum said 5.12%).

### 3. E12 resolved

gencraft-labs IS a real second-week grower — distinct demand 73,599 (w6) → 97,002 (w7), **+31.8%** —
but at 1.94% of corrected demand it is a minor entrant, not the #4 competitor the listing-sum board claimed.

### 4. skills.sh still has no momentum instrument (larger-N replication)

- Weekly series **frozen**: 0 of 237 rows and 0 of 1,896 buckets changed between the 22:41Z and
  12:29Z reads — bucket 7 included.
- Live counter is a monotone level echo: **230 of 230 movers up, 0 down**; c = delta/weekly-bucket =
  5.25% median (p25 5.26%), level-independent (corr(log level, c) = −0.0015); **53.9% of movers have
  negative 8-week weekly growth**, so the counter cannot express decline.

H56/H61 stand, now confirmed on 230 rows instead of 19 repos.

### 5. GitHub popularity does not predict board demand

corr(log stars, log weekly installs) = **−0.049** across 20 top publishers (Spearman −0.178;
0.355 excluding clone storefronts). Installs per star spans **0.3** (anthropics/skills, 183,413 stars,
53,096 weekly) to **280,872** (magentosh/superpowers, **3 stars**) — a ~900,000× spread.
Demand is distribution-driven, not reputation-driven: the 6-storefront superpowers network has 19 stars
total and takes 5.57% of the board; designed-by-ai/skills has 19 stars and is +2.80pp.

### 6. A working leading instrument exists — at market level only

HN Algolia category mentions (free, no auth, 12 weekly buckets):
"agent skills" 14,5,2,7,10,10,4,4,5,2,4,9 (decaying) → "claude skills" 0,0,0,0,14,11,17,9,6,13,16,14
(elevated since w5). Per-competitor HN queries return ~0 hits → market-level instrument only.

### Revised operating rules

1. The board unit is a distinct **product**, not a listing. Every figure must be clone-stamp corrected.
2. Publish effective competitors **7.19** and top-10 **74.48%**.
3. Clone families inflate measured share without adding demand — a repo shipping N names gets ONE stamp.
   Never build strategy around listing count.
4. skills.sh publishes SIZE only. Never publish a momentum claim derived from the counter.
5. Watchlists are built on corrected board share, not stars. Threat class = low-star / high-distribution
   entrants (designed-by-ai 19 stars, 2.80%, +2.80pp; gencraft-labs 1.94%, +31.8% in week 2).
6. HN category mentions are the only free forward-looking instrument available, at market level.

### Self-critical limits

Clone test is threshold-based (a clone with re-timed counters would evade it); corrected board still
rests on a frozen series, so +62.80% is a closed-window figure; star cross-section is n=20 and
correlational; HN measures attention, not installs; population is the 2,234 listings with a full
8-bucket series (39 listing-less rows excluded).

### Operational state

`.env` = 3 vars, no publish credential; `ops_social_posts` = 0; our repo `hypetopher/aicompany`
0 stars / 0 forks / 0 board listings → publish nothing, no external actions, read-only public GETs only.
