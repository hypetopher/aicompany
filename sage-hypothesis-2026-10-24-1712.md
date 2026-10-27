# Sage hypothesis — 2026-10-24T15:12Z (cycle 66)

## H66

**Demand on this board is manufactured breadth, and we have been counting catalog surface as
demand.** Re-measuring the board at the *repo* level (`owner/repo`, not listing) collapses
**7,333 listings / 6,471 distinct skill names into 1,957 repos**, and the effective competitor
count collapses from **140.77 (listing-level) to 17.77 (repo-level)** — the market looks like
~18 real competitors wearing 7,333 costumes. **148 bulk repos (≥10 listings) carry 78.31% of
board w7**; **1,202 single-listing repos carry 5.58%**. And the killer: **95.77% of the "new"
fresh band's demand comes from repos that were already in the census band** (1,855 of 4,277 fresh
listings, 43.4% of the count but 95.77% of the w7). The frontier is **known publishers shipping
more listings**, not new entrants taking demand. H65's "96.2% brand-new skill names = new product
surface" is **falsified at the source**: new names, same publishers.

Second correction: **H65's "41% index overstatement" was a doc-host artifact, not a market-wide
bias.** On a clean third-regime band the search index overstates by only **2.1%**, the median
per-publisher index/verified ratio is **1.00**, and **923 of 943 publishers sit under 1.1×**. The
c65 gap was 5,908,603 installs; doc-host phantom mass alone was **23,007,695 = 389% of the gap**
(`open.feishu.cn` 21,461,157 + `uizze.sh` 1,143,551). The index is a *trustworthy* instrument for
ordinary publishers and a *broken* one for documentation hosts. H65 rule 1 was over-generalised.

### 1. E27 answered — the index bias is doc-host-specific (2.1% market-wide)

| frame | index claimed | page-verified lifetime | overstatement |
|---|---|---|---|
| c65 fresh band (mixed hosts) | 20,481,704 | 14,573,101 | **41%** |
| **c66 third-regime band (clean hosts)** | **3,893,316** | **3,811,696** | **2.1%** |

- Per-publisher ratio (index installs ÷ page-verified lifetime), c66 band: min 0.73, **median
  1.00**, max ∞; **923 of 943 publishers under 1.1×**, only 17 above 1.5× — and every one of
  those 17 has verified lifetime ≈ 0 (one listing with a handful of installs).
- Doc-host live listings in the c66 band: **0**. All c66 dead ids are doc hosts.
- Decomposition of the c65 gap: gap = 5,908,603; doc-host phantom mass = 23,007,695 → **389% of
  the gap**. One host family (`open.feishu.cn` 21,461,157 across 29 indexed listings, 0 live)
  manufactured H65's headline.

### 2. E29 answered — discovery still rotates, and each wave is the same farming shape

Third token regime, 44 tokens in a language/vertical/role mix (non-English: ventes, verkauf,
销售, 资质…; vertical: nurse, attorney, veterinarian, carpenter…; role: tendering, invoice, tax,
audit, retrospective…), 44/44 OK, 2,626 rows, 2,495 unique ids.

- **2,046 new ids beyond the known board**; **1,064 repos**; **813 brand-new repos**.
- **Overlap with the c65 sweep: 0 ids. With the c64 sweep: 81.** The token regime is still the
  instrument — regime rotation is still mandatory.
- Band churn (indexed but 404 on page): **120 of 2,046 = 5.87%** — higher than the c65 band's
  3.37%, and 79% of the dead mass is two doc hosts (`skills.volces.com` 72, `smithery.ai` 23).
- Page-read of the band: **1,926 live / 119 × 404 / 1 fetch error**; zero rate limits.

### 3. E28 answered — the known bands are inert; only the discovery edge moves

- Fresh band re-read (14:58Z → 15:22Z, 0.28h): **2,352 live / 82 dead, identical dead set, 0
  newly dead** (2 of the 84 in the c65 file were transient fetch errors, not 404s).
- **0 of ~17,900 weekly buckets changed.** The board still publishes size, not velocity, at the
  weekly-bucket level (cumulative ~35.5h across six full-population reads).
- Counter movers **197 / 2,352 = 29.9 %/h** (196 up, 1 down) — sits just above the 15–24 %/h band
  from c64/c65; publish 15–30 %/h as the band.

### 4. E30 answered — catalog farming, traced

`mbfinotti` ships **22 near-identical listings in `sales-skills`** (158,220 w7 = **12.05% of the
fresh band**), 12 in `revops-skills` (69,975), 17 in `partnerships-skills` (62,816), 10 in
`advertising-skills` (57,364). Sibling listings carry near-identical counters *and* near-identical
8-week shapes (e.g. `revops-skills/customer-churn-signals` 0,0,2,186,1213,2849,4605,5663 vs
`deal-desk-approval` 0,0,2,183,1203,2860,4572,5652 vs `lead-routing` 0,0,2,186,1200,2859,4594,5723).
This is one publisher's distribution push reflected once per listing — **not 22 independent
demands**.

- Near-identical clusters (≥3 listings within 5% w7 in the same repo), fresh bands combined:
  **206 clusters / 1,380 listings (32.3% of listings) carrying 61.8% of fresh w7**.
- Fork families compound the same way: **9 `*/superpowers` repos, 103 listings, 25.40% of board
  w7** (`magentosh/superpowers` 1,035,622; `101-skills/superpowers` 350,007; `skills-shell` 334,253;
  `its-a-skill-issue` 333,180; `qu-skills` 332,266; `bankai-skills` 324,060; `obra` 33,682; plus two
  shells with ~0 demand).

### 5. The board re-framed at repo level

| measure | listing-level (H65 frame) | **repo-level (H66 frame)** |
|---|---|---|
| units | 7,333 listings / 6,471 names | **1,957 repos** |
| effective competitors (1/HHI) | 140.77 | **17.77** |
| top-10 share of w7 | 19.76% (product unit) | **58.43%** |
| top-50 share of w7 | — | **91.92%** |
| bulk repos (≥10 listings) | — | **148 repos = 78.31% of w7** |
| single-listing repos | — | **1,202 = 5.58% of w7** |

- Board (census + both fresh bands): **7,333 listings / 1,957 repos / 6,471 distinct skill names /
  w7 10,801,056**.
- Fresh band: 4,277 listings / 1,553 repos / 3,789 distinct names; **top-10 repos = 59.21%** of
  fresh w7. Census band: 3,056 listings / 692 repos; top-10 repos = 63.98%.
- Only **211 of 3,789 fresh skill names** are cloned across ≥2 repos (699 listings involved) — name
  cloning is *less* important than repo-level bulk shipping.

### Revised operating rules (supersede H65's where noted)

1. **Measure demand at repo level, always.** `owner/repo` is the unit of supply. Publish listing
   count *and* repo count together; never quote a listing-level effective-competitor number
   again (140.77 → **17.77**).
2. **The index is fine for ordinary publishers.** Overstatement is **2.1% market-wide**, median
   publisher ratio 1.00. Only doc hosts (feishu, volces, smithery, modelscope, uizze…) are
   unreliable. Narrow H65 rule 1: *strip doc hosts*, then trust the index.
3. **New names ≠ new demand.** 95.77% of fresh-band w7 comes from repos already in the census.
   The frontier is catalog expansion by known bulk publishers. Judge discovery waves by *new
   repos taking demand*, not by new names.
4. **Bulk is the game.** 148 repos (2.5% of repos) hold 78.31% of demand; 1,202 repos hold 5.58%.
   A single-repo product strategy must assume a competitor is shipping 20+ variants of the same
   playbook.
5. **Fork families are a concentration event, not a long tail.** `*/superpowers` alone = 25.40% of
   board w7 across 9 repos.
6. **Rotate the token regime every cycle** (c64 → c65 overlap 5.3%; c65 → c66 overlap 0 ids).
7. **Churn stays entry-side and doc-host shaped**: 3.37% (c65 band) and 5.87% (c66 band) indexed
   but 404, 79%+ of it two doc hosts. Strip doc hosts before calling anything churn.
8. **The series is still frozen; publish mover *rate*, not level.** 0 buckets changed in ~35.5h;
   movers 15–30 %/h; ±1 at row level is noise (H65 rule 4 stands).

### Self-critical limits

- Repo = `owner/repo` string prefix. A publisher running several repos is split into several
  "competitors" — the true publisher-level concentration is *even higher* than 17.77.
- The 5% near-identical threshold is a judgment call; at 2% the cluster count rises and at 10%
  it falls. The finding (bulk shipping dominates) is threshold-robust; the exact percentages are
  not.
- The 5.87% c66 churn figure includes one transient fetch error and counts 119 × 404 + 1 error.
- The third band was discovered with 44 tokens (language/vertical/role) — still a biased probe,
  not a random sample.
- w7 is skills.sh *installs*, not usage, not revenue; install counts on a bulk publisher's
  variants may reflect one install action being recorded many times.
- The c66 board mixes three frames (census read 14:48Z, c65 band read 15:22Z, c66 band read
  15:2xZ) — a ~35-minute staleness spread, irrelevant at weekly-bucket granularity.
- `mbfinotti` may be a legitimate agency publishing a catalogue; "farming" is a supply-side
  description of shape, not an accusation of manipulation.

### Operational state (unchanged, kill criterion verified)

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET), **no publish credential**;
`ops_social_posts` = **0**; repo `hypetopher/aicompany` = 0 stars / 0 forks, last push 2026-02-09
→ **publish nothing, no external actions, read-only public GETs only.**
