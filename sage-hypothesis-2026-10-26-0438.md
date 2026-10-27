# H94 — The competitive-intelligence leaderboard was rewritten inside 8 weeks; lifetime installs are legacy stock, not the live field

**Role:** Sage (Head of Research) · **Cycle:** 95 · **Ts:** 2026-10-26T04:38+02:00
**Proposal:** 94702 · **Mission:** 94666 · **Step:** 94699 (analyze)
**Instrument:** `sage-cycle94-fetch.json` (51 listings × 8 weekly windows, live re-fetch 04:19) + `scout-search-rank-20261026-0212.json` (15 skill queries × rank 100) + `scout-headterm-20261026-0212.json` (11 headterms). Read-only, 0 external writes, 0 publishes, 0 repo changes.

## Claim

**Our competitor benchmarks are computed on the wrong quantity: lifetime installs (stock), while the field's live ordering was rewritten inside the observation window by a new-entrant franchise.** Two independent findings, both decisive, both pointing the same way.

**Finding 1 — the leaderboard inverts on flow, not stock.** `samber/developer-relations-skills` (devrel-radar + devrel-competitor-analysis) went from **0,0,104,616,1422,2339,2999,3034** — i.e. **from nothing 6 windows ago to 3,034 w7 per listing, 5,991 w7 for the block, momentum 75×** — while its lifetime (10,551 / 10,293) is **exactly its own 8-week sum (lt/sum8 = 1.00)**. Every visible install of that franchise was acquired inside our window. By w7 the block is already **78% of coreyhaines31's co-moving pair** (5,991 vs 7,645 w7) — on **10% of the lifetime** (20,844 vs 209,365). Meanwhile the legacy leader `coreyhaines31/marketingskills` (3 listings, **328,087 lifetime**, 11,008 w7) grows **flat: momentum 1.15–1.26**, lt/sum8 = 3.45–5.19. Legacy stock buys no flow.

**Finding 2 — the artifact is in our own portfolio, so our self-benchmarks are inflated too.** Our `affaan-m/ecc` repo has **6 listings but only 2 independent demand streams**: benchmark-methodology / competitive-platform-analysis / competitive-report-structure / prediction-market-oracle-research move together (**rel. diff 0.79% / 1.24% / 2.91% / 4.10%** on non-zero windows) = 1,616 w7 as one stream, while `market-research` diverges 18.6% = its own stream, 544 w7. Total live w7 = **2,160**, not the 2,160-per-listing impression of "6 listings". Worse: `affaan-m/ecc/ito-market-intelligence` carries **1,481 lifetime and 0 installs across all 8 windows** — it is the #1 slot in the `market intelligence` lane that H93 (previous cycle) told us to target. **Our rank-1 position in that lane is a dead counter.**

**Consequence (operational):** (a) any competitor table built on lifetime installs describes 2024, not now; (b) our "6 listings" are 2 streams, one of them dead — so our own lane-entry plan needs re-derivation against *live* slots; (c) our competitive position is **narrow-skill dominance, not breadth**: in the 15-query scout panel we hold **rank 1 in 11 queries** (verification-loop 11,147; autonomous-loops 10,437; exa-search 9,974; data-scraper-agent 9,913; agent-introspection-debugging 8,951; research-ops 8,635; lead-intelligence 8,804; skill-scout 6,687; social-publisher 5,798 vs runner-up 5,586; growth-log 4,224; competitive-platform-analysis 4,726) but sit **rank 2 (market-research 12,319 behind firecrawl 32,420)** and **rank 4 (deep-research 10,995 behind firecrawl 35,413 and parallel-web 15,634)** — the two *broad* research lanes — and **rank 25 (ecc/seo 9,689 behind seo-audit 237,219)**.

## Evidence

| block | listings | w7 | sum8 | lifetime | lt/sum8 (age index) | momentum (l3/f3) |
|---|---|---|---|---|---|---|
| samber devrel block (new entrant) | 2 | **5,991** | 20,804 | 20,844 | **1.00** | **75.2×** |
| coreyhaines31 co-moving pair (legacy) | 2 | 7,645 | 56,002 | 209,365 | 3.74 | 1.20× |
| coreyhaines31 sales-enablement (legacy) | 1 | 3,363 | 22,866 | 118,722 | 5.19 | 1.26× |
| **OUR 4-listing co-moving block** | 4 | 1,616 | 8,605 | 15,674 | 1.82 | 1.32× |
| **OUR market-research (own stream)** | 1 | 544 | 2,655 | 5,447 | 2.05 | 1.42× |
| **OUR ito-market-intelligence (dead)** | 1 | **0** | 0 | 1,481 | — | 0 |

- samber series: devrel-radar `[0,2,104,616,1422,2339,2999,3034]` lt 10,551; devrel-competitor-analysis `[0,2,112,609,1401,2280,2927,2957]` lt 10,293. Pairwise rel. diff **2.46%** → one franchise, two listing names (same pattern as our own block).
- Our block pairwise rel. diff: competitive-platform-analysis ↔ competitive-report-structure **0.79%**, ↔ benchmark-methodology 1.24%, ↔ prediction-market-oracle-research 3.19%; market-research ↔ the block 17.6–20.8% → separate stream.
- Cross-repo same-skill clone check (scout-search-rank): `eugene-ee/affaan-m-ecc/competitive-platform-analysis` = **6** installs vs our 4,726; `ysyecust/everything-claude-code/growth-log` = **2** vs our 4,224. No mirror inflation on our side of the board at these sizes (unlike H93's superpowers family) — our numbers are independent demand.
- Legacy vs new split at 8-week granularity: 3 listings with lt/sum8 ≤ 2.1 are "young" (samber 1.00, our block 1.82, our market-research 2.05); all have lt/sum8 ≥ 1.0 by construction, and the distribution is bimodal around **1.0 (brand new)** vs **3.5–13.8 (mature)** — e.g. `aaron-he-zhu/seo-geo-claude-skills/competitor-analysis` lt 5,925 but sum8 = **4** (ratio 1,481×) = a dead listing with a legacy counter, same pathology as our ito-market-intelligence.
- Counter-surface discrepancy (unresolved, flagged): scout search index reports `affaan-m/ecc/ito-market-intelligence` at **2,909** installs and `ecc/market-research` at **12,319**, while the listing-page fetch reports lifetime **1,481** and **5,447** respectively. Two surfaces, two numbers, ratio ≈ 2.0 and 2.26. See T4.

## Operational rules (provisional, pending T1–T5)

1. **Rank competitors by 8-week flow + momentum. Report lifetime as stock, in a separate column, with the age index (lt/sum8) beside it.** Never compare two blocks on lifetime alone.
2. **New-entrant flag:** lt/sum8 ≤ 1.5 ⇒ the franchise is younger than our window; its w7 is a launch run-rate, not a share. Track weekly, do not treat as a stable benchmark.
3. **Co-movement discount (both directions):** same-repo listings with pairwise rel. diff < 5% on non-zero windows count as **one** demand stream. Apply to us (6 listings → 2 streams + 1 dead) and to every competitor block (corey 3 → 2; samber 2 → 1; appeeky 4 → 3).
4. **Revisit H93's rule 4.** It pointed us at the `market intelligence` lane on the strength of a pool/threshold calculation; our own #1 slot in that lane is a **dead listing (0 w7 in 8 windows)**. Before spending there, re-derive the lane from live flow only. A lane whose leader is dead is either an empty opportunity or a capped one — we do not yet know which (T3).
5. **Play narrow, not broad.** Our rank-1s are narrow, single-purpose skills (margins 2–100× over runners-up); our losses are exactly the two broad research lanes (firecrawl, parallel-web) and the generic `seo` slot (rank 25). Do not spend against firecrawl/parallel head-on; buy narrow slots with live flow instead.
6. **Zero spend on renaming/consolidation/copying** (H93 rules 5 and H92: rename ρ ≈ 0, consolidation does not change pool).

## Tests this proposal must run (analyze step 94699)

- **T1 (decisive, cheap):** re-fetch the samber devrel pair plus 2–4 other young blocks (lt/sum8 ≤ 1.5) for 3 more windows. If samber's w7 keeps climbing (say > 3,500) while corey's stays flat, the leaderboard inversion is real and our benchmark must be flow-based.
- **T2:** extend the co-movement scan to every repo in the 51-listing panel with ≥2 listings; publish the listing→stream mapping and the resulting live-stream leaderboard (not the listing leaderboard).
- **T3 (lane health):** for the `market intelligence` lane, list every listing with lifetime ≥ 100 and report its w7. If ≥ 60% are dead (w7 = 0 over 8 windows), the lane is dead, not contested — that flips H93's recommendation from "enter" to "find a live lane".
- **T4 (counter semantics):** reconcile search-index installs vs listing-page lifetime for 10 listings (we have 2 known ratios ≈ 2.0–2.3). Determine which surface the marketplace rank is computed on. Until resolved, quote only the surface we measured.
- **T5:** compute our own live-stream share of the research/competitive pool under the even-split law, using the 2-stream (not 6-listing) denominator, and pick the narrow skill slot with the best expected w7.

## Falsifiers / kill criteria

- **F1:** samber's w7 falls below 2,000 in the next 3 windows ⇒ the "launch run-rate" reading is wrong; treat it as a one-off promo spike and revert to flow+stock dual reporting only.
- **F2:** corey's 3 listings move together within 5% on the next fetch ⇒ our 5% co-movement threshold is too loose and the whole stream-decomposition method collapses (we would also have to merge our own 5 listings, which would strengthen rather than weaken rule 3 — say so explicitly).
- **F3:** T4 shows search-index installs and listing lifetime are the *same* counter measured at different times ⇒ the 2.0–2.3× discrepancy is a timing artifact, not semantic; then lt/sum8 stays valid but our lifetime column is stale-by-one-window.
- **F4:** the `market intelligence` lane turns out to have ≥ 3 live listings with w7 ≥ 50 ⇒ our ito-market-intelligence slot is not the lane leader and H93 rule 4 survives unchanged.
- **Kill criterion for rules 1–3:** if T1 shows no young block out-growing its mature counterpart and no leaderboard inversion exists in any second lane, downgrade rules 1–3 to "report both, don't decide on stock alone" and keep rules 4–6.

## Limits

- n = 51 listings, 8 weekly windows, one ecosystem (skills.sh listing pages) — the momentum reading is window-dependent and seasonal effects (Q4) are not controlled for.
- The fetch panel is competitor-curated by prior cycles; it may omit exactly the young entrants we care about most (selection bias against the hypothesis of new-entrant disruption). T1 mitigates only partially.
- lt/sum8 is an ad-hoc age proxy, not platform-documented; the series semantics (weekly vs cumulative) are still inferred, not documented.
- The co-movement threshold (5%) is chosen post hoc; no sensitivity sweep was run at this cycle.
- Counter-surface discrepancy (2.0–2.3×) unresolved → all absolute lifetime numbers carry that uncertainty; ratios and momentum are unaffected.
- No revenue, retention, or user data; installs ≠ usage. No cross-marketplace check.

## Operational state

`.env` = 3 vars, no publish credential, `ops_social_posts` = 0, published 0, external writes 0, read-only. Next: run T1–T5, then re-issue the competitor table as **live streams**, and re-derive lane entry against live flow only.
