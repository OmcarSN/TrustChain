import React from 'react';

/**
 * BlockchainBackground — Full-page blockchain hexagon network pattern
 * Renders as a fixed background layer covering the entire viewport.
 * Uses CSS background-repeat via an SVG pattern tile for seamless coverage.
 */
const BlockchainBackground = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="hexFade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#EA580C" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
          </linearGradient>

          {/* Repeating tile pattern */}
          <pattern id="hexPattern" x="0" y="0" width="700" height="450" patternUnits="userSpaceOnUse">
            {/* Network connecting lines */}
            <g stroke="#E5E7EB" strokeWidth="0.8" fill="none" opacity="0.45">
              <line x1="40" y1="90" x2="100" y2="60" />
              <line x1="100" y1="60" x2="170" y2="90" />
              <line x1="170" y1="90" x2="170" y2="150" />
              <line x1="100" y1="60" x2="100" y2="130" />
              <line x1="40" y1="90" x2="40" y2="160" />
              <line x1="40" y1="160" x2="100" y2="190" />
              <line x1="100" y1="190" x2="170" y2="150" />
              <line x1="170" y1="150" x2="240" y2="180" />
              <line x1="240" y1="180" x2="240" y2="110" />
              <line x1="240" y1="110" x2="170" y2="90" />
              <line x1="240" y1="110" x2="300" y2="80" />
              <line x1="300" y1="80" x2="360" y2="110" />
              <line x1="360" y1="110" x2="360" y2="180" />
              <line x1="300" y1="80" x2="300" y2="150" />
              <line x1="240" y1="180" x2="300" y2="210" />
              <line x1="300" y1="210" x2="360" y2="180" />
              <line x1="100" y1="130" x2="170" y2="150" />

              {/* Lower network */}
              <line x1="50" y1="250" x2="120" y2="220" />
              <line x1="120" y1="220" x2="190" y2="250" />
              <line x1="190" y1="250" x2="190" y2="310" />
              <line x1="120" y1="220" x2="120" y2="290" />
              <line x1="50" y1="250" x2="50" y2="320" />
              <line x1="120" y1="290" x2="190" y2="310" />
              <line x1="190" y1="250" x2="260" y2="280" />
              <line x1="260" y1="280" x2="260" y2="210" />
              <line x1="260" y1="210" x2="300" y2="150" />

              {/* Right side network */}
              <line x1="450" y1="50" x2="520" y2="80" />
              <line x1="520" y1="80" x2="520" y2="150" />
              <line x1="450" y1="50" x2="450" y2="120" />
              <line x1="450" y1="120" x2="520" y2="150" />
              <line x1="520" y1="150" x2="590" y2="120" />
              <line x1="590" y1="120" x2="590" y2="50" />
              <line x1="590" y1="50" x2="520" y2="80" />
              <line x1="520" y1="150" x2="520" y2="220" />
              <line x1="450" y1="120" x2="390" y2="150" />
              <line x1="390" y1="150" x2="390" y2="220" />

              {/* Bottom right */}
              <line x1="480" y1="280" x2="550" y2="310" />
              <line x1="550" y1="310" x2="620" y2="280" />
              <line x1="620" y1="280" x2="620" y2="350" />
              <line x1="550" y1="310" x2="550" y2="380" />
              <line x1="480" y1="280" x2="480" y2="350" />
              <line x1="480" y1="350" x2="550" y2="380" />
              <line x1="550" y1="380" x2="620" y2="350" />
            </g>

            {/* Hexagons */}
            <g fill="none" strokeWidth="1">
              <polygon points="100,50 130,35 160,50 160,80 130,95 100,80" stroke="#1E3A8A" strokeOpacity="0.07" fill="#1E3A8A" fillOpacity="0.015" />
              <polygon points="230,100 260,85 290,100 290,130 260,145 230,130" stroke="#EA580C" strokeOpacity="0.05" fill="#EA580C" fillOpacity="0.01" />
              <polygon points="60,200 90,185 120,200 120,230 90,245 60,230" stroke="#10B981" strokeOpacity="0.06" fill="#10B981" fillOpacity="0.015" />
              <polygon points="175,160 205,145 235,160 235,190 205,205 175,190" stroke="#1E3A8A" strokeOpacity="0.05" fill="url(#hexFade)" />
              <polygon points="300,70 330,55 360,70 360,100 330,115 300,100" stroke="#64748B" strokeOpacity="0.05" fill="#64748B" fillOpacity="0.008" />

              <polygon points="40,130 60,120 80,130 80,150 60,160 40,150" stroke="#EA580C" strokeOpacity="0.05" fill="#EA580C" fillOpacity="0.01" />
              <polygon points="150,240 170,230 190,240 190,260 170,270 150,260" stroke="#1E3A8A" strokeOpacity="0.04" fill="#1E3A8A" fillOpacity="0.008" />
              <polygon points="275,175 295,165 315,175 315,195 295,205 275,195" stroke="#10B981" strokeOpacity="0.05" fill="#10B981" fillOpacity="0.01" />
              <polygon points="350,140 370,130 390,140 390,160 370,170 350,160" stroke="#64748B" strokeOpacity="0.04" fill="none" />
              <polygon points="80,275 100,265 120,275 120,295 100,305 80,295" stroke="#EA580C" strokeOpacity="0.04" fill="#EA580C" fillOpacity="0.015" />

              {/* Right area */}
              <polygon points="470,60 500,45 530,60 530,90 500,105 470,90" stroke="#1E3A8A" strokeOpacity="0.05" fill="#1E3A8A" fillOpacity="0.01" />
              <polygon points="540,110 570,95 600,110 600,140 570,155 540,140" stroke="#EA580C" strokeOpacity="0.04" fill="#EA580C" fillOpacity="0.008" />
              <polygon points="425,150 455,135 485,150 485,180 455,195 425,180" stroke="#10B981" strokeOpacity="0.05" fill="#10B981" fillOpacity="0.01" />
              <polygon points="500,270 530,255 560,270 560,300 530,315 500,300" stroke="#1E3A8A" strokeOpacity="0.04" fill="#1E3A8A" fillOpacity="0.008" />
              <polygon points="600,320 630,305 660,320 660,350 630,365 600,350" stroke="#10B981" strokeOpacity="0.04" fill="#10B981" fillOpacity="0.01" />
            </g>

            {/* Network nodes */}
            <g>
              <circle cx="100" cy="60" r="3.5" fill="#1E3A8A" opacity="0.1" />
              <circle cx="170" cy="90" r="2.5" fill="#64748B" opacity="0.08" />
              <circle cx="40" cy="90" r="3" fill="#EA580C" opacity="0.08" />
              <circle cx="240" cy="110" r="2.5" fill="#10B981" opacity="0.08" />
              <circle cx="300" cy="80" r="3.5" fill="#1E3A8A" opacity="0.07" />
              <circle cx="360" cy="110" r="2.5" fill="#EA580C" opacity="0.07" />
              <circle cx="100" cy="130" r="2" fill="#10B981" opacity="0.08" />
              <circle cx="170" cy="150" r="3" fill="#1E3A8A" opacity="0.08" />
              <circle cx="240" cy="180" r="2.5" fill="#64748B" opacity="0.07" />
              <circle cx="300" cy="150" r="2" fill="#EA580C" opacity="0.07" />

              <circle cx="120" cy="220" r="3" fill="#1E3A8A" opacity="0.08" />
              <circle cx="50" cy="250" r="2.5" fill="#EA580C" opacity="0.07" />
              <circle cx="190" cy="250" r="2" fill="#10B981" opacity="0.08" />
              <circle cx="260" cy="210" r="2.5" fill="#64748B" opacity="0.07" />

              <circle cx="450" cy="50" r="3" fill="#EA580C" opacity="0.08" />
              <circle cx="520" cy="80" r="3.5" fill="#1E3A8A" opacity="0.08" />
              <circle cx="590" cy="120" r="2.5" fill="#10B981" opacity="0.07" />
              <circle cx="450" cy="120" r="2.5" fill="#64748B" opacity="0.08" />
              <circle cx="520" cy="150" r="3" fill="#EA580C" opacity="0.07" />

              <circle cx="550" cy="310" r="3" fill="#1E3A8A" opacity="0.07" />
              <circle cx="480" cy="280" r="2.5" fill="#10B981" opacity="0.08" />
              <circle cx="620" cy="280" r="2" fill="#EA580C" opacity="0.07" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
    </div>
  );
};

export default BlockchainBackground;
