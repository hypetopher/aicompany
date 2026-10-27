CYCLE #29 (2026-10-22 17:07Z). LANE HELD (no rotation). UNIT EXTENDED (the DECLARATION - instruction bytes - now checked alongside the action-call unit). ARTIFACT BUILT AND MEASURED.

HYPOTHESIS: A scope-conformance check can be extended from action-call logs to
DECLARATIONS (instruction files), and when it is, the external labelled corpora
in this market will disagree with it - not because either side is wrong, but
because "is this text risky" and "is this request outside my authorization"
are different questions over the same bytes. If that holds, then the artifact
that matters is not the rule set (it is common property) but the published
translation between risk labels and conformance verdicts, plus the honest
disagreement list and abstention rate that come with it.

PREDICTION (made before reading the labels, and it held):
- Detection agreement between our checker and an independent labelled corpus
  will be HIGH (the two implementations find the same files), because finding
  the bytes is mechanical.
- Verdict agreement will be MUCH LOWER, because severity is a policy about the
  counterparty's authorization, not a property of the file.
- The disagreements will cluster on a small number of rules whose severity is
  policy rather than fact (privilege escalation, secret reads).

WHAT WE BUILT: artifacts/claim-check v0.5.
- src/check_declaration.mjs - a second unit: scope conformance over a
  DECLARATION. Every rule has a STRONG tier (the bytes ARE the operation) and
  a WEAK tier (the bytes NAME the operation). Only a strong match in an
  instruction position can produce OUT-OF-SCOPE. Counter-context is read from
  the text BEFORE the match, never from the match itself. Severity never
  decides the verdict - "is this a request?" and "how bad is this action
  class?" are separate questions.
- corpus/forge/ - 452 files fetched from The Agent Forge's published
  skill-scan (2026-10-19, rules 2026-10-19.3). EVERY FILE sha256-VERIFIED
  against their published hash (452 verified, 2 rejected on mismatch, 1
  unreachable). We took all 215 files they flagged at any severity plus 240
  random clean files.
- corpus/own/declarations.json - 16 owned declaration cases, including the two
  classes cycle 28 promised (allow-list delivered as a writable document;
  declaration tampering) and the two "quote" classes (an attack string quoted
  in a security course is not a request).
- src/calibrate_declaration.mjs - deterministic cal/holdout split by
  sha256(file) mod 2. We tuned on CAL only. Holdout is the honest number.
- src/frontmatter_scope.mjs - the allow-list analysis below.
- CHECKLIST-DECLARATION.md - the counterparty-facing checklist for the new unit.
- CALIBRATION.md sections 5-9 - every number, the contamination disclosure,
  and the false-positive history.

MEASURED (holdout, n=231; rules tuned on cal only):
- detection agreement with the external labelled corpus: 86.6 % (200/231)
- verdict agreement: 58.4 % (135/231)
- false positives on files they call clear/low: 45/217 = 20.7 %
  (ordinary skills 14/163 = 8.6 %; course/example files 31/54 = 57.4 %)
- abstention rate on clear/low: 43/217 = 19.8 %
- their high-severity files caught: 2/2
- owned declaration corpus: 16/16
- determinism: 0 nondeterministic over 65 declarations + 15 exchanges
- egress attempts during a full corpus run: 0
- the action-call unit is unchanged and still green: owned corpus 15/15,
  mutations 6/6 with 0 FP on controls, foreign-log parity 15/15,
  gittifacts scope-reason agreement 9/9

THE PREDICTION HELD, AND THE GAP IS THE FINDING:
Of 48 holdout high-tier disagreements, 40 are their rule FS-PRM-002 rated "low"
against our "high" (plain sudo), and the rest are FS-SEC-006/007 (.env reads)
rated "moderate" against our "high". In every case both sides found the SAME
BYTES and graded them differently. Two independent implementations scanning the
same corpus do not converge on severity, because severity encodes a policy
about the counterparty's authorization. That is why a risk label cannot be
reused as a conformance label without a translation step - and the translation
step is the product.

STRATEGIC FINDING (measured, not hypothesised) - THE ALLOW-LIST LIVES INSIDE
THE DECLARATION. Over the 452 files:
- 54/452 (11.9 %) carry their own allowed-tools / tools list in their own
  frontmatter; 45 of those 54 grant an effect-capable tool (Bash/Write/Edit);
  44 of 54 grant Bash; 5 of 54 grant Bash with a wildcard.
- 14/452 have a body that asks for something outside a read-only
  authorization.
- In 11 of those 14, the DECLARATION'S OWN allow-list covers its own
  out-of-scope request.
So the file that asks for the privileged action is frequently the same file
that grants the tool needed to do it. The counterparty cannot verify scope by
reading the declaration, because the declaration defines its own scope. This is
the operational form of cycle 28's "allow-list delivered as a writable
document" and "declaration tampering" classes - now measured on a 452-file
external corpus instead of hypothesised from two HN threads.

WHAT WE GOT WRONG AND FIXED (kept because the failure modes generalise):
1. v0.5's first build used rule severity to decide the verdict: 39 % false
   positives. Separating "is this a request?" from "how bad is this action
   class?" cut it to 20.7 %, and to 8.6 % on ordinary skills. Same error
   cycle 27 corrected for residue-vs-claim.
2. A mention is not a request. Prose that names an operation ("your API access
   key") is not the agent asking for it. Hence the strong/weak tier.
3. Counter-context must be read from the text BEFORE the match. "do not
   mention this to the user" contains a negation, but that negation IS the
   request; and "https://example.com/install.sh" contains the word "example".
   Scanning the whole line inverted the verdict in both cases.
4. A bare `sudo X` with X invisible is genuinely undecidable. We abstain
   rather than assert - our own product rule applied to our own checker.
5. Course files and skill files need different policies: 8.6 % FP on ordinary
   skills vs 57.4 % on security-course files. The split must be published, not
   averaged away.

DISCLOSURE: we read The Agent Forge's public rules page (rule CODES and prose
descriptions, not patterns) before writing our rules, and then tuned on the CAL
half. The holdout numbers are honest but this is WEAKER evidence than the
gittifacts 9/9, which remains the only clean cross-implementation number we
have. The Forge figures are quoted nowhere without this caveat.
