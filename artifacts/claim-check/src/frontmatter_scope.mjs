// Frontmatter scope analysis.
//
// FINDING UNDER TEST: in an agent skill/declaration file, the allow-list is
// usually carried IN THE SAME FILE as the instructions. That means the bytes
// that bound the agent are bytes the agent (or whoever writes the file) holds
// and can edit. The counterparty's scope and the agent's instructions are not
// separate artifacts.
//
// This script measures, over the external corpus:
//   - how often a frontmatter allow-list exists at all
//   - how often that allow-list grants Bash / Write / Edit (effect-capable)
//   - how often the grant is UNBOUNDED (Bash(*), Bash, or a bare "Bash")
//   - how often the granted tools exceed what the body can then do
//     (e.g. Bash granted AND the body contains a request we classify as a
//      request) -> the declaration's own allow-list covers the declaration's
//      own out-of-scope request
//   - whether the allow-list is mentioned as editable / extensible
//
// Pure, offline, deterministic.

import { readFileSync } from "fs";
import { verdictForDeclaration } from "./check_declaration.mjs";

const dir = new URL("../corpus/forge/", import.meta.url).pathname;
const idx = JSON.parse(readFileSync(dir + "index.json", "utf8"));

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}
function parseTools(fm) {
  if (!fm) return null;
  const m = fm.match(/^(?:allowed-tools|tools):\s*(.*)$/m);
  if (!m) return null;
  return m[1]
    .replace(/[[\]"']/g, "")
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^-\s*/, ""));
}

const EFFECT = new Set(["Bash", "Write", "Edit", "MultiEdit", "Task", "NotebookEdit"]);
const stats = {
  files: 0,
  has_frontmatter: 0,
  has_allowlist: 0,
  grants_effect: 0,
  grants_unbounded_bash: 0,
  grants_bash_wildcard: 0,
  body_has_request: 0,
  allowlist_covers_own_request: 0,
  allowlist_self_extensible: 0,
};
const examples = [];

for (const r of idx.rows) {
  const text = readFileSync(dir + r.file.replace("corpus/forge/", ""), "utf8");
  stats.files++;
  const fm = frontmatter(text);
  if (fm) stats.has_frontmatter++;
  const tools = parseTools(fm);
  if (!tools) continue;
  stats.has_allowlist++;
  const hasEffect = tools.some((t) => EFFECT.has(t.split("(")[0]));
  if (hasEffect) stats.grants_effect++;
  const bash = tools.filter((t) => t.toLowerCase().startsWith("bash"));
  if (bash.length) {
    stats.grants_unbounded_bash++;
    if (bash.some((t) => t.includes("(") && t.includes("*"))) stats.grants_bash_wildcard++;
  }
  const v = verdictForDeclaration(text);
  const reqs = v.findings.filter((f) => f.request);
  if (reqs.length) {
    stats.body_has_request++;
    if (hasEffect) {
      stats.allowlist_covers_own_request++;
      if (examples.length < 12)
        examples.push({
          file: r.file,
          repo: r.repo,
          allowed_tools: tools,
          requests: reqs.map((f) => `${f.code}@L${f.line}`).slice(0, 4),
        });
    }
  }
  if (/may\s+(?:add|extend|append|include|widen|update)\b[^\n]{0,60}\b(?:allowed[_-]?tools?|allow[_-]?list|scope|permissions?)\b/i.test(text))
    stats.allowlist_self_extensible++;
}

console.log(
  JSON.stringify(
    {
      corpus: { source: idx.source, files: stats.files },
      results: {
        "files with frontmatter": `${stats.has_frontmatter} / ${stats.files}`,
        "files carrying an allow-list in their own frontmatter": `${stats.has_allowlist} / ${stats.files}`,
        "allow-list grants an effect-capable tool (Bash/Write/Edit)": `${stats.grants_effect} / ${stats.has_allowlist}`,
        "allow-list grants Bash at all": `${stats.grants_unbounded_bash} / ${stats.has_allowlist}`,
        "allow-list grants Bash with a wildcard": `${stats.grants_bash_wildcard} / ${stats.has_allowlist}`,
        "body contains a request our checker classifies as a request": `${stats.body_has_request} / ${stats.files}`,
        "DECLARATION'S OWN allow-list covers its own out-of-scope request": `${stats.allowlist_covers_own_request} / ${stats.body_has_request}`,
        "allow-list described as extendable": `${stats.allowlist_self_extensible}`,
      },
      examples,
    },
    null,
    1
  )
);
