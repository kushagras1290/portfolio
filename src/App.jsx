import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import CursorAura from './components/CursorAura.jsx';
import ScrollProgressBar from './components/ScrollProgressBar.jsx';
import ToastHost from './components/ToastHost.jsx';
import MatrixRain from './components/MatrixRain.jsx';
import BackToTop from './components/BackToTop.jsx';
import ShortcutsHelp from './components/ShortcutsHelp.jsx';
import { useGlobalInteractions } from './hooks/useGlobalInteractions.js';
import { useKonamiCode } from './hooks/useKonamiCode.js';
import { showToast } from './lib/toast.js';
import Home from './pages/Home.jsx';
import Experience from './pages/Experience.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Skills from './pages/Skills.jsx';
import Education from './pages/Education.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

// Code-split: these two are the only pages that need the Supabase SDK,
// so the other ~90% of visits never pay for it.
const Contact = lazy(() => import('./pages/Contact.jsx'));
const AdminMessages = lazy(() => import('./pages/AdminMessages.jsx'));

function RouteFallback() {
  return (
    <div className="container" style={{ paddingTop: 'calc(56px + 4rem)', paddingBottom: '4rem', color: 'var(--muted-code)' }}>
      Loading…
    </div>
  );
}

const NAV_SHORTCUTS = {
  h: '/', p: '/projects', e: '/experience', s: '/skills', d: '/education', a: '/about', c: '/contact',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ThemeInit() {
  useEffect(() => {
    const saved = localStorage.getItem('ks-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', saved === 'light' ? '#f4f7f6' : '#07090b');
  }, []);
  return null;
}

function KeyboardNav() {
  const navigate = useNavigate();
  useEffect(() => {
    let leaderActive = false;
    let leaderTimer = null;

    function reset() {
      leaderActive = false;
      clearTimeout(leaderTimer);
    }
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

      if (leaderActive) {
        const to = NAV_SHORTCUTS[e.key.toLowerCase()];
        reset();
        if (to) { e.preventDefault(); navigate(to); }
        return;
      }
      if (e.key.toLowerCase() === 'g') {
        leaderActive = true;
        leaderTimer = setTimeout(reset, 900);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(leaderTimer);
    };
  }, [navigate]);
  return null;
}

function EasterEgg() {
  const [showMatrix, setShowMatrix] = useState(false);

  const activate = useCallback(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      showToast('🎮 Konami code found. (Matrix rain skipped because reduced motion is on.)');
      return;
    }
    setShowMatrix(true);
    showToast('🎮 Konami code activated');
  }, []);

  useKonamiCode(activate);

  if (!showMatrix) return null;
  return <MatrixRain onDone={() => setShowMatrix(false)} />;
}

export default function App() {
  useGlobalInteractions();
  return (
    <BrowserRouter>
      <ThemeInit />
      <ScrollToTop />
      <KeyboardNav />
      <EasterEgg />
      <ShortcutsHelp />
      <div className="grain-overlay" aria-hidden="true" />
      <CursorAura />
      <ScrollProgressBar />
      <ToastHost />
      <BackToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/education" element={<Education />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/contact"
          element={<Suspense fallback={<RouteFallback />}><Contact /></Suspense>}
        />
        <Route
          path="/admin"
          element={<Suspense fallback={<RouteFallback />}><AdminMessages /></Suspense>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
