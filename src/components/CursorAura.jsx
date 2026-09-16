import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = 'a, button, .btn, [role="button"], input, textarea, select';
const RING_LERP = 0.18;

export default function CursorAura() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pointer = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    const canRun = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canRun) return undefined;

    function onPointerMove(e) {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
    }
    function onOver(e) {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) {
        ringRef.current?.classList.add('is-hover');
      }
    }
    function onOut(e) {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) {
        ringRef.current?.classList.remove('is-hover');
      }
    }
    function tick() {
      ring.current.x += (pointer.current.x - ring.current.x) * RING_LERP;
      ring.current.y += (pointer.current.y - ring.current.y) * RING_LERP;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      rafId.current = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    rafId.current = requestAnimationFrame(tick);
    document.documentElement.classList.add('cursor-aura-on');

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.documentElement.classList.remove('cursor-aura-on');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
