// run_verifier_coverage: produce the verifier-coverage report v1.0 for a published
// signed agent-skill catalog.
//
// Reads:  a checkout of the catalog (bytes on disk only)
// Writes: one JSON result + one Markdown report, both pinned to the catalog commit
// Network: none. Model: none. Vendor code: none. Keys: none.
//
// Every number in the report comes from a field of this run's output.

import { writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { auditCatalog } from "./audit_signed_catalog.mjs";

const root = process.argv[2];
const outDir = process.argv[3] ?? "artifacts/claim-check/reports";
if (!root) {
  console.error("usage: run_verifier_coverage.mjs <catalog-root> [outDir]");
  process.exit(2);
}

const commit = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const commitDate = execFileSync("git", ["-C", root, "log", "-1", "--format=%cI"], { encoding: "utf8" }).trim();

const anchorPath = `${root}/nv-agent-root-cert.pem`;
let anchorFingerprint = null;
try {
  const { execFileSync: ex } = await import("node:child_process");
  const der = ex("openssl", ["x509", "-in", anchorPath, "-outform", "DER"], { encoding: "buffer" });
  anchorFingerprint = createHash("sha256").update(der).digest("hex").toUpperCase();
} catch (e) {
  console.error("anchor fingerprint failed:", e.message);
}

const measuredAt = new Date().toISOString();
const result = auditCatalog(`${root}/skills`, { measuredAt, anchorFingerprint });

const stamp = commit.slice(0, 12);
const base = `${outDir}/verifier-coverage-nvidia-skills-${stamp}`;
writeFileSync(`${base}.json`, JSON.stringify(result, null, 1));

const lines = [];
lines.push(`# Verifier-coverage report — NVIDIA/skills @ \`${commit}\``);
lines.push("");
lines.push(`- Catalog commit: \`${commit}\` (${commitDate})`);
lines.push(`- Measured: ${measuredAt}`);
lines.push(`- Published trust anchor fingerprint (sha256 of DER): \`${anchorFingerprint ?? "n/a"}\``);
lines.push(`- Corpus: \`skills/\` — ${result.skillsTotal} skill directories, ${result.skillsSigned} signed`);
lines.push("");
lines.push("## Coverage");
lines.push("");
lines.push("| Metric | Value |");
lines.push("| --- | --- |");
lines.push(`| Skills published | ${result.skillsTotal} |`);
lines.push(`| Skills with a signed manifest | ${result.skillsSigned} |`);
lines.push(`| Pass an independent digest-level audit | **${result.skillsPassing} / ${result.skillsSigned} = ${result.coverage}%** |`);
lines.push(`| Fail | ${result.skillsFailing} |`);
lines.push("");
lines.push("## Failure classes");
lines.push("");
for (const [k, v] of Object.entries(result.failClassCounts)) lines.push(`- ${k}: ${v}`);
lines.push("");
lines.push("## Named failures");
lines.push("");
for (const f of result.failures) {
  lines.push(`### ${f.skill}`);
  lines.push(`- classes: ${f.failClasses.join(", ")}`);
  if (f.digestMismatches.length) lines.push(`- digest mismatch: ${f.digestMismatches.join(", ")}`);
  if (f.unsignedExtra.length) lines.push(`- unsigned extra files: ${f.unsignedExtra.join(", ")}`);
  lines.push(`- trust: ${f.trust}`);
  lines.push("");
}
writeFileSync(`${base}.md`, lines.join("\n"));

console.log(
  JSON.stringify(
    {
      commit,
      commitDate,
      measuredAt,
      anchorFingerprint,
      skillsTotal: result.skillsTotal,
      skillsSigned: result.skillsSigned,
      skillsPassing: result.skillsPassing,
      skillsFailing: result.skillsFailing,
      coverage: result.coverage,
      failClassCounts: result.failClassCounts,
      failures: result.failures,
      reportMd: `${base}.md`,
      reportJson: `${base}.json`,
    },
    null,
    2
  )
);
