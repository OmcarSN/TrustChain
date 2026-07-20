import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * HeroSection — Landing page above-the-fold hero.
 * Renders animated headline text with shimmer gradients, ghost subtitle,
 * hero CTA buttons (Worker/Find Workers), background grid, corner brackets,
 * and animated network visualization.
 *
 * @param {Object} props
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The HeroSection component.
 */
const HeroSection = ({ t }) => (
  <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#05060A', overflow: 'hidden' }}>
    <style>{`
      @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slowRotate { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
      @keyframes heroPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      @keyframes heroFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      /* Mesh drift runs on the compositor (transform only) so it never repaints
         the full viewport — smooth, and cheap to re-scale on browser zoom. */
      @keyframes meshDrift { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-25%, -25%, 0); } }
      .hero-mesh {
        position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; z-index: 1;
        pointer-events: none;
        background: linear-gradient(-45deg, #05060A, #0b1024, #0E1017, #131634, #05060A);
        will-change: transform; transform: translateZ(0); backface-visibility: hidden;
        animation: meshDrift 26s ease-in-out infinite alternate;
      }
      @keyframes bubblePop { 0% { opacity: 0; transform: scale(0.7) translateY(8px); } 60% { transform: scale(1.04); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
      /* Wrapper owns the gentle float (transform); the bubble owns the pop-in —
         separate elements so the two transforms never fight, keeping both smooth. */
      .hero-bubble-wrap { position: absolute; z-index: 12; pointer-events: none; will-change: transform; }
      .hero-bubble {
        position: relative; white-space: nowrap;
        background: linear-gradient(135deg, rgba(28,30,48,0.95), rgba(18,20,34,0.95));
        border: 1px solid rgba(124,147,242,0.35);
        color: #fff; font-weight: 700; font-size: 12px; letter-spacing: 0.01em;
        padding: 9px 14px; border-radius: 14px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03) inset;
        transform-origin: bottom center; opacity: 0;
        will-change: transform, opacity; backface-visibility: hidden;
      }
      /* little pointer tail under each bubble */
      .hero-bubble::after {
        content: ''; position: absolute; bottom: -7px; left: 24px;
        width: 14px; height: 14px; background: inherit;
        border-right: 1px solid rgba(124,147,242,0.35); border-bottom: 1px solid rgba(124,147,242,0.35);
        transform: rotate(45deg); border-bottom-right-radius: 3px;
      }
      .hero-bubble .hero-bubble-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 7px; vertical-align: middle; }
      /* Desktop bubble positions (kept inside the image box so nothing clips). */
      .hero-bubble-tl { top: -6%; left: 2%; }
      .hero-bubble-tr { top: -8%; right: 2%; }
      .hero-bubble-bl { top: 4%;  left: -6%; }
      .hero-bubble-br { top: 6%;  right: -4%; }
      /* Mobile: image is small, so shrink bubbles, tuck them fully inside the
         frame (no negative offsets → no clipping), and let text wrap. */
      @media (max-width: 767px) {
        .hero-bubble { font-size: 9px; padding: 5px 8px; border-radius: 10px; white-space: normal; max-width: 42vw; line-height: 1.25; }
        .hero-bubble::after { bottom: -5px; left: 16px; width: 10px; height: 10px; }
        .hero-bubble-tl { top: -2%; left: 0; }
        .hero-bubble-tr { top: 0%;  right: 0; }
        .hero-bubble-bl { top: 22%; left: 0; }
        .hero-bubble-br { top: 26%; right: 0; }
      }
      /* Very small phones: only keep the two top bubbles to avoid crowding. */
      @media (max-width: 400px) {
        .hero-bubble { font-size: 8px; max-width: 40vw; }
        .hero-bubble-bl, .hero-bubble-br { display: none; }
      }
      /* Kill motion (and its repaint cost) for users who ask for reduced motion. */
      @media (prefers-reduced-motion: reduce) {
        .hero-mesh, .hero-bubble-wrap, .hero-bubble { animation: none !important; }
        .hero-bubble { opacity: 1 !important; }
      }
      .hero-inner { display: flex; flex-direction: column; justify-content: center; min-height: 100vh; padding: 100px 24px 40px 24px; overflow: hidden; position: relative; z-index: 10; width: 100%; max-width: 1400px; margin: 0 auto; }
      .hero-left { width: 100%; max-width: 720px; overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; }
      .hero-right { display: flex; width: 100%; justify-content: center; align-items: flex-end; margin-top: 40px; margin-bottom: -40px; }
      .hero-image { width: 100%; max-height: 45vh; object-fit: contain; object-position: bottom center; }
      .hero-badge { margin-bottom: 24px; }
      .hero-headline-block { margin-bottom: 12px; }
      .hero-subtext { margin-bottom: 40px; line-height: 1.7; }
      .hero-cta-row { gap: 16px; align-items: center; }
      .hero-headline { font-size: clamp(34px, 8.5vw, 54px); white-space: normal; overflow-wrap: break-word; word-break: normal; overflow: visible; line-height: 1.1; max-width: 100%; }
      .hero-ghost { font-size: clamp(26px, 7.5vw, 48px); white-space: normal; overflow-wrap: break-word; word-break: normal; overflow: visible; margin-bottom: 28px; max-width: 100%; }
      @media (min-width: 768px) {
        .hero-inner { padding: 120px 40px 60px 80px; flex-direction: row; align-items: center; justify-content: space-between; gap: 32px; overflow: visible; }
        .hero-left { flex: 1 1 auto; min-width: 0; }
        .hero-right { display: flex; flex: 0 1 340px; min-width: 0; align-items: flex-end; justify-content: flex-end; overflow: visible; margin-bottom: -60px; margin-top: 0; }
        .hero-image { max-height: 95vh; }
        /* Fluid sizing tied to the narrower left column so the phrases stay
           on one line on wide screens but wrap (never crop) when space is tight. */
        .hero-headline { font-size: clamp(30px, 3.8vw, 64px); white-space: normal; }
        .hero-ghost { font-size: clamp(26px, 3.4vw, 58px); white-space: normal; }
      }
      @media (min-width: 1024px) {
        .hero-right { flex: 0 1 450px; }
      }
      @media (min-width: 1280px) {
        .hero-right { flex: 0 1 540px; }
      }
    `}</style>

    {/* Animated Mesh Gradient Background (compositor-only transform drift) */}
    <div className="hero-mesh" />

    {/* Animated SVG Network Background */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, opacity: 0.12 }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4F6BED" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4F6BED" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F6BED" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#7C93F2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4F6BED" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Network Lines */}
      {[[200,300,500,200],[500,200,800,350],[800,350,1050,250],[300,500,600,450],[600,450,900,550],[200,300,300,500],[500,200,600,450],[800,350,900,550]].map(([x1,y1,x2,y2], i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth="1" opacity="0.3" />
      ))}
      {/* Network Nodes */}
      {[[200,300],[500,200],[800,350],[1050,250],[300,500],[600,450],[900,550],[400,150],[700,500],[150,600]].map(([cx,cy], i) => (
        <g key={`n${i}`}>
          <circle cx={cx} cy={cy} r="15" fill="url(#nodeGlow)" />
          <circle cx={cx} cy={cy} r="3" fill="#4F6BED" opacity="0.8" />
        </g>
      ))}
    </svg>

    {/* Gradient Glow Orbs */}
    <div style={{ position: 'absolute', top: '15%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,76,0.10) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 3, willChange: 'transform', animation: 'heroFloat 8s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,107,237,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 3, willChange: 'transform', animation: 'heroFloat 10s ease-in-out infinite 2s' }} />
    <div style={{ position: 'absolute', top: '50%', right: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,147,242,0.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 3, willChange: 'transform', animation: 'heroFloat 12s ease-in-out infinite 4s' }} />

    {/* Grid Pattern Overlay */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

    {/* Corner Brackets */}
    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '32px', height: '32px', borderTop: '2px solid rgba(79,107,237,0.35)', borderLeft: '2px solid rgba(79,107,237,0.35)', pointerEvents: 'none', zIndex: 15 }} />
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '32px', height: '32px', borderBottom: '2px solid rgba(79,107,237,0.35)', borderRight: '2px solid rgba(79,107,237,0.35)', pointerEvents: 'none', zIndex: 15 }} />
    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderTop: '2px solid rgba(124,147,242,0.2)', borderRight: '2px solid rgba(124,147,242,0.2)', pointerEvents: 'none', zIndex: 15 }} />
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '32px', height: '32px', borderBottom: '2px solid rgba(124,147,242,0.2)', borderLeft: '2px solid rgba(124,147,242,0.2)', pointerEvents: 'none', zIndex: 15 }} />

    {/* Slowly Rotating Logo Watermark removed per request */}

    <div className="hero-inner">
      <div className="hero-left justify-center">
        <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          {/* Badge */}
          <div className="font-inter hero-badge" style={{
            color: '#7C93F2', fontWeight: '700', textTransform: 'uppercase',
            fontSize: '11px', letterSpacing: '0.2em',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(79, 107, 237, 0.08)', border: '1px solid rgba(79, 107, 237, 0.22)',
            padding: '8px 16px', borderRadius: '100px',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 8px rgba(22,163,74,0.6)', animation: 'heroPulse 2s ease-in-out infinite' }} />
            {t('landing.hero_badge', 'LIVE ON STELLAR MAINNET')}
          </div>

          {/* Headlines */}
          <div className="hero-headline-block">
            <div className="font-clash hero-line-1 hero-headline font-black" style={{ fontWeight: '900', letterSpacing: '0.04em', marginBottom: '0', wordBreak: 'break-word' }}>
              <span>{t('landing.titleLine1')}</span>
            </div>
            <div className="font-clash hero-line-2 hero-headline font-black" style={{ fontWeight: '900', letterSpacing: '0.04em', marginBottom: '0', wordBreak: 'break-word' }}>
              {t('landing.titleLine2')}
            </div>
          </div>
          <div className="font-clash hero-line-3 hero-ghost font-black" style={{ fontWeight: '900', letterSpacing: '0.04em', lineHeight: '1.05', wordBreak: 'break-word', color: 'rgba(255,255,255,0.15)' }}>
            {t('landing.titleLine3')}
          </div>

          {/* Subtext */}
          <p className="font-inter hero-subtext" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '400', letterSpacing: '0.02em', maxWidth: '540px', animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '0.5s' }}>
            {t('landing.hero_subtext', 'Decentralized credentials for informal economy workers — verified on Stellar blockchain.')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row flex-nowrap w-full sm:w-auto overflow-x-auto sm:overflow-visible hero-cta-row" style={{ position: 'relative', zIndex: 10, opacity: 0, animation: 'fadeSlideUp 0.6s ease forwards', animationDelay: '0.6s', paddingBottom: '32px' }}>
          <Link to="/worker" className="btn-glow font-inter" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center', whiteSpace: 'nowrap' }}>
            {t('landing.hero_cta_worker', "I'M A WORKER")} <span style={{ transition: 'transform 0.2s' }}>→</span>
          </Link>
          <Link to="/discover" className="btn-outline-glow font-inter" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '140px', whiteSpace: 'nowrap' }}>
            {t('landing.hero_cta_find', 'FIND WORKERS')}
          </Link>
        </div>

        {/* Floating Stats Pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap',
          background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '100px', padding: '10px 16px', zIndex: 10, maxWidth: '100%', overflowX: 'auto',
          opacity: 0, animation: 'fadeSlideUp 0.8s ease forwards', animationDelay: '0.8s',
        }} className="no-scrollbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F6BED', flexShrink: 0 }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GASLESS</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C93F2', flexShrink: 0 }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>SOULBOUND</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>ON-CHAIN</span>
          </div>
        </div>
      </div>

      {/* Hero Illustration — Right Side */}
      <div className="hero-right" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(232,160,76,0.15) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '1024px', textAlign: 'center', zIndex: 1 }}>
          <img src="/hero-workers.webp" alt="Diverse workers" className="hero-image" width={1024} height={1024} decoding="async" fetchPriority="high" style={{
            opacity: 0, animation: 'fadeSlideUp 1s ease forwards', animationDelay: '0.4s',
            margin: '0 auto', display: 'block'
          }} />

          {/* Speech Bubbles — workers talking to the visitor, sitting above their heads.
              Wrapper floats, inner pops in — separate transforms so both stay smooth. */}
          <div className="hero-bubble-wrap hero-bubble-tl" style={{ animation: 'heroFloat 6s ease-in-out infinite 1.8s' }}>
            <div className="hero-bubble" style={{ animation: 'bubblePop 0.5s cubic-bezier(0.22,1,0.36,1) forwards 1.3s' }}>
              <span className="hero-bubble-dot" style={{ background: '#4F6BED', boxShadow: '0 0 8px rgba(79,107,237,0.7)' }} />
              {t('landing.hero_bubble_1', 'Hire me with confidence!')}
            </div>
          </div>
          <div className="hero-bubble-wrap hero-bubble-tr" style={{ animation: 'heroFloat 7s ease-in-out infinite 2s' }}>
            <div className="hero-bubble" style={{ animation: 'bubblePop 0.5s cubic-bezier(0.22,1,0.36,1) forwards 1.55s' }}>
              <span className="hero-bubble-dot" style={{ background: '#16A34A', boxShadow: '0 0 8px rgba(22,163,74,0.7)' }} />
              {t('landing.hero_bubble_2', 'My skills are verified.')}
            </div>
          </div>
          <div className="hero-bubble-wrap hero-bubble-bl" style={{ animation: 'heroFloat 6.5s ease-in-out infinite 1.5s' }}>
            <div className="hero-bubble" style={{ animation: 'bubblePop 0.5s cubic-bezier(0.22,1,0.36,1) forwards 1.8s' }}>
              <span className="hero-bubble-dot" style={{ background: '#E8A04C', boxShadow: '0 0 8px rgba(232,160,76,0.7)' }} />
              {t('landing.hero_bubble_3', 'Reputation you can trust.')}
            </div>
          </div>
          <div className="hero-bubble-wrap hero-bubble-br" style={{ animation: 'heroFloat 7.5s ease-in-out infinite 2.4s' }}>
            <div className="hero-bubble" style={{ animation: 'bubblePop 0.5s cubic-bezier(0.22,1,0.36,1) forwards 2.05s' }}>
              <span className="hero-bubble-dot" style={{ background: '#7C93F2', boxShadow: '0 0 8px rgba(124,147,242,0.7)' }} />
              {t('landing.hero_bubble_4', 'Proof lives on-chain.')}
            </div>
          </div>

          {/* Floating UI Elements removed per request */}
        </div>
      </div>
    </div>
  </section>
);

HeroSection.propTypes = {
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default HeroSection;
