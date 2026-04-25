import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Star, User, Filter,
  ChevronDown, ArrowRight, ShieldCheck, Sparkles,
  Users, Award, TrendingUp, X, SlidersHorizontal,
  CheckCircle2, Eye, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { calculateScore } from '../lib/reputation';

/* ── Helper: get all registered workers from localStorage ──── */
const getAllWorkers = () => {
  const registry = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
  const workers = [];
  registry.forEach(address => {
    const data = localStorage.getItem(`trustchain_worker_${address}`);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const endorsements = JSON.parse(localStorage.getItem(`endorsements_${address}`) || '[]');
        const rep = calculateScore(endorsements);
        workers.push({
          address,
          name: parsed.name || parsed.fullName || 'Unknown',
          skill: parsed.skill || parsed.skillCategory || 'General',
          city: parsed.city || 'Unknown',
          experience: parsed.experience || 0,
          bio: parsed.bio || '',
          timestamp: parsed.timestamp,
          rating: rep.average,
          totalEndorsements: rep.total,
        });
      } catch { /* skip malformed entries */ }
    }
  });
  return workers;
};

const useCounter = (target, duration = 1000, delay = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (isNaN(target) || target === 0 || target === "—") {
      setCount(target);
      return;
    }
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(start * 10) / 10);
      }, 16);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
};

const SKILL_OPTIONS = [
  'All', 'AC Technician', 'Agriculture', 'Babysitting', 'Carpenter',
  'Cleaning', 'Construction', 'Cooking', 'Domestic Work',
  'Driver', 'Electrician', 'Gardening', 'Maintenance',
  'Painter', 'Plumbing', 'Security guard', 'Tailoring',
  'Transport', 'Other'
];
const RATING_OPTIONS = [
  { labelKey: 'AnyRating', value: 0 },
  { labelKey: '3Stars', value: 3 },
  { labelKey: '4Stars', value: 4 },
  { labelKey: '5Stars', value: 5 },
];

/* ── Worker Card ─────────────────────────────────────────────── */
const WorkerCard = ({ worker, index }) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/profile/${worker.address}`}
      className="dw-card group"
      style={{
        display: 'block', textDecoration: 'none', color: 'inherit',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        opacity: 0,
        animation: `cardIn 0.5s ease forwards`,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User style={{ color: 'rgba(255,255,255,0.2)', width: '18px', height: '18px' }} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{worker.name}</span>
            {worker.totalEndorsements > 0 && (
              <span className="verified-badge" style={{ fontSize: '9px', letterSpacing: '2px', color: '#00dc6e', backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.2)', padding: '2px 7px', display: 'inline-block', whiteSpace: 'nowrap' }}>● {t('discover.verified')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Location + Skill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
        <MapPin style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.city}</span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.skill ? (t(`jobs.${worker.skill.replace(/\s+/g, '')}`) || worker.skill) : ''}</span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '14px' }} />

      {/* Stars + Reviews */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} style={{ width: '13px', height: '13px', color: s <= Math.round(worker.rating) ? '#f5a623' : 'rgba(255,255,255,0.15)', fill: s <= Math.round(worker.rating) ? '#f5a623' : 'transparent' }} />
            ))}
          </div>
          {worker.rating > 0 && <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginLeft: '6px' }}>{worker.rating}</span>}
        </div>
        <span style={{ fontSize: '10px', letterSpacing: '1px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>
          {worker.totalEndorsements} {worker.totalEndorsements === 1 ? t('discover.review') : t('discover.reviews')}
        </span>
      </div>
    </Link>
  );
};

/* ── Main Page ────────────────────────────────────────────────── */
const DiscoverWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const data = getAllWorkers();
    setWorkers(data);
    setLoading(false);
  }, []);

  const cities = useMemo(() => {
    const set = new Set(workers.map(w => w.city).filter(Boolean));
    return ['All Cities', ...Array.from(set).sort()];
  }, [workers]);

  const filtered = useMemo(() => {
    return workers.filter(w => {
      if (selectedSkill !== 'All' && w.skill !== selectedSkill) return false;
      if (selectedCity && selectedCity !== 'All Cities' && w.city !== selectedCity) return false;
      if (minRating > 0 && w.rating < minRating) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!w.name.toLowerCase().includes(q) && !w.skill.toLowerCase().includes(q) && !w.city.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.rating - a.rating || b.totalEndorsements - a.totalEndorsements);
  }, [workers, selectedSkill, selectedCity, minRating, searchQuery]);

  const clearFilters = () => { setSearchQuery(''); setSelectedSkill('All'); setSelectedCity(''); setMinRating(0); };
  const hasActiveFilters = searchQuery || selectedSkill !== 'All' || (selectedCity && selectedCity !== 'All Cities') || minRating > 0;

  const totalWorkersBase = workers.length;
  const calculatedBase = workers.length > 0 ? (workers.reduce((s, w) => s + parseFloat(w.rating || 0), 0) / workers.length) : 0;
  const totalEndorsementsBase = workers.reduce((s, w) => s + parseInt(w.totalEndorsements || 0, 10), 0);

  const totalWorkers = useCounter(totalWorkersBase, 800, 300);
  const animRatingRaw = useCounter(calculatedBase, 1000, 400);
  const totalEndorsements = useCounter(totalEndorsementsBase, 1200, 500);

  const avgRating = (!calculatedBase || isNaN(calculatedBase)) ? "—" : 
    (animRatingRaw === calculatedBase ? calculatedBase.toFixed(1) : animRatingRaw.toFixed(1));

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Light leaks / Background Orbs */}
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); filter: blur(3px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes dwFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes searchGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.1); }
          50%       { box-shadow: 0 0 20px rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.3); }
        }
        @keyframes scanLine {
          from { transform: translateX(-100%); }
          to   { transform: translateX(400%); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes verifiedPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,220,110,0.3); }
          50%       { box-shadow: 0 0 8px 2px rgba(0,220,110,0.1); }
        }
        .verified-badge { animation: verifiedPulse 2.5s ease infinite; }
        .dw-anim { opacity:0; animation: dwFadeUp 0.4s ease forwards; }
        .dw-card { transition: all 0.2s ease; }
        .dw-card:hover { border-color: rgba(255,255,255,0.2) !important; background-color: rgba(255,255,255,0.04) !important; transform: translateY(-2px); }
        .dw-search { transition: all 0.2s ease; }
        .dw-search:focus { border-color: rgba(255,255,255,0.3) !important; outline: none; animation: searchGlow 2s ease infinite; }
        .dw-search::placeholder { color: rgba(255,255,255,0.2); }
        .dw-search-container { position: relative; overflow: hidden; }
        .dw-search-container:focus-within .search-scan::after {
          content: ''; position: absolute; top: 0; left: 0; width: 20%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          animation: scanLine 2s ease infinite; pointer-events: none;
        }
        .dw-select { transition: border-color 0.2s ease; appearance: none; cursor: pointer; }
        .dw-select:hover { border-color: rgba(255,255,255,0.25) !important; }
        .dw-rating-btn { transition: all 0.2s ease; }
        .dw-rating-btn:hover { border-color: rgba(255,255,255,0.3) !important; color: #ffffff !important; transform: translateY(-1px); }
        .dw-sort:hover { color: #ffffff !important; }
        @media (max-width: 900px) { .dw-grid { grid-template-columns: repeat(2, 1fr) !important; } .dw-hero { flex-direction: column !important; align-items: flex-start !important; } .dw-filters-row { flex-wrap: wrap !important; } }
        @media (max-width: 540px) { .dw-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Page Wrapper */}
      <div style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* ═══ SECTION A: Hero Header ═══ */}
        <div className="dw-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          {/* Left text block */}
          <div>
            <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', textTransform: 'uppercase', fontWeight: '600', opacity: 0, animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.05s' }}>{t('discover.eyebrow')}</p>
            <h1 className="font-clash" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '900', lineHeight: '1.05', marginBottom: '12px', letterSpacing: '-0.02em', opacity: 0, animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.15s' }}>{t('discover.title', 'Discover Verified Workers')}</h1>
            <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', maxWidth: '500px', lineHeight: '1.6', opacity: 0, animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.25s' }}>
              {t('discover.subtitle')}
            </p>
          </div>
          {/* Right stats block */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', flexShrink: 0, opacity: 0, animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.3s' }}>
            {[
              { value: totalWorkers, label: t('discover.workers', 'WORKERS') },
              { value: avgRating, label: t('discover.avgRatingLabel', 'AVG RATING') },
              { value: totalEndorsements, label: t('discover.reviewsLabel', 'REVIEWS') },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding: '16px 28px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <p className="font-clash" style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1', marginBottom: '4px' }}>{s.value}</p>
                <p className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION B: Search + Filters ═══ */}
        {/* Search Bar */}
        <div className="dw-search-container" style={{ marginBottom: '24px', opacity: 0, animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.4s' }}>
          <input
            type="text"
            placeholder={t('discover.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dw-search"
            style={{
              width: '100%', padding: '16px 52px 16px 20px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0', color: '#ffffff', fontSize: '14px',
            }}
          />
          <div className="search-scan" />
          <Search style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* Filters Row */}
        <div className="dw-filters-row" style={{
          display: 'flex', alignItems: 'flex-end', gap: '16px',
          paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '28px', flexWrap: 'wrap',
          opacity: 0, animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.5s'
        }}>
          {/* FILTERS label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
            <SlidersHorizontal style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.25)' }} />
            <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase' }}>{t('discover.filters')}</span>
          </div>

          {/* Skill dropdown */}
          <div>
            <label className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>{t('discover.filterSkill', 'SKILL')}</label>
            <div style={{ position: 'relative' }}>
              <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="dw-select"
                style={{ padding: '8px 32px 8px 12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px', letterSpacing: '0.5px', minWidth: '160px' }}>
                <option value="All" style={{ backgroundColor: '#0a0a0a' }}>{t('discover.allCategories', 'All Categories')}</option>
                {SKILL_OPTIONS.map(s => (<option key={s} value={s} style={{ backgroundColor: '#0a0a0a' }}>{t('jobs.' + s.replace(/\s+/g, ''))}</option>))}
              </select>
              <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* City dropdown */}
          <div>
            <label className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>{t('discover.filterCity', 'CITY')}</label>
            <div style={{ position: 'relative' }}>
              <select value={selectedCity || 'All Cities'} onChange={(e) => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)} className="dw-select"
                style={{ padding: '8px 32px 8px 12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px', letterSpacing: '0.5px', minWidth: '160px' }}>
                <option value="All Cities" style={{ backgroundColor: '#0a0a0a' }}>{t('discover.allCities', 'All Cities')}</option>
                {cities.filter(c => c !== 'All Cities').map(c => (<option key={c} value={c} style={{ backgroundColor: '#0a0a0a' }}>{c}</option>))}
              </select>
              <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'center' }} />

          {/* Minimum Rating buttons */}
          <div>
            <label className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>{t('discover.filterRating', 'MINIMUM RATING')}</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {RATING_OPTIONS.map((opt, i) => {
                const isActive = minRating === opt.value;
                return (
                  <button key={opt.value} onClick={() => setMinRating(opt.value)} className={isActive ? '' : 'dw-rating-btn'}
                    style={{
                      padding: '7px 14px', fontSize: '11px', letterSpacing: '1px',
                      border: isActive ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#000000' : 'rgba(255,255,255,0.45)',
                      fontWeight: isActive ? '700' : '400',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 0 12px rgba(255,255,255,0.15)' : 'none',
                      transition: 'all 0.2s ease',
                      opacity: 0,
                      animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
                      animationDelay: `${0.6 + (i * 0.05)}s`,
                    }}>
                    {t('ratings.' + opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ padding: '7px 14px', fontSize: '11px', letterSpacing: '1px', border: '1px solid rgba(255,80,80,0.3)', color: 'rgba(255,100,100,0.7)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <X style={{ width: '10px', height: '10px' }} /> {t('discover.clearFilters')}
            </button>
          )}
        </div>

        {/* ═══ SECTION C: Results Header ═══ */}
        <div className="dw-anim" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', animationDelay: '0.2s' }}>
          <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: '700' }}>
            {filtered.length} {t('discover.results')}
            {hasActiveFilters && <span style={{ color: 'rgba(255,200,50,0.6)', fontSize: '10px', letterSpacing: '2px', marginLeft: '8px' }}>({t('discover.filtered')})</span>}
          </span>
          <span className="font-inter dw-sort" style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', textTransform: 'uppercase', fontWeight: '700', transition: 'color 0.2s' }}>
            ↑ {t('discover.sortedByRating')}
          </span>
        </div>

        {/* ═══ SECTION D: Worker Cards Grid ═══ */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="dw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {filtered.map((worker, i) => (<WorkerCard key={worker.address} worker={worker} index={i} />))}
          </div>
        ) : workers.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-[2px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-white/15" />
            </div>
            <h3 className="font-clash text-2xl font-bold mb-2 tracking-tighter">{t('discover.noWorkers')}</h3>
            <p className="text-white/30 text-sm max-w-md mb-6 font-inter">{t('discover.noWorkersSub')}</p>
            <Link to="/worker" className="bg-white text-black rounded-[2px] font-bold text-[11px] tracking-[0.15em] uppercase px-8 py-4 hover:opacity-85 transition-opacity flex items-center gap-2">
              <Award className="w-4 h-4" /> {t('discover.registerAsWorker')}
            </Link>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-[2px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white/10" />
            </div>
            <h3 className="font-clash text-lg font-bold mb-1">{t('discover.noWorkers')}</h3>
            <p className="text-white/20 text-xs mb-4 font-inter">{t('discover.noWorkersSub')}</p>
            <button onClick={clearFilters} className="px-4 py-2.5 border border-white/20 rounded-[2px] text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-all flex items-center gap-1">
              <X className="w-3 h-3" /> {t('discover.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverWorkers;
