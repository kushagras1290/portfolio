import { useMemo, useState } from 'react';
import HumanoidStory from '../components/HumanoidStory.jsx';
import {
  PROFESSIONAL_PROJECTS,
  FREELANCE_PROJECTS,
  COLLEGE_PROJECTS,
  HOBBY_PROJECTS,
} from '../data/index.js';

const TABS = [
  { id: 'professional', label: 'Professional', data: PROFESSIONAL_PROJECTS, tone: '#7ddbd2' },
  { id: 'freelance', label: 'Independent / Client', data: FREELANCE_PROJECTS, tone: '#9aaeff' },
  { id: 'hobby', label: 'Hobby', data: HOBBY_PROJECTS, tone: '#80d7a7' },
  { id: 'college', label: 'College', data: COLLEGE_PROJECTS, tone: '#e8b178' },
];

const TOTAL_PROJECTS = TABS.reduce((total, tab) => total + tab.data.length, 0);

export default function Projects() {
  const [active, setActive] = useState('professional');
  const [query, setQuery] = useState('');
  const currentTab = TABS.find((tab) => tab.id === active) || TABS[0];

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return currentTab.data;
    return currentTab.data.filter((project) => (
      [project.name, project.tagline, project.desc, ...project.stack, ...project.highlights]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    ));
  }, [currentTab, query]);

  const catalogSlide = {
    id: `catalog-${active}-${query}`,
    eyebrow: 'COMPLETE BUILD CATALOG',
    railTitle: 'Project Catalog',
    title: 'Systems Built From Scratch',
    summary: `${TOTAL_PROJECTS} documented builds across professional, independent, hobby, and academic work. Select a category, then scroll through every matching system.`,
    tone: currentTab.tone,
    chapter: 'Project Catalog',
    footer: `${visibleProjects.length} ${currentTab.label.toUpperCase()} RESULT${visibleProjects.length === 1 ? '' : 'S'}`,
    secondaryAction: visibleProjects[0]
      ? { to: `/projects/${visibleProjects[0].id}`, label: 'Open first result' }
      : undefined,
    content: (
      <>
        <div className="hm-filter-controls" role="tablist" aria-label="Project category">
          {TABS.map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              className={active === tab.id ? 'active' : ''}
              onClick={() => { setActive(tab.id); setQuery(''); }}
              key={tab.id}
            >
              {tab.label} <span>{tab.data.length}</span>
            </button>
          ))}
        </div>
        <label className="hm-catalog-search">
          <span>Search this category</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Technology, system, or outcome"
          />
        </label>
      </>
    ),
  };

  const projectSlides = visibleProjects.map((project, index) => ({
    id: project.id,
    eyebrow: project.badge,
    railTitle: project.name,
    title: project.name,
    summary: project.tagline,
    stats: project.highlights.slice(0, 4),
    tags: project.stack,
    tone: [currentTab.tone, '#9aaeff', '#e8b178', '#80d7a7', '#ed9fcb'][index % 5],
    chapter: project.name,
    footer: `${currentTab.label.toUpperCase()} · PROJECT ${String(index + 1).padStart(2, '0')}`,
    primaryAction: { to: `/projects/${project.id}`, label: 'Open case study' },
    secondaryAction: { to: `/projects/${project.id}`, label: 'Full details' },
    detailIntro: project.desc,
    details: [
      ...project.highlights,
      ...(project.evidence ? [`<strong>Evidence note:</strong> ${project.evidence}`] : []),
    ],
  }));

  return (
    <HumanoidStory
      slides={[catalogSlide, ...projectSlides]}
      railLabel={`${currentTab.label} Projects`}
      pageLabel={`Projects · ${visibleProjects.length} Results`}
      emptyMessage="No matching projects in this category."
    />
  );
}
