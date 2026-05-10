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
      {/* Light leak */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '30%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md relative z-10"
      >
        {/* Large 404 */}
        <h1 className="font-clash select-none" style={{ opacity: '0.06', fontSize: '20vw', fontWeight: '900', lineHeight: 1, margin: 0 }}>
          404
        </h1>

        <h2 className="font-clash" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '32px', marginTop: '0', textTransform: 'uppercase' }}>
          {t('notFound.subtitle', 'Route Not Found')}
        </h2>

        <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '12px' }}>
          <Link
            to="/"
            className="bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
            style={{ padding: '12px 32px' }}
          >
            <Home className="w-4 h-4" /> {t('notFound.goHome', 'Go Home')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border border-white/15 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            style={{ padding: '12px 32px' }}
          >
            <ArrowLeft className="w-4 h-4" /> {t('notFound.goBack', 'Go Back')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
