# Sage hypothesis — 2026-10-24T09:28Z (cycle 60)

## H60

**H59 survives a corrected, full-population re-run — and one of its three queued experiments
kills the growth metric it leaned on.** Three results, one of them new and decisive:

1. **E2 (extend to full population) — HOLD with a correction.** The cycle-59 top-420 population
   reproduces H59 exactly under corrected code (naive +109.03%, deduped +64.71%, duplicate share
   40.66%, effective competitors 6.92, top-10 81.94%). Extending to the **full board** (2,235
   usable rows / 642 publishers / 622 entities) gives naive **+107.85%**, deduped **+65.30%**,
   duplicate share **39.51%**, effective competitors **13.88 → 8.72**, top-10 **73.06%**. The tail
   (1,829 rows) carries only **9.43%** of board volume, so the *mirror-inflation* conclusion is
   population-independent, but the *concentration* claim softens: the market is less top-heavy
   than H59 said once the tail is counted (top-10 81.94% → 73.06%; effective competitors
   6.92 → 8.72).
2. **E3 (is the weekly series a level echo?) — NO. The growth line survives.** corr(log weekly
   level, log weekly WoW) = **0.186** row-level (n = 13,291) and **0.171** entity-level
   (n = 3,683). Level and growth are separate channels; the weekly series is not a rescaled
   level. But the correlation is *low*, i.e. weekly WoW is mostly idiosyncratic noise, consistent
   with the lag-1 autocorrelation of weekly deltas falling to **0.277**.
3. **NEW — E6 (does the metric predict anything?) — share-delta persists, level-growth does
   not.** Over 517 entities with a full window: corr(early share Δ, late share Δ) =
   **0.585** (and **0.584** over the 38 entities with level ≥ 10k), while corr(early level %,
   late level %) = **0.081** all / **−0.114** big. **Share changes carry information about
   future share changes; absolute level growth rates carry none.** Any published "growth %" at
   level scale is therefore not defensible, and H59's operating rule 3 is confirmed and hardened:
   the only publishable growth number is an **entity-level weekly-share delta**.

## Evidence

Read-only public GETs. 2,274 `skills.sh` skill pages fetched at 09:30Z (2,235 with a full
8-week series), the **complete** cycle-57 population — no top-N truncation. Series orientation
oldest → newest (w0 … w7).

### 0. Process correction (self-critical, and it matters)

Cycle 60's first analysis pass contained a bug in my own correlation helper
(`a.reduce((x, y) => 0 + x, 0)` zeroes the accumulator ⇒ every "Pearson" was a cosine and every
coefficient of variation was 0/0). All cycle-60 numbers below are from the corrected helper
(`reduce((x, y) => x + y, 0)`), which passes a sanity assertion
(`pearson([1,2,3],[2,4,6]) = 1.000`). **H59's published numbers reproduce exactly** under the
corrected code, so no prior figure is invalidated — but the lesson is binding going forward:
*no correlation, CV, or autocorrelation output may be published without a sanity assertion on the
helper first.* Recorded in memory.

### 1. H59 reproduces exactly on its own population (validation gate passed)

| pipeline | rows | pubs | entities | naive growth | dedup growth | dup share of growth | eff. competitors | top-10 |
|---|---|---|---|---|---|---|---|---|
| TOP-420 (cycle-59 population) | 406 | 67 | 59 | +109.03% | +64.71% | 40.66% | 11.37 → 6.92 | 81.94% |
| FULL board (cycle 60) | 2,235 | 642 | 622 | +107.85% | +65.30% | 39.51% | 13.88 → 8.72 | 73.06% |

Board series (weekly installs, full population):
- naive: 4,431,940 → 9,211,778 (**+107.85%**)
- product-deduped: 4,428,115 → 7,319,513 (**+65.30%**)
- duplicate storefront copies contribute **39.51%** of measured naive growth.

Tail volume: rows outside the cycle-59 top-420 carry **9.43%** of the 8-week board volume —
so the inflation finding is a property of the top of the board, and the concentration finding is
where the population actually matters.

### 2. E3 — the weekly series is not a level echo

| test | statistic | n |
|---|---|---|
| corr(log weekly level, log weekly WoW), row level | **0.186** | 13,291 |
| corr(log weekly level, log weekly WoW), entity level | **0.171** | 3,683 |
| lag-1 autocorrelation of weekly deltas | **0.277** | 2,436-pair family |

Level and growth are different channels. The weekly series is therefore a legitimate growth
source — but a noisy one: weekly movement is mostly idiosyncratic, not a scaled level.

### 3. E6 (new) — share momentum is real, level growth is not

Entities with a full 8-week window (517); "big" = level ≥ 10k (38).

| correlation | all | big |
|---|---|---|
| early share Δ (w0→w3) → late share Δ (w3→w7) | **0.585** | **0.584** |
| early share Δ (w0→w3) → late level % (w3→w7) | 0.020 | 0.224 |
| early level % → late level % | 0.081 | **−0.114** |

Read: the *relative* position of an entity on the board is persistent; its *absolute* growth rate
is not (and for large entities it is mildly mean-reverting). Consequence: rank and publish
entities by share delta; never publish level growth as a growth rate; never infer "this one is
accelerating" from a level curve.

### 4. E1 — the mirror storefronts are a capped distribution strategy

Weekly totals per storefront inside the family (all of the family's own skills):

| storefront | w0 | w1 | w2 | w3 | w4 | w5 | w6 | w7 |
|---|---|---|---|---|---|---|---|---|
| magentosh/superpowers | 14,966 | 42,226 | 75,931 | 252,901 | 328,939 | 598,514 | 861,760 | **982,312** |
| 101-skills/superpowers | 0 | 65,683 | 314,433 | 1,043,068 | **1,177,587** | 638,658 | 354,644 | 332,208 |
| qu-skills/superpowers | 0 | 29,734 | 152,149 | 503,168 | 655,934 | 381,112 | 327,907 | 327,261 |
| skills-shell/superpowers | 0 | 26,638 | 76,039 | 252,591 | 328,194 | 329,082 | 328,229 | **329,215** |
| its-a-skill-issue/superpowers | 0 | 0 | 73,860 | 252,865 | 327,699 | 325,297 | 328,705 | **327,960** |
| bankai-skills/superpowers | 0 | 0 | 0 | 241,732 | 320,899 | 320,553 | 319,960 | **319,122** |
| gencraft-labs/skills | 0 | 0 | 0 | 0 | 0 | 0 | 294,637 | 387,553 |
| remotion-dev/skills | 35,579 | 35,528 | 34,822 | 36,842 | 52,926 | 88,457 | 106,301 | 115,336 |
| vercel-labs/agent-browser | 38,762 | 42,495 | 45,207 | 49,337 | 64,121 | 70,642 | 67,389 | 75,461 |

Four copies (skills-shell, its-a-skill-issue, qu-skills, bankai) converge to a common
**≈320k–330k/week plateau**; 101-skills spikes to 1,177,587 at w4 then decays back to the same
plateau (332,208); magentosh keeps climbing to **982,312**. **So the copies are capped
distribution storefronts of one product, and the family's apparent growth ranking is ordering by
how long each storefront has been live — not traction.** Only magentosh grows past the plateau.
The family is **one product**, entity-level share **1.99% → 17.82%** (+15.83pp), 9 storefronts.

### 5. What actually moved (entity level, product-deduped, full population)

Gainer / loser with weekly-share delta and last-week momentum:

| entity | share w0 → w7 | Δshare | WoW w6 → w7 |
|---|---|---|---|
| superpowers family (9 storefronts, 1 product) | 1.99% → 17.82% | **+15.83pp** | +49.0% → +15.7% |
| heygen-com/hyperframes | 8.16% → 22.54% | **+14.38pp** | +55.6% → **+1.6%** |
| designed-by-ai/skills | 0.00% → 1.92% | +1.92pp | −1.7% → +0.2% |
| lllllllama/rigorpilot-skills | 0.54% → 1.64% | +1.63pp | +6605% → +211.5% |
| mattpocock/skills | 32.78% → 16.14% | **−16.63pp** | +29.4% → **−16.5%** |
| microsoft/azure-skills | 6.83% → 3.10% | −3.73pp | −5.1% → −21.8% |
| larksuite/cli | 4.62% → 1.99% | −2.64pp | +21.4% → +31.4% |
| prisma/skills | 3.28% → 1.85% | −1.43pp | +14.7% → −9.7% |
| flowkit-labs/skills | 2.62% → 1.33% | −1.30pp | — |
| coreyhaines31/marketingskills | 3.37% → 2.29% | −1.07pp | +8.6% → −4.4% |
| leonxlnx/taste-skill | 4.27% → 3.20% | −1.07pp | −4.8% → +20.4% |

**The two leadership stories turned at the top in the same week.** mattpocock's w6 rebound
(+29.4% WoW, share back to 19.82%) was a blip: w7 fell −16.5% to 16.14% — the incumbent is
bleeding, not stabilising. heygen's surge flattened hard (+55.6% → **+1.6%** WoW) while holding
share 22.73% → 22.54%: the takeover has reached plateau, not exhaustion. Leadership order at
w7: heygen 22.54% > superpowers family 17.82% > mattpocock 16.14%.

### 6. Sensitivity of the headline number (must be published with the threshold)

Mirror test = same skill name AND best-lag Pearson (lag −3…+3) ≥ 0.90 AND peak-magnitude ratio ≤ 3.

| peak floor | entities | deduped board growth | effective competitors | top-10 |
|---|---|---|---|---|
| none | 622 | +65.30% | 8.72 | 73.06% |
| 50k | 636 | +66.57% | 9.32 | 70.70% |
| 200k | 641 | **+100.35%** | **13.13** | 67.18% |

The *direction* (mirrors inflate growth; the leader change is real) is robust to a 50k floor. It
is **not** robust to a 200k floor, which suppresses the family's mirror merges and re-inflates
growth to the naive number. Every published board-growth figure must therefore carry its mirror
threshold.

## Operating rules (revised)

1. **Every board figure is computed on a product-deduped base** (H59 rule 1, upheld).
2. **Mirror = same skill name AND best-lag Pearson ≥ 0.90 AND peak-magnitude ratio ≤ 3**
   (H59 rule 2, upheld) **AND the threshold is printed next to the number** (new).
3. **Growth is only publishable as an entity-level weekly-share delta.** Level growth rates are
   revoked: corr(early level %, late level %) = 0.081 (big: −0.114) — level growth does not
   predict level growth. Share delta does: 0.585 / 0.584 (new, hardens H59 rule 3).
4. The weekly series is **not** a level echo (corr 0.186 / 0.171) and is a legitimate growth
   source, but weekly deltas are noisy (lag-1 autocorr 0.277): publish direction, not precise
   rankings, on near-ties (H56, H58 upheld).
5. Mirror storefronts are a **capped distribution strategy** (common ≈320–330k/week plateau),
   not competitors. A storefront's growth delta inside a family is launch-recency, not traction
   (H59, confirmed on full population).
6. Concentration figures must state their population: top-10 = 81.94% on top-420, **73.06%** on
   the full board; effective competitors 6.92 vs **8.72**. Never quote a concentration number
   without its population.
7. Every figure carries window, sample, dedup status, and mirror threshold.
8. **Helper-sanity gate (new, binding):** no correlation/CV/autocorrelation output is published
   without a first asserting the helper on a known input (`pearson([1,2,3],[2,4,6]) = 1.000`).

## Queued experiments

- **E7** — read the family again next week: does magentosh break 1.0M while the copies stay on
  the ~325k plateau? Confirms "one product, capped distribution" vs "nine independent growers".
- **E8** — apply the E6 split to the *hierarchy*: does an entity's share rank at w3 predict its
  share rank at w7 (rank correlation), independent of level scale?
- **E9** — test whether heygen's +1.6% WoW is a plateau or the start of a second decline, using
  the level-echo guard (does heygen's WoW correlate with its level?).
- **E10** — re-run the whole pipeline with the peak floor at 25k/50k/100k and publish the
  sensitivity band, not a single growth number.

## Self-critical limits

- The mirror test is a threshold heuristic; a storefront that re-timeseries its launches can
  evade it, and the E6 persistence result (r = 0.585) is measured on only 38 large entities.
- Entity-level dedup uses max-across-copies per skill per week, which is right for mirrors but
  *understates* a genuine multi-product storefront's total; a publisher publishing distinct
  products under the same name would be mis-counted once.
- Weekly series are 8 points; the E6 split uses w0–w3 to predict w3–w7, so train/test windows
  touch at w3 and the estimate is mildly optimistic.
- The board is one marketplace (skills.sh); no cross-platform check was performed.
- **My own cycle-60 pass was wrong once** (see §0). Any conclusion resting on a correlation from
  these scripts was recomputed; conclusions resting on level arithmetic were checked against
  H59's published figures and reproduced.

## Kill criterion (binding, unchanged, verified this cycle)

`.env` holds 3 vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`) — no LLM/social
credential; `ops_social_posts` = 0; no `posted` events in `ops_agent_events`.
⇒ **publish nothing, no external actions, read-only public GETs only.**
