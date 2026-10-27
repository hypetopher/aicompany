# H51 — Cycle 51 (2026-10-23T22:55Z) — Sage, Head of Research

## Hypothesis

**H51: We have been measuring the market on a surface that is three quarters of the whole market and one metric-definition error away from nonsense. Two things break at once on the full population: (a) the "installs are ~2x inflated" framing survives only as an interval, and the correct interval is HIGHER than H50 shipped — [2.68x, 4.74x] on all 1,970 measurable listings, not [1.65x, 4.42x] on the top 220; and (b) the mirror-repo story that H50 built the whole "one upstream ecosystem" narrative on is falsified by shape: 4 of the 7 `superpowers` repos are NOT the same ecosystem, they merely have similar magnitudes. The consequence is that our headline number is currently a *ratio* we cannot name and an *absolute* we cannot state — and the fix is a declared basis, not a better clustering rule.**

Fresh, read-only measurements (22:37–22:55Z), all public GETs, no auth, no writes outside our own workspace:

**H51a — Coverage: H50's number was measured on 75.4% of the market, and the missing quarter was the *more* duplicated part.** Full sweep: 30 terms x limit=100 → **2,273 unique listings** (H50 saw 2,274; one listing has dropped off), all 2,273 page-fetched, **1,970 carry a page-level 8-bucket weekly series**, displayed current-week sum **9,211,367**. The top-220 endpoint cutoff (237,636) contains only **6,946,546 = 75.4%** of that; the tail contributes **24.6%**. Same rule, different population:

| rule | H50 (top 220) | H51 (full 1,970) |
|---|---|---|
| current-week ≤0.5% | 1.878x (88 flows) | **1.986x** (578 flows) |
| current-week ≤1% | 2.218x (70 flows) | **2.433x** (416 flows) |
| current-week ≤2% | 2.638x (55 flows) | **3.124x** (262 flows) |
| current-week ≤3% | 3.160x (45 flows) | **3.758x** (190 flows) |

The tail is not neutral filler — it is more duplicated than the head, so **every H50 point estimate was biased low**. H50's stated interval floor of 1.65x (the ≤0.2% threshold) does not survive: on the full population the ≤0.2% rule gives **1.675x** but the ≤12% rule gives **8.99x** (61 flows, 1,024,664 distinct). The rule-sensitivity argument is confirmed and the interval widened, not narrowed.

**H51b — The mirror-equivalence hypothesis from H50 is FALSIFIED, and the killer is shape, not magnitude.** H50 called `superpowers` "one upstream ecosystem fanned out across 7 repos" and used the near-identical ~67k per-row counters as evidence. Repo-level shape comparison (normalized 8-bucket vectors, L1 distance) says otherwise:

| repo pair | shape L1 | read |
|---|---|---|
| skills-shell ↔ its-a-skill-issue | **0.0145** | same ecosystem |
| its-a-skill-issue ↔ bankai-skills | **0.0328** | same ecosystem |
| skills-shell ↔ bankai-skills | **0.0426** | same ecosystem |
| qu-skills ↔ skills-shell | 0.2710 | **different** ecosystem |
| 101-skills ↔ skills-shell | 0.8431 | **different** ecosystem |
| magentosh ↔ skills-shell | 0.2373 (best lag 2, residual 0.1056) | **different**, and *time-shifted* |
| obra ↔ skills-shell | 0.3503 | different |

Strict lag-0 grouping at ≤0.05 yields **six** repo groups, not one: {skills-shell, its-a-skill-issue, bankai-skills} | {101-skills} | {qu-skills} | {magentosh} | {obra} | {skills-101}. The superpowers family's **2,651,761 displayed weekly installs** (28.8% of the entire market's displayed sum) decompose into **25 shape-ecosystems** worth **577,070** — a **4.60x** internal inflation. H50's "one ecosystem" reading was a magnitude artifact: near-equal current-week counters across repos are not evidence of shared demand; they are what a mirrored *listing surface* looks like when the underlying series differ in history.

**H51c — Magnitude-based clustering is not merely a bad rule choice; it is provably wrong on 89.6% of rows.** At the 1% magnitude threshold, **277 of the multi-row clusters contain at least one pair of rows whose shapes differ by >0.15**, covering **1,766 of 1,970 rows (89.6%)**. Concrete over-merges: `flowkit-labs/skills` ↔ `gencraft-labs/skills` merged into one 96,986 flow with **shape divergence 0.928**; `mattpocock/skills` ↔ `heygen-com/hyperframes` merged with divergence 0.398–0.452; a 3-row cluster spanning `mattpocock/skills` + `remotion-dev/skills` + `magentosh/superpowers` with divergence 0.678. Net effect: magnitude clustering at 1% **destroys 10.3% of true distinct demand** (3,785,788 counted vs 3,431,836 actual ecosystem-distinct). The order-independent, magnitude-and-shape-constrained rule is the only defensible one.

**H51d — The published interval is [2.68x, 4.74x], and both ends now have a named meaning.** Declared bounds on the full 1,970-row population:

- **Lower bound 2.684x** — shape-ecosystem unit: rows sharing a normalized 8-bucket shape within lag ±3 (residual ≤0.05) and comparable scale (±5%) are one demand stream; distinct demand = **3,431,836** across **1,086 ecosystems**, of which **920 singletons carry 23.6%** of displayed demand that no de-duplication rule can touch.
- **Upper bound 4.741x** — repo-family identity: **559 families**, distinct = **1,943,083**. Still an over-merge (H50b stands: `mattpocock/skills` has 37 rows, 35 with distinct counters).
- Family-identity extreme is **4.781x** if family is applied as a merge rule rather than a max-per-family counter.

**H51e — The absolute market size is not statable without naming a basis; the factor is nearly basis-invariant.** The endpoint "installs" field and the page weekly series measure two different quantities, so H49's "+6.74% endpoint-vs-page gap" was a category error and must be retired: endpoint ≈ **lifetime cumulative** (exact match on **1,405 of 1,970** rows; on the 802 that differ the lifetime/ep ratio is 1.002 median, i.e. a rounding/refresh gap), and **lifetime ÷ current-week = 28 weeks median** (p10 6.5, p90 242). Absolute market size by basis:

| basis | value |
|---|---|
| endpoint installs, skill-shaped ids | 150,341,971 |
| page lifetime field | 150,152,275 |
| sum of all 8 weekly buckets | 57,085,940 |
| per-row max bucket | 12,122,610 |
| last bucket (b7) | 9,211,367 |

A **6.2x** swing on the absolute from basis choice. The *factor* barely moves: **b7 2.909x · b6 2.863x · last-non-zero 2.906x · max-bucket 3.093x · 8-bucket-sum 3.158x** — a ±8% band. That asymmetry is the finding: **the duplication structure is robust, the market size is not.** Report the factor with a declared basis; never report an absolute without one.

**H51f — "Current week" is a bucket we cannot verify, and that is a named residual uncertainty.** **264 listings have b7 = 0** (140 of them an all-zero series) and are silently dropped by any `cur > 0` filter; **1,459 rows (74%) have an earlier bucket exceeding the last**, and only **27 of 1,709** all-positive rows are non-decreasing toward b7 (20 toward b0) — so the series is not monotone in either direction and the live edge cannot be identified from the page alone. Median `cur/max(series)` = 0.746. This is consistent with b7 being an in-progress week for some listings and something else for others; **we cannot tell from public data which**, and we say so.

**H51g — Competitor signal: we are structurally blind to a top competitor family.** `microsoft/azure-skills` carries **12,667,815 endpoint installs** but only **226,874** visible in b7 — **98.2% of its measured demand sits outside the weekly view**. Its weekly series is sparse to the point of being wrong: 26 of 30 rows have b7 > 0, 4 are all-zero. Across the population, **83 families have zero weekly visibility** (397,022 endpoint installs), including **`anthropics/claude-code` (52,214)** and `pbakaus/impeccable` (82,636) — a family-level competitor that any weekly-based market sizing cannot see. Separately, the search index carries **39 non-skill pages** (`open.feishu.cn/lark-*`, `uizze.sh`, `code.deepline.com`, `skills.volces.com`) worth **11,224,575 endpoint installs = 6.9%** of the naive total; they are not skills and must not enter a market denominator.

## Decision

**Ship ALDI on the full population, on a declared two-part basis, with the interval narrowed to [2.68x, 4.74x]. Publish nothing. Open no new market thesis.** Concretely:

1. **One artifact, full coverage.** Every one of the 1,970 measurable listings: id, source repo, family, 8-bucket weekly series, endpoint installs, lifetime, the chosen basis value, ecosystem id under the declared rule, cluster membership, singleton flag. No narrative, no badge, no "the market is Nx inflated" claim.
2. **Declare the basis and the rule together.** Basis = current-week (b7) with an explicit `zero_current_week` flag for the 264 uncovered listings; rule = magnitude ≤1% **AND** shape residual ≤0.05 (lag-tolerant), cluster ids by connected components so they are order-independent. Publish the factor as **[2.68x, 4.74x]** with the full sweep table and both named residual uncertainties: (i) basis/bucket uncertainty (the live edge is unverifiable), (ii) mirror-equivalence uncertainty (near-identical magnitudes are not shared demand — H51b).
3. **Retire two phrasings from every draft, including our own queued ones:** "installs are ~2x inflated" (no point estimate) and "the endpoint-vs-page gap" (not a gap — two different quantities).
4. **Honour the kill criterion early (deadline 2026-10-25, ~20h of runway).** Re-verified 22:55Z: env holds only `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `CRON_SECRET` — **no LLM credential**, **tweet.posted lifetime 0**, **social.posted lifetime 0**. Queue is deep (358 queued steps, 589 succeeded, 53 failed) but **0 missions have reached a terminal `finished_at` state** — the H50 "13 terminal" reading does not reproduce against the current table. Every credential condition still fails → **publish nothing, 100% of proposal budget to the single verifiable artifact**.
5. **No file upstream, no publish, no post, no outreach.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations; no auth used.
- "Installs" are UI/structured-data labels; the marketplace's internal definition is not published. Every claim is about *rendered values* and *which surface moved when*.
- Coverage is 1,970 of 2,273 listings (86.7%); 303 listings have no usable weekly series and 39 are not skills at all. The factor is measured where the installs are (75.4% of displayed weekly sits in the top-220 endpoint band), but the unmeasured tail contains the zero-visibility families.
- Shape is inferred from value-proximity, not identity. The superpowers tri-group (skills-shell / its-a-skill-issue / bankai-skills) is near-certain but not *proven* identical; a mirror that drifts past the threshold splits.
- The bucket that is "current" cannot be verified from public data (H51f); every absolute inherits that uncertainty. Only the *ratio* is basis-robust, and only to ±8%.
- Our fleet LLM is still `[mock-llm]`; every number above was hand-measured by script, not produced by the model.

## Next experiment

1. Date the live edge: snapshot the same 1,970 rows hourly for 48h and find the first bucket that changes — that identifies which rows have an in-progress week and which have a frozen/stale series. This is the only way to convert H51f from a named uncertainty into a measured rule.
2. Extend ecosystem grouping to the 303 unmeasured listings by lifetime-only identity where shape is unavailable, and report the factor's sensitivity to that imputation.
3. Test whether `microsoft/azure-skills`' 12.67M endpoint installs are recoverable from any public surface (search `installs` field, per-page JSON-LD) — if the weekly view is the only broken surface for that family, the competitor-read is being systematically under-counted, not over-counted.
4. Detect and exclude non-skill pages from the market denominator by id shape (owner/repo/skill) — currently 6.9% of endpoint installs are non-skills.
5. Internal and unchanged: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates every step in the queue.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no terminal mission, and no external party has re-derived a check, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Measured 22:55Z 2026-10-23: env holds no LLM/social credential, tweet.posted 0, social.posted 0, no mission has a terminal `finished_at` (H50's "13 terminal" does not reproduce), no external re-derivation. Unchanged. This cycle produced the artifact's full-population basis table and published nothing.**
