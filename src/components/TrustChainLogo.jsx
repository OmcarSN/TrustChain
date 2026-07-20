import React from 'react';
import PropTypes from 'prop-types';
import logoSrc from '../assets/blue-logo.png.png';

/**
 * TrustChainLogo — Official TrustChain brand logo component.
 * Renders the brand PNG at a configurable size with icon/full variants.
 *
 * @param {Object} props
 * @param {number} [props.size=40] - Logo width and height in px.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {'full'|'icon'} [props.variant='full'] - Logo variant.
 * @param {Object} [props.style={}] - Additional inline styles.
 * @returns {React.ReactElement} The TrustChainLogo component.
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
  /** Logo width and height in px. */
  size: PropTypes.number,
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Logo variant: 'full' or 'icon'. */
  variant: PropTypes.oneOf(['full', 'icon']),
  /** Additional inline styles. */
  style: PropTypes.object,
};

TrustChainLogo.defaultProps = {
  size: 40,
  className: '',
  variant: 'full',
  style: {},
};

export default TrustChainLogo;
