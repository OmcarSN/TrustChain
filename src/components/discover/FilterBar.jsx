import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

/**
 * @typedef {Object} RatingOption
 * @property {string} labelKey - i18n key for the label
 * @property {number} value - Minimum rating value
 */

/**
 * Collapsible filter bar for the Discover Workers page.
 * Contains skill, city, and minimum rating filters.
 */
const FilterBar = ({
  showFilters, setShowFilters, hasActiveFilters,
  selectedSkill, setSelectedSkill, skillOptions,
  selectedCity, setSelectedCity, cities,
  minRating, setMinRating, ratingOptions,
  clearFilters, t,
}) => (
  <>
    <div style={{ marginBottom: showFilters ? '16px' : '28px', transition: 'margin 0.3s ease' }}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="group flex items-center gap-3 transition-all"
        style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
      >
        <div className={`flex items-center justify-center w-8 h-8 rounded-[2px] border transition-all duration-300 ${showFilters ? 'bg-white border-white text-black' : 'bg-[#0a0a0a] border-white/10 text-white/40 group-hover:border-[#00dc6e]/50 group-hover:text-[#00dc6e]'}`}>
          <SlidersHorizontal className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className={`font-inter text-[10px] tracking-[0.2em] font-bold uppercase transition-colors duration-300 ${showFilters ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
            {t('discover.filters')}
          </span>
          {!showFilters && hasActiveFilters && (
            <span className="text-[8px] font-bold tracking-widest text-[#00dc6e] mt-1 uppercase">Active</span>
          )}
        </div>
      </button>
    </div>

    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="dw-filters-row flex flex-col sm:flex-row gap-4 flex-wrap overflow-hidden"
          style={{ alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px' }}
        >
          {/* Skill dropdown */}
          <div className="w-full sm:w-auto">
            <label className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>{t('discover.filterSkill', 'SKILL')}</label>
            <div style={{ position: 'relative' }}>
              <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="dw-select"
                style={{ padding: '10px 36px 10px 14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '13px', letterSpacing: '0.5px', minWidth: '180px', borderRadius: '2px' }}>
                <option value="All" style={{ backgroundColor: '#0a0a0a' }}>{t('discover.allCategories', 'All Categories')}</option>
                {skillOptions.map(s => (<option key={s} value={s} style={{ backgroundColor: '#0a0a0a' }}>{t('jobs.' + s.replace(/\s+/g, ''))}</option>))}
              </select>
              <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* City dropdown */}
          <div className="w-full sm:w-auto">
            <label className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>{t('discover.filterCity', 'CITY')}</label>
            <div style={{ position: 'relative' }}>
              <select value={selectedCity || 'All Cities'} onChange={(e) => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)} className="dw-select"
                style={{ padding: '10px 36px 10px 14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '13px', letterSpacing: '0.5px', minWidth: '180px', borderRadius: '2px' }}>
                <option value="All Cities" style={{ backgroundColor: '#0a0a0a' }}>{t('discover.allCities', 'All Cities')}</option>
                {cities.filter(c => c !== 'All Cities').map(c => (<option key={c} value={c} style={{ backgroundColor: '#0a0a0a' }}>{c}</option>))}
              </select>
              <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block" style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'center', margin: '0 8px' }} />

          {/* Minimum Rating buttons */}
          <div className="w-full sm:w-auto">
            <label className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>{t('discover.filterRating', 'MINIMUM RATING')}</label>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((opt) => {
                const isActive = minRating === opt.value;
                return (
                  <button key={opt.value} onClick={() => setMinRating(opt.value)} className={isActive ? '' : 'dw-rating-btn'}
                    style={{
                      padding: '9px 16px', fontSize: '12px', letterSpacing: '0.5px',
                      border: isActive ? '1px solid #00dc6e' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: isActive ? 'rgba(0,220,110,0.1)' : 'rgba(255,255,255,0.02)',
                      color: isActive ? '#00dc6e' : 'rgba(255,255,255,0.5)',
                      fontWeight: isActive ? '600' : '400', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.25s ease'
                    }}>
                    {t('ratings.' + opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-auto mt-4 sm:mt-0" style={{ padding: '9px 16px', fontSize: '11px', letterSpacing: '1px', border: '1px solid rgba(255,80,80,0.3)', color: 'rgba(255,100,100,0.8)', backgroundColor: 'rgba(255,80,80,0.05)', borderRadius: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease' }}>
              <X style={{ width: '12px', height: '12px' }} /> {t('discover.clearFilters')}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </>
);

FilterBar.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  setShowFilters: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
  selectedSkill: PropTypes.string.isRequired,
  setSelectedSkill: PropTypes.func.isRequired,
  skillOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCity: PropTypes.string.isRequired,
  setSelectedCity: PropTypes.func.isRequired,
  cities: PropTypes.arrayOf(PropTypes.string).isRequired,
  minRating: PropTypes.number.isRequired,
  setMinRating: PropTypes.func.isRequired,
  ratingOptions: PropTypes.arrayOf(PropTypes.shape({
    labelKey: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  clearFilters: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default FilterBar;
