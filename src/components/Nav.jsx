import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import CommandPalette from './CommandPalette.jsx';

export default function Nav() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ks-theme') || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function applyTheme(next) {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ks-theme', next);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'light' ? '#f4f7f6' : '#07090b');
    setTheme(next);
  }

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    const canTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canTransition) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  }

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="nav-brand"><em>KUSHAGRA</em> <em>SINGH</em></Link>
      <ul id="primary-navigation" className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        <li><NavLink to="/experience">Experience</NavLink></li>
        <li><NavLink to="/projects">Projects</NavLink></li>
        <li><NavLink to="/skills">Skills</NavLink></li>
        <li><NavLink to="/education">Education</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <div className="nav-right">
        <div className="nav-badge">
          <span className="pulse-dot" />
          <span>AVAILABLE</span>
        </div>
        <CommandPalette />
        <button
          type="button"
          id="theme-toggle"
          onClick={toggleTheme}
          title="Toggle light / dark mode"
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <button
          type="button"
          className={`nav-hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(open => !open)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
