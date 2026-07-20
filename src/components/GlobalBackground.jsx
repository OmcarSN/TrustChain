import React from 'react';

/**
 * GlobalBackground — Animated global background layer.
 * Renders a drifting grid, slow "aurora" gradient blobs (indigo-dominant
 * with one sparing warm-amber accent), floating particle dots, and a noise
 * overlay. All elements are fixed-positioned, non-interactive, and z-index 0.
 *
 * Performance: every animation drives only `transform` / `opacity`, so the
 * compositor handles them on the GPU without triggering layout or paint.
 * Motion is fully disabled under `prefers-reduced-motion: reduce`.
 *
 * @returns {React.ReactElement} The GlobalBackground component.
 */

// Deterministic particle field (no runtime randomness — keeps SSR/build stable).
const PARTICLES = [
  { left: '8%',  size: 3, delay: '0s',   dur: '22s', drift: '14px' },
  { left: '18%', size: 2, delay: '-6s',  dur: '28s', drift: '-10px' },
  { left: '27%', size: 4, delay: '-12s', dur: '19s', drift: '20px' },
  { left: '39%', size: 2, delay: '-3s',  dur: '26s', drift: '-16px' },
  { left: '48%', size: 3, delay: '-9s',  dur: '24s', drift: '12px' },
  { left: '58%', size: 2, delay: '-15s', dur: '30s', drift: '-8px' },
  { left: '67%', size: 3, delay: '-2s',  dur: '21s', drift: '18px' },
  { left: '76%', size: 4, delay: '-11s', dur: '27s', drift: '-14px' },
  { left: '85%', size: 2, delay: '-7s',  dur: '23s', drift: '10px' },
  { left: '93%', size: 3, delay: '-17s', dur: '29s', drift: '-18px' },
];

const GlobalBackground = () => {
  return (
    <>
      {/* Drifting grid — oversized + transform-animated to avoid full-viewport repaints */}
      <div className="gb-layer gb-grid" />

      {/* Slow aurora gradient blobs (indigo-dominant, one warm-amber accent) */}
      <div className="gb-layer gb-aurora gb-aurora-1" />
      <div className="gb-layer gb-aurora gb-aurora-2" />
      <div className="gb-layer gb-aurora gb-aurora-3" />

      {/* Floating particle field */}
      <div className="gb-layer gb-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="gb-particle"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              // custom props consumed by the keyframes
              ['--drift']: p.drift,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      <style>{`
        .gb-layer { position: fixed; pointer-events: none; z-index: 0; }

        /* ── Grid ─────────────────────────────────────────────── */
        .gb-grid {
          top: -40px; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          will-change: transform;
          animation: gbGridMove 20s linear infinite;
        }

        /* ── Aurora blobs ─────────────────────────────────────── */
        .gb-aurora {
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform, opacity;
        }
        .gb-aurora-1 {
          top: -220px; right: -180px; width: 620px; height: 620px;
          background: radial-gradient(circle, rgba(79,107,237,0.20) 0%, transparent 70%);
          animation: gbAurora1 24s ease-in-out infinite alternate;
        }
        .gb-aurora-2 {
          bottom: -180px; left: -160px; width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(124,147,242,0.14) 0%, transparent 70%);
          animation: gbAurora2 30s ease-in-out infinite alternate-reverse;
        }
        /* Warm accent — used sparingly (~one blob), lower opacity so indigo stays dominant */
        .gb-aurora-3 {
          top: 38%; left: 42%; width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(232,160,76,0.10) 0%, transparent 70%);
          animation: gbAurora3 34s ease-in-out infinite alternate;
        }

        /* ── Particles ────────────────────────────────────────── */
        .gb-particles { inset: 0; overflow: hidden; }
        .gb-particle {
          position: absolute;
          bottom: -10px;
          border-radius: 50%;
          background: rgba(124,147,242,0.5);
          box-shadow: 0 0 6px rgba(124,147,242,0.4);
          will-change: transform, opacity;
          animation-name: gbRise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes gbGridMove {
          0%   { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes gbAurora1 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.9; }
          50%  { transform: translate(-40px, 30px) scale(1.08); opacity: 1; }
          100% { transform: translate(30px, -20px) scale(0.96); opacity: 0.85; }
        }
        @keyframes gbAurora2 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.85; }
          50%  { transform: translate(50px, -30px) scale(1.12); opacity: 1; }
          100% { transform: translate(-30px, 40px) scale(0.92); opacity: 0.8; }
        }
        @keyframes gbAurora3 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50%  { transform: translate(-30px, -30px) scale(1.1); opacity: 0.95; }
          100% { transform: translate(20px, 30px) scale(0.9); opacity: 0.65; }
        }
        /* Rise from bottom to top, gently fading in and out */
        @keyframes gbRise {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate3d(var(--drift, 0), -100vh, 0); opacity: 0; }
        }

        /* Respect users who prefer less motion */
        @media (prefers-reduced-motion: reduce) {
          .gb-grid,
          .gb-aurora,
          .gb-particle { animation: none !important; }
          .gb-particles { display: none; }
        }
      `}</style>
    </>
  );
};

export default GlobalBackground;
