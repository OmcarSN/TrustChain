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
      <section className="relative min-h-screen flex flex-col px-6 lg:px-12 pt-[20vh] pb-24 overflow-hidden">

        {/* Top-right metadata block */}
        <div className="absolute top-24 right-6 lg:right-12 w-56 hidden md:block reveal reveal-d2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-inter">
            STELLAR SOROBAN · SOULBOUND
          </p>
          <p className="text-sm font-inter font-light text-white/50 leading-relaxed">
            {t('landing.desc', 'On-chain credentials for informal economy workers. Non-transferable. Forever verifiable.')}
          </p>
        </div>

        {/* Center logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 reveal pointer-events-none">
          <div className="transition-transform duration-[2000ms] ease-out hover:scale-105">
            <TrustChainLogo size={200} className="max-w-[200px] w-full h-auto opacity-40" style={{ filter: 'invert(1)', mixBlendMode: 'screen' }} />
          </div>
        </div>

        {/* Hero heading — 3 lines */}
        <div className="relative z-10 reveal reveal-d1">
          <div className="font-clash font-bold uppercase tracking-tighter text-[9vw] md:text-[7vw] leading-none text-white mb-2">YOUR WORK.</div>
          <div className="font-clash font-bold uppercase tracking-tighter text-[9vw] md:text-[7vw] leading-none text-white mb-2">YOUR REPUTATION.</div>
          <div className="font-clash font-bold uppercase tracking-tighter text-[9vw] md:text-[7vw] leading-none text-white/20">ON-CHAIN FOREVER.</div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 relative z-10 reveal reveal-d3">
          <Link
            to="/worker"
            className="bg-white text-black rounded-[2px] font-bold text-[11px] tracking-[0.15em] uppercase px-8 py-4 hover:opacity-85 transition-opacity text-center"
          >
            {t('landing.btnWorker', "I'M A WORKER")} →
          </Link>
          <Link
            to="/discover"
            className="border border-white/20 text-white rounded-[2px] font-bold text-[11px] tracking-[0.15em] uppercase px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-all text-center"
          >
            {t('landing.btnFind', 'FIND WORKERS')}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-white/20" />
          <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-inter">SCROLL</span>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────── */}
      <section className="border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { label: t('landing.stat1Label', 'TARGET USERS'), value: '2B+', delay: 'reveal-d1' },
            { label: t('landing.stat2Label', 'CREDENTIALS'), value: t('landing.stat2Value', 'SOULBOUND'), delay: 'reveal-d2' },
            { label: t('landing.stat3Label', 'VERIFICATION'), value: t('landing.stat3Value', 'INSTANT'), delay: 'reveal-d3' },
            { label: 'NETWORK', value: 'STELLAR TESTNET', delay: 'reveal-d4' },
          ].map((stat, i, arr) => (
            <div
              key={i}
              className={`px-6 lg:px-10 py-8 reveal ${stat.delay} ${
                i < arr.length - 1 ? 'border-r border-white/5' : ''
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-inter">
                {stat.label}
              </p>
              <p className="font-clash text-xl lg:text-2xl font-bold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES / HOW IT WORKS ──────────────────────────── */}
      <section className="border-t border-white/5 py-20 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-16 reveal">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter mb-4">
              {t('landing.howItWorks', 'How It Works')}
            </p>
            <h2 className="font-clash text-4xl lg:text-5xl font-bold tracking-tighter text-white">
              {t('landing.stepsTitleP1', 'Three Steps to')}{' '}
              {t('landing.stepsTitleP2', 'Trust')}
            </h2>
          </div>

          {features.map((feature, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 mb-16 md:mb-24 reveal">
              {/* Index number */}
              <div className="md:col-span-3">
                <span className="font-clash text-[60px] md:text-[80px] font-bold text-white/[0.06] leading-none md:sticky md:top-24">
                  {feature.step}
                </span>
              </div>

              {/* Content */}
              <div className="md:col-span-8 md:col-start-5 pt-0 md:pt-4">
                <h3 className="font-clash text-2xl md:text-4xl font-bold tracking-tighter mb-4 md:mb-6 text-white">
                  {feature.title}
                </h3>
                <p className="font-inter font-light text-base md:text-xl leading-relaxed text-white/50 max-w-[60ch] mb-6 md:mb-8">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-2 border-b border-white/30 pb-1 text-[11px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity group font-inter font-bold"
                >
                  LEARN MORE
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUILT WITH ───────────────────────────────────────── */}
      <section className="border-t border-white/5 py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 reveal">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20 font-inter">
              {t('landing.builtWith', 'Built With Leading Technology')}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 reveal reveal-d1">
            {[
              { name: 'Stellar', abbr: 'ST', desc: t('landing.techBlockchain', 'Blockchain') },
              { name: 'Soroban', abbr: 'SR', desc: t('landing.techSmartContracts', 'Smart Contracts') },
              { name: 'React', abbr: 'RE', desc: t('landing.techFrontend', 'Frontend') },
              { name: 'Freighter', abbr: 'FR', desc: t('landing.techWallet', 'Wallet') },
              { name: 'Rust', abbr: 'RS', desc: t('landing.techBackend', 'Backend') },
            ].map((tech, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 border border-white/10 rounded-[2px] flex items-center justify-center text-white/40 text-[10px] font-bold tracking-wider group-hover:border-white/30 group-hover:text-white/70 transition-all">
                  {tech.abbr}
                </div>
                <span className="text-sm font-bold text-white/30 group-hover:text-white/70 tracking-tight transition-colors font-inter">
                  {tech.name}
                </span>
                <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/10 font-inter">
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
