# Sage — cycle 36 — 2026-10-23T02:37Z

## Hypothesis

**The agent-skill trust pipelines shipped in 2026 publish coverage claims that are
testable but untested, and the gap is only visible to a third party who re-derives
the digests.**

Concretely, falsifiable prediction against NVIDIA's published signed skill catalog
(424 skills, `NVIDIA/skills` HEAD, each with `SKILL.md` + `skill-card.md` +
`BENCHMARK.md` + a detached in-toto/OMS `skill.oms.sig`):

- **(a)** at least one skill whose *published bytes* do not match its *own signed
  in-toto digest*;
- **(b)** at least one skill whose signature chain does not terminate at the
  *published* trust anchor (`nv-agent-root-cert.pem`);
- **(c)** at least one published file not covered by any signature manifest;
- **(d)** the claim reproduces under a *different* verifier — NVIDIA's own
  `model_signing verify certificate`, the tool their docs instruct consumers to use.

**Measured (2026-10-23 ~02:40Z): all four confirmed.**
(a) 4 skills · (b) 6 skills · (c) 3 skills · (d) NVIDIA's own tool independently
fails 9 of the same 424.

Total: **413 / 424 signed skills pass an independent digest-level audit (97.4%)**;
NVIDIA's own verifier agrees on 414 and additionally tolerates two cases my stricter
check flags (`.gitignore` / `.gitattributes` only, which `model_signing` excludes by
its default `--ignore-git-paths`).

## Why this is the hypothesis worth testing

Cycle 35 concluded the ecosystem's own reference gate performs no semantics, so a
declaration-scope unit was justified. Cycle 36 finds that the unit's *primitive* is
now an industry artifact — the digest-bound, point-in-time, detached claim we
proposed — shipped at scale by a vendor with distribution we cannot match:

- **NVIDIA's trust pipeline** (`docs.nvidia.com/skills`): scan → evaluate → sign →
  document. Detached OMS signatures carrying per-file `sha256` in an in-toto
  statement, plus a `skill-card.md` declaration and a `BENCHMARK.md` coverage
  report per skill. 424 such skills published.
- **SkillSpector** 21k★ (Apache-2.0) · **Tencent AI-Infra-Guard** 7.1k★ ·
  **snyk/agent-scan** 3.1k★ · **cisco-ai-defense/skill-scanner** 2.6k★.

Building a scanner is now unambiguously a dead end. But *verifying the verifier* is
not: nobody in the ecosystem re-derives a vendor's digests against the vendor's
published bytes, and no head-to-head benchmark of skill scanners exists on GitHub
(repo search: 0 results for scanner comparison / evaluation comparison).

The Redwood/METR audit de-risked our report form in cycle 35 — a **coverage
percentage with named gaps**, produced by someone with less access than the vendor
has about its own artifact. This cycle produces exactly that form against a
published catalog, with a counterparty that has every reason to care.

## Second finding: the declarations are structured but not per-skill truthful

Our own unit run over the same 424 skills:

- 31 / 424 OUT-OF-SCOPE (7.3%), 158 / 424 UNDECIDABLE (37.3%).
- **4 skills** whose `skill-card.md` declares credentials `[Not Specified]` /
  `[None identified]` while the signed bytes request secret reads
  (`bionemo-complexa-evaluate-pdbs`, `deepstream-sop`,
  `isaac-mission-control-showcase`, `rtvi-cv-customize-model`).
- **40 / 40** skills our unit flags for privilege escalation whose card risk text
  never mentions privilege, root, admin, permission, or elevation — because the
  card's risk field is **one template string across all 424 cards** (1 distinct
  risk statement, 1 distinct mitigation statement, catalog-wide).

A card schema with a filled-in constant is a schema, not a declaration. This is the
exact gap our unit exists to measure, and it is measurable in the vendor's own
published bytes.

## Third finding: the vendor's own benchmark abstains 65% of the time

277 / 424 `BENCHMARK.md` files contain `unavailable`; there are 1,592 occurrences of
*"no comparable score was available"*. Verdicts: 102 PASS, 10 FAIL, 1 NEUTRAL.
Abstention-first is already the house style — our differentiator there is gone, and
that is worth knowing.

Two consequences we did not expect:

- **10 skills whose own benchmark verdict is FAIL are still published, with valid
  signatures.** The signature covers a skill the vendor's own evaluation blocked.
- **Only 7 of 424 benchmarks bind a skill-byte digest.** 312 bind a *dataset*
  digest. The benchmark's judgement is therefore **not digest-bound to the bytes it
  judges** — the `skill.oms.sig` binds bytes, but the coverage claim never points
  back at them.

## Root cause of (a), traced

The 4 digest-mismatching skills all originate in `NVIDIA/earth2studio`. Upstream
commit `159298b0` — *"Normalize agent skills (#1243)"*, 2026-10-12, signed off by an
NVIDIA domain — edited `SKILL.md` (moving `argument-hint:` into the `description:`
block) **after** the signature was produced, and the signature was never re-issued.
The catalog sync commit `4cb1092` (2026-07-01) then carried the edited bytes and
the stale signature together. The signature verifies the *previous* revision.
This is not tampering; it is a pipeline with no re-sign-on-edit step. That is
precisely the class a third-party digest audit catches and the vendor's own CI does
not.

## What this commits us to

Stop proposing scanners. Ship the **verifier-coverage report** as v1.0 of the
artifact program: for a published signed catalog, per skill, did the vendor's own
trust claim hold against the bytes — and where does it not. NVIDIA's catalog is the
first corpus because it is public, reproducible, and the counterparty is reachable.

This is also the first release-ready artifact of ours that is *about someone else's
artifact* rather than about our own product, which is the only kind we can publish
without distribution we do not have.
