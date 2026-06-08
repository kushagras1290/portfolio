import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { HOBBY_PROJECTS } from '../data/index.js';

export default function HobbyProjects() {
  useScrollReveal();

  return (
    <div className="page-enter">
      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="page-header" style={{ background: 'var(--void-black)' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Hobby Projects</span>
          </div>

          <p className="label">Personal Lab</p>
          <h1 className="sec-title">
            Hobby<br />Projects
          </h1>

          <p style={{
            fontSize: '0.9rem',
            lineHeight: 1.8,
            color: 'var(--on-surface-var)',
            maxWidth: 640,
            marginBottom: '2rem',
          }}>
            Systems built outside of work — to explore production patterns, push depth on specific
            domains, and build things I'd genuinely use. No client deadlines, no scope constraints.
            Just engineering for its own sake.
          </p>

          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['RAG / LLM Ops', 'Agentic AI', 'LLM Evaluation', 'Document AI', 'ML Systems', 'Infra', 'AI Platform'].map(tag => (
              <span className="chip cyan" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROJECTS GRID ────────────────────────────────── */}
      <section style={{ background: 'var(--void-black)', paddingTop: '3rem' }}>
        <div className="container">
          <div className="proj-grid">
            {HOBBY_PROJECTS.map((p, i) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className={`proj-card ${p.featured ? 'feat' : ''} reveal-card`}
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
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

      {/* ── DIVIDER STRIP ────────────────────────────────── */}
      <section style={{ background: 'var(--deep-charcoal)', paddingTop: '0', paddingBottom: '0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2rem var(--sx)',
          maxWidth: 1280,
          margin: '0 auto',
          borderTop: '0.5px solid var(--outline-variant)',
        }}>
          <div>
            <div style={{ fontSize: '0.66rem', letterSpacing: '0.14em', color: 'var(--dim-syntax)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              Also see
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--data-white)' }}>
              Professional &amp; Freelance work
            </div>
          </div>
          <Link to="/projects" className="btn btn-ghost" style={{ flexShrink: 0 }}>
            View All Projects ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
