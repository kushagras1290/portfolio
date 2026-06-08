import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { ACCOMPLISHMENTS } from '../data/index.js';

export default function About() {
  useScrollReveal();

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>About</span>
          </div>
          <p className="label">About Me</p>
          <h1 className="sec-title">
            Beyond<br />the Code
          </h1>
        </div>
      </div>

      {/* Bio strip */}
      <section style={{ background: 'var(--void-black)', paddingBottom: 0 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            background: 'var(--outline-variant)',
            marginBottom: '1px',
          }}>
            <div style={{ background: 'var(--surface)', padding: '2.5rem' }} className="reveal">
              <div className="exp-sub-title">Who I Am</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--on-surface-var)' }}>
                AI &amp; Automation Engineer with production experience building WhatsApp bots
                (30 languages, GPT-5.2), voice AI trainers (OpenAI Realtime API, 18 personalities),
                AI image pipelines (Seedream v4.5), CEO-level task delegation systems, and internal
                business automation. Deep fluency in Python/Flask/React/OpenAI. Deployed on Render
                with Supabase. Domain authority in Vedic gemology and LLM engineering.
              </p>
            </div>
            <div style={{ background: 'var(--surface)', padding: '2.5rem' }} className="reveal">
              <div className="exp-sub-title">What I Do</div>
              <ul className="bullets">
                <li><strong>Conversational AI</strong> — WhatsApp bots, voice trainers, LLM pipelines</li>
                <li><strong>Business Automation</strong> — n8n, webhooks, task delegation, OCR pipelines</li>
                <li><strong>Full-Stack AI Apps</strong> — React + Flask + Supabase + Render</li>
                <li><strong>Agentic Systems</strong> — LangGraph, multi-agent RAG, tool-using LLMs</li>
                <li><strong>Computer Vision</strong> — Seedream, ComfyUI, OpenCV, image classification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accomplishments */}
      <section style={{ background: 'var(--deep-charcoal)' }}>
        <div className="container">
          <p className="label reveal">Accomplishments</p>
          <h2 className="sec-title reveal">Highlights &amp;<br />Recognition</h2>
          <div className="acc-grid">
            {ACCOMPLISHMENTS.map((a, i) => (
              <div
                className={`acc-card reveal ${i % 3 === 1 ? 'reveal-d1' : i % 3 === 2 ? 'reveal-d2' : ''}`}
                key={a.title}
              >
                <span className="acc-ico" style={{ color: a.color }}>{a.ico}</span>
                <div className="acc-title">{a.title}</div>
                <p className="acc-body">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--void-black)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <p className="label reveal" style={{ justifyContent: 'center' }}>Next Step</p>
          <h2 className="sec-title reveal" style={{ textAlign: 'center' }}>
            Let's Build<br />Something Real
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-var)', lineHeight: 1.75, marginBottom: '2rem' }} className="reveal">
            Open to senior AI engineering roles, high-impact freelance engagements,
            and ambitious product collaborations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} className="reveal">
            <Link to="/contact" className="btn btn-primary">Get In Touch ↗</Link>
            <Link to="/projects" className="btn btn-ghost">View Projects</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
