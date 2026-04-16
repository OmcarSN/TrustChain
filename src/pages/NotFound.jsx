import React from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-[100px] px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10" style={{ background: 'rgba(139,92,246,0.05)', filter: 'blur(150px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none -z-10" style={{ background: 'rgba(239,68,68,0.05)', filter: 'blur(100px)' }} />

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-md p-10 rounded-[20px] relative overflow-hidden w-full"
          style={{
            background: 'rgba(10,10,10,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.div
            initial={{ rotate: -12, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-7"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              boxShadow: '0 0 30px -10px rgba(139,92,246,0.3)',
            }}
          >
            <ShieldOff className="w-10 h-10 text-[#8B5CF6]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-6xl mb-1.5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>404</h1>
            <h2 className="label-mono mb-4 text-[#a3a3a3]">Route Not Found</h2>
            <p className="text-xs font-medium leading-relaxed mb-8" style={{ color: '#737373' }}>
              The on-chain path you're looking for doesn't exist. 
              It may have been moved or never deployed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-3"
          >
            <Link to="/" className="w-full">
              <div className="shiny-border">
                <div className="shiny-border-inner w-full py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2.5">
                  <Home className="w-4 h-4 text-[#8B5CF6]" />
                  Return to Home
                </div>
              </div>
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-4 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2.5 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#a3a3a3' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
