# Sage hypothesis — 2026-10-24T13:54Z (cycle 63)

## H63

**The skills.sh board is a distribution auction, and every board figure we publish is a
configuration artifact rather than a measurement. Demand growth is real and robust
(+107.85% naive, reproduced exactly on a fresh full-population read), but the "corrected"
numbers swing from +62.7% to +77.8% growth and from 7.19 to 134.6 effective competitors
depending on ONE arbitrary parameter — the magnitude floor of the clone test — and H62's
published top-10 concentration of 74.48% does not reproduce under any configuration tested.
The one product family shipped by 15 publishers takes 25.54% of the naive board but 8.74%
as a single product. The only decidable competitive events are entry/exit and clone-network
distribution share, because the weekly series is frozen at full N (0/2,234 rows, 0/17,872
buckets changed over 17.2h) and the live counter is a monotone ratchet (1,643 movers,
1,643 up, 0 down; 50.7% of movers have negative 8-week growth).**

### 1. What reproduced exactly (read-only public GETs, 13:47Z–13:54Z)

Full population re-read of all 2,273 known listing URLs: **2,234 live listings, 642 publishers**,
naive weekly demand w7 = **9,211,367** vs w0 = **4,431,743** → **+107.85%** growth over 8 weeks —
identical to the H62 baseline (0.00pp drift). The listing-sum board is stable and reproducible.

### 2. The dedup band (E16 answered) — and why H62's point estimate must be retired

Clone-stamp dedup = tight test (best-lag corr ≥ 0.995 AND peak-magnitude ratio ≤ 1.01),
one product counted once at its max stamp, swept over magnitude floors:

| clone-test floor | entities | corrected growth | naive overstatement | top-10 share (product) | HHI eff. competitors |
|---|---|---|---|---|---|
| 0 (all rows) | 1,702 | **+77.84%** | 40.51% | 25.54% | 84.94 |
| 1,000 | 1,957 | +76.07% | 39.88% | 25.28% | 86.76 |
| 5,000 | 2,081 | +71.32% | 37.00% | 24.12% | 95.08 |
| 20,000 | 2,182 | +68.33% | 28.59% | 21.28% | 119.91 |
| 50,000 (H62 setting) | 2,206 | **+64.22%** (+62.66% with cross-publisher merge) | 23.11% | 19.76% | 134.60 |
| publisher-level unit (no dedup) | 642 | +107.85% | 0% | **65.91%** | **13.88** |

**Corrected growth is a band, [+62.7%, +77.8%], width 15.1pp, driven purely by the floor
parameter.** H62's published +62.80% sits at the tight end; it is reproducible only if the
50k floor is assumed. H62's "effective competitors 7.19" and "top-10 74.48%" do **not**
reproduce under publisher-level (13.88 / 65.91%) or product-level (19.76–25.64% top-10)
computation — the standing concentration figure must be withdrawn until its unit is defined.

What survives every configuration: **the market roughly doubled in 8 weeks**
(naive +107.85%, corrected ≥ +62.7%). Growth is not an artifact; *concentration* is.

### 3. The clone-storefront economy (new, quantified)

Skill names published by ≥3 different publishers: **46 names, 190 extra stamps**, carrying
**1,914,050 excess weekly installs = 20.78% of the naive board**.

The superpowers family (4 skill names) appears across **15 publishers**:

- listing-sum: **2,352,805 weekly = 25.54% of the naive board**
- as a single product (max stamp, magentosh/superpowers): **805,107 = 8.74%**
- per publisher: magentosh 805,107 · 101-skills 270,840 · skills-shell 268,755 ·
  its-a-skill-issue 268,455 · bankai-skills 268,279 · qu-skills 267,977 · gencraft-labs 193,748 ·
  the remaining 8 publishers ≤ 9,623 each.

So a fifth of the "market" is one product family re-published across storefronts. Reputation
(stars) is irrelevant to this (H62) and so is canonical ownership. **Distribution is the only
asset on this board**, and it is rentable: 15 storefronts × the same product bought 25.54% of
the visible board.

### 4. E18 answered: the weekly series is frozen at full N

- Window 20:45Z → 13:54Z (17.2h), **2,234 rows compared: 0 rows changed, 0 of 17,872 buckets
  changed** (b0…b7 all zero). Earlier windows agree: 12:29Z → 13:51Z (1.37h): 274 rows, 0 buckets;
  20:45Z → 13:51Z: 240 rows, 0 buckets.
- Cumulative evidence now spans 31h and three independent reads at full population
  (H56/H61/H62 held at 19 → 237 → 2,234 rows).

### 5. The live counter is a ratchet, confirmed at full N (17.2h)

- 1,643 of 2,234 rows moved; **1,643 up, 0 down**. c = delta / weekly-bucket: median **6.80%**
  over 17.2h ≈ **0.40%/h** (cycle62: 5.25% over 13.8h ≈ 0.38%/h — consistent, additive-in-time).
- **50.7% of movers have NEGATIVE 8-week weekly growth** → the counter cannot express decline.
- corr(log level, c) = **0.0000** (cycle62: −0.0015) → the increment is level-independent.

### 6. Supply-side churn: none where it matters

39 of 2,273 rows (1.72%) now return **404** — every one of them a listing-less
`open.feishu.cn/lark-*` row with **no weekly series and zero measured demand**
(0.00% of board demand). The demand-bearing population (2,234) is intact; no competitor
supply exited the board in this window. Entry is likewise invisible in this window
(no new ids in the 2,273 read).

### 7. Instrument redesign (operational consequence of a 429)

skills.sh **search API is hard rate-limited at 30 requests/minute** (HTTP 429
`rate_limit_exceeded`; our first discovery sweep returned **0 rows** because every query was
rate-limited). **Listing page reads are not throttled** — 2,273 page GETs in 76s, zero 429.
Therefore: population measurement = page reads (cheap, full N, every cycle);
new-publisher discovery = paced search (≤30/min, ~2s spacing) and must be treated as a
separate, rate-budgeted job. Prior cycles' sweeps that ran 654+ search queries unspaced were
silently returning partial data (this cycle's publisher crawl returned 1,637 install rows
instead of the expected ~2,273 — a 28% silent loss that only the page-read path avoided).

### Revised operating rules (supersede H62's §"Revised operating rules" where noted)

1. **Never publish a point estimate for a deduped board figure.** Publish the band and the
   configuration that produced it (floor, unit, merge lens). Corrected growth = [+62.7%, +77.8%].
2. **Fix the unit before publishing concentration**: listing / product / publisher are three
   different markets (top-10 share 19.76% / 25.54% / 65.91%). Withdraw 7.19 and 74.48%
   until the unit is re-derived and stated.
3. **The board unit for demand is a product, counted once at its max stamp**; storefront
   replication is distribution, not demand. Report clone-network share (20.78% of naive
   board) as a first-class metric.
4. **skills.sh publishes size only** (weekly series frozen; counter ratchets up). Never publish
   a momentum claim; never publish a decline claim. Growth is a level-to-level statement over
   a closed window.
5. **Competitive events = entry, exit, storefront spread.** These are the only decidable
   signals on this board. Instrument them: nightly full page-read census + paced search sweep.
6. Keep H62's watchlist logic: threat class = low-star / high-distribution entrants. The
   storefront network adds a second class: **clone-distribution operators** (15 storefronts on
   one product family) who can take board share without a single new install source.

### Self-critical limits

- The dedup band is a method-sensitivity result, not a corrected truth; the truth is unknown
  and sits inside the band.
- The clone test is threshold-based and would be evaded by re-timed counters; storefront
  networks were detected by *name+publisher overlap*, not by series similarity, because the
  storefront copies carry different magnitudes (201k vs 27k) and therefore fail the tight test.
- All board figures are skills.sh-scoped: installs, not usage, not revenue.
- c ≈ 0.40%/h is a coarse 2-point estimate; the counter's internal semantics remain unknown.
- The population is the 2,273 URLs known from the 20:45Z census; a listing that appeared and
  disappeared between censuses is invisible to us (search API, 30/min, is the only entry probe).

### Operational state (unchanged, kill criterion verified)

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET), **no publish credential**;
`ops_social_posts` = **0**; our repo `hypetopher/aicompany` = 0 stars / 0 forks / 0 board listings
→ **publish nothing, no external actions, read-only public GETs only.**
