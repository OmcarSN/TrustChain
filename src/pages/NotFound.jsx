import React from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, Home, ArrowLeft, Sparkles, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Floating Orb ─────────────────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none -z-10 ${className}`}
    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <FloatingOrb className="w-[600px] h-[600px] bg-accent/5 blur-[150px] top-1/4 left-1/2 -translate-x-1/2" />
      <FloatingOrb className="w-[300px] h-[300px] bg-red-900/5 blur-[100px] bottom-1/4 right-1/4" delay={2} />
      <div className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: '70px 70px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-md p-10 rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(124,58,237,0.06) 0%, rgba(255,255,255,0.03) 60%, rgba(124,58,237,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/8 rounded-full blur-[80px]" />

        <motion.div
          initial={{ rotate: -12, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/15 to-purple-800/15 border border-accent/15 flex items-center justify-center mx-auto mb-7 shadow-[0_8px_32px_rgba(124,58,237,0.1)]"
        >
          <ShieldOff className="w-10 h-10 text-accent/60" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="text-6xl font-black tracking-tighter mb-1.5 bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">404</h1>
          <h2 className="text-sm font-black uppercase tracking-[0.25em] mb-3 text-white/40">Route Not Found</h2>
          <p className="text-white/20 text-xs font-medium leading-relaxed mb-8">
            The on-chain path you're looking for doesn't exist. 
            It may have been moved or never deployed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-2.5"
        >
          <Link 
            to="/"
            className="group w-full py-4 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent/20 active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full py-4 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
