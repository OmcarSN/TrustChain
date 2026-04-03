import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Star, User, Filter,
  ChevronDown, ArrowRight, ShieldCheck, Sparkles,
  Users, Award, TrendingUp, X, SlidersHorizontal,
  CheckCircle2, Eye, Zap
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
      } catch { /* skip malformed entries */ }
    }
  });

  return workers;
};

/* ── Skill filter options ─────────────────────────────────────── */
const SKILL_OPTIONS = ['All', 'Construction', 'Domestic Work', 'Transport', 'Agriculture', 'Cleaning', 'Maintenance', 'Other'];
const RATING_OPTIONS = [
  { label: 'Any Rating', value: 0 },
  { label: '3+ Stars', value: 3 },
  { label: '4+ Stars', value: 4 },
  { label: '5 Stars Only', value: 5 },
];

/* ── Worker Card Component ────────────────────────────────────── */
const WorkerCard = ({ worker, index }) => {
  const starColor = worker.rating >= 4 ? 'text-amber-400' : worker.rating >= 3 ? 'text-yellow-500' : 'text-white/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        to={`/profile/${worker.address}`}
        className="group block rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-xl hover:shadow-accent/10"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Top accent */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent group-hover:via-accent/50 transition-all" />

        <div className="p-5">
          {/* Avatar + Name */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-800/20 flex items-center justify-center border border-accent/10 group-hover:border-accent/25 transition-all shrink-0 relative">
              <User className="w-5 h-5 text-accent" />
              {worker.totalEndorsements > 0 && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0f] flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-black truncate group-hover:text-accent transition-colors">{worker.name}</h3>
              <div className="flex items-center gap-1 text-white/30 text-[10px] font-semibold">
                <MapPin className="w-2.5 h-2.5" /> {worker.city}
              </div>
            </div>
          </div>

          {/* Skill Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/8 border border-accent/10 rounded-lg text-[10px] font-bold text-accent">
              <Briefcase className="w-2.5 h-2.5" /> {worker.skill}
            </span>
            {worker.experience > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[10px] font-bold text-white/30 ml-1.5">
                {worker.experience}yr exp
              </span>
            )}
          </div>

          {/* Rating + Endorsements */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(worker.rating) ? `${starColor} fill-current` : 'text-white/8'
                    }`}
                  />
                ))}
              </div>
              {worker.rating > 0 && (
                <span className="text-[11px] font-black text-white/50">{worker.rating}</span>
              )}
            </div>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">
              {worker.totalEndorsements} {worker.totalEndorsements === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* View Profile Footer */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between group-hover:bg-accent/5 transition-all">
          <span className="text-[9px] font-black uppercase tracking-wider text-white/15 group-hover:text-accent/60 transition-colors">
            View Profile
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
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
    const data = getAllWorkers();
    setWorkers(data);
    setLoading(false);
  }, []);

  /* Derive unique cities from workers */
  const cities = useMemo(() => {
    const set = new Set(workers.map(w => w.city).filter(Boolean));
    return ['All Cities', ...Array.from(set).sort()];
  }, [workers]);

  /* Filter logic */
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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('All');
    setSelectedCity('');
    setMinRating(0);
  };
  const hasActiveFilters = searchQuery || selectedSkill !== 'All' || (selectedCity && selectedCity !== 'All Cities') || minRating > 0;

  /* Stats */
  const totalWorkers = workers.length;
  const avgRating = workers.length > 0 ? (workers.reduce((s, w) => s + w.rating, 0) / workers.length).toFixed(1) : '0';
  const totalEndorsements = workers.reduce((s, w) => s + w.totalEndorsements, 0);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ── Header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-5 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(15,15,25,0.7) 50%, rgba(99,40,210,0.06) 100%)',
            border: '1px solid rgba(124,58,237,0.12)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/12 rounded-full blur-[60px]" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center shadow-lg shadow-accent/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Find Workers</h1>
                <p className="text-white/30 text-[10px] font-semibold">Discover verified workers on Stellar</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-black text-accent">{totalWorkers}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Workers</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center">
                <p className="text-lg font-black text-amber-400">{avgRating}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Avg Rating</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center">
                <p className="text-lg font-black text-emerald-400">{totalEndorsements}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Search + Filters Row ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 p-4 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
              <input
                type="text"
                placeholder="Search by name, skill, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-accent/30 transition-all font-medium text-white placeholder:text-white/15"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all ${
                showFilters 
                  ? 'bg-accent/10 border-accent/20 text-accent' 
                  : 'bg-white/[0.04] border-white/[0.06] text-white/30 hover:text-white/50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>
          </div>

          {/* Filter Controls */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.04]">
                  {/* Skill Filter */}
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-wider text-white/20 block mb-1 ml-1">Skill</label>
                    <div className="relative">
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="bg-white/[0.04] border border-white/[0.06] rounded-lg py-2 pl-3 pr-8 text-[11px] text-white font-medium appearance-none focus:outline-none focus:border-accent/30 transition-all cursor-pointer"
                      >
                        {SKILL_OPTIONS.map(s => (
                          <option key={s} value={s} className="bg-[#0f1016]">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/15 pointer-events-none" />
                    </div>
                  </div>

                  {/* City Filter */}
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-wider text-white/20 block mb-1 ml-1">City</label>
                    <div className="relative">
                      <select
                        value={selectedCity || 'All Cities'}
                        onChange={(e) => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)}
                        className="bg-white/[0.04] border border-white/[0.06] rounded-lg py-2 pl-3 pr-8 text-[11px] text-white font-medium appearance-none focus:outline-none focus:border-accent/30 transition-all cursor-pointer"
                      >
                        {cities.map(c => (
                          <option key={c} value={c} className="bg-[#0f1016]">{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/15 pointer-events-none" />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-wider text-white/20 block mb-1 ml-1">Min Rating</label>
                    <div className="flex gap-1">
                      {RATING_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setMinRating(opt.value)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                            minRating === opt.value
                              ? 'bg-accent/15 border border-accent/25 text-accent'
                              : 'bg-white/[0.03] border border-white/[0.05] text-white/25 hover:text-white/40'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Button */}
                  {hasActiveFilters && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={clearFilters}
                      className="self-end px-3 py-2 rounded-lg text-[10px] font-bold text-red-400/60 hover:text-red-400 bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Results Header ───────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">
            {filtered.length} worker{filtered.length !== 1 ? 's' : ''} found
            {hasActiveFilters && <span className="text-accent/50"> (filtered)</span>}
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-white/10 uppercase tracking-wider">
            <TrendingUp className="w-3 h-3" /> Sorted by rating
          </div>
        </div>

        {/* ── Worker Grid ──────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((worker, i) => (
              <WorkerCard key={worker.address} worker={worker} index={i} />
            ))}
          </div>
        ) : workers.length === 0 ? (
          /* No workers registered at all */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mb-5">
              <Users className="w-9 h-9 text-accent/30" />
            </div>
            <h3 className="text-lg font-black mb-2">No Workers Yet</h3>
            <p className="text-white/20 text-sm max-w-md mb-6">
              Be the first to join! Register as a worker and mint your on-chain credential to appear here.
            </p>
            <Link
              to="/worker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-purple-700 text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all active:scale-[0.98]"
            >
              <Award className="w-4 h-4" /> Register as Worker
            </Link>
          </motion.div>
        ) : (
          /* Filters returned no results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-white/10" />
            </div>
            <h3 className="text-base font-black mb-1">No Matches</h3>
            <p className="text-white/20 text-xs mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-lg font-black uppercase tracking-wider text-[10px] transition-all hover:bg-accent/15"
            >
              <X className="w-3 h-3" /> Clear All Filters
            </button>
          </motion.div>
        )}

        {/* ── Footer Badges ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4 text-white/10"
        >
          {[
            { icon: ShieldCheck, text: 'On-Chain Verified' },
            { icon: Sparkles, text: 'Stellar Testnet' },
            { icon: Zap, text: 'Real-time Discovery' },
          ].map((badge, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full bg-white/8" />}
              <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
                <badge.icon className="w-2.5 h-2.5" /> {badge.text}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DiscoverWorkers;
