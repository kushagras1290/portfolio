import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import ProjectCard from '../components/ProjectCard.jsx';
import {
  PROFESSIONAL_PROJECTS, FREELANCE_PROJECTS, COLLEGE_PROJECTS, HOBBY_PROJECTS, EXPERIENCE,
} from '../data/index.js';

const TABS = [
  { id: 'professional', label: 'Professional', data: PROFESSIONAL_PROJECTS },
  { id: 'freelance', label: 'Independent / Client', data: FREELANCE_PROJECTS },
  { id: 'hobby', label: 'Hobby', data: HOBBY_PROJECTS },
  { id: 'college', label: 'College', data: COLLEGE_PROJECTS },
];

const TOTAL_PROJECTS = TABS.reduce((total, tab) => total + tab.data.length, 0);

function groupByCompany(projects) {
  const order = EXPERIENCE.map(job => job.company.split(' / ')[0]);
  const groups = new Map();
  projects.forEach(p => {
    const keys = p.companies || [p.company || 'Other'];
    keys.forEach(key => {
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    });
  });
  return [...groups.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([company, items]) => {
      const job = EXPERIENCE.find(j => j.company.startsWith(company));
      return { company, period: job?.period, role: job?.role, items };
    });
}

export default function Projects() {
  const [active, setActive] = useState('professional');
  const [query, setQuery] = useState('');
  useScrollReveal();

  const currentProjects = TABS.find(t => t.id === active)?.data ?? [];
  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return currentProjects;

    return currentProjects.filter(project => (
      [project.name, project.tagline, project.desc, ...project.stack, ...project.highlights]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    ));
  }, [currentProjects, query]);

  const showCompanyGroups = active === 'professional' && !query.trim();
  const companyGroups = useMemo(
    () => (showCompanyGroups ? groupByCompany(visibleProjects) : []),
    [showCompanyGroups, visibleProjects]
  );

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Projects</span>
          </div>
          <p className="label">Selected Projects</p>
          <h1 className="sec-title">
            Systems Built<br />From Scratch
          </h1>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--on-surface-var)', maxWidth: 620 }}>
            {TOTAL_PROJECTS} documented builds across professional, freelance, academic,
            and independent work. Open any project for its architecture and technical evidence.
          </p>
        </div>
      </div>

      <section style={{ background: 'var(--void-black)', paddingTop: '3rem' }}>
        <div className="container">
          {/* Filter tabs */}
          <div className="proj-filter-bar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`pf-btn ${active === tab.id ? 'active' : ''}`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
                <span className="pf-count">{tab.data.length}</span>
              </button>
            ))}
          </div>

          <div className="project-search-row">
            <label className="project-search">
              <span className="project-search-icon" aria-hidden="true">⌕</span>
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={`Search ${currentProjects.length} ${active} projects by technology or outcome`}
              />
            </label>
            <span className="project-result-count" aria-live="polite">
              {visibleProjects.length} result{visibleProjects.length === 1 ? '' : 's'}
            </span>
          </div>

          {showCompanyGroups ? (
            companyGroups.map(group => (
              <div className="company-group" key={group.company}>
                <div className="company-group-header reveal">
                  <h2 className="company-group-name">{group.company}</h2>
                  <div className="company-group-meta">
                    {group.role && <span>{group.role}</span>}
                    {group.period && <span>{group.period}</span>}
                  </div>
                </div>
                <div className="proj-grid">
                  {group.items.map((p, i) => <ProjectCard p={p} index={i} key={p.id} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="proj-grid">
              {visibleProjects.map((p, i) => <ProjectCard p={p} index={i} key={p.id} />)}
              {visibleProjects.length === 0 && (
                <div className="project-empty-state">
                  <span>No matching project in this category.</span>
                  <button type="button" onClick={() => setQuery('')}>Clear search</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
