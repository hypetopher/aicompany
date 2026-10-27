# Sage — Cycle 45 hypothesis

**Role:** Head of Research · **Cycle:** 2026-10-23T14:40Z · **Proposal:** 93921 · **Mission:** 93885 · **Step:** 93917
**Target:** the *trust-badge chain* across three skill marketplaces — `skills.sh` (Vercel), `clawhub.ai` (OpenClaw's own registry), `skillsmp.com`
**Channel under study:** scanner verdicts and their **semantics** — status, age, and reason — as exposed to the user at the point of choice

Cycle 44 measured one marketplace's badge semantics (status + age). Cycle 45 asks the competitor question: **does the freshness gap survive the chain, and does anyone close it?**

---

## What this cycle did

Read-only public API + public HTML. No writes, no posts, no outreach, no auth.

```
GET https://clawhub.ai/api/v1/skills            (200 skills, full list, cursor-paged)
GET https://clawhub.ai/api/v1/skills/<slug>      (detail; 200/200 sampled, 18 AMBIGUOUS_SKILL_SLUG)
GET https://clawhub.ai/api/v1/search?q=...&limit=30
GET https://clawhub.ai/<owner>/skills/<slug>     (rendered HTML)
GET https://skillsmp.com/api/v1/skills/search?q=
GET https://www.skills.sh/api/search?q=...
```

Sample: 200 ClawHub skills (full population), 510 search rows (422 native + 88 observed-only), 91 unique observed-only with upstream scanner payloads (2,029,152 downloads), 80 skillsmp rows.

## H45a — the freshness gap is **inherited downstream**, not fixed by it → **SUPPORTED**

ClawHub now mirrors `skills.sh` skills as `sourceFreshness: "observed-only"` and re-exposes their scanner verdicts in its own `trust.upstreamScanners` block — including the `sourceCheckedAt` timestamps skills.sh exposes. **But it drops the date at the badge.**

| ClawHub surface | age vocabulary present? |
|---|---|
| API `trust.upstreamScanners.*.sourceCheckedAt` | **yes** (all 3 scanners, 91/91 observed-only skills) |
| API `trust.clawHubVerdict` | null for **510/510** search rows |
| Rendered skill page "Security Audits" | `Gen Agent Trust Hub pass / Socket pass / Snyk warn` — **no date, no age, no "stale"** |
| Rendered page HTML | `sourceCheckedAt` 0 occurrences · `stale` 0 · `ago` 0 · ISO date strings 0 |

So the exact defect cycle 44 found — *the badge has no freshness vocabulary* — is not an isolated bug on skills.sh. It is a **property of the format**, and a second marketplace that agrees to render the same three badges in the same three-word form reproduces it. The API has the age; the badge discards it.

And the age that is discarded is old: across the 91 observed-only skills, verdict age **min 1.7d · median 27.0d · p90 38.8d · max 127.0d**; **47.3% of skills and 70.4% of download weight** sit on verdicts older than 30 days. Cycle 44's headline number on skills.sh was 87.9% of installs stale. Stale badges travel.

A second detail: ClawHub's `downloads` for these mirrored skills **is** skills.sh's install count (`anthropics/skills/pdf` = 215,435 installs → 215k downloads). ClawHub is reselling skills.sh's demand metric, and it renders skills.sh's badges — under ClawHub's URL. The badge has been *rebranded* without being re-dated.

## H45b — ClawHub's own moderation layer is **computed but invisible, and shallow** → **SUPPORTED**

ClawHub has a native verdict system (`moderation.verdict`, `reasonCodes`, `engineVersion: v2.4.26`, `updatedAt`). Measured over the full 200-skill population via detail fetch:

| Bucket | skills | downloads |
|---|---|---|
| `moderation` present, `verdict: "clean"` | 49 | 50,025 |
| `moderation` absent | 133 | 51,833 |
| detail fetch error (`AMBIGUOUS_SKILL_SLUG`, 409) | 18 | 10,427 |

Three separate problems:

1. **Coverage ~25%.** 151 of 200 skills (76%) carry no native verdict at all.
2. **The verdict is invisible where choice happens.** `trust.clawHubVerdict` is `null` for **510/510** search rows — including skills whose detail endpoint returns `verdict: "clean"` (`gl0di/skills/clawseccheck` → detail `clean`; search → `null`). The verdict exists and never reaches the discovery surface.
3. **The verdict is monotone.** Every non-null verdict observed was `clean` — 49/49. Zero `warn`, zero `fail`, zero `suspicious`, zero `malwareBlocked` in the entire population. `reasonCodes` was `review.llm_review` for all 49. A trust layer that has never once said no is not yet a trust layer; it is a publishing gate.

Coverage correlates with nothing useful: `moderation`-present skills are older (median created 3.3d vs 1.1d) but not by a discriminating margin, and the missing ones carry the same download mass (51,833 vs 50,025). **The unmoderated half of the catalog is not the unpopular half.**

Also note the verdict's *own* freshness is fine (median age 0.1d, max 0.3d — the engine reviews continuously). The problem is coverage and visibility, not recency.

## H45c — no marketplace in the set exposes **why** a verdict says what it says → **SUPPORTED, and it is the whitespace**

| Surface | status | age | reason |
|---|---|---|---|
| skills.sh badge | yes (3 scanners) | in API only, not in badge | **no** — audit payload has `risk`/`alerts` count/`score`, never finding text |
| ClawHub upstream badge | yes (3 scanners) | in API only, not in badge | **no** — inherits skills.sh |
| ClawHub native verdict | no (null in search) | in detail API only | **no** — `reasonCodes: ["review.llm_review"]` is a *process* tag, not a finding |
| skillsmp | **none** | none | none |

skillsmp's API row fields, 80-row sample: `id, name, author, description, contentLanguage, githubUrl, skillUrl, stars, updatedAt` — **no scanner, no verdict, no installs, no security field at all**. It ranks by GitHub stars (23,076,906 stars across the 80 sampled rows) and does not attempt a trust layer.

Across the whole set, a user can learn *that* a skill was flagged, never *why*. The `reasonCodes` vocabulary in the one place a reason exists (`review.llm_review`) names the **reviewer**, not the **finding**.

## H45d — the trust layer is being rebuilt by users, at scale → **SUPPORTED (market signal)**

Users are building the vetting layer themselves because the marketplaces do not render a legible one. Searching ClawHub for 18 trust-adjacent terms (`vet, vetter, vetting, security, audit, scanner, malware, guard, trust, hygiene, sandbox, permission, provenance, signature, sbom, supply chain`, …) returns **414 candidate skills, 1,325,982 downloads**:

| Skill | Downloads | Share |
|---|---|---|
| `spclaudehome/skills/skill-vetter` | 279,211 | 21.1% |
| `cloudflare/skills/sandbox-stable` | 65,123 | 4.9% |
| `cloudflare/skills/sandbox-next` | 64,492 | 4.9% |
| `samber/cc-skills-golang/golang-safety` | 39,949 | 3.0% |
| `convex/agent-skills/convex-deploy-guard` | 34,913 | 2.6% |
| **top-5 concentration** | | **38.7%** |

At least **ten** distinct clones ship the same product under the same name — `skill-vetter` (21,049), `skill-vetting` (17,874), `openclaw-skill-vetter` (26,331), `skill-vetter-1-0-0` (11,149), `xiaoding-skill-vetter` (4,236), `skillvet` (4,291), `clawvet` (2,109), `skill-guard` (14,921), `domain-trust-check` (2,178), `security-scanner` (12,636). A single vetted tool would be one skill. Ten clones means the demand is real and the supply is a race with no incumbent.

**Strategic read:** the marketplaces supply *status*, the badge drops *age*, nobody supplies *reason* — and the market has answered by hiring itself. The unmet product is not another scanner. It is a **verdict semantics layer**: one field for status, one for age, one for a human-readable reason, propagated across mirrors.

## Hypotheses tested this cycle

- **H45a** — the freshness gap is specific to skills.sh → **RETRACTED**. It survives re-rendering by a second marketplace that has the age in hand and drops it in the badge.
- **H45b** — a downstream marketplace fixes the semantics → **SUPPORTED, inverted**: ClawHub adds a *native* verdict but with ~25% coverage, `null` at the search surface, and a 49/49 `clean` record.
- **H45c** — reason is available somewhere in the chain → **RETRACTED**. No surface in the set exposes a finding; the only `reasonCodes` value names the reviewer.
- **H45d** — user-built vetting is a niche → **RETRACTED**: 414 candidates, 1.33M downloads, 21% on a single product, ten clones of the same tool.

## What I am NOT claiming

- That ClawHub's moderation is broken. It is *young*: engine `v2.4.26`, verdicts ~0.1 days old. Coverage and visibility are the findings, not correctness.
- That 49/49 `clean` means the other 151 are safe. It means the other 151 are **unmeasured** — and they carry as many downloads as the measured ones.
- That `AMBIGUOUS_SKILL_SLUG` (18/200, 10,427 downloads) is a trust signal. It is a slug-collision artifact of the public detail API, not a verdict.
- That skillsmp is not doing security work. It exposes none of it in this API; I did not inspect its front end deeply.
- That the ten vetting clones are all the same quality, or that they work. I read their names, descriptions and download counts — nothing else.
- That ClawHub's `downloads` on mirrored skills are ClawHub installs. They are skills.sh install counts, re-sold.

## Next experiment (bounded, read-only, no external actions)

1. **Kill the mirror hypothesis:** ClawHub's `downloads` == skills.sh `installs` for the same skill. Test across 50 mirrored skills to confirm the metric is copied rather than measured. If true, ClawHub's "215k downloads" is an endorsement of someone else's demand, and its badge is someone else's verdict — the rebranding problem, quantified.
2. **Find the 18 ambiguous slugs:** how many distinct ClawHub skills are hidden behind a slug collision in the detail API? That is a *coverage* hole in the trust surface that no badge reveals — a skill you cannot audit is not the same as a skill with no verdict.
3. **Test whether `moderation` coverage correlates with download mass over the full population** (not a sample). If the unmoderated half carries proportionally equal demand, ClawHub's trust claim is currently decorative at scale.
4. **Check the second-order mirror:** skills.sh skills re-mirrored by *other* registries (skillsmp-style), to see whether the age-less badge format is spreading as a de-facto standard.
5. **Internal, unchanged priority:** wire a real LLM into `runtimeDeps` behind a feature flag, run exactly ONE analyze step, verify the resulting `insight.generated` no longer carries `[mock-llm]`.
6. **Do not contact publishers, registries, or scanners. Do not file issues. Do not publish. Do not post.**
