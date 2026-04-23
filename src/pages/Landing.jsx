import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from '../components/TrustChainLogo';

const Landing = () => {
  const { t } = useTranslation();

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

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden text-white">

      {/* ── Atmospheric Light Leaks ──────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '-100px', left: '-100px',
          width: '500px', height: '500px',
          background: '#f97316',
          filter: 'blur(120px)',
          opacity: 0.06,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: '#1e3a8a',
          filter: 'blur(120px)',
          opacity: 0.07,
        }}
      />

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: '3vw',
          paddingRight: '3vw',
          paddingTop: '120px',
          paddingBottom: '60px',
        }}
      >

        {/* Center logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 reveal pointer-events-none">
          <div className="transition-transform duration-[2000ms] ease-out hover:scale-105">
            <TrustChainLogo size={200} className="max-w-[200px] w-full h-auto opacity-10" style={{ filter: 'invert(1)', mixBlendMode: 'screen' }} />
          </div>
        </div>

        {/* Hero content wrapper to keep text and buttons grouped */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          {/* Hero heading — 3 lines */}
          <div className="reveal reveal-d1 text-center md:text-left flex flex-col" style={{ gap: '8px' }}>
            <div className="font-clash font-bold uppercase tracking-wide text-white hero-line-1" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: '1.05', marginBottom: '0' }}>YOUR&nbsp;&nbsp;WORK.</div>
            <div className="font-clash font-bold uppercase tracking-wide text-white hero-line-2" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: '1.05', marginBottom: '0' }}>YOUR&nbsp;&nbsp;REPUTATION.</div>
            <div className="font-clash font-bold uppercase tracking-wide text-white/20 hero-line-3" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: '1.05', marginBottom: '0' }}>ON-CHAIN&nbsp;&nbsp;FOREVER.</div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row reveal reveal-d3 text-center md:text-left justify-center md:justify-start items-center" style={{ gap: '16px', marginTop: '40px', display: 'flex', alignItems: 'center' }}>
            <Link
              to="/worker"
              className="flex items-center justify-center uppercase transition-all duration-300 ease-in-out cursor-pointer text-center"
              style={{
                padding: '14px 36px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '2.5px',
                border: '2px solid white',
                borderRadius: '0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
            >
              {t('landing.btnWorker', "I'M A WORKER")} →
            </Link>
            <Link
              to="/discover"
              className="flex items-center justify-center uppercase transition-all duration-300 ease-in-out cursor-pointer text-center"
              style={{
                padding: '14px 36px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '2.5px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {t('landing.btnFind', 'FIND WORKERS')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 20 }}>
          <div className="tc-bounce" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.35)' }}>
            ↓
          </div>
          <span style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }} className="font-inter">
            SCROLL DOWN
          </span>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw', paddingTop: '48px', paddingBottom: '48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', overflow: 'hidden' }}>
          {[
            { label: t('landing.stat1Label', 'TARGET USERS'), value: '2B+', delay: 'reveal-d1' },
            { label: t('landing.stat2Label', 'CREDENTIALS'), value: t('landing.stat2Value', 'SOULBOUND'), delay: 'reveal-d2' },
            { label: t('landing.stat3Label', 'VERIFICATION'), value: t('landing.stat3Value', 'INSTANT'), delay: 'reveal-d3' },
            { label: 'NETWORK', value: 'STELLAR TESTNET', delay: 'reveal-d4' },
          ].map((stat, i, arr) => (
            <div
              key={i}
              className={`reveal ${stat.delay} ${
                i < arr.length - 1 ? 'border-r border-white/10' : ''
              }`}
              style={{ paddingRight: '48px' }}
            >
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-1 font-inter">
                {stat.label}
              </p>
              <p className="font-clash font-black text-white" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', whiteSpace: 'nowrap' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES / HOW IT WORKS ──────────────────────────── */}
      <section className="border-t border-white/5 pt-20 pb-10">
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw' }}>
          {/* Section header */}
          <div className="reveal relative z-10" style={{ marginTop: '80px', marginBottom: '40px' }}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter" style={{ marginBottom: '12px' }}>
              {t('landing.howItWorks', 'How It Works')}
            </p>
            <h2 className="font-clash font-black tracking-normal text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {t('landing.stepsTitleP1', 'Three Steps to')}{' '}
              {t('landing.stepsTitleP2', 'Trust')}
            </h2>
          </div>

          <div className="relative z-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '80px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            {features.map((feature, idx) => (
              <div key={idx} className="relative bg-white/5 flex flex-col h-full reveal group overflow-hidden step-card" style={{ padding: '40px 32px', borderRadius: '0', minWidth: '0' }}>
                {/* Decorative large background number */}
                <div className="absolute -top-6 -left-4 font-clash text-[120px] font-black text-white/5 leading-none select-none z-0 transition-transform duration-500 group-hover:scale-110 step-number">
                  {feature.step}
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-inter font-semibold mb-6 flex items-center gap-4">
                    STEP {feature.step}
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  
                  <h3 className="font-clash font-black tracking-tight mb-4 text-white" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
                    {feature.title}
                  </h3>
                  
                  <p className="font-inter text-gray-400 text-lg leading-relaxed max-w-xl mb-12 flex-1">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <Link
                      to={feature.link}
                      className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors group/link font-inter font-semibold learn-more"
                    >
                      LEARN MORE
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT WITH ───────────────────────────────────────── */}
      <section className="border-t border-white/5" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw' }}>
          <div className="text-center reveal" style={{ marginBottom: '32px' }}>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50 font-inter">
              {t('landing.builtWith', 'BUILT WITH LEADING TECHNOLOGY')}
            </h2>
          </div>

          <div className="reveal reveal-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[
              { name: 'Stellar', abbr: 'ST', desc: t('landing.techBlockchain', 'Blockchain') },
              { name: 'Soroban', abbr: 'SR', desc: t('landing.techSmartContracts', 'Smart Contracts') },
              { name: 'React', abbr: 'RE', desc: t('landing.techFrontend', 'Frontend') },
              { name: 'Freighter', abbr: 'FR', desc: t('landing.techWallet', 'Wallet') },
              { name: 'Rust', abbr: 'RS', desc: t('landing.techBackend', 'Backend') },
            ].map((tech, i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white/[0.02] rounded-[4px] group hover:border-white/40 hover:bg-white/10 transition-all cursor-default" style={{ padding: '24px 16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                {/* Simulated Icon/Logo */}
                <div className="w-12 h-12 mb-4 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center text-white/70 font-clash font-bold text-lg group-hover:scale-110 group-hover:text-white group-hover:border-white/30 transition-all">
                  {tech.abbr}
                </div>
                <span className="text-sm font-bold text-white tracking-wide mb-1 font-inter">
                  {tech.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-inter">
                  {tech.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
