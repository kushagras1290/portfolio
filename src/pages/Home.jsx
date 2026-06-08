import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';


export default function Home() {
  useScrollReveal();

  return (
    <div className="page-enter">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section id="hero">
        <div className="container">
          <div className="hero-inner">
            <div>
              <p className="hero-sysref">
                STATUS: <span style={{ color: 'var(--neural-lime)', fontWeight: 600, letterSpacing: '0.16em', textShadow: '0 0 12px rgba(200,240,106,0.45)' }}>OPEN_TO_WORK</span>
              </p>
              <h1 className="hero-title">
                <span className="lime">KUSHAGRA</span>
                <span className="lime">SINGH</span>
              </h1>
              <p className="hero-sub">
                AI &amp; Automation Engineer building production-grade intelligent systems —
                conversational bots, LLM pipelines, voice AI, and full-stack automation.
                Architecture, code, deployment: solo.
              </p>
              <div className="hero-chips">
                <span className="chip">Python</span>
                <span className="chip">Flask / FastAPI</span>
                <span className="chip">React.js</span>
                <span className="chip cyan">LLM Engineering</span>
                <span className="chip cyan">OpenAI Realtime API</span>
                <span className="chip cyan">Conversational AI</span>
                <span className="chip amber">Supabase</span>
                <span className="chip">Computer Vision</span>
                <span className="chip">Prompt Engineering</span>
              </div>
              <div className="hero-ctas">
                <Link to="/projects" className="btn btn-primary">View Projects ↗</Link>
                <a
                  href="https://github.com/kushagras1290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  GitHub ↗
                </a>
                <Link to="/contact" className="btn btn-ghost">Get In Touch</Link>
              </div>
            </div>

            {/* Terminal */}
            <div className="terminal-panel">
              <div className="t-bar">
                <span className="td r" /><span className="td y" /><span className="td g" />
                <span className="t-bar-title">kushagra@ai-node:~</span>
              </div>
              <div className="t-body">
                <span className="tl"><span className="tp">kushagra@ai-node</span><span className="tpath">:~$</span> <span className="tcmd">./init_profile.sh</span></span>
                <span className="tl tcmt"># Loading profile…</span>
                <span className="tl tout">[INFO] Role    : AI &amp; Automation Engineer</span>
                <span className="tl tout">[INFO] Status  : Open to Work · Jun 2026</span>
                <span className="tl tout">[INFO] Stack   : Python · LangGraph · React · OpenAI</span>
                <span className="tl tout">[INFO] Location: Gurugram, India</span>
                <span className="tl tok">[OK]   WhatsApp bot → 30 langs · GPT-5.2</span>
                <span className="tl tok">[OK]   Multi-agent RAG → 92% relevance · sub-3s</span>
                <span className="tl tok">[OK]   Voice trainer → 18 AI personalities</span>
                <span className="tl tok">[OK]   Agentic OS → LangGraph · 8 connectors</span>
                <span className="tl twarn">[STAT] 40+ projects · 8 freelance clients</span>
                <span className="tl twarn">[STAT] 2× National Hackathon Finalist</span>
                <span className="tl">
                  <span className="tp">kushagra@ai-node</span>
                  <span className="tpath">:~$</span>{' '}
                  <span className="cursor" />
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── QUICK LINKS ───────────────────────────────────── */}
      <section style={{ background: 'var(--deep-charcoal)', paddingTop: '0' }}>
        <div className="container" style={{ paddingTop: 'var(--sy)' }}>
          <p className="label reveal">Navigate</p>
          <h2 className="sec-title reveal">
            Explore the<br />Full Profile
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'var(--outline-variant)',
          }}>
            {[
              { to: '/experience', label: 'Experience', sub: 'GemPundit / Fortuna Retail · 9 months', num: '01' },
              { to: '/projects', label: 'Projects', sub: '40+ systems built & shipped', num: '02' },
              { to: '/skills', label: 'Skills', sub: 'Languages, AI/ML, Infra & more', num: '03' },
              { to: '/education', label: 'Education', sub: 'VIT Bhopal · B.Tech CSE AI/ML', num: '04' },
              { to: '/about', label: 'About', sub: '2× National Hackathon Finalist', num: '05' },
              { to: '/contact', label: 'Contact', sub: 'Open to roles & collaboration', num: '06' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                  background: 'var(--surface)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s',
                  gap: '0.5rem',
                }}
                className="reveal-card"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
              >
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--dim-syntax)' }}>
                  {item.num}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--data-white)',
                }}>
                  {item.label} <span style={{ color: 'var(--neural-lime)' }}>↗</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-code)' }}>
                  {item.sub}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
