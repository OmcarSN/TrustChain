import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Sparkles, Briefcase, ShieldCheck } from 'lucide-react';

/**
 * Maps nav item paths/names to the requested lucide-react icons:
 * - Home -> Sparkles
 * - Find Workers -> Briefcase
 * - How It Works -> ShieldCheck
 */
const getNavIcon = (link) => {
  const path = link.path || '';
  const name = (link.name || '').toLowerCase();
  if (path === '/' || name.includes('home')) {
    return Sparkles;
  }
  if (path.includes('discover') || name.includes('worker') || name.includes('find')) {
    return Briefcase;
  }
  if (path.includes('how') || name.includes('how') || name.includes('work')) {
    return ShieldCheck;
  }
  return Sparkles;
};

/**
 * DesktopNavLinks — Navigation links with icons and labels without outer container shapes.
 */
const DesktopNavLinks = ({ navLinks, location }) => (
  <div
    className="hidden lg:flex items-center gap-6 sm:gap-8 select-none"
    role="menubar"
    aria-label="Main menu"
  >
    {navLinks.map((link) => {
      const isActive = location.pathname === link.path && !link.path.includes('#');
      const isHash = link.path.includes('#');
      const LinkComp = isHash ? 'a' : Link;
      const linkProps = isHash ? { href: link.path } : { to: link.path };
      const IconComponent = getNavIcon(link);

      return (
        <LinkComp
          key={link.path}
          {...linkProps}
          className="group inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 ease-out"
          aria-current={isActive ? 'page' : undefined}
          role="menuitem"
        >
          <IconComponent
            className={`w-[18px] h-[18px] transition-all duration-200 ${
              isActive
                ? 'text-white scale-105'
                : 'text-white/70 group-hover:text-white group-hover:scale-105'
            }`}
            aria-hidden="true"
          />
          <span
            className={`text-[15px] font-medium tracking-wide transition-colors duration-200 ${
              isActive
                ? 'text-white font-semibold'
                : 'text-white/80 group-hover:text-white'
            }`}
          >
            {link.name}
          </span>
        </LinkComp>
      );
    })}
  </div>
);

export default DesktopNavLinks;

DesktopNavLinks.propTypes = {
  /** Array of navigation link objects. */
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      /** Display label for the link. */
      name: PropTypes.string.isRequired,
      /** Route path or hash anchor. */
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** React Router location object for active-link detection. */
  location: PropTypes.object.isRequired,
};


