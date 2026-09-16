import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_PROJECTS } from '../data/index.js';

const PAGES = [
  { id: 'page-home', label: 'Home', sub: 'Overview & featured work', to: '/' },
  { id: 'page-experience', label: 'Experience', sub: 'Roles & production systems', to: '/experience' },
  { id: 'page-projects', label: 'Projects', sub: `${ALL_PROJECTS.length} documented builds`, to: '/projects' },
  { id: 'page-skills', label: 'Skills', sub: 'Languages, AI/ML, infra', to: '/skills' },
  { id: 'page-education', label: 'Education', sub: 'Degrees & certifications', to: '/education' },
  { id: 'page-about', label: 'About', sub: 'Bio & accomplishments', to: '/about' },
  { id: 'page-contact', label: 'Contact', sub: 'Email, phone, socials', to: '/contact' },
];

const MAX_PROJECT_RESULTS = 8;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pageMatches = PAGES
      .filter(p => !q || p.label.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q))
      .map(p => ({ ...p, group: 'Pages' }));
    const projectMatches = ALL_PROJECTS
      .filter(p => !q
        || p.name.toLowerCase().includes(q)
        || p.tagline.toLowerCase().includes(q)
        || p.stack.join(' ').toLowerCase().includes(q))
      .slice(0, MAX_PROJECT_RESULTS)
      .map(p => ({ id: p.id, label: p.name, sub: p.tagline, to: `/projects/${p.id}`, group: 'Projects' }));
    return [...pageMatches, ...projectMatches];
  }, [query]);

  useEffect(() => {
    function onKeyDown(e) {
      const isTogglingKey = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey);
      if (isTogglingKey) {
        e.preventDefault();
        setOpen(o => !o);
        return;
      }
      const focusedTag = document.activeElement?.tagName;
      const isTypingElsewhere = focusedTag === 'INPUT' || focusedTag === 'TEXTAREA';
      if (e.key === '/' && !open && !isTypingElsewhere) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActiveIndex(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  function go(item) {
    navigate(item.to);
    setOpen(false);
  }

  function onInputKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="cmdk-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open quick navigation"
      >
        <span aria-hidden="true">⌕</span>
        <span className="cmdk-trigger-label">Search</span>
        <kbd>⌘K</kbd>
      </button>

      {open && (
        <div className="cmdk-backdrop" onMouseDown={() => setOpen(false)}>
          <div
            className="cmdk-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="cmdk-input-row">
              <span aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Jump to a page or project…"
                aria-label="Search pages and projects"
              />
              <span className="cmdk-esc">ESC</span>
            </div>
            <div className="cmdk-results" role="listbox">
              {results.length === 0 && (
                <div className="cmdk-empty">No matches. Try a different term.</div>
              )}
              {['Pages', 'Projects'].map(group => {
                const items = results.filter(r => r.group === group);
                if (!items.length) return null;
                return (
                  <div key={group}>
                    <div className="cmdk-group-label">{group}</div>
                    {items.map(item => {
                      const globalIndex = results.indexOf(item);
                      return (
                        <div
                          key={item.id}
                          role="option"
                          aria-selected={globalIndex === activeIndex}
                          className={`cmdk-item ${globalIndex === activeIndex ? 'active' : ''}`}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          onClick={() => go(item)}
                        >
                          <span>{item.label}</span>
                          <span className="cmdk-item-sub">{item.sub}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
