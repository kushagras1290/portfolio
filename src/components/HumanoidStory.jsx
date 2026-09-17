import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../styles/human-machine.css';

const ROUTES = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/education', label: 'Education' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const DEFAULT_TONES = ['#7ddbd2', '#9aaeff', '#e8b178', '#80d7a7', '#ed9fcb'];

const CAROUSEL_FRAMES = {
  farPrevious: { x: -2.5, y: 146, z: -460, rotateY: 3, rotateX: -22, rotateZ: -3, scale: .72, opacity: .06 },
  previous: { x: -1.2, y: 72, z: -190, rotateY: 2, rotateX: -9, rotateZ: -1.5, scale: .92, opacity: .36 },
  active: { x: 0, y: 0, z: 190, rotateY: -2.5, rotateX: 1, rotateZ: 0, scale: 1, opacity: 1 },
  next: { x: 1.2, y: -74, z: -230, rotateY: -3, rotateX: 10, rotateZ: 1.5, scale: .9, opacity: .38 },
  farNext: { x: 2.5, y: -148, z: -480, rotateY: -4, rotateX: 22, rotateZ: 3, scale: .72, opacity: .06 },
};

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const lerp = (start, end, amount) => start + (end - start) * amount;

function interpolateCarouselFrame(from, to, amount) {
  return Object.fromEntries(
    Object.keys(from).map((key) => [key, lerp(from[key], to[key], amount)]),
  );
}

function getCarouselFrame(distance) {
  if (distance <= -2) {
    const fade = clamp((-distance - 2) / 1.2, 0, 1);
    return {
      ...CAROUSEL_FRAMES.farPrevious,
      y: CAROUSEL_FRAMES.farPrevious.y + fade * 32,
      opacity: lerp(CAROUSEL_FRAMES.farPrevious.opacity, 0, fade),
    };
  }
  if (distance < -1) {
    return interpolateCarouselFrame(CAROUSEL_FRAMES.farPrevious, CAROUSEL_FRAMES.previous, distance + 2);
  }
  if (distance < 0) {
    return interpolateCarouselFrame(CAROUSEL_FRAMES.previous, CAROUSEL_FRAMES.active, distance + 1);
  }
  if (distance < 1) {
    return interpolateCarouselFrame(CAROUSEL_FRAMES.active, CAROUSEL_FRAMES.next, distance);
  }
  if (distance < 2) {
    return interpolateCarouselFrame(CAROUSEL_FRAMES.next, CAROUSEL_FRAMES.farNext, distance - 1);
  }
  const fade = clamp((distance - 2) / 1.2, 0, 1);
  return {
    ...CAROUSEL_FRAMES.farNext,
    y: CAROUSEL_FRAMES.farNext.y - fade * 32,
    opacity: lerp(CAROUSEL_FRAMES.farNext.opacity, 0, fade),
  };
}

const HUMANOID_PERSONAS = {
  home: {
    id: 'home',
    label: 'Ascendant',
    nodeOffset: 0,
    transform: true,
    ambientOne: 'rgba(178, 116, 76, .11)',
    ambientTwo: 'rgba(59, 38, 83, .18)',
  },
  experience: {
    id: 'experience',
    label: 'The Veteran',
    nodeOffset: 2,
    image: '/humanoids/experience.webp',
    machineImage: '/humanoids/experience-machine.webp',
    ambientOne: 'rgba(185, 119, 54, .16)',
    ambientTwo: 'rgba(31, 61, 72, .17)',
  },
  projects: {
    id: 'projects',
    label: 'The Builder',
    nodeOffset: 4,
    image: '/humanoids/projects.webp',
    machineImage: '/humanoids/projects-machine.webp',
    ambientOne: 'rgba(68, 145, 166, .14)',
    ambientTwo: 'rgba(45, 49, 70, .2)',
  },
  skills: {
    id: 'skills',
    label: 'The Neural Stack',
    nodeOffset: 6,
    image: '/humanoids/skills.webp',
    machineImage: '/humanoids/skills-machine.webp',
    ambientOne: 'rgba(94, 71, 164, .16)',
    ambientTwo: 'rgba(32, 126, 122, .13)',
  },
  education: {
    id: 'education',
    label: 'The Scholar',
    nodeOffset: 8,
    image: '/humanoids/education.webp',
    machineImage: '/humanoids/education-machine.webp',
    ambientOne: 'rgba(181, 118, 50, .16)',
    ambientTwo: 'rgba(70, 52, 37, .2)',
  },
  about: {
    id: 'about',
    label: 'The Human Core',
    nodeOffset: 10,
    image: '/humanoids/about.webp',
    machineImage: '/humanoids/about-machine.webp',
    ambientOne: 'rgba(194, 112, 65, .17)',
    ambientTwo: 'rgba(32, 111, 91, .13)',
  },
  contact: {
    id: 'contact',
    label: 'The Signal',
    nodeOffset: 12,
    image: '/humanoids/contact.webp',
    machineImage: '/humanoids/contact-machine.webp',
    ambientOne: 'rgba(186, 105, 64, .15)',
    ambientTwo: 'rgba(65, 79, 98, .18)',
  },
};

function hexToRgb(hex) {
  const normalized = String(hex || '#7ddbd2').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return [125, 219, 210];
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function getHumanoidPersona(pathname) {
  if (pathname === '/') return HUMANOID_PERSONAS.home;
  const route = pathname.split('/').filter(Boolean)[0];
  return HUMANOID_PERSONAS[route] || HUMANOID_PERSONAS.home;
}

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const particles = Array.from({ length: window.innerWidth < 700 ? 48 : 96 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      radius: 0.4 + Math.random() * 1.45,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00016,
      color: Math.random() < 0.45 ? '125, 219, 210' : Math.random() < 0.5 ? '232, 177, 120' : '154, 174, 255',
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.floor(window.innerWidth * dpr);
      height = Math.floor(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        if (!reduceMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -0.05) particle.x = 1.05;
          if (particle.x > 1.05) particle.x = -0.05;
          if (particle.y < -0.05) particle.y = 1.05;
          if (particle.y > 1.05) particle.y = -0.05;
        }
        context.beginPath();
        context.fillStyle = `rgba(${particle.color}, ${0.12 + particle.z * 0.32})`;
        context.arc(
          particle.x * width,
          particle.y * height,
          particle.radius * dpr * (0.55 + particle.z * 0.75),
          0,
          Math.PI * 2,
        );
        context.fill();
      });
      if (!reduceMotion) frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

function SystemVisual({ tone }) {
  return (
    <div className="hm-system-visual" style={{ color: tone }} aria-hidden="true">
      <div className="hm-visual-grid" />
      <div className="hm-traces"><span /><span /><span /></div>
      <div className="hm-nodes"><i /><i /><i /><i /><i /></div>
    </div>
  );
}

function NeuralChipVisual({
  tone,
  className = 'hm-chip-neural-visual',
  center = [.735, .48],
  radiusScale = .36,
  paused = false,
}) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const startRef = useRef(() => {});
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [red, green, blue] = hexToRgb(tone);
    const nodes = Array.from({ length: 124 }, (_, index) => {
      const y = 1 - (index / 123) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = index * 2.399963229728653;
      return { x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
    });
    const edges = [];
    nodes.forEach((node, first) => {
      const nearest = [];
      nodes.forEach((candidate, second) => {
        if (first === second) return;
        const distance = (node.x - candidate.x) ** 2 + (node.y - candidate.y) ** 2 + (node.z - candidate.z) ** 2;
        if (distance < .31) nearest.push({ second, distance });
      });
      nearest.sort((a, b) => a.distance - b.distance);
      nearest.slice(0, 3).forEach(({ second }) => {
        if (second > first) edges.push([first, second]);
      });
    });

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId;
    let visible = !document.hidden;
    let hasRendered = false;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time = 0) => {
      hasRendered = true;
      context.clearRect(0, 0, width, height);
      const centerX = width * center[0];
      const centerY = height * center[1];
      const radius = Math.min(width * radiusScale, height * .5);
      const rotation = time * .00025;
      const tilt = .2 + Math.sin(time * .00018) * .055;
      const cosY = Math.cos(rotation);
      const sinY = Math.sin(rotation);
      const cosX = Math.cos(tilt);
      const sinX = Math.sin(tilt);
      const projected = nodes.map((node) => {
        const x = node.x * cosY + node.z * sinY;
        const z = node.z * cosY - node.x * sinY;
        const y = node.y * cosX - z * sinX;
        const depth = node.y * sinX + z * cosX;
        const perspective = 1 + depth * .12;
        return {
          x: centerX + x * radius * .77 * perspective,
          y: centerY + y * radius * .77 * perspective,
          light: (depth + 1) * .5,
        };
      });

      context.save();
      context.translate(centerX, centerY);
      for (let ring = 0; ring < 3; ring += 1) {
        context.save();
        context.rotate(-.32 + ring * .34);
        context.beginPath();
        context.ellipse(0, 0, radius * (1.01 + ring * .07), radius * (.34 + ring * .11), 0, rotation * (.35 + ring * .1), rotation * (.35 + ring * .1) + .4);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${.24 - ring * .045})`;
        context.lineWidth = 1;
        context.shadowBlur = 9;
        context.shadowColor = `rgba(${red}, ${green}, ${blue}, .55)`;
        context.stroke();
        context.restore();
      }
      context.restore();

      edges.forEach(([first, second]) => {
        const start = projected[first];
        const end = projected[second];
        const light = Math.max(.12, (start.light + end.light) * .5);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${.14 * light})`;
        context.lineWidth = .6 + light * .35;
        context.stroke();
      });

      projected.forEach((point, index) => {
        const size = .65 + point.light * 1.45;
        context.beginPath();
        context.arc(point.x, point.y, size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${Math.min(255, red + 50)}, ${Math.min(255, green + 40)}, ${Math.min(255, blue + 40)}, ${.2 + point.light * .53})`;
        if (index % 17 === 0) {
          context.shadowBlur = 12;
          context.shadowColor = `rgba(${red}, ${green}, ${blue}, .8)`;
        }
        context.fill();
        context.shadowBlur = 0;
      });

      for (let packet = 0; packet < 19; packet += 1) {
        const [first, second] = edges[(packet * 31 + 11) % edges.length];
        const start = projected[first];
        const end = projected[second];
        const progress = (time * (.00022 + (packet % 4) * .00007) + packet * .137) % 1;
        context.beginPath();
        context.arc(start.x + (end.x - start.x) * progress, start.y + (end.y - start.y) * progress, 1.65, 0, Math.PI * 2);
        context.fillStyle = 'rgba(225,255,249,.72)';
        context.shadowBlur = 10;
        context.shadowColor = `rgba(${red}, ${green}, ${blue}, .9)`;
        context.fill();
      }
      context.shadowBlur = 0;

      if (!reducedMotion && !pausedRef.current && visible) frameId = window.requestAnimationFrame(render);
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      if (!visible) return;
      if (reducedMotion || pausedRef.current) {
        if (!hasRendered) render(0);
        return;
      }
      frameId = window.requestAnimationFrame(render);
    };
    startRef.current = start;
    const onVisibilityChange = () => {
      visible = !document.hidden;
      start();
    };
    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion || pausedRef.current) render(0);
    });
    observer.observe(canvas);
    resize();
    start();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.cancelAnimationFrame(frameId);
      startRef.current = () => {};
    };
  }, [center[0], center[1], radiusScale, tone]);

  useEffect(() => {
    startRef.current();
  }, [paused]);

  return <canvas className={className} ref={canvasRef} aria-hidden="true" />;
}

function ActionLink({ action, className }) {
  if (!action) return null;
  const content = <>{action.label} <span aria-hidden="true">↗</span></>;
  if (action.href) {
    return <a className={className} href={action.href} target="_blank" rel="noopener noreferrer">{content}</a>;
  }
  return <Link className={className} to={action.to}>{content}</Link>;
}

function Scene({ persona }) {
  const figureStyle = persona.image
    ? {
        '--hm-portrait-image': `url("${persona.image}")`,
        '--hm-machine-portrait': `url("${persona.machineImage}")`,
      }
    : undefined;

  return (
    <div className="hm-scene" aria-hidden="true">
      <div className="hm-stars" />
      <div className="hm-grid" />
      <div className="hm-beam" />
      <div className="hm-rings"><div /><div /></div>
      <div className={`hm-figure hm-figure-${persona.id}`} style={figureStyle}>
        {persona.transform ? (
          <>
            <div className="hm-figure-layer hm-figure-halo" />
            <div className="hm-figure-layer hm-figure-human" />
            <div className="hm-figure-layer hm-figure-transition" />
            <div className="hm-figure-layer hm-figure-machine" />
          </>
        ) : (
          <>
            <div className="hm-figure-layer hm-figure-portrait-depth" />
            <div className="hm-figure-layer hm-figure-portrait" />
            <div className="hm-figure-layer hm-figure-evolved" />
            <div className="hm-figure-layer hm-figure-resonance" />
            <div className="hm-figure-layer hm-figure-scan" />
            <div className="hm-figure-core" />
          </>
        )}
        {Array.from({ length: 6 }, (_, index) => (
          <div className={`hm-skin-shard hm-shard-${index + 1}`} key={index} />
        ))}
      </div>
      <div className="hm-particles"><ParticleField /></div>
    </div>
  );
}

/* EFFECT: scroll-unfolding neural graph with live signal packets */
function NeuralLinkField({ nodeRefs, activeIndex, nodeCount, tone, motionActive }) {
  const canvasRef = useRef(null);
  const previousIndexRef = useRef(activeIndex);
  const fieldRef = useRef([]);

  useEffect(() => {
    if (motionActive) return undefined;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [red, green, blue] = hexToRgb(tone);
    const originIndex = previousIndexRef.current;
    previousIndexRef.current = activeIndex;
    const transitionStartedAt = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let settleTimer;

    if (fieldRef.current.length === 0) {
      const fract = (value) => value - Math.floor(value);
      fieldRef.current = Array.from({ length: 86 }, (_, index) => ({
        x: .04 + fract(Math.sin((index + 1) * 12.9898) * 43758.5453) * .92,
        y: .06 + fract(Math.sin((index + 1) * 78.233) * 12515.873) * .88,
        z: .25 + fract(Math.sin((index + 1) * 39.425) * 9382.112) * .75,
        phase: fract(Math.sin((index + 1) * 5.398) * 29113.17) * Math.PI * 2,
      }));
    }

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getPoints = () => {
      const canvasRect = canvas.getBoundingClientRect();
      return Array.from({ length: nodeCount }, (_, index) => {
        const node = nodeRefs.current[index];
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return {
          x: rect.left - canvasRect.left + rect.width / 2,
          y: rect.top - canvasRect.top + rect.height / 2,
        };
      });
    };

    const curveFor = (start, end, index) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const bend = Math.min(82, length * .18) * (index % 2 === 0 ? 1 : -1);
      return {
        x: (start.x + end.x) / 2 - (dy / length) * bend,
        y: (start.y + end.y) / 2 + (dx / length) * bend,
      };
    };

    const pointOnCurve = (start, control, end, progress) => {
      const inverse = 1 - progress;
      return {
        x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
        y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
      };
    };

    const strokeConnection = (start, end, index, alpha, lineWidth = 1) => {
      const control = curveFor(start, end, index);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.quadraticCurveTo(control.x, control.y, end.x, end.y);
      context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      context.lineWidth = lineWidth;
      context.shadowBlur = alpha > .3 ? 10 : 0;
      context.shadowColor = `rgba(${red}, ${green}, ${blue}, ${Math.min(.55, alpha)})`;
      context.stroke();
      context.shadowBlur = 0;
      return control;
    };

    const drawPacket = (start, control, end, progress, alpha) => {
      const point = pointOnCurve(start, control, end, progress);
      context.beginPath();
      context.arc(point.x, point.y, 2.1, 0, Math.PI * 2);
      context.fillStyle = `rgba(${Math.min(255, red + 65)}, ${Math.min(255, green + 45)}, ${Math.min(255, blue + 45)}, ${alpha})`;
      context.shadowBlur = 13;
      context.shadowColor = `rgba(${red}, ${green}, ${blue}, .8)`;
      context.fill();
      context.shadowBlur = 0;
    };

    const drawLivingField = (time) => {
      const particles = fieldRef.current.map((particle) => ({
        ...particle,
        px: particle.x * width + Math.sin(time * .00013 + particle.phase) * (4 + particle.z * 12),
        py: particle.y * height + Math.cos(time * .0001 + particle.phase * 1.7) * (3 + particle.z * 9),
      }));
      const connectionRadius = Math.min(155, Math.max(92, width * .105));

      for (let first = 0; first < particles.length; first += 1) {
        const start = particles[first];
        for (let second = first + 1; second < particles.length; second += 1) {
          const end = particles[second];
          const distance = Math.hypot(end.px - start.px, end.py - start.py);
          if (distance > connectionRadius) continue;
          const strength = 1 - distance / connectionRadius;
          context.beginPath();
          context.moveTo(start.px, start.py);
          const curl = Math.sin((first + second) * 1.91 + time * .00018) * distance * .08;
          context.quadraticCurveTo(
            (start.px + end.px) / 2 + curl,
            (start.py + end.py) / 2 - curl,
            end.px,
            end.py,
          );
          context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${strength * .055})`;
          context.lineWidth = .45 + strength * .35;
          context.stroke();
        }

        context.beginPath();
        context.arc(start.px, start.py, .45 + start.z * .85, 0, Math.PI * 2);
        context.fillStyle = `rgba(${Math.min(255, red + 35)}, ${Math.min(255, green + 28)}, ${Math.min(255, blue + 28)}, ${.08 + start.z * .2})`;
        context.fill();
      }
    };

    const drawNeuralTransfer = (points, time) => {
      if (reducedMotion || originIndex === activeIndex) return;
      const start = points[originIndex];
      const end = points[activeIndex];
      if (!start || !end) return;
      const progress = Math.min(1, Math.max(0, (time - transitionStartedAt) / 1350));
      if (progress >= 1) return;
      const control = curveFor(start, end, activeIndex + originIndex + 23);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const normalX = -dy / length;
      const normalY = dx / length;

      for (let index = 0; index < 64; index += 1) {
        const stagger = index / 64 * .34;
        const local = Math.min(1, Math.max(0, progress * 1.34 - stagger));
        if (local <= 0 || local >= 1) continue;
        const eased = 1 - (1 - local) ** 3;
        const point = pointOnCurve(start, control, end, eased);
        const turbulence = Math.sin(index * 2.17 + time * .005) * Math.sin(Math.PI * eased) * (5 + (index % 9) * 1.5);
        const x = point.x + normalX * turbulence;
        const y = point.y + normalY * turbulence;
        const alpha = Math.sin(Math.PI * local) * (.35 + (index % 5) * .1);
        context.beginPath();
        context.arc(x, y, .7 + (index % 4) * .45, 0, Math.PI * 2);
        context.fillStyle = `rgba(${Math.min(255, red + 70)}, ${Math.min(255, green + 55)}, ${Math.min(255, blue + 55)}, ${alpha})`;
        context.shadowBlur = 9;
        context.shadowColor = `rgba(${red}, ${green}, ${blue}, .72)`;
        context.fill();
      }
      context.shadowBlur = 0;

      const arrival = Math.max(0, (progress - .58) / .42);
      if (arrival > 0) {
        context.beginPath();
        context.arc(end.x, end.y, 18 + arrival * 72, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${(1 - arrival) * .5})`;
        context.lineWidth = 1.2;
        context.stroke();
      }
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const points = getPoints();
      drawLivingField(time);

      for (let targetIndex = 1; targetIndex < points.length; targetIndex += 1) {
        const start = points[targetIndex - 1];
        const end = points[targetIndex];
        if (!start || !end) continue;
        const resolved = targetIndex <= activeIndex;
        const imminent = targetIndex === activeIndex + 1;
        const control = strokeConnection(
          start,
          end,
          targetIndex,
          resolved ? .42 : imminent ? .2 : .065,
          resolved ? 1.15 : .7,
        );
        if (resolved && !reducedMotion) {
          const packetProgress = (time * .00016 + targetIndex * .173) % 1;
          drawPacket(start, control, end, packetProgress, .82);
        }
      }

      for (let targetIndex = 3; targetIndex < points.length; targetIndex += 2) {
        const start = points[targetIndex - 3];
        const end = points[targetIndex];
        if (!start || !end) continue;
        strokeConnection(
          start,
          end,
          targetIndex + 11,
          targetIndex <= activeIndex ? .15 : .035,
          .65,
        );
      }

      const activePoint = points[activeIndex];
      if (activePoint) {
        const pulse = reducedMotion ? 0 : Math.sin(time * .0024) * 2.5;
        context.beginPath();
        context.arc(activePoint.x, activePoint.y, 27 + pulse, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, .24)`;
        context.lineWidth = 1;
        context.stroke();
        context.beginPath();
        context.arc(activePoint.x, activePoint.y, 7, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, .62)`;
        context.shadowBlur = 20;
        context.shadowColor = `rgb(${red}, ${green}, ${blue})`;
        context.fill();
        context.shadowBlur = 0;
      }

      drawNeuralTransfer(points, time);
    };

    const observer = new ResizeObserver(() => {
      resize();
      render(0);
    });
    observer.observe(canvas);
    resize();
    render(0);
    settleTimer = window.setTimeout(() => render(performance.now()), 1140);

    return () => {
      observer.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, [activeIndex, motionActive, nodeCount, nodeRefs, tone]);

  return <canvas className="hm-neural-links" ref={canvasRef} aria-hidden="true" />;
}

function CinematicBanner({ persona, pageLabel, slide, routeLabel, onEnter, isActive }) {
  const title = persona.id === 'home' ? 'Kushagra Singh' : routeLabel;
  const tags = (slide.tags || []).slice(0, 5);
  const worldNumber = Math.max(1, ROUTES.findIndex((route) => route.label === routeLabel) + 1);
  const introHuman = persona.image || '/human-machine/human.webp';
  const introMachine = persona.machineImage || '/human-machine/machine.webp';

  return (
    <section
      className={`hm-intro-banner ${isActive ? 'is-active' : 'is-departed'}`}
      data-world={persona.id}
      style={{
        '--hm-intro-human': `url("${introHuman}")`,
        '--hm-intro-machine': `url("${introMachine}")`,
      }}
      aria-label={`${title} introduction`}
    >
      <div className="hm-banner-frame" aria-hidden="true">
        <span className="hm-banner-corner hm-banner-corner-a" />
        <span className="hm-banner-corner hm-banner-corner-b" />
        <span className="hm-banner-corner hm-banner-corner-c" />
        <span className="hm-banner-corner hm-banner-corner-d" />
        <i /><i /><i />
      </div>
      <div className="hm-banner-environment" aria-hidden="true">
        <span className="hm-banner-horizon" />
        <span className="hm-banner-lightpool" />
        <div className="hm-banner-portal">
          <span className="hm-portal-bracket hm-portal-bracket-a" />
          <span className="hm-portal-bracket hm-portal-bracket-b" />
          <div className="hm-portal-portrait hm-portal-human" />
          <div className="hm-portal-portrait hm-portal-machine" />
          <div className="hm-portal-scan" />
          <span className="hm-portal-index">0{worldNumber}</span>
          <span className="hm-portal-label">{persona.label}</span>
        </div>
        <span className="hm-banner-world-ghost">0{worldNumber}</span>
      </div>
      <div className="hm-banner-copy">
        <div className="hm-banner-status">
          <span><i aria-hidden="true" /> World online</span>
          <span>Identity 0{worldNumber} / 07</span>
        </div>
        <p className="hm-banner-kicker">{pageLabel} · {persona.label}</p>
        <h1 data-title={title}>{title}</h1>
        <p className="hm-banner-summary">{slide.summary}</p>
        {tags.length > 0 && (
          <div className="hm-banner-tags" aria-label="Featured technologies">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
        <button type="button" className="hm-banner-enter" onClick={onEnter} tabIndex={isActive ? 0 : -1}>
          Enter {persona.id === 'home' ? 'my world' : routeLabel} <span aria-hidden="true">↓</span>
        </button>
      </div>
      <div className="hm-banner-depth" aria-hidden="true">
        <span>Human threshold</span>
        <i />
        <span>Enter the system</span>
      </div>
      <p className="hm-banner-scroll" aria-hidden="true"><span /> Scroll through the portal</p>
    </section>
  );
}

function NeuralTileContent({
  slide,
  activeIndex,
  total,
  pageLabel,
  interactionLabel,
}) {
  return (
    <>
      <div className="hm-card-topline">
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <span className="hm-active-signal"><i aria-hidden="true" /> Active neuron</span>
        <span>{slide.eyebrow}</span>
      </div>
      <h2>{slide.title}</h2>
      {slide.summary && <p className="hm-project-summary">{slide.summary}</p>}

      <div className="hm-chip-teaser">
        <div className="hm-chip-signals">
          {(slide.stats || []).slice(0, 2).map((stat, index) => <span key={`${index}-${stat}`}>{stat}</span>)}
          {(slide.stats || []).length === 0 && <span>Interactive node · Full signal available</span>}
        </div>
        <div className="hm-tags">
          {(slide.tags || []).slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>

      <div className="hm-card-footer">
        <span>{slide.footer || pageLabel}</span>
        <span className="hm-chip-inspect">{interactionLabel} <span aria-hidden="true">↗</span></span>
      </div>
    </>
  );
}

function NeuralCarouselTile({
  slide,
  index,
  total,
  position,
  pageLabel,
  onOpenDetails,
  onSelect,
  nodeRef,
  motionActive,
}) {
  const isActive = position === 'active';
  const isNeighbor = position === 'previous' || position === 'next';
  const isInteractive = isActive || isNeighbor;
  const canShowDetails = Boolean(slide.details?.length || slide.detailContent || slide.content);
  const compactTitle = slide.compactTitle || slide.title.length > 34;
  const interactionLabel = canShowDetails ? 'Open signal' : slide.primaryAction?.label || slide.secondaryAction?.label || 'Inspect node';

  const activate = (event) => {
    if (isActive) onOpenDetails(event);
    else if (isNeighbor) onSelect(index);
  };

  return (
    <article
      className={`hm-project-card hm-neural-primary hm-neural-carousel-chip ${compactTitle ? 'hm-title-compact' : ''}`}
      data-position={position}
      ref={(node) => {
        if (node) node.style.setProperty('--hm-accent', slide.tone);
        nodeRef(node);
      }}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : -1}
      onClick={activate}
      onKeyDown={(event) => {
        if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          activate(event);
        }
      }}
      aria-live={isActive ? 'polite' : undefined}
      aria-hidden={!isActive && !isNeighbor ? 'true' : undefined}
      aria-label={isActive ? `Inspect ${slide.title}` : isNeighbor ? `${position === 'previous' ? 'Return to' : 'Continue to'} ${slide.title}` : undefined}
    >
      <NeuralChipVisual tone={slide.tone} paused={!isActive || motionActive} />
      <span className="hm-chip-scanlines" aria-hidden="true" />
      <span className="hm-chip-hud" aria-hidden="true">Neural atlas / {String(index + 1).padStart(2, '0')} <i>● {isActive ? 'Live signal' : `${position} signal`}</i></span>
      {isActive && (
        <>
          <span className="hm-primary-port hm-primary-port-in" aria-hidden="true" />
          <span className="hm-primary-port hm-primary-port-out" aria-hidden="true" />
          <span className="hm-neural-wave" key={`wave-${slide.id}`} aria-hidden="true" />
        </>
      )}
      <div className="hm-neural-panel">
        <NeuralTileContent
          slide={slide}
          activeIndex={index}
          total={total}
          pageLabel={pageLabel}
          interactionLabel={interactionLabel}
        />
      </div>
    </article>
  );
}

function NeuralConstellation({
  slides,
  activeIndex,
  onSelect,
  nodeRefs,
  pageLabel,
  onOpenDetails,
  motionActive,
}) {
  return (
    <section className="hm-neural-stage" aria-label="Neural story map">
      <NeuralLinkField
        nodeRefs={nodeRefs}
        activeIndex={activeIndex}
        nodeCount={slides.length}
        tone={slides[activeIndex]?.tone}
        motionActive={motionActive}
      />
      <div className="hm-neural-orbit hm-neural-orbit-a" aria-hidden="true" />
      <div className="hm-neural-orbit hm-neural-orbit-b" aria-hidden="true" />
      <div className="hm-neural-nodes">
        {slides.map((slide, index) => {
          const position = index === activeIndex
            ? 'active'
            : index === activeIndex - 1
              ? 'previous'
              : index === activeIndex + 1
                ? 'next'
                : index < activeIndex
                  ? 'far-previous'
                  : 'far-next';

          return (
            <NeuralCarouselTile
              slide={slide}
              index={index}
              total={slides.length}
              position={position}
              pageLabel={pageLabel}
              onOpenDetails={onOpenDetails}
              onSelect={onSelect}
              key={slide.id}
              nodeRef={(node) => { nodeRefs.current[index] = node; }}
              motionActive={motionActive}
            />
          );
        })}
      </div>
      <div className="hm-neural-readout" aria-hidden="true">
        <span>Neural topology</span>
        <strong>{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</strong>
        <i><b style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }} /></i>
      </div>
    </section>
  );
}

export default function HumanoidStory({
  slides,
  railLabel = 'Story Index',
  pageLabel = 'Human → Machine',
  emptyMessage = 'No entries are available in this view.',
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const persona = getHumanoidPersona(pathname);
  const normalizedSlides = useMemo(() => slides.map((slide, index) => ({
    ...slide,
    tone: slide.tone || DEFAULT_TONES[index % DEFAULT_TONES.length],
  })), [slides]);
  const slideKey = normalizedSlides.map((slide) => slide.id).join('|');
  const [activeIndex, setActiveIndex] = useState(0);
  const [depthPhase, setDepthPhase] = useState('banner');
  const [detailOpen, setDetailOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionActive, setMotionActive] = useState(false);
  const experienceRef = useRef(null);
  const stepRefs = useRef([]);
  const neuralNodeRefs = useRef([]);
  const closeButtonRef = useRef(null);
  const returnFocusRef = useRef(null);
  const activeIndexRef = useRef(0);
  const stepCentersRef = useRef([]);
  const carouselTargetRef = useRef(0);
  const carouselCurrentRef = useRef(0);
  const carouselFrameRef = useRef(null);
  const carouselLastTimeRef = useRef(0);
  const startCarouselMotionRef = useRef(() => {});
  const motionActiveRef = useRef(false);
  const activeSlide = normalizedSlides[activeIndex] ?? normalizedSlides[0];
  const routeLabel = ROUTES.find((route) => route.to === pathname)?.label || 'Home';
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
    carouselTargetRef.current = 0;
    carouselCurrentRef.current = 0;
    stepCentersRef.current = [];
    setDepthPhase('banner');
    setDetailOpen(false);
    setMotionActive(false);
    motionActiveRef.current = false;
    window.scrollTo(0, 0);
  }, [slideKey]);

  useEffect(() => {
    const setMotionState = (isMoving) => {
      if (motionActiveRef.current === isMoving) return;
      motionActiveRef.current = isMoving;
      setMotionActive(isMoving);
    };

    const applyPosition = (position) => {
      const isDesktop = window.innerWidth > 900;
      neuralNodeRefs.current.forEach((node, index) => {
        if (!node) return;
        if (!isDesktop) {
          node.style.removeProperty('transform');
          node.style.removeProperty('opacity');
          node.style.removeProperty('z-index');
          node.style.removeProperty('pointer-events');
          return;
        }

        const distance = index - position;
        const frame = getCarouselFrame(distance);
        node.style.transform = `translate(-50%,-50%) translate3d(${frame.x.toFixed(3)}vw, ${frame.y.toFixed(3)}vh, ${frame.z.toFixed(2)}px) rotateY(${frame.rotateY.toFixed(3)}deg) rotateX(${frame.rotateX.toFixed(3)}deg) rotateZ(${frame.rotateZ.toFixed(3)}deg) scale(${frame.scale.toFixed(4)})`;
        node.style.opacity = frame.opacity.toFixed(4);
        node.style.zIndex = String(Math.max(1, 8 - Math.floor(Math.abs(distance) * 3)));
        node.style.pointerEvents = Math.abs(distance) <= 1.08 ? 'auto' : 'none';
      });
    };

    const commitIndex = (position) => {
      const nextIndex = clamp(Math.round(position), 0, normalizedSlides.length - 1);
      if (nextIndex === activeIndexRef.current) return;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    const animate = (time) => {
      carouselFrameRef.current = null;
      const target = carouselTargetRef.current;
      const current = carouselCurrentRef.current;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDesktop = window.innerWidth > 900;

      if (reduceMotion || !isDesktop) {
        carouselCurrentRef.current = target;
        applyPosition(target);
        commitIndex(target);
        setMotionState(false);
        carouselLastTimeRef.current = time;
        return;
      }

      const elapsed = clamp(time - (carouselLastTimeRef.current || time - 16.67), 8, 48);
      carouselLastTimeRef.current = time;
      const blend = 1 - Math.exp(-elapsed / 175);
      const next = Math.abs(target - current) < .001
        ? target
        : current + (target - current) * blend;

      carouselCurrentRef.current = next;
      applyPosition(next);

      if (Math.abs(target - next) > .001) {
        setMotionState(true);
        carouselFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        commitIndex(next);
        setMotionState(false);
      }
    };

    startCarouselMotionRef.current = () => {
      if (carouselFrameRef.current !== null) return;
      carouselLastTimeRef.current = performance.now();
      carouselFrameRef.current = window.requestAnimationFrame(animate);
    };

    applyPosition(carouselCurrentRef.current);
    return () => {
      if (carouselFrameRef.current !== null) window.cancelAnimationFrame(carouselFrameRef.current);
      carouselFrameRef.current = null;
      startCarouselMotionRef.current = () => {};
    };
  }, [normalizedSlides.length]);

  useEffect(() => {
    const experience = experienceRef.current;
    if (!experience || normalizedSlides.length === 0) return undefined;
    let ticking = false;

    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const viewportJourney = window.scrollY / Math.max(1, window.innerHeight);
      const bannerExit = Math.min(1, Math.max(0, (viewportJourney - 0.08) / 0.72));
      const humanArrival = Math.min(1, Math.max(0, (viewportJourney - 0.28) / 0.82));
      const neuralArrival = Math.min(1, Math.max(0, (viewportJourney - 1.04) / 0.88));
      const figureOpacity = humanArrival * (1 - neuralArrival * .16);
      const figureShift = window.innerWidth <= 900 ? 0 : neuralArrival * 11;
      const reveal = Math.min(1, Math.max(0, (progress - 0.035) / 0.93));
      const transitionEdge = Math.max(0, 84 - reveal * 100);
      const peel = Math.min(1, Math.max(0, (progress - 0.1) / 0.74));
      const transitionOpacity = Math.sin(Math.PI * peel) * 0.38;
      const shardOpacity = progress < 0.12
        ? 0
        : Math.min(1, (progress - 0.12) * 12) * Math.min(1, (0.94 - progress) * 3.2) * 0.82;
      const leftCoverage = Math.min(1, Math.max(0, (reveal - .7) / .22));

      experience.style.setProperty('--hm-progress', progress.toFixed(4));
      experience.style.setProperty('--hm-spine-progress', `${(8 + progress * 78).toFixed(2)}%`);
      experience.style.setProperty('--hm-banner-exit', bannerExit.toFixed(4));
      experience.style.setProperty('--hm-human-arrival', humanArrival.toFixed(4));
      experience.style.setProperty('--hm-neural-arrival', neuralArrival.toFixed(4));
      experience.style.setProperty('--hm-figure-opacity', figureOpacity.toFixed(4));
      experience.style.setProperty('--hm-figure-shift', `${figureShift.toFixed(3)}vw`);
      experience.style.setProperty('--hm-human-lift', `${((1 - humanArrival) * 82).toFixed(2)}px`);
      experience.style.setProperty('--hm-reveal', reveal.toFixed(4));
      experience.style.setProperty('--hm-peel', peel.toFixed(4));
      experience.style.setProperty('--hm-transition-opacity', transitionOpacity.toFixed(3));
      experience.style.setProperty('--hm-shard-opacity', Math.max(0, shardOpacity).toFixed(3));
      experience.style.setProperty('--hm-left-shard-opacity', Math.max(0, shardOpacity * leftCoverage).toFixed(3));
      experience.style.setProperty('--hm-left-peel', (peel * leftCoverage).toFixed(4));
      experience.style.setProperty('--hm-machine-edge', `${100 - reveal * 100}%`);
      experience.style.setProperty('--hm-transition-edge', `${transitionEdge}%`);

      const nextDepthPhase = viewportJourney < 0.82
        ? 'banner'
        : viewportJourney < 1.72
          ? 'humanoid'
          : 'neural';
      setDepthPhase((current) => (current === nextDepthPhase ? current : nextDepthPhase));

      if (stepCentersRef.current.length !== normalizedSlides.length) {
        stepCentersRef.current = stepRefs.current.map((step) => (
          step ? step.offsetTop + step.offsetHeight / 2 : 0
        ));
      }

      const centers = stepCentersRef.current;
      const scrollCenter = window.scrollY + window.innerHeight / 2;
      let carouselTarget = 0;
      if (centers.length > 1 && scrollCenter > centers[0]) {
        carouselTarget = centers.length - 1;
        for (let index = 0; index < centers.length - 1; index += 1) {
          if (scrollCenter <= centers[index + 1]) {
            const span = Math.max(1, centers[index + 1] - centers[index]);
            carouselTarget = index + (scrollCenter - centers[index]) / span;
            break;
          }
        }
      }
      carouselTargetRef.current = clamp(carouselTarget, 0, normalizedSlides.length - 1);
      startCarouselMotionRef.current();
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    const onPointerMove = (event) => {
      experience.style.setProperty('--hm-mouse-x', ((event.clientX / window.innerWidth - 0.5) * 2).toFixed(4));
      experience.style.setProperty('--hm-mouse-y', ((event.clientY / window.innerHeight - 0.5) * 2).toFixed(4));
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    const onResize = () => {
      stepCentersRef.current = [];
      requestUpdate();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [normalizedSlides.length]);

  useEffect(() => {
    if (!detailOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setDetailOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      returnFocusRef.current?.focus();
    };
  }, [detailOpen]);

  const jumpToSlide = (index) => {
    carouselTargetRef.current = index;
    startCarouselMotionRef.current();
    setMenuOpen(false);
    stepRefs.current[index]?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
    });
  };

  const openDetails = (event) => {
    returnFocusRef.current = event.currentTarget;
    setDetailOpen(true);
  };

  const activateChip = (event) => {
    if (canShowDetails) {
      openDetails(event);
      return;
    }
    const action = activeSlide.primaryAction || activeSlide.secondaryAction;
    if (action?.to) {
      navigate(action.to);
      return;
    }
    if (action?.href) {
      window.open(action.href, '_blank', 'noopener,noreferrer');
      return;
    }
    openDetails(event);
  };

  const enterNeuralField = () => {
    window.scrollTo({
      top: window.innerHeight * 1.82,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  if (!activeSlide) {
    return <div className="hm-empty">{emptyMessage}</div>;
  }

  const canShowDetails = Boolean(activeSlide.details?.length || activeSlide.detailContent || activeSlide.content);

  return (
    <div
      className="hm-experience"
      ref={experienceRef}
      data-humanoid={persona.id}
      style={{
        '--hm-accent': activeSlide.tone,
        '--hm-ambient-one': persona.ambientOne,
        '--hm-ambient-two': persona.ambientTwo,
      }}
    >
      <Scene persona={persona} />

      <header className="hm-header">
        <Link className="hm-brand" to="/">
          <strong>KUSHAGRA SINGH</strong>
          <span>AI Engineer · Systems · Intelligence</span>
        </Link>
        <nav className={`hm-nav ${menuOpen ? 'hm-nav-open' : ''}`} aria-label="Portfolio navigation">
          {ROUTES.map((route) => (
            <NavLink key={route.to} to={route.to} end={route.to === '/'} onClick={() => setMenuOpen(false)}>
              {route.label}
            </NavLink>
          ))}
        </nav>
        <div className="hm-mode"><i /> {pageLabel}<small>{persona.label}</small></div>
        <button
          type="button"
          className={`hm-menu-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span /><span /><span />
        </button>
      </header>

      <CinematicBanner
        persona={persona}
        pageLabel={pageLabel}
        slide={normalizedSlides[0]}
        routeLabel={routeLabel}
        onEnter={enterNeuralField}
        isActive={depthPhase === 'banner'}
      />

      <aside className="hm-evolution" aria-hidden="true">
        <span>Human</span>
        <div className="hm-evolution-track"><div className="hm-evolution-fill" /></div>
        <div className="hm-evolution-knob" />
        <span>Machine</span>
      </aside>

      <NeuralConstellation
        slides={normalizedSlides}
        activeIndex={activeIndex}
        onSelect={jumpToSlide}
        nodeRefs={neuralNodeRefs}
        pageLabel={pageLabel}
        onOpenDetails={activateChip}
        motionActive={motionActive}
      />

      <main className="hm-scroll-story">
        <div className="hm-story-lead" />
        {normalizedSlides.map((slide, index) => (
          <section
            className="hm-story-step"
            ref={(node) => { stepRefs.current[index] = node; }}
            aria-label={`${index + 1} of ${normalizedSlides.length}: ${slide.title}`}
            key={slide.id}
          >
            <div>{slide.chapter || slide.railTitle || slide.title}</div>
          </section>
        ))}
        <div className="hm-story-tail" />
      </main>

      {detailOpen && (
        <div className="hm-detail-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetailOpen(false);
        }}>
          <section className="hm-detail-panel" role="dialog" aria-modal="true" aria-labelledby="hm-detail-title">
            <NeuralChipVisual tone={activeSlide.tone} className="hm-detail-neural-visual" center={[.78, .42]} radiusScale={.28} />
            <span className="hm-detail-scanlines" aria-hidden="true" />
            <div className="hm-detail-topline">
              <span>{activeSlide.footer || activeSlide.eyebrow}</span>
              <button ref={closeButtonRef} type="button" onClick={() => setDetailOpen(false)} aria-label="Close details">×</button>
            </div>
            <p>{activeSlide.eyebrow}</p>
            <h2 id="hm-detail-title">{activeSlide.title}</h2>
            <p>{activeSlide.detailIntro || activeSlide.summary}</p>
            {activeSlide.detailContent || activeSlide.content || (
              <div className="hm-detail-highlights">
                {(activeSlide.details || []).map((detail, index) => (
                  <div key={`${index}-${detail}`} dangerouslySetInnerHTML={{ __html: detail }} />
                ))}
                {(activeSlide.stats || []).length > 0 && (
                  <div className="hm-detail-signal-grid">
                    {activeSlide.stats.map((stat, index) => <span key={`${index}-${stat}`}>{stat}</span>)}
                  </div>
                )}
              </div>
            )}
            <div className="hm-detail-actions">
              <ActionLink action={activeSlide.primaryAction} />
              <ActionLink action={activeSlide.secondaryAction} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export { DEFAULT_TONES };
