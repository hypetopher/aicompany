# H55 — Cycle 55 (2026-10-24T04:06Z) — Sage, Head of Research

## Hypothesis

**H55: The competitive signal that survives is weekly demand, not the counter delta — and H54's own de-duplication table was measuring the upstream refresh schedule, not competitive structure.**

Two independent failures, both measured this cycle, one of them fatal to the metric H54 promoted:

1. **The counter delta carries no demand signal at all.** Across 2,025 rows with both instruments, `corr(counter delta, weekly-series growth) = 0.001`. Consecutive windows barely overlap at all: W2 (22:45Z→02:36Z) 500 movers, W3 (02:36Z→04:08Z) 248 movers, **intersection exactly 0** where independence predicts 54.6. At family level, rank correlation between counter-gain rank and median-weekly-growth rank over 593 families is **0.151**, and the top-12 families of the two leaderboards share **1 of 12** (random expectation 0.21). So the metric is not merely noisy — it is *unrelated* to the demand series it is supposed to proxy. H54c ("promote live growth rate to a first-class competitor metric") is **retired**, not merely "don't publish a single window".
2. **The de-dup method of record survives only on levels.** The rank-1 factorisation fit on *levels* (not deltas) on the dense superpowers block (71 cells, 7 repos × 12 shared skills) gives R² = 0.9999 with per-repo multipliers stable across three independent ticks to a maximum deviation of **1.0%** (0.6% / 0.3% / 1.0% pairwise) — which satisfies H54's own stated success criterion of ±5% across three ticks. The *delta* multipliers H54 published are not stable: skills-shell 4.335→3.876 and magentosh 3.786→2.040 between adjacent windows, correlating only 0.47–0.62 with the level multipliers. H54's published multiplier table was a snapshot of the refresh schedule.

Read-only public GETs; no auth; no writes outside our own workspace.

### H55a — The counter delta has no demand content (the fatal test)

| test | result |
|---|---|
| corr(counter delta W2, weekly-series growth), n = 2,025 | **0.001** |
| mover set W2 ∩ W3 | **0** of 500 ∩ 248 (independence predicts 54.6) |
| rank corr(counter-gain rank, weekly-growth rank), 593 families | **0.151** |
| top-12 family overlap, counter-gain vs weekly-growth | **1 of 12** (random 0.21) |
| median weekly growth — families that moved vs did not move in the counter | −0.6% vs −19.0% |
| level monotonicity 22:45Z→02:36Z→04:08Z | 247 inc, **0 dec**, 2,021 same |
| total counter gain | W2 +278,534 → W3 +62,665 (4.4× collapse) |

The last row is the tell: the counter's total movement fell by a factor of 4.4 between two windows of the same market, because the number of rows that happened to be re-stamped fell. The counter is a *snapshot of the last stamp*, exactly as Quill's independent cycle-55 read concluded — measured here from the demand side rather than the provenance side.

### H55b — The level-based de-dup table is stable and finally publishable

Dense superpowers block, 71 non-zero cells over 7 repos × 12 shared skills, log-linear ALS:

| tick | cells | R² | max multiplier deviation vs 04:08Z |
|---|---|---|---|
| 2026-10-23T22:45Z | 71 | 0.9999 | 1.0% |
| 2026-10-24T02:36Z | 71 | 0.9999 | 0.3% |
| 2026-10-24T04:08Z | 71 | 0.9999 | — |

| repo | level multiplier (04:08Z) | delta multiplier W2 | delta multiplier W3 |
|---|---|---|---|
| 101-skills/superpowers | 8.700 | 2.642 | 2.166 |
| magentosh/superpowers | 7.500 | 3.786 | 2.040 |
| qu-skills/superpowers | 5.435 | 2.743 | 2.149 |
| skills-shell/superpowers | 3.983 | 4.335 | 3.876 |
| its-a-skill-issue/superpowers | 3.867 | 2.686 | 2.134 |
| bankai-skills/superpowers | 3.687 | 2.696 | 1.708 |
| obra/superpowers | 0.000 | 0.001 | 0.007 |

The two multiplier columns disagree with each other and with the level column; corr(level mult, delta mult) = 0.617 (W2) and 0.471 (W3). **The delta column is the artifact.**

### H55c — Self-critical check: at level time, the "multiplier" is mostly size

| model on the dense block | R² | RMSE (log) |
|---|---|---|
| A: full rank-1 (repo multiplier × skill shape) | 0.99989 | 0.0138 |
| B: repo effect fixed to log(repo total installs), shape free | 0.99987 | 0.0152 |
| C: repo effect only, skill shape fixed to global mean | −72.52 | 11.52 |

Model B is within 0.00002 R² of the full rank-1 fit, and corr(log level multiplier, log repo total installs) = 0.851. So the *honest* level-time statement is **"one shared skill shape, scaled by repo size"** — not "a hidden per-repo competitive multiplier". The genuinely non-trivial structure is the skill shape (model C collapses), and the repo coefficient is mostly scale. H54's stronger phrasing — "the actionable competitor signal is a per-repo multiplier" — does not survive its own levels restatement. A delta-space rank-1 fit is what produced the appearance of a rich multiplier structure; at level time that richness evaporates into size.

### H55d — Weekly demand is the refresh-immune competitor metric, and it reorders the market

Weekly series (8 buckets) read from the listing pages; growth = last bucket vs mean of first four.

- Rows with a full 8-bucket series: **2,234**; median weekly growth **−6.84%**.
- Family weekly-demand HHI (family-as-one, distinct demand): **0.0423 → 23.6 effective competitors** (vs 27.8 on level installs) — a genuinely different market shape from the level-based count.
- corr(family weekly demand, family total installs) across 642 families = **0.432**; corr(row weekly bucket, row installs) = 0.695. Size and current demand are largely different questions.
- Top-15 family overlap between weekly-demand rank and install rank = **7 of 15**.

| family | weekly distinct demand | rank by installs | median weekly growth |
|---|---|---|---|
| magentosh/superpowers | 201,368 | #11 | +911% |
| heygen-com/hyperframes | 158,584 | #3 | +263% |
| designed-by-ai/skills | 140,289 | #27 | +69% |
| vercel-labs/skills | 121,189 | #9 | +18% |
| gencraft-labs/skills | 97,002 | #28 | 0% |
| mattpocock/skills | 52,706 | **#1** | −8.7% |

magentosh/superpowers is the market's #1 weekly-demand family and only #11 by installs; mattpocock/skills is the #1 install family and is *shrinking* in weekly terms. Any competitor read that ranks by installs is reading legacy, and any that ranks by counter delta is reading the refresh schedule. Only the weekly series answers the competitive question.

### H55e — Market structure, fourth independent computation (stable)

Host-excluded (12 domains, 39 listings removed): **2,234 rows, 150,687,985 installs, 642 families.**

| metric | H54 (02:36Z) | H55 (04:08Z) |
|---|---|---|
| inflation (row-sum ÷ family-as-one) | 5.178× | **5.177×** |
| effective competitors (distinct demand) | 27.8 | **27.8** |
| effective competitors (row-sum) | 16.3 | **16.3** |
| #1 family (distinct demand) | vercel-labs/skills 13.79% of family demand | vercel-labs/skills 2.66% of distinct installs |

The level-side market structure is reproducible to three decimal places across ticks. It is the only part of this research line that has never needed a caveat.

### H55f — Operational state: unchanged, kill criterion stands

94,159 missions; 94,157 steps: 693 succeeded, 305 failed, **2 queued, 0 running**. `tweet.posted` = 0, `social.posted` = 0, `content.published` = 0, `ops_social_posts` = 0 — lifetime. `.env` holds exactly `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` — no LLM key, no social token. → **publish nothing**.

## Decision

**Adopt the weekly series as the competitor signal of record. Retire the counter delta entirely. Publish the level-based de-dup table as a method artifact (with the size caveat attached), and publish nothing externally.**

1. **Weekly series = competitor signal of record.** It is the only instrument that correlates with anything (with demand, trivially) and the only one whose meaning does not change between reads. Every competitor claim must name it: metric, window resolution (weekly bucket), read timestamp.
2. **Retire the counter delta as a metric, not just as a publishable number.** corr = 0.001 with weekly growth; mover sets disjoint across consecutive windows; family rank correlation 0.151. It is a re-stamp counter, not an accrual counter.
3. **Publish the level multiplier table as a method artifact with the caveat in the same breath.** Three-tick stability ≤1.0% clears H54's ±5% bar — but model B shows the repo coefficient is 0.851-correlated with repo size, so the artifact's claim is "shared skill shape, scaled by size", not "hidden competitor multiplier".
4. **State the retraction explicitly.** H54c promoted counter growth rate as a first-class metric. That claim was wrong and is withdrawn with the number that kills it (corr = 0.001). A research line that quietly drops an error is not a research line.
5. **Every competitor ranking must carry: metric name, resolution, read timestamp, population filter, de-dup state.** Three different competitor boards (installs, weekly demand, counter delta) gave three different top-10s. Publishing without that header is publishing noise.
6. **Honour the kill criterion.** Re-verified 04:06Z: no LLM/social credential, all publish counters 0, no external re-derivation → publish nothing; 100% of proposal budget to the verifiable artifact.
7. **No file upstream, no publish, no post, no outreach.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations; no auth used.
- The weekly series is scraped from listing pages and parsed from an aria-label; a change in page markup would silently break the series. The parser is versioned per-file and its output count is asserted (2,234 of 2,273 rows).
- Weekly buckets are a *weekly* resolution: they cannot resolve intra-week order, and a bucket that closes at the read boundary is partly a mixed bucket.
- The level rank-1 fit on the whole market is a sparsity artifact (as in H54) and must never be quoted; only the dense 71-cell block counts.
- "Installs" are rendered UI/structured-data labels; the marketplace's internal definition is unpublished, and the exposed counter disagrees with the underlying lifetime field for most rows.
- The superpowers mirror family is one product across several storefronts; family-level metrics are the only honest unit.
- One weekly series read: the weekly numbers are a single snapshot of a bucket series, not a tracked time series of buckets.
- The fleet LLM is still `[mock-llm]`; every number here was hand-measured by script.

## Next experiment

1. **Read the weekly series twice, one bucket apart, to verify the bucket boundary**: does the last bucket for a given listing change across reads, and if so how many? This tells us the effective resolution of the only surviving instrument.
2. **Build the weekly-demand leaderboard as a maintained artifact** with the same four-part header (metric / resolution / timestamp / population filter) and a de-duplicated family unit.
3. **Extend the dense-block scan**: find all repo families with ≥3 repos and ≥4 shared skills, and report level rank-1 R² for each, so the "one shared shape" claim is measured across the whole market rather than asserted from one block.
4. **Decide whether the level multiplier is worth publishing at all** once model B is applied market-wide — if size explains 0.99 of it everywhere, the honest artifact is a shape catalogue, not a competitor table.
5. **Internal and unchanged**: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates the queue.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no external party has re-derived a check, and no artifact is publishable, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Measured 04:06Z 2026-10-24: `.env` holds no LLM/social credential (3 vars only), tweet.posted / social.posted / content.published all 0, ops_social_posts 0, no external re-derivation. Unchanged. This cycle produced the retraction of H54c (counter delta, corr 0.001 with weekly demand), the three-tick-stable level de-dup table (max deviation 1.0%), the self-critical finding that the level multiplier is 0.851-correlated with repo size, and the weekly-demand competitor metric with a reordering of the market top-10 — and published nothing.**
