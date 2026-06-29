/**
 * elements.js — Portfolio data, DOM factories, and sandbox spawners
 *
 * Each physics section gets its own spawn function that:
 *   1. Creates DOM elements
 *   2. Appends them to that section's .physics-sandbox
 *   3. Registers them with that sandbox's PhysicsEngine instance
 *   4. Positions them randomly within the sandbox bounds
 */

// ── Data ─────────────────────────────────────────────────────────

const SKILLS = [
  { label: 'React',        emoji: '⚛️',  color: '#61dafb' },
  { label: 'Java',         emoji: '☕',  color: '#f89820' },
  { label: 'Spring Boot',  emoji: '🍃',  color: '#6db33f' },
  { label: 'MySQL',        emoji: '🐬',  color: '#00758f' },
  { label: 'Python',       emoji: '🐍',  color: '#3572a5' },
  { label: 'Next.js',      emoji: '▲',   color: '#e2e8f0' },
  { label: 'Git',          emoji: '🔀',  color: '#f05032' },
  { label: 'Linux',        emoji: '🐧',  color: '#fcc624' },
  { label: 'TypeScript',   emoji: '𝐓𝐒',  color: '#3178c6' },
  { label: 'LangChain',    emoji: '🔗',  color: '#10b981' },
  { label: 'REST APIs',    emoji: '🔌',  color: '#a78bfa' },
  { label: 'Docker',       emoji: '🐳',  color: '#2496ed' },
];

const PROJECTS = [
  {
    title: 'Bengaluru Property Insights',
    tag:   'Spring Boot · MySQL · Next.js',
    thumb: '🏙️',
    desc:  'Land price visualization & ROI analysis for Bangalore localities.',
  },
  {
    title: 'AI Feedback Analyzer',
    tag:   'LangFlow · GPT-4 · Python',
    thumb: '🤖',
    desc:  'Multi-step pipeline classifying student feedback with specialist prompt nodes.',
  },
  {
    title: 'Portfolio OS',
    tag:   'Vanilla JS · CSS · HTML',
    thumb: '🌌',
    desc:  'This site — physics-based UI built from scratch, no frameworks.',
  },
];

const CERTIFICATIONS = [
  { name: 'Generative AI Workshop',        issuer: 'IISc Bangalore',  year: '2024' },
  { name: 'AI/ML Foundations Workshop',    issuer: 'IISc Bangalore',  year: '2024' },
  { name: 'Solutions Architecture',        issuer: 'AWS · Forage',    year: '2024' },
  { name: 'Prompt Engineering Hackathon',  issuer: 'Presidency Univ', year: '2024' },
  { name: 'Cybersecurity Tech Event',      issuer: 'Presidency Univ', year: '2024' },
];

// ── DOM Factories ─────────────────────────────────────────────────

function createSkillChip({ label, emoji, color }) {
  const el = document.createElement('div');
  el.className = 'floaty skill-chip';
  el.innerHTML = `<span>${emoji}</span><span>${label}</span>`;
  el.style.borderLeftColor = color;
  el.style.borderLeftWidth = '3px';
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

function createCertCard({ name, issuer, year }) {
  const el = document.createElement('div');
  el.className = 'floaty cert-card';
  el.innerHTML = `
    <div class="cert-issuer">${issuer}</div>
    <div class="cert-name">${name}</div>
    <div class="cert-year">${year}</div>`;
  return el;
}

// ── Position Helper ───────────────────────────────────────────────
/**
 * randomPos(sandbox, elW, elH)
 * Returns a random {x, y} that fits inside the sandbox with padding.
 * Coordinates are sandbox-relative (0,0 = top-left of sandbox).
 */
function randomPos(sandbox, elW = 140, elH = 44) {
  const PAD = 16;
  const maxX = Math.max(PAD, sandbox.offsetWidth  - elW - PAD);
  const maxY = Math.max(PAD, sandbox.offsetHeight - elH - PAD);
  return {
    x: PAD + Math.random() * (maxX - PAD),
    y: PAD + Math.random() * (maxY - PAD),
  };
}

// ── Stagger Fade-in ───────────────────────────────────────────────

function fadeIn(elements) {
  elements.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'scale(0.85)';
    el.style.transition = 'opacity 350ms ease, transform 350ms ease';
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'scale(1)';
      setTimeout(() => {
        el.style.transition = 'border-color 150ms ease, box-shadow 150ms ease';
      }, 350);
    }, 80 + i * 55);
  });
}

// ── Sandbox Spawners ──────────────────────────────────────────────

function spawnSkills(sandbox) {
  const engine = new PhysicsEngine(sandbox);

  SKILLS.forEach(data => {
    const el  = createSkillChip(data);
    sandbox.appendChild(el);
    const pos = randomPos(sandbox, 160, 40);
    engine.register(el, pos.x, pos.y);
  });

  fadeIn(Array.from(sandbox.querySelectorAll('.floaty')));
  return engine;
}

function spawnProjects(sandbox) {
  const engine = new PhysicsEngine(sandbox);

  PROJECTS.forEach(data => {
    const el  = createProjectCard(data);
    sandbox.appendChild(el);
    const pos = randomPos(sandbox, 240, 180);
    engine.register(el, pos.x, pos.y);
  });

  fadeIn(Array.from(sandbox.querySelectorAll('.floaty')));
  return engine;
}

function spawnCertifications(sandbox) {
  const engine = new PhysicsEngine(sandbox);

  CERTIFICATIONS.forEach(data => {
    const el  = createCertCard(data);
    sandbox.appendChild(el);
    const pos = randomPos(sandbox, 210, 110);
    engine.register(el, pos.x, pos.y);
  });

  fadeIn(Array.from(sandbox.querySelectorAll('.floaty')));
  return engine;
}