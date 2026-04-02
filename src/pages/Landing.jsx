import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Award, Wallet, ArrowRight, UserPlus, Star, Search, Sparkles, Globe, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Floating Orb ─────────────────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none -z-10 ${className}`}
    animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 10, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const Landing = () => {
  const steps = [
    {
      icon: <UserPlus className="w-7 h-7" />,
      step: '01',
      title: 'Register & Mint',
      description: 'Connect your Freighter wallet, fill in your professional details, and mint your soulbound credential directly to the Stellar blockchain.',
      link: '/worker'
    },
    {
      icon: <Star className="w-7 h-7" />,
      step: '02',
      title: 'Get Endorsed',
      description: 'Employers and clients verify your work by submitting on-chain endorsements with ratings and feedback — building your immutable reputation.',
      link: '/endorse'
    },
    {
      icon: <Search className="w-7 h-7" />,
      step: '03',
      title: 'Verify & Share',
      description: 'Anyone can audit a worker\'s reputation score, star breakdown, and endorsement history through a shareable, tamper-proof profile link.',
      link: '/verify'
    }
  ];

  const stepColors = [
    { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', hoverShadow: 'group-hover:shadow-accent/20', gradient: 'from-accent to-purple-500' },
    { bg: 'bg-amber-400/10', border: 'border-amber-400/20', text: 'text-amber-400', hoverShadow: 'group-hover:shadow-amber-400/20', gradient: 'from-amber-400 to-orange-500' },
    { bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'text-emerald-400', hoverShadow: 'group-hover:shadow-emerald-400/20', gradient: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30">
      {/* ── Background ──────────────────────────────────────── */}
      <FloatingOrb className="w-[800px] h-[600px] bg-accent/8 blur-[180px] top-[-10%] left-[-10%]" />
      <FloatingOrb className="w-[500px] h-[500px] bg-purple-800/8 blur-[140px] bottom-[-10%] right-[-10%]" delay={3} />
      <FloatingOrb className="w-[300px] h-[300px] bg-indigo-900/5 blur-[100px] top-[60%] left-[60%]" delay={6} />
      <div className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <main className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-accent/8 border border-accent/12 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">The New Standard for Trust</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-7 tracking-tighter leading-[1.02]"
        >
          Your Work. Your Reputation. <br />
          <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent">On-Chain Forever.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/30 text-base sm:text-lg md:text-xl max-w-3xl mb-12 leading-relaxed font-medium"
        >
          A sovereign, portable credential system for informal economy workers — built on Stellar.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 w-full sm:w-auto"
        >
          <Link 
            to="/worker"
            className="group w-full sm:w-auto px-10 py-[18px] bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-accent/25 hover:shadow-2xl hover:shadow-accent/35 active:scale-95 flex items-center justify-center gap-2.5"
          >
            <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            I'm a Worker
          </Link>
          <Link 
            to="/endorse"
            className="group w-full sm:w-auto px-10 py-[18px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Award className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            I'm an Employer
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl"
        >
          {[
            { value: '2B+', label: 'Unbanked Workers', icon: Globe },
            { value: 'Zero-Cost', label: 'Credentials', icon: Zap },
            { value: 'Freighter', label: 'Powered', icon: Wallet },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex flex-col items-center p-5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <stat.icon className="w-4 h-4 text-accent/40 mb-2" />
              <span className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/18">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="relative py-28 px-6">
        <FloatingOrb className="w-[600px] h-[400px] bg-accent/5 blur-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={2} />

        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-5">
              <ArrowRight className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
              Three Steps to <br />
              <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent">Verified Trust</span>
            </h2>
            <p className="text-white/20 max-w-xl mx-auto font-medium text-base">
              From registration to reputation — your journey on the decentralized trust layer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, idx) => {
              const color = stepColors[idx];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                >
                  <Link to={step.link} className="block group">
                    <div 
                      className="p-8 rounded-2xl relative overflow-hidden h-full transition-all duration-300 hover:translate-y-[-2px]"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {/* Top accent */}
                      <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      {/* Step watermark */}
                      <div className="absolute top-6 right-6">
                        <span className="text-5xl font-black text-white/[0.02] group-hover:text-accent/5 transition-colors duration-500">{step.step}</span>
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl ${color.bg} ${color.border} border ${color.text} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${color.hoverShadow}`}>
                        {step.icon}
                      </div>

                      <h3 className="text-lg font-black mb-2.5 tracking-tight group-hover:text-accent transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-white/20 text-[13px] leading-relaxed font-medium mb-6">
                        {step.description}
                      </p>

                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-accent transition-colors duration-300">
                        Get Started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Connecting dots (desktop) */}
          <div className="hidden md:flex items-center justify-center mt-8 gap-0">
            {[1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                className="w-24 h-[2px] bg-gradient-to-r from-accent/20 to-accent/5 origin-left mx-4"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer Trust Badges ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="pb-16 flex items-center justify-center gap-5 text-white/10"
      >
        <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
          <Globe className="w-3 h-3" /> Stellar Network
        </div>
        <div className="w-1 h-1 rounded-full bg-white/5" />
        <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" /> Soulbound Tokens
        </div>
        <div className="w-1 h-1 rounded-full bg-white/5" />
        <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
          <Target className="w-3 h-3" /> Testnet Live
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
