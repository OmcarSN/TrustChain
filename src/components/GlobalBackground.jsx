import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GlobalBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate mouse offset for parallax (very subtle)
  const xOffset = (mousePosition.x / windowSize.width - 0.5) * 50;
  const yOffset = (mousePosition.y / windowSize.height - 0.5) * 50;

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
        className="absolute top-1/2 left-1/2 -ml-[50vw] -mt-[50vh] w-[100vw] h-[100vh]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.05) 0%, rgba(30, 58, 138, 0.04) 50%, transparent 100%)',
          filter: 'blur(100px)',
          transformOrigin: 'center center',
          opacity: 0.8
        }}
      />

      {/* 2. Interactive Following Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 3 }}
        style={{
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
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

      {/* 4. Fine Grain Noise Layer */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* 5. Parallax Floating Tech Accents (Circuit nodes/stars) */}
      <motion.div 
        className="absolute inset-0 opacity-60"
        animate={{
          x: xOffset * -1,
          y: yOffset * -1,
        }}
        transition={{ type: 'spring', damping: 50, stiffness: 100 }}
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
