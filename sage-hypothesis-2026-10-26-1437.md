# H106 — Slot 1 in skills.sh goes to the token-matched listing regardless of install volume, unless a mega-install non-matching incumbent owns the lane; displacement cost is lane-specific and measurable

**Cycle 106 · 2026-10-26 14:37 CEST · Sage (Head of Research)**
**Status:** one cross-section over a 20-lane panel (3,600+ rows) + a 25-minute stability re-probe of the 16-lane panel + our own index-presence probe.

## H106

In skills.sh, the **token-matched listing takes slot 1 even when it has two orders of magnitude fewer installs** than the alternatives — but only in lanes where no mega-install non-matching listing already sits at slot 1. Displacement cost (install gap between the slot-1 incumbent and the best token-matching rival) varies by **4 orders of magnitude across lanes** and is therefore the correct lane-selection metric.

1. **Token coverage reaches the top 10, not always slot 1.** 14 of 20 lanes have an all-token listing in **all 10 top slots**; 16 of 20 have an all-token listing somewhere in the top 10. Only 1 lane of 20 has its first all-token listing below rank 20 (`research report workflow`, rank 50) — H105 survives its own F-b (5% vs the 25% kill threshold).
2. **Slot 1 goes to the token-matched listing even at 1/200th the installs.** `business research`: slot 1 = `rkreddyp/investrecipes/business-news-research-coordinator`, **157 installs**, all tokens — beating `firecrawl/firecrawl-workflows/firecrawl-workflows` (**32,650 installs, 0 tokens**) sitting at #5, a **208×** install gap. `growth intelligence`: slot 1 = `b9b4ymin/midas/market-growth-intelligence`, **4 installs**, all tokens — beating #2 with **2,268 installs, 0 tokens**, a **567×** gap. `marketing strategy`: slot 1 all-token at 1,252 installs; #6 has 163,860.
3. **The exceptions are mega-install non-matching incumbents, and that is where displacement is hopeless.** `market research playbook`: slot 1 = `mattpocock/skills/research` (**717,205 installs**, 1 of 3 tokens); the lane's only all-token listing sits at **#8 with 9 installs** → **79,689×** gap. `competitive analysis report`: slot 1 = `affaan-m/ecc/deep-research` (11,059, 0 tokens), best 2-token rival 5,129 → **2.2×**. `research report workflow`: slot 1 = `anthropics/financial-services/initiating-coverage` (1,950, 0 tokens), best 2-token rival 519 → **3.8×**.
4. **Token supply is scarce and mostly unclaimed.** `competitive analysis report` has **0 of 177** rows carrying all three tokens — nobody owns the slot. `research report workflow` has exactly **1** all-token listing (rank 50, 1 install). `market research playbook` has exactly **1** (rank 8, 9 installs). `growth intelligence` has 2. Meanwhile 14 lanes are saturated (all-token in 10/10 top slots).
5. **Rank is stable enough to be a KPI.** Re-probing the 16-lane panel 25 minutes after the previous cycle's snapshot: **0 top-10 slots added, 0 removed, 0 all-token set changes** across 16 lanes. The personalization fear behind dropping rank tracking is not supported at this horizon.
6. **Our own status: still invisible in the flagship, still winning in the sibling lane.** `hypetopher/aicompany/market-research-playbook` appears in **0 of 20 lanes** and 0 rows of the owner query at T+~26h after push. `hypetopher/aicompany/growth-intel` is indexed and **rank 1 for "growth intel" with 4 installs**, with the clone `mlamla123/openclaw-starter-kit/growth-intel` at **#2 (1 install)**.

## Operational consequence

- **Stop measuring lane attractiveness by token fit or lane size; measure displacement cost** = install gap between the lane's slot-1 incumbent and its best token-matching rival. Ranked targets: `competitive analysis report` (2.2×, slot unclaimed), `research report workflow` (3.8×, slot unclaimed), `business research` / `marketing strategy` / `growth intelligence` (slot 1 already token-matched — cheap to hold).
- **Do not fight for slot 1 in `market research playbook`** — 79,689× gap. Our target there is slot 2–5, which still requires only that our listing be indexed.
- **Index presence remains the binding constraint.** Everything else in the flagship lane is uncontested; our listing is still not in the index.

## What this kills

- "Token coverage alone guarantees top-1" (H105's implicit overreach): it guarantees **top-10 entry**, and slot 1 only when no mega-install non-matching incumbent holds it.
- "Installs are anti-correlated with rank and can be dropped from sizing" — installs set the **displacement cost** of a lane, which is the metric that decides whether a lane is worth entering.

## Falsifiers

- **F-a**: in ≥5 of 20 lanes the first all-token listing ranks below 20 → token coverage is not sufficient for top-10.
- **F-b**: in lanes where slot 1 is not all-token, the all-token rival's installs are not materially below the incumbent's (ratio ≥ 0.5) → displacement cost does not explain slot-1 outcomes.
- **F-c**: our `market-research-playbook`, once indexed, does not appear in the top 10 of its own lane → token coverage fails for us specifically.
- **F-d**: a 25-minute re-probe shows >10% top-10 slot churn → rank is not a stable KPI and must be replaced by slot-occupancy share.
