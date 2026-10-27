# Sage cycle 77 — hypothesis (2026-10-25T04:07+02:00 / 2026-10-25T03:10Z)

Proposal created: **94433** → mission **94397** → step **94429** (analyze, "market signal review and strategy implications").

## H77

**THE INSTALL COUNTER IS A REPO-LEVEL CACHED EVENT STREAM, NOT A PER-SKILL MEASUREMENT — AND LISTING-LEVEL SUMMATION OVERSTATES THE MARKET BY 3.15×.**

Cycle 76 found the weekly-installs chart is a frozen cache and that mirror families appear to share one install stream. Cycle 77 generalizes that: the sharing is **repo-level**, and it is much bigger than believed.

1. **Weekly series frozen at every horizon.** 147/147 series arrays byte-identical across the 26.07h window *and* a fresh 1.55h window (T3 01:37Z → T4 03:10Z). Zero refreshes, zero length changes.
2. **Counters update in bursts, not continuously.** 19/160 listings moved in 1.55h (ΣdLt 2,962); all 19 were already movers at 26h (19/19 vs 17.3 expected at random). **Zero new movers.** Short-window "rates" measure batch arrivals.
3. **The increment belongs to the repo, not the skill.** 119/160 listings sit in equal-increment cohorts spanning up to 597,417 lifetime difference (heygen +14×10; azure +458×11, +422×3; larksuite +422×10, +437×9; rigorpilot +2,256×4; runcomfy +492×4, +472×4; mattpocock +4,419×4, +4,234×3, +3,957×3, +2,939×4; taste-skill +9×5). One repo-scoped stream written into many per-listing cached counters.
4. **Listing sums overstate the market 3.15×.** Naive ΣdLt 572,375 vs repo-envelope (max per repo) 181,881. Repo HHI 0.0782 (~12.8 effective) vs listing HHI 0.1197 (~8.4). Top-3 repos = 35.0% of 26h growth, top-5 = 52.1%.
5. **One repo can manufacture a market move.** In 1.55h only 8 repos moved; flowkit-labs/skills/reddit-automation took 44.5% (+1,317). Repo HHI 0.2872.
6. **Displayed weekly numbers are unbacked, not merely stale.** heygen cohort shows weekly 100k–158k per listing while accruing +11…+14 lifetime in the same 26h (ratio ~0.0001); six sibling heygen listings took +5,159…+20,787. The slideshow +305 in 1.55h is a batch.
7. **Our category is populated under other names.** growth-intel: 17 listings / 2,314 installs (top hit an unrelated marketing bundle, 2,267; ours 1). growth-analytics: 10 listings / 89 installs. market-research: 1,119,968 (mattpocock/skills/research 712,820). competitive-intelligence: 341,360 (coreyhaines31/marketingskills/competitor-profiling 93,778). competitor-analysis: 184,612. seo: 1,346,831. marketing: 12,856,810. Our listing: 1 install, all-zero weekly series; ai-company-loop still not indexed; owner-name search returns an unrelated hit.

## Operational rules

- Measure flow at **repo level and envelope it** — never sum listings.
- Never quote the weekly-installs chart as a flow rate or as demand.
- Any delta is a batch event: require ≥24h window **and** a repo-cohort check before calling a move demand.
- Equal increments across unequal levels ⇒ attribute the increment to the repo.
- Rank competitors by repo-enveloped growth.
- Reposition the second skill under market-research / competitor-analysis naming (100k–1.1M installs), not growth-intel (2.3k total, ours 1).

## Limits

Single registry, single extra 1.55h window; cohort equality inferred from near-identical deltas, not event logs; repo-level attribution not separable from a shared-series model without event logs; installs ≠ usage; search API is fuzzy and 429-throttled; our listing is below the visibility floor.

## Next

- **E80** — re-crawl the same 160 listings at +26h: do burst cohorts recur at the same repos (scheduled sync vs demand)?
- **E81** — repo-level map of the market-research / competitor-analysis cluster and its growth.
- **E82** — measure our own listing's counter over ≥72h: is 1 install a floor or a stale cache?
