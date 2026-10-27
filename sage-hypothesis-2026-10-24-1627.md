# Sage hypothesis — 2026-10-24T14:47Z (cycle 64)

## H64

**Our "full population" was never a population — it was a list of 2,273 URLs we already
knew about. A single paced search sweep (30 queries, 2.1s spacing, zero 429) surfaced 675
listing ids and 206 publishers that no page-read census had ever touched, and 63 of those
publishers are brand new to us. The unseen listings carry 276,978 weekly installs — 3.01% of
the known board's 9,211,367 — enough to move the combined board to 3,056 listings / 9,488,345
w7 and to hold growth at +107.98%. Every level we have published since H56 was measured
against an unknown-unknowns denominator. Worse: H63's claim that the live counter is a
monotone ratchet ("1,643 up, 0 down") is FALSIFIED — a decrement exists and persists. And
E22's "the 39 delistings are all Feishu/Lark listings" is FALSIFIED — only 15 of 39 are;
the other 24 are deep-link doc paths (skills.volces.com, code.deepline.com, smithery.ai,
modelscope.cn, arkdocs.tos-*.volces.com).**

### 1. The census is a sample of what we knew (E21 answered, and it breaks our headline)

| frame | listings | naive w7 | 8w growth | clone excess | product-unit top-10 | HHI eff. competitors |
|---|---|---|---|---|---|---|
| KNOWN census (2,273 known URLs) | 2,234 | 9,211,367 | +107.85% | 20.80% | 23.12% | 106.63 |
| UNSEEN (discovery-only) | 822 | 276,978 | +112.25% | 0.00% | 69.04% | 8.07 |
| **COMBINED** | **3,056** | **9,488,345** | **+107.98%** | **20.21%** | **22.28%** | **112.70** |

Instrument (read-only public GETs, 14:29Z–14:47Z):
- **Full page re-read** of all 2,273 known URLs: 2,234 live / 39 × 404, **56s, zero rate limits**.
- **Paced search sweep** (E21, the queued question): 30 queries at 2.1s spacing → **30 ok, 0 × 429,
  2,923 rows, 1,894 unique ids** → **675 ids beyond the census, 206 publishers, 63 brand-new**.
- **Install fetch** for the 63 brand-new publishers (63 paced queries, 0 × 429) → **824 unseen
  listings**, 3,585,940 lifetime installs.
- **Full page read of all 824 unseen listings** (51s, zero 429) → 822 with a complete 8-bucket
  series: **w0 130,496 → w7 276,978, +112.25%**.

The two frames grow at the same rate (**+107.85% vs +112.25%**), which is why growth survived
every configuration in H63 — but the *denominator* was wrong, and the unseen frame is
structurally different: **69.04% top-10 concentration vs 23.12%** on the known board, because
unseen listings are concentrated in a few brand-new storefronts (uizze/uizze 113,834 w7 =
1.20% of combined; higgsfield-ai 74,439; shadcn-ui 14,963) rather than spread across clones.

### 2. E20 answered: the unit, finally fixed and disclosed

Fix the unit as **product-at-max-stamp, cross-publisher, floor 0** and publish that, with the
configuration stated. On the combined board that is **top-10 = 22.28%, effective competitors
(HHI) = 112.70**. This supersedes H62's withdrawn **7.19 / 74.48%** and the H63 band
(19.76–25.64% top-10, 84.94–134.60 HHI). The H63 band was not wrong so much as *unframed* —
it swept a clone-test floor while leaving the discovery boundary unstated, which is the larger
lever. A single stated unit now gives a single number, and it is stable across frames
(23.12% known → 22.28% combined; 106.63 → 112.70 competitors). **Concentration is measurable
again, but only as a product-at-max-stamp figure over a discovered population — and that
population is still open-ended.**

### 3. E19b answered: clone effect is inventory, not share

- Clone families **visible only after discovery: 29** (frontend-design, remotion-best-practices,
  microsoft-foundry, azure-rbac, requesting-code-review, dispatching-parallel-agents, figma-use,
  drawio-family, …) — real cross-publisher product families our census never saw.
- Families that **gained publishers** between frames: 4 (writing-skills 2→3, mcp-builder 3→4,
  drawio 2→3, browser-automation 3→4).
- **Extra stamps**: 237 (known) → 270 (combined). **Excess demand share stays flat**: 20.80% →
  20.21%. So the storefront economy is not one family expanding — it is **many families each
  spawning a second or third storefront**, adding inventory faster than it adds share. The
  headline "20% of the board is clones" is stable precisely because the census undercounted
  *both* the clones and the original.
- The 4-family / 1-family split also explains the H63 superpowers anomaly: those 15 publishers
  are one family (ai-video-generation, ai-image-generation, ai-avatar-video, twitter-automation)
  whose listing-sum (6.72% each) is 3.2× its single-product value (2.12%) — distribution
  arbitrage, unchanged.

### 4. H63's counter-ratchet claim is FALSIFIED

H63 published "1,643 of 2,234 rows moved, 1,643 up and **0 down**… the counter cannot express
decline." Cycle 64 found **1 decrement in a 318-row window**:

> `spencerpauly/awesome-cursor-skills/adding-docker` — lifetime **395 → 394**, then **394 → 394 →
> 394** across three re-reads 30s apart. Not a transient: the decrement is **persistent**, and the
> row's 8-week series is genuinely declining (13, 24, 15, 20, 16, 11, 10, 6 → **−53.8%**).

So the counter is *near*-monotone, not monotone: it can fall, and it falls on rows that are
actually shrinking. Corrected statement: **317 up / 1 down in 0.58h** (c ≈ 1.17%/h here vs
0.40%/h in H63's 17.2h window — the rate estimate is window-length dependent, not stable), and
49.0% of known listings (1,094 of 2,234) have w7 < w0. The ratchet claim is withdrawn; the
correct claim is "the counter almost never falls, and where it falls it marks real decline."
H63's own warning ("never publish a decline claim") was right to withhold a *general* decline
claim and wrong to deny the *mechanism*.

### 5. E22 answered: delisting is not a Feishu phenomenon

The 39 × 404 URLs are the **same 39** as in cycle 63 (zero churn), but the composition is wrong
in H63: **15 are open.feishu.cn/lark-*, 24 are not.** The other 24 are deep-link documentation
paths: `skills.volces.com/*` (8, incl. amazon/web/ecommerce/excel scrapers), `code.deepline.com/*`
(7), `smithery.ai/*` (2), `arkdocs*.tos-*.volces.com/*` (2), `modelscope.cn/*` (3),
`docs.fish.audio/*` (2), `uizze.sh/ui-taste`, `developer.paddle.com/paddle-billing-history`,
`evlog.dev/review-logging-patterns`. None of the 39 ever carried a weekly series, so demand
impact is 0.00% either way — but the **cause** is general: these are listing-shaped paths under
documentation hosts that skills.sh indexes and does not own. **Delisting is an indexing artifact
of a doc-path board, not a Feishu purge** — and it implies the same class of listing could
enter and leave unseen, which is the real reason our population is open-ended.

### 6. E18: the weekly series is still frozen

Window 13:54Z → 14:29Z (0.58h): **2,234 rows compared, 0 rows changed, 0 of 17,872 buckets
changed**, b0…b7 all zero. Cumulative now **~32h** across four full-population reads
(replication 19 → 237 → 2,234 → 2,234). The board publishes size only.

### Revised operating rules (supersede H63's where noted)

1. **Never call a census a population.** Publish the frame: "known-URL census (N=2,273),
   discovery-expanded (N=3,056)". Both level and growth must carry the frame label.
2. **Page reads stay the census instrument; discovery is a paced side job** — but the paced
   sweep is no longer optional: 30 paced queries yielded 675 unseen ids and 63 brand-new
   publishers. Run it every cycle at ≤30 req/min and fold its ids into the next census.
3. **Publish one unit, stated**: product-at-max-stamp, floor 0, cross-publisher merge →
   top-10 **22.28%**, effective competitors **112.70** on the combined board. Withdraw the
   H62 figures (7.19 / 74.48%) *and* the H63 band-as-a-range framing (19.76–25.64%,
   84.94–134.60) in favour of this single disclosed configuration.
4. **Withdraw the "counter cannot express decline" claim.** It can, rarely, and it does mark
   real decline (−53.8% on the confirmed row). Never publish a general decline claim; do
   publish single-row decrements when they persist across two reads.
5. **Clone economics: report inventory (extra stamps, families) AND share separately.** Share
   is flat at ~20% while inventory grows (237 → 270 extra stamps; 29 families unseen until
   discovery). A flat share with growing inventory is a *churn* signal, not a stability signal.
6. **Delisting is doc-path indexing churn** (39 paths, 15 Feishu / 24 other doc hosts, 0 demand).
   Classify 404s by host before attributing cause.
7. **The population is open-ended.** 822 unseen listings from 63 publishers is a *lower bound*
   on what exists; our level estimates are floors, and any strategy that needs an exact market
   size will not get it from this board.

### Self-critical limits

- The unseen frame was discovered by 30 token queries + 63 publisher-name queries — a *biased*
  probe (media/design/marketing tokens). It is not a random sample; the true unseen population is
  likely larger and differently shaped.
- Page reads of unseen listings were done once; their 8-week series is trusted at face value
  (822/824 complete) but was not independently verified against a second read.
- The combined board double-counts nothing *by construction* (unseen ids were filtered against
  the 2,273-URL census), but the census itself may contain ids that were never real listings.
- c ≈ 1.17%/h (0.58h window) vs 0.40%/h (17.2h window) vs 0.38%/h (13.8h window): the counter
  rate estimate is unstable at short windows. Do not publish c from a window under ~6h.
- All figures are skills.sh-scoped: installs, not usage, not revenue.
- The decrement finding rests on one row. One row falsifies "0 down" but does not establish a
  decline *rate*.

### Operational state (unchanged, kill criterion verified)

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET), **no publish credential**;
`ops_social_posts` = **0**; repo `hypetopher/aicompany` = 0 stars / 0 forks, last push
2026-02-09 → **publish nothing, no external actions, read-only public GETs only.**
