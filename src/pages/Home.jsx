import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { ALL_PROJECTS } from '../data/index.js';
import InteractiveTerminal from '../components/InteractiveTerminal.jsx';
import LiveClock from '../components/LiveClock.jsx';

const FEATURED_IDS = ['true-grit', 'route-optimizer', 'pharmdel-support', 'aegis-sre'];

const QUICK_LINKS = [
  { to: '/experience', label: 'Experience', sub: 'GemPundit · Pharmdel · Draft AI · Legal Firm', num: '01' },
  { to: '/projects', label: 'Projects', sub: 'systems documented in depth', num: '02' },
  { to: '/skills', label: 'Skills', sub: 'Languages, AI/ML, Infra & more', num: '03' },
  { to: '/education', label: 'Education', sub: 'VIT Bhopal · B.Tech CSE AI/ML', num: '04' },
  { to: '/about', label: 'About', sub: '2× National Hackathon Finalist', num: '05' },
  { to: '/contact', label: 'Contact', sub: 'Open to roles & collaboration', num: '06' },
];

function KineticText({ text, delay = 0 }) {
  return text.split('').map((ch, i) => (
    <span key={i} className="kinetic-letter" style={{ animationDelay: `${delay + i * 0.035}s` }}>
      {ch === ' ' ? ' ' : ch}
    </span>
  ));
}

export default function Home() {
  useScrollReveal();
  const featuredProjects = FEATURED_IDS
    .map(id => ALL_PROJECTS.find(project => project.id === id))
    .filter(Boolean);

  return (
    <div className="page-enter">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section id="hero">
        <div className="aurora" aria-hidden="true" />
        <div className="container">
          <div className="hero-inner">
            <div>
              <p className="hero-sysref">
                Status: <span style={{ color: 'var(--neural-lime)', fontWeight: 600, letterSpacing: '0.05em', textShadow: '0 0 12px rgba(76,242,216,0.45)' }}>Open to work</span>
                {' · '}
                <span style={{ color: 'var(--electric-cyan)' }}><LiveClock /></span>
              </p>
              <h1 className="hero-title">
                <span className="lime"><KineticText text="KUSHAGRA" /></span>
                <span className="lime"><KineticText text="SINGH" delay={8 * 0.035} /></span>
              </h1>
              <p className="hero-sub">
                AI Engineer &amp; Full-Stack Developer building production-grade AI systems
                across commerce, pharmacy, legal-tech, routing, and reliability engineering.
                I own the path from architecture and evaluation to deployment and operations.
              </p>
              <div className="hero-chips">
                <span className="chip">Python</span>
                <span className="chip">Flask / FastAPI</span>
                <span className="chip">React.js</span>
                <span className="chip cyan">LLM Engineering</span>
                <span className="chip cyan">Agentic AI</span>
                <span className="chip cyan">Conversational AI</span>
                <span className="chip amber">Cloudflare</span>
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
            <InteractiveTerminal />
          </div>
        </div>

      </section>

      <section className="featured-work-section">
        <div className="container">
          <div className="section-heading-row reveal">
            <div>
              <p className="label">Selected Engineering Work</p>
              <h2 className="sec-title">Built Across<br />The Full Stack</h2>
            </div>
            <p className="section-heading-copy">
              A focused set of systems spanning commerce, semantic retrieval,
              graph routing, and explainable incident investigation.
            </p>
          </div>
          <div className="featured-work-grid">
            {featuredProjects.map((project, index) => (
              <Link
                to={`/projects/${project.id}`}
                className={`featured-work-card reveal-card ${index === 0 ? 'featured-work-lead' : ''}`}
                key={project.id}
              >
                <div className="featured-work-meta">{project.badge}</div>
                <h3>{project.name}</h3>
                <p>{project.tagline}</p>
                <div className="featured-work-footer">
                  <span>{project.stack.slice(0, 3).join(' · ')}</span>
                  <span className="proj-arr">↗</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="featured-work-cta reveal">
            <Link to="/projects" className="btn btn-ghost">Explore all {ALL_PROJECTS.length} projects ↗</Link>
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
          <div className="home-link-grid">
            {QUICK_LINKS.map(item => (
              <Link key={item.to} to={item.to} className="qlink-card reveal-card">
                <div className="qlink-num">{item.num}</div>
                <div className="qlink-title">
                  {item.label} <span className="arr">↗</span>
                </div>
                <div className="qlink-sub">
                  {item.to === '/projects' ? `${ALL_PROJECTS.length} ${item.sub}` : item.sub}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
