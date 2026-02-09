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
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 60,
      },
    },
  },
});
