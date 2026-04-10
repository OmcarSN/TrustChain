/**
 * Calculate a reputation score from an array of endorsements.
 * Each endorsement should have a numeric `rating` field (1-5).
 * 
 * Returns: { average: string, total: number, breakdown: { 1-5: percentage } }
 */
export const calculateScore = (endorsements = []) => {
  if (!Array.isArray(endorsements) || endorsements.length === 0) {
    return {
      average: '0.0',
      total: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  // Filter to only valid numeric ratings, clamped to 1-5
  const validEndorsements = endorsements.filter(
    (e) => e && typeof e.rating === 'number' && !isNaN(e.rating) && e.rating >= 1 && e.rating <= 5
  );

  if (validEndorsements.length === 0) {
    return {
      average: '0.0',
      total: endorsements.length,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  // Clamp each rating to integer 1-5 for breakdown bucketing
  const clampedRatings = validEndorsements.map(
    (e) => Math.min(5, Math.max(1, Math.round(e.rating)))
  );

  const total = clampedRatings.length;
  const sum = clampedRatings.reduce((acc, r) => acc + r, 0);
  const average = (sum / total).toFixed(1);

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  clampedRatings.forEach((r) => {
    breakdown[r] = (breakdown[r] || 0) + 1;
  });

  // Convert counts to percentages
  Object.keys(breakdown).forEach((key) => {
    breakdown[key] = Math.round((breakdown[key] / total) * 100);
  });

  return { average, total, breakdown };
};
