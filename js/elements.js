/**
 * elements.js — Floating elements, layout positions, section assignments
 *
 * This file owns:
 *   - What elements exist (data arrays)
 *   - How to build their DOM nodes (factory functions)
 *   - Where they start (position calculation)
 *   - Which section cage they belong to (setBounds calls)
 *   - Recalculating bounds on window resize
 *
 * physics.js owns none of this — it only reads entity.bounds.
 */

// ── Data ────────────────────────────────────────────────────────

const TECH_STACK = [
  { label: 'React',       emoji: '⚛️',  color: '#61dafb' },
  { label: 'Java',        emoji: '☕',  color: '#f89820' },
  { label: 'Spring Boot', emoji: '🍃',  color: '#6db33f' },
  { label: 'MySQL',       emoji: '🐬',  color: '#00758f' },
  { label: 'Python',      emoji: '🐍',  color: '#3572a5' },
  { label: 'Next.js',     emoji: '▲',   color: '#e2e8f0' },
  { label: 'Git',         emoji: '🔀',  color: '#f05032' },
  { label: 'Linux',       emoji: '🐧',  color: '#fcc624' },
];

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
];

const PROJECTS = [
  { title: 'Bengaluru Property Insights', tag: 'Spring Boot · MySQL · Next.js', thumb: '🏙️' },
  { title: 'AI Feedback Analyzer',        tag: 'LangFlow · GPT-4 · Python',     thumb: '🤖' },
  { title: 'Portfolio OS',                tag: 'Vanilla JS · CSS · HTML',        thumb: '🌌' },
];

// ── DOM Factories ────────────────────────────────────────────────

function createIconChip({ label, emoji, color }) {
  const el = document.createElement('div');
  el.className = 'floaty icon-chip';
  el.innerHTML = `<span>${emoji}</span><span>${label}</span>`;
  el.style.borderLeftColor = color;
  el.style.borderLeftWidth = '3px';
  return el;
}

function createNavPill({ label, href }) {
  const el = document.createElement('a');
  el.className = 'floaty nav-pill';
  el.textContent = label;
  el.href = href;
  return el;
}

function createProjectCard({ title, tag, thumb }) {
  const el = document.createElement('div');
  el.className = 'floaty project-card';
  el.innerHTML = `
    <div class="card-thumb">${thumb}</div>
    <div class="card-body">
      <div class="card-title">${title}</div>
      <div class="card-tag">${tag}</div>
    </div>`;
  return el;
}

// ── Position Helpers ─────────────────────────────────────────────

/**
 * randomPosInSection(sectionEl, elW, elH)
 * Returns a random page-absolute {x, y} that fits inside the section.
 * Used to scatter elements naturally within their cage on load.
 */
function randomPosInSection(sectionEl, elW = 160, elH = 44) {
  const PADDING = 24;
  const rect    = sectionEl.getBoundingClientRect();

  const minX = rect.left   + window.scrollX + PADDING;
  const maxX = rect.right  + window.scrollX - elW - PADDING;
  const minY = rect.top    + window.scrollY + PADDING;
  const maxY = rect.bottom + window.scrollY - elH - PADDING;

  return {
    x: minX + Math.random() * Math.max(0, maxX - minX),
    y: minY + Math.random() * Math.max(0, maxY - minY),
  };
}

// ── Spawn All ────────────────────────────────────────────────────

function spawnAll(canvas, physics) {
  // Grab section nodes — elements.js owns DOM knowledge, physics.js never does
  const heroSection     = document.getElementById('hero');
  const aboutSection    = document.getElementById('about');
  const projectsSection = document.getElementById('projects');
  const contactSection  = document.getElementById('contact');

  const W  = window.innerWidth;
  const VH = window.innerHeight;

  // ── Nav pills → hero section ──────────────────────────────────
  // Positioned manually across the top of the hero section
  const navY = VH * 0.08;
  const navPositions = [
    { x: W * 0.25 - 55, y: navY },
    { x: W * 0.50 - 55, y: navY },
    { x: W * 0.75 - 55, y: navY },
  ];

  NAV_LINKS.forEach((data, i) => {
    const el     = createNavPill(data);
    canvas.appendChild(el);
    const entity = physics.register(el, navPositions[i].x, navPositions[i].y);
    physics.setBounds(entity, heroSection);
  });

  // ── Tech chips → hero section ─────────────────────────────────
  // Two rows of 4 flanking the hero headline, then random scatter
  const chipW      = 160;
  const chipGap    = 14;
  const rowWidth   = chipW * 4 + chipGap * 3;
  const chipStartX = (W - rowWidth) / 2;
  const heroMidY   = VH / 2;

  TECH_STACK.forEach((data, i) => {
    const el  = createIconChip(data);
    canvas.appendChild(el);

    const col = i % 4;
    const row = Math.floor(i / 4);
    const x   = chipStartX + col * (chipW + chipGap);
    const y   = row === 0 ? heroMidY - 130 : heroMidY + 90;

    const entity = physics.register(el, x, y);
    physics.setBounds(entity, heroSection);
  });

  // ── Project cards → projects section ─────────────────────────
  // Scattered randomly within the projects section bounds
  PROJECTS.forEach((data) => {
    const el     = createProjectCard(data);
    canvas.appendChild(el);
    const pos    = randomPosInSection(projectsSection, 220, 180);
    const entity = physics.register(el, pos.x, pos.y);
    physics.setBounds(entity, projectsSection);
  });

  // ── Resize handler ────────────────────────────────────────────
  // When the viewport changes, section rects change too.
  // Recalculate all bounds so cages stay accurate.
  // Debounced 120ms — don't hammer this on every pixel of resize.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      physics.entities.forEach(entity => {
        if (entity.sectionEl) {
          entity.bounds = physics._calcBounds(entity.sectionEl);
        }
      });
    }, 120);
  });
}