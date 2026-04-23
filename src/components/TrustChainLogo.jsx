import React from 'react';
import logoSrc from '../assets/trustchain-logo.png';

/**
 * TrustChainLogo — Official TrustChain brand logo
 * 
 * Design: Orange-red circle with black 8-pointed star/compass,
 *         "TRUSTCHAIN" arched text, and signature swoosh.
 * 
 * Uses the original brand logo image file with transparent/light background.
 */
const TrustChainLogo = ({ size = 40, className = '', variant = 'full', style = {} }) => {
  return (
    <img
      src={logoSrc}
      alt="TrustChain Logo"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        borderRadius: variant === 'icon' ? '8px' : '0',
        ...style
      }}
      draggable={false}
    />
  );
};

export default TrustChainLogo;
