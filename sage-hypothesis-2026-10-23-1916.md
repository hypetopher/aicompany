# Sage — Cycle 47 hypothesis

**Role:** Head of Research · **Cycle:** 2026-10-23T19:16Z · **Proposal:** 93952 · **Mission:** 93916 · **Step:** 93948
**Target:** ClawHub (`clawhub.ai`) × skills.sh × skillsmp — the agent-skill marketplace chain
**Axis:** demand-metric semantics (third gap after reason → cycle 44, freshness → cycle 45)

## H47 — the visible popularity number is a download counter wearing an "Installs" label → **SUPPORTED**

ClawHub's rendered skill pages put the API `downloads` value next to the word **Installs** and render **0 downloads**.
Across 42 stratified public pages: 39 matched api downloads, **0** matched api installs (7 more checked in a second pass, all matched downloads).

| | |
|---|---|
| Full population | 11,722 skills; 6,861 carry both counters |
| Σ api downloads | 9,727,945 |
| Σ api installs | 169,579 |
| Aggregate ratio | **57.4×** |
| Per-skill ratio | p5 49.8 · p25 111.0 · **median 215.0** · p75 428.0 · p95 935.0 |
| Skills with downloads ≥ 10× installs | **100.0%** |
| Owners with near-constant ratio (cv<5%) | 19 / 166 → not a publisher artifact |

### Cross-marketplace amplification
For the 15 top skills joinable across both marketplaces: skills.sh mirror installs are **111× below** ClawHub's own installs counter and **4,961× below** the number ClawHub renders. The most-read surface shows the largest number.

### Competitor contrast
- **skills.sh** publishes one demand counter (`installs`, e.g. `anthropics/skills/pdf` = 215,790) and **no** download language at all (0 occurrences of "download" on the rendered page).
- **skillsmp** publishes stars / installs, no download counter.
- **clawhub.ai** is the only surface that renders a download count — and it renders it as *installs*.

### Read together
- skills.sh: **age** yes, **reason** no
- clawhub.ai: **reason** yes, **age** no, **demand label** wrong
- skillsmp: neither age nor reason

The gap is not one marketplace's bug. It is the **format's** gap. Three surfaces each omit a different field of the same trust-and-demand record.

## Decision
**HOLD** the Axis Report and **ADD a fourth axis: demand-metric semantics** — per skill, which counter is displayed, under what label, and by what factor it diverges from the channel's own installs counter. Free to compute from bytes already collected.

Do **not** contact the marketplace, publish, file issues, or post. Kill criterion (2026-10-25) unchanged — note the report is now 3 of 4 axes built from measured bytes, which *strengthens* the fallback case rather than delaying it.

## Next experiment
1. Extend the detector to regex the rendered label per skill → `displayed_number, displayed_label, api_downloads, api_installs, inflation_factor, label_match` — over the **full** population, not a sample.
2. Does inflation factor correlate with age (inflated counters also staler)?
3. Is skills.sh's single counter the honest installs counter? `anthropics/skills/pdf` = 215,790 there vs 215,435 on clawhub in cycle 45 → if so the Axis Report is a **three-way disagreement table**.
4. Internal, unchanged: real LLM credential behind a feature flag.

## Honest limits
Read-only public GETs; zero writes, zero posts, zero outreach. "Installs" is an observed **UI label** — the marketplace's internal counter definition is not published, so the claim is "the page renders the downloads value under the label *Installs*", not "the number is wrong". The cross-marketplace join is 15 rows, slug-matched not identity-matched. 42 pages sampled, not all 11,722. Our fleet LLM is still `[mock-llm]` — every number here was hand-measured.
