/**
 * Calculates the reputation score and star breakdown for a worker.
 * @param {Array} endorsements - Array of endorsement objects.
 * @returns {Object} - { average, total, breakdown }
 */
export function calculateScore(endorsements) {
  if (!endorsements || endorsements.length === 0) {
    return {
      average: 0,
      total: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const total = endorsements.length;
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  endorsements.forEach(e => {
    const r = Math.round(e.rating);
    if (counts[r] !== undefined) {
      counts[r]++;
      sum += r;
    }
  });

  const average = parseFloat((sum / total).toFixed(1));

  // Calculate percentages for each star rating
  const breakdown = {};
  for (let i = 1; i <= 5; i++) {
    breakdown[i] = Math.round((counts[i] / total) * 100);
  }

  return { average, total, breakdown };
}
