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
      purple: ['rgba(30,58,138,0.1)', 'rgba(30,58,138,0)'],
      blue:   ['rgba(2,132,199,0.1)', 'rgba(2,132,199,0)'],
      amber:  ['rgba(234,88,12,0.1)', 'rgba(234,88,12,0)'],
      green:  ['rgba(16,185,129,0.1)', 'rgba(16,185,129,0)'],
      cyan:   ['rgba(2,132,199,0.1)', 'rgba(2,132,199,0)'],
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
      purple: '#1E3A8A', blue: '#0284C7', amber: '#EA580C', green: '#10B981', cyan: '#0284C7',
    };
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cx = (points[i - 1].x + points[i].x) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cx, (points[i - 1].y + points[i].y) / 2);
    }
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = strokeMap[color] || strokeMap.purple;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [sparkData, color]);

  const colorMap = {
    purple: {
      glow: 'rgba(30,58,138,0.06)',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      text: 'text-[#1E3A8A]',
    },
    cyan: {
      glow: 'rgba(2,132,199,0.06)',
      iconBg: '#F0F9FF',
      iconBorder: '#E0F2FE',
      text: 'text-[#0284C7]',
    },
    green: {
      glow: 'rgba(16,185,129,0.06)',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5',
      text: 'text-[#10B981]',
    },
    amber: {
      glow: 'rgba(234,88,12,0.06)',
      iconBg: '#FFF7ED',
      iconBorder: '#FFEDD5',
      text: 'text-[#EA580C]',
    },
    blue: {
      glow: 'rgba(2,132,199,0.06)',
      iconBg: '#F0F9FF',
      iconBorder: '#E0F2FE',
      text: 'text-[#0284C7]',
    },
  };

  const c = colorMap[color] || colorMap.purple;

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-[#10B981]' : trend < 0 ? 'text-red-500' : 'text-gray-400';
  const trendBg = trend > 0 ? '#ECFDF5' : trend < 0 ? '#FEF2F2' : '#F9FAFB';
  const trendBorder = trend > 0 ? '#D1FAE5' : trend < 0 ? '#FEE2E2' : '#E5E7EB';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[20px] relative overflow-hidden group cursor-default shadow-sm hover-lift"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
      }}
    >
      {/* Background sparkline */}
      {sparkData && sparkData.length > 1 && (
        <canvas
          ref={canvasRef}
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          style={{ height: '48%', opacity: 0.5 }}
        />
      )}

      <div className="relative z-10 p-4 sm:p-5">
        {/* Top row: title + icon */}
        <div className="flex items-start justify-between mb-2">
          <p className="label-mono font-bold text-gray-500 leading-tight max-w-[60%]">
            {title}
          </p>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-sm"
            style={{
              background: c.iconBg,
              border: `1px solid ${c.iconBorder}`,
            }}
          >
            {Icon && <Icon className={`w-4 h-4 ${c.text}`} />}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end gap-3 mb-1">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
            {isStringValue ? value : displayValue.toLocaleString()}
          </h2>
          {trend !== undefined && trend !== null && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full mb-1.5 shadow-sm" style={{ background: trendBg, border: `1px solid ${trendBorder}` }}>
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className={`text-[10px] font-bold ${trendColor}`}>
                +{Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs font-bold text-gray-400">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;
