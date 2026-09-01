import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';

/**
 * CtaSection — Cinematic Call-to-Action banner with HLS video background.
 * Streams Mux video with hls.js (and native Safari fallback), blends seamless
 * top and bottom gradients, and preserves exact TrustChain text and links.
 *
 * @param {Object} props
 * @param {Function} props.t - Translation function
 * @param {number} props.workerCount - Active verified worker count
 * @returns {React.ReactElement} The CTA section.
 */
const CtaSection = ({ t, workerCount = 21 }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

    let hlsInstance = null;

    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      });
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center px-4 sm:px-6 my-16 md:my-24">
      <section
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl"
        style={{
          padding: '64px 24px',
          border: '1px solid rgba(79, 107, 237, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(79, 107, 237, 0.12) 0%, rgba(5, 6, 10, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          opacity: 0,
          animation: 'ctaFadeUp 0.6s ease forwards',
          animationDelay: '0.4s',
        }}
      >
        {/* Background HLS Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-45 pointer-events-none"
        />

        {/* Top Gradient Fade */}
        <div
          className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
          style={{
            height: '140px',
            background: 'linear-gradient(to bottom, #05060A 0%, rgba(5, 6, 10, 0.6) 40%, transparent 100%)',
          }}
        />

        {/* Bottom Gradient Fade */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
          style={{
            height: '140px',
            background: 'linear-gradient(to top, #05060A 0%, rgba(5, 6, 10, 0.6) 40%, transparent 100%)',
          }}
        />

        {/* Animated Glowing Edge */}
        <div className="animated-cta-border rounded-3xl" />

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-2 sm:px-4">
          <h2
            className="font-clash text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 text-center w-full leading-tight"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
              textWrap: 'balance',
            }}
          >
            Ready to build your <span className="whitespace-nowrap">on-chain</span> reputation?
          </h2>

          <p
            className="font-inter text-sm sm:text-base md:text-lg text-white/70 font-light max-w-xl mx-auto mb-8 text-center"
            style={{
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)',
            }}
          >
            {t('landing.ctaSubtitle', {
              count: workerCount,
              defaultValue: `Join ${workerCount}+ verified workers on TrustChain.`,
            })}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full mx-auto">
            <Link
              to="/worker"
              className="btn-glow font-inter inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                textDecoration: 'none',
              }}
            >
              {t('landing.btnWorker', "I'm a Worker")}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>

            <Link
              to="/discover"
              className="btn-outline-glow font-inter inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium text-white/90 transition-all hover:bg-white/5 active:scale-[0.98]"
              style={{
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              {t('landing.ctaButton', 'EXPLORE THE NETWORK →')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CtaSection;
