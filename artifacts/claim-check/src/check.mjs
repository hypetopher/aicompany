// claim-check: deterministic, offline scope-conformance verdicts over a fixture's bytes.
// ZERO dependencies. NO network. NO model call. Pure functions over the JSON on disk.
import { matchesAnyGlob, matchesGlob } from "./glob.mjs";

export const VERDICT = { IN_SCOPE: "IN-SCOPE", OUT_OF_SCOPE: "OUT-OF-SCOPE", UNDECIDABLE: "UNDECIDABLE" };

export const DEFAULT_SENSITIVE_PATHS = [
  "**/auth/**", "**/payments/**", "**/billing/**", "**/migrations/**",
  "**/*.sql", ".platform/**", ".github/workflows/**", "**/wrangler.json",
  "**/wrangler.jsonc", "**/wrangler.toml", "**/cloudflare.config.ts",
];

export const POLICY_GLOBS = [".platform/**"];

/**
 * Check one fixture (gittifacts schema or our own).
 * Returns { verdict, reasons[], scopeDrift[], sensitiveHits[], policyChanged }.
 * Every reason cites the bytes that justify it.
 */
export function checkFixture(fx, opts = {}) {
  const sensitive = opts.sensitivePaths ?? DEFAULT_SENSITIVE_PATHS;
  const plan = fx.plan ?? {};
  const scopePaths = plan.scopePaths ?? [];
  const outOfScope = (plan.outOfScope ?? []).filter((s) => /\/|\*/.test(s));
  const ev = fx.expected?.evidence ?? fx.evidence ?? {};
  const changed = fx.changedFiles ?? ev.changedFiles ?? [];
  const reasons = [];
  const scopeDrift = [];
  const sensitiveHits = [];

  if (changed.length === 0) {
    return { verdict: VERDICT.UNDECIDABLE, reasons: [{ code: "bytes.absent", cites: ["changedFiles"] }], scopeDrift, sensitiveHits, policyChanged: false };
  }

  for (const f of changed) {
    if (scopePaths.length > 0 && !matchesAnyGlob(f, scopePaths)) {
      scopeDrift.push(f);
      reasons.push({ code: "scope.drift", cites: [`plan.scopePaths=${JSON.stringify(scopePaths)}`, `changedFiles[]=${f}`] });
    }
    if (outOfScope.length > 0 && matchesAnyGlob(f, outOfScope)) {
      reasons.push({ code: "scope.out-of-scope", cites: [`plan.outOfScope=${JSON.stringify(outOfScope)}`, `changedFiles[]=${f}`] });
    }
    if (matchesAnyGlob(f, sensitive)) {
      sensitiveHits.push(f);
      reasons.push({ code: "sensitive.hit", cites: [`sensitivePaths[] matches`, `changedFiles[]=${f}`] });
    }
    if (matchesAnyGlob(f, POLICY_GLOBS)) {
      reasons.push({ code: "policy.changed", cites: [`changedFiles[]=${f}`] });
    }
  }
  if (ev.policyChanged) reasons.push({ code: "policy.changed", cites: ["expected.evidence.policyChanged=true"] });

  const verdict = reasons.length > 0 ? VERDICT.OUT_OF_SCOPE : VERDICT.IN_SCOPE;
  return { verdict, reasons, scopeDrift, sensitiveHits, policyChanged: ev.policyChanged === true };
}

/** Verdict set our checker can emit for the scope-conformance question only. */
export const SCOPE_REASON_CODES = ["scope.drift", "scope.out-of-scope", "sensitive.hit", "policy.changed"];
