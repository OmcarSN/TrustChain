import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Star, Briefcase, MapPin, ArrowUpRight } from 'lucide-react';

/**
 * Dashboard left sidebar showing credential info, reputation, and quick actions.
 */
const DashboardSidebar = ({ credential, reputation, endorsementsReceived, endorsementsGiven, quickActions, t }) => (
  <div className="db-sidebar" style={{ width: '280px', minWidth: '260px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: '40px' }}>

    {/* Sidebar stats */}
    <div className="db-anim" style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '14px', animationDelay: '0s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.credential')}</span>
        <span style={{ padding: '3px 12px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.04)', fontWeight: '600' }}>{credential?.skill || '—'}</span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.avgRating')}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="font-clash" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>{reputation?.average || '0.0'}</span>
          <Star style={{ width: '12px', height: '12px', color: '#f5a623', fill: '#f5a623' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.received')}</span>
        <span className="font-clash" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>{endorsementsReceived.length}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.given')}</span>
        <span className="font-clash" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>{endorsementsGiven.length}</span>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="db-anim" style={{ animationDelay: '0.05s' }}>
      <p className="font-inter" style={{ padding: '20px 20px 10px 20px', fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.quickActions')}</p>
      {quickActions.map((a, i) => (
        <Link key={i} to={a.to} className="db-qa">
          <div style={{ width: '32px', height: '32px', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a.icon style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.35)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="font-inter" style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{a.label}</p>
            <p className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{a.sub}</p>
          </div>
          <ArrowUpRight style={{ width: '11px', height: '11px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
        </Link>
      ))}
    </div>

    {/* My Credential */}
    {credential && (
      <div className="db-anim" style={{ animationDelay: '0.1s' }}>
        <p className="font-inter" style={{ padding: '20px 20px 10px 20px', fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.myCredential')}</p>
        <div style={{ margin: '0 12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '2px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="font-inter" style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{credential.name}</span>
            <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#00dc6e', backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.2)', padding: '3px 8px' }}>● {t('dashboard.onChain')}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Briefcase style={{ width: '11px', height: '11px', color: 'rgba(255,255,255,0.2)' }} /><span className="font-inter" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{credential.skill}</span></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin style={{ width: '11px', height: '11px', color: 'rgba(255,255,255,0.2)' }} /><span className="font-inter" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{credential.city}</span></span>
          </div>
          {credential.bio && <p className="font-inter" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', lineHeight: '1.5', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>"{credential.bio}"</p>}
        </div>
      </div>
    )}

    {/* Reputation */}
    {reputation && endorsementsReceived.length > 0 && (
      <div className="db-anim" style={{ margin: '12px 12px 0', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', animationDelay: '0.15s' }}>
        <p className="font-inter" style={{ fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '700' }}>{t('dashboard.reputation')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="font-clash" style={{ fontSize: '2rem', fontWeight: '900' }}>{reputation.average}</span>
          <div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
              {[1, 2, 3, 4, 5].map(s => (<Star key={s} style={{ width: '12px', height: '12px', color: s <= Math.round(reputation.average) ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= Math.round(reputation.average) ? '#f5a623' : 'transparent' }} />))}
            </div>
            <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{endorsementsReceived.length} {endorsementsReceived.length !== 1 ? t('dashboard.reviews') : t('dashboard.review')}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

DashboardSidebar.propTypes = {
  credential: PropTypes.shape({
    name: PropTypes.string,
    skill: PropTypes.string,
    city: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.string,
  }),
  reputation: PropTypes.shape({
    average: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total: PropTypes.number,
  }),
  endorsementsReceived: PropTypes.array.isRequired,
  endorsementsGiven: PropTypes.array.isRequired,
  quickActions: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    sub: PropTypes.string.isRequired,
  })).isRequired,
  t: PropTypes.func.isRequired,
};

DashboardSidebar.defaultProps = {
  credential: null,
  reputation: null,
};

export default DashboardSidebar;
