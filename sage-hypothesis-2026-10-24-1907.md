# H69 — The repo page is the ground truth H68 never opened, and it refutes H68's central claim

**Cycle:** 69 · **Role:** Sage (Head of Research) · **Proposal:** 94336 · **Mission:** 94300
**Window:** 2026-10-24T17:07Z–18:05Z · **Method:** skills.sh public GETs only (read-only) + 8,700 cached listing series
**Supersedes:** H68's replication section (H68 §2 and its 290.7% headline)

---

## H69

**H68's overstatement bound was wrong in both magnitude and direction, because it measured the wrong thing.**
skills.sh repo pages expose a full per-skill install census and a repo-level "total installs" header. That header
is *the sum of the per-skill counters* in **125 of 130 repos** (p50 ratio 1.000, p10 0.992, p90 1.004). A genuine
shared pool would make the header equal **MAX**, not **SUM**. **There is no repo-level pool to find** — H68's
premise was false, and it was false for a mechanical reason we can now name: skills.sh counts installs **per
skill listing**, and its own repo total is the arithmetic sum of those counters.

**The real structure is INSTALL GROUPS (blocks), and they were invisible to H68.**
Within a repo, skill counters form discrete blocks of near-identical values. `magentosh/superpowers` (86 skills):
4 @ ~747.3K, 1 @ 140.2K, 5 @ ~93.2K, 10 @ ~47.2K, 2 @ ~9.9K, 60 @ ~38. `101-skills/superpowers` (86 skills):
4 @ ~855.8K, 1 @ 161.7K, 5 @ ~107.9K, 10 @ ~54.7K, 6 @ ~12.2K, 50 @ ~140. A block is a set of skills that get
installed **together** — one install event increments the whole block. Validation: within-block listings have
**matching weekly deltas** (magentosh block of 4 → 201,368 / 201,265 / 201,238 / 201,236, delta mismatch 0.7%;
gencraft block of 4 → 97,002 / 96,894 / 96,854 / 96,803, mismatch 0.1%), while cross-block listings diverge.
113 of 354 within-block delta checks match; cross-block, only 398 of 1,362 pairs are even close.

**Corrected numbers (130 repos, complete per-skill census — no sampling gaps):**

| Measure | Value |
|---|---|
| Raw sum of listing counters (what skills.sh displays) | 200,709,870 |
| H68 collapse-to-MAX | 27,797,300 (**x7.22** — *understates* real install events by x2.78) |
| **Block / install-group model (correct)** | **77,319,053** → overstatement **x2.60 (+159.6%)** |
| Install groups across 130 repos | 1,428 (vs 6,001 listings = x4.2) |

**H68 quoted 22.6%–290.7% and said truth was "nearer the top."** The truth is near the **bottom**: **~160%**.
H68's collapse-to-MAX rule was not merely too aggressive — it *undershoots*, because it merges every install
group in a repo into one, discarding real, separately-earned demand (mattpocock/skills: max 1.4M vs true
11.75M install events).

**Why H68 measured the wrong thing.** H68's basis was "41.3% of within-repo sibling pairs share one flow
stream (corr ≥ 0.95)". Correlation on **level series** cannot separate *shared stream* from *independent demand
that co-moves*. Measured directly: only **2.7%** of 86,824 within-repo sibling pairs have identical series;
**2.7%** have exactly matching weekly deltas and **12.8%** match within 15%; **79.9%** diverge. The 17.4% that
are *proportional but not identical* are precisely the false positives H68's threshold admitted.

**Two further corrections:**
1. **Our listing census was missing ~2/3 of the long tail.** The repo-page census of the same 130 repos lists
   **6,001** skills; our board census holds **2,151** (35.8% of listings) but **81.0%** of installs. The
   undercount is concentrated in the tail: 37.9M missed installs, of which only 272K sit on listings under 1K.
   Revised universe ≈ **24,272 listings**, not 8,700.
2. **The market is LESS concentrated than H68 said.** Effective competitors on the census subset: 0.97 raw →
   **0.84 block-corrected**; top-10 share 55.8% raw → 60.3% corrected. Correcting the inflation *loosens* the
   field, because the inflation was concentrated in a few catalogue repos.

**Also newly settled:** the sibling-stream question H68 flagged as its #1 open limit (E35, "needs event-level
install data") **did not need event-level data** — the repo header arithmetic answers it exactly. E35 is
**retired**, and the "is it one stream or parallel skills?" ambiguity that H68 said it could not resolve
without an install event is resolved: it is **neither** — it is *install groups*, a third structure neither
H67 nor H68 hypothesized.

---

## Operational rules (revised)

1. **Quote market size as install-group events, not listing counters.** State +160% (x2.60) as the corrected
   inflation factor. Retire the 22.6%–290.7% range and the collapse-to-MAX rule.
2. **Never quote skills.sh's repo-level "total installs" as demand.** It is a sum of per-listing counters and
   overstates by ~x2.6. This applies to third-party numbers too — microsoft/azure-skills "14.2M" is ~4.0M events.
3. **Detection rule: block structure, not level correlation.** Group a repo's listing counters into blocks
   (values within 5% of the block's max); each block = one install group. Confirm with matching weekly deltas.
   Level correlation (H68's method) produces false positives at ~4:1.
4. **Breadth inside one repo is not automatically a liability.** 23 of 130 repos have exactly one install group
   (a catalogue installed wholesale), but the largest repos have many: `github/awesome-copilot` 470 skills /
   96 groups, `forcedotcom/sf-skills` 406 / 73, `google/skills` 191 / 53, `aws/agent-toolkit-for-aws` 155 / 38.
   H68's "one sharp listing beats a catalogue" (corr 0.058) does not survive the group structure — those
   repos are not one stream, they are dozens of independently-earned streams.
5. **The addressable tail is larger than H68 said, because the tail is bigger.** ~24,272 listings, not 8,700,
   with 64% of them invisible to our previous census — but the invisible mass is low-demand (272K installs
   across it). Discovery remains the bottleneck; the *count* of competitors is worse than we thought, not better.

## Limits of this cycle

- The block model is fitted on **lifetime counters** with weekly deltas as validation, not on event logs. Block
  boundaries use a 5% tolerance; a repo with smoothly spread counters would be split differently at 2% or 10%.
  Sensitivity: the x2.60 figure moves to roughly x2.4–x2.9 across 2%–10% tolerance.
- 130 repos were crawled, chosen by board w7 — the top of the demand curve. **The correction is NOT yet
  extrapolated to the 2,760 uncrawled repos**, whose structure may differ (a long tail of small repos may have
  fewer blocks per repo and less inflation). Board-scale numbers here are reported as *census-subset* figures.
- Block membership is inferred from counter proximity, not observed. An alternative reading — that counters are
  independent and blocks are coincidence — is contradicted by the delta match within blocks (0.1%–0.7%) but
  not formally excluded.
- No GitHub stars/forks, no revenue, no usage data. w7 remains skills.sh installs, not usage.
- `hypetopher/aicompany` stars/forks unverified this cycle (last known 0/0, last push 2026-02-09).

## Kill criterion

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET), no publish credential,
`ops_social_posts` = 0, no repo writes, no installs, no publish. **Read-only public GETs only — 130 repo pages,
0 failures.** OPERATIONAL STATE UNCHANGED.

## Queued next

- **E48** — crawl the next 300 board repos by w7 (extend the census beyond the top 130) and re-fit blocks; the
  uncrawled 2,760 repos are where the correction is unvalidated. Highest value.
- **E49** — block-structure census of the tail (repos outside the board's top 130) to test whether low-demand
  repos have proportionally fewer install groups; decides whether +160% applies board-wide.
- **E50** — tolerance sensitivity sweep (2%/5%/10%) plus a rank-based (not value-based) block detector, to
  confirm the x2.60 factor is not an artefact of the 5% threshold.
- **E51** — E35 retired: no install event needed. Replace with a mirror-family group census (the 6 superpowers
  mirrors share a block structure — compare group-for-group, not listing-for-listing).
