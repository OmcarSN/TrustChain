import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const GlobalBackground = () => {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Smooth springs for cursor following and parallax
  const springConfig = { damping: 50, stiffness: 200, bounce: 0 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transforms to keep the 600px glow circle centered
  const orbX = useTransform(smoothX, (v) => v - 300);
  const orbY = useTransform(smoothY, (v) => v - 300);

  // Transforms for subtle parallax opposite to mouse movement
  const parallaxX = useTransform(smoothX, (v) => 
    ((v / (typeof window !== 'undefined' ? window.innerWidth : 1920)) - 0.5) * -50
  );
  const parallaxY = useTransform(smoothY, (v) => 
    ((v / (typeof window !== 'undefined' ? window.innerHeight : 1080)) - 0.5) * -50
  );

  useEffect(() => {
    // We only update the MotionValues, NOT React state.
    // This completely eliminates React re-renders on mousemove, fixing the lag.
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-10] w-full h-full overflow-hidden bg-[#F1F5F9] pointer-events-none">
      
      {/* 1. Underlying Base Gradient (Slow rotation) */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute top-1/2 left-1/2 -ml-[50vw] -mt-[50vh] w-[100vw] h-[100vh] will-change-transform"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.05) 0%, rgba(30, 58, 138, 0.04) 60%, transparent 100%)',
          transformOrigin: 'center center',
          opacity: 0.8
        }}
      />

      {/* 2. Interactive Following Glow (Driven by CSS Transform & MotionValues) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          x: orbX,
          y: orbY,
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.04) 0%, transparent 70%)',
        }}
      />

      {/* 3. Tech/Cyber Grid Layer (Dotted matrix) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}
      />

      {/* 4. Fine Grain Noise Layer (Removed feTurbulence for high-performance zoom) */}
      <div 
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: 'linear-gradient(45deg, rgba(30,58,138,0.05) 25%, transparent 25%, transparent 50%, rgba(30,58,138,0.05) 50%, rgba(30,58,138,0.05) 75%, transparent 75%, transparent)',
          backgroundSize: '4px 4px'
        }}
      />

      {/* 5. Parallax Floating Tech Accents (Driven by MotionValues) */}
      <motion.div 
        className="absolute inset-0 opacity-60 will-change-transform"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
      >
        {/* Floating elements distributed across view */}
        <div className="absolute top-[15%] left-[20%] w-[2px] h-[2px] bg-[#1E3A8A] shadow-[0_0_10px_2px_rgba(30,58,138,0.5)] rounded-full animate-pulse" />
        <div className="absolute top-[35%] right-[25%] w-[3px] h-[3px] bg-[#EA580C] shadow-[0_0_12px_3px_rgba(234,88,12,0.5)] rounded-full" style={{ animation: 'pulse-dot 4s infinite' }} />
        <div className="absolute bottom-[20%] left-[30%] w-[2px] h-[2px] bg-[#1E3A8A] opacity-40 rounded-full animate-ping" />
        <div className="absolute top-[60%] right-[15%] w-[1.5px] h-[1.5px] bg-[#10B981] shadow-[0_0_8px_1px_rgba(16,185,129,0.5)] rounded-full animate-pulse" />
        <div className="absolute top-[10%] right-[40%] w-[1px] h-[1px] bg-[#EA580C] opacity-30 rounded-full" />
        <div className="absolute bottom-[30%] left-[10%] w-[2px] h-[2px] bg-[#EA580C] opacity-50 rounded-full" style={{ animation: 'pulse-dot 3s infinite' }} />
        <div className="absolute top-[80%] left-[60%] w-[1px] h-[1px] bg-[#1E3A8A] opacity-30 rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
};

export default GlobalBackground;
