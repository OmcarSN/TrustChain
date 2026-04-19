import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, ArrowRight, UserPlus, Star, Search, Sparkles, Globe, Target, Zap, Users, Lock, Eye, LinkIcon, CheckCircle2, TrendingUp, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from '../components/TrustChainLogo';

/* ── Animated Counter ─────────────────────────────────────────── */
const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (isNaN(end)) { setCount(target); return; }
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{typeof count === 'number' ? count.toLocaleString() : count}{suffix}</>;
};

/* ── Floating Nodes Background ────────────────────────────────── */
const FloatingNodes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-accent/30"
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.7,
          ease: 'easeInOut',
        }}
      />
    ))}
    {/* Connecting lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
      <line x1="15%" y1="20%" x2="30%" y2="45%" stroke="#7c3aed" strokeWidth="1" />
      <line x1="30%" y1="45%" x2="60%" y2="20%" stroke="#7c3aed" strokeWidth="1" />
      <line x1="60%" y1="20%" x2="75%" y2="70%" stroke="#7c3aed" strokeWidth="1" />
      <line x1="45%" y1="70%" x2="75%" y2="70%" stroke="#7c3aed" strokeWidth="1" />
    </svg>
  </div>
);

const Landing = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      step: '01',
      title: t('landing.step1Title'),
      description: t('landing.step1Desc'),
      link: '/worker',
      color: { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', gradient: 'from-accent to-purple-500', shadow: 'group-hover:shadow-accent/15' },
    },
    {
      icon: <Star className="w-5 h-5" />,
      step: '02',
      title: t('landing.step2Title'),
      description: t('landing.step2Desc'),
      link: '/endorse',
      color: { bg: 'bg-amber-400/10', border: 'border-amber-400/20', text: 'text-amber-400', gradient: 'from-amber-400 to-orange-500', shadow: 'group-hover:shadow-amber-400/15' },
    },
    {
      icon: <Search className="w-5 h-5" />,
      step: '03',
      title: t('landing.step3Title'),
      description: t('landing.step3Desc'),
      link: '/verify',
      color: { bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'text-emerald-400', gradient: 'from-emerald-400 to-teal-500', shadow: 'group-hover:shadow-emerald-400/15' },
    },
  ];

  const features = [
    { icon: <Lock className="w-5 h-5" />, title: t('landing.feat1Title', 'Soulbound Credentials'), desc: t('landing.feat1Desc', 'Non-transferable, tamper-proof credentials tied to worker identity forever.'), color: 'text-purple-400' },
    { icon: <Eye className="w-5 h-5" />, title: t('landing.feat2Title', 'Transparent Verification'), desc: t('landing.feat2Desc', 'Every endorsement is publicly auditable on the Stellar blockchain.'), color: 'text-blue-400' },
    { icon: <LinkIcon className="w-5 h-5" />, title: t('landing.feat3Title', 'Chain-Link Reputation'), desc: t('landing.feat3Desc', 'Time-weighted scoring with decay algorithms for fair reputation.'), color: 'text-emerald-400' },
    { icon: <TrendingUp className="w-5 h-5" />, title: t('landing.feat4Title', 'Trust Tiers'), desc: t('landing.feat4Desc', 'Bronze → Silver → Gold → Platinum progression based on endorsements.'), color: 'text-amber-400' },
    { icon: <FileCheck className="w-5 h-5" />, title: t('landing.feat5Title', 'Dispute Resolution'), desc: t('landing.feat5Desc', 'On-chain dispute filing and admin-mediated resolution system.'), color: 'text-red-400' },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: t('landing.feat6Title', 'Circuit Breaker'), desc: t('landing.feat6Desc', 'Emergency pause mechanism protects the network during attacks.'), color: 'text-cyan-400' },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30 text-white">
      {/* ── Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[500px] bg-accent/6 rounded-full blur-[160px] top-[-5%] left-[-5%]"
          animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] bg-purple-800/6 rounded-full blur-[130px] bottom-[10%] right-[-5%]"
          animate={{ y: [0, -15, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      <FloatingNodes />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <main className="relative pt-22 pb-8 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/8 border border-accent/12 mb-5"
        >
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-accent">{t('landing.badge')}</span>
        </motion.div>

        {/* Animated Logo Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="relative">
            <TrustChainLogo size={80} className="tc-logo-glow" />
            {/* Orbiting ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-[22px] border border-accent/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-[1.3] sm:leading-[1.25]"
        >
          {t('landing.titleP1')} <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent inline-block mt-2 sm:mt-1 tc-gradient-shift">{t('landing.titleP2')}</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-white/25 text-sm sm:text-base max-w-2xl mb-7 leading-relaxed font-medium"
        >
          {t('landing.desc')}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 w-full sm:w-auto"
        >
          <Link 
            to="/worker"
            className="group w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-xl font-black uppercase tracking-[0.18em] text-[10px] transition-all shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 active:scale-[0.97] flex items-center justify-center gap-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform relative z-10" />
            <span className="relative z-10">{t('landing.btnWorker')}</span>
          </Link>
          <Link 
            to="/discover"
            className="group w-full sm:w-auto px-8 py-3.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl font-black uppercase tracking-[0.18em] text-[10px] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            {t('landing.btnFind')}
          </Link>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-xs text-gray-400 text-center py-3 mb-4 w-full"
        >
          {t('landing.statsBar')}
        </motion.div>

        {/* Stats Strip with animated counters */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 gap-3 w-full max-w-3xl"
        >
          {[
            { value: '2', suffix: 'B+', label: t('landing.stat1Label'), icon: Globe },
            { value: t('landing.stat2Value'), label: t('landing.stat2Label'), icon: Zap },
            { value: t('landing.stat3Value'), label: t('landing.stat3Label'), icon: Award },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="group flex flex-col items-center p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/20 hover:bg-accent/5 transition-all duration-300"
            >
              <stat.icon className="w-3.5 h-3.5 text-accent/35 mb-1.5 group-hover:text-accent/70 transition-colors" />
              <span className="text-lg sm:text-xl font-black mb-0.5 tracking-tight">
                {stat.suffix ? <><AnimatedCounter target={stat.value} suffix={stat.suffix} /></> : stat.value}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/15">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* ── Why TrustChain? Feature Grid ─────────────────────── */}
      <section className="relative py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.05] mb-3">
              <Sparkles className="w-2.5 h-2.5 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{t('landing.whyTitle', 'Why TrustChain?')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">
              {t('landing.whyHeading1', 'Enterprise-Grade')}{' '}
              <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent">{t('landing.whyHeading2', 'Trust Infrastructure')}</span>
            </h2>
            <p className="text-white/18 max-w-lg mx-auto font-medium text-xs sm:text-sm">
              {t('landing.whyDesc', 'Built with advanced Soroban smart contracts featuring circuit breakers, time-decay algorithms, and multi-tier verification.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/15 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center mb-3 ${feat.color} group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold mb-1 tracking-tight group-hover:text-accent transition-colors">{feat.title}</h3>
                <p className="text-[11px] text-white/20 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="relative py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.05] mb-3">
              <ArrowRight className="w-2.5 h-2.5 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{t('landing.howItWorks')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">
              {t('landing.stepsTitleP1')}{' '}
              <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent">{t('landing.stepsTitleP2')}</span>
            </h2>
            <p className="text-white/18 max-w-lg mx-auto font-medium text-xs sm:text-sm">
              {t('landing.stepsDesc')}
            </p>
          </motion.div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link to={step.link} className="block group h-full">
                  <div 
                    className="p-5 rounded-xl relative overflow-hidden h-full transition-all duration-300 hover:translate-y-[-2px] bg-white/[0.03] border border-white/[0.06] hover:border-accent/15"
                  >
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${step.color.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Step watermark */}
                    <div className="absolute top-4 right-4">
                      <span className="text-3xl font-black text-white/[0.02] group-hover:text-accent/5 transition-colors">{step.step}</span>
                    </div>

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg ${step.color.bg} ${step.color.border} border ${step.color.text} flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg ${step.color.shadow}`}>
                      {step.icon}
                    </div>

                    <h3 className="text-sm font-black mb-1.5 tracking-tight group-hover:text-accent transition-colors">{step.title}</h3>
                    <p className="text-white/18 text-[11px] leading-relaxed font-medium mb-4">{step.description}</p>

                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white/8 group-hover:text-accent transition-colors">
                      {t('landing.getStarted')} <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built On / Tech Stack ─────────────────────────────── */}
      <section className="relative py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/15">{t('landing.builtWith', 'Built With Leading Technology')}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { name: 'Stellar', desc: t('landing.techBlockchain') },
              { name: 'Soroban', desc: t('landing.techSmartContracts') },
              { name: 'React', desc: t('landing.techFrontend') },
              { name: 'Freighter', desc: t('landing.techWallet') },
              { name: 'Rust', desc: t('landing.techBackend') },
            ].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex flex-col items-center gap-1 group"
              >
                <span className="text-sm font-black text-white/30 group-hover:text-accent/70 tracking-tight transition-colors">{tech.name}</span>
                <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/10">{tech.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer Trust Badges ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="pb-8 flex items-center justify-center gap-4 text-white/10"
      >
        {[
          { icon: Globe, text: t('landing.badge1') },
          { icon: ShieldCheck, text: t('landing.badge2') },
          { icon: Target, text: t('landing.badge3') },
        ].map((badge, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="w-0.5 h-0.5 rounded-full bg-white/6" />}
            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
              <badge.icon className="w-2.5 h-2.5" /> {badge.text}
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default Landing;
