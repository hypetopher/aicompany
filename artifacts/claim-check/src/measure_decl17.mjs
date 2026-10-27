// Measure decl-17 (declaration-vs-behavior contradiction) against the
// THIRD-PARTY shootout corpus answer key.
//
// The answer key is read-only here: we never write to corpus/shootout/.
// We only read expected/*.json and the inert sample directories.
//
// What this measures, and what it deliberately does NOT do:
//   - It does not touch the corpus. No sample is added, edited, or removed.
//   - It does not tune to the answer key. The rule set in decl17_contradiction
//     was written from the FAMILY (description_mismatch), then run once.
//   - It reports the false-positive rate on the 6 benign controls, which is
//     the number that decides whether the rule is publishable.
//
// Pure, offline, deterministic.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contradictionVerdict, VERDICT } from "./decl17_contradiction.mjs";

const ROOT = new URL("../corpus/shootout/", import.meta.url).pathname;
const idx = JSON.parse(readFileSync(join(ROOT, "expected/index.json"), "utf8"));

const rows = [];
for (const e of idx) {
  const key = JSON.parse(readFileSync(join(ROOT, "expected", e.id + ".json"), "utf8"));
  const dir = join(ROOT, "corpus", e.id);
  const r = contradictionVerdict(dir);
  const expectedNeedles = (key.expected || []).map((x) => x.needle);
  const family = e.family;
  // "Does the contradiction rule catch a sample OF THIS FAMILY?"
  // Family-level match: the sample belongs to description_mismatch, and the
  // rule fired on it. We do not require the cite to equal the key's needle -
  // the key's needle is the corrupted behavior, our cite is the contradicting
  // behavior. Both name the same defect.
  const detected = r.contradictions.length > 0;
  const inFamily = family === "description_mismatch";
  rows.push({
    id: e.id, label: e.label, family, benign: e.benign, expected: expectedNeedles,
    detected, inFamily, contradictions: r.contradictions,
  });
}

const flawed = rows.filter((r) => !r.benign);
const benign = rows.filter((r) => r.benign);
const dm = flawed.filter((r) => r.family === "description_mismatch");
const dmDetected = dm.filter((r) => r.detected);
const benignFlagged = benign.filter((r) => r.detected);
const otherFlawedDetected = flawed.filter((r) => r.family !== "description_mismatch" && r.detected);

const out = {
  unit: "decl-17 declaration-vs-behavior contradiction",
  corpus: "corpus/shootout (third-party, rajeew/skill-scanner-shootout)",
  corpus_modified: false,
  answer_key_read_only: true,
  llm_used: false,
  network_used: false,
  samples: rows.length,
  flawed: flawed.length,
  benign: benign.length,
  family_covered: "description_mismatch",
  family_size: dm.length,
  family_detected: dmDetected.length,
  family_detected_ids: dmDetected.map((r) => r.id),
  family_missed_ids: dm.filter((r) => !r.detected).map((r) => r.id),
  benign_flagged: benignFlagged.length,
  benign_flagged_ids: benignFlagged.map((r) => r.id),
  other_flawed_flagged: otherFlawedDetected.length,
  other_flawed_flagged_ids: otherFlawedDetected.map((r) => r.id),
  false_positive_rate: benign.length ? benignFlagged.length / benign.length : 0,
  detail: rows.map((r) => ({
    id: r.id, label: r.label, family: r.family, benign: r.benign, detected: r.detected,
    contradictions: r.contradictions.map((c) => ({ code: c.code, cite: c.cite, claim: c.claimText })),
  })),
};

console.log(JSON.stringify(out, null, 1));
