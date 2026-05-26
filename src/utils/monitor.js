import {
  logMonitorError,
  logMonitorTransaction,
  getMonitorErrorLog,
  getMonitorTxLog,
  clearMonitorLogs,
} from '../lib/supabaseData';

/**
 * @typedef {Object} ErrorLogEntry
 * @property {string} message - Error message text
 * @property {string|null} stack - Error stack trace
 * @property {string} context - Where the error occurred
 * @property {string} timestamp - ISO 8601 timestamp
 */

/**
 * @typedef {Object} TransactionLogEntry
 * @property {string} txHash - Stellar transaction hash
 * @property {string} type - Transaction type (e.g. "mint", "endorse")
 * @property {string} wallet - Wallet address that initiated the tx
 * @property {string} timestamp - ISO 8601 timestamp
 */

/**
 * Logs an error to Supabase with context information.
 * Fire-and-forget — does not block callers.
 * @param {Error|string} error - The error to log
 * @param {string} context - Description of where/when the error occurred
 * @returns {void}
 */
export const logError = (error, context) => {
  console.error(`[TrustChain Error] ${context}:`, error);
  // Fire-and-forget async write to Supabase
  logMonitorError(error, context);
};

/**
 * Logs a successful transaction to Supabase.
 * @param {string} txHash - The Stellar transaction hash
 * @param {string} type - Transaction type identifier (e.g. "mint_credential", "endorse")
 * @param {string} wallet - The wallet address that initiated the transaction
 * @returns {void}
 */
export const logTransaction = (txHash, type, wallet) => {
  // Fire-and-forget async write to Supabase
  logMonitorTransaction(txHash, type, wallet);
};

/**
 * Retrieves the error log from Supabase.
 * @returns {Promise<ErrorLogEntry[]>} Array of error log entries, newest first
 */
export const getErrorLog = async () => {
  try {
    return await getMonitorErrorLog();
  } catch {
    return [];
  }
};

/**
 * Retrieves the transaction log from Supabase.
 * @returns {Promise<TransactionLogEntry[]>} Array of transaction log entries, newest first
 */
export const getTxLog = async () => {
  try {
    return await getMonitorTxLog();
  } catch {
    return [];
  }
};

/**
 * Clears both error and transaction logs from Supabase.
 * @returns {void}
 */
export const clearLogs = () => {
  clearMonitorLogs();
};
