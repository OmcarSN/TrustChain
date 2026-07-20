import React from 'react';
import PropTypes from 'prop-types';
import { LayoutDashboard, Wallet } from 'lucide-react';

/**
 * ConnectPrompt — Full-screen wallet connection prompt.
 * Displayed on the Dashboard when the user's Freighter wallet is not connected.
 * Features animated entrance, shimmer text effect, pulsing connect button,
 * and feature highlight badges.
 *
 * @param {Object} props
 * @param {Function} props.connect - Callback to trigger Freighter wallet connection.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ConnectPrompt component.
 */
const ConnectPrompt = ({ connect, t }) => (
  <div className="min-h-screen bg-[#05060A] relative overflow-hidden text-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
    <style>{`
      @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes iconPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.05); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
      @keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
      @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
      .conn-anim { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; }
      .shimmer-text { background: linear-gradient(to right, #ffffff 20%, #888888 50%, #ffffff 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; animation: shimmer 3s linear infinite; }
      .conn-btn { transition: all 0.25s ease; animation: btnPulse 2.5s ease infinite; }
      .conn-btn:hover { background-color: rgba(220,220,220,1) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.15) !important; }
    `}</style>

    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,107,237,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,107,237,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

    <div className="text-center" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div className="conn-anim" style={{ width: '72px', height: '72px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', animation: 'iconPulse 3s ease infinite, fadeSlideUp 0.6s ease forwards', animationDelay: '0s, 0.1s', borderRadius: '2px' }}>
        <LayoutDashboard style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.5)' }} />
      </div>
      <h2 className="font-clash shimmer-text conn-anim" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '12px', animationDelay: '0.2s' }}>{t('dashboard.commandCenter')}</h2>
      <p className="font-inter conn-anim" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '32px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6', animationDelay: '0.3s' }}>{t('dashboard.connectPrompt')}</p>
      <div className="conn-anim" style={{ animationDelay: '0.4s' }}>
        <button onClick={connect} className="conn-btn font-inter" style={{ padding: '14px 40px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontWeight: '800', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase' }}>
          <Wallet className="tc-icon-lg" /> {t('dashboard.connectBtn')}
        </button>
      </div>
      <div className="conn-anim font-inter" style={{ display: 'flex', gap: '32px', marginTop: '48px', opacity: 0.4, animationDelay: '0.6s' }}>
        <span className="tc-text-sm tc-ls-wide tc-fw-bold">✓ VIEW STATS</span>
        <span className="tc-text-sm tc-ls-wide tc-fw-bold">✓ MANAGE PROFILE</span>
        <span className="tc-text-sm tc-ls-wide tc-fw-bold">✓ TRACK ENDORSEMENTS</span>
      </div>
    </div>
  </div>
);

ConnectPrompt.propTypes = {
  /** Callback to trigger Freighter wallet connection. */
  connect: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ConnectPrompt;
