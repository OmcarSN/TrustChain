import { useState, useEffect } from 'react';
import { calculateScore } from '../lib/reputation';

export const notifyStatsUpdated = () => {
  window.dispatchEvent(new CustomEvent('trustchain:statsUpdated'));
};

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
