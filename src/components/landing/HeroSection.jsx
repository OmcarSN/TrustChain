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
      @keyframes meshShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .hero-inner { display: flex; flex-direction: column; justify-content: center; min-height: 100vh; padding: 100px 24px 40px 24px; overflow: hidden; position: relative; z-index: 10; width: 100%; max-width: 1400px; margin: 0 auto; }
      .hero-left { width: 100%; max-width: 720px; overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; }
      .hero-right { display: flex; width: 100%; justify-content: center; align-items: flex-end; margin-top: 40px; margin-bottom: -40px; }
      .hero-image { width: 100%; max-height: 45vh; object-fit: contain; object-position: bottom center; }
      .hero-badge { margin-bottom: 24px; }
      .hero-headline-block { margin-bottom: 12px; }
      .hero-subtext { margin-bottom: 40px; line-height: 1.7; }
      .hero-cta-row { gap: 16px; align-items: center; }
      .hero-headline { font-size: clamp(36px, 9vw, 56px); white-space: normal; overflow: visible; line-height: 1.1; }
      .hero-ghost { font-size: clamp(28px, 8vw, 50px); white-space: normal; overflow: visible; margin-bottom: 28px; }
      @media (min-width: 768px) {
        .hero-inner { padding: 120px 40px 60px 80px; flex-direction: row; align-items: center; justify-content: space-between; gap: 24px; overflow: visible; }
        .hero-left { flex: 1; min-width: 0; }
        .hero-right { display: flex; flex: 0 0 340px; align-items: flex-end; justify-content: flex-end; overflow: visible; margin-bottom: -60px; margin-top: 0; }
        .hero-image { max-height: 95vh; }
        .hero-headline { font-size: clamp(32px, 4.5vw, 72px); white-space: nowrap; }
        .hero-ghost { font-size: clamp(28px, 4vw, 64px); white-space: nowrap; }
      }
      @media (min-width: 1024px) {
        .hero-right { flex: 0 0 450px; }
      }
      @media (min-width: 1280px) {
        .hero-right { flex: 0 0 540px; }
      }
    `}</style>

    {/* Animated Mesh Gradient Background */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
      background: 'linear-gradient(-45deg, #05060A, #0b1024, #0E1017, #131634, #05060A)',
      backgroundSize: '400% 400%',
      animation: 'meshShift 15s ease infinite',
    }} />

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
      {[[200,300,500,200,'4s'],[500,200,800,350,'5s'],[800,350,1050,250,'6s'],[300,500,600,450,'4.5s'],[600,450,900,550,'5.5s'],[200,300,300,500,'3.5s'],[500,200,600,450,'4s'],[800,350,900,550,'5s']].map(([x1,y1,x2,y2,dur], i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.15;0.6;0.15" dur={dur} repeatCount="indefinite" />
        </line>
      ))}
      {/* Network Nodes */}
      {[[200,300],[500,200],[800,350],[1050,250],[300,500],[600,450],[900,550],[400,150],[700,500],[150,600]].map(([cx,cy], i) => (
        <g key={`n${i}`}>
          <circle cx={cx} cy={cy} r="20" fill="url(#nodeGlow)">
            <animate attributeName="r" values="15;25;15" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="3" fill="#4F6BED" opacity="0.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>

    {/* Gradient Glow Orbs */}
    <div style={{ position: 'absolute', top: '15%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,107,237,0.10) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 3, filter: 'blur(40px)', animation: 'heroFloat 8s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,107,237,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 3, animation: 'heroFloat 10s ease-in-out infinite 2s' }} />
    <div style={{ position: 'absolute', top: '50%', right: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,147,242,0.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 3, animation: 'heroFloat 12s ease-in-out infinite 4s' }} />

    {/* Grid Pattern Overlay */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

    {/* Corner Brackets */}
    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '32px', height: '32px', borderTop: '2px solid rgba(79,107,237,0.35)', borderLeft: '2px solid rgba(79,107,237,0.35)', pointerEvents: 'none', zIndex: 15 }} />
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '32px', height: '32px', borderBottom: '2px solid rgba(79,107,237,0.35)', borderRight: '2px solid rgba(79,107,237,0.35)', pointerEvents: 'none', zIndex: 15 }} />
    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderTop: '2px solid rgba(124,147,242,0.2)', borderRight: '2px solid rgba(124,147,242,0.2)', pointerEvents: 'none', zIndex: 15 }} />
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '32px', height: '32px', borderBottom: '2px solid rgba(124,147,242,0.2)', borderLeft: '2px solid rgba(124,147,242,0.2)', pointerEvents: 'none', zIndex: 15 }} />

    {/* Slowly Rotating Logo Watermark */}
    <img src="/trustchain-logo.png" alt="" style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '420px', height: '420px', opacity: 0.04, zIndex: 5, filter: 'invert(1)', pointerEvents: 'none', userSelect: 'none', mixBlendMode: 'screen', animation: 'slowRotate 60s linear infinite' }} />

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
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '100px', padding: '10px 16px', zIndex: 10, maxWidth: '100%', overflowX: 'auto',
          backdropFilter: 'blur(8px)',
          opacity: 0, animation: 'fadeSlideUp 0.8s ease forwards', animationDelay: '0.8s',
        }} className="no-scrollbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F6BED', boxShadow: '0 0 6px rgba(79,107,237,0.5)', flexShrink: 0 }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GASLESS</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C93F2', boxShadow: '0 0 6px rgba(124,147,242,0.5)', flexShrink: 0 }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>SOULBOUND</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 6px rgba(22,163,74,0.5)', flexShrink: 0 }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>ON-CHAIN</span>
          </div>
        </div>
      </div>

      {/* Hero Illustration — Right Side */}
      <div className="hero-right">
        <img src="/hero-workers.png" alt="Diverse workers" className="hero-image" style={{
          opacity: 0, animation: 'fadeSlideUp 1s ease forwards', animationDelay: '0.4s',
          filter: 'drop-shadow(0 0 40px rgba(79,107,237,0.12))',
        }} />
      </div>
    </div>
  </section>
);

HeroSection.propTypes = {
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default HeroSection;
