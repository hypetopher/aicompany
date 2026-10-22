#!/usr/bin/env node
// Foreign-harness re-derivation: run the probe against REAL harness session
// logs, and against flattened renderings of the same logs, and check that the
// verdict changes with the serialization (not with the content).
//
// usage: node foreign-harness.mjs <session.jsonl> [more.jsonl ...]
//
// A harness session log (OpenClaw format) is JSONL of records; message
// records carry message.role. We extract role-typed turns, then produce two
// serializations of the SAME content:
//   1. role-typed JSONL  -> expect ACCEPT (role structure intact)
//   2. flattened plain text -> expect a refusal (structure destroyed)
// If the probe gives the same answer for both, it is not measuring structure
// and the corpus result is meaningless.

import { readFileSync } from 'node:fs';
import { classify } from './probe.mjs';

function turnsFromSessionLog(text) {
  const turns = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch {
      continue;
    }
    if (rec.type !== 'message' || !rec.message) continue;
    const m = rec.message;
    let role = String(m.role || '').toLowerCase();
    if (role === 'toolresult') role = 'tool';
    let content = '';
    if (typeof m.content === 'string') content = m.content;
    else if (Array.isArray(m.content))
      content = m.content.map((c) => (typeof c === 'string' ? c : c?.text ?? '')).join('\n');
    turns.push({ role, content });
  }
  return turns;
}

function roleTypedJsonl(turns) {
  return turns.map((t) => JSON.stringify({ role: t.role, content: t.content })).join('\n') + '\n';
}

function flattened(turns) {
  // A flattening serializer: role labels dropped, everything becomes text.
  return turns.map((t) => t.content).join('\n') + '\n';
}

function flattenedWithLabels(turns) {
  // A flattening serializer that keeps role names as free text prefixes.
  return turns.map((t) => `${t.role}: ${t.content}`).join('\n') + '\n';
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node foreign-harness.mjs <session.jsonl> [...]');
  process.exit(2);
}

const out = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const turns = turnsFromSessionLog(text);
  if (!turns.length) {
    out.push({ file: f, error: 'no message turns found' });
    continue;
  }
  const a = classify(roleTypedJsonl(turns));
  const b = classify(flattened(turns));
  const c = classify(flattenedWithLabels(turns));
  out.push({
    file: f,
    turns: turns.length,
    role_typed: { verdict: a.verdict, provenance_class: a.provenance_class, reason_codes: a.reason_codes },
    flattened_no_labels: { verdict: b.verdict, provenance_class: b.provenance_class, reason_codes: b.reason_codes },
    flattened_text_labels: { verdict: c.verdict, provenance_class: c.provenance_class, reason_codes: c.reason_codes },
    structure_sensitive:
      a.verdict === 'ACCEPT' && b.verdict !== 'ACCEPT' && c.verdict !== 'ACCEPT',
    pass: a.verdict === 'ACCEPT' && b.verdict !== 'ACCEPT' && c.verdict !== 'ACCEPT',
  });
}

const pass = out.every((o) => o.pass === true);
console.log(JSON.stringify({ pass, harnesses: out }, null, 2));
process.exit(pass ? 0 : 1);
