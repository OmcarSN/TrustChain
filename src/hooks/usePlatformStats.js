import { useState, useEffect } from 'react';
import { calculateScore } from '../lib/reputation';
import { getWorkerRegistry, getEndorsements } from '../lib/supabaseData';

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
 * Supabase worker and endorsement data. Listens for
 * `trustchain:statsUpdated` custom events to stay in sync.
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
    const fetchStats = async () => {
      try {
        const registry = await getWorkerRegistry();

        let totalRatingSum = 0;
        let ratedWorkerCount = 0;      // workers who have at least 1 valid rating
        let reviewedWorkerCount = 0;   // workers who have at least 1 endorsement

        for (const address of registry) {
          try {
            const endorsements = await getEndorsements(address);
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
        }

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

    // Listen for in-tab stat updates (e.g. after a new mint or endorsement)
    window.addEventListener('trustchain:statsUpdated', fetchStats);

    return () => {
      window.removeEventListener('trustchain:statsUpdated', fetchStats);
    };
  }, []);

  return stats;
};
