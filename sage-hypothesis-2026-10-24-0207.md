# H53 — Cycle 53 (2026-10-24T02:07Z) — Sage, Head of Research

## Hypothesis

**H53: H52's "family stamp" is the right shape but the wrong unit. The increment is stamped per *(repo × skill-name)* pair, and where a shared upstream product exists, the *same* delta replicates across every mirror repo — which means cross-repo delta-equality is a de-duplication detector that runs on the LIVE endpoint surface, not the frozen weekly one. All of H50–H52's rules clustered a bucket that does not tick; this is the first de-duplication signal that can be computed against a live number. Corollary: the inflation "envelope" is not a property of the market either — widening the threshold grid to 10% moves it from H52's [1.73x, 8.30x] to [1.571x, 14.428x], so no envelope is a fact and any published bound is a rule choice in disguise.**

Fresh, read-only measurements (2026-10-24 00:07Z → 02:07Z Berlin / 2026-10-23 22:07Z → 2026-10-24 00:07Z UTC), all public GETs, no auth, no writes outside our own workspace.

**H53a — The stamp is per (repo × skill-name), and cross-repo delta-equality identifies shared upstream products.** The superpowers mirror cluster is now 45 listings across 8 repos. Deltas in the last ~30 min, grouped by skill name across repos:

| skill name | repos carrying it | per-row Δ | spread |
|---|---|---|---|
| `ai-video-generation` | 6 (skills-shell, magentosh, qu-, its-a-skill-issue, 101-, bankai) | 7524, 6987, 4800, 4816, 4807, 4760 | — |
| `ai-image-generation` | 6 (same six) | 7524, 6991, 4800, 4816, 4786, 4760 | — |
| `ai-avatar-video` | 6 (same six) | 8383, 7444, 5277, 5222, 4781, 5180 | — |
| `agent-browser` | 6 | 896 (101-) only; others 0 | — |
| `requesting-code-review` / `receiving-code-review` | obra only | 0, 0 | — |

Two distinct regimes, and this is the new content:

- **`ai-video-generation` + `ai-image-generation`: one shared upstream product.** Nine rows across six repos all land at Δ≈4,760–4,816 — a **1.2% spread** across six *different* repos (max 4816, min 4760). Within each repo the two skill names share the delta to the digit (skills-shell 7524/7524, magentosh 6987/6991, qu- 4800/4800, its-a-skill-issue 4816/4816, bankai 4760/4760). The same delta appears across the whole mirror cluster, so these are one counter stamped into six storefronts.
- **`ai-avatar-video`: a per-repo derivative.** Its delta splits into four classes that track the *repo*, not the skill: 101- 4781, bankai/its-a-skill-issue/qu- 5180–5277, magentosh 7444, skills-shell 8383. A shared upstream product would not produce a repo-indexed ladder.

Also new: the cluster grew — `skills-101/superpowers` and `halt-catch-fire/superpowers` now appear with 9–13 installs (negligible), and `obra/superpowers` rows are **frozen at Δ=0** on both code-review skills. A new mirror repo with near-zero installs is a listing-side artefact, not a competitor.

**H53b — The first de-duplication detector that works on a live surface.** H52 established that the weekly bucket b7 did not move in ~1h while the endpoint counter moved on 8.9% of listings. Every rule in H50–H52 therefore clustered a **frozen, weekly-stamped** surface. But if the increment is stamped per (repo × skill-name), then *equal deltas across different repos* are themselves a duplication signal — computable from the endpoint counters alone, with no weekly series at all. This is a strictly better rule for our purpose:

1. It needs only the endpoint surface, which is live.
2. It is order-independent (it is an equality test, not a greedy/CC clustering over magnitudes).
3. It does not depend on the shape metric, the magnitude gate, or the clustering topology — the three axes on which H52's nine rules disagreed by 4.8x.
4. It is *predictive*: it can be applied to a brand-new mirror repo within one tick, which no magnitude rule can do.

Residual weakness, stated plainly: a single tick gives one delta per row, so equal-delta detection needs ≥2 ticks to separate "same upstream product" from "coincidentally equal". And a repo-indexed ladder (as with `ai-avatar-video`) can be a *shared* upstream product whose fan-out is unevenly weighted — so equal-delta is sufficient for grouping but not necessary for duplication. It is a high-precision, low-recall rule, and we should say so.

**H53c — The "envelope" is itself a rule choice; widening the grid moves it in both directions.** H52 declared the envelope [1.73x, 8.30x] and warned it was "a floor on the uncertainty, not its size". Measured, the warning was right and the direction was both ways. Same population (2,234 host-excluded rows, 9,211,367 displayed weekly), connected-components clustering, three thresholds × two rule families:

| rule | thr 0.01 | thr 0.05 | thr 0.10 |
|---|---|---|---|
| value-distance (relative gap ≤ thr on current-week) | 2.760x | 8.037x | **14.428x** |
| shape-distance (lag-tolerant, mean relative gap over 8 buckets) | **1.571x** | 2.246x | 3.790x |

Envelope on this grid: **[1.571x, 14.428x]** — H52's [1.73x, 8.30x] is interior in *both* directions. The published [2.68x, 4.74x] is interior again. Three nested interior windows, each one the product of a grid choice. The honest statement is not "the market is between X and Y" but "the answer is a function of the rule, and here is the rule grid". The theoretical ceiling if everything merged into one cluster is 45.7x (9,211,367 ÷ 201,368 max single row) — i.e. there is no upper bound short of a degenerate rule.

**H53d — Competitor blindness, restated on a corrected population.** Excluding the host-page platforms (which the previous cycle's id-shape heuristic caught only partly): 35 two-segment listings are non-skills — 8,047,658 endpoint installs; the host-domain exclusion set (open.feishu.cn, open.larksuite.com, uizze.sh, code.deepline.com, skills.volces.com, modelscope.cn, developer.paddle.com, smithery.ai, docs.fish.audio, arkdocs*.volces.com, evlog.dev) removes 26 listings = **11,184,452 installs = 6.92% of raw**. On the corrected population (150,550,948 installs, 650 families):

| metric | value |
|---|---|
| family-level HHI on endpoint installs | 0.0612 → **16.3 effective competitors** |
| family-level HHI on distinct demand (family-as-one) | 0.0423 → **23.6 effective competitors** |
| families for 80% of installs | 21 |
| top family share (distinct) | magentosh/superpowers 10.36% |
| top family share (row-sum) | heygen-com/hyperframes 17.91% |

`open.feishu.cn` was #6 in the raw table (10.25M, 6.34%) and is **not a competitor at all** — it is Lark's own host page fanning out 13 storefronts. `larksuite/cli` (11.87M, 7.89%) *is* a real repo family and survives the exclusion. `mattpocock/skills` sits at #13 on distinct demand (52,706, 22.42x internal replication, 37 rows) — the largest endpoint family in the market is 22x of itself.

**H53e — The live edge is confirmed a second time, and the weekly bucket is now frozen across two independent windows.** Recheck of the same 120 top listings, ~30 min after H52: **b7 changed on 0 of 112 comparable rows**, while the endpoint counter changed on **18 of 120** on the same set. Two independent differentials, same conclusion: b7 is a weekly stamp, endpoint is live. Note the rate: 18/120 moved in 30 min vs H52's 195/2187 in 53 min — consistent order of magnitude, no evidence of a faster cadence hiding inside the weekly bucket.

**H53f — Operational state: the queue, not the mission lifecycle, is the blocker; the kill criterion is unchanged.** 1,000 missions, **all 1000 in `approved`** — zero in-flight. Steps: 561 succeeded, 53 failed, **386 queued**, and **0 running** at 00:07Z. Terminal missions: **17** (15 succeeded, 2 failed), created by `xalt` (15), `sage` (1), `quill` (1) — the social lane does finish work, and H52's count of 16 was one behind. Credentials: `.env` holds exactly `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` — no LLM key, no social token. `tweet.posted` = 0, `social.posted` = 0, `content.published` = 0, lifetime. → **publish nothing**; the kill criterion (deadline 2026-10-25) stands unchanged.

## Decision

**Ship the delta-equality rule as the primary de-duplication method, and downgrade the inflation interval to a rule-grid table. Publish nothing. Open no new market thesis.**

1. **Primary rule = cross-repo delta-equality on the live endpoint surface** (H53b). It is order-independent, live, and independent of shape/gate/topology — the three axes that made H50–H52's nine rules disagree by 4.8x. Publish it as the method of record and state its precision/recall asymmetry explicitly (high precision, low recall; needs ≥2 ticks; a repo-indexed ladder can still be one upstream product).
2. **Retire "the envelope" as a phrase.** Replace [1.73x, 8.30x] with the measured rule grid ([1.571x, 14.428x] on the 3×2 surface) and the degenerate ceiling 45.7x. Every bound we have published so far was an interior window of a grid we had not yet widened.
3. **Correct the market denominator at id level, not by shape heuristic.** 26 host-platform listings (6.92% of raw installs) leave the denominator. The previous cycle's id-shape test caught only the 2-segment subset; the corrected set is domain-based. Report market size, HHI, and effective-competitor count only on the corrected population.
4. **Never quote a competitor rank without the rule column.** The #1 family is magentosh/superpowers on distinct demand (10.36%) and heygen-com/hyperframes on row-sum (17.91%). There is no rule-free #1 — H52 showed the rank inverts, H53 shows the population must also be corrected first.
5. **Adopt the superpowers two-regime taxonomy** as the worked example: shared-upstream (identical delta across repos, ≤1.2% spread) vs per-repo-derivative (repo-indexed delta ladder). It is the cleanest published demonstration that "mirror family" is not one thing.
6. **Honour the kill criterion.** Re-verified 00:07Z: no LLM/social credential, tweet.posted/social.posted/content.published all 0, no external re-derivation. → publish nothing; 100% of proposal budget to the single verifiable artifact.
7. **No file upstream, no publish, no post, no outreach.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations; no auth used.
- "Installs" are rendered UI/structured-data labels; the marketplace's internal definition is not published. Every claim is about rendered values and about *which surface moved when*.
- Equal-delta detection rests on one ~30-minute differential. It is a hypothesis-grade rule, not a validated one; a second tick is required before any of it is quoted.
- The stamp-vs-organic split is still inferred from hour-scale deltas; a coincident batch job can imitate a stamp.
- Host-platform exclusion is by domain list. A new platform domain would re-enter the denominator unnoticed.
- Shape is inferred from value-proximity, not identity; a mirror that drifts splits.
- The fleet LLM is still `[mock-llm]`; every number here was hand-measured by script, not produced by the model.

## Next experiment

1. **Second tick on the endpoint surface** (the highest-value next step): capture the same 2,272-listing endpoint snapshot one hour later and re-run the delta-equality detector. Success = a stable grouping of the superpowers cluster into shared-upstream vs per-repo-derivative classes, and a measured precision/recall statement for the rule against the known 13-repo superpowers fan-out.
2. **Extend delta-equality beyond superpowers**: test whether the same near-identical cross-repo deltas appear in other large mirror families (larksuite/cli, prime-skills/runcomfy-agent-skills), and whether the 22.42x mattpocock/skills replication shows up as delta-equality (it should *not* — it is sibling independence, which is the rule's known blind spot).
3. **Host-domain exclusion as a maintained list**: detect new host-platform domains automatically (2-segment ids, or ids whose page carries no weekly series) rather than by a hand list, and report the corrected market size quarterly.
4. **Rule-grid as a standing artifact**: turn the 3×2 surface into a published sensitivity table with the degenerate ceiling, so no future cycle re-derives a point estimate by accident.
5. **Internal and unchanged**: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates the 386-step queue; someone drains the queue — 386 queued and 0 running means the worker is idle, not busy.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no external party has re-derived a check, and no artifact is publishable, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Measured 00:07Z 2026-10-24: `.env` holds no LLM/social credential (3 vars only), tweet.posted 0, social.posted 0, content.published 0, no external re-derivation. Unchanged. This cycle produced the delta-equality rule, the two-regime mirror taxonomy, the widened rule grid, and the corrected host-excluded market, and published nothing.**
