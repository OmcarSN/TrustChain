import React from 'react';
import { motion } from 'framer-motion';
import TrustChainLogo from './TrustChainLogo';
import PropTypes from 'prop-types';

/**
 * BrandedLoader — Full-screen branded loading overlay.
 * Displays the TrustChain logo with a breathing animation,
 * a sliding progress bar, and a customizable loading message.
 *
 * @param {Object} props
 * @param {string} [props.message='Loading...'] - Loading status message.
 * @returns {React.ReactElement} The BrandedLoader component.
 */
const BrandedLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: '#05060A' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TrustChainLogo size={48} />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-48 h-px overflow-hidden mb-4"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <motion.div
          className="h-full"
          style={{ background: 'rgba(255,255,255,0.4)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 font-inter"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default BrandedLoader;

BrandedLoader.propTypes = {
  /** Loading status message displayed below the progress bar. */
  message: PropTypes.string,
};
