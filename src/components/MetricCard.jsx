import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'purple', trend, sparkData, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isStr = typeof value === 'string' && isNaN(parseInt(value, 10));
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isStr) return;
    let start, id;
    const dur = 1400, target = parseInt(value, 10) || 0;
    const anim = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplayValue(Math.floor(e * target));
      if (p < 1) id = requestAnimationFrame(anim); else setDisplayValue(target);
    };
    if (target > 0) id = requestAnimationFrame(anim); else setDisplayValue(target);
    return () => { if (id) cancelAnimationFrame(id); };
  }, [value, isStr]);

  useEffect(() => {
    if (!sparkData?.length || !canvasRef.current) return;
    const canvas = canvasRef.current, ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    const max = Math.max(...sparkData, 1), min = Math.min(...sparkData, 0), range = max - min || 1;
    const padY = 4, stepX = w / (sparkData.length - 1);
    const pts = sparkData.map((v, i) => ({ x: i * stepX, y: padY + (1 - (v - min) / range) * (h - padY * 2) }));
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.15)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) { const cx = (pts[i-1].x + pts[i].x) / 2; ctx.quadraticCurveTo(pts[i-1].x, pts[i-1].y, cx, (pts[i-1].y + pts[i].y) / 2); }
    ctx.quadraticCurveTo(pts[pts.length-2].x, pts[pts.length-2].y, pts[pts.length-1].x, pts[pts.length-1].y);
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) { const cx = (pts[i-1].x + pts[i].x) / 2; ctx.quadraticCurveTo(pts[i-1].x, pts[i-1].y, cx, (pts[i-1].y + pts[i].y) / 2); }
    ctx.quadraticCurveTo(pts[pts.length-2].x, pts[pts.length-2].y, pts[pts.length-1].x, pts[pts.length-1].y);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();
  }, [sparkData]);

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-white/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.5 }}
      className="rounded-[2px] relative overflow-hidden group cursor-default border border-white/[0.07] bg-white/[0.02]"
    >
      {sparkData && sparkData.length > 1 && (
        <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ height: '48%', opacity: 0.5 }} />
      )}
      <div className="relative z-10 p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 leading-tight max-w-[60%] font-inter">{title}</p>
          <div className="w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0 bg-white/5 border border-white/10">
            {Icon && <Icon className="w-4 h-4 text-white/30" />}
          </div>
        </div>
        <div className="flex items-end gap-3 mb-1.5">
          <h2 className="font-clash text-3xl font-bold text-white tracking-tight leading-none">{isStr ? value : displayValue.toLocaleString()}</h2>
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-white/5 mb-1`}>
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className={`text-[10px] font-bold ${trendColor}`}>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        {subtitle && <p className="text-[10px] font-inter text-white/20 tracking-wide">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default MetricCard;
