import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'purple', trend, sparkData, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isStringValue = typeof value === 'string' && isNaN(parseInt(value, 10));
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isStringValue) return;
    
    let startTime;
    let animId;
    const duration = 1400;
    const targetValue = parseInt(value, 10) || 0;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setDisplayValue(Math.floor(easeProgress * targetValue));

      if (progress < duration) {
        animId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(targetValue);
      }
    };

    if (targetValue > 0) {
      animId = requestAnimationFrame(animateCount);
    } else {
      setDisplayValue(targetValue);
    }

    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [value, isStringValue]);

  // Draw sparkline on canvas
  useEffect(() => {
    if (!sparkData || !sparkData.length || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const max = Math.max(...sparkData, 1);
    const min = Math.min(...sparkData, 0);
    const range = max - min || 1;
    const padY = 4;
    const stepX = w / (sparkData.length - 1);

    const points = sparkData.map((v, i) => ({
      x: i * stepX,
      y: padY + (1 - (v - min) / range) * (h - padY * 2),
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    const cMap = {
      purple: ['rgba(124,58,237,0.3)', 'rgba(124,58,237,0)'],
      blue:   ['rgba(96,165,250,0.3)', 'rgba(96,165,250,0)'],
      amber:  ['rgba(251,191,36,0.3)', 'rgba(251,191,36,0)'],
      green:  ['rgba(52,211,153,0.3)', 'rgba(52,211,153,0)'],
      cyan:   ['rgba(34,211,238,0.3)', 'rgba(34,211,238,0)'],
    };
    const [c1, c2] = cMap[color] || cMap.purple;
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);

    // Area
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cx = (points[i - 1].x + points[i].x) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cx, (points[i - 1].y + points[i].y) / 2);
    }
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    const strokeMap = {
      purple: '#a855f7', blue: '#60a5fa', amber: '#fbbf24', green: '#34d399', cyan: '#22d3ee',
    };
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cx = (points[i - 1].x + points[i].x) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cx, (points[i - 1].y + points[i].y) / 2);
    }
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = strokeMap[color] || strokeMap.purple;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [sparkData, color]);

  const colorMap = {
    purple: {
      glow: 'rgba(124,58,237,0.08)',
      accent: '#a855f7',
      iconBg: 'rgba(124,58,237,0.12)',
      iconBorder: 'rgba(124,58,237,0.15)',
      text: 'text-purple-400',
      border: 'rgba(124,58,237,0.06)',
      ring: 'rgba(124,58,237,0.25)',
    },
    cyan: {
      glow: 'rgba(34,211,238,0.08)',
      accent: '#22d3ee',
      iconBg: 'rgba(34,211,238,0.12)',
      iconBorder: 'rgba(34,211,238,0.15)',
      text: 'text-cyan-400',
      border: 'rgba(34,211,238,0.06)',
      ring: 'rgba(34,211,238,0.25)',
    },
    green: {
      glow: 'rgba(52,211,153,0.08)',
      accent: '#34d399',
      iconBg: 'rgba(52,211,153,0.12)',
      iconBorder: 'rgba(52,211,153,0.15)',
      text: 'text-emerald-400',
      border: 'rgba(52,211,153,0.06)',
      ring: 'rgba(52,211,153,0.25)',
    },
    amber: {
      glow: 'rgba(251,191,36,0.08)',
      accent: '#fbbf24',
      iconBg: 'rgba(251,191,36,0.12)',
      iconBorder: 'rgba(251,191,36,0.15)',
      text: 'text-amber-400',
      border: 'rgba(251,191,36,0.06)',
      ring: 'rgba(251,191,36,0.25)',
    },
    blue: {
      glow: 'rgba(96,165,250,0.08)',
      accent: '#60a5fa',
      iconBg: 'rgba(96,165,250,0.12)',
      iconBorder: 'rgba(96,165,250,0.15)',
      text: 'text-blue-400',
      border: 'rgba(96,165,250,0.06)',
      ring: 'rgba(96,165,250,0.25)',
    },
  };

  const c = colorMap[color] || colorMap.purple;

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-white/30';
  const trendBg = trend > 0 ? 'bg-emerald-400/10' : trend < 0 ? 'bg-red-400/10' : 'bg-white/5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl relative overflow-hidden group cursor-default"
      style={{
        background: `linear-gradient(160deg, ${c.glow} 0%, rgba(15,15,24,0.6) 40%, rgba(15,15,24,0.4) 100%)`,
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Hover glow ring */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${c.ring}, 0 0 30px ${c.glow}` }}
      />

      {/* Background sparkline */}
      {sparkData && sparkData.length > 1 && (
        <canvas
          ref={canvasRef}
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          style={{ height: '48%', opacity: 0.6 }}
        />
      )}

      <div className="relative z-10 p-5 pb-4">
        {/* Top row: title + icon */}
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 leading-tight max-w-[60%]">
            {title}
          </p>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{
              background: c.iconBg,
              border: `1px solid ${c.iconBorder}`,
            }}
          >
            {Icon && <Icon className={`w-4 h-4 ${c.text}`} />}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end gap-3 mb-1.5">
          <h2 className="text-3xl font-black text-white tracking-tight leading-none">
            {isStringValue ? value : displayValue.toLocaleString()}
          </h2>
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${trendBg} mb-1`}>
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className={`text-[10px] font-bold ${trendColor}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[10px] font-medium text-white/25 tracking-wide">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;
