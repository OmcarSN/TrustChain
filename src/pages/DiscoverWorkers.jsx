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
      <Link
        to={`/profile/${worker.address}`}
        className="worker-card group flex flex-col h-full"
        style={{ 
          padding: '18px', 
          border: '1px solid rgba(255,255,255,0.08)', 
          backgroundColor: '#111111', 
          borderRadius: '0px',
          gap: '0',
          animationDelay: `${(index + 1) * 0.05}s`
        }}
      >
        {/* Avatar + Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div className="flex items-center justify-center shrink-0" style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
            <User style={{ color: 'rgba(255,255,255,0.2)', width: '24px', height: '24px' }} />
          </div>
          <div className="min-w-0 flex-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="group-hover:text-white transition-colors">{worker.name}</h3>
              {worker.totalEndorsements > 0 && (
                <span style={{ fontSize: '8px', letterSpacing: '1px', color: '#00dc6e', backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.2)', padding: '2px 6px', borderRadius: '2px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                  ● VERIFIED
                </span>
              )}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <MapPin className="w-3 h-3 mr-1 shrink-0" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{worker.city}</span> <span style={{ opacity: 0.5, margin: '0 6px' }}>•</span> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{worker.skill ? (t(`jobs.${worker.skill.replace(/\s+/g, '')}`) || worker.skill) : ''}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center">
            <div className="flex" style={{ gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} style={{ width: '12px', height: '12px', color: s <= Math.round(worker.rating) ? '#f5c518' : 'rgba(255,255,255,0.15)', fill: s <= Math.round(worker.rating) ? '#f5c518' : 'transparent' }} />
              ))}
            </div>
            {worker.rating > 0 && <span style={{ fontSize: '13px', fontWeight: '800', marginLeft: '6px', color: '#fff' }}>{worker.rating}</span>}
          </div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {worker.totalEndorsements} {worker.totalEndorsements === 1 ? t('discover.review') : t('discover.reviews')}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', marginTop: '12px', marginBottom: '0', overflow: 'hidden' }}>
          <span style={{ padding: '3px 10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px', borderRadius: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {worker.skill ? (t(`jobs.${worker.skill.replace(/\s+/g, '')}`) || worker.skill) : 'Skilled Worker'}
          </span>
          {worker.experience > 0 && (
            <span style={{ padding: '3px 10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', borderRadius: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>
              {worker.experience}{t('discover.yrExp')}
            </span>
          )}
        </div>

        {/* View Profile */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', fontSize: '9px', fontWeight: '700', letterSpacing: '3px', marginTop: 'auto', transition: 'all 0.25s ease' }} className="uppercase text-[rgba(255,255,255,0.35)] group-hover:text-white">
          {t('discover.viewProfile')}
          <ArrowRight style={{ width: '18px', height: '18px', transition: 'all 0.25s ease' }} className="text-[rgba(255,255,255,0.35)] group-hover:text-white group-hover:translate-x-[5px]" />
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

  const totalWorkers = workers.length;
  const calculated = workers.length > 0 ? (workers.reduce((s, w) => s + parseFloat(w.rating || 0), 0) / workers.length) : 0;
  const avgRating = (!calculated || isNaN(calculated)) ? "—" : calculated.toFixed(1);
  const totalEndorsements = workers.reduce((s, w) => s + parseInt(w.totalEndorsements || 0, 10), 0);

  return (
    <div className="min-h-screen bg-[#050505] pb-12 relative overflow-hidden text-white" style={{ paddingTop: '100px' }}>
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw' }}>
        {/* Header */}
        <div className="reveal" style={{ paddingTop: '16px', marginBottom: '0px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            {t('discover.subtitle', 'BROWSE THE DECENTRALIZED REGISTRY...')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="font-clash text-white" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: '800', letterSpacing: '0.02em', marginBottom: '20px', lineHeight: '1.1' }}>
              {t('discover.title', 'Discover Verified Workers')}
            </h1>
            {/* Stats */}
            <div className="flex items-center" style={{ marginBottom: '20px', gap: '48px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '40px', paddingBottom: '8px' }}>
              {[
                { label: t('discover.workers', 'Workers'), value: totalWorkers },
                { label: t('discover.avgRatingLabel', 'Avg Rating'), value: avgRating },
                { label: t('discover.reviewsLabel', 'Reviews'), value: totalEndorsements },
              ].map((s, i) => (
                <div key={i} className="text-right">
                  <p className="font-clash" style={{ fontSize: '2.2rem', fontWeight: '900', lineHeight: '1' }}>{s.value}</p>
                  <p style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', textTransform: 'uppercase' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 pb-5 reveal reveal-d1" style={{ marginTop: '0px' }}>
          <div className="flex flex-col mb-4">
            {/* Search Bar */}
            <div className="relative w-full group" style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder={t('discover.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 20px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.04)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>

            <div className="flex" style={{ marginBottom: showFilters ? '0' : '24px' }}>
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
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div style={{ paddingTop: '20px', paddingBottom: '24px', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', flexWrap: 'wrap' }}>
                    <div>
                      <label style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>{t('discover.filterSkill', 'SKILL')}</label>
                      <div className="relative">
                        <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}
                          style={{ padding: '8px 40px 8px 18px', height: '36px', border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', appearance: 'none', borderRadius: '4px', transition: 'all 0.3s' }}
                          onMouseOver={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.18)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}>
                          <option value="All Categories" className="bg-[#0a0a0a]">{t('discover.allCategories', 'All Categories')}</option>
                          {SKILL_OPTIONS.map(s => (<option key={s} value={s} className="bg-[#0a0a0a]">{t('jobs.' + s.replace(/\s+/g, ''))}</option>))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.7)' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>{t('discover.filterCity', 'CITY')}</label>
                      <div className="relative">
                        <select value={selectedCity || 'All Cities'} onChange={(e) => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)}
                          style={{ padding: '8px 40px 8px 18px', height: '36px', border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', appearance: 'none', borderRadius: '4px', transition: 'all 0.3s' }}
                          onMouseOver={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.18)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}>
                          <option value="All Cities" className="bg-[#0a0a0a]">{t('discover.allCities', 'All Cities')}</option>
                          {cities.map(c => (<option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.7)' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>{t('discover.filterRating', 'MINIMUM RATING')}</label>
                      <div className="flex" style={{ gap: '8px' }}>
                        {RATING_OPTIONS.map(opt => {
                          const isActive = minRating === opt.value;
                          return (
                            <button key={opt.value} onClick={() => setMinRating(opt.value)}
                              style={{
                                padding: '8px 18px', height: '36px', border: isActive ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.18)', fontSize: '12px', letterSpacing: '1px',
                                backgroundColor: isActive ? '#ffffff' : 'transparent',
                                color: isActive ? '#000000' : 'inherit',
                                fontWeight: isActive ? '700' : 'normal',
                                transition: 'all 0.3s ease',
                                borderRadius: '4px',
                                display: 'flex', alignItems: 'center'
                              }}
                              onMouseOver={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                              onMouseOut={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                            >
                              {t('ratings.' + opt.labelKey)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="transition-all flex items-center justify-center gap-1" style={{ padding: '8px 18px', height: '36px', borderRadius: '4px', fontSize: '12px', letterSpacing: '1px', fontWeight: 'bold', border: '1px solid rgba(255,80,80,0.4)', color: 'rgba(255,100,100,0.8)', marginBottom: '1px', backgroundColor: 'transparent' }}>
                        <X className="w-3 h-3" /> {t('discover.clearFilters')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', paddingBottom: '16px' }} className="reveal reveal-d2">
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {filtered.length} {t('discover.results')}
            {hasActiveFilters && <span style={{ color: 'rgba(255,200,50,0.6)', fontSize: '10px', letterSpacing: '2px' }}> ({t('discover.filtered')})</span>}
          </p>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ↑ {t('discover.sortedByRating')}
          </div>
        </div>

        {/* Worker Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '8px', marginBottom: '80px', alignItems: 'stretch' }}>
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
