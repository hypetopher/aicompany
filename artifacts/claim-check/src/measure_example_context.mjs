// Measure the documentation-context carve-out as an OVERLAY on the existing
// single-file declaration unit.
//
// The base unit (check_declaration.mjs) is NOT modified. This script
// recomputes the verdict with one rule change applied in memory:
//   - a WEAK-tier finding whose line sits in documentation context
//     (fenced code block, or an Example/Usage/Sample section) is demoted
//     from "ambiguous directive" to "mention".
// Strong-tier findings are untouched.
//
// Why an overlay and not an edit: the base unit has a measured baseline
// (11/11 tests, 452-file forge corpus verdict distribution). We measure the
// overlay's effect on both corpora BEFORE deciding whether to fold it in.
//
// The question this answers: does the carve-out remove false ambiguity
// without removing true detections?
//
// Pure, offline, deterministic. The corpora are read-only.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { verdictForDeclaration } from "./check_declaration.mjs";
import { documentationContextLines } from "./example_context.mjs";

const VERDICT = { OUT_OF_SCOPE: "OUT-OF-SCOPE", IN_SCOPE: "IN-SCOPE", UNDECIDABLE: "UNDECIDABLE" };

/** Recompute the verdict with weak findings in documentation context demoted. */
export function verdictWithContext(text) {
  const base = verdictForDeclaration(text);
  const ctx = documentationContextLines(text);
  const demoted = [];
  const findings = base.findings.map((f) => {
    if (f.tier === "weak" && ctx.has(f.line) && f.ambiguous) {
      const c = { ...f, ambiguous: false, severity: "low", demoted_to_mention: true };
      demoted.push(c);
      return c;
    }
    return f;
  });
  const requests = findings.filter((f) => f.request);
  const ambiguous = findings.filter((f) => f.ambiguous);
  const verdict = requests.length > 0 ? VERDICT.OUT_OF_SCOPE : ambiguous.length > 0 ? VERDICT.UNDECIDABLE : VERDICT.IN_SCOPE;
  return { verdict, findings, demoted, base_verdict: base.verdict };
}

// ---- third-party shootout corpus: known answer key, read-only ----
const SHOOT = new URL("../corpus/shootout/", import.meta.url).pathname;
const idx = JSON.parse(readFileSync(join(SHOOT, "expected/index.json"), "utf8"));
const shootRows = [];
for (const e of idx) {
  const text = readFileSync(join(SHOOT, "corpus", e.id, "SKILL.md"), "utf8");
  const base = verdictForDeclaration(text);
  const ov = verdictWithContext(text);
  shootRows.push({
    id: e.id, label: e.label, benign: e.benign, family: e.family,
    base: base.verdict, overlay: ov.verdict,
    changed: base.verdict !== ov.verdict,
    demoted: ov.demoted.length,
  });
}
const shootFlawed = shootRows.filter((r) => !r.benign);
const shootBenign = shootRows.filter((r) => r.benign);
const shootChanged = shootRows.filter((r) => r.changed);

// ---- forge corpus: distribution shift ----
const FORGE = new URL("../corpus/forge/", import.meta.url).pathname;
const fidx = JSON.parse(readFileSync(join(FORGE, "index.json"), "utf8"));
const forgeRows = [];
for (const r of fidx.rows) {
  const text = readFileSync(join(FORGE, r.file.replace("corpus/forge/", "")), "utf8");
  const base = verdictForDeclaration(text);
  const ov = verdictWithContext(text);
  forgeRows.push({ file: r.file, base: base.verdict, overlay: ov.verdict, changed: base.verdict !== ov.verdict, demoted: ov.demoted.length });
}
const count = (rows, k) => rows.reduce((a, r) => ((a[r[k]] = (a[r[k]] || 0) + 1), a), {});

const out = {
  overlay: "weak-tier findings in documentation context demoted to mentions",
  base_unit_modified: false,
  llm_used: false,
  network_used: false,
  shootout: {
    samples: shootRows.length,
    flawed: shootFlawed.length,
    benign: shootBenign.length,
    base_distribution: count(shootRows, "base"),
    overlay_distribution: count(shootRows, "overlay"),
    changed: shootChanged.length,
    changed_detail: shootChanged.map((r) => ({ id: r.id, label: r.label, benign: r.benign, family: r.family, base: r.base, overlay: r.overlay, demoted: r.demoted })),
    true_detections_preserved: shootFlawed.every((r) => r.base === VERDICT.OUT_OF_SCOPE ? r.overlay === VERDICT.OUT_OF_SCOPE : true),
  },
  forge: {
    files: forgeRows.length,
    base_distribution: count(forgeRows, "base"),
    overlay_distribution: count(forgeRows, "overlay"),
    changed: forgeRows.filter((r) => r.changed).length,
    changed_detail: forgeRows.filter((r) => r.changed).map((r) => ({ file: r.file, base: r.base, overlay: r.overlay, demoted: r.demoted })),
  },
};
console.log(JSON.stringify(out, null, 1));
