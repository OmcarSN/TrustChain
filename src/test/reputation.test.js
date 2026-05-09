/**
 * Reputation Score Tests
 * Tests the calculateScore function with various edge cases.
 */
import { describe, it, expect } from 'vitest';
import { calculateScore } from '../lib/reputation';

describe('calculateScore', () => {
  it('returns default score for empty array', () => {
    const result = calculateScore([]);
    expect(result.average).toBe('0.0');
    expect(result.total).toBe(0);
    expect(result.breakdown).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  });

  it('returns default score for null/undefined', () => {
    expect(calculateScore(null).average).toBe('0.0');
    expect(calculateScore(undefined).average).toBe('0.0');
  });

  it('calculates correct average for uniform ratings', () => {
    const endorsements = [
      { rating: 5 },
      { rating: 5 },
      { rating: 5 },
    ];
    const result = calculateScore(endorsements);
    expect(result.average).toBe('5.0');
    expect(result.total).toBe(3);
  });

  it('calculates correct average for mixed ratings', () => {
    const endorsements = [
      { rating: 5 },
      { rating: 3 },
      { rating: 4 },
      { rating: 2 },
      { rating: 1 },
    ];
    const result = calculateScore(endorsements);
    expect(result.average).toBe('3.0');
    expect(result.total).toBe(5);
  });

  it('ignores invalid ratings', () => {
    const endorsements = [
      { rating: 5 },
      { rating: -1 },
      { rating: 'not a number' },
      { rating: 10 },
      { rating: null },
      {},
    ];
    const result = calculateScore(endorsements);
    expect(result.average).toBe('5.0');
    expect(result.total).toBe(1);
  });

  it('calculates correct breakdown percentages', () => {
    const endorsements = [
      { rating: 5 },
      { rating: 5 },
      { rating: 3 },
      { rating: 1 },
    ];
    const result = calculateScore(endorsements);
    expect(result.breakdown[5]).toBe(50);
    expect(result.breakdown[3]).toBe(25);
    expect(result.breakdown[1]).toBe(25);
    expect(result.breakdown[2]).toBe(0);
    expect(result.breakdown[4]).toBe(0);
  });

  it('clamps fractional ratings to nearest integer', () => {
    const endorsements = [{ rating: 4.7 }, { rating: 2.2 }];
    const result = calculateScore(endorsements);
    // 4.7 rounds to 5, 2.2 rounds to 2, so average = (5+2)/2 = 3.5
    expect(result.average).toBe('3.5');
    expect(result.breakdown[5]).toBe(50);
    expect(result.breakdown[2]).toBe(50);
  });
});
