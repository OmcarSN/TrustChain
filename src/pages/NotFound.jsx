import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * NotFound — 404 error page.
 * Renders a large ghosted "404" heading, subtitle, and navigation
 * buttons (Home, Go Back) with motion entrance animation.
 *
 * @returns {React.ReactElement} The NotFound page.
 */
const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#050505] px-6 lg:px-12 flex items-start justify-center relative overflow-hidden text-white" style={{ paddingTop: '120px', textAlign: 'center' }}>
      {/* Background Decorations */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-green" />
      <div className="tc-leak-orange" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md relative z-10 glass-card"
        style={{ padding: '40px', borderRadius: '24px' }}
      >
        {/* Large 404 */}
        <h1 className="font-clash select-none text-gradient" style={{ opacity: '0.15', fontSize: '20vw', fontWeight: '900', lineHeight: 1, margin: 0 }}>
          404
        </h1>

        <h2 className="font-clash" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginBottom: '40px', marginTop: '0', textTransform: 'uppercase' }}>
          {t('notFound.subtitle', 'Route Not Found')}
        </h2>

        <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '12px' }}>
          <Link
            to="/"
            className="btn-glow font-inter"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Home className="w-4 h-4" /> {t('notFound.goHome', 'Go Home')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline-glow font-inter"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ArrowLeft className="w-4 h-4" /> {t('notFound.goBack', 'Go Back')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
