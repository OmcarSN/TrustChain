import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Individual worker row card in the discover listing.
 * Shows avatar, name, city, skill, verification badge, and rating.
 */
const WorkerCard = ({ worker, index }) => {
  const { t } = useTranslation();
  const isVerified = worker.totalEndorsements > 0;

  const nameParts = (worker.name || 'W').trim().split(' ');
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : nameParts[0].substring(0, 2).toUpperCase();

  const getAvatarColor = (name) => {
    const colors = ['bg-orange-500', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-500', 'bg-cyan-600', 'bg-indigo-600'];
    const idx = (name || 'W').charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const avatarColor = getAvatarColor(worker.name);

  return (
    <Link
      to={`/profile/${worker.address}`}
      className="worker-row loaded"
      style={{ animation: 'contentFade 0.4s ease both', animationDelay: `${index * 80}ms`, padding: '14px 20px', minHeight: '70px' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full worker-card-inner" style={{ opacity: isVerified ? 1 : 0.5, transition: 'opacity 0.2s ease' }}>
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
          <div className={`avatar w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white break-words capitalize">{worker.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 truncate mt-0.5">
              <span>📍 {worker.city}</span>
              <span>·</span>
              <span>{worker.skill ? (t(`jobs.${worker.skill.replace(/\s+/g, '')}`) || worker.skill) : ''}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center min-w-[80px]">
          {isVerified ? (
            <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-green-800 text-green-500 bg-green-950/40">VERIFIED</span>
          ) : (
            <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#2a2a2a' }}>UNVERIFIED</span>
          )}
        </div>
        <div className="text-left sm:text-right shrink-0 min-w-[64px] mt-2 sm:mt-0 w-full sm:w-auto flex justify-between sm:block items-center">
          {isVerified ? (
            <>
              <p className="text-sm font-bold text-white">{Number(worker.rating || 0).toFixed(1)}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                {worker.totalEndorsements} {worker.totalEndorsements === 1 ? t('discover.review') : t('discover.reviews')}
              </p>
            </>
          ) : (
            <span style={{ color: '#2a2a2a', fontStyle: 'italic', fontSize: '11px' }}>No reviews yet</span>
          )}
        </div>
      </div>
      <div className="row-arrow">→</div>
    </Link>
  );
};

WorkerCard.propTypes = {
  worker: PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    skill: PropTypes.string,
    city: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalEndorsements: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default WorkerCard;
