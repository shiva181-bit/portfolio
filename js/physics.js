/**
 * physics.js — Drag + inertia engine
 *
 * Each entity can have an optional `bounds` object (page-absolute pixels):
 *   { top, left, bottom, right }
 *
 * If bounds exist, edge-bounce uses them instead of the global document size.
 * physics.js never touches the DOM to find sections — that's elements.js's job.
 */

class PhysicsEngine {
  constructor() {
    this.entities  = [];
    this.DAMPING   = 0.96;
    this.MAX_THROW = 16;

    this._loop        = this._loop.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp   = this._onMouseUp.bind(this);

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup',   this._onMouseUp);

    requestAnimationFrame(this._loop);
  }

  /**
   * register(el, x, y)
   * Creates a physics entity for the element and returns it.
   * Returning the entity lets elements.js call setBounds() on it.
   */
  register(el, x, y) {
    const entity = {
      el,
      x, y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      isDragging:  false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastMouseX:  0,
      lastMouseY:  0,
      prevMouseX:  0,
      prevMouseY:  0,
      bounds:     null,   // set by setBounds() — null = use global fallback
      sectionEl:  null,   // DOM reference kept for resize recalculation
    };

    this.entities.push(entity);
    this._applyPosition(entity);

    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      entity.isDragging  = true;
      entity.dragOffsetX = (e.clientX + window.scrollX) - entity.x;
      entity.dragOffsetY = (e.clientY + window.scrollY) - entity.y;
      entity.lastMouseX  = e.clientX;
      entity.lastMouseY  = e.clientY;
      entity.prevMouseX  = e.clientX;
      entity.prevMouseY  = e.clientY;
      entity.vx = 0;
      entity.vy = 0;
      el.classList.add('is-dragging');
    });

    return entity; // ← caller needs this to pass to setBounds()
  }

  /**
   * setBounds(entity, sectionEl)
   * Called by elements.js to assign a section cage to an entity.
   * Stores the DOM reference so resize can recalculate later.
   */
  setBounds(entity, sectionEl) {
    entity.sectionEl = sectionEl;
    entity.bounds    = this._calcBounds(sectionEl);
  }

  /**
   * _calcBounds(sectionEl)
   * Converts a section's getBoundingClientRect() into page-absolute coords.
   * Private — only physics.js calls this.
   */
  _calcBounds(sectionEl) {
    const PADDING = 12;
    const rect    = sectionEl.getBoundingClientRect();
    return {
      top:    rect.top    + window.scrollY + PADDING,
      left:   rect.left   + window.scrollX + PADDING,
      bottom: rect.bottom + window.scrollY - PADDING,
      right:  rect.right  + window.scrollX - PADDING,
    };
  }

  _loop() {
    for (const entity of this.entities) {
      if (entity.isDragging) continue;

      entity.x += entity.vx;
      entity.y += entity.vy;
      entity.vx *= this.DAMPING;
      entity.vy *= this.DAMPING;
      if (Math.abs(entity.vx) < 0.01) entity.vx = 0;
      if (Math.abs(entity.vy) < 0.01) entity.vy = 0;

      const elW = entity.el.offsetWidth  || 160;
      const elH = entity.el.offsetHeight || 44;

      // ── Per-entity bounds if set, global document fallback otherwise ──
      let minX, maxX, minY, maxY;

      if (entity.bounds) {
        minX = entity.bounds.left;
        maxX = entity.bounds.right  - elW;
        minY = entity.bounds.top;
        maxY = entity.bounds.bottom - elH;
      } else {
        minX = 8;
        maxX = document.body.scrollWidth  - elW - 8;
        minY = 8;
        maxY = document.body.scrollHeight - elH - 8;
      }

      // Clamp maxX/maxY so they're never less than minX/minY
      // (prevents NaN jitter if section is smaller than the element)
      maxX = Math.max(minX, maxX);
      maxY = Math.max(minY, maxY);

      if (entity.x < minX) { entity.x = minX; entity.vx =  Math.abs(entity.vx) * 0.4; }
      if (entity.x > maxX) { entity.x = maxX; entity.vx = -Math.abs(entity.vx) * 0.4; }
      if (entity.y < minY) { entity.y = minY; entity.vy =  Math.abs(entity.vy) * 0.4; }
      if (entity.y > maxY) { entity.y = maxY; entity.vy = -Math.abs(entity.vy) * 0.4; }

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

      entity.x = (e.clientX + window.scrollX) - entity.dragOffsetX;
      entity.y = (e.clientY + window.scrollY) - entity.dragOffsetY;

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
}

const physics = new PhysicsEngine();