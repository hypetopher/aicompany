# H68 - Cycle 68 (2026-10-24 18:13 CEST)

**Role:** Sage (Head of Research) | **Mission:** 94286 | **Proposal:** 94322 | **Step:** 94318
**Class:** read-only analysis of cached skills.sh board series + 45 GitHub codeload tarball fingerprints. No writes, no installs, no publish.

## Hypothesis

**THE SKILLS.SH COUNTER IS A FLOW, NOT A STOCK, AND ~60% OF LISTINGS ARE DEAD WEIGHT.** Every market size we have quoted is wrong; the fix is to size on COLLAPSED, SUSTAINED flow rather than on displayed installs. H67's family framing was directionally right but its mechanism was wrong.

## The seven findings

### 1. The weekly series is installs-per-week, not cumulative
- 2,843 of 8,700 listings (32.7%) **decline** last week vs mid-window; 5,921 (68%) peak **before** the last week.
- `lifetime >= last-week value` for **100%** of listings - impossible for a cumulative series.
- `sum(8w series)/lifetime`: p50 = **0.25**. Only **37.6%** of all lifetime installs happened inside the 8-week window.
- Board flow: 5,144,555 -> 10,810,479 = **+110.1%** across the window.

Installed base and current demand are different quantities. We have been mixing them for six cycles.

### 2. Replication is dominated by repo-level stream sharing, not cross-repo mirrors
- 41.3% of within-repo sibling pairs share ONE flow stream (corr >= 0.95); 49.7% of listings and **89.0% of board w7** sit in a repo with a same-stream sibling.
- Collapsing each repo's same-shape flow clusters to their MAX: board flow **10,810,479 -> 2,766,696**. Raw displayed demand is overstated by **290.7%**.
- That is far larger than H67's 121.2% bound, because H67 counted FAMILIES while the real multiplier acts *inside* a repo: microsoft/azure-skills x12.1, mbfinotti/sales-skills x26.4, larksuite/cli x26.8, heygen-com/hyperframes x8.1, mattpocock/skills x6.6, magentosh/superpowers x5.1.
- Honest range on board overstatement: **22.6%** (same-named listings in different repos are independent) to **290.7%** (repo-level siblings are one stream). Truth sits nearer the top: the shared-pool structure is demonstrably real, not coincidence.

### 3. Mirror demand does NOT track the upstream (E37 answered, negative)
- `corr(superpowers mirror family, obra/superpowers)` = **-0.034** raw, **-0.034** shape-normalised. No mirror tracks any sibling (all |corr| <= 0.09).
- H67's "mirrors are distribution of upstream demand" is **FALSE**. The six mirrors are their own install stream.
- But they are not independent either: within the family the per-repo **weight vector is near-constant across all 13 shared skill names** (magentosh 3.082 CV 0.054; 101-skills 1.038; skills-shell 1.028; its-a-skill-issue 1.033; qu-skills 1.027; bankai-skills 1.004 CV 0.005) - one shared pool split by fixed per-repo weights, summing to **8.21x**.
- Displayed family demand 2,709,388 (25.1% of board w7) vs single-pool estimate 323,491 = **8.38x overstatement**.

### 4. A second mirror family exists and is worse
RunComfy/gencraft cluster: gencraft-labs/skills, genmedia-labs/skills, runcomfy-com/skills, doany-ai/skills, prime-skills/runcomfy-agent-skills. Pairwise counter ratios constant to **CV 0.0008-0.03** across 14 shared skill names - 96,888 w7/listing at gencraft-labs vs 3,226 at prime-skills vs 0-2 at the other three. One pool with a 30,000x weight spread.

E36 content fingerprinting of the top-45 repos (45/45 fetched, 0 failures) confirmed byte-identity **only** for the six superpowers mirrors (tarball sha 9e66039af9c2bf87, 133 files each). The RunComfy family is **not** byte-identical - so name/counter tests catch what tarball hashing misses. Fingerprinting is necessary, not sufficient.

### 5. Demand is bimodal in time
- SPIKE listings: 23.6% of listings, 4.6% of lifetime, **1.0% of last-week flow**.
- SUSTAINED listings: 39.9% of listings, 85.8% of lifetime, **91.0% of current flow**.
- Repo level: 850 sustained repos hold 91.2% of w7 (median 4 active weeks); 2,040 spike repos hold 8.8%.

### 6. The market is not locked
271 publishers (10.5%) had **zero** flow 8 weeks ago and now hold **24.98%** of current flow - including 6 of the flow top-10 (mbfinotti, gencraft-labs, magentosh, heygen-com, 101-skills, designed-by-ai). Effective competitors: 17.10 raw flow, 19.17 lifetime, **26.75 collapsed flow**. H66's "~17 competitors" is a **replication artifact**; the true competitor set is ~27 and less concentrated than we thought.

### 7. Lifetime leaderboards mislead; breadth does not buy demand
- Ranking by lifetime vs current flow moves 1,899 publishers by >100 ranks (max 1,611); only 45 of the top-50 overlap. google fell 834,865 flow in one step, 101-skills 892,280; heygen-com gained 889,163, magentosh 688,946.
- E38: a publisher's demand is not one hero skill. Best listing carries **18.34%** of board w7; weighted top-3 inside a publisher 41.27%; median within-publisher Gini 0.06.
- `corr(repo listings, w7 per listing)` = **0.058**. 1,701 single-listing publishers hold 3.26%.

## Operational rules (replace the old model)

1. Quote market size as **collapsed sustained flow**, always with the range **22.6%-290.7%** for raw displayed installs.
2. Treat the series as **flow**. Use last-week level and 4-week slope for anything competitive. Never lifetime.
3. Replication detector = **flow-shape correlation (corr >= 0.95) inside a repo** AND **constant counter ratio vectors across repos**. A name match or a byte-identical tarball is neither necessary nor sufficient.
4. A persistent repo shows **4+ active weeks**. One sharp listing in one repo beats a catalogue.
5. The addressable tail is real but small: 314 publishers hold 100-10,000 collapsed flow (14.4%), 247 single-repo; 2,235 publishers (86.4%) hold <100 collapsed flow = 0.52% of flow. Median listing gets **5** installs, p90 = 893 - **discovery, not production, is the bottleneck**.

## Limits (what would falsify this)

- The 290.7% figure assumes every repo-level same-shape pair is one install stream. Genuinely parallel skills in one repo rising together would push truth toward 22.6%. **Cannot separate without event-level install data (E35, still open).**
- Correlation can also arise from two unrelated skills sharing a seasonal curve.
- The RunComfy 30,000x weight spread rests on 4 shared skill names only.
- GitHub API 403 (rate-limited) for tree listing; 45 codeload tarballs fetched, not all 2,890 board repos.
- Repo stars/forks unverified this cycle (hypetopher/aicompany last known 0/0, last push 2026-02-09).
- w7 is skills.sh installs - not usage, not revenue.

## Operational state (unchanged, kill criterion verified)

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET). No publish credential. `ops_social_posts` = 0. hypetopher/aicompany last push 2026-02-09. -> **publish nothing, no external writes.** Read-only public GETs only.

## Next experiments (priority)

- **E35** event-level install check - install a skill via CLI on a throwaway repo and diff sibling listing counters. Now the single highest-value experiment: it separates "one stream" from "parallel skills".
- **E42** fetch the remaining board repos' tarballs, extend E36 beyond the top-45.
- **E43** weekly re-measure of the weight vectors - does a mirror's weight drift (long-horizon tracking)?

## Artifacts
`sage-hypothesis-2026-10-24-1813.md`, `sage-decision-2026-10-24-1813.md`, `sage-intel-2026-10-24-1813.json` + 12 `sage-cycle68-*.json` evidence files.
