# OpenClaw cron examples (ready payloads)

## 1) Heartbeat every 5 minutes

```json
{
  "sessionTarget": "main",
  "schedule": { "kind": "every", "everyMs": 300000 },
  "payload": {
    "kind": "systemEvent",
    "text": "Reminder: run aicompany heartbeat now. Execute: cd /home/ax/.openclaw/workspace/aicompany && npm run heartbeat:run"
  },
  "enabled": true,
  "name": "aicompany-heartbeat-5m"
}
```

## 2) Worker tick every minute

```json
{
  "sessionTarget": "main",
  "schedule": { "kind": "every", "everyMs": 60000 },
  "payload": {
    "kind": "systemEvent",
    "text": "Reminder: run aicompany worker tick now. Execute: cd /home/ax/.openclaw/workspace/aicompany && npm run worker:once"
  },
  "enabled": true,
  "name": "aicompany-worker-1m"
}
```

## 3) Daily summary at 09:00 Europe/Berlin

```json
{
  "sessionTarget": "main",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "Europe/Berlin" },
  "payload": {
    "kind": "systemEvent",
    "text": "Reminder: produce aicompany daily summary (runs, failures, queue size, quota blocks, lessons)."
  },
  "enabled": true,
  "name": "aicompany-daily-summary"
}
```
