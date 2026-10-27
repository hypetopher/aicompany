// decl-17: declaration-vs-behavior contradiction (cross-file).
//
// FINDING UNDER TEST: a skill's frontmatter `description` is a CLAIM about
// what the skill does. The scripts the skill ships are the BEHAVIOR. When
// the claim and the behavior disagree, the declaration is lying about its own
// scope - and that is a scope question, not a malware question.
//
// This is the family the whole scanner field handles worst:
//   - cisco-default / -strict / -osv / -behavioral catch skill-20 (they see
//     the network call) but MISS skill-10 (rmtree behind a "read-only" claim).
//   - skillspector-llm / cisco-llm catch both, but only by spending an LLM.
//   - skillspector-offline / -osv also catch only skill-20.
//   - ours (declaration-only, single file) catches NEITHER, because we never
//     read the scripts the declaration points at.
//   - ironheights 0.13.0 grades BOTH "A / no-findings".
//
// So: no deterministic (no-LLM) configuration in the corpus reaches 2/2 on
// this family, and the deterministic 2/2 route is the one nobody has built.
//
// WHY THIS IS A SCOPE VERDICT AND NOT A MALWARE VERDICT: we are not saying
// "this file is dangerous". We are saying "the declaration's own scope claim
// does not cover the declaration's own behavior". The counterparty - the
// human who reads `description` and decides what to authorize - is misled by
// the bytes we cite. That is exactly the question our unit answers for
// instruction text; this extends it across the file boundary.
//
// DETERMINISM: no network, no LLM, no timestamp. Same bytes -> same output.
//
// STATUS: this module is a SEPARATE unit from check_declaration.mjs on
// purpose. The single-file declaration unit has a measured baseline
// (11/11 tests, 452-file corpus verdicts) and we do not perturb it. The
// combined verdict is the stricter of the two, computed by the caller.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const VERDICT = { OUT_OF_SCOPE: "OUT-OF-SCOPE", IN_SCOPE: "IN-SCOPE", UNDECIDABLE: "UNDECIDABLE" };

// A negative capability claim in the frontmatter description.
const NEGATIVE_CLAIMS = [
  {
    code: "decl.claim-readonly",
    claim: /\bread[- ]only\b/i,
    // behavior that contradicts "read-only"
    behavior: /\b(?:shutil\.rmtree|os\.remove|os\.unlink|os\.rmdir|shutil\.move|shutil\.copy|Path\([^)]*\)\.(?:unlink|rmdir)\b|(?:^|[^\w.])(?:rm|rmdir|del)\s+[^\n]*)/,
    label: "read-only claim",
  },
  {
    code: "decl.claim-never-deletes",
    claim: /\bnever\s+(?:modifies|deletes|removes|renames|moves|overwrites)\b/i,
    behavior: /\b(?:shutil\.rmtree|os\.remove|os\.unlink|os\.rmdir|shutil\.move|shutil\.copy)\b/,
    label: "never-deletes claim",
  },
  {
    code: "decl.claim-offline",
    claim: /\b(?:works?\s+)?(?:fully\s+)?offline\b|\bnever\s+sends?\b|\bnever\s+uploads?\b|\bdoes\s+not\s+send\b|\bwithout\s+network\b|\bno\s+network\b/i,
    behavior: /\b(?:requests\.(?:post|get|put|patch)|httpx\.[a-z]+|urllib\.request\.urlopen|urlopen\(|aiohttp\.[A-Za-z]+\(|socket\.socket\(|fetch\(|axios\.[a-z]+\()|curl\b|wget\b/i,
    label: "offline / no-send claim",
  },
];

// Code files that carry the skill's behavior. The skill's own scripts.
const SCRIPT_EXT = /\.(py|sh|bash|zsh|js|mjs|cjs|ts|rb|pl|ps1)$/i;

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}

function descriptionOf(text) {
  const fm = frontmatter(text);
  if (!fm) return "";
  const m = fm.match(/^description:\s*(.*)$/m);
  if (!m) return "";
  // Fold a YAML block scalar (description: > / |) into one line.
  if (/^[>|][-+]?\s*$/.test(m[1].trim())) {
    const start = text.indexOf(m[0]) + m[0].length;
    const rest = text.slice(start);
    const lines = [];
    for (const l of rest.split("\n")) {
      if (l.trim() === "") { if (lines.length) break; else continue; }
      if (/^\s{2,}\S/.test(l)) lines.push(l.trim());
      else if (lines.length) break;
    }
    return lines.join(" ").slice(0, 400);
  }
  return m[1].trim().slice(0, 400);
}

function scriptFiles(dir) {
  const out = [];
  const walk = (d, depth) => {
    if (depth > 4) return;
    let entries;
    try { entries = readdirSync(d); } catch { return; }
    for (const e of entries.sort()) {
      if (e === "node_modules" || e === ".git" || e.startsWith(".")) continue;
      const p = join(d, e);
      let st;
      try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) walk(p, depth + 1);
      else if (SCRIPT_EXT.test(e)) out.push(p);
    }
  };
  walk(dir, 0);
  return out;
}

/**
 * @param {string} dir skill directory (contains SKILL.md)
 * @returns {{verdict:string, findings:Array, claim:string, contradictions:Array}}
 */
export function contradictionVerdict(dir) {
  const md = join(dir, "SKILL.md");
  let text;
  try { text = readFileSync(md, "utf8"); } catch {
    return { verdict: VERDICT.IN_SCOPE, findings: [], claim: "", contradictions: [], note: "no SKILL.md" };
  }
  const desc = descriptionOf(text);
  const contradictions = [];

  for (const rule of NEGATIVE_CLAIMS) {
    const cm = desc.match(rule.claim);
    if (!cm) continue;
    for (const f of scriptFiles(dir)) {
      const body = readFileSync(f, "utf8");
      // Ignore comment-only lines so a docstring that mentions rm_tree is not
      // a behavior. Only code lines count.
      for (let i = 0; i < body.split("\n").length; i++) {
        const line = body.split("\n")[i];
        const code = line.replace(/(^|\s)(#|\/\/|\*).*$/, "");
        if (!code.trim()) continue;
        const bm = code.match(rule.behavior);
        if (!bm) continue;
        contradictions.push({
          code: rule.code,
          claim: rule.label,
          claimText: cm[0],
          claimExcerpt: desc.slice(0, 200),
          file: relative(dir, f),
          line: i + 1,
          behavior: bm[0].trim().slice(0, 80),
          behaviorExcerpt: code.trim().slice(0, 160),
          cite: `${relative(dir, f)} :: line ${i + 1}: ${code.trim().slice(0, 120)}`,
        });
        break; // one contradicting behavior per file per rule is enough
      }
    }
  }

  const findings = contradictions.map((c) => ({
    code: c.code,
    severity: "high",
    tier: "strong",
    position: "declaration",
    request: true,
    ambiguous: false,
    line: c.line,
    excerpt: c.behaviorExcerpt,
    matched: c.behavior,
    counter_context: false,
    file: c.file,
  }));

  return {
    verdict: contradictions.length ? VERDICT.OUT_OF_SCOPE : VERDICT.IN_SCOPE,
    findings,
    claim: desc,
    contradictions,
  };
}
