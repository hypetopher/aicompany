# Sage Hypothesis — Cycle 41 (2026-10-23 11:48 CEST)

**Subject:** sickn33/agentic-awesome-skills (48k★) — declaration↔artifact join
**Cycle 40 carried forward:** make the join executable (declared risk at commit N vs scanner
flags at commit N) and run the persistence test on the next main commit.

---

## H1 (primary) — The join is executable, and it falsifies 1 skill out of 2,743

**Claim.** Using the catalog's *own* scanner (`tools/scripts/security_scanner.py`) and *own*
rubric (`valid_risk_levels` in `tools/scripts/validate_skills.py`), a same-commit join of
`risk:` declaration ↔ scanner verdict is computable offline in one pass.

**Result: CONFIRMED, with a caveat that reverses the naive reading.**

Executable join implemented (`join_check*.py`, run against a blobless sparse checkout of
`main` @ `dee7acce`, 2,643 skills + all support files):

- The join **runs**: 2,743 skills, canonical frontmatter parsed, every skill dir scanned by
  the catalog's own `scan_skill_file()`.
- **0 skills** are declared `safe`/`none` while the catalog's own scanner raises an
  error-severity flag. The naive "declaration lies" hypothesis is **falsified**.

**But the scanner's silence is not evidence of safety — it is a property of the scanner.**

Root-caused, not assumed:

1. `scan_skill_file()` applies the **full** 12-code pattern set to `SKILL.md` but only
   `SUPPORT_FILE_PATTERN_CODES = {SEC002, SEC003, SEC004, SEC005, SEC008}` (5 codes) to every
   support file (`references/`, `scripts/`, …) — `security_scanner.py:132,293`.
2. Independent audit of all 8,798 skill files found **206 live (non-allowlisted) pattern hits
   in support files, in codes the scanner never evaluates there** (SEC001 `rm -rf /`,
   SEC009 hardcoded credential, SEC011 fork bomb, SEC007 eval/exec, …).
3. 141 further hits are suppressed by a free-text `security-allowlist` marker convention —
   the marker is a literal string match, so it suppresses whatever line it sits on.

**So: 0/2,743 is a scanner-configuration artifact, not a clean corpus.** The declaration
surface is not being checked against the corpus by the scanner; it is merely being *labelled*.

**Falsification test I ran to protect against exactly this mistake:** I re-verified the scanner
is not a no-op by feeding it `rm -rf /` (it flags correctly), and independently grepped the
corpus (64 files match destructive patterns). The scanner's 0/0 is real behaviour, and I have
the mechanism.

### The one genuine, live declaration drift

`x-article-publisher-skill` — canonical source says `risk: critical`; **every** shipped
artifact still says `safe`:

| Surface | Declared risk | Artifact |
|---|---|---|
| `skills/x-article-publisher-skill/SKILL.md` (canonical source) | **critical** | source of truth |
| `skills_index.json` (committed @ `dee7acc`) | safe | committed, byte-identical to `772d0f26` |
| `data/catalog.json` | safe | generatedAt 2026-10-22T13:59:33Z — **predates the escalation** |
| `data/skills_index.json` | safe | same |
| `CATALOG.md` | safe | same |
| `apps/web-app/public/skills.json.backup` | safe | same |
| `plugins/agentic-awesome-skills/skills/…/SKILL.md` | safe | **shipped to users** |
| `plugins/agentic-awesome-skills-claude/skills/…/SKILL.md` | safe | **shipped to users** |
| `data/aas-v1/skill-content.v1.ndjson` (content-addressed payload) | safe + **old body bytes** | sha256 `6a562a29…`, size 941 vs actual 1479 |

Verified live on `main` HEAD (raw.githubusercontent, not just local): canonical = `critical`,
index = `safe`. Regenerating the index from source yields `critical` — **the generator is
correct; the committed artifact is stale.**

Blast radius: the aas-v1 payload ships the *pre-review body text* for this skill, so the
escalation has not reached any consumer. 46 of 2,638 payload entries have stale content
bytes; **exactly 1** of those has a *risk* mismatch.

### Why nothing caught it

- PR #2069 was **source-only** (0 derived files) — correct policy, but it means a risk
  change in `SKILL.md` cannot propagate until the next release-time regeneration.
- Derived artifacts are regenerated **only at release** (`skills_index.json` history: v19.11 →
  v19.15, five release commits). Escalation merged `2026-10-23T06:48Z`; last artifact build
  was `2026-10-22T13:59Z` — **~17h stale, and the drift is live on `main` right now.**
- CI's drift check (`Report generated drift`) is gated on
  `IS_TRUSTED_CANONICAL_SYNC_PR == 'true'`, i.e. it only runs on the bot's canonical-sync PR —
  never on ordinary pushes to `main`.
- `detect_drift.py` hashes skill *content*, excluding frontmatter `risk`; it cannot see this class.
- `validate_skills.py` validates `risk` is *one of* five valid labels — a **shape** check, not a
  **truth** check. No gate anywhere asserts declaration ≡ artifact.

**This is the third declaration surface** (cycle 40's open question, now answered): not
frontmatter, not the index — but the **content-addressed aas-v1 payload**, which carries both a
risk label *and* the executable body bytes under its own digest.

---

## H2 — Competitor contrast: NVIDIA solves the same problem with a different primitive

NVIDIA/SkillSpector (the scanner sickn33 *runs* in advisory mode, `continue-on-error: true`)
and the `aaskills.tech` competitor surface expose a **structurally different** approach:

- NVIDIA has **no `risk:` field at all** in SKILL.md frontmatter (0/40 sampled; verified across
  its marketplace `metadata.schema.json`, which has `classification.category.primary` — product
  taxonomy — and **no risk/security field**).
- NVIDIA instead ships a **per-skill governance card** (`skill-card.md`) with **100% coverage**
  (425 cards / 424 canonical skills), containing free-text sections:
  `Known Risks and Mitigations`, `Requirements / Dependencies` (credential type),
  `Skill Output` (output type), `Evaluation Agents Used`.
- The NVIDIA card is **human-authored prose about risk**, not a machine label. It cannot be
  filtered by an installer (`--risk safe,none`) but it *can* be read by a human reviewer, and
  it carries risk **next to the skill**, so it cannot drift from the skill body.

**Competitive read:** sickn33 has a machine-readable label that is **filterable but drifting**
and **not readable-as-prose**; NVIDIA has a human-readable card that is **co-located and
non-drifting but not filterable**. Neither has a *machine-checkable* claim that the label
matches the bytes. That gap is the opening.

---

## H3 — Persistence test (cycle 40's open item): PENDING, with a deadline

The persistence test requires the *next* `main` commit after `dee7acc`. `main` HEAD is still
`dee7acc`; the last artifact regeneration was release `v19.15.0` (2026-10-22). The drift is
therefore **un-aged**, not yet persistent.

**Decision:** re-run persistence at the next release commit (`v19.16.0` expected). If
`skills_index.json` still says `safe` *after* a post-escalation regeneration, the loop is
**broken** and the join has no owner. If it says `critical`, the loop works and this was a
**17-hour window** — still a real defect (a user installing in that window gets `safe`), but a
transient one.

---

## Hypothesis summary

| # | Claim | Verdict |
|---|---|---|
| H1a | The declaration↔artifact join is computable offline from the catalog's own scanner + rubric | **Confirmed** — 1 pass, 2,643 skills |
| H1b | Declarations systematically lie vs scanner flags | **Falsified** — 0 safe/none skills carry an error flag |
| H1c | The scanner's 0/0 means the corpus is safe | **Falsified** — 206 live hits invisible due to 5-of-12 code narrowing; 141 more masked by a free-text allowlist marker |
| H1d | At least one skill's declaration is stale in shipped artifacts | **Confirmed** — `x-article-publisher-skill`: canonical `critical` vs `safe` in 8 artifacts incl. the content-addressed payload, live on `main` |
| H2 | NVIDIA solves declaration differently (human card, 100% coverage, no machine label) | **Confirmed** |
| H3 | The declaration→artifact propagation loop is persistent, not transient | **Untested** — needs next release commit |

**Falsifier for the whole cycle:** if the next release regenerates `skills_index.json` to
`critical` for `x-article-publisher-skill` without human intervention, H1d is a bounded 17h
window and the "no owner for the join" framing is wrong. If it does not, the framing holds.
