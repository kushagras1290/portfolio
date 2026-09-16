import { useParams, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { ALL_PROJECTS } from '../data/index.js';
import { showToast } from '../lib/toast.js';

async function copyProjectLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Project link copied to clipboard');
  } catch {
    showToast("Couldn't copy the link. Copy it manually from the address bar.");
  }
}

function getCategoryLabel(project) {
  if (project.category) return project.category;
  const { badge } = project;
  if (badge.includes('FREELANCE')) return 'freelance';
  if (badge.includes('COLLEGE')) return 'college';
  if (badge.includes('INDEPENDENT')) return 'independent';
  return 'professional';
}

export default function ProjectDetail() {
  const { slug } = useParams();
  useScrollReveal();

  const idx = ALL_PROJECTS.findIndex(p => p.id === slug);
  const project = ALL_PROJECTS[idx];

  if (!project) {
    return (
      <div className="page-enter" style={{ paddingTop: '120px', minHeight: '60vh' }}>
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <p style={{ color: 'var(--muted-code)', marginBottom: '1.5rem' }}>Project not found.</p>
          <Link to="/projects" className="btn btn-ghost">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  const prevProject = idx > 0 ? ALL_PROJECTS[idx - 1] : null;
  const nextProject = idx < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[idx + 1] : null;
  const category = getCategoryLabel(project);

  return (
    <div className="page-enter">
      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="proj-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/projects">Projects</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{
              textTransform: 'none',
              color: 'var(--on-surface-var)',
              letterSpacing: '0.04em',
              fontSize: '0.72rem',
            }}>
              {project.name}
            </span>
          </div>

          <div className="proj-detail-meta">
            <span className="proj-detail-badge">{project.badge}</span>
            <span className="proj-detail-num">{project.num}</span>
          </div>

          <h1 className="proj-detail-title">{project.name}</h1>
          <p className="proj-detail-tagline">{project.tagline}</p>

          <div className="proj-detail-stack">
            {project.stack.map(s => (
              <span className="chip muted" key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="proj-detail-body">
        <div className="container">
          <div className="proj-detail-grid">
            {/* Main content */}
            <div>
              <div className="proj-detail-section-label">Overview</div>
              <p className="proj-detail-overview">{project.desc}</p>

              <div className="proj-detail-section-label">Key Highlights</div>
              <ul className="proj-highlights">
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              {project.evidence && (
                <div className="project-evidence-note">
                  <div className="proj-detail-section-label">Evidence Note</div>
                  <p>{project.evidence}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="proj-detail-sidebar reveal">
              {project.link && (
                <>
                  <div className="proj-detail-sidebar-label">Live Link</div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    style={{ display: 'inline-flex', marginBottom: '2rem' }}
                  >
                    Visit Site ↗
                  </a>
                </>
              )}
              <div className="proj-detail-sidebar-label">Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2rem' }}>
                {project.stack.map(s => (
                  <span className="skill-pill" key={s}>{s}</span>
                ))}
              </div>

              <div className="proj-detail-sidebar-label">Category</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-var)', marginBottom: '2rem', textTransform: 'capitalize' }}>
                {category}
              </p>

              {project.status && (
                <>
                  <div className="proj-detail-sidebar-label">Current Status</div>
                  <p className="project-status-copy">{project.status}</p>
                </>
              )}

              <div className="proj-detail-sidebar-label">Highlights Count</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-var)', marginBottom: '2rem' }}>
                {project.highlights.length} technical details documented
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/projects" className="btn-back">← Back to Projects</Link>
                <button type="button" className="btn-back" onClick={copyProjectLink}>
                  ⧉ Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROJECT NAVIGATION ───────────────────────────── */}
      <div className="proj-nav-strip">
        {prevProject ? (
          <Link to={`/projects/${prevProject.id}`} className="proj-nav-item">
            <span className="proj-nav-dir">← Previous</span>
            <span className="proj-nav-name">{prevProject.name}</span>
          </Link>
        ) : (
          <div className="proj-nav-item" style={{ opacity: 0.3, cursor: 'default' }}>
            <span className="proj-nav-dir">← Previous</span>
            <span className="proj-nav-name">First project</span>
          </div>
        )}
        <Link to="/projects" className="proj-nav-item" style={{ textAlign: 'center', alignItems: 'center' }}>
          <span className="proj-nav-dir">All Projects</span>
          <span className="proj-nav-name">← Back to grid</span>
        </Link>
        {nextProject ? (
          <Link to={`/projects/${nextProject.id}`} className="proj-nav-item" style={{ textAlign: 'right', alignItems: 'flex-end' }}>
            <span className="proj-nav-dir">Next →</span>
            <span className="proj-nav-name">{nextProject.name}</span>
          </Link>
        ) : (
          <div className="proj-nav-item" style={{ opacity: 0.3, cursor: 'default', textAlign: 'right', alignItems: 'flex-end' }}>
            <span className="proj-nav-dir">Next →</span>
            <span className="proj-nav-name">Last project</span>
          </div>
        )}
      </div>
    </div>
  );
}
