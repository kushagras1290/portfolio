import { Link } from 'react-router-dom';

function getAccent(badge) {
  if (badge.startsWith('FREELANCE')) return 'var(--electric-cyan)';
  if (badge.startsWith('INDEPENDENT')) return 'var(--terminal-amber)';
  if (badge.startsWith('PROTOTYPE')) return 'var(--terminal-amber)';
  if (badge.startsWith('COLLEGE')) return 'var(--terminal-amber)';
  return 'var(--neural-lime)';
}

export default function ProjectCard({ p, index = 0 }) {
  return (
    <Link
      to={`/projects/${p.id}`}
      className={`proj-card ${p.featured ? 'feat' : ''} reveal-card`}
      style={{ '--si': index % 3, '--accent': getAccent(p.badge) }}
      data-num={p.num}
    >
      <div className="proj-top-row">
        <span className="proj-badge">{p.badge}</span>
        {p.year && <span className="proj-year-pill">{p.year}</span>}
      </div>
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
  );
}
