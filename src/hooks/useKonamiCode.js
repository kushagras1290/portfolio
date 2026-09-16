import { useEffect } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonamiCode(onActivate) {
  useEffect(() => {
    let progress = 0;

    function onKeyDown(e) {
      const expected = SEQUENCE[progress];
      const matches = e.key === expected || e.key.toLowerCase() === expected.toLowerCase();
      progress = matches ? progress + 1 : (e.key === SEQUENCE[0] ? 1 : 0);
      if (progress === SEQUENCE.length) {
        progress = 0;
        onActivate();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onActivate]);
}
