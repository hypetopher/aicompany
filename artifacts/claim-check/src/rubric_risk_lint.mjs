// rubric_risk_lint: test a declared risk label against the rubric the
// declaring catalog itself publishes.
//
// The previous frontmatter_risk_lint.mjs used my own guess at what
// "safe" meant and produced 42 "contradictions" that were mostly prose
// mentions. That was a false measurement. This version takes the rubric
// verbatim from the catalog's own documentation
// (sickn33/agentic-awesome-skills, docs/contributors/skill-anatomy.md):
//
//   none      - pure text/reasoning, no commands or mutations
//   safe      - reads files, runs non-destructive commands
//   critical  - modifies state, deletes files, pushes to production
//   offensive - pentesting/red-team tools; must carry "Authorized Use Only"
//
// Each label makes a PREDICTION about the bytes. The check is: does the
// evidence match the prediction? Only EXECUTABLE code counts as evidence;
// prose and config are recorded separately and never count as behaviour.
//
//   R1 NONE_BUT_EXECUTES     risk: none     but ships executable code
//   R2 NONE_BUT_MUTATES      risk: none     but code mutates state
//   R3 SAFE_BUT_MUTATES      risk: safe     but code mutates/deletes/pushes
//   R4 CRITICAL_BUT_INERT    risk: critical but code shows no mutation at all
//   R5 OFFENSIVE_NO_GATE    risk: offensive but no authorization disclaimer
//
// No network. Bytes on disk only.
//
// usage: node rubric_risk_lint.mjs <skills-root> [--out report.json]

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const EXEC_EXT = new Set([".py", ".sh", ".bash", ".js", ".ts", ".mjs", ".cjs"]);
const DOC_EXT = new Set([".md", ".txt", ".yaml", ".yml", ".json", ".toml"]);

// MUTATION: writes, deletes, pushes, or installs. These are the behaviours
// the rubric says distinguish "safe" from "critical".
const MUTATION_PATTERNS = [
  /\.write_text\s*\(/g,
  /\.write_bytes\s*\(/g,
  /open\s*\([^)]*['"][wax](\+)?['"]/g,
  /\.unlink\s*\(/g,
  /os\.remove\s*\(/g,
  /os\.rmdir\s*\(/g,
  /shutil\.rmtree\s*\(/g,
  /Path\([^)]*\)\.write/g,
  /\brm\s+-[rf]{1,2}\b/g,
  /\bgit\s+push\b/g,
  /\bgit\s+commit\b/g,
  /\bgit\s+reset\s+--hard\b/g,
  /\bgh\s+pr\s+(create|merge)\b/g,
  /\bkubectl\s+(apply|delete|scale)\b/g,
  /\bterraform\s+apply\b/g,
  /\baws\s+\S+\s+delete-/g,
  /\bDROP\s+TABLE\b/gi,
  /\bDELETE\s+FROM\b/gi,
  /\bTRUNCATE\s+TABLE\b/gi,
  /\bchmod\s+[0-7]*777\b/g,
  /\bsudo\b/g,
  /\bdocker\s+run\b/g,
  /\bnpm\s+(install|publish)\b/g,
  /\bpip\s+install\b/g,
  /\bapt(?:-get)?\s+install\b/g,
];

// EXECUTION: a skill that "runs no commands" has no shell/subprocess surface.
const EXECUTION_PATTERNS = [
  /subprocess\.(run|Popen|call|check_output|check_call)\s*\(/g,
  /os\.system\s*\(/g,
  /os\.popen\s*\(/g,
  /child_process\b/g,
  /execSync\s*\(/g,
  /spawnSync\s*\(/g,
  /Runtime\.getRuntime\(\)\.exec\b/g,
];

// DESTRUCTIVE: subset of mutation that "safe" explicitly excludes.
const DESTRUCTIVE_PATTERNS = [
  /\.unlink\s*\(/g,
  /os\.remove\s*\(/g,
  /shutil\.rmtree\s*\(/g,
  /\brm\s+-[rf]{1,2}\b/g,
  /\bgit\s+push\b/g,
  /\bgit\s+reset\s+--hard\b/g,
  /\bgh\s+pr\s+(create|merge)\b/g,
  /\bkubectl\s+(apply|delete)\b/g,
  /\bterraform\s+apply\b/g,
  /\bDROP\s+TABLE\b/gi,
  /\bDELETE\s+FROM\b/gi,
  /\bTRUNCATE\s+TABLE\b/gi,
  /\bchmod\s+[0-7]*777\b/g,
  /\bsudo\b/g,
];

// PROSE DIRECTIVE: a prose-only skill can still make the AGENT mutate state
// ("write the file", "run rm -rf", "deploy to prod"). Under the rubric that is
// "critical". R4 must only fire when neither code nor prose shows any
// state-changing instruction.
const PROSE_DIRECTIVE = [
  /\bwrite\s+(?:a|the|this|your|it)\s+[\w.-]*\s*(file|script|config|test|code)/gi,
  /\bcreate\s+(?:a|the|your)\s+[\w.-]*\s*(file|script|config|test|project|repo)/gi,
  /\bdelete\s+(?:the|a|all|any)?\s*[\w.-]*\s*(file|folder|directory|branch|resource)/gi,
  /\brm\s+-rf\b/g,
  /\bgit\s+push\b/g,
  /\bdeploy(?:s|ing)?\s+to\s+(prod|production|staging)/gi,
  /\brun\s+(?:the\s+)?[`"']?(?:npm|pip|yarn|apt|brew|make|cargo)\b/gi,
  /\bmigrat(?:e|ion)\b/gi,
  /\binstall(?:s|ing)?\s+(?:the\s+)?dependencies\b/gi,
  /\bchmod\b/g,
  /\bkill\s+(?:the\s+)?process\b/gi,
];

const AUTHORIZATION_GATE = /authori[sz]ed use only|authorized use only|use only against systems you own|for authorized testing/i;

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

function scan(files, patterns, { execOnly = true } = {}) {
  const hits = new Set();
  const evidence = [];
  for (const f of files) {
    const ext = f.slice(f.lastIndexOf("."));
    const isExec = EXEC_EXT.has(ext);
    const isDoc = DOC_EXT.has(ext);
    if (execOnly ? !isExec : !isDoc) continue;
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
        if (evidence.length < 3) {
          const line = text.slice(0, m.index).split("\n").length;
          evidence.push(`${relative(root, f)}:${line} ${m[0].trim().slice(0, 50)}`);
        }
      }
    }
  }
  return { n: hits.size, evidence };
}

const args = process.argv.slice(2);
const root = args[0];
const outFile = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
if (!root) {
  console.error("usage: rubric_risk_lint.mjs <skills-root> [--out report.json]");
  process.exit(2);
}

const skills = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory()).sort();

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

const findings = [];
const rows = [];
for (const d of decl) {
  const dir = join(root, d.skill);
  const files = walk(dir);
  const execFiles = files.filter((f) => EXEC_EXT.has(f.slice(f.lastIndexOf("."))));
  const docFiles = files.filter((f) => DOC_EXT.has(f.slice(f.lastIndexOf("."))));
  const mutation = scan(execFiles, MUTATION_PATTERNS);
  const destructive = scan(execFiles, DESTRUCTIVE_PATTERNS);
  const execution = scan(execFiles, EXECUTION_PATTERNS);
  const docMutation = scan(docFiles, MUTATION_PATTERNS, { execOnly: false });
  // prose state-changing directives, from SKILL.md + reference docs
  let proseDirective = { n: 0, evidence: [] };
  {
    const hits = new Set();
    const ev = [];
    for (const f of docFiles) {
      let text;
      try { text = readFileSync(f, "utf8"); } catch { continue; }
      if (text.length > 400000) continue;
      for (const re of PROSE_DIRECTIVE) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(text)) !== null) {
          hits.add(re.source);
          if (ev.length < 3) {
            const line = text.slice(0, m.index).split("\n").length;
            ev.push(`${relative(root, f)}:${line} ${m[0].trim().slice(0, 50)}`);
          }
        }
      }
    }
    proseDirective = { n: hits.size, evidence: ev };
  }
  let skillMd = "";
  try {
    skillMd = readFileSync(join(dir, "SKILL.md"), "utf8");
  } catch {}

  const sf = [];
  if (d.risk === "none") {
    if (execFiles.length > 0) {
      sf.push({
        code: "R1_NONE_BUT_EXECUTES",
        severity: "warn",
        detail: `rubric says "none" = pure text, no commands or mutations, but ships ${execFiles.length} executable file(s)`,
        evidence: execFiles.slice(0, 3).map((f) => relative(dir, f)),
      });
    }
    if (mutation.n > 0) {
      sf.push({
        code: "R2_NONE_BUT_MUTATES",
        severity: "error",
        detail: `rubric says "none" = no mutations, but executable code shows ${mutation.n} mutation pattern(s)`,
        evidence: mutation.evidence.slice(0, 3),
      });
    }
  }
  if (d.risk === "safe") {
    if (destructive.n > 0) {
      sf.push({
        code: "R3_SAFE_BUT_MUTATES",
        severity: "error",
        detail: `rubric says "safe" = non-destructive commands, but executable code shows ${destructive.n} destructive pattern(s)`,
        evidence: destructive.evidence.slice(0, 3),
      });
    }
  }
  if (d.risk === "critical") {
    if (mutation.n === 0 && execution.n === 0 && proseDirective.n === 0) {
      sf.push({
        code: "R4_CRITICAL_BUT_INERT",
        severity: "warn",
        detail: `rubric says "critical" = modifies state / deletes / pushes, but skill shows NO executable code, NO prose state-changing directive, and NO prose mutation mention`,
        evidence: [],
      });
    } else if (mutation.n === 0 && execution.n === 0 && docMutation.n > 0) {
      sf.push({
        code: "R4_CRITICAL_BUT_PROSE_ONLY",
        severity: "warn",
        detail: `rubric says "critical" = modifies state, but only prose mentions mutations; no executable mutation found`,
        evidence: docMutation.evidence.slice(0, 2),
      });
    }
  }
  if (d.risk === "offensive" && !AUTHORIZATION_GATE.test(skillMd)) {
    sf.push({
      code: "R5_OFFENSIVE_NO_GATE",
      severity: "error",
      detail: `rubric requires offensive skills to carry an "Authorized Use Only" warning; SKILL.md has none`,
      evidence: [],
    });
  }
  for (const f of sf) findings.push({ skill: d.skill, declared_risk: d.risk, ...f });
  rows.push({
    skill: d.skill,
    declared_risk: d.risk,
    exec_file_count: execFiles.length,
    mutation_patterns: mutation.n,
    destructive_patterns: destructive.n,
    execution_patterns: execution.n,
    doc_mutation_mentions: docMutation.n,
    prose_state_directives: proseDirective.n,
    findings: sf.map((f) => f.code),
  });
}

const out = {
  tool: "rubric_risk_lint",
  measuredAt: new Date().toISOString(),
  catalog: "sickn33/agentic-awesome-skills",
  rubric_source: "docs/contributors/skill-anatomy.md",
  skills_with_risk_field: decl.length,
  declared_risk_histogram: [...counts.entries()].map(([k, v]) => ({ risk: k, count: v })).sort((a, b) => b.count - a.count),
  counts: {
    R1_NONE_BUT_EXECUTES: findings.filter((f) => f.code === "R1_NONE_BUT_EXECUTES").length,
    R2_NONE_BUT_MUTATES: findings.filter((f) => f.code === "R2_NONE_BUT_MUTATES").length,
    R3_SAFE_BUT_MUTATES: findings.filter((f) => f.code === "R3_SAFE_BUT_MUTATES").length,
    R4_CRITICAL_BUT_INERT: findings.filter((f) => f.code === "R4_CRITICAL_BUT_INERT").length,
    R4_CRITICAL_BUT_PROSE_ONLY: findings.filter((f) => f.code === "R4_CRITICAL_BUT_PROSE_ONLY").length,
    critical_declared_total: rows.filter((r) => r.declared_risk === "critical").length,
    critical_declared_with_no_mutation_evidence: rows.filter((r) => r.declared_risk === "critical" && r.mutation_patterns === 0 && r.execution_patterns === 0 && r.prose_state_directives === 0).length,
    R5_OFFENSIVE_NO_GATE: findings.filter((f) => f.code === "R5_OFFENSIVE_NO_GATE").length,
  },
  failing_skills: new Set(findings.filter((f) => f.severity === "error").map((f) => f.skill)).size,
  exit_code: findings.some((f) => f.severity === "error") ? 1 : 0,
  findings,
  rows,
};

if (outFile) writeFileSync(outFile, JSON.stringify(out, null, 1));
const { rows: _r, findings: _f, ...summary } = out;
console.log(JSON.stringify(summary, null, 1));
