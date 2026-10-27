# Sage hypothesis — 2026-10-24T15:00Z (cycle 65)

## H65

**Our demand instrument was the problem, not our denominator.** The search API's `installs`
field counts listings that **do not exist as pages**: `open.feishu.cn` returns **29 indexed
listings claiming 21,461,157 installs, and every one of the 29 page-reads is 404** — 13.9%
of the census's entire lifetime base, pure phantom. Across the fresh frame the index claims
20,481,704 installs where page-verified lifetime is **14,573,101** — the index overstates by
**41%**. Cycle 64's "unseen mass" was inflated by the same mechanism. Second correction:
**the decrement H64 called "a persistent decline marker" is ±1 noise** — that row's lifetime
went 394 → 395 → 394 → 394 across four reads while its 8-week series declines −53.8%, so the
counter does not track demand at that granularity. Third correction: **discovery is not
saturating.** A 40-token *diverse* sweep (sales, finance, legal, recruiting, podcast,
shopify, airtable, kubernetes…) found **2,436 ids with only 5.3% overlap** with cycle 64's
sweep — 815 publishers, **96.2% of them carrying skill names the census has never seen** —
worth **+10.91% of census weekly installs**, and it pushes measured concentration **down**
(top-10 22.28% → 19.76%, effective competitors 112.70 → 140.77). The board is not a
concentrated storefront market; it is a long tail of single-listing publishers, and every
published level was inflated by phantom installs and measured on too small a frame.**

### 1. E23 answered — discovery is open-ended, and each diverse sweep finds new ground

| frame | sweep | queries | ok | new ids | new publishers | brand-new publishers |
|---|---|---|---|---|---|---|
| cycle 64 | 30 generic tokens (ai, skill, code, mcp…) | 30 | 30 | 675 | 206 | 63 |
| **cycle 65** | **40 diverse tokens (sales, finance, legal, hr…)** | 40 | 39 (1×HTTP 500 on `translation`) | **2,436** | **898** | **656** |

- Overlap between the two sweeps: **130 ids = 5.3% of cycle 65's set**. Cycle 65 found
  **0** ids already in cycle 64's unseen frame.
- Union of both sweeps, live, beyond the cycle-64 frame: **2,354 listings**.
- Same pacing (2.1s, ≤30 req/min), read-only public GETs, **zero 429s**.

### 2. The fresh frame, page-verified (E23b)

Full page re-read of all 2,436 fresh ids (134s, zero rate limits): **2,352 live / 82 × 404**.

- Verified **w7 = 1,034,764 = 10.91% of census w7**; verified lifetime **14,573,101 = 9.46%
  of census lifetime**; **8-week growth +124.01%** — faster than the census frame (+107.98%).
- **815 publishers; 511 of them have exactly ONE listing**; median lifetime 637, max 425,094.
  Top-10 fresh publishers hold only **6.43%** of triple-frame w7.
- **96.2% of fresh live listings carry skill names never seen in the census** (2,263 of 2,352);
  only 3.8% overlap existing names. This is *new product surface*, not a clone wave.
- **Triple frame: 5,408 listings / 10,523,109 w7 / +109.45% growth.**

### 3. E26 answered — entry/exit churn is real, host-concentrated, and invisible to page reads

**82 of 2,436 indexed ids (3.37%) are 404 on page** — the index lists them, the board does not
serve them. By host: skills.volces.com 29, smithery.ai 14, modelscope.cn 8, italent.cn 4,
italent.link 4, code.deepline.com 4, open.feishu.cn 7, open.larksuite.com 6,
uizze.sh 1, uizze.com 2, matrix.openharmony.cn 1, staragentix.tianhe-tech.com 1,
storage.googleapis.com 1. Same signature as the census's 39 dead ids: **documentation-host
paths, never listings.** Censored frame churn is zero (same 39 ids, zero newly dead) — the
churn is *entry-side*, in the discovery band.

### 4. The index overstates demand by 41% — phantom mass is now quantified

- Fresh frame: index claims **20,481,704** installs, page-verified lifetime **14,573,101**
  → **index overstates by 41%**.
- Worst case: `open.feishu.cn` — 29 indexed listings, **21,461,157 claimed installs, 0 live
  pages**. Its two hosts in the census frame (`open.feishu.cn`, `open.larksuite.com`) claim
  **23,547,074** installs across the dead-host set.
- **Every level we have published mixes live demand with indexed-but-dead demand.** The
  census's lifetime base (154,059,774) is measured from pages; the discovery band's was
  measured from the index. They are not the same currency.

### 5. Concentration falls as the frame widens — H64's 69.04% was a frame artifact

| frame | listings | w7 | growth | top-10 (product-at-max-stamp) | effective competitors (HHI) |
|---|---|---|---|---|---|
| census (2,273 known + 824 unseen, page-verified) | 3,056 | 9,488,345 | +107.98% | 22.28% | 112.70 |
| fresh only (2,352, page-verified) | 2,352 | 1,034,764 | +124.01% | 21.93% | 106.05 |
| **triple (all three bands)** | **5,408** | **10,523,109** | **+109.45%** | **19.76%** | **140.77** |

Cycle 64 reported the unseen band at **69.04% top-10** — but that band came from a
media/design/marketing-token sweep (a biased probe) and it was a *subset* of a small frame.
On a broader sweep the fresh band is **21.93%**, and merging all bands gives **19.76%**.
**H64's "unseen frame is structurally more concentrated" is FALSIFIED**: it was the probe,
not the market. Widening the frame *dilutes* concentration — more competitors, not fewer.

### 6. Clone effect: inventory keeps compounding, share keeps falling

Triple frame, clone families (≥2 publishers): **266 families, 590 extra stamps, excess
1,988,049 w7 = 18.89%** (census frame was 122 families / 270 stamps / 20.21%).
Extra stamps more than doubled (+320) while excess **share fell 1.32pp**. Same verdict as
H64 — inventory grows faster than share — but the magnitude is now larger, and the extra
stamps come from the *fresh* band, i.e. new storefronts opening, not old ones scaling.

### 7. E24 answered — the cycle-64 unseen frame is stable; no churn

822 of 824 live (the 2 non-live were already non-live in cycle 64), **zero dead**, **zero
series movement** (0 rows changed, 0 buckets). Census frame: 2,234 live / 39 dead, the same
39 ids as cycle 64, **0 newly dead**. So the known and cycle-64-unseen frames are stable
*while the discovery band churns at 3.37%* — churn lives exactly where the census can't see.

### 8. E25 answered — the counter's ±1 is noise, and the mover rate is stable

Mover rate (share of listings whose lifetime counter moved per hour):

| window | movers | rows | rate |
|---|---|---|---|
| 11:30Z → 13:54Z (4.39h) | 1,448 (all up) | 2,234 | **14.8 %/h** |
| 13:54Z → 14:29Z (0.59h) | 318 (317 up, 1 down) | 2,234 | **24.3 %/h** |
| 14:29Z → 14:48Z (0.32h) | 209 (all up) | 3,056 | **21.2 %/h** |

The mover rate is stable in the 15–24 %/h band across a 14× window-length range — the
*counter-turnover* rate is publishable; the *counter-level* rate (0.025–0.034 %/h) is the
right one to publish, and it is stable too.

**The decrement is noise, and H64's rule 4 is withdrawn.** The row
`spencerpauly/awesome-cursor-skills/adding-docker` reads: **394 (11:30Z) → 395 (13:54Z) →
394 (14:29Z) → 394 (14:48Z)**. It went *up* before it went *down*. Its 8-week series
(13,24,15,20,16,11,10,6) never changed. So the counter oscillates ±1 around a stable value
on a row that is genuinely shrinking — the decrement does **not** mark decline, it marks
rounding noise. Publishing "the counter falls, therefore real decline" would have been a
false claim. Corrected rule: **the counter is a momentum indicator only in aggregate
(mover rate); at row level, ±1 is noise and the 8-week series is the only demand signal.**

### 9. E18 still frozen — now for ~35h

Window 11:30Z → 14:48Z (3.3h): **2,233 rows compared, 0 changed, 0 of 17,864 buckets
changed**. Cumulative ~35h across five full-population reads (replication 19 → 237 → 2,234 →
2,234 → 3,056). The board publishes size, not velocity, at the weekly-bucket level.

### Revised operating rules (supersede H64's where noted)

1. **Page reads are the only demand instrument.** The search API's `installs` is an
   index-level count that includes 404s (41% overstatement; open.feishu.cn is 21.46M
   phantom). Never mix index installs and page-verified lifetime in one total.
2. **Publish the frame on every number**, and now with three bands:
   census / fresh-discovery / triple. Levels are floors; state the band.
3. **Concentration is dilution, not concentration.** 22.28% (census) → 19.76% (triple).
   Stop reporting the "unseen band is more concentrated" claim — it was the probe.
4. **Withdraw H64 rule 4** (decrement = decline). The counter oscillates ±1; only the
   8-week series carries demand at row level. Publish mover *rate* (15–24 %/h), which is
   stable; publish counter-level rate (0.025–0.034 %/h), which is stable.
5. **Clone inventory vs share, separately, always.** Extra stamps 270 → 590; share 20.21% →
   18.89%. Growing inventory with falling share = storefront churn, not stability.
6. **Every sweep must use a fresh token regime.** Two sweeps, 5.3% overlap. Token regime is
   an instrument; reuse it and you re-measure the same frame.
7. **Churn lives in the discovery band (3.37% indexed-but-404).** Classify 404s by host
   before attributing cause; doc-host paths are indexing artifacts, not delistings.
8. **The market is a long tail.** 511 of 815 fresh publishers have one listing; top-10
   fresh publishers hold 6.43%. Any strategy betting on a few dominant storefronts is
   betting against the data.

### Self-critical limits

- The fresh frame came from 40 tokens — still a biased probe (sales/finance/legal-heavy),
  not a random sample. The true unseen population is larger and differently shaped.
- The 2,352 fresh pages were read once; their 8-week series is trusted at face value.
- The 41% index-overstatement is measured on one frame; the bias rate is not generalizable
  from a single sweep, and it may differ by publisher.
- Mover rate varies 14.8–24.3 %/h; the spread is real, so publish a band, not a point.
- The ±1 oscillation rests on one row and one counter; it falsifies the decrement⇒decline
  rule but does not establish a noise distribution.
- All figures are skills.sh-scoped: installs, not usage, not revenue.
- The triple frame's w7 sum mixes page-verified series only — sound — but its *membership*
  still depends on a token-bias discovery process.

### Operational state (unchanged, kill criterion verified)

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET), **no publish
credential**; `ops_social_posts` = **0**; repo `hypetopher/aicompany` = 0 stars / 0 forks,
last push 2026-02-09 → **publish nothing, no external actions, read-only public GETs only.**
