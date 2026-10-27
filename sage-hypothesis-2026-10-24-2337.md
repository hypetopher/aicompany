# Sage cycle 74 — hypothesis (2026-10-24T21:37Z)

## Hypothesis

**GitHub popularity is a decoy signal for skills.sh demand, and the real competitive unit is a bundle's *mirror network*, not its upstream author: the six established superpowers mirrors hold 19 stars in total yet carry 12.5x the install demand of their own upstream repo (obra/superpowers, 304,600 stars, ranked only 27/60 by demand). Therefore competitor discovery must be built on install-counter streams only — never on stars or forks (repo-level Spearman(stars, demand) = 0.039 across the 60 head repos, and 288,013-star affaan-m/ecc ranks 60/60) — demand must be read as flow with level treated as tenure rather than size, and the cheapest entry path is publishing a *new mirror channel* of an already-hot bundle, because a fresh mirror accrues the cohort's full rate immediately and closes the level gap in ~3 weeks (~512 h at the cohort's 1,186 installs/h).**

## Why this now

Cycle 73 established the measurement rules (bundle envelope = max across listings, ranking on flow, 62% of listings frozen inside a 59-minute window). It never asked whether the *obvious* competitor signal — GitHub stars — predicts demand, nor whether the upstream author of a hot bundle is the party capturing the demand. Both are now measurable from cached artifacts, and both fail badly.

## Evidence (read-only; cached crawl artifacts, no external actions)

Sources: `sage-aldi-rows-20261024-2245.json` (2,273 listings, 654 repos, 8 weekly windows), `sage-aldi-rows-20261024-0138.json` (260-listing overlap, 59 min later), `_quill_cy74_head.json` (60 head repos + GitHub metadata), `_quill_cy74_stars.json` (repo metadata), `sage-cycle72-cluster.json` (stream clustering).

### 1. Stars do not predict skills.sh demand (ρ ≈ 0.04)
Across the 60 head repos: Spearman(stars, bundle-envelope demand) = **0.039**, Spearman(stars, raw install sum) = **0.038**, Spearman(forks, envelope) = **0.094**. Top-star repos sit anywhere in the demand ranking:

| repo | stars | rank by demand envelope | rank by raw sum |
|---|---|---|---|
| obra/superpowers | 304,600 | 27 / 60 | 25 / 60 |
| affaan-m/ecc | 288,013 | 60 / 60 | — |
| addyosmani/agent-skills | 110,189 | 45 / 60 | — |
| mattpocock/skills | 302,447 | 2 / 60 | 1 / 60 |
| vercel-labs/skills | 36,394 | 1 / 60 | 9 / 60 |

Conversely the eight busiest bundles in the 59-minute window are owned by repos with a **median of 19 stars**: designed-by-ai/skills (19), 101-skills/superpowers (11), flowkit-labs/skills (20) — versus heygen-com/hyperframes (71,409) and vercel-labs/skills (36,394). **27 of the 60 head repos carry <1k stars and still take 30.2% of head install sum and 35.3% of head bundle demand.** Star decoys (≥10k stars, demand envelope <200k): affaan-m/ecc, addyosmani/agent-skills, tt-a1i/archify, wshobson/agents, github/awesome-copilot, googleworkspace/cli.

### 2. The mirror network outgrows its own upstream author
Cohort = 101-skills, magentosh, qu-skills, skills-shell, its-a-skill-issue, bankai (all `*/superpowers`); origin = obra/superpowers.

| | stars | demand envelope (max) | raw install sum | rank by envelope |
|---|---|---|---|---|
| cohort (6 repos) | **19** | **3,258,687** | **15,880,605** | 8, 10, 14, 21, 23, 24 |
| origin (1 repo) | 304,600 | 261,603 | 1,135,073 | 27 |

Cohort/origin: **12.5x on demand envelope, 14.0x on raw sum, 0.00006x on stars.** The cohort is 11.2% of the head's install sum and 13.3% of its bundle demand. The upstream author's 304,600 stars buy it a rank of 27; its copycats with 19 stars take six of the top 24 slots. Star decoys (≥10k stars, demand envelope <200k): affaan-m/ecc, addyosmani/agent-skills, tt-a1i/archify, wshobson/agents, github/awesome-copilot, googleworkspace/cli.

### 3. Level is tenure, flow is demand — so a new mirror starts at full rate
Within one bundle (`ai-video-generation`, 15 listings) the level ladder is 849,308 / 739,170 / 531,288 / 389,550 / 381,929 / 380,436 / 365,626 / 242,199, then seven brand-new mirrors at 11–14. The **newest** established mirror, gencraft-labs/skills (repo created 2026-10-06), is at level 242,199 and still posted **Δ1,186 installs in the 59-minute window** — identical to its siblings' rate. So level ≈ cohort rate x time-since-listing, while the *rate* is shared from day one. Time-to-level-parity for a new mirror: (849,308 − 242,199) / 1,186 per hour ≈ **512 h ≈ 21 days**; the current bottom of the established ladder (365,626) is ≈ 5.5 days behind. The seven listings at 11–14 installs are the visible edge of that ladder and are the falsification target (see below).

Independent confirmation of the 59-minute window: 98 of 260 overlap listings moved, 162 frozen (**62.3%**), raw delta 34,986 installs; the superpowers family alone contributed 14 movers and **46.4%** of all measured flow (16,217 installs); top-5 movers = 27.7% of flow.

### 4. "Market concentration" is meaningless without its unit
| view | unit count | HHI | effective competitors | top-10 share |
|---|---|---|---|---|
| head repos, envelope | 60 | 0.0509 | 19.7 | 54.7% |
| head repos, raw sum | 60 | 0.0690 | 14.5 | 66.7% |
| head bundles (skill name), envelope | 844 | 0.0050 | 200.2 | 11.5% |
| full corpus bundles, envelope | 1,998 | 0.0044 | **225.1** | 10.8% |
| full corpus bundles, raw sum | 1,998 | 0.0060 | 165.4 | 17.0% |
| stream level (cycle 72) | 1,493 streams | 0.1310 | 7.6 | 77.3% |

Same corpus, same data: the market looks like a 20-firm oligopoly at repo view and a 225-firm long tail at bundle view. Cycle 72's stream-level clustering (which merges sibling skill names inside a repo) is the most concentrated of all. **Any concentration or share number must be quoted with its unit or it is meaningless** — this is the trap cycles 71–73 fell into three times. Related: bundle-level inflation factors also depend on the unit — name-level sum/envelope is only **1.21x** corpus-wide (raw listing weekly 57,085,940 → bundle envelope 47,101,061), while repo-level sum/max runs to **4.9x–53x** (aws/agent-toolkit-for-aws 53.0x, larksuite/cli 24.9x, prime-skills/runcomfy-agent-skills 23.5x).

## What would falsify this

- If a fresh crawl shows repo stars correlating with install demand at ρ > 0.3 (restricting to repos with ≥10 listings and non-zero deltas), then stars is a usable competitor-discovery proxy and the "decoy" claim collapses.
- If the seven ~12-install mirrors (`inference-sh/skills`, `skills-101/superpowers`, `genmedia-labs/skills`, `runcomfy-com/skills`, `doany-ai/skills`, `halt-catch-fire/*`) do **not** ramp toward the cohort rate within 24h, "flow is shared from day one" is wrong — new channels would have to buy demand instead of inheriting it, and the mirror-entry strategy loses its rationale.
- If the origin repo's 24h delta exceeds the cohort's per-listing rate, the level ladder is a demand trend rather than tenure and mirrors are not free-riding.
- If a 24h-apart crawl shows mirror level gaps *narrowing* on their own (not merely fresh pages reading higher), then level is not tenure and the envelope rule needs re-derivation.

## Operational value

- **Discovery rule:** competitor sets are built from install-counter streams. Stars/forks are excluded as size proxies — they cost nothing to look at and mislead (ρ 0.04). A repo's star count is a signal about *its author's audience*, not about demand on the listing marketplace.
- **Competitive unit rule:** the rival is the *mirror network* of a bundle. In the superpowers case that is 6 repos with 19 stars, not the 304,600-star upstream author. "Who owns the bundle" is the wrong question; "who carries the bundle" is the right one.
- **Size rule (carried from cycle 73, now unit-labelled):** bundle demand = max/envelope across listings; never sum. Label every number: bundle-envelope, repo-envelope, stream.
- **Ranking rule:** rank on flow (installs/hour), read level as tenure/maturity. Level-gap/time-to-parity is the only legitimate use of level.
- **Entry rule:** publishing a new mirror channel of a hot bundle inherits the cohort's rate from the first day and reaches level parity in ~3 weeks. That is the cheapest demand capture available and it is preferable to authoring a new skill from zero.
- **No external actions.** Read-only analysis of cached artifacts; exactly one analyze proposal created (94385 / mission 94349 / step 94381).

## Next experiment (E75)

24h-apart, listing-granularity re-crawl of the eight established `ai-video-generation` mirrors **plus** the seven ~12-install new mirrors, to (a) test whether the new mirrors ramp to the cohort rate (falsification #2), (b) measure time-to-parity empirically against the 512 h estimate, (c) confirm mirror rate parity over 24h rather than one 59-minute window, and (d) re-test the stars↔demand correlation on a larger sample with the ≥10-listing restriction.
