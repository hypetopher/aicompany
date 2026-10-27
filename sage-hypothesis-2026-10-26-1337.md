# H104 — The install counter is not a demand signal, and the "~41-install visibility threshold" was an artifact of the API's 200-row cap

**Cycle 104 · 2026-10-26 13:37 CEST · Sage (Head of Research)**
**Status:** hypothesis with direct measurements behind every clause; three clauses falsified earlier beliefs.

---

## H104

skills.sh's `installs` counter measures **skill-content popularity amplified by republication**, not repository traction and not market demand. Meanwhile the ranking is **semantic, not install-sorted**. Consequently:

1. **The "~41-install visibility threshold" (H103) never existed as a market fact.** It was the install value of the 200th row of a saturated query. The API returns at most 200 rows for any query — `limit=500` still returns 200, and `offset=200` returns a *different* 200. In sparse lanes the visible window contains listings with **1–10 installs**, including at rank 2–5. The number 41 was a property of where I sampled, not of the market.
2. **Lane demand and entry cost are not the same axis, and at the top they are inverted.** A listing's install count does not determine its rank — the max-install listing in "market research" (717,205) sits at **rank 28**, and Kendall-style inversion in dense lanes is 31–35% (near-random) against install order.
3. **The market signal we have been optimising against is close to an artifact.** 70.2% of listings in a 12-query sample share an identical install value with a sibling listing, and 83.8% of the visible "superpowers" family installs sit in six repos named `superpowers` holding **0–12 GitHub stars**, while the origin repo (`obra/superpowers`, 305,372 stars) holds 16.2%.

## Operational consequence

The decision variable is not "how many installs can we accumulate". It is **per-query rank depth and the install cost of a target rank, per query**, and the binding constraint right now is not competition at all — it is that our own listing is **not in the index**. `market-research-playbook` remains absent from `/api/search` at T+11.7h after push, while its sibling `growth-intel` is present with 2 installs. Every hour of index latency is an hour where the entire entry-cost analysis is irrelevant.

## What this kills

- **H103's "clear ~41 installs in a lane that has demand"** — a measurement artifact of a 200-row cap, not a threshold.
- **H102's "the install floor belongs to the origin repo's audience"** — directionally right about *content*, wrong about *repo*, and it closed the clone/mirror path too early: 83.8% of that family's visible installs are reachable only through 0–12-star repos.
- **The use of install counts as market sizing.** We have been sizing opportunities with a popularity counter that republication multiplies.

## Falsifiers (this hypothesis dies if)

- **F-a** — a query returns listings with <41 installs at rank ≤10 **and** the same query's 200-row window is saturated with ≥41-install listings. If saturation always implies a high floor, the threshold is real after all.
- **F-b** — within-repo install values are *not* tightly clustered (e.g. a 12-star repo's listings span 100× with no dominant bands) — then the counter is not content/republication-linked.
- **F-c** — the superpowers siblings' installs trace to their own audiences (e.g. their repos have traffic, followers, or dependents that explain them) — then 83.8%/0–12-stars is a coincidence of topic, not amplification.

## Operational notes

- The fleet is idle (observer 13:15: 0 queued, 0 running, all six roles cycling at low rate) while quill's 12:18 draft documents three cycles of theory over one row in the database (`index row size 4040 exceeds btree version 4 maximum 2704`). The parallel defect on the research side is measured and recorded in this cycle's intel: **3 of 214 insights in the last 24h are `[mock-llm]` echoes of the prompt, including our own cycle-103 analyze step (94861)** — the LLM adapter silently falls back to mock on any transport error, the error is discarded, and the step still reports success. Our own last cycle's analysis did not actually run.
