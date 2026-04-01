import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Award, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/20 text-accent text-sm font-medium mb-8"
        >
          <Shield className="w-4 h-4" />
          The New Standard for Trust
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.05]"
        >
          Your Work. Your Reputation. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">On-Chain Forever.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 text-lg md:text-2xl max-w-3xl mb-12 leading-relaxed font-medium"
        >
          A sovereign, portable credential system for informal economy workers — built on Stellar.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24 w-full sm:w-auto"
        >
          <Link 
            to="/worker"
            className="w-full sm:w-auto px-12 py-5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-accent/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            I'm a Worker
          </Link>
          <Link 
            to="/endorse"
            className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl group"
          >
            <Award className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            I'm an Employer
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl border-t border-white/10 pt-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black text-white mb-2">2B+</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Unbanked Workers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black text-white mb-2">Zero-Cost</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Credentials</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black text-white mb-2">Freighter</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Powered</span>
          </div>
        </motion.div>
      </main>

      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
};

export default Landing;
