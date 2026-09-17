import HumanoidStory from '../components/HumanoidStory.jsx';
import { ACCOMPLISHMENTS } from '../data/index.js';

const WHO_I_AM = 'AI Engineer and Full-Stack Developer with four years of experience spanning e-commerce, pharmacy, legal technology, and an independent freelance practice. I build production systems end to end, from architecture and evaluation through deployment and operations.';

const WHAT_I_DO = [
  'Conversational AI · WhatsApp bots, voice trainers, and LLM pipelines',
  'Business automation · workflows, webhooks, task delegation, and OCR',
  'Full-stack AI applications · React, FastAPI, Flask, Cloudflare, and Supabase',
  'Agentic systems · LangGraph, multi-agent RAG, and tool-using LLMs',
  'Optimization and geo systems · graph routing, OpenStreetMap, and MapLibre',
  'Computer vision · image pipelines, OpenCV, Seedream, and ComfyUI',
];

export default function About() {
  const slides = [
    {
      id: 'who-i-am',
      eyebrow: 'ABOUT ME',
      railTitle: 'Who I Am',
      title: 'Beyond the Code',
      summary: WHO_I_AM,
      stats: ['4 years across AI and full-stack engineering', 'Production ownership across multiple domains', 'Independent freelance practice'],
      tags: ['AI Engineering', 'Full Stack', 'Systems Thinking', 'Product Ownership'],
      tone: '#7ddbd2',
      chapter: 'Who I Am',
      footer: 'ENGINEER · BUILDER · SYSTEMS THINKER',
      details: [WHO_I_AM],
    },
    {
      id: 'what-i-do',
      eyebrow: 'ENGINEERING RANGE',
      railTitle: 'What I Do',
      title: 'Systems From Idea to Production',
      summary: 'My work spans AI behavior, application architecture, automation, infrastructure, optimization, and the operational details required to keep systems useful.',
      stats: WHAT_I_DO.slice(0, 3),
      tags: ['Conversational AI', 'Automation', 'Agentic Systems', 'Geo Systems', 'Computer Vision'],
      tone: '#9aaeff',
      chapter: 'What I Do',
      footer: `${WHAT_I_DO.length} ENGINEERING DOMAINS`,
      details: WHAT_I_DO,
    },
    ...ACCOMPLISHMENTS.map((accomplishment, index) => ({
      id: `accomplishment-${index}`,
      eyebrow: 'HIGHLIGHT & RECOGNITION',
      railTitle: accomplishment.title,
      title: accomplishment.title,
      summary: accomplishment.body,
      stats: ['Recognition', index < 2 ? 'National stage' : 'Personal milestone'],
      tags: ['Achievement', 'Learning', 'Discipline'],
      tone: ['#e8b178', '#80d7a7', '#ed9fcb', '#82c7ef'][index % 4],
      chapter: 'Recognition',
      footer: `HIGHLIGHT ${String(index + 1).padStart(2, '0')}`,
      details: [accomplishment.body],
    })),
    {
      id: 'next-step',
      eyebrow: 'NEXT STEP',
      railTitle: 'Let’s Build Something Real',
      title: 'Let’s Build Something Real',
      summary: 'Open to AI engineering roles, high-impact freelance engagements, and ambitious product collaborations.',
      stats: ['AI engineering roles', 'Freelance systems', 'Product collaborations'],
      tags: ['Available', 'Remote', 'Gurugram'],
      tone: '#7ddbd2',
      chapter: 'Next Step',
      footer: 'OPEN TO CONVERSATIONS',
      primaryAction: { to: '/contact', label: 'Get in touch' },
      secondaryAction: { to: '/projects', label: 'View projects' },
    },
  ];

  return <HumanoidStory slides={slides} railLabel="About Kushagra" pageLabel="About · Beyond the Code" />;
}
