import React from 'react';
import PropTypes from 'prop-types';
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

TrustChainLogo.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['full', 'icon']),
  style: PropTypes.object,
};

TrustChainLogo.defaultProps = {
  size: 40,
  className: '',
  variant: 'full',
  style: {},
};

export default TrustChainLogo;
