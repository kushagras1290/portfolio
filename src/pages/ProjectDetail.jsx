import { Link, useParams } from 'react-router-dom';
import HumanoidStory from '../components/HumanoidStory.jsx';
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
  if (project.badge.includes('FREELANCE')) return 'freelance';
  if (project.badge.includes('COLLEGE')) return 'college';
  if (project.badge.includes('INDEPENDENT')) return 'independent';
  return 'professional';
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const projectIndex = ALL_PROJECTS.findIndex((project) => project.id === slug);
  const project = ALL_PROJECTS[projectIndex];

  if (!project) {
    return (
      <HumanoidStory
        railLabel="Project"
        pageLabel="Project Not Found"
        slides={[{
          id: 'not-found', eyebrow: '404', title: 'Project Not Found',
          summary: 'This project record does not exist or has moved.',
          stats: ['Return to the complete project catalog'],
          secondaryAction: { to: '/projects', label: 'Back to projects' },
        }]}
      />
    );
  }

  const previousProject = projectIndex > 0 ? ALL_PROJECTS[projectIndex - 1] : null;
  const nextProject = projectIndex < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[projectIndex + 1] : null;
  const category = getCategoryLabel(project);
  const commonPrimary = project.link
    ? { href: project.link, label: 'Visit live project' }
    : { to: '/projects', label: 'All projects' };

  const slides = [
    {
      id: 'overview',
      eyebrow: project.badge,
      railTitle: 'Overview',
      title: project.name,
      summary: project.tagline,
      stats: [category, project.status || 'Documented project', `${project.highlights.length} technical highlights`],
      tags: project.stack,
      tone: '#7ddbd2',
      chapter: 'Project Overview',
      footer: `${project.badge} · ${category.toUpperCase()}`,
      primaryAction: commonPrimary,
      secondaryAction: { to: '/projects', label: 'Back to catalog' },
      detailIntro: project.desc,
      details: [project.desc],
    },
    {
      id: 'highlights',
      eyebrow: 'TECHNICAL EVIDENCE',
      railTitle: 'Key Highlights',
      title: 'How the System Works',
      summary: project.desc,
      stats: project.highlights.slice(0, 3),
      tags: project.stack,
      tone: '#9aaeff',
      chapter: 'Technical Build',
      footer: `${project.highlights.length} DOCUMENTED DETAILS`,
      primaryAction: commonPrimary,
      secondaryAction: { to: '/projects', label: 'All projects' },
      detailIntro: `Complete technical record for ${project.name}.`,
      details: project.highlights,
    },
    {
      id: 'evidence-navigation',
      eyebrow: 'EVIDENCE & NAVIGATION',
      railTitle: 'Evidence and Next Project',
      title: project.evidence ? 'Evidence and Current Status' : 'Continue Exploring',
      summary: project.evidence || project.status || 'Move through the adjacent project records or return to the full catalog.',
      tone: '#e8b178',
      chapter: 'Continue Exploring',
      footer: `PROJECT ${String(projectIndex + 1).padStart(2, '0')} OF ${String(ALL_PROJECTS.length).padStart(2, '0')}`,
      content: (
        <>
          <div className="hm-custom-grid">
            {previousProject && (
              <Link className="hm-custom-block" to={`/projects/${previousProject.id}`}>
                <span className="hm-custom-label">Previous</span>
                <strong>{previousProject.name}</strong>
              </Link>
            )}
            {nextProject && (
              <Link className="hm-custom-block" to={`/projects/${nextProject.id}`}>
                <span className="hm-custom-label">Next</span>
                <strong>{nextProject.name}</strong>
              </Link>
            )}
          </div>
          <div className="hm-custom-actions">
            <Link to="/projects">All projects</Link>
            <button type="button" onClick={copyProjectLink}>Copy project link</button>
          </div>
        </>
      ),
      secondaryAction: { to: '/projects', label: 'Back to catalog' },
    },
  ];

  return <HumanoidStory slides={slides} railLabel={project.name} pageLabel="Project Case Study" />;
}
