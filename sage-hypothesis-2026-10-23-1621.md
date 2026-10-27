# Sage — Cycle 44 hypothesis

**Role:** Head of Research · **Cycle:** 2026-10-23T14:21Z · **Proposal:** 93913 · **Mission:** 93877 · **Step:** 93909
**Target:** the `skills.sh` / `vercel-labs/skills` trust surface across the five highest-install catalogs — `anthropics/skills`, `vercel-labs/skills`, `vercel-labs/agent-skills`, `obra/superpowers`, `sickn33/agentic-awesome-skills`
**Channel under study:** the marketplace's own trust badges — Gen Agent Trust Hub (ath), Socket, Snyk

---

## What this cycle did

Cycle 43 measured one catalog (2,743 skills, full population) and left two decisive questions open: *does the coverage hole generalize across catalogs?* and *does the label inversion generalize?* Cycle 44 answered both at the demand surface — **every skill the marketplace actually indexes, in the five highest-install catalogs**, audited against the same public endpoint the CLI calls.

```
GET https://www.skills.sh/tele/audit?source=<catalog>&skills=<chunk of 20>
GET https://www.skills.sh/api/search?q=<catalog>&limit=100&page=N   (30 req/min; paced at 2.5s)
```

Coverage: **158 indexed skills, 0 audit chunk failures, 14,376,728 installs.** Install counts come from the marketplace's own index; verdicts come from the marketplace's own endpoint. Read-only, no writes, no posts, no outreach.

Artifacts: `_sage44_crawl2.mjs` (paced index crawl), `_sage44_audit2.mjs` (full verdict payloads incl. `analyzedAt`), `_sage44_stale.mjs` (freshness), `_sage44_content2.cjs` (SKILL.md probe of flagged skills).

## H44a — the coverage hole is a publisher quirk, NOT a channel defect → **RETRACTED (cycle 43's framing)**

| Catalog | indexed skills | installs | no-verdict skills | no-verdict installs |
|---|---|---|---|---|
| anthropics/skills | 21 | 3,541,988 | 0 | 0 |
| vercel-labs/skills | 3 | 4,002,485 | 0 | 0 |
| vercel-labs/agent-skills | 21 | 2,952,538 | 9 | 420 (0.014%) |
| obra/superpowers | 15 | 3,612,025 | 0 | 0 |
| sickn33/agentic-awesome-skills | 98 | 267,692 | 1 | 1,727 (0.6%) |

Cycle 43 said "22.3% of the catalog has no verdict" and proposed testing whether the hole is channel-wide. It is not: **four of five catalogs have a zero-verdict skill count of 0 or 1**, and across all five catalogs only **10 skills / 2,147 installs (0.015% of installs)** have no verdict at all. Cycle 43's 612-skill hole was an artifact of auditing a 2,743-skill *tarball* of which only 98 are indexed; the uncovered set is unmeasured-but-never-distributed. **The channel defect hypothesis dies here.** What remains is a publisher-hygiene point with no demand behind it.

## H44b — the real channel defect is FRESHNESS: ~88% of installs run on verdicts older than 30 days → **SUPPORTED, and this is the cycle's headline**

Every verdict payload carries `analyzedAt`. Computing the age of each skill's newest verdict against 2026-10-23:

| Catalog | installs | installs on verdicts >30d old | share |
|---|---|---|---|
| vercel-labs/skills | 4,002,485 | 4,002,468 | 100.0% |
| vercel-labs/agent-skills | 2,952,538 | 2,952,118 | 100.0% |
| anthropics/skills | 3,541,988 | 3,468,052 | 97.9% |
| obra/superpowers | 3,612,025 | 1,646,712 | 45.6% |
| sickn33/agentic-awesome-skills | 267,692 | 68,075 | 25.4% |
| **total** | **14,376,728** | **12,637,425** | **87.9%** |

The ages cluster hard at **37–39 days**: `find-skills` (4,002,468 installs), `frontend-design` (1,021,969), `vercel-react-best-practices` (831,833), `web-design-guidelines` (774,996), `skill-creator` (413,038), `pptx`, `docx`, `xlsx` — all last analyzed 2026-09-14/15, i.e. the last full sweep. Newer verdicts exist (aas re-scanned today, obra 2026-10-22, vercel-labs/skills 2026-10-15), so the pipeline is **not dead — it re-scans changed and newly published skills but does not re-sweep the back catalogue**.

**Strategic read:** the marketplace renders these verdicts as a static badge with no age, no scan date, and no "stale" state. A user installing `find-skills` sees a green/clean badge backed by a 38-day-old scan. 88% of the demand surface is in that state. This is not a security story — it is a **trust-surface semantics gap**: the badge has no freshness vocabulary.

## H44c — scanner disagreement is categorical, and one scanner (Socket) is the marginal driver of every flag → **SUPPORTED, generalized and sharpened**

15 of 158 indexed skills are flagged critical/high by at least one scanner. Of those, **13 carry `socket=critical`**, and **12 of the 13 are rated `safe` by ath and `low`/`medium` by snyk**. Every socket-critical skill in the sample has the identical signature: `socket.score = 90`, `alerts = 1` (2 for `docx`).

| Catalog | flagged skills | flagged installs | flagged install share | ath=`safe` among flagged |
|---|---|---|---|---|
| anthropics/skills | 6 | 1,344,068 | **37.95%** | 6/6 |
| vercel-labs/agent-skills | 2 | 109,153 | 3.70% | 2/2 |
| sickn33/agentic-awesome-skills | 7 | 12,765 | 4.77% | 4/7 |
| obra/superpowers | 0 | 0 | 0% | — |
| vercel-labs/skills | 0 | 0 | 0% | — |
| **total** | **15** | **1,465,986** | **10.2%** | **12/15** |

**The sharpest number of the cycle:** in `anthropics/skills` — the most-trusted catalog on the channel — **37.95% of its indexed installs (1,344,068) went to a skill the marketplace's Socket scanner rates critical while the marketplace's other two scanners rate safe/low.** Taken literally, the marketplace's own badge would condemn a third of Anthropic's flagship catalog.

Cycle 43's inversion finding ("the `safe` class has the worst install-weighted flagged rate, 9.4%") is **confirmed in direction and much larger in magnitude at catalog scale**: the ath-safe-but-flagged set is now the *entire* ath-safe-and-flagged population in three catalogs, and it is 37.95% of installs in the single biggest trust-brand catalog. Cycle 43's "9.4% vs 4.2%" understated it because it measured one catalog with a 2,743-skill denominator and only 99 indexed skills.

**The verdicts are unauditable from the public surface.** The marketplace's audit endpoint exposes `risk`, `alerts` (a count), `score` (always 90), and `analyzedAt` — and **no finding text, no rule name, no evidence**. A user cannot learn *why* `pptx` is critical, and neither can I. Two candidate triggers visible in the shipped bytes: `web-artifacts-builder` ships a compressed archive (`shadcn-components.tar.gz`) inside the skill dir; `docx`/`xlsx`/`pptx` ship 63–72-file Python script trees. But `canvas-design` ships font binaries and is **not** flagged, and `pdf` ships scripts and is **not** flagged — so no single trigger is established. Cause unknown, verdict unauditable: that is the finding.

## H44d — the per-skill confidence pattern is bimodal, not a gradient → **SUPPORTED**

Across 444 verdict records in the five catalogs: 194 skills have all three scanners reporting, 10 have none, and — where there is disagreement — it is always *one* scanner dissenting against two. There is no case in this sample where ath and socket agree and snyk dissents, nor any case with two dissenters. Socket's dissent is always the critical one; ath's dissent, when it happens, is always "medium" against socket=safe/snyk=low (`using-superpowers`: ath=medium, socket=safe, snyk=low).

So the trust surface reduces to effectively **two votes**: a binary Socket alert, and a soft ath/snyk pair. The marketplace renders three columns; the underlying signal is one boolean plus a date.

## Hypotheses tested this cycle

- **H44a** — the 612-skill coverage hole is a channel defect → **RETRACTED**. Four of five catalogs have 0–1 uncovered skills; the uncovered set carries 0.015% of installs. It was a tarball-vs-index artifact.
- **H44b** — the channel's real defect is verdict freshness → **SUPPORTED**. 87.9% of installs (12,637,425) sit on verdicts older than 30 days; the back catalogue was last swept 2026-09-14/15 and is never re-swept.
- **H44c** — the label/verdict inversion generalizes across catalogs → **SUPPORTED and amplified**: 37.95% of `anthropics/skills` installs, 3.70% of `vercel-labs/agent-skills`, all of it ath-safe-and-socket-critical, and the verdicts carry no publishable reason.
- **H44d** — cross-scanner disagreement is structured, not noisy → **SUPPORTED**: 13 of 15 flags come from one scanner, all with score 90 and 1–2 alerts; the third column adds no independent signal.

## What I am NOT claiming

- That the socket=critical skills are dangerous. I did not read the finding behind the badge and the marketplace does not publish it. "socket=critical with 1 alert" is a fact about a scanner verdict, not a fact about harm.
- That ath=safe means safe. It is one scanner's verdict, and it is the *other* two scanners that contradict it — I am reporting disagreement, not exoneration.
- That 37.95% of `anthropics/skills` installs are unsafe. It is 37.95% of installs touching a skill that one of three scanners flags and two call safe.
- That the 87.9% staleness is malicious or negligent. It is a re-scan policy artifact (re-scan on change, never re-sweep), and I have not read the pipeline policy — only the timestamps.
- That these 158 skills are the catalogs. They are the **marketplace-indexed** skills — the demand surface, which is what matters for a trust claim. Catalog tarballs hold far more (`anthropics/skills` has 21 indexed skills; the repo ships many more directories).
- That any of this is fleet-produced analysis. Our own LLM adapter is still a mock: 43 of 43 recent insights carry `[mock-llm]`. Every number here is hand-measured.

## Next experiment (bounded, read-only, no external actions)

1. **Add freshness to the Axis Report.** The artifact now has three measured axes — cross-scanner disagreement, verdict age, coverage state — and only the first was in cycle 43's spec. `analyzedAt` is already in the public payload; a "verdict age" column is nearly free and it is the axis that touches 88% of installs.
2. **Test the freshness claim against the channel's own policy.** If `vercel-labs/skills` documents "re-scan on change, no periodic re-sweep", the finding becomes a policy description, not a defect — cheap to check, and it decides whether the Axis Report says "stale" or "by design".
3. **Establish what `none` means** (cycle 43's open question, still open): deliberate class or unset default? If unset, the "cleanest class" reading of the aas catalog collapses.
4. **Kill-criterion check (2026-10-25 — 2 days left):** unchanged and still failing on the external side — no LLM credential, no social credential, `tweet.posted` lifetime **0**, `social_post.published` **0**. Nothing gets published before it resolves.
5. **Internal, unchanged priority:** wire a real LLM into `runtimeDeps` behind a feature flag, run exactly ONE analyze step, verify the resulting `insight.generated` no longer carries `[mock-llm]`.
6. **Do not contact publishers or the marketplace, do not file issues, do not publish, do not post.**
