import React from 'react';
import { useTranslation } from 'react-i18next';

const Mission = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ paddingTop: '120px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh', paddingBottom: '80px' }}>
      
      <h1 className="font-clash" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#ffffff', marginBottom: '40px', textTransform: 'uppercase' }}>
        {t('mission.title', 'Our Mission')}
      </h1>

      <div style={{ 
        marginBottom: '40px', 
        paddingLeft: '20px', 
        borderLeft: '3px solid rgba(0,220,110,0.4)',
        paddingTop: '4px', paddingBottom: '4px'
      }}>
        <p style={{ fontSize: '18px', color: '#ffffff', lineHeight: '1.6', fontStyle: 'italic' }} className="font-clash">
          "Verified reputation for every worker,<br />regardless of where they are."
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('mission.problemSubtitle', 'THE PROBLEM')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          2B+ informal economy workers have no way to prove their skills or track record.
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('mission.solutionSubtitle', 'THE SOLUTION')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          Soulbound credentials on Stellar blockchain — permanent, tamper-proof, verifiable by anyone.
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('mission.visionSubtitle', 'THE VISION')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          A world where your work history belongs to you, not a platform.
        </p>
      </div>

    </div>
  );
};

export default Mission;
