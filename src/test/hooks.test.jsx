/**
 * Hook Tests
 * Unit tests for usePlatformStats and notifyStatsUpdated.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePlatformStats, notifyStatsUpdated } from '../hooks/usePlatformStats';

// ── Mock calculateScore ──
vi.mock('../lib/reputation', () => ({
  calculateScore: vi.fn((endorsements) => {
    if (!endorsements || endorsements.length === 0) {
      return { average: '0.0', total: 0, breakdown: {} };
    }
    const sum = endorsements.reduce((a, e) => a + (e.rating || 0), 0);
    const avg = (sum / endorsements.length).toFixed(1);
    return { average: avg, total: endorsements.length, breakdown: {} };
  }),
}));

describe('usePlatformStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns zero stats when registry is empty', () => {
    const { result } = renderHook(() => usePlatformStats());
    expect(result.current.workerCount).toBe(0);
    expect(result.current.avgRating).toBe('0.0');
    expect(result.current.totalEndorsements).toBe(0);
  });

  it('counts registered workers', () => {
    localStorage.setItem(
      'trustchain_worker_registry',
      JSON.stringify(['GABCDE', 'GFGHIJ', 'GKLMNO'])
    );
    const { result } = renderHook(() => usePlatformStats());
    expect(result.current.workerCount).toBe(3);
  });

  it('calculates average rating from endorsements', () => {
    localStorage.setItem(
      'trustchain_worker_registry',
      JSON.stringify(['GABCDE'])
    );
    localStorage.setItem(
      'endorsements_GABCDE',
      JSON.stringify([
        { rating: 5, feedback: 'great', endorser: 'G1' },
        { rating: 3, feedback: 'ok', endorser: 'G2' },
      ])
    );
    const { result } = renderHook(() => usePlatformStats());
    expect(result.current.avgRating).toBe('4.0');
    expect(result.current.totalEndorsements).toBe(1); // 1 worker with reviews
  });

  it('handles malformed localStorage gracefully', () => {
    localStorage.setItem('trustchain_worker_registry', 'not-json');
    const { result } = renderHook(() => usePlatformStats());
    expect(result.current.workerCount).toBe(0);
  });

  it('re-fetches on notifyStatsUpdated()', async () => {
    const { result } = renderHook(() => usePlatformStats());
    expect(result.current.workerCount).toBe(0);

    // Simulate a new worker being added
    localStorage.setItem(
      'trustchain_worker_registry',
      JSON.stringify(['GABCDE'])
    );

    act(() => {
      notifyStatsUpdated();
    });

    await waitFor(() => {
      expect(result.current.workerCount).toBe(1);
    });
  });

  it('ignores workers with no endorsements for avgRating', () => {
    localStorage.setItem(
      'trustchain_worker_registry',
      JSON.stringify(['GABCDE', 'GFGHIJ'])
    );
    // Only GABCDE has endorsements
    localStorage.setItem(
      'endorsements_GABCDE',
      JSON.stringify([{ rating: 4, feedback: 'good', endorser: 'G1' }])
    );
    const { result } = renderHook(() => usePlatformStats());
    expect(result.current.workerCount).toBe(2);
    expect(result.current.avgRating).toBe('4.0'); // only rated worker
    expect(result.current.totalEndorsements).toBe(1); // only 1 worker reviewed
  });
});

describe('notifyStatsUpdated', () => {
  it('dispatches a CustomEvent on window', () => {
    const spy = vi.fn();
    window.addEventListener('trustchain:statsUpdated', spy);
    notifyStatsUpdated();
    expect(spy).toHaveBeenCalledTimes(1);
    window.removeEventListener('trustchain:statsUpdated', spy);
  });
});
