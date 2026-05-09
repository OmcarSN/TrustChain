import { describe, it, expect, vi } from 'vitest';
import { buildFeeBumpTransaction } from '../utils/feeBump';

// Mock the monitor to prevent localStorage issues
vi.mock('../utils/monitor', () => ({
  logError: vi.fn(),
}));

describe('buildFeeBumpTransaction', () => {
  it('returns null for invalid XDR input', () => {
    const result = buildFeeBumpTransaction('invalid-xdr', {}, 'Test SDF Network ; September 2015');
    expect(result).toBeNull();
  });

  it('returns null for missing sponsor keypair', () => {
    const result = buildFeeBumpTransaction('some-xdr', null, 'Test SDF Network ; September 2015');
    expect(result).toBeNull();
  });

  it('does not throw — gracefully degrades', () => {
    expect(() => {
      buildFeeBumpTransaction('bad', {}, 'bad');
    }).not.toThrow();
  });
});
