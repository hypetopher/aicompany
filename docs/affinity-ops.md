# Affinity operations

## Update affinity from recent events
```bash
npm run affinity:update
```

## Apply daily affinity decay (default 2%)
```bash
npm run affinity:decay
```

Custom decay:
```bash
npm run affinity:decay -- 0.03
```

## Suggested OpenClaw cron jobs
- Hourly: `npm run affinity:update`
- Daily 00:05: `npm run affinity:decay`

This keeps relationship scores responsive to new interactions while slowly decaying stale bonds.
