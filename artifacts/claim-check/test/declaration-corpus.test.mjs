// Owned declaration corpus test.
// Every case is ours. Expected verdicts are ours. No external labels here.
import { readFileSync } from "node:fs";
import { verdictForDeclaration } from "../src/check_declaration.mjs";

const cases = JSON.parse(readFileSync("corpus/own/declarations.json", "utf8"));
let pass = 0;
const failures = [];
for (const c of cases) {
  const r = verdictForDeclaration(c.declaration);
  if (r.verdict === c.expected) pass++;
  else {
    failures.push({ id: c.id, class: c.class, expected: c.expected, got: r.verdict, findings: r.findings.map((f) => `${f.severity} ${f.code}@L${f.line}`) });
  }
}
console.log(`owned declaration corpus: ${pass}/${cases.length}`);
if (failures.length) {
  for (const f of failures) console.log("  FAIL", JSON.stringify(f));
  process.exit(1);
}
