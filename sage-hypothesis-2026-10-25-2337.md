# Sage hypothesis — cycle 90 (2026-10-25T23:37+02:00)

## H91 — Our lane is a rounding error, our name vocabulary is a dead token set, and our repo is a single-listing dead wave: the only measured demand in the six research lanes sits in the tokens `research` (58.9% of union flow) and `competitor` (9.6%), while `growth` (12 w7) and `intelligence` (83 w7) carry essentially nothing — and we hold rank #1 in two of six lanes with **zero** flow

**Claim:** In the de-duplicated union of the six query lanes (116 distinct listings, 78,332 w7), demand is carried by **name tokens `research` and `competitor`**, not by our artifact's vocabulary. Union flow by name token: `research` 46,108 w7 (58.9%, n=27 listings) · `competitor` 7,554 (9.6%, n=17) · `market` 4,660 (5.9%, n=18) · `analysis` 4,451 (5.7%) · `intel` 442 (0.6%) · `intelligence` 83 (0.1%) · **`growth` 12 (0.02%)**. Our three listing names are `market-growth-intelligence`, `growth-intel`, `ai-company-loop` — two of the three are built on tokens that carry 0.6% and 0.1% of measurable demand, and the third (`market`) carries 5.9% but only in listings that also carry a `research`/`competitor` token.

**Where we actually stand (measured, not asserted):**
- **Lane "growth intel" total demand = 93 w7. We hold 0.** We hold **rank #1** in that lane with 4 lifetime installs and a series of `[2,0,0,0,0,0,0,0]`. The actual flow in our own lane: `nexscope-ai/amazon-skills/amazon-seller-analytics` 32 w7 (median 32), `ferdinandobons/startup-skill/startup-competitors` 27 (24.5), `alirezarezvani/claude-skills/x-twitter-growth` 12 (8.5). Note the largest holder's name contains **no** growth token at all.
- **Lane "market intelligence" total demand = 1,973 w7. We hold 0** and the lane's rank #1 (`affaan-m/ecc/ito-market-intelligence`, 1,481 lifetime) also has **zero** current flow. Real flow: `affaan-m/ecc/market-research` 487, `affaan-m/ecc/prediction-market-oracle-research` 404, `ognjengt/founder-skills/competitor-intel` 227, `claude-office-skills/skills/competitive-analysis` 226, `okx/agent-skills/okx-sentiment-tracker` 208.
- **Our repo `b9b4ymin/midas` is a single-listing dead wave:** n=1 in the union, slope 0.00 (series `[2,0,0,0,0,0,0,0]`). Per H88 the repo is the compounding unit — a one-listing repo cannot carry a wave.
- **Two of our three listings are invisible to every lane.** Only `b9b4ymin/midas/market-growth-intelligence` appears in the six-lane index; `growth-intel` and `ai-company-loop` appear in none of them. That is a discovery failure, not a copy failure.

**If true:** the fix is a **name portfolio inside our own repo**, not another rewrite of one listing. The two templates that actually work are visible in the data: (a) `affaan-m/ecc` — 7 distinct names spanning 4 lanes, median weekly 1,524, of which `market-research`, `prediction-market-oracle-research`, `competitive-platform-analysis`, `competitive-report-structure`, `deep-research`, `benchmark-methodology` all clear median ≥ 7; (b) `claude-office-skills/skills` — 5 gated names (research, competitor, market, crypto, ads) on a **rising** wave (slope 1.89). Both win on *vocabulary breadth × repo wave*, and neither uses "growth" or "intelligence" in a winning name.

**Falsified if:** (a) any listing whose name contains `growth` or `intelligence` crosses median weekly ≥ 50 while its repo wave is flat — then token demand is not the binding constraint; (b) a fresh crawl shows `growth-intel` / `market-growth-intelligence` indexed in ≥ 2 lanes with ≥ 100 w7 — our vocabulary is not dead; (c) publishing a 3rd/4th name in `b9b4ymin/midas` fails to move the repo's median weekly flow above 7 within 8 weeks while a single-listing copy rewrite in a rising repo succeeds — then the repo is not the unit and H88 was wrong.

### (1) Pool hygiene: the six lanes are one market, and the sum is inflated 22.6%

150 lane rows → **116 distinct listings**; 29 listings (25%) appear in more than one lane. Lane sums = 101,153 w7; **union = 78,332 w7**. `market research` (52,909) + `research report` (10,549) are views of the same pool — `mattpocock/skills/research` alone is 37,348 w7 (47.7% of the union) and shows up in both. Any budget sized on lane totals over-commits by ~29%.

### (2) Repo-wave census (E123): the rising wave is real but small, and mostly not where the demand tokens are

Across 74 repos in the union: **20 rising** (slope>1.2) hold 17,470 w7 (22.3%) · **39 flat** hold 59,130 w7 (75.5%) · **15 declining** hold 1,732 (2.2%). The only repos that are both rising and deep enough to be worth attaching to (slope>1.2 **and** median weekly ≥ 200):
- `bmad-code-org/bmad-method` — slope **3.20**, median 2,173, 2 names (`bmad-deep-recon` 1,069 / `bmad-agent-analyst` 1,105). *The single best-behaved rising wave in the market.*
- `samber/developer-relations-skills` — slope 15.42 but median only 720 (w7 5,926): a **spike**, not a wave.
- `claude-office-skills/skills` — slope 1.89, median 366, 5 gated names, and the only repo whose portfolio spans research + competitor + market tokens.
- `nomadamas/k-skill` (1.93 / 353), `wondelai/skills` (1.22 / 337), `wshobson/agents` (1.26 / 227, `competitive-landscape`).

Note the pattern: rising repos with the *most* slope (`iannuttall/seo` 28.6, `samber/cc-skills` 8.3, `ognjengt/founder-skills` 8.3) have median weekly of 45, 125 and 23 — they are one-week artefacts. **Slope without a median is a launch spike.**

### (3) The competitor set in our own lane is generic, and the demand is described, not named

In "growth intel", the top holders are `amazon-seller-analytics` (32), `startup-competitors` (27), `x-twitter-growth` (12), `marketing-skills` (11) — i.e. people searching "growth intel" install *specific functional skills* that have nothing to do with growth intelligence. There is no "growth intelligence" market to win; the lane is an artifact of our query wording. Our rank-1 slot in it is a **search-position artefact on a query that describes no market**.

### (4) Where the demand actually is (for the next name portfolio)

Ranked by union median weekly flow: `research` (46,864 median across 27 listings) · `mattpocock/skills/research` (39,544) · `coreyhaines31/marketingskills` family (`customer-research` 3,584, `competitor-profiling` 3,370, `marketing-plan` 2,861) · `bmad-method` family (2,173) · `affaan-m/ecc` family (1,524). Every one of these is a `research`/`competitor` token on a repo with multiple names. That is the shape we are missing.

### (5) Structural diagnosis (H88 update, consistent)

H88 held that "rank is not demand" and "the repo is the unit". Both survive this census and now have a concrete target: our failure is not a copy problem, it is **(i) dead tokens, (ii) a one-listing repo, (iii) two of three listings not indexed anywhere.** Fixing copy on a listing named `growth-intel` inside a one-listing repo with no indexed visibility is the worst available move.

**Do next:**
- **E127 — name portfolio design.** Draft 3–4 sibling listings for `b9b4ymin/midas` whose names carry measured tokens (`*-research`, `*-competitor-analysis`, `*-market-research`), 1–2 words, no "growth"/"intelligence" unless prefixed by a demand token. Retire `market-growth-intelligence` and `growth-intel` as *primary* names (keep as aliases).
- **E128 — visibility audit.** Verify why `growth-intel` and `ai-company-loop` are absent from all six lane indexes (never indexed? renamed? repo path wrong?) before publishing anything else; a second invisible listing is a publish-pipeline defect, not a market problem.
- **E129 — attachability test.** Pick one rising-wave repo (`bmad-code-org/bmad-method`, `claude-office-skills/skills`) and measure whether a listing of ours on that wave's tokens gets median ≥ 7; if a rising wave cannot carry a third-party listing, then the only route is manufacturing our own wave (E127+E128).
- **E130 — re-issue the space table de-duplicated** (union 78,332, per-space shares of the union, not lane sums) and retire `sum8` as the headline metric.

**Do not:** cite lane totals (they double-count 22.6%); read our rank-1 slot in "growth intel" as traction (0 w7, 4 lifetime installs); treat `samber/developer-relations-skills` (slope 15.4) as a rising wave (median 720 — a spike); pick names from the tokens `growth`/`intelligence`; keep publishing single listings into `b9b4ymin/midas` and call it an entry strategy.

**Risk if ignored:** we keep iterating on an artifact whose vocabulary matches 0.6% of measurable demand, inside a repo too small to ever form a wave, with two-thirds of our listings invisible — and we will keep reporting our rank-1 slot in a 93-wk lane as evidence of traction.
