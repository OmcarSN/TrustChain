import { Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * ConnectWalletPrompt — Reusable full-screen wallet connection overlay.
 * Extracted from Endorse and WorkerRegistration pages to eliminate
 * code duplication (~50 lines each). Features shimmer text animation,
 * pulsing connect button, and configurable feature badges.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element displayed above the title.
 * @param {string} props.title - Main heading text.
 * @param {string} props.subtitle - Subheading description text.
 * @param {string[]} props.features - Feature badge strings (e.g. ["\u2713 ON-CHAIN"]).
 * @param {string} [props.borderRadius='0'] - Border radius for the connect button.
 * @returns {React.ReactElement} The ConnectWalletPrompt component.
 */
const ConnectWalletPrompt = ({ icon, title, subtitle, features, borderRadius = '0' }) => {
  const { connect } = useWallet();
  const { t } = useTranslation();

  return (
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

      {/* Background Graphics */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-blue" />
      <div className="tc-orb-green" />

      {/* Atmospheric Light Leaks */}
      <div className="tc-leak-orange" />
      <div className="tc-leak-blue" />

      <div className="text-center" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>

        <div className="conn-anim" style={{ width: '72px', height: '72px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', animation: 'iconPulse 3s ease infinite, fadeSlideUp 0.6s ease forwards', animationDelay: '0s, 0.1s', borderRadius: borderRadius === '0' ? '2px' : borderRadius }}>
          {icon}
        </div>

        <h2 className="font-clash shimmer-text conn-anim" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '12px', animationDelay: '0.2s' }}>{title}</h2>

        <p className="font-inter conn-anim" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '32px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6', animationDelay: '0.3s' }}>{subtitle}</p>

        <div className="conn-anim" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={connect}
            className="conn-btn font-inter"
            aria-label={t('dashboard.connectBtn')}
            style={{ padding: '14px 40px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontWeight: '800', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer', borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase' }}
          >
            <Wallet className="tc-icon-lg" /> {t('dashboard.connectBtn')}
          </button>
        </div>

        <div className="conn-anim font-inter" style={{ display: 'flex', gap: '32px', marginTop: '48px', opacity: 0.4, animationDelay: '0.6s' }}>
          {features.map((feature, i) => (
            <span key={i} className="tc-text-sm tc-ls-wide tc-fw-bold">{feature}</span>
          ))}
        </div>

      </div>
    </div>
  );
};

ConnectWalletPrompt.propTypes = {
  /** Icon element displayed above the title. */
  icon: PropTypes.node.isRequired,
  /** Main heading text. */
  title: PropTypes.string.isRequired,
  /** Subheading description text. */
  subtitle: PropTypes.string.isRequired,
  /** Feature badge strings rendered below the button. */
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Border radius for the connect button. */
  borderRadius: PropTypes.string,
};

export default ConnectWalletPrompt;
