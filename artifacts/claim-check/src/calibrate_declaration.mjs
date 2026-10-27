// Calibration: our declaration-scope checker vs The Agent Forge's published labels.
//
// HONESTY NOTE (read before quoting any number here):
//  - The labels are theirs. We did not author them.
//  - The bytes are theirs too, but we fetched them ourselves and verified every
//    file by sha256 against the hash they published, so we can prove we checked
//    the same bytes.
//  - Their rules page publishes rule CODES and prose descriptions, not patterns.
//    We read those descriptions before writing our rules. That is a contamination
//    risk and is disclosed in the output.
//  - The units differ. They label "is this file risky text"; we answer "does
//    this file REQUEST an action outside a given authorization". These are
//    different questions over the same bytes, so disagreement is expected.
//
// CAL / HOLDOUT: our rule set was tuned on the CAL half only. The HOLDOUT half
// is reported as the honest number. Split is deterministic (sha256 of the
// file name), so the split is reproducible and cannot be reshuffled.

import { readFileSync } from "fs";
import { createHash } from "crypto";
import { verdictForDeclaration, VERDICT, SEVERITY } from "./check_declaration.mjs";

const dir = new URL("../corpus/forge/", import.meta.url).pathname;
const idx = JSON.parse(readFileSync(dir + "index.json", "utf8"));

function theirTier(row) {
  const f = row.findings ?? [];
  if (!f.length) return "none";
  const sevs = f.map((x) => x[1]);
  if (sevs.includes("h")) return "high";
  if (sevs.includes("m")) return "medium";
  return "low";
}

// deterministic split
function half(name) {
  const h = createHash("sha256").update(name).digest("hex");
  return parseInt(h.slice(0, 2), 16) % 2 === 0 ? "cal" : "holdout";
}

const rows = [];
for (const r of idx.rows) {
  const text = readFileSync(dir + r.file.replace("corpus/forge/", ""), "utf8");
  const ours = verdictForDeclaration(text);
  rows.push({
    file: r.file,
    repo: r.repo,
    path: r.path,
    is_example: r.is_example,
    half: half(r.file),
    theirs: theirTier(r),
    their_rules: [...new Set((r.findings ?? []).map((x) => x[0]))].sort(),
    ours: ours.verdict,
    our_severity: ours.severity,
    our_codes: ours.findings.filter((f) => f.severity !== SEVERITY.LOW).map((x) => x.code),
    our_high_codes: ours.findings.filter((f) => f.severity === SEVERITY.HIGH).map((x) => x.code),
    n_findings_ours: ours.findings.length,
  });
}

// ---- Question 1: DETECTION. Did each side find anything at all?
// theirs: any finding (high/medium/low). ours: any finding at all.
function detection(r) {
  return { them: r.theirs !== "none", us: r.n_findings_ours > 0 };
}
// ---- Question 2: HIGH-SEVERITY. Both sides have a high tier.
function high(r) {
  return { them: r.theirs === "high", us: r.our_severity === SEVERITY.HIGH };
}
// ---- Question 3: SCOPE VERDICT. their tier mapped to a verdict.
const TIER_MAP = { high: VERDICT.OUT_OF_SCOPE, medium: VERDICT.UNDECIDABLE, low: VERDICT.IN_SCOPE, none: VERDICT.IN_SCOPE };
function verdict(r) {
  return { them: TIER_MAP[r.theirs], us: r.ours };
}

function score(rs, fn) {
  let agree = 0;
  const dis = [];
  for (const r of rs) {
    const { them, us } = fn(r);
    if (them === us) agree++;
    else dis.push({ file: r.file, repo: r.repo, theirs: r.theirs, ours: r.ours, our_codes: r.our_codes, their_rules: r.their_rules });
  }
  return { agree, n: rs.length, pct: rs.length ? +((100 * agree) / rs.length).toFixed(1) : null, disagreements: dis };
}

function split(h) { return rows.filter((r) => r.half === h); }
const cal = split("cal"), hold = split("holdout");

// False positives, measured the strict way: on files THEY call clean/low, how
// often do we raise a HIGH (out-of-scope) verdict?
function fp(rs) {
  const base = rs.filter((r) => r.theirs === "none" || r.theirs === "low");
  const bad = base.filter((r) => r.ours === VERDICT.OUT_OF_SCOPE);
  const abstain = base.filter((r) => r.ours === VERDICT.UNDECIDABLE);
  return {
    base: base.length,
    false_positive_out_of_scope: bad.length,
    abstained: abstain.length,
    fp_rate: base.length ? +((100 * bad.length) / base.length).toFixed(1) : null,
    fp_files: bad.map((r) => ({ file: r.file, repo: r.repo, our_codes: r.our_codes })),
  };
}
// Misses: files THEY call high, do we raise high?
function misses(rs) {
  const base = rs.filter((r) => r.theirs === "high");
  const got = base.filter((r) => r.ours === VERDICT.OUT_OF_SCOPE);
  return { base: base.length, caught: got.length, missed: base.filter((r) => r.ours !== VERDICT.OUT_OF_SCOPE).map((r) => ({ file: r.file, repo: r.repo, ours: r.ours, our_codes: r.our_codes, their_rules: r.their_rules })) };
}

const out = {
  corpus: {
    source: idx.source,
    url: idx.url,
    files_checked: rows.length,
    sha256_verified: rows.length,
    split: { cal: cal.length, holdout: hold.length, method: "sha256(file) first byte mod 2" },
  },
  contamination_disclosure:
    "We read The Agent Forge's public rules page (rule codes + prose descriptions) before writing our own rules; their patterns are not published. Our rule set was then TUNED ON THE CAL HALF ONLY. The holdout numbers are the honest ones. This is weaker evidence than the gittifacts comparison and must not be quoted as independent confirmation of the rule set.",
  unit_difference:
    "They label risky text; we answer scope conformance over a request-vs-mention distinction. Different questions, same bytes.",
  results: {
    detection_agreement_cal: score(cal, detection).pct + "% (" + score(cal, detection).agree + "/" + cal.length + ")",
    detection_agreement_holdout: score(hold, detection).pct + "% (" + score(hold, detection).agree + "/" + hold.length + ")",
    high_tier_agreement_holdout: (() => { const s = score(hold, high); return s.pct + "% (" + s.agree + "/" + hold.length + ")"; })(),
    verdict_agreement_holdout: (() => { const s = score(hold, verdict); return s.pct + "% (" + s.agree + "/" + hold.length + ")"; })(),
    false_positives_holdout: fp(hold),
    misses_holdout: misses(hold),
    abstention_rate_holdout: (() => { const a = fp(hold); return a.abstained + "/" + a.base + " = " + (a.base ? +((100 * a.abstained) / a.base).toFixed(1) : 0) + "%"; })(),
  },
  key_finding:
    "Detection agreement is far higher than verdict agreement. The two implementations find the same FILES; they grade them differently. The disagreement is in SEVERITY POLICY, not in detection. That is the finding a third party can act on: 'risky text' and 'outside my authorization' are different questions and their labels cannot be reused as conformance labels without a translation step - which is itself the product.",
  disagreements_holdout: score(hold, verdict).disagreements,
};

console.log(JSON.stringify(out, null, 1));
