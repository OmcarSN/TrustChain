import React from 'react';
import { useTranslation } from 'react-i18next';

const Mission = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ paddingTop: '120px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh', paddingBottom: '80px' }}>
      
      <h1 className="font-clash" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#ffffff', marginBottom: '40px', textTransform: 'uppercase' }}>
        {t('mission_page_title')}
      </h1>

      <div style={{ 
        marginBottom: '40px', 
        paddingLeft: '20px', 
        borderLeft: '3px solid rgba(0,220,110,0.4)',
        paddingTop: '4px', paddingBottom: '4px'
      }}>
        <p style={{ fontSize: '18px', color: '#ffffff', lineHeight: '1.6', fontStyle: 'italic' }} className="font-clash">
          {t('mission_quote')}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('the_problem')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          {t('problem_text')}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('the_solution')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          {t('solution_text')}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('the_vision')}
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }} className="font-inter">
          {t('vision_text')}
        </p>
      </div>

    </div>
  );
};

export default Mission;
