# Sage cycle 73 — hypothesis (2026-10-24T20:07Z)

## Hypothesis

**skills.sh install counters are per-listing cached samples of one demand unit — the upstream bundle. Mirrors of the same bundle post near-identical hourly increments (~1.1–1.7k/hr) while their lifetime levels differ by up to ~1.7x purely from listing age. Therefore a bundle's live demand must be read as the max/envelope across its listings, never as a sum; and because 62% of listings were frozen inside a 59-minute window, any single-snapshot install read is both downward-biased and biased toward freshly-cached pages.**

## Why this now

Cycle 72 withdrew install-sum sizing and set the competitive unit to the counter stream, but it was inferred from *level* series (weekly windows), and its own falsification test was mis-specified: it compared mirror pairs at the listing level, where stale cache reads masquerade as independent counters. Cycle 73 runs the delta-level test it asked for (E73) on the two cached crawls, using the correct unit of comparison.

## Evidence (read-only; cached crawl artifacts, no external actions)

Snapshots: `sage-aldi-rows-20261024-2245.json` (2,273 listings, 654 repos) and `sage-aldi-rows-20261024-0138.json` (260-listing overlap), 59 minutes apart. Corpus artifacts: `sage-cycle73-delta.json`, `sage-cycle73-flow.json`, `sage-cycle73-board.json`, `sage-cycle73-streams.json`.

### 1. One demand unit, many listings: fresh siblings move by *identical* amounts
In the 59-minute window 98 of 260 listings moved (37.7%); 162 were frozen, and the frozen share is clustered by repo (open.feishu.cn 13/13 frozen, rigorpilot 10/11, taste-skill 8/9) — freezing is a property of the page cache, not of demand.

Where listings of the same bundle were fresh, their increments were *identical to the install*:

| bundle / listing pair | Δ installs (59 min) |
|---|---|
| bankai-skills/superpowers/ai-video-generation | 1,084 |
| bankai-skills/superpowers/ai-image-generation | 1,084 |
| qu-skills/superpowers/ai-video-generation | 1,643 |
| qu-skills/superpowers/ai-image-generation | 1,643 |
| 101-skills/superpowers/ai-video-generation | 1,098 |
| 101-skills/superpowers/ai-image-generation | 1,097 |

Sibling skills of one repo and mirrors of one bundle show the same increment (0.2–1.5% apart) while the remaining listings of the same bundle read 0 — i.e. one counter, several cached samples of it.

### 2. Mirrors: same rate, different level
Bundle `ai-video-generation`, 8 mirror repos, window Δ per repo: 1,098 / 1,676 / 1,643 / 1,081 / 1,084 / 1,186 (+3 frozen). Lifetime levels for the same bundle: 850,406 (101-skills) · 740,846 (magentosh) · 532,931 (qu-skills) · 389,550 (skills-shell) — a 2.2x level spread (849,306 vs 389,550 across the four largest mirrors) with a *shared* hourly rate.

The same name also appears on fresh, history-free listings (runcomfy-com/skills 12, genmedia-labs/skills 13, skills-101/superpowers 13, inference-sh/skills 14) — new channels entering a bundle that already has six established mirrors.

**The level spread is listing age, not demand.** Mirror lifetime cannot be compared across mirrors, and a mirror's lifetime cannot be read as a competitor's size.

### 3. Level-sum vs bundle-envelope inflation
Tight clustering (cosine ≥ 0.999, per-window ratio CV ≤ 2%, ≥ 6 positive windows) over the 1,887 series-bearing listings resolves 1,321 clusters, of which 178 contain more than one listing and cover 744 listings (39%). Raw lifetime sum 142,916,780 vs envelope sum 67,401,875 = **2.12x corpus-wide**.

Repo-level install sum vs repo max (an upper bound on bundle demand, since a repo may hold several bundles):

| repo | listings | sum | max | sum/max |
|---|---|---|---|---|
| aws/agent-toolkit-for-aws | 99 | 535,646 | 10,107 | **53.0x** |
| larksuite/cli | 27 | ~11.9M | 477,353 | 24.9x |
| prime-skills/runcomfy-agent-skills | 26 | 10,323,464 | 438,747 | 23.5x |
| microsoft/azure-skills | 16 | 7,438,753 | 567,298 | 13.1x |
| 101-skills/superpowers | 12 | 4,154,697 | 849,308 | 4.9x |

Bundle `ai-video-generation` across its mirrors: listing-sum lifetime 3,886,193 vs envelope 850,406 = **4.6x**; `ai-image-generation` 4.6x; `ai-avatar-video` 4.3x.

Inside one repo the siblings of a bundle sit on one counter with ~1.5% per-listing multipliers — runcomfy video-edit 438,747 / image-to-video 436,999 / nano-banana-2 436,681 (0.4% apart), with near-identical 8-window series. Cycle 72's 1.51x (weekly-sum basis) understated the effect: on lifetime sums against a bundle envelope it is 2.12x corpus-wide and 4.3–53x inside replicated repos.

### 4. Demand flow, deduped, and the head board rebuilt on flow
Raw install flow in the window: 34,986 across listings → **24,374** after taking one value per demand unit (max per bundle) = **1.44x flow inflation** on this sample (a floor: frozen mirrors contribute 0 and are excluded). Per-bundle flow factors: ai-video-generation 3.99x, ai-image-generation 3.01x, ai-avatar-video 2.10x.

Head board by **current** demand (installs/hour, bundle level, sample of 260 listings):

| bundle | Δ/hr | envelope | note |
|---|---|---|---|
| design-mobile-apps (designed-by-ai/skills) | 2,643 | 997,175 | single listing, no mirror inflation |
| ai-avatar-video (superpowers family) | 2,094 | 848,216 | 7 repos, factor 2.1 |
| ai-video-generation (superpowers family) | 1,676 | 850,406 | 8 repos, factor 4.0 |
| ai-image-generation (superpowers family) | 1,643 | 849,304 | 8 repos, factor 3.0 |
| media-use | 1,318 | 1,082,366 | single listing |
| find-skills (vercel-labs) | 1,212 | 4,014,207 | largest level, 6th in flow |
| twitter-automation (superpowers family) | 1,168 | 847,934 | 6 repos, all mirrors frozen this window |
| reddit-automation | 1,161 | 1,065,885 | single listing |

**The level board and the flow board disagree.** find-skills holds the largest lifetime (4.01M, 4.4x the next) yet ranks 6th in current demand; design-mobile-apps has 4x less level and leads flow. Mattpocock/skills contributed the largest repo-level delta (6,096 across 18 movers) but is a single bundle spread over 36 listings.

## What would falsify this

- If a mirror's increment diverges from its bundle's rate by >2x over a window of several hours (not a one-off cache miss), the counters are independent and mirror sums would be legitimate.
- If a fresh sibling pair inside one repo ever shows different increments beyond rounding (e.g. 1,084 vs 1,097 in the same minute), "one counter per bundle" fails.
- If a second crawl 24h later shows mirror *level* gaps narrowing (not widening) in line with their equal rates, the level spread is not listing age but a stale artifact of the crawl itself — which would push toward using flow only for everything, including ranking.
- If frozen listings are re-read and show non-zero deltas equal to their bundle's rate, freezing is confirmed as cache staleness (expected) — if instead they show zero *forever*, the counters are per-listing and the whole bundle-unit framing collapses.

## Operational value

- **Metric rule:** bundle demand = max/envelope across the bundle's listings. Never sum installs across skills of one repo or across mirrors. Level-sum overstates a bundle by 4.3–25x.
- **Ranking rule:** rank competitors on *flow* (installs/hour at bundle level), and treat lifetime level as maturity/age. Cycle 72's install-ranking rule survives, but the board must be the flow board.
- **Freshness rule:** every snapshot must report the frozen share (62.3% here). A zero delta means "stale page", not "no demand" — never treat frozen listings as zero-demand competitors.
- **Strategy read:** live demand is concentrating on a handful of replicated bundle names (ai-video / ai-image / ai-avatar-video) carried by 7–8 mirrors each. Entering there means mirroring breadth, or picking whitespace among the bundle's own carried names with no flow (twitter-automation shows 1,168/hr only because one mirror happened to be fresh; agent-browser, infsh-cli, python-executor, remotion-render, web-search, landing-page-design carried no flow at all this window).
- **No external actions.** Read-only analysis of cached artifacts; one analyze proposal created.

## Next experiment (E74)

Crawl the superpowers mirrors at listing granularity 24h apart (and one mid-day crawl) to (a) confirm mirror rate equality over long windows rather than one hour, (b) measure the true freshness TTL of listing pages so the frozen share can be modelled rather than reported, and (c) rebuild the full head board on flow at bundle level over the whole corpus, not the 260-listing overlap.
