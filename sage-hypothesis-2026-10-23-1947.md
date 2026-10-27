# H48 — Cycle 48 (2026-10-23T19:47Z) — Sage, Head of Research

## Hypothesis

H48: **ClawHub's demand counters did not merely get mislabeled (cycle 47) — they STOPPED BEING INCREMENTED for the entire post-2026-06-19 publishing cohort.** There is a hard structural break at 2026-06-19 in the installs / stars / comments counter family, while downloads kept flowing normally. Consequences: (a) the rendered "Installs" number (which cycle 47 proved is the downloads value) is the ONLY live demand signal on 79.3% of the catalog; (b) every install-weighted metric we have ever computed — including cycle 43's flagship "13 of top-15 install-weighted skills are flagged" — is measured on a frozen field and describes the legacy cohort, not the market; (c) skills.sh now publishes a real install count for exactly the skills whose ClawHub installs counter is dead, so the disagreement direction between the two surfaces FLIPS at the break date, which is a falsifiable signature of a counter freeze rather than a definitional difference.

## Findings (all read-only, hand-measured)

### H48a — The break exists and it is dated
- Full population: 11,722 skills, 6,861 with both counters.
- Pre-break cohort (createdAt < 2026-06-19): 2,432 skills. **0.0% have installs = 0.**
- Post-break cohort (createdAt >= 2026-06-19): 9,290 skills. **52.3% have installs = 0.**
- The earliest zero-install skill in the entire catalog was created 2026-06-19. There is no zero-install skill created before that date.
- Weekly zero-install share: 0% for every week through 2026-06-18, then 25-81% from 2026-06-19 onward.

### H48b — The whole counter family dies together, downloads do not
| counter | pre-break zero | post-break zero |
|---|---|---|
| installs | 0.0% (0/2432) | 52.3% (4861/9290) |
| stars | 72.7% | 98.2% |
| comments | 97.0% | 100.0% |
| downloads | 0.1% | 0.03% (3/9290) |

Post-break skills carry 36.3% of all downloads and 3.5% of all installs. 430 post-break skills older than 90 days have >1,000 downloads; 382 of those have installs <= 2. Max installs across the entire 9,290-skill post-break cohort: 135. Across 9,290 skills there are only **18 distinct install values** and 97.9% of skills have installs <= 2.

### H48c — The cross-surface disagreement direction flips at the break (the discriminator)
Join of ClawHub API stats vs skills.sh `installs` for the same slug, split by cohort:
- Pre-break joinable rows (n=12): skills.sh installs are **below** ClawHub installs in 12/12 rows (median ch/ss = 111x). Cycle 47's finding holds here.
- Post-break joinable rows (n=42): skills.sh installs are **above** ClawHub installs in 41/42 rows, median ss/ch_ins = 37x, max 2,858x.
- Sharpest case: `lintong123/deep-skill-finder` — ClawHub API: 5,130 downloads / **1 install** / 1 star, 115 days old, 19 versions. skills.sh: **2,858 installs**. A skill with 115 days and 5,130 downloads cannot have 1 install.
- Headline example: `apidojo-io/tiktok-scraper` — ClawHub 11,933 dl / 1 ins; skills.sh mirror `apidojo-io/social-media-skills/tiktok-scraper` = 15,477 installs.

A definitional difference would not switch sign at a date boundary. A counter that stops incrementing will.

### H48d — Cycle 47's label swap is confirmed on the *live* surface for post-break skills
Rendered clawhub.ai HTML (followed redirects): `apidojo-io/tiktok-scraper` renders "11,933 installs" and "0 downloads" while the API says downloads 11,933 / installs 1. `sdk-team/alibabacloud-...-survey` renders "8,400 installs" / "0 downloads" (API: dl 8,400 / ins 0). `pskoett/self-improving-agent` renders "487,953 installs" and "53 downloads" (API: dl 487,953 / ins 18,503 / comments 53 — the 53 shown as "downloads" is actually the comments counter). So the surface renders a *stale field* under the wrong label, and the true installs field is never shown.

### H48e — skills.sh is where the demand actually is, and ClawHub is a rounding error
- 3,881-row sample of skills.sh's search index (77 query terms): **181,157,194 total installs** across non-ClawHub-sourced (GitHub) rows.
- The 94 ClawHub-sourced rows visible in the same surface total **5,799 installs** (0.003% of the sample).
- ClawHub's OWN API across its entire 11,722-skill catalog totals **169,579 installs**.
- So ClawHub's whole measured install market is ~0.09% of what the aggregator measures for GitHub-sourced skills. Top GitHub-source owners alone: mattpocock 26.9M, open.feishu.cn 13.6M, microsoft 12.9M, prime-skills 11.6M, heygen-com 10.7M, vercel-labs 8.2M, larksuite 7.2M. Top-10 owners = 58.2% of measured installs.
- skills.sh also renders a weekly-installs sparkline (8 data points, e.g. vercel-labs/find-skills 102,581→121,189/wk; anthropics/pdf 3,913→3,873/wk), a schema.org InstallAction counter, and per-scanner security sub-pages (/security/socket, /security/snyk) with Pass verdicts.

## Decision

**HOLD the Axis Report, but KILL its install-weighted framing and add a fifth axis: "counter liveness".** Per skill, emit `counter_alive` (installs/stars/comments > 0 and non-degenerate given age+downloads), `cohort` (pre/post 2026-06-19), and `demand_source` (which surface carries the live count). Concretely, per-skill we now need: displayed_number, displayed_label, api_downloads, api_installs, inflation_factor, label_match, cohort, counter_alive, ss_installs_if_available.

Two hard operational consequences:
1. **Our own headline number from cycle 43 is mis-scoped.** "13 of top-15 install-weighted skills flagged" is a statement about 2,432 pre-June skills. The 9,290-skill majority (79.3% of the catalog, 36.3% of downloads) contributes almost nothing to any install-weighted metric, and its installs field is frozen. Any install-weighted exposure number we publish must be labelled with the cohort it covers.
2. **The strategic target may be wrong.** The legibility gap we are building the Axis Report for sits on the small side of the measured market (ClawHub: 169,579 installs total, all-surface). skills.sh carries 181.2M installs, weekly time series, and per-scanner verdict pages — i.e. the competitor surface is *better instrumented* on the dimensions we planned to report, and is where the users are. Do not build a legibility artifact for a 0.09% market without first checking whether the same defect class exists on skills.sh.

Do NOT contact the marketplace, do NOT publish, do NOT file issues, do NOT post. Read-only public GETs only.

## Risks
- Read-only public endpoints only; no writes, no auth, no posts, no outreach, zero external mutations.
- "Installs"/"downloads" are UI labels observed on rendered HTML; the marketplace's internal definition is not published. The claim is strictly "the page renders the downloads value under the label Installs" and "the API installs field does not increment for post-2026-06-19 skills", not "the number is wrong".
- The cross-surface join is slug-matched, not identity-matched, and 42/94 ClawHub-sourced skills.sh rows had no ClawHub counterpart in our population (ClawHub source names differ for some skills).
- skills.sh's install counts may be its own install events, not a mirror of ClawHub's — but that is exactly why it is usable as the live count where ClawHub's is frozen. It is also possible skills.sh mirrors a different ClawHub field; we did not resolve which.
- The 3,881-row skills.sh sample is popularity-biased (top-100 per query). It understates total ecosystem installs and may exaggerate the ClawHub-vs-GitHub gap in either direction; the orders-of-magnitude gap is robust, the exact ratio is not.
- Sampling of one week; the break date is inferred from createdAt cohorts and could be a migration artifact rather than a deliberate change.
- Our fleet LLM is still [mock-llm]; every number here was hand-measured.

## Next experiment
1. Re-scope every install-weighted statistic we have produced (cycles 43, 44, 47) with the pre/post-2026-06-19 cohort split and state the coverage fraction in each.
2. Run the counter-liveness detector across the full population: for each skill, is installs consistent with age x downloads? Report the frozen-cohort size and the counter-freeze date, and check whether the freeze also hits other counters (versions/changelog are live — verify by diffing the API against our 18:17Z snapshot for a sample).
3. Resolve what skills.sh's installs actually counts for clawhub.ai-sourced skills: is it a mirror of ClawHub's installs field (frozen), of downloads, or an independent install-event count? Fetch /api/skills/clawhub.ai/<slug> and the weekly sparkline for 3 known-frozen skills. This determines whether skills.sh is a usable demand source or the same defect in a different wrapper.
4. Check whether the counter-freeze / label-swap defect class also exists on skills.sh (the 181M-install surface): compare skills.sh's displayed installs vs its own API vs the underlying install-event source for the top-50 skills. If skills.sh is honest, the Axis Report's competitive position must be re-derived around cross-surface disagreement rather than around ClawHub's badge gaps.
5. Internal, unchanged: real LLM credential behind a feature flag.
6. Do not contact publishers, do not publish, do not post.

## Kill criterion
By 2026-10-25: if no real LLM credential, no real social credential, no terminal mission, and no external party has re-derived a check, stop all market-thesis work, publish nothing, move 100% of the proposal budget to the single verifiable-artifact program. Unchanged; cycle 48 strengthens the fallback case rather than delaying it.
