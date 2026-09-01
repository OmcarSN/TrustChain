import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * SeamlessHeroVideo — Zero-stutter, dual-buffered video background player.
 * Eliminates the HTML5 video loop freeze/pause by preloading and crossfading
 * between two synchronized video instances at the seam boundary.
 */
const SeamlessHeroVideo = ({ src }) => {
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const [activeVideo, setActiveVideo] = useState('A');
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const vidA = videoRefA.current;
    const vidB = videoRefB.current;
    if (!vidA || !vidB) return;

    // Ensure initial playback
    const startInitial = () => {
      vidA.play().catch(() => {});
    };
    startInitial();

    const FADE_TIME = 0.75; // seconds before end to crossfade seamlessly
    let animationFrameId;

    const checkLoop = () => {
      const current = activeVideo === 'A' ? vidA : vidB;
      const next = activeVideo === 'A' ? vidB : vidA;

      if (current && current.duration && !isTransitioningRef.current) {
        const timeLeft = current.duration - current.currentTime;
        if (timeLeft <= FADE_TIME && timeLeft > 0) {
          isTransitioningRef.current = true;
          next.currentTime = 0;
          const playPromise = next.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setActiveVideo((prev) => (prev === 'A' ? 'B' : 'A'));
                setTimeout(() => {
                  try {
                    current.pause();
                    current.currentTime = 0;
                  } catch {
                    // Ignore pause exceptions
                  }
                  isTransitioningRef.current = false;
                }, FADE_TIME * 1000);
              })
              .catch(() => {
                // If autoplay was blocked or delayed, fallback gracefully
                isTransitioningRef.current = false;
              });
          }
        }
      }

      animationFrameId = requestAnimationFrame(checkLoop);
    };

    animationFrameId = requestAnimationFrame(checkLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeVideo, src]);

  return (
    <div
      className="pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <video
        ref={videoRefA}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          opacity: activeVideo === 'A' ? 1 : 0,
          transition: 'opacity 0.75s linear',
          willChange: 'opacity',
        }}
      />
      <video
        ref={videoRefB}
        src={src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          opacity: activeVideo === 'B' ? 1 : 0,
          transition: 'opacity 0.75s linear',
          willChange: 'opacity',
        }}
      />
    </div>
  );
};

SeamlessHeroVideo.propTypes = {
  src: PropTypes.string.isRequired,
};

export default SeamlessHeroVideo;
