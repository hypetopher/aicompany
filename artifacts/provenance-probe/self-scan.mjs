#!/usr/bin/env node
// Self-scan: run the provenance probe against OUR OWN fleet transcripts and
// publish our own laundering rate.
//
// Our fleet carries agent/role identity in FREE TEXT (step kinds parsed out of
// titles like "Observer arbitration cycle", idempotency keys like
// "proposal:25825:kind:market signal review and strategy implications").
// That is the same defect class as a flattening harness: role identity lives
// in a string and is re-parsed downstream.
//
// This script reads the live step table, classifies each step's
// (kind, title-derived) identity as role-typed vs flattened, and prints the
// rate. No model, no network beyond the Supabase query already in use.
//
// usage: node self-scan.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { classify } from './probe.mjs';

const base = new URL('../../', import.meta.url).pathname;
const env = {};
for (const l of readFileSync(base + '.env', 'utf-8').split('\n')) {
  const [k, ...v] = l.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
}
const s = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const TYPED_KINDS = new Set(['analyze', 'draft_tweet', 'write_content', 'crawl', 'post_tweet']);

const { data: steps, error } = await s
  .from('ops_mission_steps')
  .select('id,kind,idempotency_key,payload,status,created_at')
  .order('id', { ascending: false })
  .limit(5000);
if (error) throw error;

const rows = (steps || []).map((st) => {
  // Our "transcript" for a step: the identity string that downstream code
  // re-parses to decide who/what the step is.
  const identity = String(st.kind ?? '');
  const typed = TYPED_KINDS.has(identity);
  // Feed the identity through the probe as a one-turn transcript: a typed
  // kind is role-typed; a free-text kind is structure that was carried as
  // text and re-parsed (flattened / unrecognised).
  const receipt = classify(JSON.stringify({ role: typed ? 'system' : 'tool', content: identity }) + '\n');
  return {
    id: st.id,
    kind: identity,
    typed_kind: typed,
    verdict: receipt.verdict,
    provenance_class: receipt.provenance_class,
    status: st.status,
  };
});

const n = rows.length;
const typed = rows.filter((r) => r.typed_kind).length;
const freeText = n - typed;
const refused = rows.filter((r) => r.verdict !== 'ACCEPT').length;

const out = {
  scanned: n,
  typed_step_kinds: typed,
  free_text_step_kinds: freeText,
  free_text_share: n ? +(freeText / n).toFixed(4) : null,
  probe_refusals_on_free_text_identity: refused,
  verdict:
    freeText === 0
      ? 'clean: every step kind is typed'
      : `laundering present: ${freeText}/${n} (${((freeText / n) * 100).toFixed(1)}%) of step identities are free text re-parsed downstream`,
  examples: rows.filter((r) => !r.typed_kind).slice(0, 10),
};
console.log(JSON.stringify(out, null, 2));
