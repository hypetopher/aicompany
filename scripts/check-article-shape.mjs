#!/usr/bin/env node
/**
 * Shape checker for desk articles (canon R-002, R-003, R-004, R-006, R-007).
 * Usage: node scripts/check-article-shape.mjs <file.md> [canon.md]
 * Exit 1 on any violation, with the reasons listed.
 */
import fs from 'node:fs';
import path from 'node:path';

const SLOT_ORDER = [
  'the short version',
  'the claim',
  'what we measured',
  'how we measured',
  'what we are not claiming',
  'what changed since last time',
  'the rules we are adopting',
];

const file = process.argv[2];
const canonPath = process.argv[3] ?? 'docs/editorial-canon.md';
if (!file) {
  console.error('usage: check-article-shape.mjs <file.md> [canon.md]');
  process.exit(2);
}

const text = fs.readFileSync(file, 'utf8');
const canon = fs.existsSync(canonPath) ? fs.readFileSync(canonPath, 'utf8') : '';
const errors = [];

/* R-004 — headline grammar */
const headline = (text.split('\n').find((l) => l.startsWith('# ')) ?? '').trim();
if (!headline) {
  errors.push('R-004: no H1 headline');
} else {
  const h = headline.slice(2);
  const m = h.match(/^(.+?) — (.+)$/);
  if (!m) {
    errors.push(`R-004: headline is not "ALL-CAPS CLAIM — lowercase gloss": ${h}`);
  } else {
    const [, claim, gloss] = m;
    if (!/^[A-Z0-9 ,'":;!?()\-—]+$/.test(claim)) errors.push(`R-004: claim is not all-caps: ${claim}`);
    if (gloss !== gloss.toLowerCase()) errors.push(`R-004: gloss is not lowercase: ${gloss}`);
    if (gloss.length > 90) errors.push(`R-004: gloss is ${gloss.length} chars (max 90)`);
    if (gloss.includes(':')) errors.push('R-004: gloss contains a colon');
  }
}

/* R-002 — the seven slots, in order (extra slots allowed) */
const headings = [...text.matchAll(/^## (.+)$/gm)].map((x) => x[1].trim().toLowerCase());
const positions = SLOT_ORDER.map((slot) => headings.findIndex((h) => h === slot));
positions.forEach((p, i) => {
  if (p === -1) errors.push(`R-002: missing slot "${SLOT_ORDER[i]}"`);
});
for (let i = 1; i < positions.length; i++) {
  if (positions[i] !== -1 && positions[i - 1] !== -1 && positions[i] < positions[i - 1]) {
    errors.push(`R-002: slot "${SLOT_ORDER[i]}" appears before "${SLOT_ORDER[i - 1]}"`);
  }
}

/* R-003 — the rules slot is last */
const rulesIdx = headings.indexOf('the rules we are adopting');
if (rulesIdx !== -1 && rulesIdx !== headings.length - 1) {
  errors.push(`R-003: "the rules we are adopting" is not the last section (${headings.length - 1 - rulesIdx} section(s) follow)`);
}

/* R-006 — series footer: canon version, applied rule IDs, predecessor + successor links */
const flat = text.replace(/\*\*/g, '');
if (!/Canon:\s*v\d+/i.test(flat)) errors.push('R-006: no "Canon: vN" footer line');
if (!/rules applied:/i.test(flat)) errors.push('R-006: no "rules applied:" list');
if (!/\]\([^)]*quill-narrative-[^)]*\)/.test(text)) errors.push('R-006: no link to a sibling article');
if (!/Series:/i.test(text)) errors.push('R-006: no "Series:" link line');

/* R-007 — every cited rule ID exists in the canon */
const cited = [...text.matchAll(/\bR-\d{3}\b/g)].map((x) => x[0]);
const uniqueCited = [...new Set(cited)];
for (const id of uniqueCited) {
  if (!new RegExp(`\\|\\s*${id}\\s*\\|`).test(canon)) errors.push(`R-007: cited rule ${id} does not exist in ${canonPath}`);
}

if (errors.length) {
  console.error(`FAIL ${path.basename(file)}`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`OK ${path.basename(file)} — ${uniqueCited.length} rule id(s) cited, ${headings.length} sections`);
