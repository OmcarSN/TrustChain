const ERRORS_KEY = 'trustchain_errors';
const TXS_KEY = 'trustchain_txlog';
const MAX_LOGS = 100;

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

export const getErrorLog = () => {
  try {
    return JSON.parse(localStorage.getItem(ERRORS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getTxLog = () => {
  try {
    return JSON.parse(localStorage.getItem(TXS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(ERRORS_KEY);
  localStorage.removeItem(TXS_KEY);
};
