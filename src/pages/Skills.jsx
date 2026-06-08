import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { SKILLS } from '../data/index.js';

const PILL_CLASS = { lime: '', cyan: 'c', amber: 'a' };

const TAB_LABELS = {
  lang: 'Languages',
  fw: 'Frameworks & APIs',
  ai: 'AI / ML / LLM',
  infra: 'Platforms & Infra',
  ds: 'Data Science',
};

export default function Skills() {
  const [active, setActive] = useState('lang');
  useScrollReveal();

  const current = SKILLS[active];

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Skills</span>
          </div>
          <p className="label">Technical Arsenal</p>
          <h1 className="sec-title">
            What I<br />Build With
          </h1>
        </div>
      </div>

      <section style={{ background: 'var(--deep-charcoal)' }}>
        <div className="container">
          <div className="skills-wrap reveal">
            <div className="skills-nav">
              {Object.entries(TAB_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`s-btn ${active === key ? 'on' : ''}`}
                  onClick={() => setActive(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="skills-body">
              <div className="sg-title">{current.title}</div>
              {current.groups.map((group, gi) => (
                <div className="pill-row" key={gi}>
                  {group.pills.map(pill => (
                    <span
                      key={pill}
                      className={`skill-pill ${PILL_CLASS[group.color] || ''}`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
