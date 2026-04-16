import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Star, User, Filter,
  ChevronDown, ArrowRight, ShieldCheck, Sparkles,
  Users, Award, TrendingUp, X, SlidersHorizontal,
  CheckCircle2, Eye, Zap, UserX
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
      } catch { /* skip */ }
    }
  });
  return workers;
};

const SKILL_OPTIONS = ['All', 'Construction', 'Electrician', 'Plumbing', 'Carpenter', 'Painter', 'Domestic Work', 'Cooking', 'Cleaning', 'Babysitting', 'Beautician', 'Gardening', 'Tailoring', 'Driver', 'Transport', 'Security Guard', 'Agriculture', 'Maintenance', 'Other'];
const RATING_OPTIONS = [
  { label: 'Any Rating', value: 0 },
  { label: '3+ Stars', value: 3 },
  { label: '4+ Stars', value: 4 },
  { label: '5 Stars Only', value: 5 },
];

/* ── Stagger animation helper ─────────────────────────────────── */
const stagger = (i) => ({ delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] });

/* ── Skeleton Card ────────────────────────────────────────────── */
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={stagger(index)}
    className="rounded-[20px] overflow-hidden"
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
  >
    <div className="p-6 animate-pulse">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 rounded-full" style={{ background: 'rgba(139,92,246,0.08)' }} />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 rounded-lg w-3/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-2.5 rounded-lg w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        <div className="h-6 rounded-full w-20" style={{ background: 'rgba(139,92,246,0.06)' }} />
        <div className="h-6 rounded-full w-14" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex gap-1">{[1,2,3,4,5].map(i=><div key={i} className="w-3.5 h-3.5 rounded" style={{background:'rgba(255,255,255,0.04)'}} />)}</div>
        <div className="h-2.5 rounded w-12" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  </motion.div>
);

/* ── Worker Card ──────────────────────────────────────────────── */
const WorkerCard = ({ worker, index }) => {
  const starColor = worker.rating >= 4 ? '#FBBF24' : worker.rating >= 3 ? '#EAB308' : '#E5E7EB';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={stagger(index)}
    >
      <Link
        to={`/profile/${worker.address}`}
        className="group block rounded-[20px] overflow-hidden transition-all duration-500"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px -15px rgba(30,58,138,0.15)';
          e.currentTarget.style.borderColor = 'rgba(30,58,138,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      >
        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-start gap-3 mb-5">
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
              >
                <User className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              {worker.totalEndorsements > 0 && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                  style={{ background: '#10B981', border: '2px solid #FFFFFF', animation: 'pulse-dot 2s infinite' }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold truncate text-gray-900 group-hover:text-[#1E3A8A] transition-colors" style={{ fontFamily: '"Inter", sans-serif' }}>
                {worker.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#6B7280' }}>
                <MapPin className="w-2.5 h-2.5 text-[#EA580C]" /> {worker.city}
              </div>
            </div>
          </div>

          {/* Skill Badge */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
              style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#1E3A8A' }}
            >
              <Briefcase className="w-2.5 h-2.5 text-[#EA580C]" /> {worker.skill}
            </span>
            {worker.experience > 0 && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold"
                style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#6B7280' }}
              >
                {worker.experience}yr exp
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-3.5 h-3.5" style={{ color: s <= Math.round(worker.rating) ? starColor : '#E5E7EB', fill: s <= Math.round(worker.rating) ? starColor : 'none' }} />
                ))}
              </div>
              {worker.rating > 0 && <span className="text-xs font-bold text-gray-900">{worker.rating}</span>}
            </div>
            <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
              {worker.totalEndorsements} {worker.totalEndorsements === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* View Profile */}
        <div
          className="px-6 py-3 flex items-center justify-between transition-all"
          style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] transition-colors text-gray-500 group-hover:text-[#1E3A8A]"
          >
            View Profile
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-all text-gray-400 group-hover:text-[#1E3A8A] group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkers(getAllWorkers());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
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

  const totalWorkers = workers.length;
  const avgRating = workers.length > 0 ? (workers.reduce((s, w) => s + w.rating, 0) / workers.length).toFixed(1) : 'NaN';
  const totalEndorsements = workers.reduce((s, w) => s + w.totalEndorsements, 0);

  const selectStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '8px 32px 8px 12px',
    fontSize: '11px',
    color: '#111827',
    fontWeight: 500,
    appearance: 'none',
  };

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-8 px-4 sm:px-6 relative overflow-hidden text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* ── Header Banner ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6 p-6 rounded-[20px]"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#1E3A8A' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[32px] text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, letterSpacing: '-0.02em' }}>
                    Find Workers
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1E3A8A' }}>
                    {totalWorkers} workers
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Discover verified workers on Stellar</p>
              </div>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-5">
              {[
                { label: 'Workers', value: totalWorkers, color: '#EA580C' },
                { label: 'Avg Rating', value: avgRating, color: '#1E3A8A' },
                { label: 'Reviews', value: totalEndorsements, color: '#10B981' },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="w-px h-8" style={{ background: '#E5E7EB' }} />}
                  <div className="text-center">
                    <p className="text-lg font-bold" style={{ fontFamily: 'monospace', color: s.color }}>{s.value}</p>
                    <p className="label-mono text-gray-500">{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Search + Filters ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6 p-5 rounded-[20px]"
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
        >
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, skill, or city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-xs font-medium text-gray-900 transition-all focus:outline-none"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontFamily: '"Inter", sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = '#EA580C'; e.target.style.boxShadow = '0 0 0 3px rgba(234,88,12,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: showFilters ? '#EFF6FF' : '#FFFFFF',
                border: `1px solid ${showFilters ? '#DBEAFE' : '#E5E7EB'}`,
                color: showFilters ? '#1E3A8A' : '#6B7280',
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                <div className="flex flex-wrap items-end gap-3 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                  <div>
                    <label className="label-mono block mb-1.5 ml-1 text-gray-500">Skill</label>
                    <div className="relative">
                      <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)} style={selectStyle}>
                        {SKILL_OPTIONS.map(s => <option key={s} value={s} style={{background:'#FFFFFF'}}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <label className="label-mono block mb-1.5 ml-1 text-gray-500">City</label>
                    <div className="relative">
                      <select value={selectedCity || 'All Cities'} onChange={e => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)} style={selectStyle}>
                        {cities.map(c => <option key={c} value={c} style={{background:'#FFFFFF'}}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <label className="label-mono block mb-1.5 ml-1 text-gray-500">Min Rating</label>
                    <div className="flex gap-1">
                      {RATING_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setMinRating(opt.value)}
                          className="px-3 py-2 rounded-full text-[10px] font-bold transition-all"
                          style={{
                            background: minRating === opt.value ? '#EFF6FF' : '#FFFFFF',
                            border: `1px solid ${minRating === opt.value ? '#DBEAFE' : '#E5E7EB'}`,
                            color: minRating === opt.value ? '#1E3A8A' : '#6B7280',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="px-3 py-2 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444' }}>
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="label-mono font-medium text-gray-500">{loading ? 'Loading...' : `${filtered.length} worker${filtered.length !== 1 ? 's' : ''} found`}</p>
          <div className="flex items-center gap-1 label-mono font-medium text-gray-500"><TrendingUp className="w-3 h-3 text-[#EA580C]" /> Sorted by rating</div>
        </div>

        {/* ── Grid ──────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((w, i) => <WorkerCard key={w.address} worker={w} index={i} />)}
          </div>
        ) : workers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
              <Users className="w-9 h-9 text-[#1E3A8A] opacity-80" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>No Workers Yet</h3>
            <p className="text-sm mb-6 max-w-md" style={{ color: '#6B7280', fontWeight: 400 }}>Be the first to join! Register and mint your on-chain credential.</p>
            <Link to="/worker" className="px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white flex items-center gap-2 hover:opacity-90" style={{background:'#1E3A8A'}}>
                <Award className="w-4 h-4 text-[#EA580C]" /> Register as Worker
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <UserX className="w-7 h-7" style={{ color: '#9CA3AF' }} />
            </div>
            <h3 className="text-base font-semibold mb-1 text-gray-900">No Workers Found</h3>
            <p className="text-xs mb-4" style={{ color: '#6B7280' }}>Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:bg-gray-50" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1E3A8A' }}>
              <X className="w-3 h-3 text-[#EA580C]" /> Clear Filters
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 flex items-center justify-center gap-5" style={{ color: '#6B7280' }}>
          {[{ icon: ShieldCheck, text: 'On-Chain Verified' }, { icon: Sparkles, text: 'Stellar Testnet' }, { icon: Zap, text: 'Real-time Discovery' }].map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full" style={{ background: '#E5E7EB' }} />}
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold"><b.icon className="w-3 h-3" /> {b.text}</div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DiscoverWorkers;
