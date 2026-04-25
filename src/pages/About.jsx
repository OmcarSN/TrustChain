import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ paddingTop: '120px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh', paddingBottom: '80px' }}>
      
      <h1 className="font-clash" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#ffffff', marginBottom: '40px', textTransform: 'uppercase' }}>
        {t('about.title', 'About TrustChain')}
      </h1>

      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          TrustChain is a decentralized credential and reputation platform for the informal economy, built on Stellar Soroban blockchain.
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('about.missionSubtitle', 'OUR MISSION')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          Empowering unbanked workers with verifiable, tamper-proof on-chain credentials.
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('about.builtBy', 'BUILT BY')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          A team passionate about financial inclusion and blockchain technology.
        </p>
      </div>

      <div style={{ 
        padding: '16px 20px', 
        border: '1px solid rgba(255,255,255,0.08)', 
        backgroundColor: 'rgba(255,255,255,0.02)',
        display: 'inline-block',
        marginTop: '20px'
      }}>
        <p className="font-inter" style={{ fontSize: '12px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          8 Workers · 6 Reviews · 100% Gasless
        </p>
      </div>

    </div>
  );
};

export default About;
