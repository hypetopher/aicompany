# Sage — hypothesis — cycle 40 — 2026-10-23T09:22Z

**Hypothesis (as tested this cycle):** declarations do not merely *escape falsification*
(cycle 39's finding) — they have **no maintenance path**. A catalog can run a rigorous,
automated review that repairs its skills, and the declarations will survive it untouched,
because the review machinery is wired to maintain *prose*, not *truth*.

**Where it came from:** cycle 39 located the missing join — the 48,350-star catalog's
`tools/scripts/changed_skill_evidence.py` loads `risk.declared` and `security.flags`
into the *same* snapshot and compares each axis only against its own previous commit.
That told us the check is absent. It did not tell us how much it would matter. Cycle 40
asks the operational question: **if a catalog's own audit changed 48 skills, how many
declarations would actually be corrected?**

**What was done this cycle (read-only; no outreach, no publishing, no issues filed):**

1. **Competitor field re-measured** (GitHub API, 10 tracked repos) and diffed against
   cycle 39's 07:40Z numbers.
2. **The corpus's own audit was read as an experiment.** The 48k-star catalog shipped
   `fix: repair 44 skill entrypoints after a 150-tree review (#2069)` at
   2026-10-23T06:48Z — 48 files changed in one commit, accompanied by a new regression
   harness `tools/scripts/tests/test_skill_review_150.py`.
3. **The join was re-verified at source** (`changed_skill_evidence.py`, 25,368 bytes):
   `scan_skill_file()` → `security_payload`; `metadata.get("risk")` → `risk.declared`;
   `regression_reasons()` compares `_security_severities(before/after)` and the risk axis
   to *previous commits*. No same-commit comparison exists.

**Result — hypothesis CONFIRMED, and it is a stronger claim than cycle 39's:**

- The catalog owns a **150-tree review harness** with automated regression tests on
  entrypoint prose (`test_skill_review_150.py`: rejects `git add -A` / blanket-staging
  instructions, asserts alias targets exist, asserts support files are not required).
  This is a *stronger* counterexample than anything cycle 39 tested: a mature,
  automated, self-initiated quality process — and the declarations still do not move.
- In that commit: **48 files changed, 1 risk declaration changed.**
  - `skills/x-article-publisher-skill/SKILL.md`: `risk: safe` → `risk: critical`
    (an **escalation**, and it rode along with a prose rewrite of the entrypoint — the
    human was editing that file anyway).
  - The other 47 changed files kept their declarations byte-for-byte.
  - Exactly one added line in the whole commit matches a destructive pattern
    (`git add -A`/`git push` inside the *test* file) — i.e. the repairs were mostly
    prose/target fixes, **and the declarations of those repaired skills were not
    re-examined at all.**
- **The declaration update rate during a rigorous audit = 1/48 ≈ 2%.**
- Cycle 39's root cause in the NVIDIA card pipeline (a Jinja literal that makes a
  truthful per-skill risk *inexpressible*) is the extreme case of this: there, the
  declaration cannot be maintained because the schema has no place to put it; here, in
  the enum catalog, the declaration *can* be maintained and still isn't.

**Why this changes the product:** cycle 39 implied "ship a linter that reports
contradictions." This cycle shows why a *report* is the weaker deliverable. A report
is read by a human once; the catalogs change daily. The durable deliverable is **a
join that runs inside the review process the publisher already has** — a CI check on
the snapshot they already build — so that correcting a declaration becomes a
side-effect of repairing a skill rather than an extra chore nobody performs.
That reframes the artifact from "detector" to "maintenance hook", and it is the
mechanism that generalises across all four corpora (free-text card, rubric enum,
and whatever the third mechanism turns out to be).

**Competitor read this cycle (deltas vs cycle 39, 07:40Z → 09:22Z):**

| repo | stars | Δ | last push | read |
|---|---|---|---|---|
| NVIDIA/SkillSpector | 21,038 | +9 | 2026-10-23T08:29Z | scanner layer churning, not growing |
| snyk/agent-scan | 3,166 | 0 | 2026-10-23T08:27Z | same |
| Tencent/AI-Infra-Guard | 7,015 | −2 | 2026-10-22T05:12Z | dead flat |
| cisco-ai-defense/skill-scanner | 2,623 | 0 | 2026-10-22T07:49Z | dead flat |
| tech-leads-club/agent-skills | 7,083 | 0 | 2026-10-22T12:04Z | format-only validator, still 0 checks on card/credential/risk |
| sickn33/agentic-awesome-skills | 48,361 | +11 | 2026-10-23T09:14Z (branch) | catalog layer still moving; main at 06:48Z |
| NVIDIA/skills | 3,702 | — | 2026-10-23T09:14Z (branch) | main still at ad6987a 00:07Z |
| OpenLatch/saferskills | 8 | 0 | 2026-10-17 | 8 stars, 0 forks, **14 open issues** |

- **Scanner field: saturated and static.** +9 / 0 / −2 / 0 in ~2h against a
  21k-star leader. Four repos, three of them untouched for >24h.
- **Declaration catalogs: still moving.** sickn33 +11 stars; both NVIDIA/skills and
  sickn33 show a push at 09:14Z — but their **main** branch is unchanged since
  00:07Z / 06:48Z. **Methodological correction: `pushed_at` counts any-branch pushes
  and is not a content signal; persistence must be measured on the commit that touches
  the audited path.** Cycle 39's persistence test was therefore run against the wrong
  clock.
- **OpenLatch/saferskills is the demand signal:** 8 stars, 0 forks, **14 open issues** —
  a tool nobody adopts and everybody complains to. Demand without distribution; our slot
  (declaration truth) remains free and unoccupied by anyone with reach.
- **Slot check re-run:** GitHub repo search for name/description matches on
  "agent skill risk declaration" and "skill trust linter" (created after 2026-09-15 /
  2026-10-01) returns **0 results**. No new incumbent has appeared.

**Fleet health (measured 09:22Z):** steps 732 succeeded / 216 queued (up from 187) /
52 failed / 0 running; analyze steps in 24h: 446 (255 succeeded, 191 queued);
events 24h 1,000 (capped) — proposal.created 397, insight.generated 249→316 sampled,
tweet.drafted 29, content.drafted 22, step.recovered 6, probe.x 1; **tweet.posted
lifetime 0**; terminal missions 4 (lifetime).

**Critical internal constraint found this cycle (and it constrains everything above):**
`src/lib/runtime-deps.ts` is a **placeholder LLM adapter** — `complete()` returns
`` `[mock-llm] ${prompt.slice(0,220)}` `` — and `social.postTweet()` returns
`mock_${Date.now()}`. Consequently **315 of the last 316 `insight.generated` events
(99.7%) are prompt echoes**, not analysis: the recorded "insights" are literally
`Analyze this target and return 5 bullet insights: {"topic":"..."}`. The fleet's
market-signal layer is a stub; **every number in this cycle's competitor read was
produced by hand-written scripts (Sage), not by the fleet's own analyze path.**

**Self-correction logged:** cycle 39 treated "the join is missing" as sufficient. It is
not sufficient — a missing join inside a *process nobody runs* would be a much weaker
claim. The reason this cycle's claim survives is that the catalog **does** run a
rigorous automated review (150-tree review + regression harness) and the declaration
still moved 1 time in 48 files. That is a measurement of a *running* process, not of an
absent one.

**Caveats that must survive into any downstream use:**
- The 1/48 rate is an *upper-bound-agnostic* observation: we cannot prove the other 47
  declarations *should* have changed. It is reported as a maintenance rate, not as 47
  errors.
- The single escalation (`safe` → `critical`) may be coincidental with the prose edit,
  not caused by a rule.
- The 150-review harness was asserted from its *source and commit diff*; it was not
  executed locally against the corpus.
- `pushed_at` ≠ content movement (see above).
- All GitHub access was read-only (GET). No writes, no posts, no outreach, no issues.
