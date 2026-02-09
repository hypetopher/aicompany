import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      reportsDirectory: 'reports/coverage/unit',
      include: [
        'src/affinity/sentiment.ts',
        'src/workers/retry-policy.ts',
        'src/services/proposal-service.ts',
        'src/affinity/update-affinity.ts',
        'src/api/stage.ts',
        'src/workers/mission-worker.ts',
        'src/executors/step-executors.ts',
      ],
      thresholds: {
        lines: 72,
        functions: 72,
        statements: 72,
        branches: 62,
      },
    },
  },
});
