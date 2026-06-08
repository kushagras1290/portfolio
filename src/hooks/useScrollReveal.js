import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    // Upgrade sec-title elements to line-mask reveal
    document.querySelectorAll('.sec-title:not([data-upgraded])').forEach(el => {
      el.setAttribute('data-upgraded', '1');
      const html = el.innerHTML;
      const lines = html.split(/<br\s*\/?>/i);
      el.innerHTML = lines
        .map(l => `<span class="line-mask"><span class="line-inner">${l}</span></span>`)
        .join('');
      el.classList.remove('reveal');
      el.classList.add('reveal-title');
    });

    // Upgrade .label to slide-in-left
    document.querySelectorAll('.label:not([data-upgraded])').forEach(el => {
      el.setAttribute('data-upgraded', '1');
      el.classList.remove('reveal');
      el.classList.add('reveal-left');
    });

    // Upgrade grid cards to reveal-card
    const GRID_SEL = '.proj-grid, .acc-grid, .cert-grid, .edu-grid';
    document.querySelectorAll(GRID_SEL).forEach(grid => {
      [...grid.children].forEach((card, i) => {
        card.classList.remove('reveal', 'reveal-d1', 'reveal-d2', 'reveal-d3');
        if (!card.classList.contains('reveal-card')) {
          card.classList.add('reveal-card');
          card.style.transitionDelay = `${(i % 3) * 0.08}s`;
        }
      });
    });

    const targets = document.querySelectorAll(
      '.reveal, .reveal-card, .reveal-left, .reveal-title'
    );
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}
