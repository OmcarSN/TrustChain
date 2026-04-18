import React from 'react';
import logoImage from '../assets/trustchain-logo.png';

/**
 * TrustChainLogo — Custom brand logo for TrustChain
 * Uses the official handshake logo image  
 * Properly cropped to remove gray padding
 */
const TrustChainLogo = ({ size = 180, variant = 'full', className = '', dark = false }) => {
  const cropScale = 145;

  // Icon-only — just the rounded logo mark at a proper visible size
  if (variant === 'icon') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.2,
          overflow: 'hidden',
          position: 'relative',
          background: '#0A1628',
          flexShrink: 0,
        }}
      >
        <img
          src={logoImage}
          alt="TrustChain"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${cropScale}%`,
            height: `${cropScale}%`,
            objectFit: 'cover',
          }}
        />
      </div>
    );
  }

  // Full logo — bigger mark + wordmark
  const markSize = Math.max(size * 0.32, 40);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        style={{
          width: markSize,
          height: markSize,
          minWidth: markSize,
          borderRadius: markSize * 0.22,
          overflow: 'hidden',
          position: 'relative',
          background: '#0A1628',
          flexShrink: 0,
          boxShadow: '0 2px 8px -2px rgba(10,22,40,0.25)',
        }}
      >
        <img
          src={logoImage}
          alt="TrustChain"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${cropScale}%`,
            height: `${cropScale}%`,
            objectFit: 'cover',
          }}
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: Math.max(size * 0.14, 18),
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: dark ? '#F1F5F9' : '#111827',
            lineHeight: 1.15,
          }}
        >
          Trust<span style={{ color: '#EA580C' }}>Chain</span>
        </span>
        <span
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: Math.max(size * 0.048, 7),
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: dark ? '#64748B' : '#9CA3AF',
            lineHeight: 1.6,
          }}
        >
          SINCE 2026
        </span>
      </div>
    </div>
  );
};

export default TrustChainLogo;
