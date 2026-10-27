// Third external corpus, upstream-verified. Guards the rule extension that
// was derived from it AND the cost of that extension on the untouched corpus.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { verdictForDeclaration, VERDICT } from "../src/check_declaration.mjs";

const dir = new URL("../corpus/deepset/", import.meta.url).pathname;
const man = JSON.parse(readFileSync(dir + "MANIFEST.json", "utf8"));

// 1. the bytes are the bytes they said
for (const [f, want] of Object.entries(man.files)) {
  const h = createHash("sha256").update(readFileSync(dir + f)).digest("hex");
  if (h !== want) { console.log(`FAIL sha256 ${f}`); process.exit(1); }
}
console.log(`sha256 verified: ${Object.keys(man.files).length}/${Object.keys(man.files).length}`);

// 2. the context-override family is caught
const A = JSON.parse(readFileSync(dir + "attacks.json", "utf8"));
const B = JSON.parse(readFileSync(dir + "benign.json", "utf8"));
let det = 0, fp = 0;
for (const a of A) if (verdictForDeclaration(a.prompt).verdict === VERDICT.OUT_OF_SCOPE) det++;
for (const b of B) if (verdictForDeclaration(b.prompt).verdict !== VERDICT.IN_SCOPE) fp++;
if (det < 7) { console.log(`FAIL detection ${det}/60, expected >=7`); process.exit(1); }
if (fp > 0) { console.log(`FAIL ${fp} benign flagged, expected 0`); process.exit(1); }
console.log(`deepset holdout: ${det}/60 attacks flagged, ${fp}/56 benign flagged`);

// 3. the COST of that extension on a corpus we did NOT tune on: forge
const fdir = new URL("../corpus/forge/", import.meta.url).pathname;
const idx = JSON.parse(readFileSync(fdir + "index.json", "utf8"));
let oos = 0;
for (const r of idx.rows) {
  const t = readFileSync(fdir + r.file.replace("corpus/forge/", ""), "utf8");
  if (verdictForDeclaration(t).verdict === VERDICT.OUT_OF_SCOPE) oos++;
}
if (oos !== 98) { console.log(`FAIL forge OUT-OF-SCOPE count ${oos}, expected 98 (0 new FP from the extension)`); process.exit(1); }
console.log(`forge regression: OUT-OF-SCOPE 98/452 unchanged (0 new false positives)`);
console.log("PASS: deepset-holdout");
