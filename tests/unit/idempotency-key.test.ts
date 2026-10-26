import { describe, it, expect } from 'vitest';
import { stepIdempotencyKey } from '../../src/lib/db.js';

describe('stepIdempotencyKey', () => {
  it('is stable for identical payloads', () => {
    const a = stepIdempotencyKey(1, 'analyze', { target: 'x' });
    const b = stepIdempotencyKey(1, 'analyze', { target: 'x' });
    expect(a).toBe(b);
  });

  it('differs across kind and proposal', () => {
    const base = stepIdempotencyKey(1, 'analyze', { target: 'x' });
    expect(stepIdempotencyKey(1, 'write_content', { target: 'x' })).not.toBe(base);
    expect(stepIdempotencyKey(2, 'analyze', { target: 'x' })).not.toBe(base);
  });

  it('differs for different payloads', () => {
    expect(stepIdempotencyKey(1, 'analyze', { target: 'a' })).not.toBe(
      stepIdempotencyKey(1, 'analyze', { target: 'b' }),
    );
  });

  /**
   * The regression that produced the 94711/94720/94732 graveyard: the key
   * embedded the raw payload, and Postgres btree index entries cap at ~2704
   * bytes, so a 3.5k-5.5k byte payload aborted the step insert.
   */
  it('stays under the btree limit for large payloads', () => {
    const huge = { report: 'x'.repeat(50_000) };
    const key = stepIdempotencyKey(1, 'analyze', huge);
    expect(Buffer.byteLength(key)).toBeLessThan(200);
  });
});
