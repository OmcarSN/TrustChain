import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Users, Award, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { calculateScore } from '../lib/reputation';
import { getAllWorkersWithEndorsements } from '../lib/supabaseData';
import WorkerCard from '../components/discover/WorkerCard';
import FilterBar from '../components/discover/FilterBar';

/**
 * getAllWorkers — Fetches all workers from Supabase with endorsements
 * and computes reputation scores.
 * @returns {Promise<Array<Object>>} Array of worker objects with address, name, skill, city, rating, etc.
 */
const getAllWorkers = async () => {
  const workersWithEndorsements = await getAllWorkersWithEndorsements();
  return workersWithEndorsements.map(w => {
    const rep = calculateScore(w.endorsements || []);
    return {
      address: w.address,
      name: w.name || 'Unknown',
      skill: w.skill || 'General',
      city: w.city || 'Unknown',
      experience: w.experience || 0,
      bio: w.bio || '',
      timestamp: w.timestamp,
      rating: rep.average,
      totalEndorsements: rep.total,
    };
  });
};

/**
 * useCounter — Custom hook for animated number counting.
 * Interpolates from 0 to target over a given duration.
 * @param {number|string} target - Target value to count to.
 * @param {number} [duration=1000] - Animation duration in ms.
 * @param {number} [delay=0] - Delay before animation starts in ms.
 * @returns {number} Current animated count value.
 */
const useCounter = (target, duration = 1000, delay = 0) => {
  const [count, setCount] = useState(0);
  const updateCount = useCallback((val) => setCount(val), []);
  useEffect(() => {
    if (isNaN(target) || target === 0 || target === "—") { updateCount(target); return; }
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { updateCount(target); clearInterval(timer); }
        else updateCount(Math.floor(start * 10) / 10);
      }, 16);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay, updateCount]);
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

/**
 * DiscoverWorkers — Browse and search all registered workers page.
 * Features animated stat counters, text search, multi-filter system
 * (skill, city, rating), sort controls, and shimmer loading skeletons.
 * Delegates card rendering to WorkerCard and filter UI to FilterBar.
 *
 * @returns {React.ReactElement} The DiscoverWorkers page.
 */
const DiscoverWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('Rating');
  const [showFilters, setShowFilters] = useState(true);
  const { t } = useTranslation();

  const loadWorkers = useCallback(async () => {
    const data = await getAllWorkers();
    setWorkers(data);
    setTimeout(() => { setLoading(false); }, 1500);
  }, []);

  useEffect(() => { loadWorkers(); }, [loadWorkers]);

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
    }).sort((a, b) => {
      if (sortBy === 'Rating') return b.rating - a.rating || b.totalEndorsements - a.totalEndorsements;
      if (sortBy === 'Reviews') return b.totalEndorsements - a.totalEndorsements || b.rating - a.rating;
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [workers, selectedSkill, selectedCity, minRating, searchQuery, sortBy]);

  const clearFilters = () => { setSearchQuery(''); setSelectedSkill('All'); setSelectedCity(''); setMinRating(0); };
  const hasActiveFilters = searchQuery || selectedSkill !== 'All' || (selectedCity && selectedCity !== 'All Cities') || minRating > 0;

  const totalWorkersBase = workers.length;
  const ratedWorkers = workers.filter(w => parseFloat(w.rating || 0) > 0);
  const calculatedBase = ratedWorkers.length > 0
    ? ratedWorkers.reduce((s, w) => s + parseFloat(w.rating || 0), 0) / ratedWorkers.length
    : 0;
  const totalEndorsementsBase = workers.filter(w => parseInt(w.totalEndorsements || 0, 10) > 0).length;

  const totalWorkers = useCounter(totalWorkersBase, 1000, 200);
  const animRatingRaw = useCounter(calculatedBase, 1000, 200);
  const totalEndorsements = useCounter(totalEndorsementsBase, 1000, 200);
  const avgRating = (!calculatedBase || isNaN(calculatedBase)) ? "—" :
    (animRatingRaw === calculatedBase ? calculatedBase.toFixed(1) : animRatingRaw.toFixed(1));

  return (
    <div className="relative overflow-hidden text-white min-h-screen" style={{ background: '#05060A' }}>
      {/* Background Decorations */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-green" />
      <div className="tc-orb-blue" />
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); filter: blur(3px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes fadeSlideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes wordUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes simpleFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dwFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes searchGlow { 0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.1); } 50% { box-shadow: 0 0 20px rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.3); } }
        @keyframes scanLine { from { transform: translateX(-100%); } to { transform: translateX(400%); } }
        @keyframes contentFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -700px 0; } 100% { background-position: 700px 0; } }
        .skeleton { background: linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%); background-size: 700px 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: 4px; }
        .dw-anim { opacity:0; animation: dwFadeUp 0.4s ease forwards; }
        .dw-search { transition: all 0.2s ease; }
        .dw-search:focus { border-color: rgba(255,255,255,0.3) !important; outline: none; animation: searchGlow 2s ease infinite; }
        .dw-search::placeholder { color: rgba(255,255,255,0.2); }
        .dw-search-container { position: relative; overflow: hidden; }
        .dw-search-container:focus-within .search-scan::after { content: ''; position: absolute; top: 0; left: 0; width: 20%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); animation: scanLine 2s ease infinite; pointer-events: none; }
        .dw-select { transition: border-color 0.2s ease; appearance: none; cursor: pointer; }
        .dw-select:hover { border-color: rgba(255,255,255,0.25) !important; }
        .dw-rating-btn { transition: all 0.2s ease; }
        .dw-rating-btn:hover { border-color: rgba(255,255,255,0.3) !important; color: #ffffff !important; transform: translateY(-1px); }
        .worker-row { transition: background 0.18s ease, padding-left 0.25s cubic-bezier(.25,.8,.25,1); border-bottom: 1px solid #181818; display: flex; align-items: center; text-decoration: none; color: inherit; }
        .worker-row:last-child { border-bottom: none; }
        .worker-row.loaded:hover { background: #161616; padding-left: 26px; }
        .row-arrow { font-size: 13px; color: #1e1e1e; transition: color 0.2s ease, transform 0.25s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; margin-left: 4px; opacity: 0; }
        .worker-row.loaded:hover .row-arrow { color: #555555; transform: translateX(5px); opacity: 1; }
        .worker-row .avatar { transition: transform 0.25s cubic-bezier(.34,1.56,.64,1); }
        .worker-row.loaded:hover .avatar { transform: scale(1.08); }
        @media (max-width: 900px) { .dw-grid { grid-template-columns: 1fr !important; } .dw-hero { flex-direction: column !important; align-items: flex-start !important; } .dw-filters-row { flex-wrap: wrap !important; } }
        @media (max-width: 768px) { .worker-card-inner { flex-direction: column; align-items: flex-start !important; gap: 16px; } .worker-card-inner > div { width: 100%; flex: none !important; } .worker-card-inner > div:nth-child(2) { justify-content: flex-start !important; } .worker-card-inner > div:nth-child(3) { align-items: flex-start !important; } }
        @media (max-width: 540px) { .dw-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="tc-page-wide tc-page-padded">

        {/* ═══ SECTION A: Hero Header ═══ */}
        <div className="dw-hero tc-flex-between tc-mb-4xl">
          <div>
            <p className="font-inter tc-eyebrow tc-mb-sm" style={{ animation: 'fadeSlideRight 0.5s ease both', animationDelay: '0ms' }}>{t('discover.eyebrow')}</p>
            <h1 className="font-clash tc-heading-hero tc-mb-sm" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}>
              {t('discover.title', 'Discover Verified Workers').split(' ').map((word, i) => (
                <span key={i} className="text-gradient" style={{ display: 'inline-block', marginRight: '0.25em', animation: 'wordUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${i * 80}ms` }}>{word}</span>
              ))}
            </h1>
            <p className="font-inter tc-text-dimmer" style={{ fontSize: '13px', maxWidth: '500px', lineHeight: '1.6', animation: 'slideUpFade 0.5s ease both', animationDelay: '400ms' }}>{t('discover.subtitle')}</p>
          </div>
          <div className="glass-card grid grid-cols-3 gap-2 md:gap-4" style={{ flexShrink: 0, animation: 'fadeSlideLeft 0.6s ease both', animationDelay: '200ms', padding: '20px 24px' }}>
            {[
              { value: totalWorkers, label: t('discover.workers', 'WORKERS') },
              { value: avgRating, label: t('discover.avgRatingLabel', 'AVG RATING') },
              { value: totalEndorsements, label: t('discover.reviewsLabel', 'REVIEWS') },
            ].map((s, i, arr) => (
              <div key={i} className="tc-stat-cell" style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <p className="font-clash text-xl md:text-3xl font-black text-white leading-none mb-1 counter-glow">{s.value}</p>
                <p className="font-inter tc-caption">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION B: Search + Filters ═══ */}
        <div className="dw-search-container tc-mb-lg" style={{ animation: 'slideUpFade 0.5s ease both', animationDelay: '500ms' }}>
          <input type="text" placeholder={t('discover.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="dw-search tc-input"
            style={{ padding: '16px 52px 16px 20px' }} />
          <div className="search-scan" />
          <Search className="tc-icon-lg tc-icon-dimmer tc-search-icon-pos" />
        </div>

        <div style={{ animation: 'simpleFade 0.4s ease both', animationDelay: '650ms' }}>
          <FilterBar
            showFilters={showFilters} setShowFilters={setShowFilters} hasActiveFilters={hasActiveFilters}
            selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} skillOptions={SKILL_OPTIONS}
            selectedCity={selectedCity} setSelectedCity={setSelectedCity} cities={cities}
            minRating={minRating} setMinRating={setMinRating} ratingOptions={RATING_OPTIONS}
            clearFilters={clearFilters} t={t}
          />
        </div>

        {/* ═══ SECTION C: Results Header ═══ */}
        <div className="dw-anim tc-flex-between tc-mb-lg" style={{ animationDelay: '0.2s' }}>
          <span className="tc-eyebrow" style={{ color: loading ? '#333' : '#555', letterSpacing: '0.12em' }}>
            {loading ? t('discover.loadingWorkers', 'loading workers...') : t('discover.workersFound', '{{count}} workers found', { count: filtered.length })}
          </span>
          <div className="tc-flex tc-flex-gap-sm">
            {['Rating', 'Reviews', 'Name'].map(tab => (
              <button key={tab} onClick={() => setSortBy(tab)} style={{
                border: '1px solid #1e1e1e', borderRadius: '20px', padding: '4px 12px', fontSize: '11px',
                backgroundColor: 'transparent', color: sortBy === tab ? '#e5e5e5' : '#555',
                borderColor: sortBy === tab ? '#2e2e2e' : '#1e1e1e', cursor: 'pointer', transition: 'all 0.2s ease'
              }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* ═══ SECTION D: Worker Cards ═══ */}
        {loading ? (
          <div className="tc-card-container">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="tc-flex tc-flex-gap" style={{ minHeight: '70px', padding: '14px 20px', borderBottom: i === 4 ? 'none' : '1px solid #181818', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
                <div className="tc-flex-col" style={{ flex: 1, gap: '6px' }}>
                  <div className="skeleton" style={{ width: '120px', height: '14px' }} />
                  <div className="skeleton" style={{ width: '80px', height: '10px' }} />
                </div>
                <div className="skeleton" style={{ width: '70px', height: '20px', borderRadius: '12px' }} />
                <div className="tc-flex-col" style={{ alignItems: 'flex-end', gap: '6px', minWidth: '60px' }}>
                  <div className="skeleton" style={{ width: '30px', height: '16px' }} />
                  <div className="skeleton" style={{ width: '50px', height: '10px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="tc-card-container">
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
