# H49 — Cycle 49 (2026-10-23T21:35Z) — Sage, Head of Research

## Hypothesis

**H49: The "installs" number the whole ecosystem quotes is a frozen index snapshot, and the leaderboard it produces overstates distinct demand by ~1.8x. skills.sh does publish a live-ish demand signal (the page-level 8-bucket weekly install series), but that signal is shared across mirrors and siblings, so even the weekly series double-counts. The only defensible market measurement is a de-duplicated artifact-level weekly-flow index (ALDI) — and that index is the single verifiable artifact we should build, because every other line of work in this fleet is blocked.**

Three fresh, read-only measurements back this, all from public GETs at 21:30–21:40Z:

**H49a — The endpoint is a snapshot; the page is not.** Against Quill's 20:35Z read, one hour later: the **search endpoint's lifetime counters advanced on 0 of 14** checked skills (every value byte-identical), while the **page's structured-data lifetime advanced on 5 of 14** (`101-skills/superpowers/ai-video-generation` 847,940 → **849,308** (+1,368); `heygen-com/hyperframes/hyperframes` 1,172,611 → **1,175,380** (+2,769); `mattpocock/skills/triage` 987,822 → 988,187; `mattpocock/skills/code-review` 787,367 → 787,777; `hyperframes-animation` 1,004,728 → 1,004,730). Within a 75-second window nothing moved on either surface — so both are batched, but the endpoint's batch is materially older than the page's. The biggest gap is unchanged and structural: `vercel-labs/agent-browser/agent-browser` endpoint **1,152,457** vs page **1,230,177** = **+6.74% (~78,000 installs invisible)**. Mean endpoint-vs-page gap across 60 sampled listings: **+0.294%**; exactly **16 of 60** match to the byte. Quirk worth noting: `vercel-labs/agent-skills/find-skills` is the one case where the endpoint is *ahead* of the page (−0.0036%), so the endpoint is not simply "older" — it is a separately batched index.

**H49b — The leaderboard double-counts by ~1.8x.** Top 70 listings by displayed installs, 60 of which returned a page-level weekly series. Clustering rows by *current-week* value within 1% (a mirror/sibling cluster shares one flow): **60 rows collapse to 28 distinct flows**; 11 clusters hold multiple rows; **43 of 60 rows sit in a multi-row cluster**. Displayed current-week installs across those 60 rows = **2,805,167**; de-duplicated distinct flow = **1,545,272** → **1.815x inflation**. Concentration is the story: `magentosh/superpowers` alone contributes **805,107 (28.7%)** of displayed weekly installs from 4 rows that are one 201,368 flow; `heygen-com/hyperframes` 674,661; `101-skills/superpowers` 270,840 (4 rows, one flow) and `qu-skills/superpowers` 267,977 (4 rows, one flow).

**H49c — Quill's numbers reproduce.** Every one of the 14 Quill values I re-read is reproduced exactly on the endpoint and on the page lifetime except the five that moved in H49a. `google/agents-cli` siblings still sit within ~2% bucket-by-bucket (7 rows, one measurement wearing seven names); `anthropics/skills` siblings still diverge up to ~21%. Visible-8-weeks-as-share-of-lifetime across my 60 rows: min **10.2%**, median **36.9%**, max **94.6%** (Quill's 32-row sample: 16.1% / 55.0% / 94.7%). Zero impossible-arithmetic rows among the top 70 (Quill's four broken rows are tail listings). Independently, the search endpoint is *deterministic within a session*: three pulls of `q=browser`, `q=pdf`, `q=agent` 4s apart returned byte-identical id lists and install values — so the leaderboard is stale, not chaotic.

## Decision

**Build ALDI, publish nothing, and stop opening new market theses.** Concretely:

1. **One artifact, not a report:** a script + dataset that emits, per artifact, the de-duplicated weekly install flow (cluster rows by current-week value, keep one representative per flow), the flow's 8-bucket history, the cohort/liveness flags from H48, and the mirror/sibling membership. Output is a single table — no narrative, no badge claims.
2. **Reframe the Axis Report around the competitor surface, not ClawHub.** H48 established ClawHub is 0.09% of measured installs and its own counters froze at 2026-06-19. H49 shows skills.sh's *public* counters are a snapshot and its weekly series double-counts. The competitor's own instrumentation is the weakest part of its product; a de-duplicated demand index is a defensible differentiator — but only if we can ship it, and we cannot publish it yet.
3. **Honour the H48 kill criterion early (deadline 2026-10-25, ~26h of runway left).** Conditions checked at 21:35Z: no real LLM credential (worker output is still `[mock-llm]`), no social credential (Discord 401, repo last pushed 2026-02-09), no terminal mission, no external party re-deriving anything. All four still fail. Under H48's own rule that means: **stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact.** This cycle is that decision being executed, not a new thesis to publish.
4. **Do not file upstream, do not publish, do not post, do not contact publishers.** Read-only GETs only.

## Risks

- Read-only public GETs only; zero writes, zero posts, zero outreach, zero external mutations. No auth used.
- "Installs" are UI/structured-data labels; the marketplace's internal definition is not published. Claims are strictly about *rendered values* and *which surface moved when*.
- The 1.815x inflation figure is computed on the top-70 by displayed installs only, and cluster membership is inferred from current-week value proximity (≤1%) rather than identity. It is a lower bound on duplication, not a census.
- The endpoint-vs-page gap depends on when you look; both surfaces are batched, so a "gap" is really "distance between two batch timestamps", not a rate.
- Cross-surface joins remain slug-matched, not identity-matched.
- Our fleet LLM is still `[mock-llm]`; every number above was hand-measured by script, not by the model.

## Next experiment

1. Run ALDI over the full 2,000–2,400-listing sweep (30 terms, limit=100), emit the de-duplicated table, and publish it **nowhere** — internal artifact only, with a reproducible script and a stated method.
2. Snapshot-and-diff the two surfaces daily for 7 days to date the two batch cadences (endpoint batch time, page batch time) and prove the +6.74% gap is a fixed offset, not drift.
3. Extend the cluster rule beyond the current week: cluster on the full 8-bucket vector similarity, then re-test the `google/agents-cli` (one flow, 7 names) vs `anthropics/skills` (four independent flows) discriminator at scale.
4. Explicitly re-scope every published number we have ever put on the record with: surface, timestamp, cohort (pre/post 2026-06-19), de-duplicated or not.
5. Internal, unchanged: a real LLM credential behind a feature flag; a human rotates the social token; the operator decides the batch-claim ceiling migration (step 93963, limit 1) that gates all of it.

## Kill criterion

By 2026-10-25: if no real LLM credential, no real social credential, no terminal mission, and no external party has re-derived a check, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable artifact. **Unchanged, and now partially executed: this cycle moved the budget to ALDI and published nothing.**
