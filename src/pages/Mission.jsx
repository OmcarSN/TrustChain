import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Mission — Static content page explaining the TrustChain project's purpose.
 * Renders a hero quote, problem statement, solution overview, and vision
 * sections in a structured editorial layout with accent borders.
 *
 * @returns {React.ReactElement} The Mission page.
 */
const Mission = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050505', overflow: 'hidden' }}>
      {/* Background Decorations */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-green" />
      <div className="tc-orb-blue" />

      <div className="tc-page" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
      
        <h1 className="font-clash tc-heading-hero tc-mb-2xl reveal" style={{ textTransform: 'uppercase' }}>
          <span className="text-gradient">{t('mission_page_title')}</span>
        </h1>

        <div className="glass-card tc-mb-2xl reveal reveal-d1" style={{ padding: '24px 28px' }}>
          <p className="font-clash tc-text-white tc-text-italic" style={{ fontSize: '18px', lineHeight: '1.6' }}>
            {t('mission_quote')}
          </p>
        </div>

        {[
          { label: t('the_problem'), text: t('problem_text') },
          { label: t('the_solution'), text: t('solution_text') },
          { label: t('the_vision'), text: t('vision_text') },
        ].map((section, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <div className="section-divider" style={{ margin: '32px 0' }} />}
            <div className={`glass-card reveal reveal-d${idx + 1}`} style={{ marginBottom: '24px', padding: '28px' }}>
              <p className="font-inter uppercase tc-eyebrow tc-mb-sm" style={{ color: '#22c55e' }}>
                {section.label}
              </p>
              <p className="font-inter tc-body-lg tc-text-dim" style={{ lineHeight: '1.8' }}>
                {section.text}
              </p>
            </div>
          </React.Fragment>
        ))}

      </div>
    </div>
  );
};

export default Mission;
