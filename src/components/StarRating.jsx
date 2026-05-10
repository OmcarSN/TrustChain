import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * StarRating — Reusable star display and interactive input component.
 * Extracted from Endorse.jsx, Verify.jsx, and WorkerProfile.jsx.
 *
 * In read-only mode (no onRate), renders static filled/empty stars.
 * In interactive mode (onRate provided), supports click + hover + keyboard.
 */

/**
 * StarDisplay — Read-only star rating display.
 * Renders 5 star icons with filled/empty state based on the rating value.
 *
 * @param {Object} props
 * @param {number} props.rating - Current rating value (1–5).
 * @param {number} [props.size=14] - Star icon size in px.
 * @param {string} [props.activeColor='#f5a623'] - Color for filled stars.
 * @returns {React.ReactElement} The StarDisplay component.
 */
export const StarDisplay = ({ rating, size = 14, activeColor = '#f5a623' }) => (
  <div
    style={{ display: 'flex', gap: '3px' }}
    role="img"
    aria-label={`${rating} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          color: s <= Math.round(rating) ? activeColor : 'rgba(255,255,255,0.1)',
          fill: s <= Math.round(rating) ? activeColor : 'transparent',
        }}
      />
    ))}
  </div>
);

StarDisplay.propTypes = {
  /** Current rating value (1–5). */
  rating: PropTypes.number.isRequired,
  /** Star icon size in px. */
  size: PropTypes.number,
  /** Color for filled stars. */
  activeColor: PropTypes.string,
};

/**
 * StarInput — Interactive star rating input with keyboard support.
 * Renders 5 clickable star buttons with hover, click, and arrow-key
 * navigation for accessible rating selection.
 *
 * @param {Object} props
 * @param {number} props.rating - Current selected rating.
 * @param {number} props.hoveredStar - Currently hovered star (0 = none).
 * @param {Function} props.onRate - Callback when a star is clicked.
 * @param {Function} props.onHover - Callback on hover.
 * @param {Function} props.onLeave - Callback on mouse leave.
 * @param {number} [props.size=22] - Star icon size in px.
 * @returns {React.ReactElement} The StarInput component.
 */
export const StarInput = ({ rating, hoveredStar, onRate, onHover, onLeave, size = 22 }) => {
  const activeStarValue = hoveredStar || rating;

  const handleKeyDown = (e, starValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRate(starValue);
    } else if (e.key === 'ArrowRight' && starValue < 5) {
      e.preventDefault();
      onRate(starValue + 1);
    } else if (e.key === 'ArrowLeft' && starValue > 1) {
      e.preventDefault();
      onRate(starValue - 1);
    }
  };

  return (
    <div
      style={{ display: 'flex', gap: '4px' }}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map(s => {
        const isActive = activeStarValue >= s;
        const isSelected = rating >= s;
        return (
          <button
            key={s}
            onClick={() => onRate(s)}
            onMouseEnter={() => onHover(s)}
            onMouseLeave={onLeave}
            onKeyDown={(e) => handleKeyDown(e, s)}
            role="radio"
            aria-checked={rating === s}
            aria-label={`${s} star${s !== 1 ? 's' : ''}`}
            className={`end-star ${isSelected ? 'star-pop' : ''}`}
            style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', transition: '0.15s ease' }}
          >
            <Star style={{ width: `${size}px`, height: `${size}px`, color: isActive ? '#f5c518' : 'rgba(255,255,255,0.15)', fill: isActive ? '#f5c518' : 'transparent' }} />
          </button>
        );
      })}
    </div>
  );
};

StarInput.propTypes = {
  /** Currently selected rating value. */
  rating: PropTypes.number.isRequired,
  /** Star currently under the cursor (0 = none). */
  hoveredStar: PropTypes.number.isRequired,
  /** Click handler receiving the selected star value. */
  onRate: PropTypes.func.isRequired,
  /** Hover handler receiving the hovered star value. */
  onHover: PropTypes.func.isRequired,
  /** Mouse-leave handler to reset hover state. */
  onLeave: PropTypes.func.isRequired,
  /** Star icon size in px. */
  size: PropTypes.number,
};
