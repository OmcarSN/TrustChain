import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Award, Wallet, ArrowRight, UserPlus, Star, Search, Sparkles, Globe, Target, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const steps = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      step: '01',
      title: 'Register & Mint',
      description: 'Connect your Freighter wallet, fill your details, and mint a soulbound credential to Stellar.',
      link: '/worker',
      color: { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', gradient: 'from-accent to-purple-500', shadow: 'group-hover:shadow-accent/15' },
    },
    {
      icon: <Star className="w-5 h-5" />,
      step: '02',
      title: 'Get Endorsed',
      description: 'Employers submit on-chain endorsements with ratings and feedback — building your reputation.',
      link: '/endorse',
      color: { bg: 'bg-amber-400/10', border: 'border-amber-400/20', text: 'text-amber-400', gradient: 'from-amber-400 to-orange-500', shadow: 'group-hover:shadow-amber-400/15' },
    },
    {
      icon: <Search className="w-5 h-5" />,
      step: '03',
      title: 'Verify & Share',
      description: 'Anyone can audit a worker\'s score and endorsement history through a tamper-proof profile.',
      link: '/verify',
      color: { bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'text-emerald-400', gradient: 'from-emerald-400 to-teal-500', shadow: 'group-hover:shadow-emerald-400/15' },
    },
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
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-accent">The New Standard for Trust</span>
        </motion.div>
        
        {/* Headline — compact */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-[1.05]"
        >
          Your Work. Your Reputation. <br />
          <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent">On-Chain Forever.</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-white/25 text-sm sm:text-base max-w-2xl mb-7 leading-relaxed font-medium"
        >
          A sovereign, portable credential system for informal economy workers — built on Stellar.
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
            className="group w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-xl font-black uppercase tracking-[0.18em] text-[10px] transition-all shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            I'm a Worker
          </Link>
          <Link 
            to="/discover"
            className="group w-full sm:w-auto px-8 py-3.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl font-black uppercase tracking-[0.18em] text-[10px] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            Find Workers
          </Link>
        </motion.div>

        {/* Stats Strip — inline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 gap-3 w-full max-w-3xl"
        >
          {[
            { value: '2B+', label: 'Unbanked Workers', icon: Globe },
            { value: 'Zero-Cost', label: 'Credentials', icon: Zap },
            { value: 'Freighter', label: 'Powered', icon: Wallet },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="flex flex-col items-center p-3.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <stat.icon className="w-3.5 h-3.5 text-accent/35 mb-1.5" />
              <span className="text-lg sm:text-xl font-black mb-0.5 tracking-tight">{stat.value}</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/15">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="relative py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header — compact */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.05] mb-3">
              <ArrowRight className="w-2.5 h-2.5 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">How It Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">
              Three Steps to{' '}
              <span className="bg-gradient-to-r from-accent via-purple-400 to-accent/50 bg-clip-text text-transparent">Verified Trust</span>
            </h2>
            <p className="text-white/18 max-w-lg mx-auto font-medium text-xs sm:text-sm">
              From registration to reputation — your journey on the decentralized trust layer.
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
                    className="p-5 rounded-xl relative overflow-hidden h-full transition-all duration-300 hover:translate-y-[-2px]"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
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
                      Get Started <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
          { icon: Globe, text: 'Stellar Network' },
          { icon: ShieldCheck, text: 'Soulbound Tokens' },
          { icon: Target, text: 'Testnet Live' },
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
