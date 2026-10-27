// SARIF 2.1.0 emitter for the declaration conformance check.
//
// WHY THIS SHAPE (and not a proprietary JSON):
//   The Agent Skills standard has no normative report shape. In
//   agentskills/agentskills#418 the two people who actually scan the
//   ecosystem converged on one: SARIF 2.1.0, with the taxonomy referenced
//   BY URI per result (never a closed enum), the scanner identified by
//   `tool.driver.informationUri`, and the content digest the verdict was
//   computed against carried in the report so it can be checked against the
//   installed bytes. That is exactly what this file emits, so our output is
//   consumable by SARIF tooling without anyone changing anything.
//
// DESIGN RULES (each is a product decision, not a formatting preference):
//   1. The report is a POINT-IN-TIME CLAIM ABOUT BYTES. It carries
//      `target.digest`. A consumer that finds a different digest for the
//      installed content must reject the report. A report that travels with
//      a skill NAME goes stale silently the moment the skill drifts.
//   2. We do not adopt a closed vector enum. `rule.helpUri` points at OUR
//      taxonomy URI; each result says which of our rules fired. Consumers
//      decide whose taxonomy they trust.
//   3. The VERDICT (IN-SCOPE / OUT-OF-SCOPE / UNDECIDABLE) is the product.
//      SARIF `level` grades a finding; it does not encode the verdict. So the
//      verdict rides in `properties.verdict` and UNDECIDABLE is a first-class
//      answer, not an error.
//   4. Every result cites the bytes that justify it. A result without a
//      citation is not shipped.
//   5. Determinism: same bytes in, byte-identical SARIF out. Ordering is
//      fixed, digests are content digests, nothing carries a timestamp
//      except `invocations.executionSuccessful`-adjacent metadata we do not
//      emit. There is no `generatedAt` field, because a timestamp would make
//      two runs differ for no analytic reason.

import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { verdictForDeclaration, DECLARATION_REASON_CODES } from './check_declaration.mjs';

export const TAXONOMY_URI = 'https://aicompany.example/claim-check/taxonomy/v1';
export const TOOL_URI = 'https://aicompany.example/claim-check';
export const SARIF_VERSION = '2.1.0';
export const SARIF_SCHEMA = 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json';

export function contentDigest(text) {
  return 'sha256:' + createHash('sha256').update(text, 'utf8').digest('hex');
}

const SEVERITY_TO_LEVEL = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'note',
  mention: 'note',
};

// Rule metadata is derived from the checker itself so the two cannot drift.
// `helpUri` is per-rule and points into our own taxonomy; the URI is
// reference-only, which is the whole point of URI-by-reference.

/**
 * Build a SARIF 2.1.0 log for one declaration file.
 *
 * @param {object} opts
 * @param {string} opts.text       file contents
 * @param {string} opts.uri        artifact URI (file path or https URL)
 * @param {string} [opts.digest]   precomputed content digest; else computed
 * @returns {object} SARIF log
 */
export function sarifForDeclaration({ text, uri, digest }) {
  const dg = digest || contentDigest(text);
  const { verdict, findings, reasons } = verdictForDeclaration(text);

  const byCode = new Map();
  for (const f of findings) {
    if (!byCode.has(f.code)) byCode.set(f.code, []);
    byCode.get(f.code).push(f);
  }
  const reasonByCode = new Map();
  for (const r of reasons) {
    if (!reasonByCode.has(r.code)) reasonByCode.set(r.code, []);
    reasonByCode.get(r.code).push(r);
  }

  const rules = [];
  for (const [code, fs] of [...byCode.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    rules.push({
      id: code,
      name: code.replace(/[^A-Za-z0-9]+/g, '-'),
      shortDescription: { text: fs[0].why || code },
      fullDescription: {
        text:
          (fs[0].why || code) +
          '. A finding is a byte-level claim; the verdict for a file is the aggregate ' +
          '(OUT-OF-SCOPE if any request fires, UNDECIDABLE if only ambiguous directives fire, ' +
          'IN-SCOPE otherwise).',
      },
      helpUri: `${TAXONOMY_URI}#${code.replace(/[^A-Za-z0-9]+/g, '-')}`,
      properties: { tags: ['agent-skills', 'declaration', 'conformance'] },
    });
  }

  const results = [];
  for (const f of findings) {
    const rs = (reasonByCode.get(f.code) || []).find((r) => r.cites[0].includes(`line ${f.line}`));
    results.push({
      ruleId: f.code,
      level: SEVERITY_TO_LEVEL[f.severity] || 'note',
      message: {
        text:
          (rs?.cites?.find((c) => c.startsWith('why='))?.slice(4) || f.code) +
          ` (tier=${f.tier}, position=${f.position})`,
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri },
            region: { startLine: f.line, snippet: { text: f.excerpt } },
          },
        },
      ],
      // Every result cites the bytes that justify it. No citation, no result.
      properties: {
        verdict,
        severity: f.severity,
        tier: f.tier,
        position: f.position,
        request: !!f.request,
        ambiguous: !!f.ambiguous,
        counterContext: !!f.counter_context,
        citedLine: f.line,
        excerpt: f.excerpt,
      },
    });
  }

  return {
    $schema: SARIF_SCHEMA,
    version: SARIF_VERSION,
    runs: [
      {
        tool: {
          driver: {
            name: 'claim-check',
            informationUri: TOOL_URI,
            organization: 'aicompany',
            rules,
          },
        },
        // The digest the verdict was computed against. A consumer MUST
        // reject a report whose target digest differs from the content it
        // has in front of it; otherwise the report is stale, not wrong.
        targets: [
          {
            location: { uri },
            digest: { algorithm: 'sha256', value: dg.replace(/^sha256:/, '') },
          },
        ],
        results,
        properties: {
          verdict,
          taxonomy: TAXONOMY_URI,
          scanner: TOOL_URI,
          // The report says which of our rules it ran, by URI, without
          // claiming the consumer must trust them.
          taxonomyReference: `${TAXONOMY_URI}/rules.json`,
        },
      },
    ],
  };
}

/** Convenience: read a file from disk and emit its SARIF. */
export function sarifForFile(path, uri) {
  const text = readFileSync(path, 'utf8');
  return sarifForDeclaration({ text, uri: uri || path, digest: contentDigest(text) });
}
