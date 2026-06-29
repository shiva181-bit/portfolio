/**
 * main.js — Entry point
 *
 * Finds each .physics-sandbox by its section, calls the right spawner.
 * Nothing else lives here — logic is in elements.js, physics in physics.js.
 */

document.addEventListener('DOMContentLoaded', () => {

  const skillsSandbox = document.querySelector('#skills .physics-sandbox');
  const projectsSandbox = document.querySelector('#projects .physics-sandbox');
  const certsSandbox = document.querySelector('#certifications .physics-sandbox');

  if (skillsSandbox)   spawnSkills(skillsSandbox);
  if (projectsSandbox) spawnProjects(projectsSandbox);
  if (certsSandbox)    spawnCertifications(certsSandbox);

  console.log('%c🌌 Portfolio loaded — sandboxes active', 'color: #38bdf8; font-family: monospace;');
});