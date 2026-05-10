import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatformStats } from '../hooks/usePlatformStats';

/**
 * About — Static content page describing the TrustChain project.
 * Features animated stat counters (worker count, endorsement count)
 * with eased number animation and editorial section layout.
 *
 * @returns {React.ReactElement} The About page.
 */
const About = () => {
  const { t } = useTranslation();
  const { workerCount, totalEndorsements } = usePlatformStats();
  
  const [displayStats, setDisplayStats] = useState({ workers: 0, reviews: 0 });
  const [status, setStatus] = useState('fetching');

  useEffect(() => {
    setStatus('fetching');
    
    // Simulate a brief fetch delay to show the loading state
    const timer = setTimeout(() => {
      setStatus('animating');
      
      const duration = 800; // 800ms
      const fps = 60;
      const frames = Math.round((duration / 1000) * fps);
      let currentFrame = 0;

      const targetWorkers = workerCount || 0;
      const targetReviews = totalEndorsements || 0;

      const interval = setInterval(() => {
        currentFrame++;
        const progress = currentFrame / frames;
        // Ease out quart
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        setDisplayStats({
          workers: Math.round(targetWorkers * easeProgress),
          reviews: Math.round(targetReviews * easeProgress)
        });

        if (currentFrame >= frames) {
          clearInterval(interval);
          setDisplayStats({ workers: targetWorkers, reviews: targetReviews });
          setStatus('done');
        }
      }, 1000 / fps);

      return () => clearInterval(interval);
    }, 400); // 400ms artificial network delay

    return () => clearTimeout(timer);
  }, [workerCount, totalEndorsements]);

  return (
    <div className="tc-page" style={{ maxWidth: '800px' }}>
      
      <h1 className="font-clash tc-heading-hero tc-mb-2xl" style={{ textTransform: 'uppercase' }}>
        {t('about_trustchain')}
      </h1>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter tc-body-lg tc-text-dim" style={{ lineHeight: '1.8' }}>
          {t('about_description')}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase tc-eyebrow tc-mb-sm">
          {t('our_mission')}
        </p>
        <p className="font-inter tc-body-lg tc-text-dim" style={{ lineHeight: '1.8' }}>
          {t('mission_text')}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p className="font-inter uppercase tc-eyebrow tc-mb-sm">
          {t('built_by')}
        </p>
        <p className="font-inter tc-body-lg tc-text-dim" style={{ lineHeight: '1.8' }}>
          {t('built_by_text')}
        </p>
      </div>

      <div style={{ 
        padding: '16px 20px', 
        border: '1px solid rgba(255,255,255,0.08)', 
        backgroundColor: 'rgba(255,255,255,0.02)',
        display: 'inline-block',
        marginTop: '20px'
      }}>
        <p className="font-inter" style={{ 
          fontSize: '12px', 
          letterSpacing: '2px', 
          color: status === 'fetching' ? '#444444' : 'rgba(255,255,255,0.4)', 
          textTransform: 'uppercase',
          transition: 'color 0.3s ease'
        }}>
          {status === 'fetching' ? '—' : displayStats.workers} WORKERS · {status === 'fetching' ? '—' : displayStats.reviews} REVIEWS · 100% GASLESS
        </p>
      </div>

    </div>
  );
};

export default About;
