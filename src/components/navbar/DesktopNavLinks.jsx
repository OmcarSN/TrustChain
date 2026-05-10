import React from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

/**
 * DesktopNavLinks — Centered navigation links for the desktop navbar.
 * Renders each link with an active-page underline indicator and
 * supports both internal routes (Link) and hash anchors (a).
 *
 * @param {Object} props
 * @param {Array<{name: string, path: string}>} props.navLinks - Navigation link items.
 * @param {Object} props.location - React Router location object.
 * @returns {React.ReactElement} The DesktopNavLinks component.
 */
const DesktopNavLinks = ({ navLinks, location }) => (
  <div className="hidden md:flex items-center h-full" style={{ gap: '32px' }} role="menubar" aria-label="Main menu">
    {navLinks.map((link) => {
      const isActive = location.pathname === link.path && !link.path.includes('#');
      const isHash = link.path.includes('#');
      const LinkComp = isHash ? 'a' : Link;
      const linkProps = isHash ? { href: link.path } : { to: link.path };

      return (
        <LinkComp
          key={link.path}
          {...linkProps}
          className={`font-inter uppercase nav-link ${isActive ? 'active-link' : ''}`}
          aria-current={isActive ? 'page' : undefined}
          role="menuitem"
          style={{
            fontSize: '12px',
            fontWeight: isActive ? '700' : '600',
            letterSpacing: '1.5px',
            textDecoration: 'none'
          }}
        >
          {link.name}
        </LinkComp>
      );
    })}
  </div>
);

export default DesktopNavLinks;

DesktopNavLinks.propTypes = {
  /** Array of navigation link objects. */
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    /** Display label for the link. */
    name: PropTypes.string.isRequired,
    /** Route path or hash anchor. */
    path: PropTypes.string.isRequired,
  })).isRequired,
  /** React Router location object for active-link detection. */
  location: PropTypes.object.isRequired,
};
