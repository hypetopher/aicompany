// frontmatter_risk_lint: does a declared risk enum contradict the skill's bytes?
//
// Extends the card-truth finding to a DIFFERENT declaration mechanism.
// sickn33/agentic-awesome-skills (48k stars) declares risk in SKILL.md
// frontmatter as an enum (none|safe|critical|offensive|unknown) instead of a
// free-text skill-card risk field.
//
// Hypothesis: free-text risk fields get constant-filled (NVIDIA: 424/424
// identical), but enum fields are per-skill (measured: 1346 critical / 993
// safe / ...). The question that matters for a linter is not whether the
// declaration is per-skill, but whether it is TRUE against the bytes.
//
// Checks:
//   F1 SAFE_BUT_SECRETS      declares risk: safe|none  but bytes read secrets
//   F2 UNSAFE_BUT_BENIGN     declares risk: critical|offensive but bytes show
//                             no privilege ops and no secret reads
//   F3 UNKNOWN_BUT_EVIDENCE  declares risk: unknown while bytes clearly show
//                             privilege or secret activity
//   F4 CONSTANT_FIELD        the declared value equals the catalog modal value
//
// No network. Bytes on disk only.
//
// usage: node frontmatter_risk_lint.mjs <skills-root> [--out report.json]

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

// EXECUTABLE code only. A credential mentioned in a prose reference doc is a
// mention, not a request: "set GITHUB_TOKEN before running" in a comparison
// table does not make the skill require a credential. Only files that can
// actually execute count toward the contradiction.
const CODE_EXT = new Set([".py", ".sh", ".bash", ".js", ".ts", ".mjs", ".cjs"]);
// Prose/config files are scanned separately and reported as DOC_MENTIONS:
// they are evidence of a topic, never evidence of a requirement.
const DOC_EXT = new Set([".md", ".txt", ".yaml", ".yml", ".json", ".toml"]);

const SECRET_PATTERNS = [
  /os\.environ(?:\.get)?\s*\[?\s*["'`]([A-Z_]*(?:KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)[A-Z_]*)["'`]/g,
  /os\.getenv\s*\(\s*["'`]([A-Z_]*(?:KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)[A-Z_]*)["'`]/g,
  /\bAWS_SECRET_ACCESS_KEY\b/g,
  /\bAWS_ACCESS_KEY_ID\b/g,
  /\$\{?AWS_[A-Z_]+\}?/g,
  /~?\/\.aws\/credentials/g,
  /\bGOOGLE_APPLICATION_CREDENTIALS\b/g,
  /\bHF_TOKEN\b/g,
  /\bGITHUB_TOKEN\b/g,
  /\bOPENAI_API_KEY\b/g,
  /\bANTHROPIC_API_KEY\b/g,
  /\bJUPYTERHUB_TOKEN\b/g,
  /\bNVIDIA_API_KEY\b/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\bprintenv\b/g,
  /\bkeyring\b/g,
];

const PRIV_PATTERNS = [
  /\bsudo\b/g,
  /\bchmod\s+[0-7]*777/g,
  /\bsetuid\b/g,
  /\bchown\s+root\b/g,
  /\/etc\/passwd/g,
  /\/etc\/sudoers\b/g,
  /\buseradd\b/g,
  /\bvisudo\b/g,
  /\bapt(?:-get)?\s+install\b/g,
  /\bdocker\s+run\b/g,
  /\busermod\b/g,
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function scan(files, patterns) {
  const hits = new Set();
  const evidence = [];
  const docHits = new Set();
  const docEvidence = [];
  for (const f of files) {
    const ext = f.slice(f.lastIndexOf("."));
    if (DOC_EXT.has(ext)) {
      // prose/config: record mentions, but they never prove a requirement
      let dtext;
      try { dtext = readFileSync(f, "utf8"); } catch { continue; }
      if (dtext.length > 400000) continue;
      for (const re of patterns) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(dtext)) !== null) {
          docHits.add(re.source);
          if (docEvidence.length < 3) {
            const line = dtext.slice(0, m.index).split("\n").length;
            docEvidence.push(`${relative(root, f)}:${line} ${m[0].trim().slice(0, 50)} (prose)`);
          }
        }
      }
      continue;
    }
    if (!CODE_EXT.has(ext)) continue;
    let text;
    try {
      text = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    if (text.length > 400000) continue;
    for (const re of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        hits.add(re.source);
        if (evidence.length < 4) {
          const line = text.slice(0, m.index).split("\n").length;
          evidence.push(`${relative(root, f)}:${line} ${m[0].trim().slice(0, 50)}`);
        }
      }
    }
  }
  return { n: hits.size, evidence, doc_n: docHits.size, doc_evidence: docEvidence };
}

const args = process.argv.slice(2);
const root = args[0];
const outFile = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
if (!root) {
  console.error("usage: frontmatter_risk_lint.mjs <skills-root> [--out report.json]");
  process.exit(2);
}

const skills = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory()).sort();

// modal declared risk
const decl = [];
for (const s of skills) {
  const p = join(root, s, "SKILL.md");
  if (!existsSync(p)) continue;
  let fm = "";
  try {
    const t = readFileSync(p, "utf8");
    const m = t.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) continue;
    fm = m[1];
  } catch {
    continue;
  }
  const rm = fm.match(/^risk:\s*["']?([A-Za-z_ -]+?)["']?\s*$/m);
  if (!rm) continue;
  decl.push({ skill: s, risk: rm[1].trim().toLowerCase() });
}
const counts = new Map();
for (const d of decl) counts.set(d.risk, (counts.get(d.risk) ?? 0) + 1);
const modal = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

const findings = [];
const rows = [];
for (const s of skills) {
  const d = decl.find((x) => x.skill === s);
  if (!d) continue;
  const dir = join(root, s);
  const files = walk(dir).filter((f) => !f.endsWith(".sig"));
  const secret = scan(files, SECRET_PATTERNS);
  const priv = scan(files, PRIV_PATTERNS);
  const sf = [];
  const safe = d.risk === "safe" || d.risk === "none";
  const unsafe = d.risk === "critical" || d.risk === "offensive";
  if (safe && secret.n > 0) {
    sf.push({
      code: "F1_SAFE_BUT_SECRETS",
      severity: "error",
      detail: `declares risk: ${d.risk} but bytes read ${secret.n} secret pattern(s)`,
      evidence: secret.evidence.slice(0, 2),
    });
  }
  if (unsafe && secret.n === 0 && priv.n === 0 && secret.doc_n === 0 && priv.doc_n === 0) {
    sf.push({
      code: "F2_UNSAFE_BUT_BENIGN",
      severity: "warn",
      detail: `declares risk: ${d.risk} but EXECUTABLE bytes show no secret reads and no privilege operations (and no prose mentions either)`,
      evidence: [],
    });
  }
  if (d.risk === "unknown" && (secret.n > 0 || priv.n > 0)) {
    sf.push({
      code: "F3_UNKNOWN_BUT_EVIDENCE",
      severity: "warn",
      detail: `declares risk: unknown but bytes show ${secret.n} secret and ${priv.n} privilege pattern(s)`,
      evidence: [...secret.evidence, ...priv.evidence].slice(0, 2),
    });
  }
  for (const f of sf) findings.push({ skill: s, declared_risk: d.risk, ...f });
  rows.push({
    skill: s,
    declared_risk: d.risk,
    risk_is_modal: d.risk === modal,
    byte_secret_reads: secret.n,
    byte_privilege_ops: priv.n,
    doc_secret_mentions: secret.doc_n,
    doc_privilege_mentions: priv.doc_n,
    findings: sf.map((f) => f.code),
  });
}

const out = {
  tool: "frontmatter_risk_lint",
  measuredAt: new Date().toISOString(),
  catalog: "sickn33/agentic-awesome-skills",
  skills_with_risk_field: decl.length,
  declared_risk_histogram: [...counts.entries()].map(([k, v]) => ({ risk: k, count: v })),
  modal_declared_risk: modal,
  distinct_declared_risks: counts.size,
  counts: {
    F1_SAFE_BUT_SECRETS: findings.filter((f) => f.code === "F1_SAFE_BUT_SECRETS").length,
    F1B_SAFE_BUT_DOC_MENTIONS: rows.filter((r) => (r.declared_risk === "safe" || r.declared_risk === "none") && r.byte_secret_reads === 0 && r.doc_secret_mentions > 0).length,
    F2_UNSAFE_BUT_BENIGN: findings.filter((f) => f.code === "F2_UNSAFE_BUT_BENIGN").length,
    F3_UNKNOWN_BUT_EVIDENCE: findings.filter((f) => f.code === "F3_UNKNOWN_BUT_EVIDENCE").length,
  },
  failing_skills: new Set(findings.filter((f) => f.severity === "error").map((f) => f.skill)).size,
  exit_code: findings.some((f) => f.severity === "error") ? 1 : 0,
  findings,
  rows,
};

if (outFile) writeFileSync(outFile, JSON.stringify(out, null, 1));
const { rows: _r, findings: _f, ...summary } = out;
console.log(JSON.stringify(summary, null, 1));
