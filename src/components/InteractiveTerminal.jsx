import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_PROJECTS, EXPERIENCE, SKILLS } from '../data/index.js';

const ROUTES = {
  home: '/', projects: '/projects', experience: '/experience',
  skills: '/skills', education: '/education', about: '/about', contact: '/contact',
};

const HELP_TEXT = "Commands: help · whoami · projects · skills · experience · contact · "
  + "open <page> · theme <dark|light> · date · clear";

function bootLines() {
  return [
    { type: 'cmd', text: 'kushagra@ai-node:~$ ./init_profile.sh' },
    { type: 'cmt', text: '# Loading profile…' },
    { type: 'out', text: '[INFO] Role    : AI Engineer | Full-Stack Developer' },
    { type: 'out', text: '[INFO] Status  : Open to Work · Freelancing (True Grit)' },
    { type: 'out', text: '[INFO] Stack   : Python · FastAPI · React · LangGraph' },
    { type: 'out', text: '[INFO] Location: Gurugram, India' },
    { type: 'ok', text: '[OK]   True Grit → Cloudflare-native commerce · 5 ML/AI subsystems' },
    { type: 'ok', text: '[OK]   GemPundit → WhatsApp bot · 30+ langs · GPT-5.2' },
    { type: 'ok', text: '[OK]   Pharmdel → 16,262-message retrieval corpus · 1,648 indexed pairs' },
    { type: 'ok', text: '[OK]   RouteOpt → CH routing · OSM · 27.9× documented benchmark' },
    { type: 'warn', text: `[STAT] ${EXPERIENCE.length} roles · ${ALL_PROJECTS.length} projects documented` },
    { type: 'warn', text: '[STAT] 2× National Hackathon Finalist' },
    { type: 'cmt', text: "# Type 'help' to explore this terminal." },
  ];
}

function canAnimate() {
  return window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function InteractiveTerminal() {
  const [lines, setLines] = useState(bootLines);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  function print(text, type = 'out') {
    setLines(prev => [...prev, { type, text }]);
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`kushagra@ai-node:~$ ${cmd}`, 'cmd');
    const [name, ...args] = cmd.split(/\s+/);

    switch (name.toLowerCase()) {
      case 'help':
        print(HELP_TEXT);
        break;
      case 'whoami':
        print('AI Engineer & Full-Stack Developer · Gurugram, India · Open to work');
        break;
      case 'projects':
        print(`${ALL_PROJECTS.length} projects documented. Try: open projects`);
        break;
      case 'skills':
        print(Object.values(SKILLS).map(s => s.title).join(' · '));
        break;
      case 'experience':
        EXPERIENCE.forEach(job => print(`${job.company}: ${job.role}`, 'ok'));
        break;
      case 'contact':
        print('kushagras1234890@gmail.com · +91 8081576126 · github.com/kushagras1290');
        break;
      case 'date':
        print(new Date().toString());
        break;
      case 'clear':
        setLines([]);
        return;
      case 'sudo':
        print("Permission denied: you're not root here. Here's a sandwich anyway. 🥪");
        break;
      case 'theme': {
        const value = args[0]?.toLowerCase();
        if (value === 'dark' || value === 'light') {
          document.documentElement.setAttribute('data-theme', value);
          localStorage.setItem('ks-theme', value);
          print(`theme set to ${value}`, 'ok');
        } else {
          print('usage: theme <dark|light>', 'warn');
        }
        break;
      }
      case 'open': {
        const target = args[0]?.toLowerCase();
        const to = ROUTES[target];
        if (to) {
          print(`navigating → ${to}`, 'ok');
          navigate(to);
        } else {
          print(`no such page: "${args[0] ?? ''}". try: ${Object.keys(ROUTES).join(', ')}`, 'warn');
        }
        break;
      }
      default:
        print(`command not found: ${name}. Type 'help' for a list.`, 'warn');
    }
  }

  function onInputKeyDown(e) {
    if (e.key === 'Enter') {
      runCommand(input);
      if (input.trim()) setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      if (historyIndex === -1) return;
      e.preventDefault();
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    }
  }

  function handleTiltMove(e) {
    const el = panelRef.current;
    if (!el || !canAnimate()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
  }

  function handleTiltLeave() {
    if (panelRef.current) panelRef.current.style.transform = '';
  }

  const TYPE_CLASS = { cmd: 'tcmd', cmt: 'tcmt', out: 'tout', ok: 'tok', warn: 'twarn' };

  return (
    <div
      className="terminal-panel tilt-panel"
      ref={panelRef}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="t-bar">
        <span className="td r" /><span className="td y" /><span className="td g" />
        <span className="t-bar-title">kushagra@ai-node:~</span>
      </div>
      <div className="t-body" ref={bodyRef}>
        {lines.map((line, i) => (
          <span className={`tl ${TYPE_CLASS[line.type] || 'tout'}`} key={i}>{line.text}</span>
        ))}
        <span className="tl t-input-row">
          <span className="tp">kushagra@ai-node</span><span className="tpath">:~$</span>
          <input
            ref={inputRef}
            className="t-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Interactive terminal, type help for a list of commands"
          />
        </span>
      </div>
    </div>
  );
}
