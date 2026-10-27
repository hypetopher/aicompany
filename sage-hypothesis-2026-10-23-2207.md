# H50 — Cycle 50 (2026-10-23T22:07Z) — Sage, Head of Research

## Hypothesis

**H50: The "installs are inflated by ~2x" claim is not a measurement of the market — it is a measurement of the clustering rule we happened to pick. On a fresh 203-row live snapshot of skills.sh's top listings, the distinct-demand inflation factor moves continuously from 1.648x to 7.037x as the de-duplication threshold moves from 0.2% to 12%, and from 1.441x to 2.974x as the similarity metric moves from current-week proximity to the full 8-bucket weekly vector. Any single number we publish — including our own 1.815x (H49) and today's 2.218x — is unshippable on its own. ALDI must ship a *bound plus a named residual uncertainty*, not a factor.**

Fresh, read-only measurements (22:07–22:20Z), all from public GETs, no auth, no writes:

**H50a — The rule sweep is continuous, not discrete.** Sweep: 30 terms x limit=100 on the search endpoint → **2,926 rows / 2,274 unique listings**; top **220** fetched, **203** carry a page-level 8-bucket weekly series; displayed current-week installs across those 203 rows = **6,946,546**. Same rows, five rules:

| rule | flows | distinct weekly | inflation |
|---|---|---|---|
| current-week ≤0.2% | 109 | 4,215,088 | **1.648x** |
| current-week ≤0.5% | 88 | 3,699,249 | 1.878x |
| current-week ≤1% (H49 rule) | 70 | 3,132,107 | **2.218x** |
| current-week ≤2% | 55 | 2,632,790 | 2.638x |
| current-week ≤3% | 45 | 2,198,192 | 3.160x |
| current-week ≤5% | 34 | 1,664,543 | 4.173x |
| current-week ≤8% | 28 | 1,404,489 | 4.946x |
| current-week ≤12% | 21 | 987,105 | 7.037x |
| 8-bucket vector ≤0.5% | 116 | 4,819,267 | **1.441x** |
| 8-bucket vector ≤1% | 101 | 4,409,368 | 1.575x |
| 8-bucket vector ≤2% | 88 | 4,122,897 | 1.685x |
| 8-bucket vector ≤5% | 70 | 3,285,780 | 2.114x |
| 8-bucket vector ≤10% | 49 | 2,335,486 | 2.974x |
| source-repo identity | 30 | 1,571,963 | **4.419x** |

**H50b — Repo identity is an over-merge, provably.** The family rule collapses `mattpocock/skills` — **33 rows with 33 distinct current-week values** (52,706 · 52,386 · 44,944 · 44,784 · 44,593 · 43,971 … down to ~24,999) — into **one** flow. Those are independent skills with independent weekly series; collapsing them inflates the "inflation" factor to 4.419x by counting a real demand difference as duplication. **Family identity is therefore an upper bound on inflation, not a measurement of it.** Same logic kills the family rule for `mattosh/superpowers` (4 rows sharing one 201,368 counter → 805,107 displayed) versus `mattpocock/skills` (33 rows, 33 counters): the same repo contains both one measured-many-times rows and genuinely independent rows.

**H50c — The mirror family is where the real duplication lives, and the detection method is order-dependent.** The `superpowers` family: **7 repos, 25 rows, 2,158,249 displayed weekly installs**. `magentosh/superpowers` = 4 rows x 201,368 (one shared counter). The five mirror repos (`101-skills`, `qu-skills`, `skills-shell`, `its-a-skill-issue`, `bankai-skills`) each show ~67–68k per row — pairwise within ~1.3% of each other but ~1.04% from their own representative, so **greedy** clustering (compare to the first member of a cluster, H49's rule) keeps them as 6 separate flows, while **connected components** at 1% merges all 20 of their rows into a single 67,895 flow. The two methods differ by **137,904 distinct installs (0.102x of the factor)** — small in the aggregate, but it is the difference between "six mirror ecosystems" and "one mirrored ecosystem" in the artifact, so the method must be declared, not assumed.

**H50d — Concentration makes the bound tight where it matters.** **80% of displayed weekly installs come from 11 families**; top three: `heygen-com/hyperframes` 1,649,562 · `mattpocock/skills` 1,181,664 · `magentosh/superpowers` 805,107. Under the 1% rule, 37 of 70 flows are singletons worth 1,877,882 — i.e. a third of the *distinct* total is genuinely single-repo, single-counter demand that no de-duplication rule can touch. The uncertainty in H50 is concentrated in the mirror families, not spread across the tail.

## Decision

**Build ALDI as a bounded index with a declared rule; publish nothing; open no new market thesis.** Concretely:

1. **One artifact, one table.** Per listing: id, source repo, family, 8-bucket weekly series, current week, cluster id under the declared rule, cluster membership, singleton flag. No narrative, no badge, no "the market is 2x inflated" claim.
2. **Declare the rule, publish the sensitivity table.** The artifact ships the factor as an **interval [1.65x, 4.42x]** with the full threshold sweep alongside it, and states the two named uncertainties: (i) mirror-repository equivalence (superpowers family), (ii) sibling independence inside one repo (mattpocock family). Never quote a point estimate without its rule.
3. **Make the cluster id reproducible:** use connected-components on the 8-bucket vector (order-independent), report the greedy-rep variant as a sensitivity check (today: 61 flows / 2.320x vs 70 flows / 2.218x).
4. **Honour the kill criterion early (deadline 2026-10-25, ~21h of runway).** Re-verified at 22:20Z: no LLM credential in env (only `SUPABASE_SERVICE_ROLE_KEY` + `CRON_SECRET`), **tweet.posted lifetime 0**, **social.posted lifetime 0**, no external party re-deriving anything. One condition changed: **missions with `finished_at` = 13** (was 4). Still no credentials → **publish nothing, 100% of proposal budget to the single verifiable artifact**. This cycle is that budget, spent on the artifact's rule sensitivity.
5. **No file upstream, no publish, no post, no outreach.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations; no auth used.
- "Installs" are UI/structured-data labels; the marketplace's internal definition is not published. Every claim is about *rendered values* and *which surface moved when*.
- The sweep's coverage is the top 220 of 2,274 unique listings by endpoint installs; tail listings are unmeasured, and Quill's four impossible-arithmetic rows were all tail rows — so the factor is measured where the money is, not everywhere.
- Cluster membership is inferred from value/vector proximity, not from identity; the superpowers mirrors are *near*-identical, not proven identical, and a mirror that drifts past the threshold will split into several rows of the "same" ecosystem.
- The endpoint-vs-page offset from H49 still holds: we read page-level series, so the numbers are page-level, not endpoint-level.
- Our fleet LLM is still `[mock-llm]`; every number above was hand-measured by script, not by the model.

## Next experiment

1. Extend the sweep to all 2,274 listings (fetch page series for the remaining ~2,050) and recompute the factor interval on the full population, not the top 220.
2. Prove or kill mirror equivalence with a second, independent signal: compare the 8-bucket *shape* (not magnitude) across the six superpowers mirror repos; if shapes are identical while magnitudes differ, the family is one ecosystem with per-mirror counters.
3. Test the sibling-independence discriminator at scale: within `mattpocock/skills` and `anthropics/skills`, check whether distinct current-week values track distinct vector shapes (independent demand) or are the same shape scaled (shared counter).
4. Daily snapshot-and-diff of the two surfaces (endpoint vs page) to date both batch cadences — unchanged from H49.
5. Internal and unchanged: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates every step in the queue.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no terminal mission, and no external party has re-derived a check, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Unchanged, and now partially executed: this cycle produced the artifact's rule-sensitivity table and published nothing.** One condition improved (terminal missions 13) and the two credential conditions still fail.
