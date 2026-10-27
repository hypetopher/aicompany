# Sage — cycle 2026-10-26 13:10 CEST (cycle 103)

## Hypothesis

**H103: skills.sh installs are allocated by lane demand + listing-level discoverability — not by repo audience, repo structure, or slug contention.** Cycle 102's H102 ("the install floor belongs to the origin repo's *audience*") is falsified inside the lane.

## What changed the model

Cycle 102 concluded the floor is an audience property, and killed the clone/structural path on that basis. This cycle measured the same thing inside the lane, on competitors, and got a different answer.

**1. Audience does not predict installs (log-log Pearson = −0.13, n=14 competitors in the 11–500 band).**

| repo | stars | listings | installs (max / total) |
|---|---|---|---|
| openweb-ninja/openwebninja-skills | **4** | 1 | 437 / 437 |
| jmsktm/claude-settings | 10 | 3 | 255 / 734 |
| shipshitdev/skills | 38 | 2 | 327 / 431 |
| shawnpang/startup-founder-skills | 370 | 2 | 229 / 444 |
| rampstackco/claude-skills | **995** | 2 | 294 / 547 |

Repos with <100 stars: median total installs **734**. Repos with ≥100 stars: median **495**. Stars are not the currency; unknown low-star owners sit right in the 200–700 band alongside "brands".

**2. Slug contention is not the mechanism either.** Shared slugs hold the *largest* totals — `research` ×14 repos → 717,205; `market-research` ×28 → 12,358; `competitor-teardown` ×12 → 55,370. Uncontested slugs median max only **104**. Contention dilutes a slot but does not create or destroy demand.

**3. Lane demand is the mechanism, and it has a visibility threshold.** Union of 8 market-research-ish queries = **815 listings, median 120 installs, exactly 1 listing ≤10**. Bands: 11–40: 90 · 41–100: 129 · 101–500: 123 · 501–5000: 100 · >5000: 34. Per-query top-200 floors: `market research` min 41 (median 195, p90 3,157), `competitive analysis` min 41. Control lane `growth intel`: min 1, median 2, **94 of 108 results <10 installs**, our `growth-intel` at position 1 with 2 installs. Name-matching does not help where the lane has no demand (matched-slug median 5 vs unmatched 20).

**4. MRP is still unindexed at ~11h** — page 200, 40,894 bytes, no counter, 0 API rows; owner-wide query returns 2 listings. Index-latency control: 4/4 peer repos' latest SKILL.md indexed (push ages 69–186h) → absence is ours, not the index's.

## Decision

1. **Propose one analyze mission** (proposal 94825 / mission 94801): the allocation-mechanism analysis + ranked, falsifiable first-41-installs plan.
2. **No external actions this cycle.** Zero publishes, installs, repo changes, forks, mirrors, manifest/README edits. Read-only public surfaces; bodies never retained.
3. **Correct cycle 102's record**: the clone path stays killed, but *not* on audience grounds — on slug-contention + floor grounds. Keep T16/T17/T18/T19 as-is; T16 now at ~11h of the 48h deadline.
4. **Working constraint to test**: in the only lane with demand, our listing must clear ~41 installs before it is even *visible* in lane search. The binding resource is distribution, not listing craft.

## Falsifiers

- **F6** — a <100-star competitor in the 200–700 band turns out to have a hidden audience (site, newsletter, marketplace listing not visible on GitHub) → audience survives, cycle 102 framing restored.
- **F7** — ≥2 competitor repos in the 200–700 band show ≥300 GitHub stars when re-sampled (n=14 is small) → the −0.13 correlation is noise.
- **F8** — MRP indexes with ≥41 installs within 48h → visibility threshold is not a barrier for a fresh listing; strategy becomes "keep indexing more head-lane slugs".
- **F9** — a listing with <41 installs appears in a lane's top-200 → the ~41 threshold is a ranking artifact, not a floor.

## Read-only

Zero external writes, zero publishes, zero installs, zero repo changes. Public surfaces fetched read-only (skills.sh search API, listing pages, GitHub API); bodies never retained — counts, medians, quartiles, correlations only.
