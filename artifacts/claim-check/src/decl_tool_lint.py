#!/usr/bin/env python3
"""allowed-tools truth linter (cycle 40, mechanism D).

The Agent Skills spec's own capability declaration is the `allowed-tools`
frontmatter field: a per-skill claim about which tools the skill may use
("Read, Grep, Glob, Write"). It is the closest thing the ecosystem has to a
risk declaration, it is machine-readable, and it is falsifiable against the
skill's own bytes.

This linter tests that claim:
  J5  declares no Bash  but the skill ships shell execution
  J6  declares no Write but the skill writes files
  J7  declares no network tool but the skill makes network calls
  J8  declares no Bash  but the skill ships destructive shell operations

Detection heuristics are OURS (the spec defines no byte patterns), so every
finding is reported with its evidence, never as a verdict.  The declared tool
set is the spec's own field, taken verbatim.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.DOTALL)
TEXT_EXTENSIONS = {".cjs", ".js", ".json", ".md", ".mjs", ".py", ".sh", ".ts", ".txt", ".yaml", ".yml"}
CODE_EXTENSIONS = {".py", ".js", ".mjs", ".cjs", ".ts", ".sh"}

BASH_EVIDENCE = {
    "shebang": re.compile(r"^#!.*\b(ba|z|k)?sh\b", re.M),
    "subprocess": re.compile(r"\bsubprocess\.(run|Popen|call|check_output)\("),
    "os.system": re.compile(r"\bos\.system\(|os\.popen\("),
    "child_process": re.compile(r"\bchild_process\.(exec|spawn|fork)\b"),
    "shell=True": re.compile(r"shell\s*=\s*True"),
    "bash -c": re.compile(r"\b(ba|z)?sh\s+-c\b"),
}
WRITE_EVIDENCE = {
    "write_text": re.compile(r"\bwrite_text\(|\bwrite_bytes\("),
    "writeFileSync": re.compile(r"\bwriteFileSync\(|fs\.writeFile\(|fs\.promises\.writeFile\("),
    "open-write": re.compile(r"open\([^)]*['\"][wa][bt]?['\"]"),
    "Path.write": re.compile(r"Path\([^)]*\)\.write_"),
    "shutil.move": re.compile(r"\bshutil\.(move|copy|copytree)\("),
}
NET_EVIDENCE = {
    "curl": re.compile(r"\bcurl\b"),
    "wget": re.compile(r"\bwget\b"),
    "requests": re.compile(r"\brequests\.(get|post|put|delete|patch)\b"),
    "urllib": re.compile(r"\burllib(\.request)?\b"),
    "httpx": re.compile(r"\bhttpx\."),
    "fetch": re.compile(r"\bfetch\("),
    "npx": re.compile(r"\bnpx\s+"),
    "npm install": re.compile(r"\bnpm\s+(i|install|ci)\b"),
    "pip install": re.compile(r"\bpip3?\s+install\b"),
}
DESTRUCTIVE_EVIDENCE = {
    "rm -rf": re.compile(r"rm\s+-[rf]{1,2}\s+[^\s|;&]"),
    "shutil.rmtree": re.compile(r"shutil\.rmtree\("),
    "os.remove": re.compile(r"os\.remove\(|\bos\.unlink\(|\.unlink\("),
    "sudo": re.compile(r"\bsudo\b"),
    "git push": re.compile(r"git\s+push\b"),
}
TOOL_ALIASES = {
    "bash": {"bash", "shell", "run", "execute", "terminal", "command"},
    "write": {"write", "edit", "notebookedit", "str_replace_editor", "create_file"},
    "network": {"webfetch", "websearch", "web_fetch", "web_search", "fetch", "http", "network", "browser"},
}


def parse_frontmatter(text: str) -> dict:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    out = {}
    for line in m.group(1).splitlines():
        if line[:1] in (" ", "\t", "-", "#"):
            continue
        km = re.match(r"^([A-Za-z_][A-Za-z0-9_\-]*)\s*:\s*(.*)$", line)
        if km:
            out[km.group(1)] = km.group(2).strip()
    return out


def allowed_tools(meta: dict) -> set[str] | None:
    raw = meta.get("allowed-tools") or meta.get("allowed_tools")
    if raw is None:
        return None
    if raw.startswith("[") and raw.endswith("]"):
        raw = raw[1:-1]
    parts = [p.strip().strip("'\"") for p in raw.split(",")]
    tools = set()
    for p in parts:
        p = p.strip()
        if p.startswith("-"):
            p = p[1:].strip()
        if not p:
            continue
        tools.add(p.split(":")[0].strip().lower())
    return tools


def grants(tools: set[str], kind: str) -> bool:
    for t in tools:
        for alias in TOOL_ALIASES[kind]:
            if alias in t:
                return True
    return False


def evidence_for(skill_dir: Path) -> dict:
    out = {"bash": {}, "write": {}, "network": {}, "destructive": {}}
    for fp in sorted(skill_dir.rglob("*")):
        if not fp.is_file() or fp.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if fp.suffix.lower() not in CODE_EXTENSIONS:
            continue
        body = fp.read_text(encoding="utf-8", errors="replace")
        rel = str(fp.relative_to(skill_dir))
        for kind, table in (("bash", BASH_EVIDENCE), ("write", WRITE_EVIDENCE),
                            ("network", NET_EVIDENCE), ("destructive", DESTRUCTIVE_EVIDENCE)):
            for name, rx in table.items():
                if rx.search(body):
                    out[kind].setdefault(name, []).append(rel)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--catalog", action="append", required=True, help="label=path")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    report = {"tool": "decl_tool_lint", "cycle": 40,
              "note": "byte heuristics are ours; the declared tool set is the spec's own field",
              "catalogs": []}
    for spec in args.catalog:
        label, path = spec.split("=", 1)
        root = Path(path)
        recs = []
        for skill_md in sorted(root.rglob("SKILL.md")):
            text = skill_md.read_text(encoding="utf-8", errors="replace")
            meta = parse_frontmatter(text)
            tools = allowed_tools(meta)
            if tools is None:
                continue
            ev = evidence_for(skill_md.parent)
            findings = []
            if not grants(tools, "bash") and ev["bash"]:
                findings.append({"class": "J5_declares_no_bash_but_ships_shell",
                                 "severity": "high", "evidence": ev["bash"]})
            if not grants(tools, "write") and ev["write"]:
                findings.append({"class": "J6_declares_no_write_but_writes_files",
                                 "severity": "high", "evidence": ev["write"]})
            if not grants(tools, "network") and ev["network"]:
                findings.append({"class": "J7_declares_no_network_but_calls_network",
                                 "severity": "medium", "evidence": ev["network"]})
            if not grants(tools, "bash") and ev["destructive"]:
                findings.append({"class": "J8_declares_no_bash_but_destructive_ops",
                                 "severity": "high", "evidence": ev["destructive"]})
            recs.append({"skill_id": skill_md.parent.name, "declared_allowed_tools": sorted(tools),
                         "findings": findings})
        declared = len(recs)
        flagged = [r for r in recs if r["findings"]]
        classes = {}
        for r in flagged:
            for f in r["findings"]:
                classes[f["class"]] = classes.get(f["class"], 0) + 1
        report["catalogs"].append({
            "label": label, "path": str(root),
            "skills_total": sum(1 for _ in root.rglob("SKILL.md")),
            "skills_declaring_allowed_tools": declared,
            "declaration_coverage": round(declared / max(1, sum(1 for _ in root.rglob("SKILL.md"))), 4),
            "flagged": len(flagged),
            "finding_classes": classes,
            "flagged_skills": flagged,
        })
        print(label, "skills", report["catalogs"][-1]["skills_total"],
              "declared", declared, "flagged", len(flagged), classes)
    Path(args.out).write_text(json.dumps(report, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
