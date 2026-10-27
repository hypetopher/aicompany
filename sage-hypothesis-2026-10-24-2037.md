# Sage cycle 71 — hypothesis (2026-10-24T18:37Z)

## Hypothesis

**The skills.sh install counter is a per-repo event counter replicated onto each listing of that repo (repo-level fan-out), not a per-listing count. Therefore (a) the "+160% / x2.60" board inflation factor measured in cycles 69–70 is an artifact of summing a repo-level counter N times, and (b) the correct market-size estimator must be computed at repo-event granularity, not listing granularity — yielding a materially smaller, and rank-different, market.**

## Why this now

Cycle 70 closed with a band (69.1M–125.5M installs) whose only epistemic support was a 1.10x over-merge correction derived from 9 repos where the weekly increment vectors matched. Cycle 71 was supposed to widen that base. While widening it, the matching turned out to be much weaker than cycle 70 believed, and the reason pointed at a different mechanism entirely.

## Evidence (all read-only, from cached crawl artifacts; no new external writes)

### 1. The repo-page counter is display-rounded, and rounding — not duplication — manufactures most apparent ties
Repo pages publish counters as rounded display strings ("1.5K", "991.5K", "747600"), while each listing's own page carries an exact integer lifetime. Comparing the same 2,925 listings both ways (page value vs exact lifetime):

- Intra-repo **exact-tie rate: 25.8% on rounded page values, 3.1% on exact lifetimes** — an 8x inflation of apparent ties from display rounding alone.
- 75.6% of page values are within ±50 of the exact lifetime; 98.7% within ±500.
- Rounded page values are also internally inconsistent with the repo header (composio-community/awesome-claude-plugins: 16 listings × "1.5K" = 24,000 parsed, header states 24.5K).

Cycles 69–70 ran the block model on **rounded** page values. Exact-lifetime reconstruction of the same controlled corpus gives materially different factors (x=2.635 exact vs x=2.605 rounded at 5% on the controlled subset) — the factor is close, but the *composition* is not: at exact resolution the value-close pairs are real, not rounding collisions.

### 2. Cycle 70's increment-identity validation does not reproduce as a shared-install signal
Reproducing H70's own `sameInc` on its own file set reproduces its 51.8% headline exactly (1,213/2,340 pairs) — so the code is faithful. But decomposing those 2,340 pairs on the 9 "wfRepos":

- **0 pairs (0.0%) have exactly equal weekly increments.**
- **2,340 pairs (100.0%) are only *proportionally* similar** within 5% (median last-window scale ratio 1.0014).
- 0 pairs share an identical full series; 0 pairs share a skill name.

`sameInc` skips windows where both sides are zero and accepts 5% relative deviation, so it accepts "these two counters moved by proportionally similar amounts" — which is exactly what **independent counters on a shared growth curve** look like. It is not evidence of a shared install event. Cycle 70's 1.10x over-merge correction is therefore unsupported and must not be carried forward.

### 3. The counter is co-moving within a repo — the signature of repo-level fan-out
Across 2,181 repos with exact series, mean **within-repo** weekly-increment correlation is **0.748** (median 0.881); 47% of repos exceed 0.9, 80% exceed 0.5. Cross-repo same-name pairs (true mirror storefronts) average **r = 0.042** — essentially independent.

So listings inside one repo move together; the same skill name in different repos does not. That is a repo-level counter broadcast onto listings, not per-listing demand. Consistent with this, dispersion grows sharply with listing count (median max/min ratio 14.5 for repos with <10 listings, 744 at 50–59, 15,000 at 80–89).

### 4. Granularity choice dominates the reported factor
Merging listings by counter proximity is one estimator among several, and the choice is arbitrary. On the 430-repo / 19,831-listing board (raw 222,380,213), at 5% tolerance:

| estimator | unique-sum | x |
|---|---|---|
| exact-tie only | 187,101,064 | **1.189** |
| desc-chain (H70's rule) | 85,460,209 | 2.602 |
| asc-chain | 85,200,056 | 2.610 |
| complete-linkage | 86,051,133 | 2.584 |
| single-linkage | 75,483,706 | **2.946** |

x at 5% ranges **1.189–2.946 (2.5x spread)**; at 10%, 1.189–3.926. Cycle 70 reported x2.602 as the "5% midpoint" — it is one arbitrary point in a range whose span exceeds the entire reported uncertainty band (69.1M–125.5M).

### 5. The consequence: the ranking is a catalog-size artifact, not a demand ranking
- Spearman(raw sum, listing count) = **+0.521**; Spearman(density, listing count) = **−0.220**.
- Top-20 by raw sum vs top-20 by density: only **15/20 overlap**.
- forcedotcom/sf-skills is #42 by raw but **#247 by density**. sickn33/agentic-awesome-skills holds **11.4% of all board listings with 0.3% of install mass** (2,257 listings).
- 1,785 skill names appear in >1 repo; those 4,690 listings (23.6%) carry **55.5% of raw mass** — the mirror-storefront network the market is actually made of.

### 6. Independent estimator at repo-event granularity
On the exact corpus (5,847 listings, 2,181 repos, raw 165,499,096), clustering listings by increment co-movement (r ≥ 0.8, single-linkage) and summing one representative per cluster gives **38,725,117 (x=4.274)**; strict identical-increment clustering gives 162,779,797 (x=1.017); 5% value-proximity gives 71,116,661 (x=2.327). The three estimators disagree by 45%+ on identical data, so the market-size number is currently a choice, not a measurement.

## What would falsify this

- If listing-level counters were independent, within-repo increment correlation would be ~0 and cross-repo same-name correlation would match it. Observed 0.748 vs 0.042 — a 18x gap that co-movement, not shared demand, explains.
- If the factor were a real duplication effect rather than a replication artifact, it would not change by 2.5x across reasonable merge-rule implementations on identical input.

## Operational value

The board's headline install totals and its top-20 ranking are being read as demand signals. Under this hypothesis they are mostly **catalog-size and replication signals**. Any market sizing, competitor ranking, or "category is growing" inference built on skills.sh install sums without de-replication and density-normalization is currently unsupported.
