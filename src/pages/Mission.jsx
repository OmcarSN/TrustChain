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
    <div className="tc-page" style={{ maxWidth: '800px' }}>
      
      <h1 className="font-clash tc-heading-hero tc-mb-2xl" style={{ textTransform: 'uppercase' }}>
        {t('mission_page_title')}
      </h1>

      <div className="tc-bio-quote tc-mb-2xl" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
        <p className="font-clash tc-text-white tc-text-italic" style={{ fontSize: '18px', lineHeight: '1.6' }}>
          {t('mission_quote')}
        </p>
      </div>

      {[
        { label: t('the_problem'), text: t('problem_text') },
        { label: t('the_solution'), text: t('solution_text') },
        { label: t('the_vision'), text: t('vision_text') },
      ].map((section, idx) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <p className="font-inter uppercase tc-eyebrow tc-mb-sm">
            {section.label}
          </p>
          <p className="font-inter tc-body-lg tc-text-dim" style={{ lineHeight: '1.8' }}>
            {section.text}
          </p>
        </div>
      ))}

    </div>
  );
};

export default Mission;
