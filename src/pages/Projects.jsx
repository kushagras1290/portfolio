import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { PROFESSIONAL_PROJECTS, FREELANCE_PROJECTS, COLLEGE_PROJECTS, HOBBY_PROJECTS } from '../data/index.js';

const TABS = [
  { id: 'professional', label: 'Professional', data: PROFESSIONAL_PROJECTS },
  { id: 'hobby', label: 'Hobby', data: HOBBY_PROJECTS },
  { id: 'freelance', label: 'Freelance', data: FREELANCE_PROJECTS },
  { id: 'college', label: 'College', data: COLLEGE_PROJECTS },
];

export default function Projects() {
  const [active, setActive] = useState('professional');
  useScrollReveal();

  const currentProjects = TABS.find(t => t.id === active)?.data ?? [];

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Projects</span>
          </div>
          <p className="label">Selected Projects</p>
          <h1 className="sec-title">
            Systems Built<br />From Scratch
          </h1>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--on-surface-var)', maxWidth: 620 }}>
            40+ projects across professional, freelance, academic, and personal work.
            Click any project to see full technical details.
          </p>
        </div>
      </div>

      <section style={{ background: 'var(--void-black)', paddingTop: '3rem' }}>
        <div className="container">
          {/* Filter tabs */}
          <div className="proj-filter-bar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`pf-btn ${active === tab.id ? 'active' : ''}`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
                <span className="pf-count">{tab.data.length}</span>
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className="proj-grid">
            {currentProjects.map((p, i) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className={`proj-card ${p.featured ? 'feat' : ''} reveal-card`}
                style={{ '--si': i % 3 }}
              >
                <div className="proj-num">{p.num} // {p.badge}</div>
                <div className="proj-name">{p.name}</div>
                <div className="proj-desc">{p.tagline}</div>
                <div className="proj-foot">
                  <div className="proj-stack">
                    {p.stack.slice(0, 5).map(s => (
                      <span className="chip muted" key={s}>{s}</span>
                    ))}
                    {p.stack.length > 5 && (
                      <span className="chip muted">+{p.stack.length - 5}</span>
                    )}
                  </div>
                  <span className="proj-arr">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
