import React from 'react';
import PropTypes from 'prop-types';

/**
 * TrustChainLogo — Enhanced high-definition TrustChain brand logo
 * Displays the authentic blue radial geometric starburst emblem
 * in pixel-perfect ultra-high resolution.
 *
 * @param {Object} props
 * @param {number} [props.size=34] - Dimensions in pixels.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {Object} [props.style={}] - Additional inline styles.
 * @returns {React.ReactElement} The TrustChainLogo component.
 */
const TrustChainLogo = ({ size = 34, className = '', style = {}, animated = true }) => {
  return (
    <img
      src="/blue-logo.png"
      alt="TrustChain Logo"
      width={size}
      height={size}
      loading="eager"
      decoding="async"
      className={`object-contain flex-shrink-0 select-none drop-shadow-sm ${animated ? 'tc-logo-spin' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: 'auto',
        ...style,
      }}
    />
  );
};

TrustChainLogo.propTypes = {
  /** Logo width and height in pixels. */
  size: PropTypes.number,
  /** Additional CSS class names. */
  className: PropTypes.string,
  /** Inline style overrides. */
  style: PropTypes.object,
  /** Whether to enable continuous slow rotation animation. */
  animated: PropTypes.bool,
};

TrustChainLogo.defaultProps = {
  size: 34,
  className: '',
  style: {},
  animated: true,
};

export default TrustChainLogo;
