#!/usr/bin/env node
// claim-check verifier - single file, offline, zero dependencies.
// Usage: node claim-check.mjs <exchange.json>        (an exchange, or a file with .exchanges[])
import { readFileSync } from "node:fs";
import { checkExchange } from "./check_exchange.mjs";

const path = process.argv[2];
if (!path) {
  console.error("usage: node claim-check.mjs <exchange.json>");
  process.exit(2);
}
const raw = JSON.parse(readFileSync(path, "utf8"));
const exchanges = Array.isArray(raw) ? raw : Array.isArray(raw.exchanges) ? raw.exchanges : [raw];

let out = 0, und = 0;
for (const ex of exchanges) {
  const r = checkExchange(ex);
  if (r.verdict === "OUT-OF-SCOPE") out++;
  if (r.verdict === "UNDECIDABLE") und++;
  console.log(`${r.id ?? "(no id)"}\t${r.verdict}`);
  for (const c of r.perCall) {
    for (const rs of c.reasons) {
      console.log(`  ${rs.code}`);
      for (const cite of rs.cites) console.log(`    - ${cite}`);
    }
  }
}
console.log(`\nsummary: ${exchanges.length} exchange(s), ${out} out-of-scope, ${und} undecidable`);
process.exitCode = out > 0 ? 1 : 0;
