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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
    >
      <Link
        to={`/profile/${worker.address}`}
        className="group block border border-white/[0.07] rounded-[2px] p-6 bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.05] transition-all duration-400"
      >
        {/* Avatar + Name */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative">
            <User className="w-4 h-4 text-white/40" />
            {worker.totalEndorsements > 0 && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#050505] flex items-center justify-center">
                <CheckCircle2 className="w-2 h-2 text-black" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold truncate group-hover:text-white transition-colors">{worker.name}</h3>
            <div className="flex items-center gap-1 text-white/30 text-[10px] font-medium">
              <MapPin className="w-2.5 h-2.5" /> {worker.city}
            </div>
          </div>
        </div>

        {/* Skill */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-[2px] text-[10px] font-bold text-white/60">
            <Briefcase className="w-2.5 h-2.5" /> {worker.skill ? (t(`jobs.${worker.skill.replace(/\s+/g, '')}`) || worker.skill) : ''}
          </span>
          {worker.experience > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.02] border border-white/[0.05] rounded-[2px] text-[10px] font-bold text-white/30">
              {worker.experience}{t('discover.yrExp')}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-3 h-3 ${s <= Math.round(worker.rating) ? 'text-white fill-white' : 'text-white/10'}`} />
              ))}
            </div>
            {worker.rating > 0 && <span className="text-[11px] font-bold text-white/50">{worker.rating}</span>}
          </div>
          <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">
            {worker.totalEndorsements} {worker.totalEndorsements === 1 ? t('discover.review') : t('discover.reviews')}
          </span>
        </div>

        {/* View Profile */}
        <div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.15em] text-white/15 group-hover:text-white/40 transition-colors">
          {t('discover.viewProfile')}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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

  const totalWorkers = workers.length;
  const calculated = workers.length > 0 ? (workers.reduce((s, w) => s + w.rating, 0) / workers.length) : 0;
  const avgRating = isNaN(calculated) ? "0.0" : calculated.toFixed(1);
  const totalEndorsements = workers.reduce((s, w) => s + w.totalEndorsements, 0);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 reveal">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter mb-3">
            {t('discover.subtitle', 'Browse & hire verified workers')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="font-clash text-4xl lg:text-5xl font-bold tracking-tighter text-white">
              {t('discover.titleP1', 'Find')} {t('discover.titleP2', 'Workers')}
            </h1>
            {/* Stats */}
            <div className="flex items-center gap-6">
              {[
                { label: t('discover.workers', 'Workers'), value: totalWorkers },
                { label: t('discover.avgRatingLabel', 'Avg Rating'), value: avgRating },
                { label: t('discover.reviewsLabel', 'Reviews'), value: totalEndorsements },
              ].map((s, i) => (
                <div key={i} className="text-right">
                  <p className="font-clash text-xl font-bold">{s.value}</p>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/25">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 border-t border-b border-white/5 py-5 reveal reveal-d1">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder={t('discover.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 border-b border-white/20 bg-transparent text-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-white/60 placeholder:text-white/30 font-inter"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-[2px] text-[10px] font-bold uppercase tracking-wider transition-all ${
                showFilters ? 'border-white/30 text-white' : 'border-white/10 text-white/30 hover:text-white/50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t('discover.filters')}
              {hasActiveFilters && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="flex flex-wrap items-end gap-4 pt-3">
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider text-white/20 block mb-1">{t('discover.filterSkill')}</label>
                    <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}
                      className="bg-transparent border-0 border-b border-white/20 py-2 pr-6 text-[11px] text-white font-medium appearance-none focus:outline-none focus:border-white/60 cursor-pointer">
                      {SKILL_OPTIONS.map(s => (<option key={s} value={s} className="bg-[#0a0a0a]">{t('jobs.' + s.replace(/\s+/g, ''))}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider text-white/20 block mb-1">{t('discover.filterCity')}</label>
                    <select value={selectedCity || 'All Cities'} onChange={(e) => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)}
                      className="bg-transparent border-0 border-b border-white/20 py-2 pr-6 text-[11px] text-white font-medium appearance-none focus:outline-none focus:border-white/60 cursor-pointer">
                      {cities.map(c => (<option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider text-white/20 block mb-1">{t('discover.filterRating')}</label>
                    <div className="flex gap-1">
                      {RATING_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => setMinRating(opt.value)}
                          className={`px-3 py-2 rounded-[2px] text-[10px] font-bold transition-all ${
                            minRating === opt.value ? 'bg-white text-black' : 'border border-white/10 text-white/30 hover:text-white/50'
                          }`}>
                          {t('ratings.' + opt.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="px-3 py-2 rounded-[2px] text-[10px] font-bold text-red-400/60 hover:text-red-400 border border-red-400/20 transition-all flex items-center gap-1">
                      <X className="w-3 h-3" /> {t('discover.clearFilters')}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4 reveal reveal-d2">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">
            {filtered.length} {t('discover.results')}
            {hasActiveFilters && <span className="text-white/40"> ({t('discover.filtered')})</span>}
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-white/10 uppercase tracking-wider">
            <TrendingUp className="w-3 h-3" /> {t('discover.sortedByRating')}
          </div>
        </div>

        {/* Worker Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((worker, i) => (<WorkerCard key={worker.address} worker={worker} index={i} />))}
          </div>
        ) : workers.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center reveal">
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
          <div className="py-16 flex flex-col items-center text-center reveal">
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
