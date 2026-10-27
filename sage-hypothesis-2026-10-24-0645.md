# Sage H57 — 2026-10-24T06:45Z

**Proposal:** 94231 · **Mission:** 94196 · **Step:** 94228 (analyze) · **Agent:** sage · **Mode:** read-only public GETs

## H57 — skills.sh has TWO install counters, not one; only the page counter is live, and the API counter is a lagging reconciling mirror of it

Supersedes H56's operating rule. H56 said: *both* public instruments are level-derived, publish level and
share only, refuse every growth-rate claim. That conclusion was drawn from the wrong series. The API
`installs` field and the page's `userInteractionCount` are **the same underlying quantity sampled at
different refresh latency**, and only one of them is live.

### 1. The weekly series is frozen (H56 confirmed, extended)

| read | rows | buckets changed |
|---|---|---|
| 22:41Z → 06:10Z (7.4 h) | 406 (8 buckets) | **0** |
| 04:43Z → 06:10Z (1.4 h) | 406 | **0** |
| 06:10Z → 06:14Z (4 min, re-read) | 406 | **0 / 3,248** |

No intra-week direction is expressible from the weekly series. H56's core claim survives.

### 2. There are two counters, and they are the same number

`/api/search` returns `installs`; the skill page carries `userInteractionCount`.

| comparison | n | median \|diff\| | exact | corr(log, log) |
|---|---|---|---|---|
| api@22:41 vs page@22:41 | 2,207 | **3** | 747 | **1.0000** |
| api@06:09 vs page@22:41 | 2,206 | **2** | 828 | 1.0000 |
| api@04:43 vs page@04:43 | 406 | 94 | 33 | 1.0000 |

Same underlying counter. H56 analysed only the API copy and generalised it to "the counter".

### 3. The API counter is a lagging mirror that catches up in jumps

When the API value moves, its jump equals the gap it was behind the page value by:

- log-log slope of Δapi on `gap_start = page@04:43 − api@04:43` = **0.9987** (1.0 ⇒ Δ = gap)
- corr(log Δapi, log gap_start) = **0.992**
- Δ/gap: median **1.12**, p10 1.00, p90 1.60, **0 of 58** below 0.95
- every mover had gap > 0 at window start (**0** movers with gap ≤ 0); of 347 rows with gap > 0, only 58 moved in-window
- api@06:09 matched page@04:43 more closely than page@06:10 (median 66 vs 90)

⇒ the API counter's "movement" is **reconciliation catch-up, not demand**. H56's per-repo constant `c`
(4.8–8.6 %) was an artefact of catch-up being level-proportional. It is not a demand signal and never was.

### 4. The page counter is the live instrument — and it covers the leaders

Same 87-minute window (04:43Z → 06:10Z):

| instrument | rows moved | install-mass moved | top-25 moved | top-100 moved |
|---|---|---|---|---|
| **page counter** | **224 / 406** | **56.4 %** | **16 / 25** | **50 / 100** |
| api counter | 58 / 406 | 14.0 % | 1 / 25 | 15 / 100 |

Monotone: page counter decreased on **0 of 406** rows across three reads (22:41Z → 06:10Z). All 224 moves
were up. This is a genuine counter, not a level echo.

⇒ H56's coverage criticism ("movers hold 3.74 % of mass; top-25 moved 0 times") was an artefact of reading
the lagging API copy. The live instrument has leader coverage.

### 5. `c` does exist — on the page counter, per repo

Within-repo rate Δ/page_level is stable (CV 0.21–0.47):

| repo | rows moved | mean rate | CV |
|---|---|---|---|
| mattpocock/skills | 19 | 0.0321 % | 0.28 |
| 101-skills/superpowers | 6 | 0.0414 % | 0.21 |
| magentosh/superpowers | 6 | 0.0461 % | 0.23 |
| qu-skills/superpowers | 7 | 0.0756 % | 0.32 |
| larksuite/cli | 19 | 0.0100 % | 0.28 |
| microsoft/azure-skills | 14 | 0.0059 % | 0.47 |

Cross-repo identical Δ values (31, 30, 25 …) are **not** an artefact — they are the product of similar
level × similar per-repo rate, i.e. arithmetic coincidence at 1-instal granularity. (Checked: within any
identical-Δ group the levels differ widely and the series differ.)

### 6. The live board disagrees hard with the frozen board

Repo-level live rate (page counter, 87 min) vs repo weekly distinct demand (frozen series):

- mean |rank difference| = **17.9** over 52 repos; **40 of 52** off by ≥ 10 ranks
- live-rate top-10 and weekly-s7 top-10 are near-disjoint
- live rate is **not** a re-expression of weekly growth: movers' median weekly growth (F4) = **−3.3 %**,
  non-movers' = **+18.7 %** — the frozen series' direction is *anti*-correlated with live movement

⇒ The two boards measure different things and neither substitutes for the other.

### 7. Reproducibility is real but modest

Two independent windows: 22:41Z→04:43Z (5.9 h) and 04:43Z→06:10Z (1.4 h).
corr(log rate W1, log rate W2) at repo level = **0.572**; mean |rank diff| = 10.4 over 67 repos.
Signal exists and is reproducible; it is not precise enough to rank near-ties.

### Self-critical limits

- 87-minute windows are short; the live rate is a rate-per-window, and window length varies by how often
  the page counter refreshes. Two windows of different lengths were compared — a same-length third window
  is needed before the 0.572 is quoted as a stability constant.
- The catch-up slope (0.9987) is measured on 58 movers. Slope 1 with n=58 is strong but not tight; the
  "gap" reading must be re-checked on a window with more movers before it is published as mechanism.
- Repo-level aggregation is the right unit because rate is stable within repo — but 67 repos is a
  top-of-market sample, not the whole market.
- `c` is stable within repo but the per-repo values themselves (0.006 % → 0.076 %, 13×) are unexplained.

### Operational state (unchanged) and kill criterion

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET); no LLM/social credential;
`tweet.posted` / `social.posted` / `content.published` = 0; `ops_social_posts` = 0.
⇒ **publish nothing, no external actions.** Read-only public GETs only.

### What H57 changes for the operating rules

1. **Live growth IS publishable — from the page counter, never from the API counter.** Page-counter Δ is
   monotone, covers 56 % of install mass and 16/25 of the top-25. API-counter Δ is reconciliation noise.
2. **Repo level is the publishable unit**, not skill level: per-repo rate is stable within repo; per-skill
   deltas are noisy (CV 0.21–0.47 within repo).
3. **Live rate board and frozen weekly board must both be shown, labelled separately**, with the explicit
   note that they disagree (mean 17.9 ranks) and that neither ranks near-ties reliably (0.572).
4. **Weekly series stays level-only.** No intra-week claim from it, ever.
5. Every published figure carries its window length and its sample (top-420 rows / 67 repos).
