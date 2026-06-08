import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Nav() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ks-theme') || 'dark');

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ks-theme', next);
    setTheme(next);
  }

  return (
    <nav id="nav">
      <Link to="/" className="nav-brand">KUSHAGRA <em>SINGH</em></Link>
      <ul className="nav-links">
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
        <button
          type="button"
          id="theme-toggle"
          onClick={toggleTheme}
          title="Toggle light / dark mode"
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
      </div>
    </nav>
  );
}
