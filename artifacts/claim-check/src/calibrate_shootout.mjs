// Third external corpus: rajeew's skill-scanner-shootout (24 inert samples,
// 18 planted flaws + 6 benign controls, published answer key) AND that
// author's published per-sample results for 10 scanner configurations
// (Cisco skill-scanner x6, NVIDIA SkillSpector x4).
//
// This is the first corpus where we can place our checker NEXT TO two
// shipping third-party scanners on IDENTICAL bytes with a published answer key.
//
// We do NOT modify our rules against this corpus. We measure, and we publish
// the disagreement, per sample.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { verdictForDeclaration } from "./check_declaration.mjs";
import { VERDICT } from "./check_declaration.mjs";

const ROOT = join(process.cwd(), "corpus/shootout");
const idx = JSON.parse(readFileSync(join(ROOT, "expected/index.json"), "utf8"));
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const sha = (b) => createHash("sha256").update(b).digest("hex");

// VENDORED from the corpus author: results/normalized.json, fetched once at
// corpus-build time and committed here, so this harness makes ZERO network calls.
const third = JSON.parse(readFileSync(join(ROOT, "results/normalized.json"), "utf8"));

const rows = [];
for (const e of idx) {
  const key = JSON.parse(readFileSync(join(ROOT, "expected", e.id + ".json"), "utf8"));
  const dir = join(ROOT, "corpus", e.id);
  const files = walk(dir).sort();
  const hashes = {};
  let verdict = VERDICT.IN_SCOPE, cites = [];
  const declVerdict = verdictForDeclaration(readFileSync(join(dir, "SKILL.md"), "utf8"));
  for (const f of files) {
    const raw = readFileSync(f);
    hashes[relative(dir, f)] = sha(raw);
    const r = verdictForDeclaration(raw.toString("utf8"));
    if (r.verdict === VERDICT.OUT_OF_SCOPE) {
      verdict = VERDICT.OUT_OF_SCOPE;
      cites.push(relative(dir, f) + " :: " + r.reasons[0].cites[0]);
    } else if (r.verdict === VERDICT.UNDECIDABLE && verdict === VERDICT.IN_SCOPE) {
      verdict = VERDICT.UNDECIDABLE;
    }
  }
  const caughtBy = {};
  const fpBy = {};
  for (const [cfg, m] of Object.entries(third.configs)) {
    const v = m[e.id];
    // flawed sample: caught = a finding matching the expected answer key
    caughtBy[cfg] = !!v && (v.matches || []).some((x) => x.detected || x.detected_medium || x.detected_all);
    // benign sample: flagged = the corpus author marked it a false positive
    // (his `fp` = flagged at the gate severity; fp_all = flagged at any severity)
    fpBy[cfg] = !!v && !!(v.fp || v.fp_medium || v.fp_all);
    fpBy[cfg + ":gate"] = !!v && !!v.fp;
  }
  const expectedFiles = (key.expected || []).map((x) => x.file);
  const unit = expectedFiles.every((f) => f === "SKILL.md") && expectedFiles.length ? "declaration"
    : expectedFiles.length ? "code" : "benign";
  rows.push({
    id: e.id, label: e.label, family: e.family, benign: e.benign, unit,
    expected: key.expected,
    our_verdict: verdict,
    our_decl_only_verdict: declVerdict.verdict,
    our_cites: cites,
    hashes,
    caught_by: caughtBy,
    flagged_by: fpBy,
    caught_by_any: Object.values(caughtBy).some(Boolean),
  });
}

// ---- aggregates
const flawed = rows.filter((r) => !r.benign);
const benign = rows.filter((r) => r.benign);
const declFlawed = flawed.filter((r) => r.unit === "declaration");
const codeFlawed = flawed.filter((r) => r.unit === "code");
const ours = (r) => r.our_verdict === VERDICT.OUT_OF_SCOPE;
const oursDecl = (r) => r.our_decl_only_verdict === VERDICT.OUT_OF_SCOPE;

const cfgNames = Object.keys(third.configs);
const metrics = {};
for (const c of cfgNames) {
  const onDecl = declFlawed.filter((r) => r.caught_by[c]).length;
  const onCode = codeFlawed.filter((r) => r.caught_by[c]).length;
  const fp = benign.filter((r) => r.flagged_by[c]).length;
  const fpGate = benign.filter((r) => r.flagged_by[c + ":gate"]).length;
  metrics[c] = { detected_decl: onDecl, of_decl: declFlawed.length, detected_code: onCode, of_code: codeFlawed.length, benign_flagged: fp, benign_flagged_at_gate: fpGate, of_benign: benign.length };
}
const oursDeclDet = declFlawed.filter(oursDecl).length;
const oursCodeDet = codeFlawed.filter(ours).length;
const oursFp = benign.filter(ours).length;

// nobody catches
const nobody = flawed.filter((r) => !r.caught_by_any);
const nobodyExceptOurs = flawed.filter((r) => !r.caught_by_any && ours(r));

const report = {
  corpus: "rajeew/skill-scanner-shootout",
  corpus_url: "https://github.com/rajeews/skill-scanner-shootout",
  samples: rows.length, flawed: flawed.length, benign: benign.length,
  unit_split: { declaration: declFlawed.length, code: codeFlawed.length },
  ours: {
    detected_declaration: oursDeclDet, of_declaration: declFlawed.length,
    detected_code: oursCodeDet, of_code: codeFlawed.length,
    benign_flagged: oursFp, of_benign: benign.length,
    abstentions: rows.filter((r) => r.our_verdict === VERDICT.UNDECIDABLE).length,
  },
  third_party: metrics,
  nobody_catches: nobody.map((r) => ({ id: r.id, label: r.label, family: r.family, we_catch: ours(r) })),
  rows,
};
writeFileSync(join(ROOT, "comparison.json"), JSON.stringify(report, null, 1));
writeFileSync(join(ROOT, "PROVENANCE.md"), `# PROVENANCE — third external corpus (shootout)

Source: https://github.com/rajeews/skill-scanner-shootout (commit fetched 2026-10-22, tree via GitHub API)
Corpus: \`corpus/\` (24 inert samples: 18 planted flaws, 6 benign controls) + \`expected/\` (answer key).
Third-party scanner results: \`results/normalized.json\` — 10 configs (Cisco skill-scanner x6, NVIDIA SkillSpector x4).

Every file we read was sha256-recorded at read time in \`comparison.json\` (field \`hashes\`).
The corpus is INERT: fake hosts, no working payloads, no real credentials, nothing executed.
We did not modify our rules against this corpus. It is used only to MEASURE.
`);
console.log("=== claim-check vs two third-party scanners, identical bytes ===");
console.log("samples", rows.length, "| flawed", flawed.length, "| benign", benign.length);
console.log("unit split: declaration-level flaws", declFlawed.length, "| code-level flaws", codeFlawed.length);
console.log("\nours (claim-check, whole package):");
console.log("  declaration-level flaws detected", oursDeclDet + "/" + declFlawed.length);
console.log("  code-level flaws detected      ", oursCodeDet + "/" + codeFlawed.length);
console.log("  benign controls flagged        ", oursFp + "/" + benign.length);
console.log("  abstentions                    ", report.ours.abstentions);
console.log("\nthird-party configs (declared unit = package vulnerability, not scope conformance):");
for (const c of cfgNames) {
  const m = metrics[c];
  console.log("  " + c.padEnd(24), "decl", m.detected_decl + "/" + m.of_decl, " code", m.detected_code + "/" + m.of_code, " benignFP", m.benign_flagged + "/" + m.of_benign, "(gate " + m.benign_flagged_at_gate + ")");
}
console.log("\nnobody catches:", nobody.map((r) => r.id + " " + r.label + (ours(r) ? " (WE CATCH)" : "")).join(" | ") || "none");
console.log("report written to corpus/shootout/comparison.json");
