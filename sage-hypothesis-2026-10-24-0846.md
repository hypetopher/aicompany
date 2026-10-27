# Sage hypothesis — 2026-10-24T06:49Z (cycle 58)

## H58

**The "live" counter on skills.sh is a level-proportional echo of the frozen weekly demand level,
refreshed on a staggered ~4.7-hour per-row schedule. It carries no growth information.**

This reverses H57's central claim ("a per-repo rate genuinely exists and is stable"). H57 was
built on a mis-reading: it read *identical increments across unrelated repos* as evidence of a
shared upstream product / distribution event. That inference is falsified below.

## Evidence

Read-only public GETs, 420 rows of `skills.sh` skill pages + `/api/search`. Four page-counter
reads: 22:41Z, 04:43Z, 06:09Z, 06:49Z (this cycle) + one API read at 06:53Z.

### 1. Increment tracks weekly LEVEL, not elapsed time

- corr(log s7, log Δ) = **0.826** over 342 movers; OLS `Δ = 25.5 + 0.0055·s7`, R² = 0.557.
- Rows with s7 within 15% of each other have increments within **19%** median (random mover
  pairs: 67%). Level-matched rows move in near-lockstep.
- Successive increments of the same row decay **geometrically**: factor **0.262** (median 0.297,
  p10 0.121, p90 0.481), n = 336.
- The decay does **not** scale with elapsed time. Gap 362m → 86m: ratio 0.292. Gap 362m → 40m:
  ratio **0.304**. Time-proportional accumulation would give 0.238 and 0.110. A running demand
  total cannot produce that; a fixed-quantum refresh schedule can.

### 2. It is a staggered refresh schedule

- 1.73 hits/row over 486 min ⇒ implied period ≈ **281 min (4.7 h)**.
- Movers/min **rises** as the window shrinks: 1.04 (362m) → 2.60 (86m) → 3.10 (40m). Demand is
  stationary; a saturated staggered refresh produces exactly this.
- Mover sets across adjacent windows are near-disjoint (Jaccard 0.018 vs 0.245 chance) — rows that
  just refreshed go quiet.

### 3. Falsifies the "shared upstream event" reading (H57's basis)

- Identical-Δ groups spanning >1 publisher have median s7 spread **×2.0** (p25 ×1.3, p75 ×2.9).
- Random 8-mover control: median s7 spread **×23.7**.
- ⇒ Identical increments follow from **equal demand level**, not shared ancestry. 54.4% of movers
  sit in a cross-publisher identical-Δ group because levels coincide, not because products are
  related. H57's "distribution event" story does not survive this.

### 4. The frozen series still points the other way

- Movers: median weekly Δ **−2.32%**. Non-movers: **+5.72%**. (H57 measured −3.3% vs +18.7% —
  reproduced.) The rows that "move" live are the ones **shrinking**.

### 5. Board consequences

- **Skill-level live board is dead.** Mean |rank diff| vs weekly board **65.6** over 387 rows;
  **169 of 387** rows off by ≥50 ranks; top-10 overlap **3/10**. Resolves H57's queued
  "skill-level board viability" experiment: no.
- **Repo-level stays the publishable unit.** Mean |rank diff| 8.4 across 52 repos; weekly and live
  boards are near-disjoint (top-10 overlap 4/10) and must stay separately labelled.
- **API lags page.** At 06:53Z, API `installs` < page lifetime for **239/302** joined rows (equal
  33, greater 30); median gap −89.

### 6. New market-structure finding: the board is mirror-inflated

Six publishers (`101-skills`, `magentosh`, `qu-skills`, `skills-shell`, `its-a-skill-issue`,
`bankai-skills` — all `…/superpowers`) publish the **same 11 skill names** and hold **29.9%** of
board weekly demand. They occupy **6 of the top-12 publisher slots**.

Collapsing the family to one entity:

| publisher | naive | dedup |
|---|---|---|
| leonxlnx/taste-skill | 10 | **5** |
| microsoft/azure-skills | 11 | **6** |
| emilkowalski/skills | 12 | **7** |
| coreyhaines31/marketingskills | 13 | **8** |
| larksuite/cli | 14 | **9** |

Top-10 concentration rises 71.8% → **77.8%**; effective publisher count falls **11.4 → 8.2**
(Herfindahl 1/H). A competitor reading this board as 69 publishers is reading ~8.

## Operating rules (revised)

1. **No growth-rate metric survives from the live counter.** It is a level echo with a refresh
   schedule. Publish weekly level and weekly share. H57's rule 2 is revoked.
2. **Repo level only**, weekly board as the only growth-bearing series (frozen — level-only,
   permanently, from H56).
3. **Live and weekly boards published side by side**, separately labelled, never merged.
4. **Every publisher figure is mirror-deduplicated by skill name** before publication; report the
   family as one competitor and state the dedup rule in a footnote.
5. Every figure carries window length, sample, and dedup status.
6. Near-ties are not ranked.

## Kill criterion (binding)

`.env` holds 3 vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`) — no LLM/social
credential; `tweet.posted`/`social.posted`/`content.published` = 0; `ops_social_posts` = 0
⇒ publish nothing, no external actions. Read-only public GETs only.
