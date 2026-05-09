import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlatformStats } from '../hooks/usePlatformStats';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import HowItWorks from '../components/landing/HowItWorks';
import TechStack from '../components/landing/TechStack';

/**
 * Landing page — composed from sub-components for maintainability.
 * Each section is extracted into its own component under `components/landing/`.
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
    <div className="relative bg-[#050505] overflow-hidden text-white">
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
        .animated-cta-border { position: absolute; inset: 0; pointer-events: none; padding: 1px; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; z-index: 10; }
        .animated-cta-border::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.8) 80%, transparent 100%); animation: borderRotate 4s linear infinite; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Atmospheric Light Leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-100px', left: '-100px', width: '500px', height: '500px', background: '#f97316', filter: 'blur(120px)', opacity: 0.05 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.06 }} />

      {/* ═══ HERO ═══ */}
      <HeroSection t={t} />

      {/* ═══ TRUST BAR ═══ */}
      <div style={{ width: '100%', background: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex flex-row md:justify-center justify-start overflow-x-auto whitespace-nowrap hide-scrollbar" style={{ gap: '40px', padding: '14px 24px', alignItems: 'center' }}>
          <span className="font-inter" style={{ color: '#333', fontSize: '11px', letterSpacing: '0.14em', fontWeight: '500', textTransform: 'uppercase' }}>✦ {t('landing.trust_stellar', 'BUILT ON STELLAR TESTNET')}</span>
          <span style={{ color: '#22c55e', fontSize: '11px' }}>✦</span>
          <span className="font-inter" style={{ color: '#333', fontSize: '11px', letterSpacing: '0.14em', fontWeight: '500', textTransform: 'uppercase' }}>{t('landing.trust_gasless', '100% GASLESS')}</span>
          <span style={{ color: '#22c55e', fontSize: '11px' }}>✦</span>
          <span className="font-inter" style={{ color: '#333', fontSize: '11px', letterSpacing: '0.14em', fontWeight: '500', textTransform: 'uppercase' }}>{t('landing.trust_soulbound', 'SOULBOUND CREDENTIALS')}</span>
          <span style={{ color: '#22c55e', fontSize: '11px' }}>✦</span>
          <span className="font-inter" style={{ color: '#333', fontSize: '11px', letterSpacing: '0.14em', fontWeight: '500', textTransform: 'uppercase' }}>{t('landing.trust_opensource', 'OPEN SOURCE')}</span>
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
      <section className="px-4 py-12 md:px-16 md:py-24" style={{
        margin: '0 24px', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden',
        opacity: 0, animation: 'ctaFadeUp 0.6s ease forwards', animationDelay: '0.4s', marginTop: '60px',
      }}>
        <div className="animated-cta-border" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,100,255,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 16, left: 16, width: 28, height: 28, borderTop: '2px solid rgba(255,255,255,0.25)', borderLeft: '2px solid rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 28, height: 28, borderBottom: '2px solid rgba(255,255,255,0.25)', borderRight: '2px solid rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="font-clash text-2xl sm:text-3xl md:text-4xl font-black text-center" style={{ color: '#fff', marginBottom: '8px' }}>{t('landing.ctaTitle')}</h2>
          <p className="font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>{t('landing.ctaSubtitle', { count: workerCount })}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/discover" className="font-inter w-full sm:w-auto px-8 py-4" style={{
              backgroundColor: '#fff', color: '#000', border: 'none', letterSpacing: '2px', fontWeight: '800',
              textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', transition: 'all 0.2s ease',
            }}>{t('landing.ctaButton')}</Link>
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
