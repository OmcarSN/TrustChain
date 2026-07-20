import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlatformStats } from '../hooks/usePlatformStats';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import HowItWorks from '../components/landing/HowItWorks';
import TechStack from '../components/landing/TechStack';

/**
 * Landing — Public marketing homepage.
 * Composes HeroSection, StatsBar, HowItWorks, and TechStack sub-components
 * with IntersectionObserver-driven scroll-reveal animations. Also renders
 * a trust ticker bar and a CTA banner with animated border.
 *
 * @returns {React.ReactElement} The Landing page.
 */
const Landing = () => {
  const { t } = useTranslation();
  const [statsVisible, setStatsVisible] = useState(false);
  const [howVisible, setHowVisible] = useState(false);
  const [techVisible, setTechVisible] = useState(false);
  const statsRef = useRef(null);
  const howRef = useRef(null);
  const techRef = useRef(null);

  useEffect(() => {
    const obs1 = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setStatsVisible(true); obs1.disconnect(); }
    }, { threshold: 0.3 });
    const obs2 = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setHowVisible(true); obs2.disconnect(); }
    }, { threshold: 0.2 });
    const obs3 = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setTechVisible(true); obs3.disconnect(); }
    }, { threshold: 0.2 });

    if (statsRef.current) obs1.observe(statsRef.current);
    if (howRef.current) obs2.observe(howRef.current);
    if (techRef.current) obs3.observe(techRef.current);
    
    return () => { obs1.disconnect(); obs2.disconnect(); obs3.disconnect(); };
  }, []);

  const features = [
    { step: '01', title: t('landing.step1Title', 'Register & Mint'), description: t('landing.step1Desc', 'Create your on-chain identity and mint a soulbound credential that represents your skills, experience, and professional history — permanently recorded on Stellar.'), link: '/worker', linkText: t('landing.btnWorker', "I'm a Worker") },
    { step: '02', title: t('landing.step2Title', 'Earn Endorsements'), description: t('landing.step2Desc', 'Receive verifiable endorsements from employers and peers. Each review is recorded on-chain with time-weighted scoring and decay algorithms for fair, evolving reputation.'), link: '/endorse', linkText: t('landing.getStarted', 'Get Started') },
    { step: '03', title: t('landing.step3Title', 'Verify & Discover'), description: t('landing.step3Desc', 'Employers can instantly verify any worker\'s credentials and reputation. Browse the network to find trusted professionals with proven track records.'), link: '/discover', linkText: t('landing.btnFind', 'Find Workers') },
  ];

  const { workerCount, avgRating, totalEndorsements } = usePlatformStats();
  const stats = [
    { value: workerCount.toString(), label: t('landing.statVerifiedWorkers') },
    { value: avgRating.toString(), label: t('landing.statAvgRating') },
    { value: totalEndorsements.toString(), label: t('landing.statTotalReviews') },
    { value: '100%', label: t('landing.statGaslessTxns') },
  ];

  return (
    <div className="relative bg-[#05060A] overflow-hidden text-white">
      <style>{`
        @keyframes heroLineIn { from { opacity: 0; transform: translateY(40px); filter: blur(4px); } to { opacity: 1; transform: translateY(0); filter: blur(0px); } }
        @keyframes slowRotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes orbFloat { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.02); } }
        @keyframes textShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes mutedFlow { 0%, 100% { background-position: 0% center; opacity: 0.25; } 50% { background-position: 100% center; opacity: 0.4; } }
        @keyframes borderRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ctaFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hero-line-1 { background: linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #888888 45%, #ffffff 55%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; opacity: 0; animation: heroLineIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards, textShimmer 4s 0s linear infinite; }
        .hero-line-2 { background: linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #888888 45%, #ffffff 55%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; opacity: 0; animation: heroLineIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s forwards, textShimmer 4s 1.3s linear infinite; }
        .hero-line-3 { background: linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.75) 45%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0.45) 100%); background-size: 300% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; opacity: 0; animation: heroLineIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards, mutedFlow 5s 2.5s ease-in-out infinite; }
        .animated-cta-border { position: absolute; inset: 0; pointer-events: none; padding: 1px; border-radius: inherit; background: linear-gradient(135deg, rgba(124,147,242,0.6) 0%, rgba(124,147,242,0.1) 100%); z-index: 10; opacity: 0.5; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Atmospheric Light Leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79,107,237,0.06) 0%, transparent 70%)', willChange: 'transform', zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(61,86,201,0.07) 0%, transparent 70%)', willChange: 'transform', zIndex: 0 }} />

      {/* ═══ HERO ═══ */}
      <HeroSection t={t} />

      {/* ═══ TRUST BAR ═══ */}
      <div style={{ width: '100%', background: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex flex-row md:justify-center justify-start overflow-x-auto whitespace-nowrap hide-scrollbar" style={{ gap: '40px', padding: '14px 24px', alignItems: 'center' }}>
          <span className="font-inter tc-text-sm tc-ls-wide" style={{ color: '#333', fontWeight: '500', textTransform: 'uppercase' }}>✦ {t('landing.trust_stellar', 'BUILT ON STELLAR MAINNET')}</span>
          <span style={{ color: '#7C93F2', fontSize: '11px' }}>✦</span>
          <span className="font-inter tc-text-sm tc-ls-wide" style={{ color: '#333', fontWeight: '500', textTransform: 'uppercase' }}>{t('landing.trust_gasless', '100% GASLESS')}</span>
          <span style={{ color: '#7C93F2', fontSize: '11px' }}>✦</span>
          <span className="font-inter tc-text-sm tc-ls-wide" style={{ color: '#333', fontWeight: '500', textTransform: 'uppercase' }}>{t('landing.trust_soulbound', 'SOULBOUND CREDENTIALS')}</span>
          <span style={{ color: '#7C93F2', fontSize: '11px' }}>✦</span>
          <span className="font-inter tc-text-sm tc-ls-wide" style={{ color: '#333', fontWeight: '500', textTransform: 'uppercase' }}>{t('landing.trust_opensource', 'OPEN SOURCE')}</span>
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div ref={statsRef}>
        <StatsBar stats={stats} visible={statsVisible} />
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div ref={howRef}>
        <HowItWorks features={features} visible={howVisible} t={t} />
      </div>

      {/* ═══ CTA BANNER ═══ */}
      <section style={{
        margin: '60px 24px 0', padding: '56px 32px',
        position: 'relative', overflow: 'hidden', borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(79,107,237,0.08), rgba(0,0,0,0.2))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(79,107,237,0.18)',
        opacity: 0, animation: 'ctaFadeUp 0.6s ease forwards', animationDelay: '0.4s',
      }}>
        <div className="animated-cta-border" style={{ borderRadius: '24px' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="font-clash text-2xl sm:text-3xl md:text-4xl font-black text-center" style={{ color: '#fff', marginBottom: '16px' }}>{t('landing.ctaTitle')}</h2>
          <p className="font-inter" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '40px', maxWidth: '600px', marginInline: 'auto' }}>{t('landing.ctaSubtitle', { count: workerCount })}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/worker" className="btn-glow font-inter" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {t('landing.btnWorker', "Register Now")} <span>→</span>
            </Link>
            <Link to="/discover" className="btn-outline-glow font-inter" style={{ textDecoration: 'none' }}>
              {t('landing.ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK ═══ */}
      <div ref={techRef}>
        <TechStack visible={techVisible} t={t} />
      </div>
    </div>
  );
};

export default Landing;
