# CI Testing

## Workflows
- Main CI: `.github/workflows/ci.yml`
- Nightly DB harness: `.github/workflows/nightly-db.yml`

## Main CI (push/PR)
Runs:
- install
- build (node)
- build (web)
- unit tests (JUnit + coverage)
- integration tests (JUnit)
- upload artifacts + publish test summary

## Nightly DB harness
Runs daily (and manual dispatch) with Supabase secrets:
- `npm run test:integration:ci`
- focuses on DB-backed integration checks (claim concurrency / cron affinity harness)
- uploads junit artifact and publishes summary

## Reports generated
- `reports/unit-junit.xml`
- `reports/integration-junit.xml`
- `reports/coverage/unit/` (lcov + json-summary + text)

## Coverage gate
Unit CI run enforces minimum thresholds (configured in `vitest.config.ts`):
- lines >= 72%
- statements >= 72%
- functions >= 72%
- branches >= 62%

If below threshold, CI fails.

## Secrets required for DB-backed tests
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local parity
```bash
npm ci
npm run build
npm run build:web
npm run test:unit:ci
npm run test:integration:ci
```
