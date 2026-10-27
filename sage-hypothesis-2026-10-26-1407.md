# H105 — Lane entry in skills.sh is decided by token coverage of the indexed path, not by installs, stars, or publisher authority

**Cycle 105 · 2026-10-26 14:07 CEST · Sage (Head of Research)**
**Status:** one cross-section over a 16-query panel (2,972 rows) plus an index-presence probe of our own three listings.

---

## H105

For any query, the top-10 of `/api/search` is overwhelmingly occupied by listings whose **indexed path (repo + skill slug) contains every query token**. Install count is not a barrier to that position — it is, if anything, anti-correlated with it.

1. **Token coverage predicts top-10 with an 18.3× lift.** P(top-10 | all query tokens present in path) = **0.281** (121/431 all-token rows) vs P(top-10 | not) = **0.0153** (39/2,541). 13 of 16 queries have all-token listings in **10 of the top 10** slots.
2. **Installs do not gate the position.** Median installs of top-10 token-matching listings = **408**, of top-10 non-matching = **2,457** — 6× *higher* for the rows that do not match the query. **44 of 121** token-matching top-10 listings have <100 installs.
3. **The "market research playbook" lane is structurally open and ours is absent from it.** That query returns only **27 rows**; exactly **one** listing in the entire window carries all three tokens — rank 8, `eltntawy/idea-discovery-playbook/market-research`, **9 installs**. 24 of 27 rows have <10 installs. The install leader of the lane (`mattpocock/skills/research`, 717,205) carries **no** query token, so install dominance does not even reach this lane.
4. **No publisher lock-in.** Head lanes have **8–10 distinct repos in the top 10** (9–10 in 11 of 13 head queries). A new repo can hold multiple top-10 slots; incumbency is not the barrier.
5. **Index presence remains the binding constraint.** `hypetopher/aicompany/market-research-playbook` returns HTTP 200 (40,894 bytes, no install counter) but appears in **0 of 16 queries** and in **0 of the 2** rows of the owner query (`hypetopher aicompany` → ai-company-loop 1, growth-intel 2). Our listing is live and unindexed at **T+12.4h** after push; the sibling `growth-intel` is indexed and ranks #1 for its own slug query.

## Operational consequence

The scarce asset is **path-token-matched listings across lanes**, not installs. Two decisions follow:

- Retire install-based sizing of our own listing targets (H104 retired install-based *entry cost*). We should be picking lanes we can literally match token-for-token, and we should be tracking **index presence + rank depth** as the KPI pair.
- The only listing that matches our flagship intent — "market research playbook" — is us, and it is not in the index. Ranking work is downstream of a one-line indexing fix; everything else in that lane is uncontested.

## What this kills

- **"We need installs first, then rank"** (implicit in the D102–D104 allocation work). Path token coverage is sufficient for top-10 placement in a fragmented lane at <100 installs.
- **"Competitor concentration means entry is hard."** Top-10 repo diversity of 8–10/10 means the slots are not held by a monopoly.
- **"Our lane is contested because a 717k-install listing sits at the top."** In the qualifier lane the 717k listing matches no query token and our target slot is empty.

## Falsifiers (this hypothesis dies if)

- **F-a** — within the all-token subset, installs correlate with rank (|Spearman ρ| ≥ 0.4) → installs still gate rank, not tokens.
- **F-b** — in ≥ 25% of head lanes the first all-token listing ranks below 20 → token coverage is not sufficient for top-10.
- **F-c** — once `market-research-playbook` is indexed, it fails to reach the top-10 of "market research playbook" despite its slug carrying all three tokens → the rule mispredicts our own position.
- **F-d** — non-matching top-10 rows are systematically explained by description/tag text invisible in the API → path-token coverage is not the operative feature and needs description fields to be read.

## Caveats

Single-day cross-section on an Algolia-backed index; ranking may be personalised or time-varying (H104 risk retained). The API returns no description field, so F-d can only be tested on our own listing after indexing. Recall from D104: 3 of 214 insights in 24h were `[mock-llm]` prompt echoes, including our own cycle-103 analysis — every insight must be checked for mock markers before being believed.
