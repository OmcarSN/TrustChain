import { useState, useEffect } from 'react';
import { HORIZON_URL } from '../lib/stellar-config';

/**
 * @typedef {Object} HorizonMetrics
 * @property {number} totalCredentials - Count of successful transactions.
 * @property {number} activeWallets - Unique source accounts across transactions.
 * @property {number} todayTx - Transactions created today (UTC).
 * @property {Array<{hash: string, walletAddress: string, timeAgo: string, operationType: string, successful: boolean}>} recentActivity - Last 10 transactions.
 * @property {boolean} loading - Whether the initial fetch is in progress.
 * @property {string|null} error - Error message if the fetch failed, or null.
 */

/**
 * useHorizonMetrics — Fetches live transaction metrics from the Stellar
 * Horizon testnet for a given contract account. Polls every 30 seconds.
 *
 * @param {string} contractId - Stellar account/contract ID to query.
 * @returns {HorizonMetrics} Current metrics object.
 */
export function useHorizonMetrics(contractId) {
  const [metrics, setMetrics] = useState({
    totalCredentials: 0,
    activeWallets: 0,
    todayTx: 0,
    recentActivity: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!contractId) {
      setMetrics(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchMetrics = async () => {
      try {
        // Fetch up to 100 transactions to calculate aggregated metrics
        const response = await fetch(`${HORIZON_URL}/accounts/${contractId}/transactions?order=desc&limit=100`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch from testnet Horizon');
        }

        const data = await response.json();
        const txs = data._embedded ? data._embedded.records : [];

        // Total successful transactions
        const successfulTxs = txs.filter(tx => tx.successful);
        const totalCredentials = successfulTxs.length;

        // Active Wallets
        const uniqueWallets = new Set();
        successfulTxs.forEach(tx => uniqueWallets.add(tx.source_account));
        const activeWallets = uniqueWallets.size;

        // Transactions Today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        let todayTxCount = 0;
        successfulTxs.forEach(tx => {
          const txDate = new Date(tx.created_at);
          if (txDate >= startOfToday) {
            todayTxCount++;
          }
        });

        // Last 10 Recent Activity
        const recentActivity = txs.slice(0, 10).map(tx => {
          // Calculate time ago
          const diffMs = new Date() - new Date(tx.created_at);
          const diffMins = Math.floor(diffMs / 60000);
          const timeAgo = diffMins < 1 
            ? 'Just now' 
            : diffMins < 60 
              ? `${diffMins} min${diffMins !== 1 ? 's' : ''} ago` 
              : `${Math.floor(diffMins/60)} hr${Math.floor(diffMins/60) !== 1 ? 's' : ''} ago`;

          return {
            hash: tx.hash,
            walletAddress: tx.source_account,
            timeAgo: timeAgo,
            operationType: 'Contract Invocation',
            successful: tx.successful
          };
        });

        setMetrics({
          totalCredentials,
          activeWallets,
          todayTx: todayTxCount,
          recentActivity,
          loading: false,
          error: null,
        });

      } catch (err) {
        setMetrics(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 30000);

    return () => clearInterval(intervalId);
  }, [contractId]);

  return metrics;
}
