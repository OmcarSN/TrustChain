import React from 'react';
import TrustChainLogo from './TrustChainLogo';

/**
 * BrandWatermark — Subtle brand presence on page backgrounds
 * Shows the logo as a ghosted watermark
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
