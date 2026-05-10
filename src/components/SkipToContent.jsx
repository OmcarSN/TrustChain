/**
 * SkipToContent — Accessibility skip-navigation link.
 * Visually hidden until focused via keyboard (Tab).
 * Jumps to #main-content anchor.
 *
 * @returns {React.ReactElement} The SkipToContent component.
 */
const SkipToContent = () => (
  <a
    href="#main-content"
    className="skip-to-content"
    style={{
      position: 'absolute',
      left: '-9999px',
      top: '0',
      zIndex: 99999,
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '1px',
      textDecoration: 'none',
      border: '2px solid #000',
    }}
  >
    Skip to main content
  </a>
);

// CSS for focus state is in index.css:
// .skip-to-content:focus { left: 16px; top: 16px; }

export default SkipToContent;
