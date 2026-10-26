#!/usr/bin/env bash
# Probe: how many of our skills.sh listings are indexed, and with how many installs.
# Usage: bash scripts/probe-index.sh
# Output: JSON-ish lines -> "indexed=<n> total_expected=3" plus one line per listing.
set -uo pipefail
OWNER="hypetopher/aicompany"
EXPECTED=3

rows=$(curl -s -m 25 "https://skills.sh/api/search?q=${OWNER}&limit=50" \
  | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    print('API_ERROR'); raise SystemExit
for r in d.get('skills', []):
    i = r.get('id') or ''
    if i.startswith('${OWNER}/'):
        print(i, r.get('installs'))
")

if [ "$rows" = "API_ERROR" ] || [ -z "$rows" ]; then
  echo "indexed=0 total_expected=${EXPECTED} status=api_error"
  exit 0
fi

n=$(printf '%s\n' "$rows" | grep -c .)
echo "indexed=${n} total_expected=${EXPECTED}"
printf '%s\n' "$rows"
