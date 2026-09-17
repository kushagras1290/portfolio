import HumanoidStory from '../components/HumanoidStory.jsx';
import { CERTS, EDUCATION } from '../data/index.js';

export default function Education() {
  const educationSlides = EDUCATION.map((education, index) => ({
    id: `education-${index}`,
    eyebrow: education.year,
    railTitle: education.school,
    title: education.deg,
    summary: education.school,
    stats: [education.year, education.badge, index === 0 ? 'AI / ML specialization' : 'Academic foundation'],
    tags: index === 0 ? ['Computer Science', 'AI / ML', 'Engineering'] : ['Science', 'Mathematics', 'Technology'],
    tone: ['#7ddbd2', '#9aaeff', '#e8b178'][index],
    chapter: education.school,
    footer: `${education.year} · ${education.badge}`,
    details: [`<strong>Institution:</strong> ${education.school}`, `<strong>Result:</strong> ${education.badge}`],
  }));

  const certificationSlide = {
    id: 'certifications',
    eyebrow: 'CONTINUOUS LEARNING',
    railTitle: 'Certifications',
    title: 'Technical Certifications',
    summary: 'Focused programs covering large language models, generative AI, deep learning, data analysis, machine learning, algorithms, and SQL.',
    stats: CERTS.slice(0, 3).map((certificate) => certificate.name),
    tags: CERTS.map((certificate) => certificate.provider),
    tone: '#80d7a7',
    chapter: 'Continuous Learning',
    footer: `${CERTS.length} CERTIFICATIONS`,
    details: CERTS.map((certificate) => `<strong>${certificate.name}</strong> · ${certificate.provider}`),
  };

  const currentSlide = {
    id: 'current',
    eyebrow: 'CURRENTLY',
    railTitle: 'Independent Engineering',
    title: 'Building Production AI Systems',
    summary: 'Continuing independent development across AI, automation, routing, reliability, and LLM-driven products while exploring high-impact engineering roles.',
    stats: ['Independent product development', 'Production AI systems', 'Open to engineering roles'],
    tags: ['AI Engineering', 'Automation', 'Product Development'],
    tone: '#ed9fcb',
    chapter: 'What Comes Next',
    footer: 'CURRENT FOCUS',
    primaryAction: { to: '/contact', label: 'Start a conversation' },
    secondaryAction: { to: '/contact', label: 'Contact me' },
  };

  return <HumanoidStory slides={[...educationSlides, certificationSlide, currentSlide]} railLabel="Academic Timeline" pageLabel="Education · Foundation" />;
}
