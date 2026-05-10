import React from 'react';
import { Star } from 'lucide-react';

import PropTypes from 'prop-types';

/**
 * ProfileStatsRow — Reputation statistics row on the WorkerProfile page.
 * Displays four animated stat cards: average rating (with star icons),
 * total reviews, highest score, and weighted score. Each value uses
 * an eased counter animation on mount.
 *
 * @param {Object} props
 * @param {number} props.statAvgRating - Average endorsement rating.
 * @param {number} props.statTotalReviews - Total number of endorsements.
 * @param {number} props.statHighestScore - Highest individual score.
 * @param {number} props.statWeightedScore - Weighted reputation score.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ProfileStatsRow component.
 */
const AnimatedStat = ({ value, isFloat }) => {
  const [count, setCount] = React.useState(0);
  const updateCount = React.useCallback((val) => setCount(val), []);

  React.useEffect(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue === 0) {
      updateCount(numValue || 0);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const stepTime = Math.abs(Math.floor(duration / steps));
    const inc = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= numValue) {
        clearInterval(timer);
        updateCount(numValue);
      } else {
        updateCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, updateCount]);

  return <>{isFloat ? count.toFixed(1) : Math.round(count)}</>;
};

const ProfileStatsRow = ({ statAvgRating, statTotalReviews, statHighestScore, statWeightedScore, t }) => {
  const renderStatValue = (val, isFloat) => {
    if (val === undefined || val === null || val === '—' || isNaN(val)) {
      return <span className="tc-stat-na">N/A</span>;
    }
    return <AnimatedStat value={val} isFloat={isFloat} />;
  };

  const stats = [
    { value: statAvgRating, label: t('profile.statRating'), isFloat: true, showStars: true },
    { value: statTotalReviews, label: t('profile.statJobs'), isFloat: false },
    { value: statHighestScore, label: t('profile.statPoints').replace('Trust Points','Highest Score'), isFloat: false },
    { value: statWeightedScore, label: 'Weighted Score', isFloat: true },
  ];

  return (
    <div
      className="prof-anim tc-stat-grid tc-mb-2xl"
      role="region"
      aria-label={t('profile.statsRegion', 'Reputation statistics')}
      style={{ animationDelay: '0.1s' }}
    >
      {stats.map((stat, i, arr) => (
        <div key={i} className={`prof-stat tc-stat-cell ${i < arr.length - 1 ? 'tc-stat-cell-border' : ''}`}>
          <div style={{ height: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'center', gap: '2px' }}>
            {stat.showStars && (
              <div role="img" aria-label={`${Math.round(statAvgRating)} out of 5 stars`}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} style={{ width: '14px', height: '14px', color: s <= Math.round(statAvgRating) ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= Math.round(statAvgRating) ? '#f5a623' : 'transparent', display: 'inline' }} aria-hidden="true" />
                ))}
              </div>
            )}
          </div>
          <p className="font-clash tc-stat-value">{renderStatValue(stat.value, stat.isFloat)}</p>
          <p className="font-inter tc-caption" style={{ margin: 0 }}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStatsRow;

ProfileStatsRow.propTypes = {
  /** Average endorsement rating (0–5). */
  statAvgRating: PropTypes.number,
  /** Total number of endorsements received. */
  statTotalReviews: PropTypes.number,
  /** Highest individual endorsement score. */
  statHighestScore: PropTypes.number,
  /** Weighted reputation score. */
  statWeightedScore: PropTypes.number,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};
