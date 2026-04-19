import React from 'react';

/**
 * TrustChainLogo — Original hand-crafted SVG brand logo
 * 
 * Design: Shield silhouette with interlocking chain links and a verification checkmark.
 * Colors: Purple gradient matching the TrustChain brand (#7c3aed → #a855f7)
 * 
 * This is a 100% original, code-generated SVG — no external images or stock assets.
 */
const TrustChainLogo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TrustChain Logo"
    >
      <defs>
        {/* Main purple gradient */}
        <linearGradient id="tc-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Shield fill gradient */}
        <linearGradient id="tc-grad-shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
        </linearGradient>

        {/* Glow effect */}
        <radialGradient id="tc-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>

        {/* Chain link gradient */}
        <linearGradient id="tc-chain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>

        {/* Checkmark gradient */}
        <linearGradient id="tc-check" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="64" height="64" rx="16" fill="url(#tc-grad-main)" />
      
      {/* Inner glow */}
      <rect width="64" height="64" rx="16" fill="url(#tc-glow)" />

      {/* Shield body */}
      <path
        d="M32 8L12 18V30C12 44 21 52 32 56C43 52 52 44 52 30V18L32 8Z"
        fill="url(#tc-grad-shield)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Inner shield highlight */}
      <path
        d="M32 12L16 20V30C16 41 23 48 32 52C41 48 48 41 48 30V20L32 12Z"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Left chain link (rounded rectangle rotated) */}
      <rect
        x="19" y="24" width="14" height="8" rx="4"
        fill="none"
        stroke="url(#tc-chain)"
        strokeWidth="2.2"
      />

      {/* Right chain link (overlapping) */}
      <rect
        x="31" y="24" width="14" height="8" rx="4"
        fill="none"
        stroke="url(#tc-chain)"
        strokeWidth="2.2"
      />

      {/* Verification checkmark below chain */}
      <path
        d="M24 38L29 43L40 32"
        fill="none"
        stroke="url(#tc-check)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top shield keystone accent dot */}
      <circle cx="32" cy="12.5" r="1.5" fill="white" opacity="0.6" />

      {/* Corner accent dots for premium feel */}
      <circle cx="20" cy="46" r="1" fill="white" opacity="0.1" />
      <circle cx="44" cy="46" r="1" fill="white" opacity="0.1" />
    </svg>
  );
};

export default TrustChainLogo;
