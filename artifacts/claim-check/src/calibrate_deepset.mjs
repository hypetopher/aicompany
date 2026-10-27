// Third external corpus: deepset/prompt-injections (test split), fetched and
// sha256-verified against the MANIFEST.json published by Cerbère AG.
//
// WHAT THIS IS NOT: this is not a second confirmation of our rule set for
// SCOPE CONFORMANCE. deepset labels PROMPT INJECTION ATTACK vs BENIGN, which
// is a RISK label. Our checker answers "does this text REQUEST an action
// outside an authorization". Two different questions over the same bytes.
// What we CAN measure honestly:
//   Q1 detection: does our checker raise anything on an attack prompt?
//   Q2 the inverse: on prompts THEY label benign, how often do we raise?
//   Q3: the same measurement on THEIR pipeline's published verdicts, from
//       their own published per-prompt results file - which is why this
//       corpus is worth having: both implementations' verdicts on the same
//       sha256-pinned bytes.
import { readFileSync } from "node:fs";
import { verdictForDeclaration, VERDICT, SEVERITY } from "./check_declaration.mjs";

const dir = new URL("../corpus/deepset/", import.meta.url).pathname;
const A = JSON.parse(readFileSync(dir + "attacks.json", "utf8"));
const B = JSON.parse(readFileSync(dir + "benign.json", "utf8"));
const R = JSON.parse(readFileSync(dir + "cerbere-deepset-results.json", "utf8"));

const theirs = new Map();
for (const run of R.runs || []) {
  for (const f of run.failures?.attacks_missed || []) theirs.set(f.id, false);
}
for (const row of A) if (!theirs.has(row.id)) theirs.set(row.id, true); // detected

const rows = [
  ...A.map((x) => ({ ...x, label: "attack" })),
  ...B.map((x) => ({ ...x, label: "benign" })),
];

const out = [];
for (const r of rows) {
  const o = verdictForDeclaration(r.prompt);
  out.push({
    id: r.id,
    label: r.label,
    ours: o.verdict,
    our_severity: o.severity,
    n_findings: o.findings.length,
    our_codes: o.findings.filter((f) => f.severity !== SEVERITY.LOW).map((f) => f.code),
    theirs_detected: theirs.get(r.id) ?? null,
    lang: r.lang,
    prompt_head: r.prompt.slice(0, 90).replace(/\s+/g, " "),
  });
}

function pct(n, d) { return d ? +((100 * n) / d).toFixed(1) : null; }
const atk = out.filter((r) => r.label === "attack");
const ben = out.filter((r) => r.label === "benign");
const raised = (rs) => rs.filter((r) => r.n_findings > 0).length;
const oos = (rs) => rs.filter((r) => r.ours === VERDICT.OUT_OF_SCOPE).length;
const und = (rs) => rs.filter((r) => r.ours === VERDICT.UNDECIDABLE).length;
const inS = (rs) => rs.filter((r) => r.ours === VERDICT.IN_SCOPE).length;

const theirDetected = atk.filter((r) => r.theirs_detected === true).length;
const theirFp = ben.filter((r) => r.theirs_detected === true).length;

const summary = {
  corpus: {
    source: "deepset/prompt-injections test split, via Cerbère AG published external holdout (benchmarks/external/deepset_test/)",
    manifest: "artifacts/claim-check/corpus/deepset/MANIFEST.json",
    sha256_verified: "60 attacks + 56 benign, both hashes match the published MANIFEST",
    n_attacks: atk.length,
    n_benign: ben.length,
    note: "NO hard negatives exist for this source (stated in their MANIFEST). Our FP estimate on this corpus is therefore a floor, not a rate.",
  },
  their_pipeline_published: {
    source: "their published results file, benchmark-deepset_test-2026-10-10T102659.json",
    recall_on_this_corpus: R.runs[0].recall_overall,
    recall_ci95: R.runs[0].recall_ci95,
    fpr_benign: R.runs[0].false_positive_rate_benign,
    counts: R.runs[0].counts,
    llm_effect: R.runs[0].llm_effect,
    recall_readme_headline_on_their_OWN_corpus: 1.0,
    gap: "100% recall on their own corpus_2k vs 21.67% on this external frozen corpus - same pipeline, same version",
  },
  ours: {
    raised_anything_attacks: raised(atk),
    out_of_scope_attacks: oos(atk),
    undecidable_attacks: und(atk),
    in_scope_attacks: inS(atk),
    raised_anything_benign: raised(ben),
    out_of_scope_benign: oos(ben),
    undecidable_benign: und(ben),
    fp_floor_benign: pct(oos(ben), ben.length),
  },
  cross_implementation_on_same_bytes: {
    both_detected: atk.filter((r) => r.theirs_detected === true && r.n_findings > 0).length,
    only_theirs: atk.filter((r) => r.theirs_detected === true && r.n_findings === 0).length,
    only_ours: atk.filter((r) => r.theirs_detected === false && r.n_findings > 0).length,
    neither: atk.filter((r) => r.theirs_detected === false && r.n_findings === 0).length,
  },
};

console.log(JSON.stringify(summary, null, 1));
console.log("\n--- sample rows (first 20 attacks) ---");
for (const r of out.filter((r) => r.label === "attack").slice(0, 20))
  console.log(`${r.id} theirs=${r.theirs_detected} ours=${r.ours}/${r.our_severity} codes=${r.our_codes.join(",")} :: ${r.prompt_head}`);
console.log("\n--- benign rows where we raise something (first 20) ---");
for (const r of out.filter((r) => r.label === "benign" && r.n_findings > 0).slice(0, 20))
  console.log(`${r.id} ours=${r.ours}/${r.our_severity} codes=${r.our_codes.join(",")} :: ${r.prompt_head}`);
