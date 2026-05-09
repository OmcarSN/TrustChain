import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logError, logTransaction, getErrorLog, getTxLog, clearLogs } from '../utils/monitor';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    key: vi.fn((i) => Object.keys(store)[i]),
    get length() { return Object.keys(store).length; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('Monitor Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('logError', () => {
    it('stores an error with context and timestamp', () => {
      logError({ message: 'Test error', stack: 'stack trace' }, 'testContext');
      const logs = getErrorLog();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test error');
      expect(logs[0].context).toBe('testContext');
      expect(logs[0].timestamp).toBeDefined();
    });

    it('caps logs at 100 entries', () => {
      for (let i = 0; i < 110; i++) {
        logError({ message: `Error ${i}` }, 'stress');
      }
      const logs = getErrorLog();
      expect(logs.length).toBeLessThanOrEqual(100);
    });

    it('most recent error is first', () => {
      logError({ message: 'First' }, 'ctx');
      logError({ message: 'Second' }, 'ctx');
      const logs = getErrorLog();
      expect(logs[0].message).toBe('Second');
    });
  });

  describe('logTransaction', () => {
    it('stores a transaction with hash, type, and wallet', () => {
      logTransaction('abc123', 'Mint Credential', 'GABC...');
      const logs = getTxLog();
      expect(logs).toHaveLength(1);
      expect(logs[0].txHash).toBe('abc123');
      expect(logs[0].type).toBe('Mint Credential');
      expect(logs[0].wallet).toBe('GABC...');
    });
  });

  describe('clearLogs', () => {
    it('removes all error and tx logs', () => {
      logError({ message: 'err' }, 'ctx');
      logTransaction('hash', 'type', 'wallet');
      clearLogs();
      expect(getErrorLog()).toHaveLength(0);
      expect(getTxLog()).toHaveLength(0);
    });
  });
});
