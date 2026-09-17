import { useLocation } from 'react-router-dom';
import HumanoidStory from '../components/HumanoidStory.jsx';

export default function NotFound() {
  const location = useLocation();
  const slides = [{
    id: 'route-not-found',
    eyebrow: '404 · ROUTE NOT FOUND',
    railTitle: 'No Signal',
    title: 'This Route Does Not Exist',
    summary: `The portfolio could not resolve ${location.pathname}. Return to a known part of the system.`,
    stats: ['Home', 'Projects', 'Experience'],
    tags: ['404', 'Navigation', 'Recovery'],
    tone: '#e8b178',
    chapter: 'No Signal',
    footer: 'RECOVERY ROUTE',
    primaryAction: { to: '/', label: 'Go home' },
    secondaryAction: { to: '/projects', label: 'View projects' },
  }];
  return <HumanoidStory slides={slides} railLabel="System" pageLabel="404 · No Signal" />;
}
