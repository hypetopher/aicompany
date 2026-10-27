// audit_signed_catalog: audit a SIGNED agent-skill catalog against the bytes
// actually published.
//
// Why this exists: a vendor publishing a trust pipeline (scan -> evaluate ->
// sign -> card) makes a COVERAGE CLAIM. That claim is testable, and nobody
// tests it: you have to run the vendor's own verifier over the vendor's own
// catalog with the vendor's own published trust anchor and count what fails.
//
// Three independent checks, all pure functions of bytes on disk:
//   1. INTEGRITY  - does each file's sha256 match the digest in the signed
//                   in-toto statement (the .oms.sig payload)?
//   2. COMPLETENESS - does the signed manifest cover every published file?
//                    (unsigned extra files = bytes outside the claim)
//   3. TRUST      - does the signing chain terminate at the PUBLISHED trust
//                   anchor, or at some other self-signed root?
//
// Plus, optionally, our own declaration-scope verdicts per skill, so the
// report can say what the SIGNED card claims vs what the signed bytes do.
//
// No network. No model. No vendor code. Everything is re-derivable from the
// catalog + its .sig files + the published root cert.

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

// ---------------------------------------------------------------------------
// in-toto / OMS signature parsing
// ---------------------------------------------------------------------------

export function parseOmsSignature(path) {
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const env = raw.dsseEnvelope ?? raw;
  const payload = JSON.parse(Buffer.from(env.payload, "base64").toString("utf8"));
  const resources = payload.predicate?.resources ?? [];
  const chain =
    raw.verificationMaterial?.x509CertificateChain?.certificates ?? [];

  const certs = chain.map((c) => {
    const der = Buffer.from(c.rawBytes, "base64");
    const tmp = join(tmpdir(), `oms-cert-${createHash("sha1").update(der).digest("hex")}.der`);
    writeFileSync(tmp, der);
    const subject = execFileSync(
      "openssl",
      ["x509", "-inform", "DER", "-in", tmp, "-noout", "-subject"],
      { encoding: "utf8" }
    ).trim();
    const fingerprint = createHash("sha256").update(der).digest("hex").toUpperCase();
    return { der, subject, fingerprint };
  });

  return {
    subjectName: payload.subject?.[0]?.name ?? null,
    subjectDigest:
      typeof payload.subject?.[0]?.digest === "string"
        ? payload.subject[0].digest
        : (payload.subject?.[0]?.digest?.sha256 ?? null),
    resources: resources.map((r) => ({
      name: r.name,
      algorithm: r.algorithm ?? r.digest?.algorithm ?? "sha256",
      digest: typeof r.digest === "string" ? r.digest : (r.digest?.sha256 ?? null),
    })),
    rootCert: certs[certs.length - 1] ?? null,
    leafCert: certs[0] ?? null,
    certs,
  };
}

// ---------------------------------------------------------------------------
// the three checks
// ---------------------------------------------------------------------------

export function auditSkill(dir, opts = {}) {
  const sigPath = join(dir, "skill.oms.sig");
  if (!existsSync(sigPath)) return { skill: dir, signed: false };

  const sig = parseOmsSignature(sigPath);
  const signedMap = new Map(sig.resources.map((r) => [r.name, r.digest]));

  // published bytes
  const published = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      if (e === ".git") continue;
      const p = join(d, e);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else published.push(relative(dir, p));
    }
  };
  walk(dir);

  const digestMismatches = [];
  const signedMissingOnDisk = [];
  for (const [name, digest] of signedMap) {
    const p = join(dir, name);
    if (!existsSync(p)) {
      signedMissingOnDisk.push(name);
      continue;
    }
    const actual = sha256(readFileSync(p));
    if (actual !== digest) digestMismatches.push({ file: name, expected: digest, actual });
  }

  const unsignedExtra = published.filter(
    (f) => f !== "skill.oms.sig" && !signedMap.has(f)
  );

  // trust: does the chain root match the published anchor?
  let trust = "unknown";
  let trustDetail = null;
  if (opts.anchorFingerprint) {
    trust = sig.rootCert?.fingerprint === opts.anchorFingerprint ? "published-anchor" : "other-root";
    trustDetail = {
      chainRootSubject: sig.rootCert?.subject ?? null,
      chainRootFingerprint: sig.rootCert?.fingerprint ?? null,
      publishedAnchorFingerprint: opts.anchorFingerprint,
    };
  }

  const failClasses = [];
  if (digestMismatches.length) failClasses.push("digest-mismatch");
  if (unsignedExtra.length) failClasses.push("unsigned-extra-files");
  if (signedMissingOnDisk.length) failClasses.push("signed-file-missing");
  if (trust === "other-root") failClasses.push("unpublished-trust-root");

  return {
    skill: dir,
    signed: true,
    subjectName: sig.subjectName,
    subjectDigest: sig.subjectDigest,
    signedFileCount: signedMap.size,
    publishedFileCount: published.length,
    digestMismatches,
    unsignedExtra,
    signedMissingOnDisk,
    trust,
    trustDetail,
    failClasses,
    verdict: failClasses.length ? "FAIL" : "PASS",
  };
}

// ---------------------------------------------------------------------------
// catalog-level rollup
// ---------------------------------------------------------------------------

export function auditCatalog(root, opts = {}) {
  const skills = readdirSync(root)
    .filter((d) => statSync(join(root, d)).isDirectory())
    .sort();

  const rows = [];
  for (const s of skills) {
    try {
      rows.push(auditSkill(join(root, s), opts));
    } catch (e) {
      rows.push({ skill: s, signed: false, error: String(e.message ?? e), verdict: "ERROR" });
    }
  }

  const signed = rows.filter((r) => r.signed);
  const byClass = {};
  for (const r of signed) {
    for (const c of r.failClasses) byClass[c] = (byClass[c] ?? 0) + 1;
  }

  return {
    root,
    measuredAt: opts.measuredAt ?? null,
    anchorFingerprint: opts.anchorFingerprint ?? null,
    skillsTotal: rows.length,
    skillsSigned: signed.length,
    skillsPassing: signed.filter((r) => r.verdict === "PASS").length,
    skillsFailing: signed.filter((r) => r.verdict === "FAIL").length,
    coverage: signed.length
      ? +(100 * signed.filter((r) => r.verdict === "PASS").length / signed.length).toFixed(1)
      : null,
    failClassCounts: byClass,
    failures: signed
      .filter((r) => r.verdict === "FAIL")
      .map((r) => ({
        skill: r.skill,
        failClasses: r.failClasses,
        digestMismatches: r.digestMismatches.map((m) => m.file),
        unsignedExtra: r.unsignedExtra,
        trust: r.trust,
      })),
    rows,
  };
}
