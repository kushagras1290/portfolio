import { useEffect, useState } from 'react';

const SHORTCUTS = [
  { keys: '⌘K / Ctrl K', desc: 'Open quick navigation & project search' },
  { keys: 'g then h', desc: 'Go to Home' },
  { keys: 'g then p', desc: 'Go to Projects' },
  { keys: 'g then e', desc: 'Go to Experience' },
  { keys: 'g then s', desc: 'Go to Skills' },
  { keys: 'g then d', desc: 'Go to Education' },
  { keys: 'g then a', desc: 'Go to About' },
  { keys: 'g then c', desc: 'Go to Contact' },
  { keys: '?', desc: 'Toggle this panel' },
  { keys: 'Esc', desc: 'Close any open panel' },
];

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if (isTyping) return;
      if (e.key === '?') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" onMouseDown={() => setOpen(false)}>
      <div
        className="shortcuts-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="shortcuts-header">
          <span>Keyboard Shortcuts</span>
          <span className="cmdk-esc">ESC</span>
        </div>
        <div className="shortcuts-list">
          {SHORTCUTS.map(s => (
            <div className="shortcuts-row" key={s.keys}>
              <kbd>{s.keys}</kbd>
              <span>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
