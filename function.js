// ── Deep Funded — Animated smoke background + hero text ──

(async () => {

  // ── 1. Inject full-screen canvas ──
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── 2. Smoke particle system ──
  const SMOKE_COUNT = 60;
  const smoke = [];

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createSmoke() {
    return {
      x:       randBetween(0, canvas.width),
      y:       randBetween(0, canvas.height),
      radius:  randBetween(120, 320),
      opacity: randBetween(0.2, 0.32),
      dx:      randBetween(-0.18, 0.18),
      dy:      randBetween(-0.12, 0.12),
      grow:    randBetween(0.04, 0.14),
      // colour shifts between the palette blues
      hue:     randBetween(200, 230),
    };
  }

  for (let i = 0; i < SMOKE_COUNT; i++) smoke.push(createSmoke());

  // ── 3. Scroll reactivity ──
  let scrollVel = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    scrollVel = Math.abs(window.scrollY - lastScrollY) * 0.5;
    lastScrollY = window.scrollY;
  }, { passive: true });

  // ── 4. Render loop ──
  function draw() {
    // Deep navy base matching #1a1a2e
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fade scroll velocity
    scrollVel *= 0.92;

    // Draw smoke puffs
    smoke.forEach(p => {

      // Move
      const speed = 1 + scrollVel * 0.04;
      p.x += p.dx * speed;
      p.y += p.dy * speed;
      p.radius += p.grow;

      // Wrap & reset when too large or out of bounds
      if (
        p.radius > 420 ||
        p.x < -p.radius || p.x > canvas.width  + p.radius ||
        p.y < -p.radius || p.y > canvas.height + p.radius
      ) {
        Object.assign(p, createSmoke(), {
          x: randBetween(0, canvas.width),
          y: randBetween(0, canvas.height),
          radius: randBetween(80, 160),
        });
      }

      // Radial gradient puff
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      const op = p.opacity + scrollVel * 0.002;
      grad.addColorStop(0,   `hsla(${p.hue}, 28%, 28%, ${Math.min(op, 0.22)})`);
      grad.addColorStop(0.5, `hsla(${p.hue}, 22%, 20%, ${Math.min(op * 0.5, 0.10)})`);
      grad.addColorStop(1,   `hsla(${p.hue}, 18%, 15%, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();

  // ── 5. Swap hero h1 text to "DEEP FUNDED" with chart icon ──
  const h1 = document.querySelector('header h1');
  if (h1) {
    h1.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg"
           style="vertical-align:middle;margin-right:6px;margin-bottom:3px">
        <polyline points="2,17 8,10 13,14 22,4"
                  stroke="#efc07b" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <polyline points="18,4 22,4 22,8"
                  stroke="#efc07b" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>DEEP FUNDED`;
    h1.style.cssText += `
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.5rem;
      letter-spacing: 0.06em;
      color: #efc07b;
    `;
  }

  // ── 6. Style hero h2 to match logo feel ──
  const heroH2 = document.querySelector('.hero h2');
  if (heroH2) {
    heroH2.style.cssText += `
      font-family: Georgia, 'Times New Roman', serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    `;
  }

})();