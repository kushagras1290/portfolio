import { Link } from 'react-router-dom';
import HumanoidStory from '../components/HumanoidStory.jsx';
import LiveClock from '../components/LiveClock.jsx';
import { ALL_PROJECTS } from '../data/index.js';

const FEATURED_IDS = ['true-grit', 'route-optimizer', 'pharmdel-support', 'aegis-sre'];

export default function Home() {
  const featuredProjects = FEATURED_IDS
    .map((id) => ALL_PROJECTS.find((project) => project.id === id))
    .filter(Boolean);

  const slides = [
    {
      id: 'identity',
      eyebrow: 'AI ENGINEER · FULL-STACK DEVELOPER',
      railTitle: 'Kushagra Singh',
      title: 'Kushagra Singh',
      summary: 'I build production-grade AI systems across commerce, pharmacy, legal technology, routing, and reliability engineering, owning the path from architecture and evaluation to deployment and operations.',
      stats: ['Open to work', '4 years across AI and full-stack delivery', 'Based in Gurugram, India'],
      tags: ['Python', 'FastAPI', 'React', 'LLM Engineering', 'Agentic AI', 'Cloudflare'],
      tone: '#7ddbd2',
      chapter: 'Human Potential',
      footer: <>AVAILABLE · <LiveClock /></>,
      primaryAction: { to: '/projects', label: 'View projects' },
      secondaryAction: { to: '/about', label: 'About me' },
    },
    {
      id: 'full-stack',
      eyebrow: 'SELECTED ENGINEERING WORK',
      railTitle: 'Built Across the Full Stack',
      title: 'Built Across the Full Stack',
      summary: 'A focused set of systems spanning commerce, semantic retrieval, graph routing, and explainable incident investigation.',
      stats: featuredProjects.map((project) => project.name),
      tags: ['Cloudflare', 'Graph Routing', 'Semantic Retrieval', 'SRE', 'React', 'FastAPI'],
      tone: '#9aaeff',
      chapter: 'Systems Shipped',
      footer: `${featuredProjects.length} FEATURED SYSTEMS`,
      primaryAction: { to: '/projects', label: 'Explore all work' },
      detailIntro: 'Four representative systems from the complete portfolio.',
      detailContent: (
        <div className="hm-detail-highlights">
          {featuredProjects.map((project) => (
            <div key={project.id}>
              <Link to={`/projects/${project.id}`}><strong>{project.name}</strong> ↗</Link>
              <p>{project.tagline}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'experience',
      eyebrow: 'PRODUCTION OWNERSHIP',
      title: 'Experience',
      summary: 'GemPundit, Pharmdel, Draft AI, and legal-document intelligence, presented company by company with the systems delivered in each role.',
      stats: ['GemPundit', 'Pharmdel', 'Draft AI', 'Legal Firm'],
      tags: ['Conversational AI', 'Automation', 'Retrieval', 'Legal Tech'],
      tone: '#e8b178',
      chapter: 'Experience',
      footer: 'EMPLOYMENT TIMELINE',
      primaryAction: { to: '/experience', label: 'Open experience' },
      secondaryAction: { to: '/experience', label: 'View timeline' },
    },
    {
      id: 'projects',
      eyebrow: 'COMPLETE BUILD CATALOG',
      title: 'Projects',
      summary: `${ALL_PROJECTS.length} documented builds across professional, independent, client, hobby, and academic work, each with technical evidence and implementation context.`,
      stats: ['Professional systems', 'Independent and client work', 'Academic and hobby builds'],
      tags: ['AI Systems', 'Full Stack', 'Infrastructure', 'Optimization', 'Computer Vision'],
      tone: '#80d7a7',
      chapter: 'Projects',
      footer: `${ALL_PROJECTS.length} DOCUMENTED BUILDS`,
      primaryAction: { to: '/projects', label: 'Browse projects' },
      secondaryAction: { to: '/projects', label: 'Open catalog' },
    },
    {
      id: 'skills',
      eyebrow: 'TECHNICAL ARSENAL',
      title: 'Skills',
      summary: 'Languages, frameworks, AI and machine learning, infrastructure, and data-science capabilities organized by the systems they enable.',
      stats: ['Core languages', 'Frameworks and APIs', 'AI / ML / LLM', 'Platforms and infrastructure'],
      tags: ['Python', 'JavaScript', 'LangGraph', 'Cloudflare', 'PostgreSQL', 'PyTorch'],
      tone: '#ed9fcb',
      chapter: 'Skills',
      footer: 'ENGINEERING CAPABILITIES',
      primaryAction: { to: '/skills', label: 'Explore skills' },
      secondaryAction: { to: '/skills', label: 'Open skills' },
    },
    {
      id: 'education',
      eyebrow: 'ACADEMIC FOUNDATION',
      title: 'Education',
      summary: 'B.Tech in Computer Science and Engineering with an AI and ML specialization from VIT Bhopal, supported by focused technical certifications.',
      stats: ['B.Tech CSE · AI / ML', 'VIT Bhopal · 8.11 CGPA', 'Technical certifications'],
      tags: ['AI / ML', 'Computer Science', 'Deep Learning', 'Data Analysis'],
      tone: '#82c7ef',
      chapter: 'Education',
      footer: 'ACADEMIC RECORD',
      primaryAction: { to: '/education', label: 'View education' },
      secondaryAction: { to: '/education', label: 'Open record' },
    },
    {
      id: 'about',
      eyebrow: 'BEYOND THE CODE',
      title: 'About',
      summary: 'Four years across AI engineering, full-stack systems, freelance delivery, technical competitions, and production ownership in multiple business domains.',
      stats: ['2× national hackathon finalist', 'Regional Mathematics Olympiad', 'AI engineering and independent practice'],
      tags: ['Systems Thinking', 'Product Ownership', 'Communication', 'Research'],
      tone: '#d5b07e',
      chapter: 'About',
      footer: 'BACKGROUND AND RECOGNITION',
      primaryAction: { to: '/about', label: 'Read my story' },
      secondaryAction: { to: '/about', label: 'Open profile' },
    },
    {
      id: 'contact',
      eyebrow: 'OPEN TO ROLES AND COLLABORATION',
      title: 'Let’s Build Something Real',
      summary: 'I work best on ambitious problems that require deep technical execution, production responsibility, and clear product thinking.',
      stats: ['AI engineering roles', 'High-impact freelance work', 'Product collaborations'],
      tags: ['Gurugram', 'Remote', 'AI Systems', 'Full Stack'],
      tone: '#7ddbd2',
      chapter: 'Contact',
      footer: 'START A CONVERSATION',
      primaryAction: { to: '/contact', label: 'Get in touch' },
      secondaryAction: { to: '/contact', label: 'Contact me' },
    },
  ];

  return <HumanoidStory slides={slides} railLabel="Explore the Profile" pageLabel="Home · Human → Machine" />;
}
