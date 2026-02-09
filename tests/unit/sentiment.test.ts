import { describe, it, expect } from 'vitest';
import { classifySentiment, sentimentDelta } from '../../src/affinity/sentiment.js';

describe('sentiment scoring', () => {
  it('classifies positive text', () => {
    expect(classifySentiment('great collab, thanks')).toBe('positive');
    expect(sentimentDelta('positive')).toBeGreaterThan(0);
  });

  it('classifies negative text', () => {
    expect(classifySentiment('conflict and failed handoff')).toBe('negative');
    expect(sentimentDelta('negative')).toBeLessThan(0);
  });
});
