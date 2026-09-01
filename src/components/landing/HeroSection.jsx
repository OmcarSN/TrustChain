import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SeamlessHeroVideo from './SeamlessHeroVideo';

/**
 * HeroSection — Full-screen hero section for TrustChain:
 * - Full-screen looping CloudFront video background stretched edge-to-edge
 * - Clean, professionally stretched main typography with wide tracking
 * - Subtle dim light sweep effect passing inside the main heading text on load
 * - Balanced vertical distribution with generous bottom breathing room
 * - Unified max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 container alignment matching the navbar
 * - Complete i18n support for English and Hindi
 */
const HeroSection = ({ t: propT }) => {
  const { t: hookT } = useTranslation();
  const t = propT || hookT;

  const videoUrl =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4';

  return (
    <section
      className="relative w-full h-screen flex flex-col justify-center bg-[#0B0B0C] text-white select-none overflow-hidden"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0B0B0C',
        top: 0,
        margin: 0,
      }}
      aria-label="TrustChain Hero"
    >
      {/* ── 1. Full-screen Seamless Looping Video Background (Edge-to-Edge) ── */}
      <SeamlessHeroVideo src={videoUrl} />

      {/* Dark Overlay Gradient (black/40 via black/50 to black/70) */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/30 via-black/45 to-black/70 z-[1] pointer-events-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        aria-hidden="true"
      />

      {/* Bottom vignette to blend into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none"
        style={{ width: '100%' }}
        aria-hidden="true"
      />

      {/* ── 2. Content Layout (Centered vertically and horizontally) ── */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-center text-center flex-grow my-auto pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-visible"
        style={{
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center overflow-visible mx-auto">
          {/* Main Hero Heading with a subtle dim light sweep inside the text only */}
          <div className="w-full max-w-4xl py-1">
            <h1
              className="uppercase w-full flex flex-col items-center text-center overflow-visible tracking-tight select-none"
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                fontSize: 'clamp(2.25rem, 5.5vw, 4.75rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
              }}
            >
              {/* Line 1: YOUR WORK. */}
              <motion.span
                initial={{ backgroundPosition: '200% 0' }}
                animate={{ backgroundPosition: '-200% 0' }}
                transition={{
                  duration: 2.2,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="whitespace-nowrap block"
                style={{
                  backgroundImage:
                    'linear-gradient(115deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.78) 40%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.78) 60%, rgba(255, 255, 255, 0.78) 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
                }}
              >
                {t('landing.titleLine1', 'YOUR WORK.')}
              </motion.span>

              {/* Line 2: YOUR REPUTATION. */}
              <motion.span
                initial={{ backgroundPosition: '200% 0' }}
                animate={{ backgroundPosition: '-200% 0' }}
                transition={{
                  duration: 2.2,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="whitespace-nowrap block"
                style={{
                  backgroundImage:
                    'linear-gradient(115deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.78) 40%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.78) 60%, rgba(255, 255, 255, 0.78) 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
                }}
              >
                {t('landing.titleLine2', 'YOUR REPUTATION.')}
              </motion.span>

              {/* Line 3: ON-CHAIN FOREVER. */}
              <motion.span
                initial={{ backgroundPosition: '200% 0' }}
                animate={{ backgroundPosition: '-200% 0' }}
                transition={{
                  duration: 2.2,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="whitespace-nowrap block"
                style={{
                  backgroundImage:
                    'linear-gradient(115deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.42) 40%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.42) 60%, rgba(255, 255, 255, 0.42) 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
                }}
              >
                {t('landing.titleLine3', 'ON-CHAIN FOREVER.')}
              </motion.span>
            </h1>
          </div>

          {/* Subheading: Compact, refined text style */}
          <p
            className="max-w-md sm:max-w-xl mt-6 sm:mt-7 text-center mx-auto"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 300,
              fontSize: '17px',
              letterSpacing: '0.3px',
              color: 'rgba(255, 255, 255, 0.55)',
              lineHeight: 1.7,
              textWrap: 'balance',
            }}
          >
            {t(
              'landing.hero_subheading',
              'Decentralized credentials for informal economy workers — verified on Stellar blockchain.'
            )}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-row items-center justify-center flex-wrap"
            style={{
              marginTop: '32px',
              gap: '16px',
            }}
          >
            {/* Button 1: "I'M A WORKER" — solid blue background, white bold uppercase text, rounded-full shape, right arrow icon with 8px gap, identical height */}
            <Link
              to="/worker"
              className="inline-flex items-center justify-center font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] box-border border border-transparent"
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                padding: '16px 32px',
                lineHeight: '1.25',
                gap: '8px',
                boxSizing: 'border-box',
              }}
            >
              <span>{t('landing.hero_cta_worker', "I'M A WORKER")}</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>

            {/* Button 2: "FIND WORKERS" — transparent background, white border, white bold uppercase text, rounded-full shape, identical height */}
            <Link
              to="/discover"
              className="inline-flex items-center justify-center font-bold uppercase tracking-wider text-white bg-transparent border border-white hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] box-border"
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                padding: '16px 32px',
                lineHeight: '1.25',
                boxSizing: 'border-box',
              }}
            >
              <span>{t('landing.hero_cta_find', 'FIND WORKERS')}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  /** i18next translation function. */
  t: PropTypes.func,
};

HeroSection.defaultProps = {
  t: null,
};

export default HeroSection;
