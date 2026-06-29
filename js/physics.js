/**
 * physics.js — Per-sandbox physics engine
 *
 * Key architectural change from the previous version:
 *   Elements are positioned relative to their .physics-sandbox parent,
 *   NOT the full page. This means coordinates are always 0,0 at the
 *   sandbox's top-left corner — no scroll offset math needed at all.
 *
 * Each sandbox gets its own PhysicsEngine instance.
 * Call: const engine = new PhysicsEngine(sandboxEl)
 */

class PhysicsEngine {
  constructor(sandboxEl) {
    this.sandbox   = sandboxEl;
    this.entities  = [];
    this.DAMPING   = 0.96;
    this.MAX_THROW = 14;
    this.PADDING   = 10;

    this._loop        = this._loop.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp   = this._onMouseUp.bind(this);

    // Mouse events on window so fast drags don't lose the element
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup',   this._onMouseUp);

    requestAnimationFrame(this._loop);
  }

  /**
   * register(el, x, y)
   * x, y are relative to the sandbox top-left (not the page).
   */
  register(el, x, y) {
    const entity = {
      el,
      x, y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      isDragging:  false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastMouseX:  0,
      lastMouseY:  0,
      prevMouseX:  0,
      prevMouseY:  0,
    };

    this.entities.push(entity);
    this._applyPosition(entity);

    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const sandboxRect = this.sandbox.getBoundingClientRect();

      entity.isDragging  = true;
      // dragOffset = distance from mouse to element's top-left,
      // expressed in sandbox-relative coords
      entity.dragOffsetX = (e.clientX - sandboxRect.left) - entity.x;
      entity.dragOffsetY = (e.clientY - sandboxRect.top)  - entity.y;
      entity.lastMouseX  = e.clientX;
      entity.lastMouseY  = e.clientY;
      entity.prevMouseX  = e.clientX;
      entity.prevMouseY  = e.clientY;
      entity.vx = 0;
      entity.vy = 0;

      el.classList.add('is-dragging');
    });

    return entity;
  }

  _loop() {
    // Sandbox dimensions — re-read each frame so resize works
    const W = this.sandbox.offsetWidth;
    const H = this.sandbox.offsetHeight;
    const P = this.PADDING;

    for (const entity of this.entities) {
      if (entity.isDragging) continue;

      entity.x += entity.vx;
      entity.y += entity.vy;
      entity.vx *= this.DAMPING;
      entity.vy *= this.DAMPING;

      if (Math.abs(entity.vx) < 0.01) entity.vx = 0;
      if (Math.abs(entity.vy) < 0.01) entity.vy = 0;

      const elW = entity.el.offsetWidth  || 120;
      const elH = entity.el.offsetHeight || 40;

      const minX = P;
      const maxX = Math.max(P, W - elW - P);
      const minY = P;
      const maxY = Math.max(P, H - elH - P);

      if (entity.x < minX) { entity.x = minX; entity.vx =  Math.abs(entity.vx) * 0.45; }
      if (entity.x > maxX) { entity.x = maxX; entity.vx = -Math.abs(entity.vx) * 0.45; }
      if (entity.y < minY) { entity.y = minY; entity.vy =  Math.abs(entity.vy) * 0.45; }
      if (entity.y > maxY) { entity.y = maxY; entity.vy = -Math.abs(entity.vy) * 0.45; }

      this._applyPosition(entity);
    }

    requestAnimationFrame(this._loop);
  }

  _onMouseMove(e) {
    for (const entity of this.entities) {
      if (!entity.isDragging) continue;

      entity.prevMouseX = entity.lastMouseX;
      entity.prevMouseY = entity.lastMouseY;
      entity.lastMouseX = e.clientX;
      entity.lastMouseY = e.clientY;

      // Convert mouse position to sandbox-relative coords
      const sandboxRect  = this.sandbox.getBoundingClientRect();
      entity.x = (e.clientX - sandboxRect.left) - entity.dragOffsetX;
      entity.y = (e.clientY - sandboxRect.top)  - entity.dragOffsetY;

      this._applyPosition(entity);
    }
  }

  _onMouseUp() {
    for (const entity of this.entities) {
      if (!entity.isDragging) continue;
      entity.isDragging = false;
      entity.el.classList.remove('is-dragging');

      entity.vx = Math.max(-this.MAX_THROW, Math.min(this.MAX_THROW,
        entity.lastMouseX - entity.prevMouseX));
      entity.vy = Math.max(-this.MAX_THROW, Math.min(this.MAX_THROW,
        entity.lastMouseY - entity.prevMouseY));
    }
  }

  _applyPosition(entity) {
    entity.el.style.left = `${entity.x}px`;
    entity.el.style.top  = `${entity.y}px`;
  }

  /**
   * destroy()
   * Removes event listeners — call if you ever remove a sandbox from the DOM.
   */
  destroy() {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup',   this._onMouseUp);
  }
}