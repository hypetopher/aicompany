# claim-check v0.7

A counterparty-side **scope-conformance** checker: was each action the agent took inside the
scope the counterparty authorized? Deterministic, offline, zero dependency, no key, no CA, no
vendor, no network, no model call.

```
node claim-check.mjs corpus/own/exchanges.json
node src/run_corpus.mjs       # owned corpus + mutation battery + foreign-log parity
node src/calibrate.mjs        # cross-implementation agreement vs an external labelled corpus
node test/no-network.test.mjs # proves zero egress attempts
```

## Measured results (this build)

| Metric | Result |
| --- | --- |
| External cross-implementation agreement (gittifacts fixtures, scope-class reasons) | **9 / 9** |
| Owned corpus verdicts | **15 / 15** |
| UNDECIDABLE rate | **0 / 15 = 0.0 %** |
| Scope-widening mutations detected | **6 / 6** |
| False positives on unchanged controls | **0 / 6** |
| Verdicts that cite justifying bytes | **21 / 21** |
| Third-party (Airlock-class) log format parity | **15 / 15** |
| Egress attempts during a full corpus run | **0** |
| External corpus agreement, **detection** (The Agent Forge skill-scan, holdout) | **86.6 %** (200 / 231) |
| External corpus agreement, **verdict** (same holdout) | **58.4 %** (135 / 231) |
| False positives on ordinary skills they call clear/low | **8.6 %** (14 / 163) |
| Abstention rate on clear/low files | **19.8 %** (43 / 217) |
| Owned declaration corpus verdicts | **16 / 16** |
| Determinism (declarations + exchanges) | **0 nondeterministic / 80 checked** |


## Third external corpus: shootout, side by side with two shipping scanners

`corpus/shootout/` is the corpus published by github.com/rajeews/skill-scanner-shootout: 24 inert
samples (18 planted flaws, 6 benign controls), a published answer key, and the author's published
per-sample results for **10** scanner configurations (Cisco skill-scanner x6, NVIDIA SkillSpector x4).

We did not author those labels and we did not modify a single rule against this corpus. Every file
was sha256-recorded at read time; the third-party results file is vendored so the harness makes zero
network calls.

| | declaration-level flaws | code-level flaws | benign controls flagged |
| --- | --- | --- | --- |
| **claim-check (ours)** | **3 / 4** | 0 / 14 | **0 / 6** |
| Cisco skill-scanner, default | 2 / 4 | 5 / 14 | 1 / 6 |
| Cisco skill-scanner + LLM judge | 4 / 4 | 9 / 14 | 1 / 6 |
| Cisco, strict policy | 2 / 4 | 5 / 14 | 2 / 6 |
| NVIDIA SkillSpector, offline | 3 / 4 | 10 / 14 | 4 / 6 |
| NVIDIA SkillSpector + LLM judge | 4 / 4 | **13 / 14** | **4 / 6** |

Our unit is *scope conformance over a declaration*; theirs is *package vulnerability*. The corpus
author labels a flaw family, not an authorization breach - these are different questions over the
same bytes, and the unit must travel with the number.

Known gaps, published rather than hidden:
- `skill-17` - our false negative on the declaration unit (**1/4**). Not fixed against this corpus:
  a corpus you tune on is not a corpus you can report a holdout number from.
- `skill-13` (`n12-path-traversal`) - caught by **nobody** in the ecosystem, including us.
- `skill-10` - a declaration that says *"Never modifies or deletes files"* while its script calls
  `shutil.rmtree`. Caught by only 2 of 10 configurations. This class is ours.

## The external corpus
`corpus/gittifacts/` is the fixture corpus published by github.com/JoviDeCroock/gittifacts (MIT).
We did not author those labels and we did not copy their classifier - we implemented our own
checker and compared the **scope-class reason codes** our checker emits against the expected
reason codes their fixtures publish. The comparison is the point: two independent
implementations, one set of labels, agreement measured rather than asserted.

## What the verdict means
- **IN-SCOPE** - the action is inside the allow-list and inside every limit.
- **OUT-OF-SCOPE** - the action broke an allow-list, a denial, a limit, or contradicts the log.
- **UNDECIDABLE** - the bytes needed to decide are missing. We refuse to guess.

Every reason cites the exact bytes that justify it, so a counterparty can point at the line.

## Honest limits
- The external corpus is 9 cases from one repository. Agreement at n=9 is evidence, not proof.
- The gittifacts fixtures are about *code changes*; our owned corpus is about *tool calls*.
  We calibrate the reason codes on the former and the verdict semantics on the latter.
- Our residue model expects effects to be attributed to a tool. A log that records only
  free text cannot be checked for residue-vs-claim contradiction; it abstains instead.

---

## v0.5: the declaration unit

`claim-check` v0.5 checks a second unit: the **declaration** (an instruction
file) rather than the action log.

```
node claim-check.mjs --declaration SKILL.md
```

It answers: *does this file ask the agent to do something outside the
authorization?* The rules are in `src/check_declaration.mjs`; the reasoning
that produced them, the false-positive history, and the external calibration
are in `CALIBRATION.md` sections 5-9.

The two most important properties of the design:

- **A mention is not a request.** Rules have a *strong* tier (the bytes are the
  operation) and a *weak* tier (the bytes name the operation). Only a strong
  match in an instruction position can produce OUT-OF-SCOPE.
- **Severity never decides the verdict.** "Is this a request?" and "how bad is
  this action class?" are separate questions. Conflating them caused a 39 %
  false-positive rate in the first build.

The corpus used for calibration is The Agent Forge's 2026-10-19 skill scan
(9 689 labelled rows). All 452 files we checked are sha256-verified against
their published hashes. Their labels are theirs; our rules are ours; see
`CALIBRATION.md` for the contamination disclosure and why their numbers and
ours answer different questions.
