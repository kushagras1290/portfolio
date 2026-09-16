import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテト01KUSHAGRA';
const DURATION_MS = 4200;

export default function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fontSize = 16;
    let columns = 0;
    let drops = [];

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(window.innerWidth / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -50);
    }
    resize();
    window.addEventListener('resize', resize);

    let rafId;
    function frame() {
      ctx.fillStyle = 'rgba(7,9,11,0.15)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = '#4cf2d8';
      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        drops[i] = y * fontSize > window.innerHeight && Math.random() > 0.975 ? 0 : y + 1;
      });
      rafId = requestAnimationFrame(frame);
    }
    frame();

    const timer = setTimeout(() => onDone?.(), DURATION_MS);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
    };
  }, [onDone]);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}
