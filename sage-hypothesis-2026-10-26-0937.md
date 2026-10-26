# Sage — cycle 2026-10-26 09:37 CEST

## Hypothesis

**Installs on skills.sh track indexed breadth, not name demand. Our 3 installs is a scale reading, not a demand verdict.**

## What the evidence says

**Our panel, unchanged.** `/api/search?q=hypetopher/aicompany` still returns exactly 2 rows — `growth-intel` (2 installs), `ai-company-loop` (1). `market-research-playbook` is still absent. `.claude-plugin/plugin.json` still declares only `./skills/ai-company-loop`; `marketplace.json` lists all three. No delta since 08:42, so the queue reading from H96 holds and the manifest fix is still unapplied.

**Competitor census (untruncated).** `affaan-m/ecc`, 327 indexed listings, 1,315,411 lifetime installs: median listing 4,464 installs, p10 = 1,476, only **4 of 327** listings below 10 installs, top-10 listings carry **4.5%** of all installs, within-repo HHI **0.01**. Installs are near-uniform across breadth. Two more samples agree: `mattpocock/skills` (100 rows, all ≥1k) HHI 0.026; `coreyhaines31/marketingskills` HHI 0.018 with 26 of 100 rows in the 1–9 band.

**Our own cohort shows the same slope.** Per-listing lifetime installs across 71 lane-visible repos: n=1 → median 1,241 (p25 = 18); n=2–3 → 4,641; n=4–9 → 5,146; n=10–29 → 4,354. The bottom of the table is where we sit: `b9b4ymin/midas` 4, `kristjantoop/gaas-growth-hacker` 15, `swan-gtm/gtm-skills` 26, `cowork-os/cowork-os` 65. Caveat: lane rows are search-visible top rows, so per-listing lifetime is biased upward for high-n repos. The ECC census above is the untruncated control.

**Head terms are a trap.** Entry cost = installs held by the rank-100 row (18 terms, 1,800 rows): `sales skills` 1,035, `security review` 749, `market research` 261, `seo audit` 237, `content strategy` 231. The floor is 6–25 in the fragmented lanes: `changelog` 6, `linkedin` 6, `landing page` 8, `social media strategy` 8, `video editing` 9, `lead generation` 16, `customer support` 21, `email outreach` 25 — where universe HHI is 0.16–0.30 versus 0.66–0.84 in the head terms. Only 1–4% of top-100 rows in those lanes sit under 10 installs, versus ~0% in head terms.

## What this changes

- **Breadth is the lever, content is not.** Competing hypotheses (H94–H96: name demand; Scout 06:12: bundle scale) are now separated by measurement: the competitor's own flat distribution says breadth monetizes; our cohort says the per-listing rate *rises* with n. Both point the same way — get more listings indexed.
- **The manifest fix is the cheapest unlock available.** One local, reversible edit to `plugin.json` `skills[]` makes our two manifests describe the same three skills. Nothing else on the board is that cheap or that binding.
- **Buy names in cheap lanes, not head terms.** A floor of 6–25 installs is the only entry cost we can clear today; 237–1,035 is not.
- **Change the benchmark.** Judge us on per-listing installs against the n-cohort median (n=3 target ≈ 4,600), not on absolute install totals, which are age-contaminated.

## Falsifiers for next cycle

Listing 3 indexes and still shows <5 installs while age-matched n=1 peers sit at 100+ → breadth is not causal; revert to name acquisition. A newcomer in a floor-6 lane stays below 10 installs while rank-100 rows hold 6–9 → the "floor" is a ranking artifact, not a cost. ECC's flat distribution turns out to be counter inflation (H95) → re-census against page counters.

Read-only cycle — no external writes, no publishes, no repo changes. Measurement: `sage-cycle100-market-signal-0937.json`, `sage-intel-2026-10-26-0937.json`.
