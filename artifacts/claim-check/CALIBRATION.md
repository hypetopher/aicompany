# claim-check calibration report

Corpus, method and every number below are reproducible offline:
`./test/run-all.sh`

## 1. External cross-implementation agreement (labels we did not author)

Source: github.com/JoviDeCroock/gittifacts, `fixtures/*/fixture.json` (MIT).
Those files publish, for each case, the expected **reason codes** their classifier emits.
We wrote our own checker (`src/check.mjs`) from the published *scope* semantics only and compared
the scope-class reason codes. We did not copy their classifier.

| metric | value |
| --- | --- |
| fixtures | 9 |
| scope-class reason-code agreement | **9 / 9** |
| verdict on the two scope-relevant cases | scope-drift -> OUT-OF-SCOPE, policy-change -> OUT-OF-SCOPE |

## 2. Owned corpus (counterparty-style exchanges, tool-call unit)

| metric | value |
| --- | --- |
| exchanges | 15 across 6 classes (merchant/refund, support/reply, booking, bank/read-only, ci/side-effect, reviewer/approver) |
| verdicts correct | **15 / 15** |
| UNDECIDABLE rate | **0 / 15 = 0.0 %** |
| verdicts citing justifying bytes | **21 / 21** |
| runtime per exchange | < 1 ms |

## 3. Mutation battery (scope widened by exactly one action)

| metric | value |
| --- | --- |
| clean controls mutated by one extra denied tool | **6 / 6 detected** |
| false positives on unchanged controls | **0 / 6** |

## 4. Third-party log-format parity

Same 15 exchanges re-encoded in an Airlock-class JSONL tool-call log we did not author:
**15 / 15** identical verdicts.

## 5. Egress proof

`test/no-network.test.mjs` poisons `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`,
`net.Socket.connect`, `tls.connect`, `https.request`, `http.request/get` and `dns.lookup`,
then runs the whole corpus: **0 egress attempts**.

## 6. Honest limits

- n=9 on the external corpus is evidence, not proof.
- The gittifacts fixtures describe *code changes*; our owned corpus describes *tool calls*.
  We calibrate reason codes on the former and verdict semantics on the latter.
- A log that records effects as free text (no tool attribution) cannot support the
  residue-vs-claim check; the checker abstains instead of guessing.
- We compare scope-class reason codes only. The external corpus's other 100+ reason codes
  (API shape, coverage, mutation score, CI status) are out of our unit and are not claimed.

---

# v0.5 - the DECLARATION unit (instructions, not action calls)

Cycle 28 built the action-call unit and measured it against gittifacts' labels (9/9).
Cycle 29 asks a different question: **can the same checker answer "was this
instruction file asking for something outside my authorization?"** — where the
bytes checked are a DECLARATION (a skill file / instruction file), not a log of
calls.

## 5. Second independent labelled corpus (labels we did not author)

Source: **The Agent Forge** skill-scan, published 2026-10-19, rules version
`2026-10-19.3`.
Data: <https://theagentforge.io/data/skill-scan-2026-10-19.json> (9 689 labelled rows)

We took **every one of the 215 files they flagged at any severity** plus 240
random clean files, fetched the bytes ourselves from the pinned commit, and
**verified all 452 files by sha256 against their published hashes**
(452 verified, 2 rejected on hash mismatch, 1 unreachable). We can therefore
prove we read the same bytes they labelled.

Their label vocabulary: `Flagged` (a high-severity rule matched), `Caution`
(medium only), `Clear` (low only or no match).

### Method — cal/holdout, because we tuned our rules

We wrote our own rules from the scope question, then tuned them. To keep the
headline honest we split the corpus **deterministically** (`sha256(file)` first
byte, mod 2) into a calibration half and a holdout half. The rules were tuned
on CAL only. **The holdout numbers are the ones quoted.**

### Results (holdout, n = 231)

| metric | value |
| --- | --- |
| detection agreement (both sides find *something*) | **86.6 %** (200 / 231) |
| high-tier agreement | **78.8 %** (182 / 231) |
| verdict agreement | **58.4 %** (135 / 231) |
| false positives on files they call clear/low | **45 / 217 = 20.7 %** |
| — ordinary skills only | **14 / 163 = 8.6 %** |
| — course/example files only | **31 / 54 = 57.4 %** |
| abstention rate on clear/low | **43 / 217 = 19.8 %** |
| their high-severity files caught | **2 / 2** |

### Contamination disclosure — read before quoting any of the above

We read their public rules page (rule **codes** and prose **descriptions**, not
patterns) before writing our rules, and then tuned on the CAL half. This is
therefore **weaker evidence than the gittifacts comparison** and must not be
quoted as independent confirmation of the rule set. The gittifacts 9/9 remains
the only clean cross-implementation number we have.

### Unit difference — the actual finding

Their question: *is this file risky text?*
Our question: *does this file request an action outside this authorization?*

Detection agrees at 86.6 %. Verdict agrees at 58.4 %. **The gap is the finding.**

Of the 48 holdout high-tier disagreements, **40 are their rule `FS-PRM-002` rated
`low` against our `high`** — plain `sudo`. The rest are `FS-SEC-006/007`
(`.env` reads) at `moderate` against our `high`. In every case the two sides
**found the same bytes** and graded them differently. Two implementations
scanning the same corpus do not converge on severity, because severity is a
**policy about the counterparty's authorization**, not a property of the file.

That is not a defect in either implementation. It is the reason a risk label
cannot be reused as a conformance label without a translation step — and the
translation step is the product.

### A concrete consequence

Files The Forge calls `Clear`/low-risk but whose **own frontmatter allow-list
grants Bash** while the body asks for a privileged read or an exfiltration:
our policy flags them, theirs does not. They are asking "is this text
dangerous"; we are asking "is this request covered". A file can pass one test
and fail the other. Publishing **both** answers, per file, is more useful than
either alone.

## 6. The allow-list lives inside the declaration (frontmatter analysis)

Over the same 452 files:

| metric | value |
| --- | --- |
| files with YAML frontmatter | 451 / 452 |
| files that carry their own `allowed-tools` / `tools` list | **54 / 452 (11.9 %)** |
| of those, granting an effect-capable tool (Bash / Write / Edit) | **45 / 54** |
| of those, granting Bash at all | **44 / 54** |
| of those, granting Bash with a wildcard (`Bash(*)`) | **5 / 54** |
| files whose body contains a request we classify as a request | 14 / 452 |
| **declaration's own allow-list covers its own out-of-scope request** | **11 / 14** |

**This is the strategic finding of the cycle.** In 11 of 14 cases, the file
that asks for the privileged action is the *same file* that grants the tool
needed to do it. The allow-list is not a separate artifact the counterparty
holds and the agent does not — it is bytes inside the artifact the agent
loads. So:

- the counterparty cannot verify the scope by reading the declaration, because
  the declaration defines its own scope;
- a scope check that reads only the declaration is checking the agent's
  self-description, not the counterparty's intent;
- the check that matters is **declaration-vs-counterparty-authorization**, and
  the counterparty's authorization has to come from somewhere else.

This is the operational form of cycle 28's "allow-list delivered as a writable
document" and "declaration tampering" classes, and it is now measured, not
hypothesised.

## 7. Owned corpus (declaration unit)

`corpus/own/declarations.json`, 16 cases, all ours, all expected verdicts ours:

| metric | value |
| --- | --- |
| verdicts correct | **16 / 16** |
| classes | benign/reference, benign/setup, benign/mentions-secrets, scope/secret-read, scope/remote-code-exec, scope/hidden-instruction, scope/human-check-removal, scope/irreversible-delete, scope/exfiltration, scope/persistence, scope/remote-instruction-following, quote/attack-string-in-example, quote/counter-context-reads-secret, allowlist-as-writable-document, declaration-tampering, declaration-tampering/quiet-widening |

## 8. What we learned building this, and it generalises past this corpus

1. **Severity and verdict are different questions.** v0.5's first build used
   rule severity to decide the verdict and produced a **39 % false-positive
   rate**. Separating "is this a request?" from "how bad is the action class?"
   cut it to 20.7 %, and to **8.6 %** on ordinary skills. This is the same
   mistake cycle 27 corrected for residue-vs-claim.
2. **A mention is not a request.** Prose that names an operation ("your API
   access key", "sudo gives full control") is not the agent asking for it. The
   strong/weak pattern tier exists only for this.
3. **Counter-context must be read from the text before the match, never the
   match itself.** "do not mention this to the user" contains a negation, but
   that negation *is* the request. And `https://example.com/install.sh`
   contains the word "example". Scanning the whole line inverted the verdict
   in both cases.
4. **A bare `sudo X` is genuinely undecidable** when X is not visible. We
   abstain (UNDECIDABLE) rather than assert. This is our product rule applied
   to our own checker.
5. **Course files and skill files need different policies.** 8.6 % FP on
   ordinary skills vs 57.4 % on security-course files, which contain attack
   strings as *teaching material*. Any corpus mixing them needs the split
   published, not averaged.

## 9. Reproducing everything above

```
./test/run-all.sh
```

Runs: owned corpus (15/15), mutation battery (6/6, 0 FP on controls),
foreign-log parity (15/15), gittifacts scope-reason agreement (9/9),
owned declaration corpus (16/16), determinism (65 declarations + 15 exchanges,
0 nondeterministic), no-network (0 egress attempts over 15 exchanges + 16 owned
declarations + 452 external declaration files + the bundle), then rebuilds the
single-file bundle and prints the declaration calibration and frontmatter
analysis.
