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
  <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#0d0520' }}>
    <style>{`
      .hero-inner { display: flex; flex-direction: column; justify-content: center; min-height: 100vh; padding: 100px 24px 40px 24px; overflow: hidden; position: relative; z-index: 10; }
      .hero-left { width: 100%; max-width: 720px; overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; }
      .hero-right { display: none; }
      .hero-badge { margin-bottom: 24px; }
      .hero-headline-block { margin-bottom: 12px; }
      .hero-subtext { margin-bottom: 40px; line-height: 1.7; }
      .hero-cta-row { gap: 16px; align-items: center; }
      .hero-headline { font-size: clamp(36px, 9vw, 56px); white-space: normal; overflow: hidden; line-height: 1.1; }
      .hero-ghost { font-size: clamp(28px, 8vw, 50px); white-space: normal; overflow: hidden; margin-bottom: 28px; }
      @media (min-width: 768px) {
        .hero-inner { padding: 120px 0 60px 80px; flex-direction: row; align-items: center; gap: 20px; }
        .hero-left { flex: 1; }
        .hero-right { display: flex; flex: 0 0 auto; align-items: flex-end; justify-content: flex-end; max-width: 380px; margin-right: -20px; }
        .hero-headline { font-size: clamp(32px, 4.5vw, 72px); white-space: nowrap; }
        .hero-ghost { font-size: clamp(28px, 4vw, 64px); white-space: nowrap; }
      }
      @media (min-width: 1024px) {
        .hero-right { max-width: 440px; margin-right: -30px; }
      }
    `}</style>

    {/* Background Gradient matching character illustration */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 70% 30%, #c87840 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, #d060a0 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, #7040b0 0%, transparent 50%), radial-gradient(ellipse at 20% 30%, #d09050 0%, transparent 60%), radial-gradient(ellipse at 60% 50%, #9060c0 0%, transparent 50%), linear-gradient(135deg, #1a0a2e 0%, #0d0520 50%, #1a0a2e 100%)',
    }} />
    {/* Dark overlay for text readability — fades out toward right */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)' }} />

    {/* Corner Brackets */}
    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '32px', height: '32px', borderTop: '2px solid rgba(34,197,94,0.3)', borderLeft: '2px solid rgba(34,197,94,0.3)', pointerEvents: 'none', zIndex: 5 }} />
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '32px', height: '32px', borderBottom: '2px solid rgba(34,197,94,0.3)', borderRight: '2px solid rgba(34,197,94,0.3)', pointerEvents: 'none', zIndex: 5 }} />
    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderTop: '2px solid rgba(59,130,246,0.2)', borderRight: '2px solid rgba(59,130,246,0.2)', pointerEvents: 'none', zIndex: 5 }} />
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '32px', height: '32px', borderBottom: '2px solid rgba(59,130,246,0.2)', borderLeft: '2px solid rgba(59,130,246,0.2)', pointerEvents: 'none', zIndex: 5 }} />

    {/* Slowly Rotating Logo Watermark */}
    <img src="/trustchain-logo.png" alt="" style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '420px', height: '420px', opacity: 0.07, zIndex: 4, filter: 'invert(1)', pointerEvents: 'none', userSelect: 'none', mixBlendMode: 'screen', animation: 'slowRotate 60s linear infinite' }} />

    <div className="hero-inner">
      <div className="hero-left justify-center">
        <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          {/* Badge */}
          <div className="font-inter hero-badge" style={{
            color: '#22c55e', fontWeight: '700', textTransform: 'uppercase',
            fontSize: '11px', letterSpacing: '0.2em',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)',
            padding: '8px 16px', borderRadius: '100px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
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
          <div className="font-clash hero-line-3 hero-ghost font-black" style={{ fontWeight: '900', letterSpacing: '0.04em', lineHeight: '1.05', wordBreak: 'break-word' }}>
            {t('landing.titleLine3')}
          </div>

          {/* Subtext */}
          <p className="font-inter hero-subtext" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '400', letterSpacing: '0.02em', maxWidth: '540px', animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '0.5s' }}>
            {t('landing.hero_subtext', 'Decentralized credentials for informal economy workers — verified on Stellar blockchain.')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row flex-nowrap w-full sm:w-auto overflow-x-auto sm:overflow-visible hero-cta-row" style={{ position: 'relative', zIndex: 10, opacity: 0, animation: 'fadeSlideUp 0.6s ease forwards', animationDelay: '0.6s', paddingBottom: '32px' }}>
          <Link to="/worker" className="btn-glow font-inter" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '180px', justifyContent: 'center' }}>
            {t('landing.hero_cta_worker', "I'M A WORKER")} <span style={{ transition: 'transform 0.2s' }}>→</span>
          </Link>
          <Link to="/discover" className="btn-outline-glow font-inter" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '160px' }}>
            {t('landing.hero_cta_find', 'FIND WORKERS')}
          </Link>
        </div>

        {/* Floating Stats Pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '24px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '100px', padding: '10px 24px', zIndex: 10,
          opacity: 0, animation: 'fadeSlideUp 0.8s ease forwards', animationDelay: '0.8s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GASLESS</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px rgba(59,130,246,0.5)' }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>SOULBOUND</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 6px rgba(168,85,247,0.5)' }} />
            <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>ON-CHAIN</span>
          </div>
        </div>
      </div>

      {/* Hero Illustration — Right Side */}
      <div className="hero-right">
        <img src="/hero-workers.png" alt="Diverse workers" style={{
          width: '100%', maxHeight: '80vh', objectFit: 'contain', objectPosition: 'bottom center',
          opacity: 0, animation: 'fadeSlideUp 1s ease forwards', animationDelay: '0.4s',
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
