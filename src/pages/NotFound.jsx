import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 flex items-center justify-center relative overflow-hidden text-white">
      {/* Light leak */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '30%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md relative z-10"
      >
        {/* Large 404 */}
        <h1 className="font-clash text-[120px] md:text-[180px] font-bold tracking-tighter leading-none text-white/[0.06] select-none">
          404
        </h1>

        <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 -mt-8">
          <Search className="w-7 h-7 text-white/20" />
        </div>

        <h2 className="font-clash text-2xl font-bold mb-3 tracking-tighter">
          {t('notFound.title', 'Page Not Found')}
        </h2>
        <p className="text-white/30 text-sm mb-8 font-inter font-light leading-relaxed">
          {t('notFound.subtitle', 'The page you requested does not exist on the TrustChain network.')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
          >
            <Home className="w-4 h-4" /> {t('notFound.goHome', 'Go Home')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 py-4 border border-white/15 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> {t('notFound.goBack', 'Go Back')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
