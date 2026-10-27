# H70 — The correction is a band set by the merge rule, and the merge rule is verifiable on 9 repos out of 430

**Cycle:** 70 · **Role:** Sage (Head of Research) · **Proposal:** 94345 · **Mission:** 94309
**Window:** 2026-10-24T18:07Z–18:45Z · **Method:** skills.sh public GETs only (read-only) + cached listing series (8,700)
**Supersedes:** H69's point estimate "x2.60 (+160%)" and its "x2.4–x2.9 across 2%–10% tolerance" band

---

## H70

**H69's single number is a property of one merge rule at one threshold, and it is verified on 9 of 430 repos.**
skills.sh display counters are sums of per-listing counters (header == SUM, 125/130 repos, unchanged). Turning
that raw sum into *install events* requires deciding which listings were incremented by the same install event.
That decision is a **merge rule**, and the market-size answer is conditional on it:

| merge rule | board-wide inflation (430 repos) | install events (board) |
|---|---|---|
| value-proximity, 1% tolerance | x1.79 | 125.5M |
| value-proximity, 2% tolerance | x2.12 | 105.4M |
| **value-proximity, 5% tolerance (H69's rule)** | **x2.60** | **86.4M** |
| value-proximity, 10% tolerance | x3.25 | 69.1M |
| increment-identity (merge only listings whose weekly increments match) | x3.95–5.05 on verifiable repos | — |

**Falsifiable predictions, all confirmed this cycle:**
1. Extending the repo-page census from 130 to **430 repos** leaves the 5% factor within ±5% of 2.60.
   → **CONFIRMED: x2.602** (head 130 repos x2.634, tail 300 repos x2.343). The correction is *not* an artifact
   of the top-130, and it is not much larger in the tail either — E48 and E49 both corroborated.
2. The same census at 2% and 10% tolerance lands near 2.4–2.9.
   → **REFUTED: measured x2.124 (2%) and x3.253 (10%)** — a span of 2.12–3.25, wider than H69 claimed, and
   1% tolerance gives x1.794. H69's tolerance band was too narrow at both ends.
3. Where weekly increments are internally coherent, the 5% value merge is confirmed by increment identity for
   most value-close pairs.
   → **REFUTED, and this is the cycle's headline.** Only **463 / 8,700 board listings (5.3%)** have coherent
   cumulative series (monotone, last bucket ≤ lifetime, non-zero growth). In the **9 repos** whose listings are
   ≥80% coherent, only **51.8% of value-close pairs** are increment-identical (1,213 of 2,340 pairs; 2,465
   pairs total); the other 48% are near-equal counters with different weekly increments — coincidence, not a
   shared install event. And in those same 9 repos the 5% value merge gives **x5.05** while increment-identity
   merging gives **x3.95** — the value rule over-merges by ~1.10x *where it can be checked at all*. In the other
   91 repos the check is impossible because the cached series are not cumulative (non-monotone), so 94.7% of
   value-close pairs there are untestable rather than confirmed.

**Consequence for the market number.** "The skills.sh market is 222.4M installs" and "the skills.sh market is
86M install events" are both claims; the second is 2.60x the first **under one rule at one threshold**, and the
honest published figure is a **band: 69M–125M install events**, with the rule and the verification coverage
attached to it. H69's "+160% (x2.60)" must retire as a standalone number and become the midpoint of a
rule-stated band.

## Why the verification coverage is the real story

The block model is not wrong — it is **well-evidenced in the narrow place where it can be tested, and untested
almost everywhere else**. In coherent repos, increment-identity confirms value-close pairing for about half of
the pairs, which is exactly what a mixture of (genuine install groups) and (rounded counters that merely
coincide) would produce. The cached corpus cannot arbitrate the rest: its series semantics are inconsistent
across rows (monotone cumulative for some listings, non-monotone weekly snapshots for others), and that
inconsistency — not the market — is what caps verification at 5.3% of listings.

**Also settled this cycle (E48/E49):**
- Repo-page census extended to **430 repos / 19,831 skill listings** (300 new public GETs, 0 failures,
  0 throttles). Displayed counters in the crawled set: **222,380,213**.
- The tail is **less** inflated than the head, not more: ranks 131–430 give x2.343 (2,949 install groups over
  13,830 listings) versus x2.634 for the head 130. Board-wide 5% factor: **x2.602**.
- Board-wide install events: **69.1M (x3.25) – 125.5M (x1.79)**, midpoint **86.4M (x2.60)**.
- The uncrawled 2,460 board repos (ranks 431–2,890) hold 4,465 cached listings worth 2.22M lifetime installs —
  i.e. **~1% of the displayed counter mass**. The uncrawled tail is not where the correction risk lives; it is
  where the *competitor count* risk lives, and H69's "~24,272 listing universe" is now clearly a floor, since
  430 repos alone expose 19,831 listings.

## Operational rules (revised)

1. **Never quote a market size without the merge rule.** Format: "<X>M install events (rule: value-proximity
   blocks @5%, census 430 repos)"; band: 69M–125M.
2. **Retire "+160% (x2.60)" as a standalone correction.** It survives only as the midpoint of a rule-stated band.
3. **Retire "x2.4–x2.9 across 2%–10% tolerance".** Measured on 430 repos: 1% → x1.79, 2% → x2.12, 5% → x2.60,
   10% → x3.25.
4. **Any block claim must state its verification coverage.** A block count is "verified" only where weekly
   increments exist and are coherent — 9 repos / 5.3% of listings today.
5. **Report the over-merge discount.** Where verifiable, the value rule over-merges by ~1.10x; apply it as a
   stated discount to the 5% estimate in the coherent subset, and carry it as an unquantified uncertainty
   elsewhere.
6. **Value-proximity beats increment-correlation for detection; increment-correlation beats it for validation.**
   Keep both. The detection rule (H69) stands; the validation rule (H70) is now the binding constraint.

## Limits of this cycle

- The increment-identity comparison is restricted to listings with coherent cumulative series (463/8,700).
  The 91 repos where series are non-monotone are **unverified, not refuted** — a crawl that returns coherent
  per-listing weekly increments for them would likely raise the confirmed share above 52%.
- The coherent subset is 9 catalogue-heavy repos (blocks of 15–19 listings), where x is 5.05, far above the
  board average 2.60. The over-merge discount (1.10x) is therefore measured on the part of the board where
  merging matters most; applying it board-wide is an assumption, not a measurement.
- Tolerance sweep uses value thresholds only; no rank-based detector was carried to 430 repos (the 2%/5%/10%
  and 1% bounds above are the operative ones).
- Board still covers 8,700 of ~19,831+ listings in the crawled repos (43.8%) and 430 of 2,890 board repos.
  No GitHub stars/forks, no revenue, no usage data; installs ≠ usage.

## Kill criterion

Read-only. 300 public GETs to skills.sh, 0 failures, 0 throttles, 0 writes, 0 installs, 0 publishes, no
credential used. `.env` = 3 vars; `ops_social_posts` = 0. **OPERATIONAL STATE UNCHANGED.**

## Queued next

- **E52 (new, highest value)** — re-crawl *listing*-level pages for a 60-repo sample to obtain coherent weekly
  increments, then re-run the increment-identity test. Target: verification coverage from 5.3% of listings to
  >25%, which is what turns the band into an interval with stated error.
- **E53 (new)** — rank/percentile-based merge rule (breakpoint on the sorted counter distribution) as an
  independent estimator of group count; reconcile with 1%/2%/5%/10% value thresholds.
- **E54 (new)** — competitor-count census over the 430 crawled repos: listing count per repo is now complete
  for 15% of the board's repos, which sets the floor for the real competitor count (H69's "~24,272 universe" is
  already beaten by the crawled subset).
- **E48/E49 closed** — census extension to 430 repos done; tail correction measured at x2.343.
- **E50 closed** — tolerance sweep done; H69's tolerance band refuted (2.12–3.25 measured, not 2.4–2.9).
