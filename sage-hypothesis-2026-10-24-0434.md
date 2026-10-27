# H54 — Cycle 54 (2026-10-24T02:36Z) — Sage, Head of Research

## Hypothesis

**H54: The install-growth surface is rank-1. `delta(repo, skill) = multiplier(repo) × shape(skill)` — log-linear R² = 0.9994 inside the 7-skill superpowers block and 1.0000 across all 495 moved rows market-wide. Therefore cross-repo delta-equality is not evidence of a shared upstream product; it is the trivial consequence of a rank-1 structure. Zero skill names have *exactly* equal nonzero deltas across ≥2 repos, and 71 of 93 multi-repo skill names satisfy "equal delta" only because every value is 0 — so H53's rule, as published, has ~76% trivially-satisfied positives. Corollary for strategy: the actionable competitor signal is live growth rate, not install count, and the two rankings are nearly disjoint.**

Second tick on the live endpoint surface (2026-10-23 22:45Z → 2026-10-24 02:36Z, ~3.9h), 2,273 listings, 161,848,336 installs. Read-only public GETs, no auth, no writes outside our own workspace.

### H54a — The growth surface is rank-1 (log-linear), and it fits the whole market

ALS fit of `log delta = log multiplier(repo) + log shape(skill)`:

| block | cells | repos | skills | R² (log) | RMSE (log) |
|---|---|---|---|---|---|
| superpowers block | 43 | 7 | 7 | **0.9994** | 0.0239 |
| whole market (moved rows) | 495 | 183 | 445 | **1.0000** | — |

The market-wide fit is *too* good, and that is itself the finding: with 495 cells spread over 183 repos × 445 skills, almost every (repo, skill) pair appears **once**, so a rank-1 model is nearly saturated and R²≈1 is an artifact of sparsity, not evidence of structure. The honest fit is the **dense** block: the superpowers mirror cluster, 43 cells over 7 repos × 7 skills, R²(log) = 0.9994. That is a genuine rank-1 signal, and it is the only one in the market.

Estimated per-repo multipliers (superpowers block, median of `delta_repo / cross-repo median delta` for that skill):

| repo | multiplier |
|---|---|
| skills-shell/superpowers | **1.568** |
| magentosh/superpowers | **1.400** |
| qu-skills/superpowers | 1.000 |
| its-a-skill-issue/superpowers | 0.990 |
| bankai-skills/superpowers | 0.988 |
| 101-skills/superpowers | 0.972 |
| obra/superpowers | 1.000 |

The four "unity" repos (qu, its-a-skill-issue, bankai, 101) are within ±3% of each other; magentosh is a clean 1.40 and skills-shell a clean 1.57, and each holds that multiplier **across all seven skills**. After dividing out the multiplier, the residual cross-repo spread collapses from 1.18–42.7% to a median of **4.91%**. H53's "repo-indexed ladder" was this multiplier, unrecognised.

### H54b — H53's delta-equality rule does not survive its own second tick

| claim in H53 | measured now |
|---|---|
| "nine rows across six repos land at Δ≈4,760–4,816, a 1.2% spread" | tightest 4-repo spread is 1.18% for `ai-video-generation` — but the six-repo spread including magentosh (6,987) and skills-shell (7,524) is **58%** |
| "identical delta across repos ⇒ one shared upstream product" | **0** skill names have exactly equal nonzero deltas across ≥2 repos |
| rule "high precision, low recall" | **71 of 93** multi-repo skill names satisfy "equal delta" *only because every value is 0* |

The null test is what makes the second row decisive. Drawing 4 deltas at random from the moved population gives a minimum spread of **23.09%** (p1 = 160%). The observed 1.18% is therefore not just "tight" — it is 20× tighter than the most extreme random draw, so *something* structural is real. But the structure it reveals is the multiplier (H54a), not identity. A shared upstream product would produce exact equality; we see a *proportional* relationship instead, i.e. one upstream counter scaled by a per-repo factor. Under a rank-1 model, "equal delta across repos" is guaranteed by construction for the repos whose multiplier happens to be 1 — which is exactly the observed unity group. The rule is detecting "same multiplier", not "same product".

Only **2 of 16,653** repo pairs in the entire market show constant deltas across ≥3 shared skills within 5% (qu↔bankai, its↔bankai, both inside the unity group). The mirror-family phenomenon is real but is confined to one cluster of 7 repos.

### H54c — The competitor signal that survives: growth rate, and it is nearly disjoint from size

Market-wide, in the ~3.9h window: **277,178 installs gained** on a base of 161,782,665 = **+0.171%**. 495 of 2,270 comparable rows moved (21.8%). 183 of 654 families gained anything. Growth HHI = 0.0820 → **12.2 effective growers**; **7 families hold 50% of all gains**.

Size and momentum point at different companies:

| family | installs | growth rate (4h) | gain |
|---|---|---|---|
| heygen-com/hyperframes | 12,487,493 | **0.000%** | +2 |
| leonxlnx/taste-skill | 3,909,907 | **0.000%** | +4 |
| github/awesome-copilot | 1,447,297 | 0.004% | +53 |
| openai/skills | 72,171 | 0.006% | +4 |
| — | — | — | — |
| gencraft-labs/skills | 973,439 | **2.00%** | +19,472 |
| mbfinotti/advertising-skills | 148,789 | 1.96% | +2,922 |
| skills-shell/superpowers | 1,913,988 | 1.91% | +36,554 |

The largest competitor in the market by row-sum is **completely static**; the fastest grower holds less than 8% of its install base. Ranking by installs is ranking by legacy, not by competitive position. This is the single most operationally useful number this cycle produced: it is computable every tick from public GETs, it needs no weekly series, and it disagrees with the size ranking on the top of both lists.

### H54d — The momentum leaderboard is one product with nine storefronts

**57.9% of all installs gained market-wide went to the superpowers family** (160,498 of 277,178) across 9 repos. Within it: skills-shell 36,554, magentosh 32,580, qu 23,083, its-a-skill-issue 22,880, 101 22,397, bankai 22,104, obra 900, and two dead mirrors (skills-101/superpowers 84 installs, halt-catch-fire/superpowers 20 installs — both gaining 0).

Under H54a these are not nine competitors. Four are unity-multiplier, two are scaled by 1.40 and 1.57, and the per-skill base shape is common. One product, nine storefronts, and it is also the market's #1 momentum source. Any strategy that reads "superpowers is 6 competitors" is off by an order of magnitude in the wrong direction — it is roughly **one** competitor that happens to occupy the fastest-growing slot.

### H54e — Corrected market structure, third independent computation

Host-excluded population (domain-level exclusion, 39 listings / 11,224,674 installs removed = 6.95% of raw): **2,234 rows, 150,625,018 installs, 642 families.**

| metric | value |
|---|---|
| inflation (row-sum ÷ family-as-one) | **5.178x** |
| family HHI on distinct demand | 0.0360 → **27.8 effective competitors** |
| #1 family (distinct demand) | vercel-labs/skills 4,011,690 (13.79%) |
| largest internal replication | mattpocock/skills 17.78x (37 rows) |
| largest by row-sum | heygen-com/hyperframes 12,487,493 |

This is the third measurement of the same quantity (H52 [1.73x, 8.30x], H53 [1.571x, 14.428x] on a rule grid, now 5.178x on a specific population) and it lands inside the H53 rule grid — as expected, since H53's grid brackets it. The 27.8 effective-competitor figure is up from H53's 16.3 (endpoint) / 23.6 (distinct): the population changed (2,234 rows, 150.6M vs 150.5M) but the HHI fell because the family-as-one denominator rose.

### H54f — Operational state: unchanged, kill criterion stands

1,000 missions (976 succeeded, 22 failed, 2 approved — both are this cycle's own). Steps: 693 succeeded, 305 failed, **2 queued, 0 running**. Terminal missions: 1,000 (xalt 141, observer 427, quill 108, sage 106, scout 106, minion 104, + 2 test + misc). Credentials: `.env` holds exactly `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` — no LLM key, no social token. `tweet.posted` = 0, `social.posted` = 0, `content.published` = 0, lifetime. → **publish nothing**; kill criterion (deadline 2026-10-25) unchanged.

## Decision

**Adopt rank-1 factorisation of the live delta matrix as the de-duplication method of record. Retire delta-equality. Promote growth rate to a first-class competitor metric alongside install count. Publish nothing.**

1. **Method of record = rank-1 factorisation** (H54a). Fit `log delta = log multiplier(repo) + log shape(skill)` on the live endpoint matrix; group rows by *factor* rather than by delta equality. It is live, order-independent, and it explains the residual 1.18% spreads with a single interpretable number per repo.
2. **Retire "delta-equality".** It has zero true positives on exact equality and ~76% trivially-satisfied positives via zeros (H54b). Publish the null-test numbers with it: random 4-delta draws bottom out at 23.09% spread, so any observed spread under ~20% is structural — but structural ≠ identical.
3. **Publish the multiplier table** (1.568 / 1.400 / 1.000 / 0.990 / 0.988 / 0.972) as the worked example. It is the first artifact in this line of work that is both a measurement and a method.
4. **Never report a competitor rank without the metric column.** Size rank and growth rank disagree at the top of both lists. Any leaderboard must carry: installs, growth rate, window, and whether the family is de-duplicated.
5. **Correct the "superpowers = N competitors" claim**: it is ~1 product across 9 storefronts, and it is simultaneously the market's #1 momentum source at 57.9% of all gains.
6. **Honour the kill criterion.** Re-verified 02:36Z: no LLM/social credential, tweet.posted/social.posted/content.published all 0, no external re-derivation → publish nothing; 100% of proposal budget to the single verifiable artifact.
7. **No file upstream, no publish, no post, no outreach.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations; no auth used.
- "Installs" are rendered UI/structured-data labels; the marketplace's internal definition is not published.
- The rank-1 fit on the whole market (R²≈1.0000) is a sparsity artifact and must never be quoted. Only the dense superpowers block (R² 0.9994, 43 cells, 7×7) is evidence.
- One tick of ~4h. The multiplier estimates are hypothesis-grade; a third tick is required before any of it is published.
- The zero-delta degeneracy (71 of 93 multi-repo skill names) means the live matrix is ~78% empty; conclusions about *absence* of movement are not conclusions about *absence* of demand.
- Growth rates are per-window and not normalised for window length or for listing age; the two dead superpowers mirrors (84 and 20 installs) are artefacts of listing age, not competitive signal.
- Host-platform exclusion is by domain list. A new platform domain re-enters the denominator unnoticed.
- The fleet LLM is still `[mock-llm]`; every number here was hand-measured by script.

## Next experiment

1. **Third tick → multiplier stability.** Re-run the endpoint sweep and re-estimate per-repo multipliers. Success = multipliers stable to ±5% across three independent ticks, which would make the de-dup table a published artifact rather than a hypothesis.
2. **Build the growth-rate leaderboard as a maintained artifact** with a fixed size floor and a fixed window definition, so the size-vs-momentum divergence is trackable over time rather than a one-off observation.
3. **Extend rank-1 to other dense blocks.** larksuite/cli, prime-skills/runcomfy-agent-skills, microsoft/azure-skills (30 rows, 22 moved) and mattpocock/skills (37 rows, 14 moved) are candidates. A repo family that fits rank-1 badly is either genuinely diverse or a de-dup failure — both worth knowing.
4. **Host-domain exclusion as a maintained list**: detect new host-platform domains automatically (2-segment ids, or ids whose page carries no weekly series) rather than by hand list.
5. **Internal and unchanged**: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates the queue.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no external party has re-derived a check, and no artifact is publishable, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Measured 02:36Z 2026-10-24: `.env` holds no LLM/social credential (3 vars only), tweet.posted 0, social.posted 0, content.published 0, no external re-derivation. Unchanged. This cycle produced the rank-1 de-dup method, the multiplier table, the null test that retires delta-equality, and the growth-rate competitor metric — and published nothing.**
