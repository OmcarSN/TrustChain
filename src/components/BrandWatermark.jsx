import React from 'react';
import TrustChainLogo from './TrustChainLogo';

import PropTypes from 'prop-types';

/**
 * BrandWatermark — Subtle brand presence on page backgrounds.
 * Renders the TrustChain logo as a ghosted, fixed-position watermark.
 *
 * @param {Object} props
 * @param {string} [props.position='bottom-right'] - Position preset.
 * @param {number} [props.opacity=0.03] - Watermark opacity.
 * @returns {React.ReactElement} The BrandWatermark component.
 */
const BrandWatermark = ({ position = 'bottom-right', opacity = 0.03 }) => {
  const positionStyles = {
    'bottom-right': { bottom: '40px', right: '40px' },
    'bottom-left': { bottom: '40px', left: '40px' },
    'top-right': { top: '120px', right: '40px' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  };

  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        ...positionStyles[position],
        opacity,
      }}
    >
      <TrustChainLogo size={200} />
    </div>
  );
};

export default BrandWatermark;

BrandWatermark.propTypes = {
  /** Position preset: 'bottom-right', 'bottom-left', 'top-right', or 'center'. */
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'center']),
  /** Watermark opacity (0–1). */
  opacity: PropTypes.number,
};
