// Counter-context: documentation context.
//
// FINDING UNDER TEST (found by running our own unit against a REAL shipping
// skill - the ironheights 0.13.0 ClawHub skill - which our unit scored
// UNDECIDABLE on):
//
//   A skill that DOCUMENTS a scanner finding is not a skill that performs it.
//   "Asking the agent to read a private key file" inside a fenced example of
//   what a report looks like is a citation, not a request. Our unit counted
//   it as an ambiguous directive, which pushed a legitimate security skill to
//   UNDECIDABLE.
//
// This is the mirror of the existing quoted-mention carve-out, extended from
// "the same line" to "the same block":
//   1. inside a fenced code block (``` or ~~~)
//   2. inside a section whose heading marks it as an example / usage /
//      sample / output block
//
// Scope of the fix is deliberately narrow: it applies ONLY to weak-tier
// matches. A strong-tier match inside a fence is still a request - the bytes
// are the operation - and stays OUT-OF-SCOPE. We are not softening the
// detector; we are fixing where the DETECTOR LOOKS.
//
// Pure, offline, deterministic.

/**
 * @param {string} text
 * @returns {Set<number>} 1-based line numbers that are documentation context
 */
export function documentationContextLines(text) {
  const lines = text.split("\n");
  const ctx = new Set();
  let inFence = false;
  let fenceMarker = null;
  let inExampleSection = false;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const n = i + 1;

    // Fenced code block. Opening and closing fence lines are themselves
    // documentation context (they carry the fence syntax, not instructions).
    const fence = l.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence[1][0];
        ctx.add(n);
        continue;
      }
      if (fence[1][0] === fenceMarker) {
        inFence = false;
        fenceMarker = null;
        ctx.add(n);
        continue;
      }
    }
    if (inFence) { ctx.add(n); continue; }

    // Heading-driven example / usage / sample section.
    const h = l.match(/^(#{1,6})\s*(.+?)\s*$/);
    if (h) {
      if (/^(example|examples|usage|sample|samples|output|outputs|sample output|example output|illustrat\w*|demo)\b/i.test(h[2])) {
        inExampleSection = true;
        ctx.add(n);
        continue;
      }
      // Any other heading ends the example section.
      inExampleSection = false;
      continue;
    }
    if (inExampleSection) ctx.add(n);
  }
  return ctx;
}
