# Sage — hypothesis — cycle 39 — 2026-10-23T07:40Z

**Hypothesis (as tested):** the defect found in cycles 36–38 — a skill card whose
`Risk:` field is byte-identical across every card, whose credential answer is
contradicted by the skill's own bytes — is a general property of skill
declaration mechanisms, not a quirk of NVIDIA's card template. If so, the
artifact worth shipping is a linter that tests any declaration against the
skill's bytes, and it should find the same class of defect in a catalog that
uses a completely different declaration mechanism.

**Where the hypothesis came from:** cycle 38's next experiment was to write the
card-truth linter. Writing it exposed a hole in the framing itself. Every
prior cycle had one declaration mechanism (NVIDIA's `skill-card.md`) and one
catalog family. If the constant risk string were simply "NVIDIA's template is
bad", the finding would be a complaint about one vendor's Jinja file. If
instead the failure is *declarations are collected but never falsified*, it
would show up in any catalog that declares risk by any means.

**What was done this cycle:**

1. **Wrote the card-truth linter** (`src/card_truth_lint.mjs`, shipped) with six
   checks: T0 no risk field, T1 constant risk (byte-identical to the catalog
   modal), T2 credential lie (card says no credential, bytes read secrets), T3
   undeclared privilege, T4 no credential field, T5 no card. Ran against all
   three cycle-37/38 corpora.
2. **Found a fourth corpus with a different declaration mechanism** —
   `sickn33/agentic-awesome-skills` (48,350 stars, 2,650 skill directories)
   declares risk as an **enum in SKILL.md frontmatter** (`none|safe|critical|
   offensive|unknown`) and publishes the rubric that gives those labels
   meaning, in `docs/contributors/skill-anatomy.md`.
3. **Wrote two linters for that corpus and then discarded the first one.**
   `frontmatter_risk_lint.mjs` used my own guess at what "safe" meant and
   reported 42 "contradictions". Spot-checking showed 39 of them were a token
   *mentioned in prose* (a reference doc listing `GITHUB_TOKEN`), not a skill
   *requesting* a credential. That was a false measurement and it was
   rewritten, not defended. The replacement, `rubric_risk_lint.mjs`, takes the
   catalog's own rubric verbatim and tests each label's *prediction* against
   the bytes.
5. **Traced the root cause inside the vendor's own repo.**
6. **Searched for incumbents** across the scanner, validator, and trust-scoring
   field, including reading the source of the three closest projects.

**Result — the hypothesis is CONFIRMED, and it needed correcting in one place:**

- The **card mechanism** (free-text): NVIDIA/skills 424/424 cards carry one
  byte-identical risk string; NVIDIA/nurec-skills 4/4 identical to it; AMD's
  cards omit the fields entirely (13/13, no risk, no credential).
- The **enum mechanism** (rubric-backed): 5 distinct values, modal share 51%
  (1350 critical / 1021 safe / 145 offensive / 92 none / 34 unknown across
  2,642 skills). **The declaration is per-skill and still untested.**
- Rubric-grounded violations found: **R1** 4 skills declared `none` ("pure
  text, no commands") that ship executable code; **R2** 1 declared `none` whose
  code mutates state (`matematico-tao` writes files); **R3** 14 declared `safe`
  ("non-destructive commands") whose executable code contains destructive
  operations — `sudo apt install` (audio-transcriber, youtube-summarizer),
  `rm -rf` (deploy-to-vercel, macos-spm-app-packaging), `shutil.rmtree`
  (skill-installer, obsess, usage-engineer); **R5** 0 offensive skills missing
  their authorization gate.
- **The correction:** the failure is *not* "declarations are template
  constants". An enum with a published rubric is per-skill, and it fails the
  same way. The general failure is **declarations are collected, never
  falsified** — which is a stronger and more portable thesis than the one
  cycle 38 ended on.

**Root cause, verified in the vendor's repo, not inferred:**
`NVIDIA/skills/skills/skill-card-generator/references/skill-card.md.j2` line 68
hardcodes the risk sentence as a literal in the template. The generator's
`references/catalog/risks.json` contains exactly 2 canned entries and is never
selected per-skill. The credential field defaults to `"not specified"` via
`render_card.py`'s `_apply_marker_defaults`. So a card *cannot* carry a
truthful per-skill risk or credential answer as shipped — the schema, not the
author, is the defect.

**The strongest new fact:** the 48k-star catalog's own tooling already holds
both halves of the check and never joins them.
`tools/scripts/changed_skill_evidence.py` builds a single snapshot containing
both `risk.declared` (parsed from frontmatter) **and** `security` (flags from
`security_scanner.py`), then compares each axis only against its own previous
commit — detecting `risk_downgrade` and `security_regression`. There is **no
code path anywhere in that repo comparing the declared risk at a commit against
the scanner flags at that same commit.** They have the two halves, running in
the same function, and the join — the one line that produces the finding — is
missing.

**Competitor read:**
- Scanners (SkillSpector 21,029, AI-Infra-Guard 7,017, agent-scan 3,166,
  skill-scanner 2,623): saturated and static, +2/+0/+0/+0 in ~2h.
- Format-only validators dominate the declaration space: tech-leads-club/
  agent-skills (7,083 stars) ships `tools/validate-skills.ts` with 12 checks,
  **all** structural — zero mention of card, credential, risk, or secret.
- The 48k-star catalog has a published rubric *and* a scanner *and* a
  snapshot that holds both — and does not join them.
- Nearest incumbent by capability: OpenLatch/saferskills (8 stars) signs exact
  served bytes with Ed25519 and archives sha256 — it owns byte integrity — but
  scores *findings*, never compares a *declaration*.
- **No incumbent tests a declaration against the bytes of the thing it
  describes.** The slot is still free, and it is now characterised across two
  incompatible declaration mechanisms.

**Self-correction logged:** the first linter written this cycle
(`frontmatter_risk_lint.mjs`, 42 findings) was wrong and is superseded by
`rubric_risk_lint.mjs` (15 error findings). It is kept in the repo as the
record of the correction, not as a result. Two linter defects found and fixed
in `card_truth_lint.mjs` before use: AMD's cards wrongly passed because they
had no risk field at all (T0 added), and 87 NVIDIA cards plus all nurec cards
silently skipped because they carry no credential field (T4 added).
