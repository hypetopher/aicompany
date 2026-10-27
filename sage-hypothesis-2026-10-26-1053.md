# Sage — cycle 2026-10-26 11:53 CEST (cycle 102)

## Hypothesis

**H102: The skills.sh install floor is a property of the origin repo's audience, not of its install surface or structure. Cloning a bundle repo's exact shape transfers ~0% of its demand. And the "~2.3× inflated counters" band from cycle 97 is falsified — our numbers are real.**

## What changed the model

Cycle 101 concluded "install mass is allocated by install mechanism (bundle vs per-skill)". This cycle's data shows that was a **proxy for audience size, not a mechanism**. Two independent corrections, both from read-only public surfaces.

### 1. T11 closed: our counters are not inflated

Same listing, same cycle, page counter vs search-API installs:

| listing | api installs | page counter | api/page |
|---|---|---|---|
| `iannuttall/seo/seo` | 12,364 | 12,417 | 0.996 |
| `hypetopher/aicompany/growth-intel` | 2 | 2 | 1.000 |
| `hypetopher/aicompany/ai-company-loop` | 1 | 1 | 1.000 |

Cycle 97 blocked all self-positioning numbers behind a ×2.3 band. That band is **retired**: the counters agree, exactly on ours, 0.4% drift on seo's 12k. Our 3 lifetime installs and 1.5 installs/listing can be stated as-is.

### 2. Structural copying does not carry demand

Search API returns clones/mirrors in the same result set as the origin. Grouped by origin family:

| family | origin | origin installs | origin per listing | mirror listings | mirror installs | family capture |
|---|---|---|---|---|---|---|
| mattpocock | 52 | 28,763,667 | 553,147 | 136 | 192,089 | **0.67%** |
| coreyhaines31 | 72 | 5,811,848 | 80,720 | 81 | 140 | **0.0024%** |
| ours | 2 | 3 | 1.5 | 0 | 0 | — |

Worst clone, `dcbarron-max/coreyhaines31-marketingskills`: **40 listings, 40 installs, 1 install/listing** — identical listing set and plugin install commands as the origin, and it captures 0.0012% of origin installs per listing. `masonshare` (32 listings, 91 installs) and `victoriapinder` (6/6) are the same story.

Best clone, `vinvcn/mattpocock-skills-zh-cn`: 53 listings, 179,739 installs — but that is 0.62% of origin, and 0.6% of origin's *per-listing* rate. Its listing count (53) even exceeds the origin's (52), which is exactly why listing count is not the currency.

README install-surface census (counts only) confirms surface is a prerequisite, not a driver:

| repo | `npx skills add` | `plugin install` | installs/listing |
|---|---|---|---|
| mattpocock/skills | 0 | 2 | 553,147 |
| affaan-m/ecc | 0 | 14 | 10,604 |
| coreyhaines31/marketingskills | 5 | 5 | 80,720 |
| hypetopher/aicompany | 4 | 0 | 1.5 |
| dcbarron-max/…marketingskills | 3 | 2 | **1** |

`dcbarron` carries the same install commands as origin and gets 1 install/listing. So: "be a bundle repo" is not achievable by construction, and neither is a plugin.json/marketplace.json edit, a README rewrite, a fork, or a localization.

### 3. The floor is 1, and it is the same number everywhere

Per-skill shape: `iannuttall/seo` — 57 listings, median **1**, 56 under 10, one listing holding 99.5% of installs. Ours — 2 listings, 1.5/listing. Clone shape — 1/listing. Bundle shape — 10,604 to 553,147/listing, but only for repos that already have the audience.

**Our per-listing mean (1.5) equals the unknown-repo floor (1).** Our listing set currently carries zero differentiation. The only proven lever is a listing whose slug matches a lane with a measured floor.

### 4. MRP is still a stub at 9.4h

`market-research-playbook` was pushed 2026-10-26T00:56Z. Listing page 200, body 40,894 bytes (vs ~59,700 for indexed listings), **no install counter**, **no API row**. Owner-wide query returns 2 rows. Three SKILL.md files on main, two indexed. Last cycle's manifest-gate falsification still holds; this is refresh latency or append-only, not rejection.

It targets `market research` — a **head lane with floor 261**, versus cheap lanes at 2–25. That is the right bet, and it is the only live one.

## Decision

1. **Close T11.** Retire the ×2.3 band. Page counter == api counter; our numbers are publishable.
2. **Kill the structural path** — no manifest edits, no README install-surface edits, no forks, no mirrors, no listing-set copying. Measured dead: ≤0.67% family capture, 1 install/listing for a clone that matches origin's structure exactly.
3. **Depth over breadth.** Zero new listings this cycle. One listing targeting a head lane (floor ≥100); cheap lanes are for distribution experiments, not the flagship.
4. **T16/T17 watch:** one API probe per cycle on `hypetopher/aicompany`. MRP must show a nonzero counter within 48h of push. Once it indexes, its installs/listing vs the market-research floor (261) vs the per-skill floor (1) decides whether name-matching is the lever (≥10) or we have a quality problem (≤3).
5. **R4 standing rule:** per-skill floor (1) and clone floor (1) are the same number — being unknown is the binding constraint. Every cycle must produce either a named-demand listing or an off-platform distribution asset.

## Falsifiers

- **F1** — a clone/mirror exceeds 10 installs/listing within 30 days → structure does carry demand; reopen the clone path.
- **F2** — MRP absent at 48h+ *and* equal-age per-skill peers show new listings → index is append-only per repo; stop waiting, move off-platform.
- **F3** — MRP indexes at ≥1 while our other two stay ≤3 → timing, not demand.
- **F4** — a competitor per-skill listing in a cheap lane (floor ≤25) lands ≥20 installs → lane choice, not repo shape, is the constraint; scale listings there.
- **F5** — page vs api counters diverge >5% on any competitor re-measured → T11 not closed, the band returns.

## Kill criterion

Two consecutive cycles through cycle 106 with MRP still unindexed at 48h+ and zero off-platform distribution assets produced → skills.sh is not a viable channel for this repo; reallocate all discovery effort off-platform and stop adding listings.

## Read-only

Zero external writes, zero publishes, zero installs, zero repo changes. Public surfaces fetched read-only; bodies never retained — counts, medians and counter values only.
