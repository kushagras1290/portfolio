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
          <div className="bio-grid">
            <div className="bio-card reveal">
              <div className="exp-sub-title">Who I Am</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--on-surface-var)' }}>
                AI Engineer &amp; Full-Stack Developer with 4 years of experience spanning
                e-commerce, pharmacy, and legal-tech, plus a 4-year independent freelance
                practice building production systems end to end. Most recently a Contract AI
                Engineer at GemPundit, building WhatsApp bots (30+ languages, GPT-5.2), voice AI sales
                trainers (OpenAI Realtime API, 18 personalities), and internal business
                automation, and currently freelancing on True Grit, a full-stack, Cloudflare-native
                e-commerce platform with five standalone ML/AI subsystems. Deep fluency across
                Python/FastAPI/Flask/React, agentic AI (LangChain/LangGraph), and cloud infra
                (Cloudflare Workers/D1/R2/KV, Render, Hostinger, Supabase). Domain range spans
                conversational AI, demand forecasting, fraud detection, route optimization,
                incident response, and legal-document intelligence.
              </p>
            </div>
            <div className="bio-card reveal">
              <div className="exp-sub-title">What I Do</div>
              <ul className="bullets">
                <li><strong>Conversational AI:</strong> WhatsApp bots, voice trainers, LLM pipelines</li>
                <li><strong>Business Automation:</strong> n8n, webhooks, task delegation, OCR pipelines</li>
                <li><strong>Full-Stack AI Apps:</strong> React/Next.js + FastAPI/Flask + Cloudflare/Supabase</li>
                <li><strong>Agentic Systems:</strong> LangGraph, multi-agent RAG, tool-using LLMs</li>
                <li><strong>Distributed Systems &amp; Observability:</strong> Temporal, OpenTelemetry, ClickHouse, Redpanda</li>
                <li><strong>Optimization &amp; Geo Systems:</strong> Contraction Hierarchies, Dijkstra, OpenStreetMap, MapLibre</li>
                <li><strong>Computer Vision:</strong> Seedream, ComfyUI, OpenCV, image classification</li>
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
