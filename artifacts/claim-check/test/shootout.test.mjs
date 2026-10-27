// THIRD external corpus: rajeew/skill-scanner-shootout.
// 24 inert samples, 18 planted flaws, 6 benign controls, published answer key,
// plus the author's published results for 10 third-party scanner configurations.
//
// This test asserts OUR numbers on these bytes. The third-party numbers are
// the author's published runs, recomputed by us from his raw results - we did
// not run Cisco or NVIDIA ourselves, and the README says so.
//
// We did NOT tune any rule against this corpus. The 3/4 below is a clean
// holdout for the rules as they were; our false negative (skill-17) is
// published rather than fixed.
import { readFileSync, existsSync } from "node:fs";

const report = JSON.parse(readFileSync("corpus/shootout/comparison.json", "utf8"));
const failures = [];
const expect = (name, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) failures.push(`${name}: got ${got}, want ${want}`);
};

expect("samples", report.samples, 24);
expect("flawed", report.flawed, 18);
expect("benign", report.benign, 6);
expect("unit split: declaration", report.unit_split.declaration, 4);
expect("unit split: code", report.unit_split.code, 14);

// ours
expect("ours declaration-level detected", report.ours.detected_declaration, 3);
expect("ours code-level detected", report.ours.detected_code, 0);
expect("ours benign flagged", report.ours.benign_flagged, 0);
expect("ours abstentions", report.ours.abstentions, 0);

// the competitor we are compared against, on identical bytes
expect("cisco-default declaration", report.third_party["cisco-default"].detected_decl, 2);
expect("cisco-default code", report.third_party["cisco-default"].detected_code, 5);
expect("cisco-default benign flagged", report.third_party["cisco-default"].benign_flagged, 1);
expect("skillspector-llm declaration", report.third_party["skillspector-llm"].detected_decl, 4);
expect("skillspector-llm code", report.third_party["skillspector-llm"].detected_code, 13);
expect("skillspector-llm benign flagged", report.third_party["skillspector-llm"].benign_flagged, 4);

// the sample nobody in the ecosystem catches
expect("nobody catches", report.nobody_catches.map((r) => r.id).join(","), "skill-13");

// our known false negative, published on purpose
const fn = report.rows.find((r) => r.id === "skill-17");
if (!fn) failures.push("skill-17 missing from report");
else if (fn.our_verdict === "OUT-OF-SCOPE") failures.push("skill-17: expected a published false negative, got OUT-OF-SCOPE");

// provenance: every file sha256-recorded
for (const r of report.rows) {
  if (!r.hashes || Object.keys(r.hashes).length < 1) failures.push(`${r.id}: no hashes recorded`);
  for (const [f, h] of Object.entries(r.hashes || {})) {
    if (!/^[0-9a-f]{64}$/.test(h)) failures.push(`${r.id}/${f}: bad hash`);
  }
}
if (!existsSync("corpus/shootout/PROVENANCE.md")) failures.push("PROVENANCE.md missing");
if (!existsSync("corpus/shootout/results/normalized.json")) failures.push("vendored third-party results missing");

console.log(`shootout (3rd external corpus): ${report.ours.detected_declaration}/${report.unit_split.declaration} declaration-level, ${report.ours.detected_code}/${report.unit_split.code} code-level, ${report.ours.benign_flagged}/${report.benign} benign flagged, ${report.nobody_catches.length} caught by nobody`);
if (failures.length) {
  for (const f of failures) console.log("  FAIL", f);
  process.exit(1);
}
console.log("PASS: shootout");
