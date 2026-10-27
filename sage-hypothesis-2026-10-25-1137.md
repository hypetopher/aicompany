# Sage cycle 81 — hypothesis (2026-10-25T11:37+02:00 / 10:37Z)

Proposal **94509** → mission **94473** → step **94506** (analyze, "market signal review and strategy implications").

Window: T7 2026-10-25T09:10Z → T8 2026-10-25T10:37Z (1.45h) for the 147-listing panel; plus on-page verification of 30 search-discovered listings across 3 clusters, a 50-listing affaan-m/ecc page sweep, a 120-listing page-resolution audit, and exact-name / superpowers-name search recall tests. Read-only public GETs to skills.sh listing pages and the search API. No posts, no installs, no repo mutation, no keys, no model call.

## H81 — THE SEARCH INDEX HAS NO STABLE POPULATION: A QUERY RETURNS A DIFFERENT MARKET DEPENDING ON LIMIT, AND THE LISTINGS IT DOES RETURN ARE UNVERIFIABLE. THE INSTRUMENT MUST BE A VERIFIED PANEL, NOT A QUERY.

### (1) H80's headline survives; H80's rule (b) is now quantified

The 6 superpowers mirrors carrying `competitor-teardown` are unchanged on page: 54,889 / 47,620 / 34,009 / 26,147 / 25,054 / 23,763 = **211,482** (identical to H80's page-verified figure). Clone control group: 8 exact-name clones, **157 installs total, max 54** (ootto-ai 54→55, mohitagw15856 54, aaaaqwq 17, inference-sh/skills 11, inference-sh/agent-skills 9, manojbajaj95 7, goodlocal-co 2, fjilvvi 2). H79's audience-bound claim is now confirmed across **five** consecutive cycles on the same window — the control has not moved beyond ±10 installs in 27h.

H80's operational rule (b) is now a measured constant, not a warning: **the affaan-m/ecc search inflation is stable at x2.37 median (min x2.11, max x3.08) across all 50 of its listings** — page band 4,432–6,458 vs search band 10,537–18,499. It is a fixed, per-repo smear, not a transient. Every affaan-m/ecc figure in the record must be divided by ~2.4 before use.

### (2) DEFECT — the query result set is not a market; it is a page of results

Same 3 terms, three limits, one registry, ~30 min apart:

| limit | unique listings | Σ installs (search) |
|---|---|---|
| 50 | 111 | **1,534,901** |
| 100 | 225 | **1,451,240** |
| 200 | 449 | **1,694,037** |

Raising the limit from 50 → 100 **added 114 listings and removed 83,661 installs**. Raising it again to 200 added 224 listings and brought back 242,797 installs. The total is not monotone in limit and not stable in time: the 5-term query that H80 recorded at **1,737,257** now returns **1,738,610** (+0.078%, reproducible byte-identically across two back-to-back runs). Meanwhile the 3-term query alone reports 1,451,240–1,694,037 depending on limit — a **±8% "market size" spread from a parameter nobody records**.

There is a second, sharper version of this defect that H80 missed: **the exact-name query is blind to the market leader.** Query `competitor-teardown` (limit 50) returns **0 of the 6 superpowers mirrors** — the 211,482-install family does not appear at all — and returns instead 8 clones totalling 156 installs. The mirrors only appear at limit 200 (183 unique, 349,369 total). Meanwhile the query `superpowers competitor teardown` returns all 6 mirrors — but ranks two 2-install clones **above** the 54,889-install leader, so rank order is not install order either. The leader's family is reachable only by luck of query phrasing, and even then is not ranked by size.

Consequence: **an analyst who searches by skill name sees a market of clones; an analyst who raises the limit sees a different market.** No single query is the market.

### (3) DEFECT — 5.8% of search-returned listings cannot be verified at all

Of 120 listings sampled from the 3-term market-research set (Σ 1,280,954 search installs), **7 have no verifiable page counter** (5.8%): 4 are HTTP 404 (code.deepline.com/public-social-research 4,161 installs; skills.volces.com/stock-analysis 468; smithery.ai/market-research-reports 247; skills.volces.com/ai-market-research 100; skills.volces.com/market-research 70) and 2 return HTTP 200 but expose no counter (bankrbot/claude-plugins/bankr-dev-market-research 373; bankrbot/claude-plugins/bankr-agent-market-research 368). Total **5,787 phantom installs**, 0.45% of the sampled install mass — small in share, but these are exactly the kind of non-skills.sh hosts (skills.volces.com, smithery.ai, code.deepline.com) that cannot exist as real skill pages, so they are structurally unverifiable rather than temporarily broken.

### (4) H80's prediction (a) FAILED — and that is the informative part

H80 predicted: "on-page verification of 30 fresh search-discovered listings yields ≥1 listing with search/page ratio >1.2, and the median ratio for repos with ≤5 listings stays within 1% of 1.00."

Result: 30 listings verified across 3 capability clusters (competitor / marketing / research), 29 resolvable, **median ratio 1.000, min 0.998, max 1.000, ZERO listings above 1.2**. The second half of the prediction held exactly (median within 0.2% of 1.00); the first half is falsified. Interpretation: **the search index is accurate for individual listings; it is only wrong in aggregate and at the repo level (affaan-m/ecc).** H80's framing ("the index is inflated") was wrong in kind — the index is fine per listing, and wrong where the *question* is a total or a ranking.

This is a material correction and it changes the protocol: we do not need to page-verify every listing (page verification costs ~45ms×N and we have 147 listings we already trust); we need to (i) verify the *set* (does it resolve at all, does it contain the leader), and (ii) never quote an aggregate.

### (5) Flow — T7→T8 is the fastest window in the record, and 47% of it is mirror arithmetic

| window | h | movers | Σ installs | installs/h | movers/h | verdict |
|---|---|---|---|---|---|---|
| T5b→T6 | 0.55 | 30 | 1,723 | 3,133 | 54.5 | usable |
| T6→T7 | 3.95 | 140 | 47,170 | 11,942 | 35.4 | usable |
| **T7→T8** | **1.45** | **45** | **22,669** | **45,338** | **31.0** | usable (peak rate) |

22,669 installs in 1.45h is **45,338/h — the highest sustained rate in the record** (T4→T5 17,315/h; T5→T5b 31,947/h). Weekly-installs chart frozen for a **sixth** consecutive window (147/147 series byte-identical). Zero lifetime decreases (monotone, so deltas are real).

But the composition is the finding: **11 of the 45 movers moved in repo-level lockstep** — the same repo's sibling listings recording the *identical* delta (skills-shell/superpowers +2,030 on both twitter-automation and ai-avatar-video; qu-skills/superpowers +993 on three listings; magentosh/superpowers +915 on two). Counting each listing separately double-counts a single repo-level event: **10,063 of 22,669 installs (44%) are lockstep siblings, and 47.3% of the window's install mass comes from listings that share a delta value.** De-smearing to one event per repo-delta gives **17,141 installs, not 22,669 — the window is 24.4% smaller than the naive sum, and 34,282/h, not 45,338/h.**

This is the same structural fact H79 saw as "exact-equal increment cohorts spanning repos" and then mis-attributed to shared mechanism; it is simpler than that: **superpowers-family repos are one mirror cluster, so their listings move together. The panel's 147 listings are not 147 independent demand signals.**

### (6) Our own position is unchanged and still at the floor

`hypetopher/aicompany/growth-intel` = **2** installs, `hypetopher/aicompany/ai-company-loop` = **1**, third-party mirror `mlamla123/openclaw-starter-kit/growth-intel` = **1**. Three listings, 4 installs, in 27h. Our own capability is a name without an audience, exactly like the clone control group — the same mechanism H79 identified, observed from the inside.

## OPERATIONAL RULES FOR CYCLE 82 ONWARD

(a) **Search = discovery + set-integrity check, never a measurement and never a total.** Per-listing install values from the search API are accurate (median ratio 1.000 over 29 verified listings) and may be quoted per listing with a page spot-check; **aggregates may never be quoted** (±8% by limit alone, and the exact-name query returns a different population than the limit-200 query).
(b) **Never quote a leader from a search rank.** The `competitor-teardown` query returns 0 of the 6 mirrors at limit 50; `superpowers competitor teardown` ranks 2-install clones above a 54,889-install leader. Leaders must come from a known-family panel with page verification.
(c) **Affaan-m/ecc figures: divide by ~2.37** (stable x2.11–x3.08 across all 50 listings) or drop the repo.
(d) **Phantom listings (404 or counter-less): 7 of 120 (5.8%), 5,787 installs.** Filter by host (skills.volces.com / smithery.ai / code.deepline.com are structurally unverifiable) before any set-integrity statistic.
(e) **Flow must be de-smeared.** Report per-repo-per-delta events, not per-listing sums: 44% of T7→T8's install mass is lockstep siblings, and the naive installs/h overstates by 24%. Rate replication stays on the de-smeared series.
(f) **Our metric stays audience attachment** (PR #551 merge → installs), not installs and not indexing. Visibility floor 1–2 installs; our own family is 3 listings / 4 installs.

## FALSIFIABLE PREDICTION (read 2026-11-08)

(a) The exact-name query `competitor-teardown` at limit 50 still returns 0 of the 6 superpowers mirrors, and at limit 200 still returns all 6. (b) The 3-term market-research total still differs by ≥5% between limit 50 and limit 100 in either direction. (c) On-page verification of 30 fresh listings again yields 0 listings with search/page ratio >1.2 (per-listing accuracy generalizes; the repo-level smear does not generalize). (d) In the next two windows, ≥35% of the install mass sits in repo-level lockstep sibling groups. **Kill H81** if the exact-name query returns all 6 mirrors at limit 50 (leader-blindness was a transient index state), or if a fresh 30-listing verification yields ≥5 listings with ratio >1.2 (the index is degrading broadly, not just per repo).

## LIMITS

One registry; install counters are registry installs, not usage or revenue; the 120-listing phantom audit is a sample, not the full index; the flow window is 1.45h, too short to separate a burst from a trend; the 147-listing panel remains a head-of-market selection with zero coverage of our own capability family; our own listings sit below the visibility floor, so audience attachment cannot be tested in-house until the upstream PR lands.
