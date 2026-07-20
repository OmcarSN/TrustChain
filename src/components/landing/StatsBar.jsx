import React from 'react';
import PropTypes from 'prop-types';
import { Users, Star, MessageSquare, Zap } from 'lucide-react';

/**
 * StatsBar — Animated platform metrics bar on the Landing page.
 * Displays a 4-column grid of stat cards with gradient accents and glow.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.stats - Stat items to display.
 * @param {boolean} props.visible - Whether the section has scrolled into view.
 * @returns {React.ReactElement} The StatsBar component.
 */
const StatsBar = ({ stats, visible }) => {
  // Indigo-dominant, with one warm-amber highlight on the rating stat for human warmth.
  const accents = ['#4F6BED', '#E8A04C', '#7C93F2', '#4F6BED'];
  const Icons = [Users, Star, MessageSquare, Zap];

  return (
    <section style={{ padding: '0 24px', marginTop: '80px' }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {stats.map((stat, i) => {
          const Icon = Icons[i];
          return (
          <div key={i} className="stat-card-premium" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
          }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Icon size={24} color={accents[i]} opacity={0.8} />
            </div>
            <p className="font-clash" style={{
              fontSize: '2rem', fontWeight: '900', color: accents[i],
              lineHeight: '1', margin: '0 0 8px 0',
              filter: `drop-shadow(0 0 8px ${accents[i]}40)`,
            }}>
              {stat.value}
            </p>
            <p className="font-inter" style={{
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', fontWeight: '600', margin: 0,
            }}>
              {stat.label}
            </p>
          </div>
          );
        })}
      </div>
    </section>
  );
};

StatsBar.propTypes = {
  /** Array of stat item objects with value and label. */
  stats: PropTypes.arrayOf(PropTypes.shape({
    /** Display value string. */
    value: PropTypes.string.isRequired,
    /** Label text. */
    label: PropTypes.string.isRequired,
  })).isRequired,
  /** Whether the section is visible (from IntersectionObserver). */
  visible: PropTypes.bool.isRequired,
};

export default StatsBar;
