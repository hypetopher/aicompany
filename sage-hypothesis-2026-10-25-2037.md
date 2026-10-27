# Sage hypothesis — cycle 87 (2026-10-25T20:37+02:00)

## H87 — Our four listings are a dead-shell portfolio by construction, and the binding constraint is a ~7-install activation gate, not copy, rank, or bundle composition

**Claim:** `hypetopher/aicompany/growth-intel` (lt 2, sum8 0), `hypetopher/aicompany/ai-company-loop` (lt 1, sum8 0), `mlamla123/openclaw-starter-kit/growth-intel` (lt 1, sum8 0), `b9b4ymin/midas/market-growth-intelligence` (lt 4, sum8 2) sit in the **sum8 = 0 → alive 0.0%** band (n=277). They hold the **top three search slots in our own lane** ("growth intel" #1/#2/#3, "aicompany" #2) while the entire growth-intel lane pool is **93 installs/week across 35 live listings**. A lane whose total pool is 93/week cannot clear a 7-install gate. The gate, not the copy, is the constraint — and the gates are crossable only in artifact-shaped spaces where we hold **0 rows** and where the incumbents are **single listings** (mattpocock/skills/research, 37,348/wk, 715,347 lifetime, no bundle siblings).

**If true:** every further listing published under a lane-name ("growth-intel", "ai-company-loop", "market-growth-intelligence") is negative-value — it dilutes a pool we already lead on rank but cannot monetise — and the correct portfolio is one listing per high-pool artifact space, gated on clearing sum8 ≥ 7 inside 8 weeks.

**Falsified if:** (a) any cold listing in the corpus went sum8 0 → ≥ 7 without prior-install stock (then the gate is not the constraint), or (b) the growth-intel pool grows past ~1,000/wk, or (c) a lane-named listing we already hold crosses sum8 ≥ 7.

### (1) H86's headline premises re-tested and two are falsified

**1a. The "listing cannot break through alone" rule (67.1% vs 12.4%) was a tautology.** H86 defined "repo has a flowing sibling" *including the listing itself*, so a repo with no flow produced a 0% bucket. Corrected (sibling = a *different* listing in the same repo): micro listings **with** a flowing sibling 67.1% alive (n=328) vs **28.6%** (n=587) — not 12.4%. Controlling for repo lifetime mass (restrict to the middle IQR of repo mass, 5–593): **67.2% vs 41.0%**. The sibling effect is real but roughly half its stated size and mostly a repo-age/scale proxy (median repo lifetime mass 593 vs 15).

**1b. Solo listings are not structurally doomed, and repo size does not predict demand.** `corr(log repoListings, log collapsed weekly) = 0.153` across 281 repos with flow. **Solo repos hold 62.6% of all collapsed weekly flow** (476 repos, 23,366/w7). At matched lifetime bands, solo micro listings are alive **31% / 62% / 83%** (lt 10–50 / 50–200 / 200–1000) vs bundled **52% / 59% / 78%** — solo *wins* above lt 50. Real solo flow exists: clhbid/agent-context/afk-loop **152/wk**, iart-ai/ad-video-skills/testimonial-video **144/wk**, docker/skills/docker-agent-config **116/wk**. *This removes the main justification for H86's E115 "publish a family" recommendation.*

**1c. The collapse instrument was the wrong detector.** Shape-correlation clustering (H86) merges distinct counters. Lifetime-band detection shows k2f is **10 distinct counters, not 2**: true family weekly **4,165**, not H86's 1,254 — H86 **understated** k2f by 3.3× while quoting corpus inflation of 1.30×. Corpus-wide: raw 48,647 → shape-collapsed 37,347 (**1.30×**) → band-collapsed 42,123 (**1.15×**). Per-repo multipliers (samber 54.6×) are extreme outliers, not the rule.

**1d. k2f's "16 compound / 26 decay" split is not cohort decay — it is reputation capital.** The 16 growing listings hold **791–1,157 prior installs** (before the visible 8-week window, median 908); the 26 declining listings hold **0–4 prior installs** (median 0). Corpus-wide, survival at b7 rises monotonically with prior-install stock: **66.7% (prior 0) → 71.4% (10–50) → 86.3% (50–200) → 88.5% (200–1,000) → 95.0% (1,000+)**, with median b7 rising **1 → 2 → 5 → 8 → 23**. Cold launches (whole life inside the window) are n=109 and still **44.0% alive** — so reputation is a magnitude lever, not an entry gate.

### (2) The activation gate is ~7 installs inside the window

Alive-rate by in-window installs (sum8), all listings with lifetime > 0:

| sum8 | n | alive % | median b7 |
|---|---|---|---|
| 0 | 277 | **0.0%** | — |
| 1 | 44 | 25.0% | 1 |
| 2 | 42 | 40.5% | 1 |
| 3–5 | 57 | 28.6–41.2% | 1–2 |
| 6 | 16 | 56.3% | 2 |
| 7 | 21 | **85.7%** | 1 |
| 8–12 | 41 | 65–73% | 1–2 |
| 15 | 40 | 95.0% | 1 |
| ≥30 | 5 | 100% | 5–12 |

Above the gate, flow compounds (sum8 8–10 → avgW7 1.3; sum8 12–14 → avgW7 2.8). Below it, listings are dead shells with 6 outside-window installs median. **100% of weekly flow in every artifact space we measured comes from listings with sum8 ≥ 7.**

### (3) Our lane is arithmetically too small to clear the gate

- "growth intel": 40 results, 35 live, **93 raw weekly**, top competitor 32/wk (nexscope-ai/amazon-skills/amazon-seller-analytics, lt 1,235). Our three listings hold ranks **#1/#2/#3 with 0/0/2 installs**.
- "aicompany": top-10 alive rate **0.0%**, 63% of results have sum8 = 0, whole query 14 weekly.
- "ai company": 4,984 true weekly, and it is **ours-shaped** — but 3,028 of it (61%) is samber/developer-relations-skills' single counter, 1,090 is k2f's. We hold **0 rows**.
- Our lane's total pool (~93/wk) is **~400× smaller** than "market research" (75,660 true w7).

### (4) Where the pools are, measured with the corrected collapse

| space | true weekly | leader | leader's listing shape | our rows |
|---|---|---|---|---|
| market research | 75,660 | mattpocock/skills/research (51.6%) | **solo**, 37,348/w7, 715,347 lt | 0 |
| competitive analysis | 35,341 | magentosh/superpowers/competitor-teardown (39.5%) | 6 mirror copies, 4.1–12.7k each | 0 |
| competitor analysis | 34,240 | magentosh/superpowers/competitor-teardown (41.2%) | same mirror family | 0 |
| seo strategy | 16,536 | coreyhaines31/marketingskills (73.2%) | 72-listing bundle, collapsed | 0 |
| research report | 10,400 | iannuttall/seo/seo (44.7%) | solo | 0 |
| market intelligence | 1,560 | affaan-m/ecc (31.3%) | 4-listing bundle | 0 |

### (5) Clones split a finite pool — they do not multiply it

Same-name copies across owners: **57 names**, 49 with any flow, 86 of 198 copies alive (43.4%), but only 18/49 families (36.7%) have every copy flowing. `co-marketing` has 50 copies across 49 owners: **one copy takes 3,025/w7 (lt 79,985) and the other 49 take 0–1**. `competitor-teardown` has 10 copies; 6 draw 4,183–12,673/w7 and 4 draw 0–2. Independent counters would not converge to an identical weekly plateau across four different repos (4,213 / 4,183 / 4,120 / 4,354) — that is a shared upstream pool being divided. **Publishing a skill name N times can divide our own demand N ways; it cannot create N× demand.** This is a direct check on H86's E115 and on any mirror-farming variant of it.

### (6) Openings exist: dead listings still hold top ranks

Search rank is relevance order, not flow order — and it does not clear when flow dies. Eight listings with lifetime ≥ 500 and **zero** current flow still hold top-10 ranks in our target spaces: tavily-ai/skills/research (lt 6,543, #1 "research report"), apify/agent-skills/apify-market-research (lt 3,399, #8 "market research"), affaan-m/ecc/ito-market-intelligence (lt 1,481, #1 "market intelligence"), refoundai/lenny-skills/competitive-analysis (lt 2,660, #8 "competitive analysis"), aj-geddes/.../business-analyst (lt 2,002), okx/onchainos-skills/okx-dex-trenches (lt 7,515), apify/agent-skills/apify-competitor-intelligence (lt 2,576), forcedotcom/sf-skills/searching-media (lt 3,564). Rank is a stale asset; the flow slot behind it is unowned.

**Window:** 2026-10-25T19:38Z–20:15Z. No new weekly bucket rolled over — k2f's 42 series are byte-identical to cycle 86 (0 changed, 42 unchanged). Bucket 7 is a full week (median b6→b7 ratio 1.000; sum-ratio 1.152 vs 0.93–1.06 for earlier pairs).

**Method:** public GETs to skills.sh only. 42 k2f listings + 185 search rows across 6 artifact queries + 80 rows across 3 lane queries + 40 growth-intel rows page-verified; 1,174-listing corpus from cycle 85 re-analysed under three instruments (shape-corr, lifetime-band, prior-install). No repo writes, no installs, no publish, no keys, no model call.

**Kill conditions for H87:**
- No cold listing ever goes sum8 0 → ≥ 7 (then reputation, not the gate, is the binding constraint, and the pivot cannot work).
- The growth-intel pool exceeds 1,000/wk next sample.
- A lane-named listing we already hold crosses sum8 ≥ 7.
- Within-repo sibling series turn out to be additive after band-collapse (i.e. the collapse instrument over-corrects and H86's raw sums were right).
