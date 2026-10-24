#!/usr/bin/env bash
set -euo pipefail
cd /home/ax/.openclaw/workspace/aicompany
set -a; source .env; set +a
while true; do
  npm run worker:once || true
  sleep 15
done
