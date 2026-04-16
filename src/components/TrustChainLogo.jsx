import React from 'react';

const TrustChainLogo = ({ size = 180 }) => {
  return (
    <svg 
      width={size} 
      viewBox="0 0 350 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
            .wordmark {
              font-family: 'Space Grotesk', sans-serif;
            }
          `}
        </style>
      </defs>

      {/* Navy Shield */}
      <path 
        d="M 45 18 L 18 28 L 18 55 C 18 78 35 90 45 95 C 55 90 72 78 72 55 L 72 28 Z" 
        fill="none" 
        stroke="#1E3A5F" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Orange Handshake Motif */}
      <g 
        transform="translate(27, 36) scale(1.5)" 
        fill="none" 
        stroke="#E8821A" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </g>

      {/* Wordmark */}
      <text 
        x="95" 
        y="65" 
        className="wordmark" 
        fontSize="48" 
        fill="#1A1A2E" 
        fontWeight="700"
      >
        Trust<tspan fill="#E8821A" fontWeight="600">Chain</tspan>
      </text>

      {/* Tagline */}
      <text 
        x="98" 
        y="85" 
        className="wordmark" 
        fontSize="11" 
        fill="#6B7280" 
        fontWeight="600" 
        letterSpacing="0.25em"
      >
        VERIFIED ECONOMY
      </text>
    </svg>
  );
};

export default TrustChainLogo;
