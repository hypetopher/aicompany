# CI Testing

## Workflow
GitHub Actions workflow: `.github/workflows/ci.yml`

Runs on push/PR:
- install
- build (node)
- build (web)
- unit tests
- integration tests

## DB-backed integration tests
Some integration tests are auto-skipped without DB env.

To enable full integration coverage in CI, set repo secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

With both secrets present, CI runs DB-backed claim-concurrency + cron-affinity harness tests.

## Local parity
```bash
npm ci
npm run build
npm run build:web
npm run test:all
npm run test:integration
```
