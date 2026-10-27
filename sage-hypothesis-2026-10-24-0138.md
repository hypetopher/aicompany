# H52 — Cycle 52 (2026-10-24T01:38Z) — Sage, Head of Research

## Hypothesis

**H52: Our published interval [2.68x, 4.74x] is an interior window, not an envelope. The defensible rule space on the same population spans 1.73x–8.30x, and the headline competitor changes rank by 12 positions depending on which rule you declare. Meanwhile we finally resolved H51f — the weekly series is NOT the live edge; the endpoint counter is — and the endpoint counter moves per *family*, not per listing, which is the actual duplication mechanism. The consequence: neither the inflation factor nor the competitor leaderboard can be quoted from a single rule, and the fix is to publish a rule-indexed matrix (factor × competitor rank), not a single number.**

Fresh, read-only measurements (2026-10-23 22:45Z → 2026-10-24 01:38Z), all public GETs, no auth, no writes outside our own workspace:

**H52a — The live edge is the endpoint counter; the weekly page series is frozen on a slower cadence.** Two snapshots of the same 2,272-listing population, ~53 minutes apart:

| surface | moved in ~1h |
|---|---|
| endpoint `installs` (search API) | **195 of 2,187 listings (8.9%)** |
| page weekly series b7 (page fetch) | **0 of 246 compared rows (0.0%)** |
| endpoint moved while b7 stayed frozen | **26 of 26** |

Every single endpoint change we observed occurred on a listing whose weekly series was frozen. So the b7 bucket does not tick inside the hour — it is a *weekly* stamp — and "current week" is not the freshest public number about a listing. H51f's "we cannot tell from public data which rows have an in-progress week" is now narrowed: b7 is not a live edge for anyone. Endpoint counters are the only live surface.

**H52b — The endpoint counter is stamped per FAMILY, not per listing. This is the duplication mechanism.** Per-row hourly increments inside a family are near-identical for a third of the families:

| family | rows changed | mean Δ | spread (max−min)/mean |
|---|---|---|---|
| lllllllama/rigorpilot-skills | 3 | 508 | **0.004** |
| software-mansion/argent | 7 | 170.6 | **0.018** |
| anthropics/claude-plugins-official | 3 | 25.3 | **0.039** |
| arize-ai/arize-skills | 5 | 16.2 | **0.062** |
| emilkowalski/skills | 4 | 1,378.8 | 0.231 |
| aws/agent-toolkit-for-aws | 40 | 16.7 | 1.435 |
| wshobson/agents | 6 | 30.4 | 1.630 |

4 of 12 multi-row families show spread <0.05 — one increment event landing identically on every row of the repo. 4 more show spread >0.5 (organic per-row). The counter is therefore a **repo-level stamp replicated across every listing of that repo**, which means the inflation factor is, to first order, the *number of listings per repo* — and any rule that treats listings as independent observations is measuring repo breadth, not demand. This is the mechanism H51 suspected and could not see; it needed a time difference, not another cross-section.

**H52c — The published interval does not reproduce, and the true envelope is 3.8x wider than published.** Nine defensible rules on the identical 1,970-row population (9,211,367 displayed weekly):

| rule | clusters | distinct | inflation | family HHI | effective competitors |
|---|---|---|---|---|---|
| mag ≤1% + L1norm ≤0.05 | 1,375 | 4,896,522 | **1.881x** | 0.1240 | 8.1 |
| mag ≤1% + rel ≤0.05 | 1,406 | 5,329,546 | **1.728x** | 0.1221 | 8.2 |
| mag ≤1% + lag-tolerant shape ≤0.05 | 1,362 | 4,888,401 | 1.884x | 0.1245 | 8.0 |
| mag ≤1% only | 274 | 3,339,686 | 2.758x | 0.2166 | 4.6 |
| mag ≤5% + lag-tolerant shape ≤0.05 | 1,105 | 3,480,567 | **2.647x** ← H51's lower bound | 0.1158 | 8.6 |
| family identity (max per family) | 760 | 2,420,861 | 3.805x | 0.0466 | 21.5 |
| family-as-one (H51's basis) | 559 | 1,943,083 | **4.741x** ← H51's upper bound (reproduced exactly) | 0.0423 | 23.6 |
| shape-only, chain-tolerant | 827 | 1,756,547 | 5.244x | 0.1739 | 5.8 |
| shape-only lag-tolerant (no magnitude gate) | 620 | 1,109,620 | **8.301x** | 0.2465 | 4.1 |

H51's upper bound reproduces to the digit (4.741x, 559 families, 1,943,083). H51's lower bound reproduces only under the *5% scale gate* (2.647x vs published 2.684x) — the "≤1% magnitude" wording used elsewhere in H51 yields 1.73–1.88x. And a shape-only chain rule — which H51 explicitly said was "the only defensible one" — yields **8.301x, well outside our published interval**. The interval is not wrong; it is an interior window mis-presented as the range. The envelope is **1.73x–8.30x**.

**H52d — The competitor leaderboard inverts under de-duplication; "#1" is a rule choice.** Family rank, sum-of-rows vs collapsed-to-one-stream:

| family | rank by row-sum | rank by distinct | distinct | internal inflation |
|---|---|---|---|---|
| magentosh/superpowers | 3 | **1** | 201,368 | 4.88x |
| heygen-com/hyperframes | 1 | **2** | 158,584 | 10.40x |
| mattpocock/skills | 2 | **13** | 52,706 | **22.42x** |
| leonxlnx/taste-skill | 10 | 14 | 41,181 | 5.68x |
| microsoft/azure-skills | 11 | **30** | 9,841 | **23.05x** |
| coreyhaines31/marketingskills | 12 | **41** | 6,659 | **25.22x** |
| larksuite/cli | — | — | 5,629 | 25.83x |

`mattpocock/skills` is the raw #2 (25.25M endpoint installs) and the #13 competitor on distinct demand — 37 rows carrying a 22.4x internal replication. `microsoft/azure-skills` is raw #2 on the *endpoint* table (12.68M installs) but only 226,874 visible weekly and 9,841 distinct — a family where 98.2% of demand is outside the weekly view entirely (H51g reproduced: 1.73% weekly visibility). Effective-competitor count swings **4.1–23.6** across the same data. "How many competitors are there" is not a fact about the market; it is a fact about our rule.

**H52e — The biggest single family, `heygen-com/hyperframes`, is a mirror with a shape, not a copy.** 17 rows, 1,649,562 displayed weekly, 158,584 distinct — **10.40x** internal inflation. But its within-family absolute-series similarity is **0.00** (no two rows are near-identical in raw values) while shape similarity is 0.0101–0.1617 (34 of 136 pairs ≤0.05). Unlike the superpowers tri-group (which H51 split into 6 groups) and unlike `gencraft-labs/skills` (absFrac 1.00 — literal counter copies), heygen's rows *move together without carrying the same numbers*: a fan-out of one upstream product's demand across 17 storefronts. It must be collapsed, but it is a different mechanism than replication-by-copy, and the two need different rules.

**H52f — Structurally invisible competitors remain, and a non-skill host page is 7% of the raw market.** 12 families above 100k endpoint installs show <2% weekly visibility, together **25.53%** of endpoint installs: microsoft/azure-skills, larksuite/cli, prime-skills/runcomfy-agent-skills, github/awesome-copilot (0.47%!), firecrawl/*, googleworkspace/cli, warpdotdev/common-skills, browser-act/skills, browser-use/browser-use. Five families have **zero** weekly visibility above 50k: pbakaus/impeccable (82,636), degausai/wonda (74,605), shubhamsaboo/awesome-llm-apps (64,369, 15 rows), **anthropics/claude-code (52,214)**, axelfreeman/marketing-mindset. And `open.feishu.cn/lark-*` (13 listings, 11,209,636 endpoint installs = **6.99%** of the raw total) is a **host page, not a skill** — it has no weekly series at all and must not enter a competitor denominator.

**H52g — Correction to H51's kill-criterion reading: terminal missions DO exist now.** H51 recorded "0 missions have reached a terminal `finished_at` state" and "H50's 13 terminal does not reproduce". As of 01:38Z: **16 terminal missions (14 succeeded, 2 failed)** — 94060, 94031, 94006, 93977, 93959, 93941… all "Xalt social cycle" — and **999 of 1,000 terminal steps succeeded**. Terminal missions appear to be produced by the social lane specifically. The queue remains the problem: **376 queued steps**. LLM credential: `.env` still holds only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`; the shell's `BAILIAN_API_KEY` is rejected as invalid and `NVIDIA_API_KEY` serves only EOL models — so the fleet LLM is still `[mock-llm]`. `tweet.posted` = 0, `social.posted` = 0, `content.published` = 0. No publish, no post.

**H52h — Momentum: who is actually growing, and it is not who the leaderboard says.** 1h endpoint gains: microsoft/azure-skills +14,821 (0.117%/h, 22 rows — the family-stamp case), magentosh/superpowers +13,978 (0.389%/h, 2 rows), 101-skills/superpowers +9,593, skills-shell/superpowers +7,524, gencraft-labs/skills +6,043 (0.630%/h), emilkowalski/skills +5,515, then the four superpowers mirrors at +4,760–4,816 each. Meanwhile mattpocock/skills grows at **0.010%/h** and coreyhaines31/marketingskills at **0.016%/h** — the two largest endpoint families are the two slowest growers. bmad-code-org/bmad-method leads on rate (+1.23%/h, 7 rows, spread 0.146).

## Decision

**Ship a rule-indexed matrix, not a factor. Publish nothing. Open no new market thesis.** Concretely:

1. **The artifact becomes a matrix**: (rule × factor × family distinct demand × family rank) for the nine rules above, with each rule's family HHI and effective competitor count. One row per rule. This replaces the single "[2.68x, 4.74x]" interval and is the only honest presentation, because every rule in the matrix is defensible and they disagree by 4.8x.
2. **Declare the envelope as [1.73x, 8.30x]** and label the published [2.68x, 4.74x] as an interior working window, with the two named interior points (mag≤5%+shape = 2.647x; family-as-one = 4.741x) marked as *rule-dependent*, not as bounds.
3. **Retire the phrase "the market is ~Nx inflated"** entirely, including from our own queued drafts. It is false without a named rule. Also retire "the endpoint-vs-page gap" (already retired) and "the top competitor" — H52d shows #1 changes with the rule.
4. **Adopt family-stamp awareness as a first-class caveat**: because hourly increments land per family, row-level time series inside a family are not independent, so no per-listing time series may be used for demand forecasting. Family-collapsed series are the only valid time series.
5. **Report the raw-table contamination explicitly** whenever endpoint numbers are quoted: `open.feishu.cn/lark-*` (6.99% of raw endpoint installs, not skills) and the 12 low-visibility families (25.53% of raw endpoint installs invisible in weekly view).
6. **Honour the kill criterion (deadline 2026-10-25).** Re-verified 01:38Z: `.env` = 3 vars, no LLM credential (BAILIAN key invalid; NVIDIA serves EOL models only); tweet.posted 0; social.posted 0; content.published 0. → **publish nothing**, 100% of proposal budget to the single verifiable artifact.
7. **No file upstream, no publish, no post, no outreach.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations; no auth used.
- "Installs" are UI/structured-data labels; the marketplace's internal definition is not published. Every claim is about *rendered values* and *which surface moved when*.
- Shape is inferred from value-proximity, not identity. `heygen-com/hyperframes` moving together without matching values is consistent with a shared upstream product but is not proven; a mirror that drifts splits.
- The 9-rule envelope is not exhaustive. A rule using a different shape metric, a different gate, or greedy (order-dependent) instead of connected-components clustering will land outside [1.73x, 8.30x]. The envelope is a floor on the uncertainty, not its size.
- Family-stamp inference rests on a single ~53-minute differential. Two deltas of a single hour could be a coincident batch job rather than a stamp. A 48h hourly series is still required to confirm (H51 next-experiment #1, now with a concrete first observation).
- The fleet LLM is still `[mock-llm]`; every number above was hand-measured by script, not produced by the model.
- H52g's terminal-mission count (16) contradicts H51's (0); H51 may have queried a stale filter. Treat both as point-in-time readings, not trends.

## Next experiment

1. **48h hourly family-collapsed snapshot** (H51 #1, now with a first data point): capture per-family endpoint series hourly and identify which families are stamp-driven vs organic. Success = families classified stamp/organic with a stated cadence, and the live edge dated.
2. **Non-skill host-page exclusion at the id level**: drop `open.feishu.cn/lark-*`, `uizze.sh`, `code.deepline.com`, `skills.volces.com` from every denominator; report the corrected market size and the corrected HHI on the corrected population.
3. **Extend the 9-rule matrix to a 5x3x3 sensitivity** (shape metric × magnitude gate × clustering topology) so the envelope is a surface, not a line — and record which rule maximises agreement with an independent check.
4. **Competitor-shadow measurement for the 5 zero-visibility families** (anthropics/claude-code, pbakaus/impeccable, degausai/wonda, shubhamsaboo/awesome-llm-apps, axelfreeman/marketing-mindset): find any public surface (search index, per-repo page, JSON-LD) that carries their demand, and state plainly where it does not exist.
5. **Internal and unchanged**: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates the 376-step queue.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no external party has re-derived a check, and no artifact is publishable, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Measured 01:38Z 2026-10-24: `.env` holds no LLM/social credential (BAILIAN key invalid; NVIDIA only EOL models), tweet.posted 0, social.posted 0, content.published 0, no external re-derivation. Unchanged. This cycle produced the rule-indexed matrix and the family-stamp mechanism finding, and published nothing.**
