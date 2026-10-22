# Provenance Probe — spec v0.1 (2026-10-22)

Deterministic, offline classifier for agent transcripts.

**Goal.** Decide, with no model call, no network call and no certificate/CA
trust path, whether a transcript's *role structure survived*. A receipt over a
flattened transcript certifies a laundered history, so the probe must be able
to say `REFUSE` — not merely "low confidence".

**Input.** A transcript as JSONL, one turn per line:

```json
{"role":"user","content":"..."}
{"role":"assistant","content":"..."}
{"role":"tool","content":"..."}
```

Raw text files are accepted too and are treated as a single flattened turn.

**Output.** One JSON receipt:

```json
{
  "spec_version": "0.1",
  "provenance_class": "ROLE_TYPED | FLATTENED | UNKNOWN",
  "verdict": "ACCEPT | REFUSE | REFUSE-PROVENANCE-UNKNOWN",
  "reason_codes": ["..."],
  "turns": 12,
  "roles_seen": ["user","assistant","tool"],
  "digest": "sha256:..."
}
```

**Verdicts**

| verdict | meaning | rule |
| --- | --- | --- |
| `ACCEPT` | role structure intact | role labels present, one role per turn, no role markers found inside tool output |
| `REFUSE` | provenance lost | a role marker (e.g. `[User]:`) appears inside another turn's content, or two role labels appear in one turn |
| `REFUSE-PROVENANCE-UNKNOWN` | undeterminable | structure not recognized (not parseable, no role labels, no tool turns) |

Fail-closed by construction: anything not explicitly recognized yields a
refusal. The probe never guesses.

**Reason codes**

- `PROVENANCE_CLASS_ROLE_TYPED`
- `PROVENANCE_CLASS_FLATTENED`
- `PROVENANCE_CLASS_UNKNOWN`
- `TAMPER_ROLE_MARKER_IN_TOOL_OUTPUT`
- `TAMPER_ROLE_MARKER_IN_ASSISTANT_OUTPUT`
- `TAMPER_MULTIPLE_ROLE_LABELS_IN_TURN`
- `MALFORMED_TRANSCRIPT`
- `EMPTY_TRANSCRIPT`

**Guarantees**

1. No model call. `runtime-deps.llm.complete` and any `fetch` are not
   reachable from the probe; a test asserts this by poisoning both.
2. No network. Same test.
3. No CA, no certificate chain, no registry, no timestamp authority.
4. Deterministic: byte-identical verdict + digest across runs and across
   verifier versions for the same input.
5. Offline-re-derivable: a stranger can run `node probe.mjs <file>` and get
   the same verdict without trusting us.

**Out of scope (v0.1)**: live dynamic forgery-survival runs against a real
harness (needs a harness adapter and is not credential-free in general),
severity judgement, and receipt binding to remote effects. A receipt that
binds a *request* proves nothing about a *remote effect*; effect binding is
v0.2.
