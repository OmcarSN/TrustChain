import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatsBar — Animated platform metrics bar on the Landing page.
 * Displays a 4-column grid of stat cards (workers, rating, endorsements,
 * gasless) with staggered scroll-reveal animations, accent color coding,
 * and a noise-texture overlay.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.stats - Stat items to display.
 * @param {boolean} props.visible - Whether the section has scrolled into view.
 * @returns {React.ReactElement} The StatsBar component.
 */
const StatsBar = ({ stats, visible }) => (
  <section className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-zinc-800" style={{
    borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden',
    paddingLeft: '24px', paddingRight: '24px', marginTop: '80px',
  }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', zIndex: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")' }} />
    {stats.map((stat, i) => {
      const accentColor = i === 1 ? '#f5c518' : i === 3 ? '#00dc6e' : 'rgba(255,255,255,0.3)';
      const isGasless = i === 3;
      return (
        <div key={i} style={{
          padding: '20px 32px', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
        }}>
          <div style={{ width: '32px', height: '2px', backgroundColor: accentColor, marginBottom: '12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <p className="font-clash" style={{ fontSize: '1.6rem', fontWeight: '900', color: isGasless ? '#00dc6e' : '#ffffff', filter: isGasless ? 'drop-shadow(0 0 8px rgba(0,220,110,0.3))' : 'none', lineHeight: '1', margin: 0 }}>
              {stat.value}
            </p>
            <span style={{ color: '#00dc6e', fontSize: '11px', fontWeight: '700' }}>↑</span>
          </div>
          {stat.value === '2.5' && (
            <p style={{ color: '#f5c518', fontSize: '12px', marginBottom: '4px', marginTop: 0 }}>★★½☆☆</p>
          )}
          <p className="font-inter tc-eyebrow" style={{ marginTop: stat.value === '2.5' ? '0' : '4px', marginBottom: 0 }}>
            {stat.label}
          </p>
        </div>
      );
    })}
  </section>
);

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
