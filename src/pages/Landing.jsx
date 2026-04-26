import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlatformStats } from '../hooks/usePlatformStats';
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
    
    return () => { 
      obs1.disconnect(); obs2.disconnect(); obs3.disconnect();
    };
  }, []);

  const features = [
    {
      step: '01',
      title: t('landing.step1Title', 'Register & Mint'),
      description: t('landing.step1Desc', 'Create your on-chain identity and mint a soulbound credential that represents your skills, experience, and professional history — permanently recorded on Stellar.'),
      link: '/worker',
      linkText: t('landing.btnWorker', "I'm a Worker"),
    },
    {
      step: '02',
      title: t('landing.step2Title', 'Earn Endorsements'),
      description: t('landing.step2Desc', 'Receive verifiable endorsements from employers and peers. Each review is recorded on-chain with time-weighted scoring and decay algorithms for fair, evolving reputation.'),
      link: '/endorse',
      linkText: t('landing.getStarted', 'Get Started'),
    },
    {
      step: '03',
      title: t('landing.step3Title', 'Verify & Discover'),
      description: t('landing.step3Desc', 'Employers can instantly verify any worker\'s credentials and reputation. Browse the network to find trusted professionals with proven track records.'),
      link: '/discover',
      linkText: t('landing.btnFind', 'Find Workers'),
    },
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
        @keyframes heroLineIn {
          from { opacity: 0; transform: translateY(40px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes slowRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        @keyframes arrowPulse {
          0%, 100% {
            transform: translateY(0);
            filter: drop-shadow(0 0 0px rgba(255,255,255,0));
          }
          50% {
            transform: translateY(6px);
            filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));
          }
        }
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes mutedFlow {
          0%, 100% { background-position: 0% center; opacity: 0.25; }
          50% { background-position: 100% center; opacity: 0.4; }
        }
        .hero-line-1 {
          background: linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #888888 45%, #ffffff 55%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          animation: heroLineIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards, textShimmer 4s 0s linear infinite;
        }
        .hero-line-2 {
          background: linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #888888 45%, #ffffff 55%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          animation: heroLineIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s forwards, textShimmer 4s 1.3s linear infinite;
        }
        .hero-line-3 {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.45) 0%,
            rgba(255,255,255,0.45) 30%,
            rgba(255,255,255,0.75) 45%,
            rgba(255,255,255,0.45) 60%,
            rgba(255,255,255,0.45) 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          animation: heroLineIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards, mutedFlow 5s 2.5s ease-in-out infinite;
        }
        .hero-btn-primary {
          transition: all 0.2s ease;
        }
        .hero-btn-primary:hover {
          background-color: #e5e5e5 !important;
        }
        .hero-btn-secondary {
          transition: all 0.2s ease;
        }
        .hero-btn-secondary:hover {
          border-color: rgba(255,255,255,0.8) !important;
          background-color: rgba(255,255,255,0.05) !important;
        }
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animated-cta-border {
          position: absolute;
          inset: 0;
          pointer-events: none;
          padding: 1px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 10;
        }
        .animated-cta-border::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.8) 80%, transparent 100%);
          animation: borderRotate 4s linear infinite;
        }
        .btn-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
          margin-left: 8px;
        }
        .hero-btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }
        @keyframes ctaFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-card-new {
          transition: all 0.3s ease;
        }
        .step-card-new:hover {
          border-color: rgba(255,255,255,0.15) !important;
          background-color: rgba(255,255,255,0.03) !important;
        }
        .learn-more {
          color: rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .learn-more:hover {
          color: #ffffff;
          letter-spacing: 3px;
        }
        .learn-more .arrow {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .learn-more:hover .arrow {
          transform: translateX(6px);
        }
        .tech-card-new {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .tech-card-new:hover {
          transform: translateY(-4px);
          border: 1px solid rgba(255,255,255,0.2) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
        .tech-card-new:hover .tech-icon {
          background-color: rgba(255,255,255,0.12) !important;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes gradientSlide {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>

      {/* ── Atmospheric Light Leaks ──────────────────────────── */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ top: '-100px', left: '-100px', width: '500px', height: '500px', background: '#f97316', filter: 'blur(120px)', opacity: 0.05 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.06 }} />

      {/* ══════════════════════════════════════════════════════════
          SECTION A — HERO
         ══════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        backgroundColor: '#080808',
      }}>
        <style>{`
          .hero-inner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100vh;
            padding: 100px 24px 40px 24px;
            overflow: hidden;
          }
          .hero-left {
            width: 100%;
            max-width: 680px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .hero-badge {
            margin-bottom: 20px;
          }
          .hero-headline-block {
            margin-bottom: 12px;
          }
          .hero-subtext {
            margin-bottom: 36px;
            line-height: 1.6;
          }
          .hero-cta-row {
            gap: 12px;
            align-items: center;
          }
          .hero-headline {
            font-size: clamp(36px, 9vw, 56px);
            white-space: normal;
            overflow: hidden;
            line-height: 1.1;
          }
          .hero-ghost {
            font-size: clamp(28px, 8vw, 50px);
            white-space: normal;
            overflow: hidden;
            margin-bottom: 28px;
          }
          @media (min-width: 768px) {
            .hero-inner {
              padding: 120px 80px 60px 80px;
            }
            .hero-headline {
              font-size: clamp(32px, 4.5vw, 72px);
              white-space: nowrap;
            }
            .hero-ghost {
              font-size: clamp(28px, 4vw, 64px);
              white-space: nowrap;
            }
          }
        `}</style>

        {/* Grid lines background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glowing orb 1 - top right */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,100,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'orbFloat 8s ease-in-out infinite',
        }} />

        {/* Glowing orb 2 - bottom left */}
        <div style={{
          position: 'absolute', bottom: '-50px', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Corner bracket - top left */}
        <div style={{
          position: 'absolute', top: '20px', left: '20px',
          width: '24px', height: '24px',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderLeft: '1px solid rgba(255,255,255,0.15)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Corner bracket - bottom right */}
        <div style={{
          position: 'absolute', bottom: '20px', right: '20px',
          width: '24px', height: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          borderRight: '1px solid rgba(255,255,255,0.15)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Watermark logo */}
        <img src="/trustchain-logo.png" alt="" style={{
          position: 'absolute',
          top: '48%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px', height: '420px',
          opacity: 0.07, zIndex: 0,
          filter: 'invert(1)',
          pointerEvents: 'none', userSelect: 'none',
          mixBlendMode: 'screen',
          animation: 'slowRotate 60s linear infinite',
        }} />

        <div className="hero-inner relative z-10">
          {/* Left Column */}
          <div className="hero-left justify-center">
            {/* Hero text block */}
            <div style={{
              position: 'relative', zIndex: 1, width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'
            }}>

              <div className="font-inter hero-badge" style={{
                color: '#22c55e', fontSize: '11px', letterSpacing: '0.15em', fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                ✦ {t('landing.hero_badge', 'VERIFIED ON-CHAIN')}
              </div>

              <div className="hero-headline-block">
                {/* Line 1 — YOUR WORK. */}
                <div className="font-clash hero-line-1 hero-headline font-black" style={{
                  fontWeight: '900',
                  letterSpacing: '0.04em',
                  marginBottom: '0', wordBreak: 'break-word',
                }}>
                  <span>{t('landing.titleLine1')}</span>
                </div>

                {/* Line 2 — YOUR REPUTATION. */}
                <div className="font-clash hero-line-2 hero-headline font-black" style={{
                  fontWeight: '900',
                  letterSpacing: '0.04em',
                  marginBottom: '0', wordBreak: 'break-word',
                }}>
                  {t('landing.titleLine2')}
                </div>
              </div>

              {/* Line 3 — ON-CHAIN FOREVER. */}
              <div className="font-clash hero-line-3 hero-ghost font-black" style={{
                fontWeight: '900',
                letterSpacing: '0.04em', lineHeight: '1.05',
                wordBreak: 'break-word'
              }}>
                {t('landing.titleLine3')}
              </div>

              <p className="font-inter hero-subtext" style={{
                color: '#e5e5e5',
                fontSize: '16px', fontWeight: '400', letterSpacing: '0.02em',
                maxWidth: '520px',
                animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '0.5s'
              }}>
                {t('landing.hero_subtext', 'Decentralized credentials for informal economy workers — verified on Stellar blockchain.')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row flex-nowrap w-full sm:w-auto overflow-x-auto sm:overflow-visible hero-cta-row" style={{
              position: 'relative', zIndex: 1,
              opacity: 0, animation: 'fadeSlideUp 0.6s ease forwards',
              animationDelay: '0.6s', paddingBottom: '32px'
            }}>
              <style>{`
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

      {/* ══════════════════════════════════════════════════════════
          TRUST BAR
         ══════════════════════════════════════════════════════════ */}
      <div style={{
        width: '100%', background: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a',
      }}>
        <div className="flex flex-row md:justify-center justify-start overflow-x-auto whitespace-nowrap hide-scrollbar" style={{
          gap: '40px', padding: '14px 24px', alignItems: 'center'
        }}>
          <style>{`
            .trust-item { color: #333; font-size: 11px; letter-spacing: 0.14em; font-weight: 500; text-transform: uppercase; transition: color 0.2s ease; cursor: default; }
            .trust-item:hover { color: #555; }
            .trust-bullet { color: #22c55e; font-size: 11px; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          <span className="trust-item">✦ {t('landing.trust_stellar', 'BUILT ON STELLAR TESTNET')}</span>
          <span className="trust-bullet">✦</span>
          <span className="trust-item">{t('landing.trust_gasless', '100% GASLESS')}</span>
          <span className="trust-bullet">✦</span>
          <span className="trust-item">{t('landing.trust_soulbound', 'SOULBOUND CREDENTIALS')}</span>
          <span className="trust-bullet">✦</span>
          <span className="trust-item">{t('landing.trust_opensource', 'OPEN SOURCE')}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION B — STATS BAR
         ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-zinc-800" style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        position: 'relative', overflow: 'hidden',
        paddingLeft: '24px', paddingRight: '24px',
        marginTop: '80px',
      }}>
        {/* Grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        }} />
        {stats.map((stat, i) => {
          const accentColor = i === 1 ? '#f5c518' : i === 3 ? '#00dc6e' : 'rgba(255,255,255,0.3)';
          const isGasless = i === 3;
          return (
            <div key={i} style={{
              padding: '20px 32px',
              borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
            }}>
              <div style={{ width: '32px', height: '2px', backgroundColor: accentColor, marginBottom: '12px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <p className="font-clash" style={{
                  fontSize: '1.6rem', fontWeight: '900', color: isGasless ? '#00dc6e' : '#ffffff',
                  filter: isGasless ? 'drop-shadow(0 0 8px rgba(0,220,110,0.3))' : 'none',
                  lineHeight: '1', margin: 0,
                }}>
                  {stat.value}
                </p>
                <span style={{ color: '#00dc6e', fontSize: '11px', fontWeight: '700' }}>↑</span>
              </div>
              {stat.value === '2.5' && (
                <p style={{ color: '#f5c518', fontSize: '12px', marginBottom: '4px', marginTop: 0 }}>★★½☆☆</p>
              )}
              <p className="font-inter" style={{
                fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase', marginTop: stat.value === '2.5' ? '0' : '4px', marginBottom: 0,
              }}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION C — HOW IT WORKS
         ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" ref={howRef} style={{ paddingTop: '80px', paddingBottom: '0px', paddingRight: '64px', paddingLeft: '24px', marginTop: '0px' }}>
        {/* Section header */}
        <div style={{
          marginBottom: '48px',
          paddingLeft: '24px',
          opacity: howVisible ? 1 : 0,
          transform: howVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <p className="font-inter" style={{
              fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)',
              marginBottom: '12px', textTransform: 'uppercase',
            }}>
              {t('landing.howItWorks', 'How It Works')}
            </p>
            <h2 className="font-clash" style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff' }}>
              {t('landing.stepsTitleP1', 'Three Steps to')}{' '}
              {t('landing.stepsTitleP2', 'Trust')}
            </h2>
          </div>
          <Link to="/how-it-works" className="font-inter" style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: '#00dc6e',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            border: '1px solid rgba(0, 220, 110, 0.3)',
            padding: '10px 20px',
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(0, 220, 110, 0.05)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 220, 110, 0.15)'; e.currentTarget.style.borderColor = '#00dc6e'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 220, 110, 0.05)'; e.currentTarget.style.borderColor = 'rgba(0, 220, 110, 0.3)'; }}
          >
            {t('landing.viewDetailedGuide', 'VIEW DETAILED GUIDE')} <span>→</span>
          </Link>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ position: 'relative', paddingBottom: '0px' }}>
          {/* Connecting dotted line between cards */}
          <div style={{
            position: 'absolute', top: '50%', left: '33%', width: '34%', height: '1px',
            borderTop: '1px dashed rgba(255,255,255,0.08)',
            zIndex: 0, pointerEvents: 'none',
          }} />
          {features.map((feature, idx) => (
            <div key={idx} className="step-card-new" style={{
              padding: '32px 28px',
              paddingBottom: '32px',

              border: '1px solid rgba(255,255,255,0.07)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
              opacity: howVisible ? 1 : 0,
              transform: howVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.1}s, border-color 0.3s ease, background-color 0.3s ease`,
            }}>
              {/* Large watermark number */}
              <div className="font-clash" style={{
                position: 'absolute', bottom: '-20px', right: '-10px',
                fontSize: '120px', fontWeight: '900', lineHeight: 1,
                color: 'rgba(255,255,255,0.03)',
                pointerEvents: 'none', userSelect: 'none', zIndex: 0,
              }}>{feature.step}</div>
              {/* Step number */}
              <p className="font-inter" style={{
                fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.2)',
                marginBottom: '20px', textTransform: 'uppercase',
              }}>
                {t('landing.stepLabel')} {feature.step}
              </p>

              {/* Step title */}
              <h3 className="font-clash" style={{
                fontSize: '15px', fontWeight: '700', color: '#ffffff',
                marginBottom: '10px',
              }}>
                {feature.title}
              </h3>

              {/* Step description */}
              <p className="font-inter" style={{
                fontSize: '13px', color: 'rgba(255,255,255,0.4)',
                lineHeight: '1.7', flex: 1,
              }}>
                {feature.description}
              </p>


            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA BANNER (NEW)
         ══════════════════════════════════════════════════════════ */}
      <section className="px-4 py-12 md:px-16 md:py-24" style={{
        margin: '0 24px',
        border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.06)', 
        backgroundColor: 'rgba(255,255,255,0.02)',
        position: 'relative', overflow: 'hidden',
        opacity: 0, animation: 'ctaFadeUp 0.6s ease forwards', animationDelay: '0.4s',
        marginTop: '60px',
      }}>
        <div className="animated-cta-border" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,100,255,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 16, left: 16, width: 28, height: 28, borderTop: '2px solid rgba(255,255,255,0.25)', borderLeft: '2px solid rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 28, height: 28, borderBottom: '2px solid rgba(255,255,255,0.25)', borderRight: '2px solid rgba(255,255,255,0.25)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="font-clash text-2xl sm:text-3xl md:text-4xl font-black text-center" style={{ color: '#fff', marginBottom: '8px' }}>
            {t('landing.ctaTitle')}
          </h2>
          <p className="font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
            {t('landing.ctaSubtitle', { count: workerCount })}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/discover" className="hero-btn-primary font-inter w-full sm:w-auto px-8 py-4" style={{
              backgroundColor: '#fff', color: '#000', border: 'none',
              letterSpacing: '2px', fontWeight: '800', textTransform: 'uppercase', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
            }}>
              {t('landing.ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION D — BUILT WITH
         ══════════════════════════════════════════════════════════ */}
      <section ref={techRef} style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '60px', paddingBottom: '60px', paddingLeft: '64px', paddingRight: '64px',
        position: 'relative', overflow: 'hidden',
        marginTop: '60px',
      }}>
        {/* Scrolling ticker background */}
        <div style={{
          position: 'absolute', whiteSpace: 'nowrap',
          fontSize: '100px', fontWeight: '900',
          color: 'rgba(255,255,255,1)', opacity: 0.015,
          animation: 'ticker 25s linear infinite',
          top: '40%', transform: 'translateY(-50%)',
          zIndex: 0, pointerEvents: 'none', userSelect: 'none',
        }}>
          STELLAR · SOROBAN · REACT · FREIGHTER · RUST · STELLAR · SOROBAN · REACT · FREIGHTER · RUST ·
        </div>
        
        <div style={{
          opacity: techVisible ? 1 : 0,
          transform: techVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'40px' }}>
            <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
            <span style={{ fontSize:'11px', letterSpacing:'4px', color:'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: '900' }}>
              {t('landing.builtWith', 'BUILT WITH LEADING TECHNOLOGY')}
            </span>
            <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
          </div>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 pb-2 md:pb-0" style={{ gap: '16px' }}>
          {[
            { name: 'Stellar', abbr: 'ST', desc: t('landing.techBlockchain', 'Blockchain') },
            { name: 'Soroban', abbr: 'SR', desc: t('landing.techSmartContracts', 'Smart Contracts') },
            { name: 'React', abbr: 'RE', desc: t('landing.techFrontend', 'Frontend') },
            { name: 'Freighter', abbr: 'FR', desc: t('landing.techWallet', 'Wallet') },
            { name: 'Rust', abbr: 'RS', desc: t('landing.techBackend', 'Backend') },
          ].map((tech, i) => (
            <div key={i} className="tech-card-new min-w-[160px] md:min-w-0" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '24px 16px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.07)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              opacity: techVisible ? 1 : 0,
              transform: techVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s, border-color 0.3s ease, background-color 0.3s ease`,
            }}>
              <div className="tech-icon font-clash" style={{
                width: '48px', height: '48px', marginBottom: '12px',
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.5)',
              }}>
                {tech.abbr}
              </div>
              <span className="font-inter" style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {tech.name}
              </span>
              <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                {tech.desc}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
