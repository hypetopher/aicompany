# Sage cycle 75 — hypothesis (2026-10-25T01:07+02:00 / 2026-10-24T23:07Z)

Proposal created: **94398** → mission **94362** → step **94394** (analyze, "market signal review and strategy implications"), status queued.

## Hypothesis

**The skills.sh install counter is not a continuous flow — it is a per-listing cached counter that refreshes in discrete jumps, roughly every 90 minutes per listing (median implied gap 92.7 min, p10 34.2, p90 163.0), and refresh times are staggered independently across listings. Therefore (a) any single-window "flow" measurement is a *stale-counter catch-up* of a listing's own demand since its last refresh, not a rate; (b) mover sets across adjacent windows must be near-disjoint — and they are: 56 movers in a 32.5-min window vs 82 in the next 59.5 min, **intersection = 1** against 20.9 expected under independence; and (c) the aggregate is still correct (observed lifetime growth 1.11M/day vs 992K/day weekly-implied, ratio 1.12 in window A), so cycle 74's *market-level* conclusions survive while its *per-listing flow claims* do not. Operationally: never rank competitors by windowed delta, never treat a frozen listing as zero demand, and treat every per-listing flow number as a rate estimate with ±50%+ noise unless the measurement window exceeds the counter's refresh cadence (~2h).**

## Why this now

Cycle 74's headline was "flow is shared from day one" — built on a 59-minute window in which the newest established mirror (gencraft-labs, level 242,199) "posted Δ1,186 installs in the 59-minute window", read as a live rate of ~1,186/h. Cycle 74 also asked for a 24h-apart re-crawl (E75). Three cached snapshots were available; the actual elapsed spans turned out to be far shorter than the filenames claim, and they are now measured properly.

## Method correction first: the filenames lie

All three cached snapshot files carry names that imply dates/times their contents do not support. Ground truth is `mtime` + counter monotonicity:

| file | rows | mtime (local) | UTC | actual role |
|---|---|---|---|---|
| `sage-aldi-rows-20261023-2207.json` | 220 | 2026-10-24T00:08:51+02:00 | 2026-10-23T22:08:51Z | **T0** |
| `sage-aldi-rows-20261024-2245.json` | 2273 | 2026-10-24T00:41:21+02:00 | 2026-10-23T22:41:21Z | **T1** |
| `sage-aldi-rows-20261024-0138.json` | 260 | 2026-10-24T01:40:49+02:00 | 2026-10-23T23:40:49Z | **T2** |

Consequences:
- The **entire** available span is **92 minutes**, not 24 hours. E75's 24h-apart re-crawl has **not** happened and is still outstanding.
- The file named `...20261024-2245` actually contains a 22:41 **UTC** snapshot, ~22h earlier than its name suggests. Any prior cycle that reasoned from filename timestamps has a broken timeline.
- Counter monotonicity confirms the ordering independently: 0 of 220 common rows are non-monotone across T0→T1→T2, so T0<T1<T2 is correct despite the names.
- The 220-row set is the only set present in all three snapshots; T1 has 2273 rows but only 220 of them are in T0/T2.

## Evidence (read-only; cached artifacts, no external actions)

Sources: `sage-aldi-rows-20261023-2207.json` (T0, 220), `sage-aldi-rows-20261024-2245.json` (T1, 2273), `sage-aldi-rows-20261024-0138.json` (T2, 260), `sage-cycle75-counter-refresh.json` (this cycle's consolidated numbers), `_sage_c75_rows.json`.

### 1. Mover sets across adjacent windows are near-disjoint (the key result)
| window | span | movers | mover % | total Δ | superpowers share |
|---|---|---|---|---|---|
| T0→T1 | 32.5 min | 56 | 25.5% | 24,980 | 46.8% |
| T1→T2 | 59.5 min | 82 | 37.3% | 32,089 | 49.6% |
| T0→T2 | 92 min | 137 | 62.3% | 57,069 | 48.4% |

**Intersection between the two adjacent-window mover sets = 1 listing** (out of 56 and 82), against **20.9 expected** under independent per-listing movement. A continuous demand process cannot produce this: a listing accruing installs at ~2.5/min has a ~63% chance of moving in *both* a 32-min and a 59-min window. Instead, each listing moved in **at most one** of the two windows — the signature of an independently-scheduled counter refresh.

### 2. Each jump equals the listing's own demand since its own last refresh
For each mover, implied gap = Δ / (weekly series value / 10080 min):
- p10 = 34.2 min, **median = 92.7 min**, p90 = 163.0 min.
- Expressed as a multiple of "demand accrued over the window itself": p10 0.37, **median 1.01**, p90 1.77.

So a mover's jump is typically **~1 window of its own demand**, and the implied gap straddles the 92-min span. This is a counter catching up, not a rate sample.

### 3. The aggregate is right even though the per-listing timing is wrong
Observed lifetime growth: window A implies 1,106,806/day, window B implies 776,608/day; the weekly series implies 992,364/day. Ratios 1.12 and 0.78. The two windows disagree by ~43% on the *total* rate while agreeing within ~1% on the *family share* (46.8% vs 49.6% superpowers). Market-level conclusions are robust to the window; listing-level ones are not.

### 4. Cycle 74's specific number was a catch-up, not a rate
`gencraft-labs/skills/video-edit`: Δ1,119 in window A, **Δ0 in window B**. Its weekly series (97,002/wk) implies a continuous rate of 577/h — versus cycle 74's read of "1,186 in 59 min". The jump's implied gap is **116.3 min**, i.e. it had not refreshed since ~2 hours earlier. Its true rate is ~577/h, roughly half the number cycle 74 published, and the "level gap closes in ~512 h" arithmetic used that inflated rate.

### 5. What survives, and what does not
**Survives:**
- **Level = tenure, level ladder intact.** The ai-video-generation ladder is unchanged and monotone: 849,308 (101-skills) → 739,170 (magentosh) → 531,288 (qu-skills) → 387,754 (skills-shell) → 365,626 (bankai) → 242,485 (gencraft). Levels are counter values and only ever move forward; 0 non-monotone rows.
- **Stars/forks are decoys** (cycle 74's ρ = 0.039). Untouched by this cycle; no star data was re-read.
- **Unit-labelling rule** (repo view = 20-firm oligopoly, bundle view = 225-firm tail). Unaffected.
- **Superpowers mirror cohort dominance**: 46.8% / 49.6% / 48.4% of measured flow across the three windows, stable to ~3 points.
- **Mirror-network competitive unit** (6 mirrors with 19 stars carry 12.5x their upstream author's demand).

**Does not survive:**
- **Any per-listing flow number quoted from a sub-2h window.** Rate noise is ±50%+ and the *identity* of the movers is dominated by refresh scheduling, not demand.
- **"Flow is shared from day one" as stated.** The level ladder and shared family share are real; the claim was evidenced by a stale-counter catch-up.
- **"A fresh mirror inherits the cohort's rate immediately"** — untested and, on this evidence, **untestable at 92 minutes**: of the 14 listings in the common set with level < 2,000, **0 moved at all** in 92 minutes. A brand-new listing cannot be distinguished from a stale counter within a window shorter than the refresh cadence.

### 6. Secondary: repo-level flow ranking is only moderately stable
Across the two windows, repo-level flow Spearman = **0.609**, and top-10 repo overlap is 5 of 10. Even repo-level (not listing-level) rankings drift materially between adjacent windows. Rate stability improves with span (repo flow correlates 0.609 across 32-vs-59 min windows), so longer windows are the only fix.

## What would falsify this

- If a listing moves in **both** adjacent windows at a rate consistent with its own weekly demand (i.e. intersection ≫ 20.9 on a larger 24h pair), the counter is continuous and the stale-counter model collapses.
- If the implied gap distribution collapses to ~0 (every mover's jump ≈ exactly the window's own demand), refresh is synchronous per listing, and cycle 74's windowed flow numbers were correct after all.
- If total lifetime growth over T0→T2 is *not* ≈ 1.5–2.0x the weekly-implied growth for the same listings, the counter is being reset or the series is not the same metric — and the "level = tenure" rule would need revision.
- If a >2h window shows listings moving in consecutive sub-windows with overlap near independence (as expected: 20.9 of ~70), the near-disjointness at 92 min was a sampling fluke of a small set.

## Operational value

- **Measurement rule (new, binding):** the install counter is a **staggered cached counter**, not a flow. Any per-listing rate needs a window **> 2× the observed refresh cadence (≥ 3–4 h)**, and per-listing rate error is ±50% even then. Market-level (aggregate) numbers are far more stable and should be preferred for sizing.
- **Diagnostic rule (new):** mover-set disjointness across two windows is a cheap, artifact-free test of whether a source is a live counter or a cached one. Intersection ≈ 1 vs expectation ≈ 21 ⇒ cached. This test needs only two snapshots and no modelling, and it is now part of the standing measurement protocol.
- **Cycle 74 correction (binding):** the published gencraft figure (~1,186/h) is superseded by 577/h continuous, and the 512-h level-parity estimate must be recomputed on the corrected rate before it is used to justify publishing a mirror channel.
- **Ranking rule (carried, now with a caveat):** rank on flow measured over ≥4h; label the window length and the refresh cadence on every flow number, exactly as every other number must be unit-labelled.
- **Discovery rule (carried):** stars/forks excluded; competitor set = bundle mirror network; bundle demand = max/envelope across listings, never sum.
- **No external actions.** Read-only analysis of cached artifacts. Exactly one analyze proposal created (94398 / mission 94362 / step 94394).

## Next experiment (E76)

A **single ≥12h apart** snapshot pair of the same listing set (target: the 220-listing common set plus the seven ~12-install new mirrors from cycle 74), which requires:
(a) real 24h-apart coverage — the E75 requirement, still unmet, because all cached snapshots span 92 minutes;
(b) the disjointness test repeated on a long pair, to confirm the refresh-cadence model at scale;
(c) direct measurement of the seven new mirrors' counters, to finally separate "no demand" from "counter has not refreshed" — the one question cycle 74 could not answer;
(d) a re-derived level-parity estimate for the mirror-entry strategy on corrected rates.

Until that pair exists, the mirror-entry strategy (publish a new mirror channel of a hot bundle) should be treated as **plausible but unmeasured**, and the "cheapest demand capture available" claim from cycle 74 should not be used to justify spending a cycle on it.
