#!/usr/bin/env python3
"""Declaration-vs-bytes JOIN linter (cycle 40).

Cycle 39 proved the gap existed: catalogs load a declared risk and a scanner's
flags in the same snapshot and never compare them. Cycle 40 closes the join
ourselves, offline, with no model and no network, and runs it across three
declaration mechanisms:

  A. free-text card        (NVIDIA/skills style)      -- mechanism from cycle 37/38
  B. rubric-backed enum    (sickn33/agentic-awesome-skills) -- mechanism from cycle 39
  C. no declaration at all (anthropics/skills, openai/skills) -- NEW this cycle

Mechanism C is the important new one: the platforms' own official catalogs
ship no risk field whatsoever, so there is nothing to falsify. The join
therefore reports exposure-without-declaration rather than contradiction.

The scanner patterns (SEC001-SEC012) are copied verbatim from
sickn33/agentic-awesome-skills tools/scripts/security_scanner.py so that the
vendor's OWN instruments decide the contradiction. The rubric is the vendor's
own published rubric (docs/contributors/skill-anatomy.md, `risk` field):

    none       - pure text/reasoning, no commands or mutations
    safe       - reads files, runs non-destructive commands
    critical   - modifies state, deletes files, pushes to production
    offensive  - pentesting/red-red tools; MUST include "Authorized Use Only"
    unknown    - legacy or unclassified

Where a catalog publishes no rubric of its own (mechanism C), the yardstick is
ours and every finding in that bucket is labelled `yardstick: ours` -- the
cycle-39 self-correction: never guess the meaning of a label.
"""
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path

# --------------------------------------------------------------------------
# Vendor scanner patterns (verbatim from sickn33/agentic-awesome-skills
# tools/scripts/security_scanner.py, retrieved at commit dee7acce)
# --------------------------------------------------------------------------
@dataclass(frozen=True)
class SecurityPattern:
    code: str
    regex: str
    severity: str
    description: str


SECURITY_PATTERNS: list[SecurityPattern] = [
    SecurityPattern("SEC001", r"rm\s+-[rf]{1,2}\s+/(?!\S)", "error", "Destructive rm targeting root filesystem"),
    SecurityPattern("SEC002", r"curl\b[^\n]*\|\s*(?:sudo\s+)?(?:bash|sh|zsh)|(?:bash|sh|zsh)\s+<\s*\(\s*curl\b", "error", "Remote code execution: curl piped to shell"),
    SecurityPattern("SEC003", r"wget\b[^\n]*\|\s*(?:sh|bash|zsh)|(?:bash|sh|zsh)\s+<\s*\(\s*wget\b", "error", "Remote code execution: wget | sh"),
    SecurityPattern("SEC004", r"\bInvoke-Expression\b", "error", "PowerShell RCE: Invoke-Expression"),
    SecurityPattern("SEC005", r"\biex\b", "warning", "PowerShell alias: iex"),
    SecurityPattern("SEC006", r"chmod\s+[0-7]*[2367](?:\s|$)", "warning", "World-writable permission"),
    SecurityPattern("SEC007", r"(?<!\$)\beval\s*\(", "warning", "Dynamic eval() detected"),
    SecurityPattern("SEC008", r"base64\s+-d\b[^\n]*\|", "warning", "Possible obfuscation via base64 decode + pipe"),
    SecurityPattern("SEC009", r"(password|passwd|secret|api[_-]?key)\s*=\s*['\"][^'\"]{4,}['\"]", "error", "Hardcoded credential detected"),
    SecurityPattern("SEC010", r"sudo\s+rm\s+-[rf]{1,2}", "warning", "Privileged destructive deletion: sudo rm -rf"),
    SecurityPattern("SEC011", r":\s*\(\)\s*\{\s*:|fork\s+bomb", "error", "Fork bomb or infinite process spawner"),
    SecurityPattern("SEC012", r"dd\s+if=/dev/(?:zero|random|urandom)\s+of=/dev/[sh]d[a-z]", "error", "Disk overwrite via dd"),
]
TEXT_EXTENSIONS = {".cjs", ".js", ".json", ".md", ".mjs", ".py", ".sh", ".ts", ".txt", ".yaml", ".yml"}
SUPPORT_FILE_PATTERN_CODES = {"SEC002", "SEC003", "SEC004", "SEC005", "SEC008"}
CODE_EXTENSIONS = {".py", ".js", ".mjs", ".cjs", ".ts", ".sh"}

# Our own destructive-operation detector (cycle 39). NOT the vendor's. Labelled.
OUR_DESTRUCTIVE = {
    "shutil.rmtree": re.compile(r"shutil\.rmtree\("),
    "os.remove": re.compile(r"os\.remove\("),
    "os.unlink": re.compile(r"os\.unlink\(|\.unlink\("),
    "Path.write_text": re.compile(r"write_text\(|writeFileSync\(|open\([^)]*['\"][wa]"),
    "rm -rf": re.compile(r"rm\s+-[rf]{1,2}\s+[^\s|;&]"),
    "sudo": re.compile(r"\bsudo\b"),
    "curl|bash": re.compile(r"curl\b[^\n]*\|\s*(?:sudo\s+)?(?:bash|sh|zsh)"),
    "git push": re.compile(r"git\s+push\b"),
}
AUTH_GATE = re.compile(r"authorized use only", re.IGNORECASE)
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.DOTALL)
TOP_KEY_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_\-]*)\s*:\s*(.*)$")


def parse_frontmatter(text: str) -> dict:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    out: dict = {}
    for line in m.group(1).splitlines():
        if line[:1] in (" ", "\t", "-", "#"):
            continue
        km = TOP_KEY_RE.match(line)
        if not km:
            continue
        key, raw = km.group(1), km.group(2).strip()
        if raw.startswith("[") and raw.endswith("]"):
            out[key] = [v.strip().strip("'\"") for v in raw[1:-1].split(",") if v.strip()]
        else:
            out[key] = raw.strip().strip("'\"")
    return out


def scan_skill(skill_dir: Path) -> dict:
    """Port of the vendor's scan_skill_file, with the vendor's own semantics."""
    skill_file = skill_dir / "SKILL.md"
    if not skill_file.exists():
        return None
    content = skill_file.read_text(encoding="utf-8", errors="replace")
    meta = parse_frontmatter(content)
    declared = str(meta.get("risk") or "").strip().lower() or None
    flags = []
    code_files = []
    our_hits = {}
    for fp in sorted(skill_dir.rglob("*")):
        if not fp.is_file() or fp.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        body = fp.read_text(encoding="utf-8", errors="replace")
        if fp.name == "SKILL.md":
            body = FRONTMATTER_RE.sub("", body, count=1)
            pats = SECURITY_PATTERNS
        else:
            if fp.suffix.lower() in CODE_EXTENSIONS:
                code_files.append(str(fp.relative_to(skill_dir)))
            pats = [p for p in SECURITY_PATTERNS if p.code in SUPPORT_FILE_PATTERN_CODES]
        for p in pats:
            for hit in re.finditer(p.regex, body):
                flags.append({"code": p.code, "severity": p.severity, "file": str(fp.relative_to(skill_dir)),
                              "line": body[: hit.start()].count("\n") + 1, "description": p.description})
        if fp.suffix.lower() in CODE_EXTENSIONS:
            for name, rx in OUR_DESTRUCTIVE.items():
                if rx.search(body):
                    our_hits.setdefault(name, []).append(str(fp.relative_to(skill_dir)))
    return {
        "skill_id": skill_dir.name,
        "declared_risk": declared,
        "frontmatter_keys": sorted(meta.keys()),
        "vendor_flags": flags,
        "vendor_error_codes": sorted({f["code"] for f in flags if f["severity"] == "error"}),
        "our_destructive_hits": our_hits,
        "ships_code": bool(code_files),
        "code_files": code_files[:8],
        "has_auth_gate": bool(AUTH_GATE.search(content)),
    }


def judge(rec: dict, rubric_source: str) -> list[dict]:
    """THE JOIN. Compare the declared value to the observed bytes."""
    findings = []
    declared = rec["declared_risk"]
    vendor_err = rec["vendor_error_codes"]
    our = rec["our_destructive_hits"]
    if declared is None:
        if vendor_err or our:
            findings.append({
                "class": "J4_undeclared_exposure",
                "severity": "high",
                "rubric_source": rubric_source,
                "evidence": {"vendor_error_codes": vendor_err, "our_destructive": sorted(our)},
            })
        return findings
    if declared == "none" and (rec["ships_code"] or vendor_err or our):
        findings.append({
            "class": "J1_none_but_ships_code",
            "severity": "high",
            "rubric_source": rubric_source,
            "evidence": {"ships_code": rec["ships_code"], "vendor_error_codes": vendor_err,
                         "our_destructive": sorted(our)},
        })
    if declared == "safe":
        if vendor_err:
            findings.append({
                "class": "J2_safe_but_vendor_scanner_errors",
                "severity": "high",
                "rubric_source": rubric_source,
                "evidence": {"vendor_error_codes": vendor_err},
            })
        elif our:
            findings.append({
                "class": "J2b_safe_but_destructive_ops",
                "severity": "high",
                "rubric_source": rubric_source,
                "evidence": {"our_destructive": sorted(our)},
            })
    if declared == "offensive" and not rec["has_auth_gate"]:
        findings.append({
            "class": "J3_offensive_missing_auth_gate",
            "severity": "medium",
            "rubric_source": rubric_source,
            "evidence": {"required_text": "Authorized Use Only"},
        })
    return findings


def run_catalog(root: Path, mechanism: str, rubric_source: str, skills_subdir: str | None) -> dict:
    base = root / skills_subdir if skills_subdir else root
    skill_dirs = sorted({p.parent for p in base.rglob("SKILL.md")})
    recs = []
    for d in skill_dirs:
        r = scan_skill(d)
        if r:
            recs.append(r)
    declared_hist: dict[str, int] = {}
    for r in recs:
        k = r["declared_risk"] or "(no risk field)"
        declared_hist[k] = declared_hist.get(k, 0) + 1
    findings = []
    for r in recs:
        for f in judge(r, rubric_source):
            findings.append({"skill_id": r["skill_id"], **f})
    undeclared = [r for r in recs if r["declared_risk"] is None]
    exposed_undeclared = [r["skill_id"] for r in undeclared if r["vendor_error_codes"] or r["our_destructive_hits"]]
    return {
        "catalog": root.name,
        "mechanism": mechanism,
        "rubric_source": rubric_source,
        "skills": len(recs),
        "declared_risk_histogram": declared_hist,
        "skills_with_any_declaration": len(recs) - len(undeclared),
        "skills_undeclared": len(undeclared),
        "undeclared_with_exposure": len(exposed_undeclared),
        "undeclared_exposed_ids": exposed_undeclared[:25],
        "frontmatter_key_union": sorted({k for r in recs for k in r["frontmatter_keys"]}),
        "findings": findings,
        "finding_count": len(findings),
        "finding_classes": {c: sum(1 for f in findings if f["class"] == c) for c in sorted({f["class"] for f in findings})},
        "skills_shipping_code": sum(1 for r in recs if r["ships_code"]),
        "vendor_scanner_error_skills": sum(1 for r in recs if r["vendor_error_codes"]),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--catalog", action="append", required=True,
                    help="label=path[:skills_subdir]")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = {"tool": "decl_join_lint", "cycle": 40,
           "scanner_source": "sickn33/agentic-awesome-skills tools/scripts/security_scanner.py @ dee7acce",
           "catalogs": []}
    for spec in args.catalog:
        label, rest = spec.split("=", 1)
        path, sub = rest, None
        if ":" in rest:
            cand_path, cand_sub = rest.rsplit(":", 1)
            if cand_sub and not cand_sub.startswith("/") and Path(cand_path).exists():
                path, sub = cand_path, cand_sub
        root = Path(path)
        rubric = ("vendor: sickn33/agentic-awesome-skills docs/contributors/skill-anatomy.md"
                  if label == "enum" else
                  "vendor: NVIDIA/skills skill-card rubric" if label == "card" else
                  "ours: aas rubric applied comparatively (catalog publishes no rubric)")
        res = run_catalog(root, label, rubric, sub)
        res["label"] = label
        res["path"] = str(root)
        out["catalogs"].append(res)
    Path(args.out).write_text(json.dumps(out, indent=1), encoding="utf-8")
    for c in out["catalogs"]:
        print(c["label"], c["skills"], "skills", c["declared_risk_histogram"],
              "findings", c["finding_count"], c["finding_classes"])


if __name__ == "__main__":
    main()
