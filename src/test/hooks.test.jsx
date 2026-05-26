/**
 * Hook Tests
 * Unit tests for usePlatformStats and notifyStatsUpdated.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePlatformStats, notifyStatsUpdated } from '../hooks/usePlatformStats';

// ── Mock supabaseData ──
const mockGetWorkerRegistry = vi.fn().mockResolvedValue([]);
const mockGetEndorsements = vi.fn().mockResolvedValue([]);

vi.mock('../lib/supabaseData', () => ({
  getWorkerRegistry: (...args) => mockGetWorkerRegistry(...args),
  getEndorsements: (...args) => mockGetEndorsements(...args),
}));

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
    mockGetWorkerRegistry.mockReset().mockResolvedValue([]);
    mockGetEndorsements.mockReset().mockResolvedValue([]);
  });

  it('returns zero stats when registry is empty', async () => {
    const { result } = renderHook(() => usePlatformStats());
    await waitFor(() => {
      expect(result.current.workerCount).toBe(0);
    });
    expect(result.current.avgRating).toBe('0.0');
    expect(result.current.totalEndorsements).toBe(0);
  });

  it('counts registered workers', async () => {
    mockGetWorkerRegistry.mockResolvedValue(['GABCDE', 'GFGHIJ', 'GKLMNO']);
    const { result } = renderHook(() => usePlatformStats());
    await waitFor(() => {
      expect(result.current.workerCount).toBe(3);
    });
  });

  it('calculates average rating from endorsements', async () => {
    mockGetWorkerRegistry.mockResolvedValue(['GABCDE']);
    mockGetEndorsements.mockResolvedValue([
      { rating: 5, feedback: 'great', endorser: 'G1' },
      { rating: 3, feedback: 'ok', endorser: 'G2' },
    ]);
    const { result } = renderHook(() => usePlatformStats());
    await waitFor(() => {
      expect(result.current.avgRating).toBe('4.0');
    });
    expect(result.current.totalEndorsements).toBe(1); // 1 worker with reviews
  });

  it('handles empty registry gracefully', async () => {
    mockGetWorkerRegistry.mockResolvedValue([]);
    const { result } = renderHook(() => usePlatformStats());
    await waitFor(() => {
      expect(result.current.workerCount).toBe(0);
    });
  });

  it('re-fetches on notifyStatsUpdated()', async () => {
    const { result } = renderHook(() => usePlatformStats());
    await waitFor(() => {
      expect(result.current.workerCount).toBe(0);
    });

    // Simulate a new worker being added
    mockGetWorkerRegistry.mockResolvedValue(['GABCDE']);

    act(() => {
      notifyStatsUpdated();
    });

    await waitFor(() => {
      expect(result.current.workerCount).toBe(1);
    });
  });

  it('ignores workers with no endorsements for avgRating', async () => {
    mockGetWorkerRegistry.mockResolvedValue(['GABCDE', 'GFGHIJ']);
    // Only GABCDE has endorsements
    mockGetEndorsements.mockImplementation((addr) => {
      if (addr === 'GABCDE') {
        return Promise.resolve([{ rating: 4, feedback: 'good', endorser: 'G1' }]);
      }
      return Promise.resolve([]);
    });
    const { result } = renderHook(() => usePlatformStats());
    await waitFor(() => {
      expect(result.current.workerCount).toBe(2);
    });
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
