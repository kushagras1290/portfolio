import { useEffect } from 'react';

const SPOTLIGHT_SELECTOR = [
  '.proj-card', '.featured-work-card', '.exp-card', '.acc-card',
  '.edu-card', '.cert-card', '.c-link', '.qlink-card', '.bio-card',
  '.proj-detail-sidebar',
].join(', ');

const MAGNETIC_SELECTOR = '.btn';
const MAGNETIC_STRENGTH = 0.28;
const MAGNETIC_MAX_PX = 10;

/**
 * Mounted once at app root. Uses a single delegated pointermove listener
 * (rather than per-card listeners) so it stays cheap regardless of how many
 * cards/pages mount or unmount during navigation.
 */
export function useGlobalInteractions() {
  useEffect(() => {
    const canAnimate = window.matchMedia('(pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let activeMagnet = null;

    function resetMagnet() {
      if (activeMagnet) {
        activeMagnet.style.transform = '';
        activeMagnet = null;
      }
    }

    function onPointerMove(e) {
      const spotCard = e.target.closest ? e.target.closest(SPOTLIGHT_SELECTOR) : null;
      if (spotCard) {
        const rect = spotCard.getBoundingClientRect();
        spotCard.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        spotCard.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }

      if (!canAnimate) return;

      const magnet = e.target.closest ? e.target.closest(MAGNETIC_SELECTOR) : null;
      if (magnet !== activeMagnet) {
        resetMagnet();
        activeMagnet = magnet;
      }
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * MAGNETIC_STRENGTH;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * MAGNETIC_STRENGTH;
        const cx = Math.max(-MAGNETIC_MAX_PX, Math.min(MAGNETIC_MAX_PX, dx));
        const cy = Math.max(-MAGNETIC_MAX_PX, Math.min(MAGNETIC_MAX_PX, dy));
        magnet.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', resetMagnet);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', resetMagnet);
      resetMagnet();
    };
  }, []);
}
