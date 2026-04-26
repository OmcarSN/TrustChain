import React from 'react';

const GlobalBackground = () => {
  return (
    <>
      {/* Background Grid Animation */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'gridMove 20s linear infinite'
      }} />
      
      {/* Animated Light leaks / Orbs */}
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat 15s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat2 18s ease-in-out infinite alternate-reverse' }} />
      
      {/* Noise Texture Overlay (High Performance CSS Pattern) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      />

      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.05); }
          100% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
          100% { transform: translate(-20px, 30px) scale(0.9); }
        }
      `}</style>
    </>
  );
};

export default GlobalBackground;
