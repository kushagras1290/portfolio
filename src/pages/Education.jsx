import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { EDUCATION, CERTS } from '../data/index.js';

export default function Education() {
  useScrollReveal();

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Education</span>
          </div>
          <p className="label">Education</p>
          <h1 className="sec-title">Academic Foundation</h1>
        </div>
      </div>

      <section style={{ background: 'var(--void-black)' }}>
        <div className="container">
          <div className="edu-grid reveal">
            {EDUCATION.map(e => (
              <div className="edu-card" key={e.deg}>
                <div className="edu-deg">{e.deg}</div>
                <div className="edu-school">{e.school}</div>
                <div className="edu-year">{e.year}</div>
                <span className={`chip ${e.badgeColor === 'amber' ? 'amber' : ''}`}>
                  {e.badge}
                </span>
              </div>
            ))}
            <div className="edu-card accent">
              <div className="edu-deg" style={{ color: 'var(--neural-lime)' }}>Currently</div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--on-surface-var)', marginTop: '0.5rem' }}>
                Building production AI systems independently.
                Open to senior engineering roles in AI, automation,
                and LLM-driven product development.
              </p>
            </div>
          </div>

          <p className="label reveal" style={{ marginTop: '4rem' }}>Certifications</p>
          <div className="cert-grid reveal">
            {CERTS.map(c => (
              <div className="cert-card" key={c.name}>
                <span className="cert-ico">◈</span>
                <div>
                  <div className="cert-n">{c.name}</div>
                  <div className="cert-p">{c.provider}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
