import { Link, useLocation } from 'react-router-dom';

const SUGGESTIONS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
];

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="page-enter">
      <div className="page-header" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <p className="label">404</p>
          <h1 className="sec-title">Route Not Found</h1>
          <div className="terminal-panel" style={{ maxWidth: 640 }}>
            <div className="t-bar">
              <span className="td r" /><span className="td y" /><span className="td g" />
              <span className="t-bar-title">kushagra@ai-node:~</span>
            </div>
            <div className="t-body">
              <span className="tl"><span className="tp">kushagra@ai-node</span><span className="tpath">:~$</span> <span className="tcmd">cd {location.pathname}</span></span>
              <span className="tl twarn">bash: cd: {location.pathname}: No such file or directory</span>
              <span className="tl tout">Try one of these instead:</span>
            </div>
          </div>
          <div className="hero-ctas" style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn btn-primary">Go Home ↗</Link>
            {SUGGESTIONS.slice(1).map(s => (
              <Link key={s.to} to={s.to} className="btn btn-ghost">{s.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
