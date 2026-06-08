import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { EXPERIENCE } from '../data/index.js';

export default function Experience() {
  useScrollReveal();

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Experience</span>
          </div>
          <p className="label">Work Experience</p>
          <h1 className="sec-title">
            Production Systems<br />Shipped &amp; Owned
          </h1>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--on-surface-var)', maxWidth: 620 }}>
            Full product ownership from architecture through production deployment —
            no sprint tickets, no hand-holding. Every system below runs on live traffic.
          </p>
        </div>
      </div>

      <section style={{ background: 'var(--deep-charcoal)', paddingTop: 'var(--sy)' }}>
        <div className="container">
          <div className="exp-grid">
            {EXPERIENCE.map(job => (
              <div className="exp-card reveal" key={job.id}>
                <div className="exp-top">
                  <div>
                    <div className="exp-co">{job.company}</div>
                    <div className="exp-role">{job.role}</div>
                  </div>
                  <div className="exp-when">
                    <div className="exp-period">{job.period}</div>
                    <div className="exp-loc">{job.location}</div>
                  </div>
                </div>
                {job.sections.map(sec => (
                  <div className="exp-sub" key={sec.title}>
                    <div className="exp-sub-title">{sec.title}</div>
                    <ul className="bullets">
                      {sec.bullets.map((b, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
