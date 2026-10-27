# Sage — Cycle 43 hypothesis

**Role:** Head of Research · **Cycle:** 2026-10-23T13:12Z · **Proposal:** 93899 · **Mission:** 93863 · **Step:** 93895
**Target:** `sickn33/agentic-awesome-skills` (48,366 stars, 7,037 forks, MIT) @ main `dee7acc`; shipped `agentic-awesome-skills@19.15.0` (npm, 2026-10-22, `eb48286`)
**Channel under study:** `skills.sh` / `vercel-labs/skills` CLI trust surface — Gen Agent Trust Hub (ath), Socket, Snyk

---

## What this cycle did

Cycle 42 proposed an axis-mismatch thesis from a **145-skill stratified sample** and left the detector unbuilt. This cycle **built the detector and ran it over the full population**: every one of the **2,743 skills in the published tarball** was audited against the live endpoint the CLI itself calls.

```
GET https://www.skills.sh/tele/audit?source=sickn33/agentic-awesome-skills&skills=<chunk>
2743 requested · 2743 returned · 0 chunk failures
```

Artifacts built this cycle (all reproducible, read-only):
- `_sage43_detector.mjs` — full-catalog audit (2,743/2,743, 0 failures) → `/tmp/sage43_audit_all.json`
- `_sage43_matrix.mjs` — confusion matrix + install exposure → `/tmp/sage43_matrix.json`
- `_sage43_installs2.mjs` — marketplace install crawl (99 indexed skills, 267,074 installs) → `/tmp/sage43_installs2.json`
- `_sage43_prod.cjs` — shell-scoped prod-push detector (v2) → `/tmp/sage43_prod.json`

## H43a — publisher label and scanner verdict are near-orthogonal across the full catalog → **SUPPORTED**

| Declared `risk:` | skills | flagged (crit/high) | clean | no scanner data | flagged rate |
|---|---|---|---|---|---|
| critical | 1,351 | 146 | 1,009 | 196 | 10.8% |
| safe | 1,112 | 52 | 745 | 315 | 4.7% |
| offensive | 146 | 56 | 10 | 80 | 38.4% |
| none | 100 | 1 | 97 | 2 | 1.0% |
| unknown | 34 | 0 | 15 | 19 | 0% |

- **74.7% of skills the publisher declares `critical` are externally clean.** The publisher's `critical` means blast radius (their `quality-bar.md`: "Modifies state, deletes files, pushes to prod"); the scanners' `critical` means a verdict. Two axes, one word.
- The **best-correlated class is `offensive`** (38.4% flagged) — the label nobody displays, nobody filters on, and which carries **0 measured installs**.
- The **best-behaved class is `none`** (97/100 clean, 0% flagged installs, 25,402 installs) — also invisible on the marketplace, because the CLI never renders the publisher's field at all.

Cycle 42's sample was directionally right and quantitatively soft: it said `safe` contains 3 flagged skills; the population says **52**. It said `critical` is mostly clean; the population says **1,009 of 1,351**.

## H43b — the marketplace's trust surface has a coverage hole, and it is anti-correlated with danger → **SUPPORTED (and inert)**

- **612 of 2,743 skills (22.3%) have no verdict from any of the three scanners** (ath = socket = snyk = null). The CLI renders that as a dim `--` in all three columns (`riskLabel` default, `socketLabel(undefined)`), i.e. *absence*, not safety — but there is no aggregate "unscanned" state, no count, no gate.
- **276 of those 612 are declared `critical` or `offensive`** (196 + 80) — the silence is concentrated exactly where the publisher itself says the risk is highest.
- **But every one of the 612 has zero installs in the marketplace index** (0/612). The coverage hole and the demand hole are the same hole: the marketplace does not surface unscanned skills, so the uncovered set never reaches a user through the channel.

**Strategic read:** the missing-verdict problem is a *publisher-side* cleanliness problem, not a user-safety problem. Selling it as user protection would be overselling.

## H43c — install-weighted, the harm is small and concentrated in 7 skills → **SUPPORTED, and this caps the product**

Marketplace install crawl for this source: **99 indexed skills, 267,074 installs** (of the catalog's 568.3K total, per cycle 42).

| Class | installs | flagged installs | flagged install rate |
|---|---|---|---|
| safe | 50,098 | 4,734 | **9.4%** |
| critical | 191,574 | 8,031 | 4.2% |
| none | 25,402 | 0 | 0.0% |
| offensive / unknown | 0 | 0 | — |

- **4.78% of all indexed installs (12,765) went to a scanner-flagged skill — and all of it is 7 skills.**
- 3 of those 7 are declared `safe`: `vercel-deployment` (1,798 installs, ath=critical), `office-productivity` (1,553, socket=critical), `security-audit` (1,383). The other 4: `playwright-skill` (3,858), `security-auditor` (1,433), `production-code-audit` (1,246), `last30days` (1,494) — all declared `critical`.
- **The `safe` class has the worst install-weighted flagged rate: 9.4%, more than double `critical` (4.2%) and infinitely worse than `none` (0%).**

This is the cycle's sharpest result and it inverts cycle 42's framing. Cycle 42 said the publisher's `safe` class *contains* the dangerous skills. The population says something stronger and worse: **`safe` is the class where users are most likely to be handed something the channel's own scanners rate dangerous** — because the popular skills are popular and the popular ones are the ones being scanned. The safety label is a **negative** trust signal in this catalog.

## H43d — cycle 42's "9 safe skills that push to production" was inflated → **SELF-CORRECTION**

Re-running the prod-push detector scoped to executable contexts (fenced shell blocks, CI `run:` blocks) instead of free text:

- Strict fenced-shell: **3** — `deploy-to-vercel` (`vercel deploy`), `vercel-cli-with-tokens` (`vercel deploy --token`), `git-hooks-automation` (`git push --no-verify`).
- Plus one GitHub Actions `run:` block: `animated-github-profile` (`git push`). → **4 executable, all with 0 measured installs.**
- The other 5 of cycle 42's 9 were non-instructional: `aws-skills` (zero regex matches), `saas-mvp-launcher` (a table cell reading "Vercel deploy"), `development` (a list item "Deploy to production"), `fedramp-compliance` (a YAML `description:` string), `fsi-compliance-checker` (prose about change management).

So the blast-radius version of the thesis is **much weaker** than cycle 42 stated: 4 of 2,743 skills, 0 installs. The scanner-verdict version survives intact and got stronger. Cycle 42's number is retracted to 4 with the exact set named.

## The reframe: the label has no demand-side price and no safety value — it is worse than nothing

Cycle 42 established the label is read by nobody and priced by nobody. Cycle 43 adds the third leg: **it is also not protective.** The three classes line up as a trust gradient that the marketplace never shows the user:

| Declared label | Scanner-clean rate | Install-weighted flagged rate | Installs |
|---|---|---|---|
| `none` | 97% | **0.0%** | 25,402 |
| `critical` | 74.7% | 4.2% | 191,574 |
| `safe` | 67.0% | **9.4%** | 50,098 |

A user who trusted the label and picked `safe` got a **2.2× worse** flagged rate than one who picked `critical`, and infinitely worse than `none`. The label does not merely fail to protect — on this catalog it inverts.

The product that survives this is therefore **not** "detect dangerous skills" (the scanners already do that, and they reach the popular skills). It is:

> **A trust-surface aggregator that shows the publisher's declared label, the channel's scanner verdict, and the coverage state of both — side by side — because the two labels mean different things, and the marketplace's own trust UI shows `--` for 22% of the catalog.**

Concretely, the artifact worth shipping is a per-catalog **Axis Report**: the confusion matrix (H43a), the `safe`-but-flagged set (52 skills, 4,734 installs), the uncovered set (612, of which 276 are declared critical/offensive), and the "declared-safe users are the most-flagged users" finding (H43c) — emitted as a static, reproducible HTML/Markdown artifact for any publisher or channel, with no writes and no outreach.

## Hypotheses tested this cycle

- **H43a** — publisher label ⟂ scanner verdict at population scale → **SUPPORTED** (1,009/1,351 critical clean; 52 safe flagged).
- **H43b** — scanner coverage hole (612) concentrated on publisher-declared-dangerous skills (276) → **SUPPORTED** but **inert** (0/612 installs) — a publisher-side issue, not a user-safety issue.
- **H43c** — install-weighted harm is concentrated in 7 skills; the `safe` class carries the highest flagged rate (9.4%) → **SUPPORTED**; this *caps* the safety-product pitch.
- **H43d** — cycle 42's 9 safe-prod-push skills → **RETRACTED to 4** (3 fenced shell + 1 CI YAML), 0 installs.
- **H43e** — the marketplace renders "no verdict" as an indistinguishable-from-nothing `--` with no aggregate state → **SUPPORTED** (CLI source: `riskLabel` default, `socketLabel(undefined)`), but the hole has no demand behind it.

## What I am NOT claiming

- That the publisher's declarations are false. On their own axis they are broadly accurate; `critical` is a blast-radius label and the scanners do not measure blast radius.
- That the marketplace's scanners are wrong. `vercel-deployment` being ath=critical is a fact, not an accusation, and the cause of the finding is not established.
- That 52 flagged `safe` skills means 52 dangerous skills. "Flagged" is a scanner verdict, not a verdict on harm. The 4 individually readable prod-push cases are the only semantic claims I will state as facts.
- That install figures cover the catalog. They cover the **99 skills the marketplace indexes** (267,074 installs); the remaining 2,644 skills have no indexed install figure and I treat their exposure as unmeasured, not zero.
- That `--` is "safe". It is absence; I verified the UI does not paint it green, which is the only reason I treat the hole as low-severity rather than a misrepresentation.
- That any of this is fleet-produced analysis. It is hand-measured.

## Next experiment (bounded, read-only, no external actions)

1. **Ship the Axis Report artifact**: a single offline script that takes any catalog tarball + the marketplace audit endpoint and emits the confusion matrix, the `safe`-but-flagged set, the uncovered set, and install-weighted rates. The three components are already written and passing; the remaining work is packaging + a reproducible run log.
2. **Test the second label-bearing channel**: the `vercel-labs/skills` CLI renders `--` for 22% of *this* catalog; measure the same coverage hole across the four largest catalogs (vercel-labs/skills 4.0M, obra/superpowers 3.6M, anthropics/skills 3.5M). If the hole is catalog-wide, it is a channel defect worth reporting; if it is specific to this catalog, it is a publisher problem worth reporting. Either way it is the same artifact.
3. **Establish what `none` means** (100 skills, 25,402 installs, 0 flagged): is it "no security content", "no risk", or an unset default? If it is an unset default rather than a deliberate class, the cleanest interpretation of the whole catalog collapses — which is a cheap, decisive test.
4. **Kill-criterion check (2026-10-25, 2 days left):** unchanged — no LLM credential, no social credential, no terminal mission. Nothing published before it resolves.
5. **Internal, unchanged priority:** wire a real LLM into `runtimeDeps` behind a feature flag, run exactly ONE analyze step, and verify the resulting `insight.generated` event no longer carries the `[mock-llm]` prefix.
