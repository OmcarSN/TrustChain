import { useState, useEffect } from 'react';
import { calculateScore } from '../lib/reputation';

/**
 * notifyStatsUpdated — Dispatches a custom event to trigger a re-fetch
 * of platform stats in all mounted usePlatformStats consumers.
 *
 * @returns {void}
 */
export const notifyStatsUpdated = () => {
  window.dispatchEvent(new CustomEvent('trustchain:statsUpdated'));
};

/**
 * @typedef {Object} PlatformStats
 * @property {number} workerCount - Total registered workers.
 * @property {string} avgRating - Average rating across rated workers (1 decimal).
 * @property {number} totalEndorsements - Workers with at least one endorsement.
 */

/**
 * usePlatformStats — Derives aggregate platform statistics from
 * localStorage worker registry and endorsement records. Listens for
 * cross-tab storage events and `trustchain:statsUpdated` custom events
 * to stay in sync.
 *
 * @returns {PlatformStats} Current platform statistics.
 */
export const usePlatformStats = () => {
  const [stats, setStats] = useState({
    workerCount: 0,
    avgRating: '0.0',
    totalEndorsements: 0
  });

  useEffect(() => {
    const fetchStats = () => {
      try {
        const registry = JSON.parse(
          localStorage.getItem('trustchain_worker_registry') || '[]'
        );

        let totalRatingSum = 0;
        let ratedWorkerCount = 0;      // workers who have at least 1 valid rating
        let reviewedWorkerCount = 0;   // workers who have at least 1 endorsement

        registry.forEach((address) => {
          try {
            const endorsements = JSON.parse(
              localStorage.getItem(`endorsements_${address}`) || '[]'
            );
            const rep = calculateScore(endorsements);
            const avg = parseFloat(rep.average);

            // Count workers with at least 1 review
            if (rep.total > 0) {
              reviewedWorkerCount += 1;
            }

            // Only include in avg rating if they have a valid rating > 0
            if (avg > 0) {
              totalRatingSum += avg;
              ratedWorkerCount += 1;
            }
          } catch {
            // skip malformed entries
          }
        });

        const workerCount = registry.length;
        const avgRating =
          ratedWorkerCount > 0
            ? (totalRatingSum / ratedWorkerCount).toFixed(1)
            : '0.0';

        setStats({
          workerCount,           // total registered workers
          avgRating,             // avg only over workers who have ratings
          totalEndorsements: reviewedWorkerCount,  // workers with ≥1 review
        });
      } catch {
        setStats({ workerCount: 0, avgRating: '0.0', totalEndorsements: 0 });
      }
    };

    // Initial fetch
    fetchStats();

    // Listen to storage events (cross-tab)
    const handleStorage = (e) => {
      if (e.key === 'trustchain_worker_registry' || (e.key && e.key.startsWith('endorsements_'))) {
        fetchStats();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('trustchain:statsUpdated', fetchStats);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('trustchain:statsUpdated', fetchStats);
    };
  }, []);

  return stats;
};
