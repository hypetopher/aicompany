import { describe, it, expect } from 'vitest';
import { computeNextRunAfter, shouldDeadLetter } from '../../src/workers/retry-policy.js';

describe('retry-policy', () => {
  it('computes increasing backoff windows', () => {
    const t1 = new Date(computeNextRunAfter(1)).getTime();
    const t2 = new Date(computeNextRunAfter(2)).getTime();
    expect(t2).toBeGreaterThan(t1);
  });

  it('dead-letters on attempts >= 7', () => {
    expect(shouldDeadLetter(6)).toBe(false);
    expect(shouldDeadLetter(7)).toBe(true);
  });
});
