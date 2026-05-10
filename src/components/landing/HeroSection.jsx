import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * HeroSection — Landing page above-the-fold hero.
 * Renders animated headline text with shimmer gradients, ghost subtitle,
 * hero CTA buttons (Worker/Find Workers), background grid, corner brackets,
 * and a slowly rotating watermark logo.
 *
 * @param {Object} props
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The HeroSection component.
 */
const HeroSection = ({ t }) => (
  <section style={{ position: 'relative', backgroundColor: '#080808' }}>
    <style>{`
      .hero-inner { display: flex; flex-direction: column; justify-content: center; min-height: 100vh; padding: 100px 24px 40px 24px; overflow: hidden; }
      .hero-left { width: 100%; max-width: 680px; overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; }
      .hero-badge { margin-bottom: 20px; }
      .hero-headline-block { margin-bottom: 12px; }
      .hero-subtext { margin-bottom: 36px; line-height: 1.6; }
      .hero-cta-row { gap: 12px; align-items: center; }
      .hero-headline { font-size: clamp(36px, 9vw, 56px); white-space: normal; overflow: hidden; line-height: 1.1; }
      .hero-ghost { font-size: clamp(28px, 8vw, 50px); white-space: normal; overflow: hidden; margin-bottom: 28px; }
      @media (min-width: 768px) {
        .hero-inner { padding: 120px 80px 60px 80px; }
        .hero-headline { font-size: clamp(32px, 4.5vw, 72px); white-space: nowrap; }
        .hero-ghost { font-size: clamp(28px, 4vw, 64px); white-space: nowrap; }
      }
      .hero-btn-primary-new {
        background-color: #ffffff; color: #000000; border: 2px solid #ffffff; padding: 12px 28px;
        font-size: 12px; font-weight: 700; letter-spacing: 0.1em; border-radius: 0;
        min-width: 170px; white-space: nowrap; transition: all 0.2s ease;
        text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
      }
      .hero-btn-primary-new:hover { background-color: #e5e5e5; }
      .hero-btn-primary-new .btn-arrow { display: inline-block; transition: transform 0.2s ease; margin-left: 8px; }
      .hero-btn-primary-new:hover .btn-arrow { transform: translateX(4px); }
      .hero-btn-secondary-new {
        background-color: transparent; color: #cccccc; border: 2px solid rgba(255,255,255,0.4); padding: 12px 28px;
        font-size: 12px; font-weight: 700; letter-spacing: 0.1em; border-radius: 0;
        min-width: 150px; white-space: nowrap; transition: all 0.2s ease;
        text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
      }
      .hero-btn-secondary-new:hover { color: #ffffff; border-color: #ffffff; background-color: rgba(255,255,255,0.05); }
    `}</style>

    {/* Grid background */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,100,255,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat 8s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '-50px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '24px', height: '24px', borderTop: '1px solid rgba(255,255,255,0.15)', borderLeft: '1px solid rgba(255,255,255,0.15)', pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '24px', height: '24px', borderBottom: '1px solid rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.15)', pointerEvents: 'none', zIndex: 1 }} />
    <img src="/trustchain-logo.png" alt="" style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '420px', height: '420px', opacity: 0.07, zIndex: 0, filter: 'invert(1)', pointerEvents: 'none', userSelect: 'none', mixBlendMode: 'screen', animation: 'slowRotate 60s linear infinite' }} />

    <div className="hero-inner relative z-10">
      <div className="hero-left justify-center">
        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <div className="font-inter hero-badge tc-text-sm tc-ls-wide" style={{ color: '#22c55e', fontWeight: '600', textTransform: 'uppercase' }}>
            ✦ {t('landing.hero_badge', 'VERIFIED ON-CHAIN')}
          </div>
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
          <p className="font-inter hero-subtext" style={{ color: '#e5e5e5', fontSize: '16px', fontWeight: '400', letterSpacing: '0.02em', maxWidth: '520px', animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '0.5s' }}>
            {t('landing.hero_subtext', 'Decentralized credentials for informal economy workers — verified on Stellar blockchain.')}
          </p>
        </div>
        <div className="flex flex-row flex-nowrap w-full sm:w-auto overflow-x-auto sm:overflow-visible hero-cta-row" style={{ position: 'relative', zIndex: 1, opacity: 0, animation: 'fadeSlideUp 0.6s ease forwards', animationDelay: '0.6s', paddingBottom: '32px' }}>
          <Link to="/worker" className="hero-btn-primary-new font-inter">
            <span>{t('landing.hero_cta_worker', "I'M A WORKER")}</span>
            <span className="btn-arrow">→</span>
          </Link>
          <Link to="/discover" className="hero-btn-secondary-new font-inter">
            {t('landing.hero_cta_find', 'FIND WORKERS')}
          </Link>
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
