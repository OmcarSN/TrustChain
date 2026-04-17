import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, Award, Wallet, ArrowRight, UserPlus, Star, Search, Sparkles, Globe, Target, Zap, Users, TrendingUp, HelpCircle, ExternalLink, Blocks, Lock, HandshakeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Fade-up scroll-reveal wrapper ───────────────────────────── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── Inline Tooltip for blockchain terms ──────────────────────── */
const Tooltip = ({ term, explanation, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex items-center gap-0.5 cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(s => !s)}
    >
      <span
        className="border-b border-dotted border-gray-400 font-medium"
        style={{ color: '#1E3A8A' }}
      >
        {term}
      </span>
      <HelpCircle className="w-3 h-3 text-gray-400 shrink-0" />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 p-3 rounded-xl text-left"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 30px -8px rgba(0,0,0,0.12)',
            }}
          >
            <p className="text-[11px] leading-relaxed text-gray-600" style={{ fontFamily: '"Inter", sans-serif' }}>
              {explanation}
            </p>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderTop: 'none', borderLeft: 'none' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

/* ── Live Network Ticker ─────────────────────────────────────── */
const MetricsTicker = ({ stats }) => {
  const avgScore = stats.workers > 0 
    ? Math.min(4.8, (3.5 + (stats.endorsements / Math.max(stats.workers, 1)) * 0.3)).toFixed(1) 
    : '—';

  const baseItems = [
    { icon: Users,      label: 'Workers Verified',    value: String(stats.workers || 0), color: '#EA580C' },
    { icon: Award,      label: 'Endorsements',        value: String(stats.endorsements || 0), color: '#1E3A8A' },
    { icon: Star,       label: 'Trust Score',          value: `${avgScore} / 5.0`, color: '#10B981' },
    { icon: Globe,      label: 'Network',              value: 'Stellar Testnet', color: '#6366F1' },
    { icon: Blocks,     label: 'Smart Contracts',      value: 'Soroban', color: '#EA580C' },
    { icon: Wallet,     label: 'Wallet',               value: 'Freighter', color: '#10B981' },
    { icon: ShieldCheck,label: 'Credential',           value: 'Soulbound', color: '#1E3A8A' },
    { icon: Zap,        label: 'Minting Fee',          value: 'Sponsored', color: '#10B981' },
  ];

  const items = [...baseItems, ...baseItems, ...baseItems];

  return (
    <div
      className="w-full relative z-10 overflow-hidden mb-8"
      style={{
        height: '50px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      {/* Fade masks on left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #FFFFFF, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #FFFFFF, transparent)' }} />

      <div
        className="flex items-center h-full whitespace-nowrap w-max"
        style={{ animation: 'ticker-scroll 60s linear infinite' }}
      >
        {items.map((m, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2 shrink-0 mx-5">
              <m.icon className="w-3.5 h-3.5 shrink-0" style={{ color: m.color, opacity: 0.7 }} />
              <span
                className="text-[10px] uppercase tracking-[0.15em] font-semibold"
                style={{ color: '#9CA3AF' }}
              >
                {m.label}
              </span>
              <span
                className="text-[13px] font-bold"
                style={{ color: m.color, fontFamily: '"Inter", sans-serif' }}
              >
                {m.value}
              </span>
            </div>
            {/* Diamond separator */}
            <span className="shrink-0 text-[6px]" style={{ color: '#D1D5DB' }}>◆</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Landing = () => {
  /* ── Live stats from localStorage ───────────────────────────── */
  const [liveStats, setLiveStats] = useState({ workers: 0, endorsements: 0 });

  useEffect(() => {
    const fetchStats = () => {
      const registry = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
      let totalEndorsements = 0;
      registry.forEach(addr => {
        const endorsements = JSON.parse(localStorage.getItem(`endorsements_${addr}`) || '[]');
        totalEndorsements += endorsements.length;
      });
      
      // Update state only if changed to avoid unnecessary re-renders
      setLiveStats(prev => {
        if (prev.workers === registry.length && prev.endorsements === totalEndorsements) {
          return prev;
        }
        return { workers: registry.length, endorsements: totalEndorsements };
      });
    };

    // Initial fetch
    fetchStats();

    // Listen to storage events (catches updates from other tabs)
    window.addEventListener('storage', fetchStats);

    // Poll every 2 seconds (catches updates from the current tab / background events)
    const interval = setInterval(fetchStats, 2000);

    return () => {
      window.removeEventListener('storage', fetchStats);
      clearInterval(interval);
    };
  }, []);

  const steps = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      step: '01',
      title: 'Register & Mint',
      description: (
        <span>
          Connect your{' '}
          <Tooltip term="Freighter wallet" explanation="Freighter is a free browser extension by the Stellar Foundation. Think of it as your digital ID and wallet — it holds your keys and signs actions." />
          , fill your details, and mint a{' '}
          <Tooltip term="soulbound credential" explanation="A soulbound token is a digital certificate permanently tied to you. It cannot be sold or transferred — proving it's genuinely yours." />
          {' '}to Stellar.
        </span>
      ),
      link: '/worker',
    },
    {
      icon: <Star className="w-5 h-5" />,
      step: '02',
      title: 'Get Endorsed',
      description: (
        <span>
          Employers submit{' '}
          <Tooltip term="on-chain endorsements" explanation="'On-chain' means the data is written directly to the Stellar blockchain — a public, tamper-proof ledger that anyone can verify." />
          {' '}with ratings and feedback — building your reputation.
        </span>
      ),
      link: '/endorse',
    },
    {
      icon: <Search className="w-5 h-5" />,
      step: '03',
      title: 'Verify & Share',
      description: (
        <span>
          Anyone can audit a worker's score and endorsement history through a{' '}
          <Tooltip term="tamper-proof profile" explanation="Since all data lives on the blockchain, no one — not even us — can edit or delete it. What you see is guaranteed authentic." />
          .
        </span>
      ),
      link: '/verify',
    },
  ];

  const featureCards = [
    { value: '2B+', title: 'Unbanked Workers', body: 'Serving the world\'s informal economy with verifiable, portable credentials.', icon: Globe, accent: '#1E3A8A' },
    { value: 'Zero-Cost', title: 'Credentials', body: 'Fee-sponsored minting ensures zero barriers to entry for workers.', icon: Zap, accent: '#EA580C' },
    { value: 'Freighter', title: 'Powered', body: 'Seamless wallet integration with Stellar\'s premier browser extension.', icon: Wallet, accent: '#10B981' },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-gray-900">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <main className="relative pt-[120px] sm:pt-[140px] pb-12 px-5 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 14px 0 rgba(234, 88, 12, 0.1)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: 'monospace', color: '#6B7280' }}
          >
            The New Standard for Trust
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          className="mb-5"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(3.5rem, 9vw, 7rem)',
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: '#111827',
          }}
        >
          Your Work. Your Reputation.<br />
          <span className="text-shimmer">On-Chain Forever.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8 text-base leading-relaxed"
          style={{
            fontFamily: '"Inter", sans-serif',
            color: '#4B5563',
            maxWidth: '42ch',
            fontWeight: 400,
          }}
        >
          A sovereign, portable credential system for informal economy workers — built on Stellar.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 w-full sm:w-auto"
        >
          {/* Shiny Border Button — I'm a Worker */}
          <Link to="/worker" className="w-full sm:w-auto">
            <div className="shiny-border">
              <div
                className="shiny-border-inner px-9 py-4 sm:py-3.5 font-semibold uppercase tracking-[0.18em] text-[12px] sm:text-[11px] text-white flex items-center justify-center gap-2.5 min-h-[48px]"
              >
                <ShieldCheck className="w-4 h-4" />
                I'm a Worker
              </div>
            </div>
          </Link>

          {/* Glass Button — Find Workers */}
          <Link
            to="/discover"
            className="w-full sm:w-auto px-9 py-4 sm:py-3.5 rounded-full font-semibold uppercase tracking-[0.18em] text-[12px] sm:text-[11px] flex items-center justify-center gap-2.5 transition-all hover:bg-gray-50 min-h-[48px]"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#1E3A8A',
            }}
          >
            <Users className="w-4 h-4 text-[#EA580C]" />
            Find Workers
          </Link>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-3 sm:gap-4 px-5 py-2.5 rounded-full mb-4"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#10B981', animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
            <span className="text-[10px] font-bold" style={{ fontFamily: 'monospace', color: '#6B7280' }}>
              <span style={{ color: '#EA580C' }}>{liveStats.workers}</span> Workers Verified
            </span>
          </div>
          <div className="w-px h-3" style={{ background: '#E5E7EB' }} />
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" style={{ color: '#1E3A8A', opacity: 0.8 }} />
            <span className="text-[10px] font-bold" style={{ fontFamily: 'monospace', color: '#6B7280' }}>
              <span style={{ color: '#1E3A8A' }}>{liveStats.endorsements}</span> Endorsements
            </span>
          </div>
          <div className="w-px h-3" style={{ background: '#E5E7EB' }} />
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" style={{ color: '#10B981', opacity: 0.8 }} />
            <span className="text-[10px] font-bold" style={{ fontFamily: 'monospace', color: '#6B7280' }}>
              Built on <span style={{ color: '#10B981' }}>Stellar</span>
            </span>
          </div>
        </motion.div>
      </main>

      {/* ── Network Metrics Grid ───────────────────────────────────── */}
      <FadeUp>
        <MetricsTicker stats={liveStats} />
      </FadeUp>

      {/* ── Feature Cards ────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {featureCards.map((card, idx) => (
            <FadeUp key={idx} delay={idx * 0.1}>
              <div
                className="group p-10 rounded-3xl transition-all duration-500 cursor-default relative overflow-hidden"
                style={{
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.borderColor = 'rgba(30,58,138,0.2)';
                  e.currentTarget.style.boxShadow = '0 12px 40px -15px rgba(30,58,138,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${card.accent}15`, color: card.accent }}
                >
                  <card.icon className="w-6 h-6" />
                </div>

                <h3
                  className="text-[28px] mb-2"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: '#111827',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: '"Inter", sans-serif', color: '#4B5563', fontWeight: 400 }}
                >
                  {card.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="relative py-12 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                }}
              >
                <ArrowRight className="w-2.5 h-2.5 text-[#EA580C]" />
                <span className="label-mono text-gray-600">How It Works</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl mb-3 text-gray-900"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                }}
              >
                Three Steps to <span className="text-[#1E3A8A]">Verified Trust</span>
              </h2>
              <p className="max-w-lg mx-auto text-sm" style={{ color: '#4B5563', fontWeight: 400 }}>
                From registration to reputation — your journey on the decentralized trust layer.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <Link to={step.link} className="block group h-full">
                  <div
                    className="p-6 rounded-2xl relative overflow-hidden h-full transition-all duration-500"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(30,58,138,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    {/* Step watermark */}
                    <div className="absolute top-4 right-5">
                      <span
                        className="text-4xl font-bold"
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          color: 'rgba(30, 58, 138, 0.15)',
                        }}
                      >
                        {step.step}
                      </span>
                    </div>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        color: '#1E3A8A',
                      }}
                    >
                      {step.icon}
                    </div>

                    <h3
                      className="text-lg mb-2 text-gray-900 group-hover:text-[#1E3A8A] transition-colors"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B7280', fontWeight: 400 }}>
                      {step.description}
                    </p>

                    <div
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] font-bold transition-colors text-gray-400 group-hover:text-[#1E3A8A]"
                    >
                      Get Started <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Signals / Built With ─────────────────────────── */}
      <section className="relative py-12 sm:py-16 px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                }}
              >
                <HandshakeIcon className="w-2.5 h-2.5 text-[#EA580C]" />
                <span className="label-mono text-gray-600">Built With</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl mb-3 text-gray-900"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                }}
              >
                Powered by <span className="text-[#1E3A8A]">Trusted Infrastructure</span>
              </h2>
              <p className="max-w-md mx-auto text-sm" style={{ color: '#4B5563', fontWeight: 400 }}>
                TrustChain is built on industry-leading Web3 infrastructure trusted by millions.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                name: 'Stellar',
                desc: 'Blockchain Network',
                icon: Globe,
                accent: '#1E3A8A',
                url: 'https://stellar.org',
              },
              {
                name: 'Soroban',
                desc: 'Smart Contracts',
                icon: Blocks,
                accent: '#EA580C',
                url: 'https://soroban.stellar.org',
              },
              {
                name: 'Freighter',
                desc: 'Wallet Extension',
                icon: Wallet,
                accent: '#10B981',
                url: 'https://freighter.app',
              },
              {
                name: 'Horizon',
                desc: 'API Gateway',
                icon: Zap,
                accent: '#6366F1',
                url: 'https://developers.stellar.org/docs/data/horizon',
              },
            ].map((partner, idx) => (
              <FadeUp key={idx} delay={idx * 0.08}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 sm:p-6 rounded-2xl text-center transition-all duration-500"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = `${partner.accent}40`;
                    e.currentTarget.style.boxShadow = `0 8px 25px -8px ${partner.accent}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${partner.accent}10`, color: partner.accent }}
                  >
                    <partner.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4
                    className="text-sm font-semibold mb-0.5 text-gray-900 group-hover:text-[#1E3A8A] transition-colors flex items-center justify-center gap-1"
                  >
                    {partner.name}
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </h4>
                  <p className="text-[10px] text-gray-500" style={{ fontFamily: 'monospace' }}>
                    {partner.desc}
                  </p>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security & Trust Footer Bar ────────────────────────── */}
      <FadeUp delay={0.1}>
        <div
          className="py-6 sm:py-8 mx-5 sm:mx-8 mb-8 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
          style={{
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
          }}
        >
          {[
            { icon: Globe, text: 'Stellar Network', color: '#1E3A8A' },
            { icon: Lock, text: 'Soulbound & Non-Transferable', color: '#EA580C' },
            { icon: ShieldCheck, text: 'Zero-Fee Sponsored', color: '#10B981' },
            { icon: Target, text: 'Testnet Live', color: '#6366F1' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: '#6B7280' }}>
              <badge.icon className="w-3.5 h-3.5" style={{ color: badge.color }} />
              {badge.text}
            </div>
          ))}
        </div>
      </FadeUp>
    </div>
  );
};

export default Landing;
