/**
 * main.js — Entry point.
 * Spawns all elements, runs stagger fade-in. Nothing else.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  if (!canvas) { console.error('No #canvas found'); return; }

  spawnAll(canvas, physics);

  // Stagger fade-in — each element appears 50ms after the last
  const floaties = canvas.querySelectorAll('.floaty');
  floaties.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(10px)';
    el.style.transition = 'opacity 400ms ease, transform 400ms ease';

    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';

      // After entrance animation settles, switch to hover-only transitions
      setTimeout(() => {
        el.style.transition = 'box-shadow 150ms ease, opacity 150ms ease, border-color 150ms ease';
      }, 400);
    }, 100 + i * 50);
  });

  console.log('%c🌌 Physics engine running — elements bounded to sections', 'color: #38bdf8; font-family: monospace;');
});