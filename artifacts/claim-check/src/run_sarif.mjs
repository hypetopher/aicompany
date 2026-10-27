// Emit SARIF 2.1.0 reports for a set of declaration files.
//
// Usage: node src/run_sarif.mjs <file-or-dir>... [--out <dir>]
//
// Determinism contract: same input bytes -> byte-identical SARIF output.
// There is no timestamp in the output, results are ordered by (line, ruleId),
// and the digest is the sha256 of the exact bytes read from disk.
//
// Offline: no network access. This reads local files and writes local files.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import { sarifForDeclaration, contentDigest, SARIF_VERSION } from './sarif.mjs';

function walk(p, acc = []) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const e of readdirSync(p).sort()) walk(join(p, e), acc);
  } else if (p.endsWith('.md')) {
    acc.push(p);
  }
  return acc;
}

const args = process.argv.slice(2);
let outDir = null;
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') { outDir = args[++i]; continue; }
  inputs.push(args[i]);
}
if (!inputs.length) {
  console.error('usage: node src/run_sarif.mjs <file-or-dir>... [--out <dir>]');
  process.exit(2);
}

const files = [...new Set(inputs.flatMap((p) => walk(p)))].sort();
const reports = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const uri = relative(process.cwd(), f);
  const sarif = sarifForDeclaration({ text, uri, digest: contentDigest(text) });
  reports.push({ file: f, sarif });
}

if (outDir) {
  mkdirSync(outDir, { recursive: true });
  for (const { file, sarif } of reports) {
    const name = basename(file).replace(/\.md$/, '') + '.sarif.json';
    writeFileSync(join(outDir, name), JSON.stringify(sarif, null, 2) + '\n');
  }
}

const summary = {
  sarifVersion: SARIF_VERSION,
  files: reports.length,
  verdicts: reports.reduce((acc, { sarif }) => {
    const v = sarif.runs[0].properties.verdict;
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {}),
  results: reports.reduce((a, { sarif }) => a + sarif.runs[0].results.length, 0),
};
console.log(JSON.stringify(summary, null, 1));
if (!outDir) console.log(JSON.stringify(reports, null, 1));
