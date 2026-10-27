// card_truth_lint: a CI linter for skill cards.
//
// ARTIFACT FORM: no incumbent ships this. Existing tools check the FORM of a
// skill card (does it have the required headings?) or scan skill BYTES for
// dangerous patterns. This linter checks the card against the skill's own
// bytes and against the catalog it ships in, and FAILS the build when a
// declaration is not distinguishable from a template default:
//
//   T1 CONSTANT_RISK      the card's risk statement is byte-identical to the
//                         catalog-wide modal risk statement -> the field
//                         carries no per-skill signal.
//   T2 CREDENTIAL_LIE     the card says no credential / not specified / none,
//                         but the skill's bytes read a secret.
//   T3 UNDECLARED_PRIV    the card declares no risk (or the constant one) and
//                         the skill's bytes perform privilege operations.
//
// A card whose risk field is a constant is a schema, not a declaration.
// Failing the build on that is the whole point.
//
// No network. No model. No vendor code. Bytes on disk only.
//
// usage: node card_truth_lint.mjs <catalog-root> [--out report.json] [--baseline <file>]

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const CODE_EXT = new Set([".py", ".sh", ".bash", ".js", ".ts", ".mjs", ".cjs", ".yaml", ".yml", ".json", ".md", ".txt", ".toml"]);

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
  /\bHF_TOKEN\b/g,
  /\bGITHUB_TOKEN\b/g,
  /\bNVIDIA_API_KEY\b/g,
  /\bJUPYTERHUB_TOKEN\b/g,
  /\bOPENAI_API_KEY\b/g,
  /\bANTHROPIC_API_KEY\b/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
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
  /\busermod\b/g,
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
        hits.add(`${re.source}::${m[1] ?? ""}`);
        if (evidence.length < 6) {
          const line = text.slice(0, m.index).split("\n").length;
          evidence.push(`${relative(root, f)}:${line} ${m[0].trim().slice(0, 60)}`);
        }
      }
    }
  }
  return { hits: [...hits], evidence };
}

// ---- card parsing (tolerant: catalogs use different card shapes) ----------
const riskOf = (card) => {
  const m =
    card.match(/##\s*Known Risks and Mitigations:[\s\S]*?Risk:\s*([^<\n]*)/i) ||
    card.match(/##\s*Risk[s]?[:\s]*\n+([^\n]+)/i) ||
    card.match(/\*\*Risk:\*\*\s*([^\n]+)/i);
  return m ? m[1].trim() : null;
};
const credOf = (card) => {
  const m =
    card.match(/\*\*Requires API Key or External Credential:\*\*\s*\[([^\]]*)\]/i) ||
    card.match(/Requires API Key or External Credential:\s*\[?([^\]\n]*)\]?/i);
  return m ? m[1].trim() : null;
};
const credTypeOf = (card) => {
  const m = card.match(/\*\*Credential Type\(s\):\*\*\s*\[([^\]]*)\]/i);
  return m ? m[1].trim() : null;
};
const NONE_ANSWERS = new Set(["", "no", "none", "not specified", "n/a", "none identified", "not required"]);

const args = process.argv.slice(2);
const root = args[0];
const outFile = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const baselineFile = args.includes("--baseline") ? args[args.indexOf("--baseline") + 1] : null;
if (!root) {
  console.error("usage: card_truth_lint.mjs <catalog-root> [--out report.json] [--baseline baseline.json]");
  process.exit(2);
}

const skillsDir = join(root, "skills");
const skills = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()).sort();

// catalog-wide modal risk statement
const riskCounts = new Map();
const parsed = [];
for (const s of skills) {
  const p = join(skillsDir, s, "skill-card.md");
  if (!existsSync(p) || statSync(p).size === 0) continue;
  let card = "";
  try {
    card = readFileSync(p, "utf8");
  } catch {
    continue;
  }
  const risk = riskOf(card);
  parsed.push({ skill: s, risk, cred: credOf(card), credType: credTypeOf(card) });
  if (risk) riskCounts.set(risk, (riskCounts.get(risk) ?? 0) + 1);
}
const modalRisk = [...riskCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;
const riskShare = modalRisk ? (riskCounts.get(modalRisk) / parsed.length) : 0;

const findings = [];
const rows = [];
for (const s of skills) {
  const dir = join(skillsDir, s);
  const files = walk(dir).filter((f) => !f.endsWith(".sig") && !f.endsWith(".sig.json"));
  let card = "";
  const cp = join(dir, "skill-card.md");
  const hasCard = existsSync(cp) && statSync(cp).size > 0;
  if (hasCard) {
    try {
      card = readFileSync(cp, "utf8");
    } catch {}
  }
  const p = parsed.find((x) => x.skill === s);
  const risk = p?.risk ?? null;
  const cred = p?.cred ?? null;
  const credType = p?.credType ?? null;
  const secret = scan(files, SECRET_PATTERNS);
  const priv = scan(files, PRIV_PATTERNS);

  const skillFindings = [];
  if (hasCard) {
    if (!risk) {
      skillFindings.push({
        code: "T0_NO_RISK_FIELD",
        severity: "error",
        detail: "card declares no risk field at all - an absent declaration is not a declaration",
        evidence: [],
      });
    }
    if (cred === null && credType === null) {
      skillFindings.push({
        code: "T4_NO_CREDENTIAL_FIELD",
        severity: "warn",
        detail: "card declares no credential field at all",
        evidence: [],
      });
    }
    if (modalRisk && risk && risk === modalRisk) {
      skillFindings.push({
        code: "T1_CONSTANT_RISK",
        severity: "error",
        detail: `risk statement is byte-identical to the catalog modal statement (${riskCounts.get(modalRisk)}/${parsed.length} cards)`,
        evidence: [risk.slice(0, 140)],
      });
    }
    const declaresNone =
      (cred !== null && NONE_ANSWERS.has(cred.toLowerCase())) ||
      (credType !== null && NONE_ANSWERS.has(credType.toLowerCase()));
    if (declaresNone && secret.hits.length > 0) {
      skillFindings.push({
        code: "T2_CREDENTIAL_LIE",
        severity: "error",
        detail: `card declares no credential (${cred ?? credType}) but bytes read ${secret.hits.length} secret pattern(s)`,
        evidence: secret.evidence.slice(0, 3),
      });
    }
  }
  if (!hasCard) {
    skillFindings.push({
      code: "T5_NO_CARD",
      severity: "error",
      detail: "skill is published with no skill-card.md - nothing is declared, so nothing can be checked",
      evidence: [],
    });
  }
  if ((!risk || (modalRisk && risk === modalRisk)) && priv.hits.length > 0) {
    skillFindings.push({
      code: "T3_UNDECLARED_PRIV",
      severity: "warn",
      detail: `card risk statement carries no per-skill signal while bytes perform ${priv.hits.length} privilege operation(s)`,
      evidence: priv.evidence.slice(0, 3),
    });
  }
  for (const f of skillFindings) findings.push({ skill: s, ...f });
  rows.push({
    skill: s,
    has_card: hasCard,
    risk: risk,
    risk_is_modal: !!(modalRisk && risk === modalRisk),
    card_requires_credential: cred,
    byte_secret_reads: secret.hits.length,
    byte_privilege_ops: priv.hits.length,
    findings: skillFindings.map((f) => f.code),
  });
}

const out = {
  tool: "card_truth_lint",
  measuredAt: new Date().toISOString(),
  catalog: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  skills: rows.length,
  cards_parsed: parsed.length,
  cards_missing: rows.filter((r) => !r.has_card).map((r) => r.skill),
  modal_risk_statement: modalRisk,
  modal_risk_share: Number(riskShare.toFixed(4)),
  distinct_risk_statements: riskCounts.size,
  counts: {
    T0_NO_RISK_FIELD: findings.filter((f) => f.code === "T0_NO_RISK_FIELD").length,
    T1_CONSTANT_RISK: findings.filter((f) => f.code === "T1_CONSTANT_RISK").length,
    T2_CREDENTIAL_LIE: findings.filter((f) => f.code === "T2_CREDENTIAL_LIE").length,
    T3_UNDECLARED_PRIV: findings.filter((f) => f.code === "T3_UNDECLARED_PRIV").length,
    T4_NO_CREDENTIAL_FIELD: findings.filter((f) => f.code === "T4_NO_CREDENTIAL_FIELD").length,
    T5_NO_CARD: findings.filter((f) => f.code === "T5_NO_CARD").length,
  },
  // silence vs denial, separated: a card that says "no credential" while the
  // bytes read secrets is a lie (T2); a card with no credential field at all
  // is silence (T4). Cycle 38 counted both as "contradictions" (41 for
  // NVIDIA/skills). This tool reports them separately.
  credential_lie_vs_silence: {
    lies: findings.filter((f) => f.code === "T2_CREDENTIAL_LIE").length,
    silent_cards_reading_secrets: rows.filter(
      (r) => r.card_requires_credential === null && r.byte_secret_reads > 0,
    ).length,
    cards_with_no_credential_field: rows.filter((r) => r.card_requires_credential === null).length,
  },
  failing_skills: new Set(findings.filter((f) => f.severity === "error").map((f) => f.skill)).size,
  exit_code: findings.some((f) => f.severity === "error") ? 1 : 0,
  findings,
  rows,
};

if (outFile) writeFileSync(outFile, JSON.stringify(out, null, 1));

if (baselineFile && existsSync(baselineFile)) {
  let base;
  try {
    base = JSON.parse(readFileSync(baselineFile, "utf8"));
  } catch {
    base = null;
  }
  if (base) {
    const key = (f) => `${f.skill}::${f.code}`;
    const baseSet = new Set((base.findings || []).map(key));
    const nowSet = new Set(findings.map(key));
    out.baseline = {
      file: baselineFile,
      baseline_catalog: base.catalog,
      catalog_moved: base.catalog !== out.catalog,
      fixed_since_baseline: [...baseSet].filter((k) => !nowSet.has(k)),
      new_since_baseline: [...nowSet].filter((k) => !baseSet.has(k)),
      persistent: [...nowSet].filter((k) => baseSet.has(k)).length,
    };
  }
}

const { rows: _r, findings: _f, ...summary } = out;
console.log(JSON.stringify(summary, null, 1));
