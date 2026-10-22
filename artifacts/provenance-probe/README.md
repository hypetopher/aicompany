# Provenance Probe — shipped artifact (2026-10-22, cycle 17)

The first credential-free artifact this fleet has actually produced. Everything
else in the last 16 cycles was prose.

## What it is

A deterministic, offline classifier that decides whether an agent transcript's
**role structure survived**. It emits one of:

- `ACCEPT` — role structure intact
- `REFUSE` — provenance destroyed (forged role markers inside a turn, or role
  labels carried only as free text)
- `REFUSE-PROVENANCE-UNKNOWN` — undeterminable (fail closed)

Spec: [`spec.md`](./spec.md) (v0.1)

## Why it exists

Forged approvals and laundering in context-compacting coding agents
(arXiv:2610.29869) mean a receipt over a flattened transcript certifies a
laundered history. Signing it, calibrating it or hashing it does not repair
that. So the receipt has to **declare the provenance class of the transcript
it binds** and refuse when provenance was destroyed — a refusal class nothing
on the market can emit today, because nothing on the market looks at the
transcript at all.

## Guarantees (all asserted by `test.mjs`)

| Guarantee | How it is enforced |
| --- | --- |
| No model call | static check: source contains no `llm.complete`; runtime check under a poisoned global |
| No network | runtime check with `globalThis.fetch` replaced by a thrower; static check for `node:http/https/net/tls/dns` |
| No CA / cert chain | static check for `X509` / `createVerify` |
| Deterministic | byte-identical output across 3 runs and across invocations |
| Offline re-derivable | a stranger runs `node probe.mjs file.jsonl` and gets the same verdict |

## Files

- `probe.mjs` — the classifier (+ `--self-test`)
- `test.mjs` — the no-model / no-network / determinism guard suite
- `corpus.mjs` — deterministic labelled corpus (seed 20261022) + confusion matrix
- `corpus.jsonl`, `matrix.json` — generated corpus and published matrix
- `foreign-harness.mjs` — re-derivation against **real** harness session logs
- `foreign-harness-results.json` — published foreign-harness results
- `self-scan.mjs` — our own fleet's laundering rate

## Published results (2026-10-22)

### Corpus — 120 labelled artifacts

```
corpus_size: 120, seed: 20261022
ACCEPT          -> ACCEPT 40 / REFUSE 0 / REFUSE-PROVENANCE-UNKNOWN 0
REFUSE          -> ACCEPT 0  / REFUSE 40 / REFUSE-PROVENANCE-UNKNOWN 0
REFUSE-ANY      -> ACCEPT 0  / REFUSE 40 / REFUSE-PROVENANCE-UNKNOWN 0
refusal_rate_on_tampered_and_provenance_lost: 1.0
false_accept_rate: 0.0
all_pass: true
```

Row `REFUSE-ANY` is the flattened class: either refusal verdict is correct
there, and the probe never accepts one.

### Foreign-harness re-derivation — 40 real session logs, 651 turns

For each real harness log we classify three serializations of **the same
content**:

1. role-typed JSONL → `ACCEPT`
2. flattened, role labels dropped → `REFUSE-PROVENANCE-UNKNOWN`
3. flattened, role labels kept as free-text prefixes → `REFUSE` / `FLATTENED`

`structure_sensitive: true` for 40/40 logs, 0 failures. This is the check that
makes the corpus number meaningful: the verdict tracks **serialization**, not
content. Same bytes, different role structure, different verdict.

### Our own fleet's laundering rate — `self-scan.mjs`

Scanned 1000 most recent steps and the full step table (93,273 rows):

- typed step kinds: 93,225
- free-text (role identity carried in a string and re-parsed downstream): **48**
- laundering rate: **0.051%**

The 48 are legacy free-text kinds (`get`, `status`, `coordinate`, `query`,
`get-signals`, `Observer arbitration cycle`, `cross-role conflict, queue
pressure, and corrective plan`, …) — every one of them dead-lettered as
`Unknown step kind`, i.e. the laundering already failed loudly instead of
silently. Current fleet output is typed.

**Correction to the last 16 cycles' internal story:** our 353 daily duplicate
diagnoses are *not* the same defect class as a flattening harness. They are an
**unbounded re-diagnosis loop**: `findRecentFailedMissions` returns every
mission with `status='failed'` and nothing ever marks it as diagnosed, so the
trigger re-fires on the same two dead missions (92395, 92756) on every tick —
10 of 21 proposals/hour (48%) and 353/day. Our provenance rate is 0.05%; our
*triage waste* is ~77%. We had the disease confused with the symptom for 16
cycles.

## Reproduce everything

```bash
cd artifacts/provenance-probe
node probe.mjs --self-test          # verdict suite
node test.mjs                       # no-model / no-network / determinism guards
node corpus.mjs 120                 # corpus + confusion matrix
node foreign-harness.mjs ~/.openclaw/agents/main/sessions/*.jsonl
set -a && . ../../.env && set +a && node self-scan.mjs
```

## Known limits (v0.1)

- No live dynamic forgery-survival run against a real harness (needs a harness
  adapter; not credential-free in general).
- No severity judgement (deliberately: an LLM in the deciding loop is how you
  get an unfalsifiable number).
- No effect binding: a receipt that binds a *request* proves nothing about a
  *remote effect* — that is v0.2, and Agent Middleware's own README concedes
  the same limit for their receipts.
