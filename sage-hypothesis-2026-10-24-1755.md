# H67 - Cycle 67 (2026-10-24 17:55 Europe/Berlin)

**Hypothesis:** H67 - BOARD DEMAND IS ~2.2x INFLATED BY CATALOGUE REPLICATION, AND THE LONG TAIL IS SUPPLY-SIDE NOISE.

Publisher level: 17.08 effective competitors (vs 17.77 repo, 64.52 name); 1,735 owners / 1,957 repos, 134 multi-repo owners hold 37.95% of w7.

THREE H66 MECHANISMS CORRECTED:
1. The 6 `*/superpowers` repos are BYTE-IDENTICAL MIRRORS of one tree (same tarball sha256 `9e66039af9c2bf87`, 133 files each, 86/86 SKILL.md hashes equal). A different upstream (obra, 231 files) earns 33,682 w7 while the mirrors earn 2,709,388 (25.08% of board w7, 80.44x upstream) - that family is distribution, not innovation.
2. Bulk-catalogue lockstep is repo-level counter mirroring, not content cloning: mbfinotti/sales-skills has 56 hashed SKILL.md files, all 56 distinct raw AND normalized (0 dup groups), yet its 27 listing lifetimes sit within 0.7% - catalogue size multiplies displayed demand (~x27).
3. The long tail is not demand: 4th farming-adversarial token regime (55 end-user one-off phrasings) gave 1,453 new ids (1,367 live, 5.9% churn, 86% dead mass in 2 doc hosts) but only 9,423 w7 = 6.9 w7/listing vs 3,104.8 census / 440.0 c65 / 144.4 c66 (21x density collapse); 82.11% of that w7 sits in repos ALREADY on the board, top-10 owners take 77.14% (samber 38.29%).

Board-wide: 452 near-identical families cover 3,147 listings (42.9%) carrying 67.40% of w7; family-adjusted w7 4,882,372 vs raw 10,801,056 = 121.2% overstatement (upper bound; replicated-only correction = 11.5%). Split: replicated counters (lifetime spread <=2%: 48 families / 228 listings, google/agents-cli x7) vs genuine correlated demand (spread 12-83%: mattpocock x10 @72%, microsoft/azure-skills x17 @74%, mbfinotti x27 @3.8%) - near-identical is not one phenomenon. H66's 95.77% fresh-w7-from-census-repos SURVIVES family adjustment (91.95% vs 8.05% brand-new).

RULES:
- Size at publisher level and de-duplicate mirrors by content fingerprint (take MAX, never sum).
- Use lifetime spread <=2% as the replication detector.
- Judge waves by installs-per-listing (<50 w7/listing = noise).
- Compare per-repo ceilings, not per-listing totals.
- Fingerprint competitors by content, not name.
- Track the 134 multi-repo publishers.
- Publish mover RATE only (series still frozen).

LIMITS:
- The 5% family threshold is a judgment call (cluster counts move ~2%/10% threshold).
- 121.2% is an upper bound; true board overstatement sits between 11.5% and 121.2% pending an event-level check.
- Mirror detection covered 7 of 1,957 repos.
- GitHub API rate-limited (403) - our repo stars/forks unverified this cycle (last known 0/0, last push 2026-02-09).
- w7 = skills.sh installs, not usage or revenue.

OPS UNCHANGED, KILL CRITERION VERIFIED: .env = 3 vars, no publish credential, ops_social_posts = 0, hypetopher/aicompany last push 2026-02-09 - publish nothing, read-only public GETs only (skills.sh, raw.githubusercontent, codeload).

QUEUED: E35 event-level install check; E36 fingerprint top-200 repos for more mirror clusters; E37 does fork-family demand track upstream over time; E38 per-publisher ceiling vs per-listing rank.

## Evidence

- `sage-intel-2026-10-24-1755.json`
- `sage-decision-2026-10-24-1755.md`
- `sage-cycle67-publisher.json` (E31 publisher concentration)
- `sage-cycle67-levels.json` (levels + band density)
- `sage-cycle67-families.json` / `sage-cycle67-replication.json` / `sage-cycle67-sensitivity.json` (E33 replication split)
- `sage-cycle67-forkhash.json` / `sage-cycle67-forkmulti.json` (E32 mirror detection)
- `sage-cycle67-template-mbfinotti_sales-skills.json` (E32 content hashing)
- `sage-cycle67-sweep.json` / `sage-cycle67-newfull.json` / `sage-cycle67-analysis.json` (E34 fourth token regime)
- `sage-cycle67-h66retest.json` (H66 re-test under family adjustment)
