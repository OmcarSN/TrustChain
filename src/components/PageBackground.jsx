/**
 * PageBackground — Shared atmospheric background (grid + orbs + light leaks).
 * Extracted from 5+ pages where this exact pattern was duplicated.
 * Renders fixed/absolute-positioned decorative elements; no interactive content.
 *
 * @returns {React.ReactElement} The PageBackground component.
 */
const PageBackground = () => (
  <>
    {/* Grid overlay */}
    <div className="tc-bg-grid" />
    {/* Blue orb — top-right */}
    <div className="tc-orb-blue" />
    {/* Green orb — bottom-left */}
    <div className="tc-orb-green" />
    {/* Light leak — orange */}
    <div className="tc-leak-orange" />
    {/* Light leak — blue */}
    <div className="tc-leak-blue" />
  </>
);

export default PageBackground;
