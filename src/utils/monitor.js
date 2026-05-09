const ERRORS_KEY = 'trustchain_errors';
const TXS_KEY = 'trustchain_txlog';
const MAX_LOGS = 100;

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
 * Logs an error to localStorage with context information.
 * Caps log at MAX_LOGS entries to prevent unbounded storage growth.
 * @param {Error|string} error - The error to log
 * @param {string} context - Description of where/when the error occurred
 * @returns {void}
 */
export const logError = (error, context) => {
  console.error(`[TrustChain Error] ${context}:`, error);

  try {
    const existing = JSON.parse(localStorage.getItem(ERRORS_KEY) || '[]');
    existing.unshift({
      message: error.message || String(error),
      stack: error.stack || null,
      context,
      timestamp: new Date().toISOString()
    });
    
    // Cap at 100
    if (existing.length > MAX_LOGS) {
      existing.length = MAX_LOGS; 
    }
    
    localStorage.setItem(ERRORS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to write to error log', e);
  }
};

/**
 * Logs a successful transaction to localStorage.
 * @param {string} txHash - The Stellar transaction hash
 * @param {string} type - Transaction type identifier (e.g. "mint_credential", "endorse")
 * @param {string} wallet - The wallet address that initiated the transaction
 * @returns {void}
 */
export const logTransaction = (txHash, type, wallet) => {
  try {
    const existing = JSON.parse(localStorage.getItem(TXS_KEY) || '[]');
    existing.unshift({
      txHash,
      type,
      wallet,
      timestamp: new Date().toISOString()
    });
    
    if (existing.length > MAX_LOGS) {
      existing.length = MAX_LOGS;
    }
    
    localStorage.setItem(TXS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to write to tx log', e);
  }
};

/**
 * Retrieves the error log from localStorage.
 * @returns {ErrorLogEntry[]} Array of error log entries, newest first
 */
export const getErrorLog = () => {
  try {
    return JSON.parse(localStorage.getItem(ERRORS_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Retrieves the transaction log from localStorage.
 * @returns {TransactionLogEntry[]} Array of transaction log entries, newest first
 */
export const getTxLog = () => {
  try {
    return JSON.parse(localStorage.getItem(TXS_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Clears both error and transaction logs from localStorage.
 * @returns {void}
 */
export const clearLogs = () => {
  localStorage.removeItem(ERRORS_KEY);
  localStorage.removeItem(TXS_KEY);
};
