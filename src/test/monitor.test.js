import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock supabaseData ──
const mockLogs = { errors: [], transactions: [] };

vi.mock('../lib/supabaseData', () => ({
  logMonitorError: vi.fn((error, context) => {
    mockLogs.errors.unshift({
      message: error.message || String(error),
      stack: error.stack || null,
      context,
      timestamp: new Date().toISOString(),
    });
    if (mockLogs.errors.length > 100) mockLogs.errors.length = 100;
    return Promise.resolve();
  }),
  logMonitorTransaction: vi.fn((txHash, type, wallet) => {
    mockLogs.transactions.unshift({
      txHash,
      type,
      wallet,
      timestamp: new Date().toISOString(),
    });
    if (mockLogs.transactions.length > 100) mockLogs.transactions.length = 100;
    return Promise.resolve();
  }),
  getMonitorErrorLog: vi.fn(() => Promise.resolve([...mockLogs.errors])),
  getMonitorTxLog: vi.fn(() => Promise.resolve([...mockLogs.transactions])),
  clearMonitorLogs: vi.fn(() => {
    mockLogs.errors = [];
    mockLogs.transactions = [];
    return Promise.resolve();
  }),
}));

import { logError, logTransaction, getErrorLog, getTxLog, clearLogs } from '../utils/monitor';

describe('Monitor Utilities', () => {
  beforeEach(() => {
    mockLogs.errors = [];
    mockLogs.transactions = [];
    vi.clearAllMocks();
  });

  describe('logError', () => {
    it('stores an error with context and timestamp', async () => {
      logError({ message: 'Test error', stack: 'stack trace' }, 'testContext');
      // Wait for the fire-and-forget async to complete
      await new Promise(r => setTimeout(r, 10));
      const logs = await getErrorLog();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test error');
      expect(logs[0].context).toBe('testContext');
      expect(logs[0].timestamp).toBeDefined();
    });

    it('caps logs at 100 entries', async () => {
      for (let i = 0; i < 110; i++) {
        logError({ message: `Error ${i}` }, 'stress');
      }
      await new Promise(r => setTimeout(r, 10));
      const logs = await getErrorLog();
      expect(logs.length).toBeLessThanOrEqual(100);
    });

    it('most recent error is first', async () => {
      logError({ message: 'First' }, 'ctx');
      logError({ message: 'Second' }, 'ctx');
      await new Promise(r => setTimeout(r, 10));
      const logs = await getErrorLog();
      expect(logs[0].message).toBe('Second');
    });
  });

  describe('logTransaction', () => {
    it('stores a transaction with hash, type, and wallet', async () => {
      logTransaction('abc123', 'Mint Credential', 'GABC...');
      await new Promise(r => setTimeout(r, 10));
      const logs = await getTxLog();
      expect(logs).toHaveLength(1);
      expect(logs[0].txHash).toBe('abc123');
      expect(logs[0].type).toBe('Mint Credential');
      expect(logs[0].wallet).toBe('GABC...');
    });
  });

  describe('clearLogs', () => {
    it('removes all error and tx logs', async () => {
      logError({ message: 'err' }, 'ctx');
      logTransaction('hash', 'type', 'wallet');
      await new Promise(r => setTimeout(r, 10));
      clearLogs();
      await new Promise(r => setTimeout(r, 10));
      expect(await getErrorLog()).toHaveLength(0);
      expect(await getTxLog()).toHaveLength(0);
    });
  });
});
