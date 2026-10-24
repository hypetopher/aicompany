#!/usr/bin/env bash
set -euo pipefail
cd /home/ax/.openclaw/workspace/aicompany
set -a; source .env; set +a
while true; do
  npm run heartbeat:run || true
  sleep 300
done
