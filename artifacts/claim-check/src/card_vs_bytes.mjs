// card_vs_bytes: declaration-truth table for a signed skill catalog.
//
// NEW ARTIFACT FORM (no incumbent ships this): for each published skill,
// what the vendor's own signed DECLARATION (skill-card.md) claims about
// credentials and risk, versus what the signed BYTES actually request.
//
// A card schema whose fields are filled with a constant is a schema, not a
// declaration. We report two facts per skill:
//   - credential_contradiction : card says no/not-specified credential, bytes read secrets
//   - risk_text_is_constant    : the card's risk statement is identical to the
//                                catalog-wide constant (so it carries no per-skill signal)
//
// No network. No model. No vendor code. Bytes on disk only.

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const CODE_EXT = new Set([".py", ".sh", ".bash", ".js", ".ts", ".mjs", ".cjs", ".yaml", ".yml", ".json", ".md"]);

const SECRET_PATTERNS = [
  /os\.environ(?:\.get)?\s*\[?\s*["'`]([A-Z_]*(?:KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)[A-Z_]*)["'`]/g,
  /os\.getenv\s*\(\s*["'`]([A-Z_]*(?:KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)[A-Z_]*)["'`]/g,
  /\bAWS_SECRET_ACCESS_KEY\b/g,
  /\bAWS_ACCESS_KEY_ID\b/g,
  /\$\{?AWS_[A-Z_]+\}?/g,
  /~?\/\.aws\/credentials/g,
  /\bGOOGLE_APPLICATION_CREDENTIALS\b/g,
  /\bGCP_[A-Z_]*CREDENTIAL[A-Z_]*\b/g,
  /\bAZURE_[A-Z_]*\b/g,
  /\bprintenv\b/g,
  /\bkeyring\b/g,
  /\bssh-agent\b/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\bHF_TOKEN\b/g,
  /\bGITHUB_TOKEN\b/g,
  /\bNVIDIA_API_KEY\b/g,
];

const PRIV_PATTERNS = [
  /\bsudo\b/g,
  /\bchmod\s+[0-7]*777/g,
  /\bsetuid\b/g,
  /\bchown\s+root\b/g,
  /\/etc\/passwd/g,
  /\/etc\/sudoers/g,
  /\buseradd\b/g,
  /\bvisudo\b/g,
  /\bapt(?:-get)?\s+install\b/g,
  /\bdocker\s+run\b/g,
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function scan(files, patterns) {
  const hits = new Set();
  const evidence = [];
  for (const f of files) {
    const ext = f.slice(f.lastIndexOf("."));
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
        const key = `${re.source}::${m[1] ?? ""}`;
        hits.add(key);
        if (evidence.length < 6) {
          const line = text.slice(0, m.index).split("\n").length;
          evidence.push(`${relative(root, f)}:${line} ${m[0].trim().slice(0, 60)}`);
        }
      }
    }
  }
  return { hits: [...hits], evidence };
}

const root = process.argv[2];
const outFile = process.argv[3];
if (!root) {
  console.error("usage: card_vs_bytes.mjs <catalog-root> [out.json]");
  process.exit(2);
}

const skillsDir = join(root, "skills");
const skills = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()).sort();

// catalog-wide risk-statement constant
const riskOf = (card) => {
  const m = card.match(/## Known Risks and Mitigations:[\s\S]*?Risk:\s*([^<\n]*)/i);
  return m ? m[1].trim() : null;
};
const credOf = (card) => {
  const m = card.match(/\*\*Requires API Key or External Credential:\*\*\s*\[([^\]]*)\]/i);
  return m ? m[1].trim() : null;
};
const credTypeOf = (card) => {
  const m = card.match(/\*\*Credential Type\(s\):\*\*\s*\[([^\]]*)\]/i);
  return m ? m[1].trim() : null;
};

const cards = [];
for (const s of skills) {
  const p = join(skillsDir, s, "skill-card.md");
  if (!existsSync(p) || statSync(p).size === 0) continue;
  try {
    cards.push({ skill: s, risk: riskOf(readFileSync(p, "utf8")) });
  } catch {}
}
const riskCounts = new Map();
for (const c of cards) {
  if (!c.risk) continue;
  riskCounts.set(c.risk, (riskCounts.get(c.risk) ?? 0) + 1);
}
const catalogConstantRisk = [...riskCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

const rows = [];
for (const s of skills) {
  const dir = join(skillsDir, s);
  const files = walk(dir).filter((f) => !f.endsWith(".sig"));
  let card = "";
  try {
    const cp = join(dir, "skill-card.md");
    if (existsSync(cp)) card = readFileSync(cp, "utf8");
  } catch {}
  const hasCard = card.length > 0;
  const cred = credOf(card);
  const credType = credTypeOf(card);
  const risk = riskOf(card);
  const secret = scan(files, SECRET_PATTERNS);
  const priv = scan(files, PRIV_PATTERNS);
  const declaresNone =
    cred === null ||
    ["not specified", "no", "none"].includes((cred ?? "").toLowerCase()) ||
    ["none", "none identified"].includes((credType ?? "").toLowerCase());
  const contradiction = declaresNone && secret.hits.length > 0;
  rows.push({
    skill: s,
    has_card: hasCard,
    card_requires_credential: cred,
    card_credential_type: credType,
    card_risk_is_catalog_constant: risk === catalogConstantRisk,
    byte_secret_reads: secret.hits.length,
    byte_privilege_ops: priv.hits.length,
    credential_contradiction: contradiction,
    evidence: [...secret.evidence, ...priv.evidence].slice(0, 4),
  });
}

const out = {
  measuredAt: new Date().toISOString(),
  catalog: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  skills: rows.length,
  cards_parsed: cards.length,
  catalog_constant_risk_statement: catalogConstantRisk,
  distinct_risk_statements: riskCounts.size,
  risk_statement_histogram: [...riskCounts.entries()].map(([k, v]) => ({ statement: k, count: v })),
  credentials_declared_none: rows.filter((r) => r.card_requires_credential !== null && ["not specified", "no"].includes(r.card_requires_credential.toLowerCase())).length,
  credential_contradictions: rows.filter((r) => r.credential_contradiction).map((r) => ({ skill: r.skill, card_requires_credential: r.card_requires_credential, card_credential_type: r.card_credential_type, byte_secret_reads: r.byte_secret_reads, evidence: r.evidence })),
  skills_with_secret_reads: rows.filter((r) => r.byte_secret_reads > 0).length,
  skills_with_privilege_ops: rows.filter((r) => r.byte_privilege_ops > 0).length,
  skills_privilege_with_constant_risk: rows.filter((r) => r.byte_privilege_ops > 0 && r.card_risk_is_catalog_constant).length,
  skills_privilege_total: rows.filter((r) => r.byte_privilege_ops > 0).length,
  rows,
};

if (outFile) writeFileSync(outFile, JSON.stringify(out, null, 1));
const { rows: _r, ...summary } = out;
console.log(JSON.stringify(summary, null, 1));
