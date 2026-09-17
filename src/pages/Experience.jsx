import { Link } from 'react-router-dom';
import HumanoidStory from '../components/HumanoidStory.jsx';
import { ALL_PROJECTS, EXPERIENCE } from '../data/index.js';

function projectsForJob(job) {
  const company = job.company.split(' / ')[0];
  return ALL_PROJECTS.filter((project) => (
    project.company === company || project.companies?.includes(company)
  ));
}

export default function Experience() {
  const slides = EXPERIENCE.map((job, index) => {
    const relatedProjects = projectsForJob(job);
    const details = job.sections.flatMap((section) => [
      `<strong>${section.title}</strong>`,
      ...section.bullets,
    ]);
    const stack = [...new Set(relatedProjects.flatMap((project) => project.stack))].slice(0, 8);

    return {
      id: job.id,
      eyebrow: job.role,
      railTitle: job.company,
      title: job.company,
      summary: `${job.period} · ${job.location}`,
      tone: ['#7ddbd2', '#9aaeff', '#e8b178', '#ed9fcb'][index % 4],
      chapter: job.company.split(' / ')[0],
      footer: `${job.period} · ${relatedProjects.length} DOCUMENTED SYSTEM${relatedProjects.length === 1 ? '' : 'S'}`,
      tags: stack,
      details,
      detailIntro: `${job.role} · ${job.period} · ${job.location}`,
      primaryAction: relatedProjects[0]
        ? { to: `/projects/${relatedProjects[0].id}`, label: 'Open first system' }
        : { to: '/projects', label: 'View projects' },
      secondaryAction: { to: '/projects', label: 'All projects' },
      stats: [
        `${job.sections.length} workstreams`,
        `${relatedProjects.length} linked project records`,
        job.location,
      ],
      detailContent: (
        <>
          <div className="hm-detail-highlights">
            {job.sections.map((section) => (
              <div key={section.title}>
                <strong>{section.title}</strong>
                <ul>
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} dangerouslySetInnerHTML={{ __html: bullet }} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {relatedProjects.length > 0 && (
            <div className="hm-detail-projects">
              <span>Project records</span>
              {relatedProjects.map((project) => (
                <Link to={`/projects/${project.id}`} key={project.id}>{project.name} ↗</Link>
              ))}
            </div>
          )}
        </>
      ),
    };
  });

  return <HumanoidStory slides={slides} railLabel="Work Experience" pageLabel="Experience · Company Timeline" />;
}
