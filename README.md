Welcome to the repository! This is my personal portfolio website built entirely from scratch using native web technologies. 

The Philosophy
Instead of grabbing a ready-made template or letting an AI "vibe code" a layout for me in 15 minutes, I am building this from the ground up. 

My goal is to:
* **Understand the "Why":** Learn the backbone structure and mathematical physics behind the animations rather than relying on heavy third-party frameworks.
* **Enforce Strict Architecture:** Maintain a clean separation of concerns between pure mathematics/physics tracking and DOM generation.

---

Development Log
### Day 1 — The Blueprint & Canvas Model
* Set up the architecture for a standard scrollable page covered by a full-bleed, transparent absolute `#canvas` overlay.
* Configured `pointer-events: none` on the canvas and `pointer-events: auto` on `.floaty` elements to allow smooth document scrolling while retaining interactive elements.
* Built the core foundational files: `physics.js`, `elements.js`, and `main.js`.

### Day 2 — Structural Adjustments & Refinements
* Made minor architectural tweaks to the element drift logic.
* Formulated a cleaner step-by-step roadmap for handling physics boundaries and scaling constraints.

### Day 3 — Roadmap to Completion
* *Time Gap Note: Resumed after a week-long break.*
* Designed a rock-solid, definitive execution plan for the remainder of the project.
* Outlined the implementation strategy for confining specific floaty elements (like Tech Skills) to their dedicated viewport containers rather than letting them drift across the entire page height.