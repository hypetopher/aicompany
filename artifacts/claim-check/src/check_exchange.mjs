// Counterparty-side claim check over an ACTION CALL (not a repo diff).
// Deterministic. Pure function of the bytes the counterparty already holds:
//   request (what was asked), scope (allowed/denied/limits), action log, residue.
// No network, no model, no vendor, no key.
import { VERDICT } from "./check.mjs";

function num(x) {
  if (x === undefined || x === null) return undefined;
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : undefined;
}

function citedReason(code, cites) { return { code, cites }; }

/**
 * verdictFor(action, scope, ctx) -> { verdict, reasons[] }
 * ctx: { residue } optional, used for the RESIDUE-VS-CLAIM contradiction check.
 */
export function verdictFor(action, scope, ctx = {}) {
  const reasons = [];
  const allowed = scope.allowed ?? [];
  const denied = scope.denied ?? [];
  const limits = scope.limits ?? {};
  const tool = action.tool;

  if (typeof tool !== "string" || tool.length === 0) {
    return { verdict: VERDICT.UNDECIDABLE, reasons: [citedReason("bytes.absent", ["action.tool"])] };
  }
  if (!Array.isArray(allowed) || allowed.length === 0) {
    return { verdict: VERDICT.UNDECIDABLE, reasons: [citedReason("scope.unreadable", ["scope.allowed"])] };
  }

  // 1. Denied tool -> out of scope.
  if (denied.includes(tool)) {
    reasons.push(citedReason("scope.denied", [`scope.denied[] contains "${tool}"`, `action.tool="${tool}"`]));
  }
  // 2. Tool not in the allow-list -> out of scope.
  else if (!allowed.includes(tool)) {
    reasons.push(citedReason("scope.not-allowed", [`scope.allowed[]=${JSON.stringify(allowed)}`, `action.tool="${tool}"`]));
  }

  // 3. Amount limits, only for tools whose args carry an amount.
  const args = action.args ?? {};
  const amount = num(args.amount_eur ?? args.amount);
  if (amount !== undefined) {
    const max = num(limits.max_amount_eur ?? limits.max_amount);
    if (max !== undefined && amount > max) {
      reasons.push(citedReason("limit.amount-exceeded", [`scope.limits.max_amount_eur=${max}`, `action.args.amount_eur=${amount}`]));
    }
  }
  // 4. Duration limits.
  const minutes = num(args.minutes ?? args.duration_min);
  if (minutes !== undefined) {
    const maxMin = num(limits.max_duration_min);
    if (maxMin !== undefined && minutes > maxMin) {
      reasons.push(citedReason("limit.duration-exceeded", [`scope.limits.max_duration_min=${maxMin}`, `action.args.minutes=${minutes}`]));
    }
  }
  // 5. Residue-vs-claim contradiction: the residue records an effect that the action log does not.
  //    residue.facts[] = [{ tool, fact }] - each fact attributes an effect to a tool.
  const facts = (ctx.residue && Array.isArray(ctx.residue.facts)) ? ctx.residue.facts : [];
  const logged = new Set(ctx.actionTools ?? []);
  for (const f of facts) {
    if (!f || typeof f.tool !== "string") continue;
    if (!logged.has(f.tool)) {
      reasons.push(citedReason("residue.contradicts-claim", [`residue.facts[] tool="${f.tool}"`, `no action.tool="${f.tool}" in action log`]));
      continue;
    }
    // effect happened through a tool that the scope does not permit
    const denied2 = scope.denied ?? [];
    const allowed2 = scope.allowed ?? [];
    if (denied2.includes(f.tool)) {
      reasons.push(citedReason("scope.denied", [`scope.denied[] contains "${f.tool}"`, `residue.facts[] tool="${f.tool}"`]));
    } else if (!allowed2.includes(f.tool)) {
      reasons.push(citedReason("scope.not-allowed", [`scope.allowed[]=${JSON.stringify(allowed2)}`, `residue.facts[] tool="${f.tool}"`]));
    }
  }

  if (reasons.length === 0) return { verdict: VERDICT.IN_SCOPE, reasons: [] };
  return { verdict: VERDICT.OUT_OF_SCOPE, reasons };
}

/** Check every action call in an exchange; return the exchange-level verdict (worst wins). */
export function checkExchange(ex) {
  const calls = ex.actions ?? [];
  const tools = calls.map((c) => c.tool).filter(Boolean);
  const perCall = calls.map((c, i) => {
    const r = verdictFor(c, ex.scope, { residue: ex.residue, actionTools: tools });
    return { index: i, tool: c.tool, ...r };
  });
  const undecidable = perCall.filter((c) => c.verdict === VERDICT.UNDECIDABLE);
  const out = perCall.filter((c) => c.verdict === VERDICT.OUT_OF_SCOPE);
  const verdict = out.length > 0 ? VERDICT.OUT_OF_SCOPE : undecidable.length > 0 ? VERDICT.UNDECIDABLE : VERDICT.IN_SCOPE;
  return { id: ex.id, class: ex.class, verdict, perCall, reasons: out.concat(undecidable).flatMap((c) => c.reasons) };
}
