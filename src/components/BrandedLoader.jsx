import React from 'react';
import { motion } from 'framer-motion';
import TrustChainLogo from './TrustChainLogo';

/**
 * BrandedLoader — Full-screen loading/splash screen with brand identity
 * Used during initial app load and page transitions
 */
const BrandedLoader = ({ message = 'Loading...' }) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: '#F9FAFB',
        backgroundImage: 'radial-gradient(rgba(30, 58, 138, 0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(30,58,138,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Logo with pulse animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative mb-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [1, 0.9, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <TrustChainLogo size={48} variant="icon" />
        </motion.div>

        {/* Orbiting dot */}
        <motion.div
          className="absolute w-2 h-2 rounded-full"
          style={{ background: '#EA580C' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          initial={{ x: 30, y: 20 }}
        />
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-48 h-1 rounded-full overflow-hidden mb-4"
        style={{ background: '#E5E7EB' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #1E3A8A, #EA580C, #10B981)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: '#6B7280' }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default BrandedLoader;
