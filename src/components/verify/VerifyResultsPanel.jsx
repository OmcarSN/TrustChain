import React from 'react';
import { explorerTxUrl, explorerAccountUrl } from '../../lib/networkConfig';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Briefcase, ShieldCheck, ExternalLink,
  Share2, Award, User, History, Calendar,
  Sparkles, Check, Hash, Fingerprint, Target
} from 'lucide-react';

import PropTypes from 'prop-types';

/**
 * VerifyResultsPanel — Verify page results display.
 * Renders the verified banner, profile card, reputation ring with
 * star breakdown, stats row, endorsement history timeline, empty
 * state, and security footer badges.
 *
 * @param {Object} props
 * @param {Object|null} props.profile - Verified worker profile data, or null.
 * @param {boolean} props.isSearching - Whether a search is in progress.
 * @param {string|null} props.error - Error message, or null.
 * @param {boolean} props.copied - Whether the share link was copied.
 * @param {Function} props.handleShare - Share button click handler.
 * @param {Function} props.navigateToEndorse - Navigate to endorse page handler.
 * @param {Function} props.truncAddr - Address truncation helper.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The VerifyResultsPanel component.
 */
const VerifyResultsPanel = ({
  profile, isSearching, error,
  copied, handleShare, navigateToEndorse, truncAddr, t
}) => {

  return (
    <>
      <AnimatePresence mode="wait">
        {(isSearching || profile) && (
          <motion.div key={isSearching ? 'loading' : profile?.address} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role="region" aria-label={t('verify.resultsRegion', 'Verification results')}
          >
            {/* Verified Banner */}
            {!isSearching && profile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                role="status" aria-label={t('verify.verifiedBanner', 'Worker is verified on-chain')}
                className="mb-6 p-4 rounded-xl flex items-center justify-between border border-green-400/20 bg-green-400/[0.05] backdrop-blur-md shadow-[0_0_30px_-5px_rgba(22,163,74,0.15)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-green-400/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-400">{t('verify.ledgerVerified')}</p>
                    <p className="text-[9px] text-green-400/40 font-inter">{t('verify.credentialConfirmed')}</p>
                  </div>
                </div>
                <a href={explorerAccountUrl(profile.address)} target="_blank" rel="noopener noreferrer"
                  aria-label={t('verify.viewExplorer', 'View on Stellar Explorer')}
                  className="hidden md:flex items-center gap-2 px-4 py-2 border border-green-400/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-green-400/60 hover:text-green-400 hover:border-green-400/40 hover:bg-green-400/[0.05] transition-all duration-300">
                  Explorer <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Profile Card */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-card rounded-xl overflow-hidden" role="region" aria-label={t('verify.profileCard', 'Worker profile')}>
                  {isSearching ? (
                    <div className="p-8 animate-pulse space-y-4" role="status" aria-label={t('verify.loadingProfile', 'Loading profile')}>
                      <div className="w-14 h-14 bg-white/5 rounded-[2px] mx-auto" />
                      <div className="h-4 bg-white/5 rounded-[2px] w-2/3 mx-auto" />
                      <div className="h-3 bg-white/5 rounded-[2px] w-1/2 mx-auto" />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="text-center mb-5">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400/10 to-blue-400/10 border border-white/10 flex items-center justify-center mx-auto mb-3">
                          <User className="w-7 h-7 text-green-400/50" aria-hidden="true" />
                        </div>
                        <h2 className="font-clash text-xl font-bold mb-1">{profile.name}</h2>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
                          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-green-400/80">{t('profile.badgeVerified')}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-3 px-3 py-2.5 border border-white/5 rounded-[2px]">
                          <Briefcase className="w-3.5 h-3.5 text-white/20" aria-hidden="true" />
                          <span className="text-xs text-white/50 font-inter">{profile.skill}</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 border border-white/5 rounded-[2px]">
                          <MapPin className="w-3.5 h-3.5 text-white/20" aria-hidden="true" />
                          <span className="text-xs text-white/50 font-inter">{profile.city}</span>
                        </div>
                        {profile.experience && (
                          <div className="flex items-center gap-3 px-3 py-2.5 border border-white/5 rounded-[2px]">
                            <Calendar className="w-3.5 h-3.5 text-white/20" aria-hidden="true" />
                            <span className="text-xs text-white/50 font-inter">{profile.experience} {t('verify.yearsExp')}</span>
                          </div>
                        )}
                      </div>
                      {profile.bio && (
                        <div className="pt-3 border-t border-white/5">
                          <p className="text-[11px] text-white/25 leading-relaxed italic font-inter">"{profile.bio}"</p>
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/15 mb-1 font-inter">{t('verify.stellarAddress')}</p>
                        <p className="text-[10px] font-mono text-white/25 truncate">{profile.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isSearching && profile && (
                  <div className="space-y-2" role="group" aria-label={t('verify.actionsGroup', 'Profile actions')}>
                    <button onClick={() => navigateToEndorse(profile.address)}
                      aria-label={t('verify.endorseAction', `Endorse ${profile.name}`)}
                      className="btn-glow w-full py-3.5 rounded-lg font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" aria-hidden="true" /> {t('profile.endorseBtn')}
                    </button>
                    <button onClick={handleShare}
                      aria-label={t('verify.shareAction', 'Share verification link')}
                      className="btn-outline-glow w-full py-3.5 rounded-lg font-bold uppercase tracking-[0.15em] text-[10px] transition-all duration-300 flex items-center justify-center gap-2">
                      {copied ? <><Check className="w-4 h-4 text-green-400" aria-hidden="true" /> {t('verify.copied')}</> : <><Share2 className="w-4 h-4" aria-hidden="true" /> {t('verify.shareProfile')}</>}
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Reputation + Endorsements */}
              <div className="lg:col-span-8 space-y-4">
                {/* Reputation */}
                <div className="glass-card rounded-xl" role="region" aria-label={t('verify.reputationRegion', 'Reputation score and breakdown')}>
                  {isSearching ? (
                    <div className="p-8 animate-pulse flex items-center gap-8" role="status" aria-label={t('verify.loadingReputation', 'Loading reputation')}>
                      <div className="w-24 h-24 rounded-full bg-white/5 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-white/5 rounded-[2px] w-1/3" />
                        {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 bg-white/5 rounded-full" />)}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Score Ring */}
                        <div className="shrink-0 relative" role="img" aria-label={`${t('verify.score')}: ${profile.reputation.average} out of 5`}>
                          <div className="w-24 h-24 rounded-full relative flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
                              <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(79,107,237,0.08)" strokeWidth="4" />
                              <circle cx="48" cy="48" r="42" fill="none" stroke="url(#scoreGradient)" strokeWidth="4" strokeLinecap="round"
                                strokeDasharray={`${(profile.reputation.average / 5) * 264} 264`} />
                              <defs><linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4F6BED" /><stop offset="100%" stopColor="#7C93F2" /></linearGradient></defs>
                            </svg>
                            <div className="text-center z-10">
                              <div className="font-clash text-2xl font-bold">{profile.reputation.average || '0.0'}</div>
                              <div className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20 font-inter">{t('verify.score')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="flex-1 w-full">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/30 font-inter">{t('verify.ratingBreakdown')}</h3>
                            <span className="text-[9px] font-bold text-white/20 font-inter">{profile.reputation.total} {t('discover.reviews')}</span>
                          </div>
                          <div className="space-y-2" role="list" aria-label={t('verify.breakdownList', 'Rating breakdown by stars')}>
                            {[5,4,3,2,1].map(star => (
                              <div key={star} className="flex items-center gap-2.5" role="listitem" aria-label={`${star} stars: ${profile.reputation.breakdown[star] || 0}%`}>
                                <div className="flex items-center gap-1 w-8">
                                  <span className="text-[10px] font-bold text-white/20">{star}</span>
                                  <Star className="w-2.5 h-2.5 text-white/20 fill-white/20" aria-hidden="true" />
                                </div>
                                <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${profile.reputation.breakdown[star] || 0}%` }}
                                    transition={{ duration: 1, delay: 0.3 + star * 0.08 }}
                                    className="h-full rounded-full bg-gradient-to-r from-green-400/60 to-blue-400/40" />
                                </div>
                                <span className="text-[9px] font-bold text-white/15 w-7 text-right">{profile.reputation.breakdown[star] || 0}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                {!isSearching && profile && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3" role="region" aria-label={t('verify.statsRegion', 'Worker statistics')}>
                    {[
                      { value: profile.reputation.total, label: t('verify.totalJobs') },
                      { value: profile.experience ? `${profile.experience}yr` : '—', label: t('verify.experience') },
                      { value: profile.timestamp ? new Date(profile.timestamp).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : '—', label: t('verify.memberSince') },
                    ].map((stat, i) => (
                      <div key={i} className="stat-card-premium p-3 sm:p-5 text-center rounded-xl">
                        <p className="font-clash text-xl font-bold mb-0.5">{stat.value}</p>
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 font-inter">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Endorsement History */}
                <div role="region" aria-label={t('verify.endorsementHistory', 'Endorsement history')}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-blue-400 rounded-full" aria-hidden="true" />
                    <h3 className="text-sm font-bold tracking-tight font-inter">{t('profile.reviewsHeader')}</h3>
                    {!isSearching && profile && (
                      <span className="ml-auto text-[9px] font-bold text-white/15 font-inter">{profile.endorsements.length}</span>
                    )}
                  </div>

                  <div className="space-y-2" role="list" aria-label={t('verify.endorsementsList', 'List of endorsements')}>
                    {isSearching ? (
                      [1,2].map(i => <div key={i} className="p-5 bg-white/[0.02] border border-white/5 animate-pulse h-24 rounded-[2px]" role="status" aria-label={t('verify.loadingEndorsements', 'Loading endorsements')} />)
                    ) : profile.endorsements.length > 0 ? (
                      profile.endorsements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((endorsement, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.05 }}
                          role="listitem"
                          aria-label={`${t('verify.endorsementBy', 'Endorsement by')} ${truncAddr(endorsement.endorser)}, ${endorsement.rating} stars`}
                          className="p-4 glass-card rounded-xl hover:border-green-400/20 transition-all duration-300">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-green-400/[0.08] border border-green-400/20 flex items-center justify-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-400/60" aria-hidden="true" />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/20 block font-inter">{t('profile.endorserLabel')}</span>
                                <span className="text-xs font-mono text-white/40">{truncAddr(endorsement.endorser)}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5" role="img" aria-label={`${endorsement.rating} out of 5 stars`}>
                              {[1,2,3,4,5].map(s => (<Star key={s} className={`w-2.5 h-2.5 ${s <= endorsement.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} aria-hidden="true" />))}
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="inline-block px-2.5 py-1 border border-green-400/15 bg-green-400/[0.05] rounded-md text-[8px] font-bold uppercase text-green-400/60 mb-1.5">{endorsement.jobType}</span>
                            <p className="text-[11px] text-white/30 leading-relaxed italic font-inter">"{endorsement.feedback}"</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                            <span className="text-[9px] text-white/15 flex items-center gap-1 font-inter">
                              <Calendar className="w-2.5 h-2.5" aria-hidden="true" />
                              <time dateTime={new Date(endorsement.timestamp).toISOString()}>
                                {new Date(endorsement.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </time>
                            </span>
                            {endorsement.txHash && (
                              <a href={explorerTxUrl(endorsement.txHash)} target="_blank" rel="noopener noreferrer"
                                aria-label={`View transaction ${endorsement.txHash.slice(0,8)} on Stellar`}
                                className="text-[8px] font-mono text-white/10 hover:text-white/30 transition-colors flex items-center gap-1">
                                <Hash className="w-2 h-2" aria-hidden="true" /> {endorsement.txHash.slice(0,8)}…
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-10 text-center border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01]" role="status">
                        <History className="w-6 h-6 text-white/10 mx-auto mb-3" aria-hidden="true" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/15 font-inter">{t('profile.noReviews')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isSearching && !profile && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center max-w-sm mx-auto glass-card p-8 rounded-xl" role="status" aria-label={t('verify.emptyState', 'No search performed yet')}>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400/[0.06] to-blue-400/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-green-400/20" aria-hidden="true" />
          </div>
          <p className="text-white/20 text-xs font-bold font-inter">{t('verify.emptyStateTitle')}</p>
          <p className="text-white/10 text-[10px] font-inter mt-1">{t('verify.emptyStateSubtitle')}</p>
        </motion.div>
      )}

      {/* Footer badges */}
      <div className="mt-10 flex items-center justify-center gap-5 text-white/15" role="contentinfo" aria-label={t('verify.footerBadges', 'Security features')}>
        {[
          { icon: Fingerprint, label: t('verify.badgeImmutable') },
          { icon: ShieldCheck, label: t('verify.badgeTamperProof') },
          { icon: Target, label: t('verify.badgeStellar') },
        ].map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="w-1 h-1 rounded-full bg-green-400/20" aria-hidden="true" />}
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider font-inter hover:text-green-400/40 transition-colors duration-300">
              <b.icon className="w-3 h-3" aria-hidden="true" /> {b.label}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default VerifyResultsPanel;

VerifyResultsPanel.propTypes = {
  /** Verified worker profile data, or null if no results. */
  profile: PropTypes.object,
  /** Whether a verification search is in progress. */
  isSearching: PropTypes.bool.isRequired,
  /** Error message from failed verification, or null. */
  error: PropTypes.string,
  /** Whether the share link was recently copied to clipboard. */
  copied: PropTypes.bool.isRequired,
  /** Share button click handler. */
  handleShare: PropTypes.func.isRequired,
  /** Navigate to endorse page handler. */
  navigateToEndorse: PropTypes.func.isRequired,
  /** Address truncation helper function. */
  truncAddr: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};
