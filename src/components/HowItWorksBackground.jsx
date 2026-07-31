import { useEffect, useRef } from 'react';
import logoUrl from '../assets/trustchain-logo-watermark.png';

/**
 * HowItWorksBackground — Scroll-driven cinematic logo background.
 *
 * The TrustChain mark is split into four quadrants that sit assembled at the
 * centre of the viewport. As the visitor scrolls, the pieces ease apart toward
 * the corners, spin on three axes, pop toward the camera, glow blue, then
 * settle into a faint watermark. Adapted from a vanilla-JS scroll design into a
 * React component: a single requestAnimationFrame loop writes transforms
 * directly to the DOM (no per-frame React state), eased toward the live scroll
 * position for a buttery feel.
 *
 * Fully static (assembled, dim) under `prefers-reduced-motion: reduce`.
 * Decorative only: fixed, centred, pointer-events none, sits behind content.
 *
 * @returns {React.ReactElement} The HowItWorksBackground component.
 */
const HowItWorksBackground = () => {
  const topLeftRef = useRef(null);
  const topRightRef = useRef(null);
  const bottomLeftRef = useRef(null);
  const bottomRightRef = useRef(null);

  useEffect(() => {
    // Respect users who prefer reduced motion — leave the assembled watermark.
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const parts = [
      topLeftRef.current,
      topRightRef.current,
      bottomLeftRef.current,
      bottomRightRef.current,
    ];
    if (parts.some((p) => !p)) return undefined;
    const [topLeft, topRight, bottomLeft, bottomRight] = parts;

    let targetScrollY = window.scrollY;
    let currentScrollY = targetScrollY;
    let rafId = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const MAX_SCROLL = 600; // effect completes within the first 600px of scroll

    const animate = () => {
      // Buttery-smooth easing toward the live scroll position.
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      const progress = Math.min(currentScrollY / MAX_SCROLL, 1);
      // Arc peaks (0 → 1 → 0) at the middle of the scroll for a "pop" moment.
      const arc = Math.sin(progress * Math.PI);

      // Pops toward the camera (1.3x) then shrinks into the corners (0.6x).
      const scale = 1 + arc * 0.3 - progress * 0.4;

      // Cinematic blue glow — brilliant when lifted, gone once tucked away.
      const shadow = `drop-shadow(0px ${arc * 30}px ${arc * 40}px rgba(0, 80, 255, ${arc * 0.6}))`;

      // Tuned for the dark theme: subtle at rest, gentle glow mid-scroll, faint
      // watermark after — keeps foreground copy readable throughout.
      const opacity = (0.22 + arc * 0.2) * (1 - progress * 0.6);

      // Fly-apart distance, recomputed each frame so it stays responsive.
      const pushDeeper = 80;
      const maxMoveX = Math.max(window.innerWidth / 2 - 100 * scale + pushDeeper, 0);
      const maxMoveY = Math.max(window.innerHeight / 2 - 100 * scale + pushDeeper, 0);
      const moveX = progress * maxMoveX;
      const moveY = progress * maxMoveY;

      // Multi-axis 3D rotation.
      const rotateZ = progress * 360; // flat spin
      const rotateX = arc * 180; // forward flip
      const rotateY = arc * 180; // sideways flip

      topLeft.style.transform = `translate3d(-${moveX}px, -${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(-${rotateZ}deg) scale(${scale})`;
      topRight.style.transform = `translate3d(${moveX}px, -${moveY}px, 0) rotateX(${rotateX}deg) rotateY(-${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
      bottomLeft.style.transform = `translate3d(-${moveX}px, ${moveY}px, 0) rotateX(-${rotateX}deg) rotateY(${rotateY}deg) rotateZ(-${rotateZ}deg) scale(${scale})`;
      bottomRight.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(-${rotateX}deg) rotateY(-${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;

      for (const part of parts) {
        part.style.opacity = String(opacity);
        part.style.filter = shadow;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const partBase = {
    width: '50%',
    height: '50%',
    backgroundImage: `url(${logoUrl})`,
    backgroundSize: '200% 200%', // relative to each 50% quadrant → one full container-sized image, so the 4 quarters tile seamlessly at ANY container size (identical to 400px at the 400px desktop container)
    backgroundRepeat: 'no-repeat',
    willChange: 'transform, opacity, filter',
    backfaceVisibility: 'visible',
    transformStyle: 'preserve-3d',
    opacity: 0.18, // resting value before the rAF loop takes over (also the reduced-motion state)
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        maxWidth: '92vw',
        maxHeight: '92vw',
        display: 'flex',
        flexWrap: 'wrap',
        perspective: '1200px',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div ref={topLeftRef} style={{ ...partBase, backgroundPosition: 'top left' }} />
      <div ref={topRightRef} style={{ ...partBase, backgroundPosition: 'top right' }} />
      <div ref={bottomLeftRef} style={{ ...partBase, backgroundPosition: 'bottom left' }} />
      <div ref={bottomRightRef} style={{ ...partBase, backgroundPosition: 'bottom right' }} />
    </div>
  );
};

export default HowItWorksBackground;
