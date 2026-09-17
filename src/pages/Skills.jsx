import { useMemo, useState } from 'react';
import HumanoidStory from '../components/HumanoidStory.jsx';
import { SKILLS } from '../data/index.js';

const CATEGORY_LABELS = {
  lang: 'Languages',
  fw: 'Frameworks & APIs',
  ai: 'AI / ML / LLM',
  infra: 'Platforms & Infrastructure',
  ds: 'Data Science',
};

export default function Skills() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = useMemo(() => (
    Object.entries(SKILLS).flatMap(([key, category]) => (
      category.groups.flatMap((group) => group.pills
        .filter((pill) => !normalizedQuery || pill.toLowerCase().includes(normalizedQuery))
        .map((pill) => ({ pill, category: CATEGORY_LABELS[key] })))
    ))
  ), [normalizedQuery]);

  const introSlide = {
    id: 'skills-index',
    eyebrow: 'TECHNICAL ARSENAL',
    railTitle: 'What I Build With',
    title: 'What I Build With',
    summary: 'Capabilities are grouped by the systems they enable. Search the complete skill set or scroll through each engineering layer.',
    tone: '#7ddbd2',
    chapter: 'Technical Arsenal',
    footer: `${searchResults.length} ${normalizedQuery ? 'MATCHING' : 'DOCUMENTED'} SKILLS`,
    details: searchResults.map((result) => `<strong>${result.pill}</strong> · ${result.category}`),
    content: (
      <>
        <label className="hm-catalog-search">
          <span>Search every category</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Framework, platform, or capability"
          />
        </label>
        {normalizedQuery && (
          <div className="hm-search-results">
            {searchResults.slice(0, 6).map((result) => (
              <span key={`${result.category}-${result.pill}`}>{result.pill}</span>
            ))}
          </div>
        )}
      </>
    ),
  };

  const categorySlides = Object.entries(SKILLS).map(([key, category], index) => {
    const pills = category.groups.flatMap((group) => group.pills);
    return {
      id: key,
      eyebrow: CATEGORY_LABELS[key],
      railTitle: category.title,
      title: category.title,
      summary: `${pills.length} documented tools and capabilities in this engineering layer.`,
      stats: category.groups.map((group) => `${group.pills.length} capabilities · ${group.color}`),
      tags: pills,
      tone: ['#9aaeff', '#e8b178', '#80d7a7', '#ed9fcb', '#82c7ef'][index],
      chapter: CATEGORY_LABELS[key],
      footer: `${pills.length} SKILLS · ${CATEGORY_LABELS[key].toUpperCase()}`,
      details: pills,
      detailIntro: `Complete ${CATEGORY_LABELS[key].toLowerCase()} capability list.`,
    };
  });

  return <HumanoidStory slides={[introSlide, ...categorySlides]} railLabel="Skill Layers" pageLabel="Skills · Technical Stack" />;
}
