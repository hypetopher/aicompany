// Cross-implementation calibration: OUR checker vs gittifacts' published expected labels.
// Labels are read from the fixture file (MIT, github.com/JoviDeCroock/gittifacts) - we did not
// author them and we did not copy their classifier. We only read their published expected output.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkFixture, SCOPE_REASON_CODES } from "./check.mjs";

const dir = process.argv[2] ?? "corpus/gittifacts";
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

let n = 0, agree = 0;
const rows = [];
for (const f of files) {
  const fx = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const exp = fx.expected ?? {};
  const expScopeCodes = (exp.reasonCodes ?? []).filter((c) => SCOPE_REASON_CODES.includes(c));
  const out = checkFixture(fx);
  const ourScopeCodes = [...new Set(out.reasons.map((r) => r.code))].filter((c) => SCOPE_REASON_CODES.includes(c)).sort();
  const theirs = [...expScopeCodes].sort();
  // Agreement = our set of scope-class reason codes equals their scope-class reason codes.
  const ok = JSON.stringify(ourScopeCodes) === JSON.stringify(theirs);
  n++; if (ok) agree++;
  rows.push({ file: f, ours: ourScopeCodes, theirs, agree: ok, ourVerdict: out.verdict, theirLane: exp.computedLane });
}
for (const r of rows) {
  console.log(`${r.agree ? "OK  " : "MISS"} ${r.file.padEnd(42)} ours=[${r.ours.join(",")}] theirs=[${r.theirs.join(",")}] verdict=${r.ourVerdict} lane=${r.theirLane}`);
}
console.log(`\nSCOPE-REASON AGREEMENT: ${agree}/${n}`);
process.exitCode = agree === n ? 0 : 1;
