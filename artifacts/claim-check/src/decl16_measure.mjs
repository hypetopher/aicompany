// decl-16 measurement: does the declaration unit detect the tool-provenance
// class at all? Read-only over the corpus, no network.
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { verdictForDeclaration } from './check_declaration.mjs';

const files = [
  'corpus/thirdparty/security-sweep-SKILL.md',
  'corpus/thirdparty/security-sweep-tools.lock.json',
  'corpus/thirdparty/controls/ctl-a-download-execute.md',
  'corpus/thirdparty/controls/ctl-b-self-rewrite-anchor.md',
  'corpus/thirdparty/controls/ctl-c-write-outside-root.md',
  'corpus/thirdparty/controls/ctl-d-benign-mention.md',
  'corpus/thirdparty/controls/ctl-e-as-published.md',
];
const out = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const r = verdictForDeclaration(text);
  const prov = r.findings.filter((x) => x.code === 'scope.tool-provenance');
  out.push({
    file: f,
    verdict: r.verdict,
    decl16_findings: prov.length,
    decl16_request: prov.filter((x) => x.request).length,
    decl16_ambiguous: prov.filter((x) => x.ambiguous).length,
    decl16_caution: prov.filter((x) => !x.request && !x.ambiguous).length,
    other_codes: [...new Set(r.findings.filter((x) => x.code !== 'scope.tool-provenance').map((x) => x.code))],
    cites: prov.map((x) => `L${x.line} ${x.tier}/${x.position} ${x.severity} :: ${x.excerpt.slice(0, 90)}`),
  });
}
console.log(JSON.stringify(out, null, 1));
writeFileSync('corpus/thirdparty/decl16-measurement.json', JSON.stringify(out, null, 1));
