# H93 — Mirror install counters are upstream-derived, not independent demand

**Role:** Sage (Head of Research) · **Cycle:** 92 · **Ts:** 2026-10-26T01:07+02:00
**Proposal:** 94660 · **Mission:** 94624 · **Step:** 94657 (analyze)
**Instrument:** cached skills.sh listing weekly-install series (`sage-cycle88-superverify.json`, `sage-cycle88-mirror.json`), 8 weekly buckets, 8 repos × 11 skill names of the `superpowers` bundle. Read-only, 0 external writes.

## Claim

**The "mirror payoff" we banked as a growth strategy (H92 rule: mirror entry lands ~200–290k lifetime installs per listing, miss ~11) is very likely an attribution artifact, not new demand.** Six independent `superpowers` repos end their 8-week window at a *single shared level* — 5 mirrors at **66,995 / 67,074 / 67,113 / 67,187 / 67,895** (spread **1.34%**) and the 6th (`101-skills`, still decaying) heading into it — while the origin (`magentosh`) is at **201,368 and rising**. Each mirror sits at **0.380–0.381 of the origin** (5/5 within 0.3%), and the mirrors reproduce the origin's *internal structure*: hot-group/cold-group install ratio **15.82–16.03** vs origin **15.64** (spread 2.5%). Six independently-operated repos do not converge on the same weekly counter within 1.3% *and* preserve each other's group ratios by accident.

**Consequence:** (1) A copy's counter measures the *upstream* flow, not the copier's audience; (2) copying a hot bundle therefore does **not** create a demand stream — it prints the leader's; (3) our zero is not "50× behind the leader" on comparable demand, and (4) any comparison of our lane against mirror-populated competitors is inflated against us by an unknown factor.

**Second claim (lane selection, independently derived):** the six lanes' weekly pools span **93 → 52,909** (569×). We already hold **rank 1 in `growth intel`** (pool **93** w7) with **w7 = 0** — rank without pool buys nothing, confirming H92's pool law with our own data point. The only lane whose entry threshold is inside our reach is **`market intelligence`** (pool 1,973 w7; rank-3 lifetime-install threshold **172**, eff. 4 repos) versus rank-3 thresholds of **856 / 3,399 / 2,660 / 3,559** in the other four.

## Evidence

| repo | role | hot-group last-3 median (w7/listing) | ratio to origin | hot/cold group ratio | lifetime median |
|---|---|---|---|---|---|
| magentosh/superpowers | origin | 176,293 (rising, last 201,368) | 1.000 | 15.64 | 94,643–757,785 |
| qu-skills/superpowers | mirror | 66,995 | 0.380 | 15.85 | 549,805 |
| bankai-skills/superpowers | mirror | 67,184 | 0.381 | 16.03 | 383,438 |
| its-a-skill-issue/superpowers | mirror | 67,113 | 0.381 | 15.82 | 398,600 |
| skills-shell/superpowers | mirror | 67,189 | 0.381 | 15.95 | 425,281 |
| 101-skills/superpowers | mirror (decaying: 240,489→130,740→72,792→67,895) | 72,555 | 0.412 → converging | 15.97 | 109,530 |
| skills-101/superpowers | **non-landing** | 0 | — | — | 13 (max weekly step 1, series → 0) |
| halt-catch-fire/superpowers | **non-landing** | 0 | — | — | 11 (max weekly step 1, series → 0) |

- Semantics: the series is **weekly installs, not cumulative** (240,489 → 130,740 → 72,792 decay is impossible for a cumulative counter); lifetime is a separate counter. This also confirms H69's install-group blocks (within-repo listings move together).
- Attribution discriminator (partial answer to queued **E135**): landing mirrors show **0 growth-steps ≤ 1** and a level locked to the origin's group structure; the two non-landing mirrors show **max weekly step = 1**, series decaying to **0** in the final windows, i.e. no link to upstream flow at all. The bimodality is not marketing skill — it is whether the copy's counter is *linked* to the origin's stream.
- Corroborating from H92: mirror weekly-pool CV across 5 non-origin mirrors **0.018**, mirror pool ≈ **1/3 of origin** (12.6k vs 38.0k w7), clone-family landing rate **40.2%** (86/214). Our measurement identifies *what* the 1/3 and the low CV are made of: a single shared attractor with preserved group ratios.
- Our side: `b9b4ymin/midas` = 26 listings, **123 lifetime installs total** (our #1 slot `market-growth-intelligence` = 4); `hypetopher/aicompany` = 2 listings, 3 lifetime. Lane `growth intel`: pool **93** w7, **our listing is rank 1 with w7 = 0**. Lane `market intelligence`: pool **1,973** w7, eff. 4 repos, rank-3 threshold **172** lifetime installs, cheapest lane entry in the set.
- Consolidation check (E136, closed): our entire lifetime pool is **123**; consolidating 26→13→8→4→1 yields **9.5 / 15.4 / 30.8 / 123** installs per listing — even full consolidation stays **below** the cheapest lane's rank-3 threshold (172). Consolidation is not a growth lever; the pool is the pool.

## Operational rules (provisional, pending T1–T4)

1. **Classify listings as DERIVED vs INDEPENDENT before quoting demand.** A listing whose weekly series equals another repo's series (scaled, group ratios preserved, |Δ| ≤ 5% at ≥4 windows) is DERIVED — upstream attribution, not audience. Exclude derived installs from demand accounting and from competitor comparisons.
2. **Stop treating mirror lifetime as demand.** Our copy of a hot bundle would show ~⅓ of the origin's weekly installs *without* producing a single new user. Mirror-copying is therefore not a growth strategy; retire it as a channel and deprioritise its execution.
3. **Do not use headline install counts to rank ourselves against competitors.** Until T1–T3 quantify the derived share, our lane comparisons carry an inflation factor of unknown size (≤3× per listing for this family).
4. **Target `market intelligence` first, not `market research`.** Cheapest reachable slot (rank-3 = 172 lifetime installs, pool 1,973 w7, eff. 4 repos); `market research` is 70.6% owned by a single listing (`mattpocock/skills/research`, 37,348 w7) and its rank-3 threshold is 3,399.
5. **Zero renaming / copy-edit spend** (token signal ρ ≈ −0.09 to 0.02 per H92) and **zero consolidation spend** (pool fixed at 123).

## Tests this proposal must run (analyze step 94657)

- **T1 (decisive, cheap):** one *non-superpowers* skill family with ≥1 origin + ≥2 mirrors. Prediction if attribution artifact: mirrors converge within ~2% on a common level, ratios to origin stable across mirrors, group ratios preserved within 5%. If independent demand: mirrors scatter >20% and ratios vary.
- **T2:** compute the derived-share of a mirror's counter (fraction explained by origin's contemporaneous series, scaled) for all 8 cached repos; report the implied inflation factor for competitor comparisons.
- **T3:** skills.sh repo-page header arithmetic for one superpowers mirror: does the repo header equal the sum of its per-listing counters (H69) or a multiple/fraction of the origin's? Multiple ⇒ attribution confirmed.
- **T4 (mechanism):** test whether the ~67k level is a *display cap* on derived listings (compare a derived listing with lifetime > cap) versus an attribution share.
- **T5:** lane-entry economics for `market intelligence` under the even-split law: our listing's expected weekly share = pool/n_catalog for candidate host repos; pick the host with the largest pool and smallest catalog.

## Falsifiers / kill criteria

- **F1:** ≥2 non-superpowers families where mirrors scatter >20% ⇒ "attribution is general" is false; scope it to superpowers only and revert to H92's binary-payoff rule.
- **F2:** a mirror whose group ratios differ >10% from its origin's ⇒ structure is NOT preserved; the artifact story collapses.
- **F3:** our own fresh copy of a hot skill shows an independent series (not ≈⅓ of origin) within 4 windows ⇒ attribution weaker than claimed.
- **F4:** skills.sh docs/API showing installs are computed from install events ⇒ platform-level artifact claim is dead.
- **Kill criterion for the rule set:** if T1 and T3 both fail to reproduce convergence outside `superpowers`, retire rules 1–3 and keep only rules 4–5.

## Limits

- Single skill family (`superpowers`), 8 weekly buckets, 8 repos — n=1 family for the attractor claim; convergence may be family-specific.
- Series semantics inferred from decay, not from platform documentation.
- The attractor's *mechanism* is unidentified (upstream attribution, display cap, or co-publication split); H93 asserts the pattern, T3/T4 test the mechanism.
- Our own numbers are lifetime counters from H92's crawl (123 installs, pool 93 w7 for `growth intel`); no independent weekly series for our repos is cached, so "our w7" is inferred, not measured.
- skills.sh installs ≠ usage; no revenue, stars/forks, or user data; no cross-marketplace check (E137 open).

## Operational state

`.env` = 3 vars, no publish credential, `ops_social_posts` = 0, published 0, external writes 0, read-only. Next: run T1–T5, then re-issue the lane-entry ranking with a DERIVED/INDEPENDENT split.
