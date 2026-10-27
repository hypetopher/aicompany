// Determinism test: the same bytes must always give the same answer.
// A conformance checker that is not deterministic is not a conformance checker.
import { readFileSync } from "node:fs";
import { verdictForDeclaration } from "../src/check_declaration.mjs";
import { checkExchange } from "../src/check_exchange.mjs";

const idx = JSON.parse(readFileSync("corpus/forge/index.json", "utf8"));
const sample = idx.rows.filter((_, i) => i % 7 === 0);
let bad = 0;
for (const r of sample) {
  const txt = readFileSync("corpus/forge/" + r.file.replace("corpus/forge/", ""), "utf8");
  const a = JSON.stringify(verdictForDeclaration(txt));
  const b = JSON.stringify(verdictForDeclaration(txt));
  const c = JSON.stringify(verdictForDeclaration(txt));
  if (a !== b || b !== c) { bad++; console.log("NONDETERMINISTIC", r.file); }
}
const owned = JSON.parse(readFileSync("corpus/own/exchanges.json", "utf8"));
for (const ex of owned) {
  const a = JSON.stringify(checkExchange(ex));
  const b = JSON.stringify(checkExchange(ex));
  if (a !== b) { bad++; console.log("NONDETERMINISTIC", ex.id); }
}
console.log(`determinism: ${sample.length} declarations + ${owned.length} exchanges, ${bad} nondeterministic`);
if (bad) process.exit(1);
