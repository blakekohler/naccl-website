const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
}

// Background video: two staggered copies crossfade for a seamless loop.
// Skipped entirely on small screens and for reduced motion.
const heroVideos = document.querySelectorAll('.hero-video');
if (heroVideos.length && (reducedMotion || window.matchMedia('(max-width: 700px)').matches)) {
  heroVideos.forEach((v) => v.remove());
} else if (heroVideos.length === 2) {
  const FADE = 1.1;
  let [active, standby] = heroVideos;
  standby.pause();
  // Safari won't reliably honor the autoplay attribute: it shows a play
  // glyph while deciding, and paints the first frame before blend-mode
  // compositing applies. Keep the video hidden until frames are actually
  // rendering, start playback from script, and drop both copies (leaving
  // the gradient) if playback is refused.
  const first = active;
  first.style.opacity = 0;
  first.addEventListener('playing', () => { first.style.opacity = ''; }, { once: true });
  heroVideos.forEach((v) => { v.muted = true; v.defaultMuted = true; });
  first.play()
    .then(() => { first.style.opacity = ''; })
    .catch(() => heroVideos.forEach((v) => v.remove()));
  setInterval(() => {
    if (!active.duration || active.paused) return;
    if (active.currentTime > active.duration - FADE - 0.2) {
      standby.currentTime = 0.05;
      standby.play().catch(() => {});
      standby.style.opacity = 0.18;
      active.style.opacity = 0;
      const old = active;
      setTimeout(() => old.pause(), FADE * 1000 + 300);
      [active, standby] = [standby, active];
    }
  }, 250);
}

// Compact header once the page scrolls
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Leadership avatars — initials derived from the name
document.querySelectorAll('.person').forEach((card) => {
  const name = card.querySelector('.name');
  if (!name) return;
  const words = name.textContent.trim().split(/\s+/);
  const initials = (words[0][0] || '') + (words.length > 1 ? words[words.length - 1][0] : '');
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = initials;
  card.prepend(avatar);
});

// Scroll reveal + stat count-up
if (!reducedMotion && 'IntersectionObserver' in window) {
  const candidates = document.querySelectorAll(
    '.section-bar, .card, .stat-card, .person, blockquote, .timeline li, h3.subhead, ' +
    '.band > .container > p, section.block > p, .faq h3 + p, form.stacked, .map-figure'
  );
  const perParent = new Map();
  candidates.forEach((el) => {
    const i = perParent.get(el.parentElement) || 0;
    perParent.set(el.parentElement, i + 1);
    el.classList.add('reveal');
    el.style.setProperty('--d', `${Math.min(i * 0.08, 0.4)}s`);
  });

  const countUp = (el) => {
    const target = parseInt(el.textContent, 10);
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      const number = entry.target.querySelector?.('.number');
      if (number && /^\d+$/.test(number.textContent.trim()) && !number.dataset.counted) {
        number.dataset.counted = 'true';
        countUp(number);
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  candidates.forEach((el) => observer.observe(el));
}

// Founding-member map tooltips
const mapFigure = document.querySelector('.map-figure');
if (mapFigure) {
  const tip = mapFigure.querySelector('.map-tip');
  const show = (state, x, y) => {
    tip.textContent = `${state.dataset.name} \u2014 ${state.dataset.label}`;
    tip.hidden = false;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  };
  const showPins = (name) => {
    mapFigure.querySelectorAll('.state-pins.show').forEach((g) => {
      if (g.dataset.state !== name) g.classList.remove('show');
    });
    if (!name) return;
    const g = mapFigure.querySelector(`.state-pins[data-state="${name}"]`);
    if (g) g.classList.add('show');
  };
  mapFigure.addEventListener('pointermove', (e) => {
    const state = e.target.closest('.map-state');
    if (!state) { tip.hidden = true; showPins(null); return; }
    const r = mapFigure.getBoundingClientRect();
    show(state, e.clientX - r.left + 16, e.clientY - r.top - 12);
    showPins(state.dataset.name);
  });
  mapFigure.addEventListener('pointerleave', () => { tip.hidden = true; showPins(null); });
  mapFigure.addEventListener('focusin', (e) => {
    const state = e.target.closest('.map-state');
    if (!state) return;
    const b = state.getBBox();
    show(state, b.x + b.width / 2, b.y - 8);
    showPins(state.dataset.name);
  });
  mapFigure.addEventListener('focusout', () => { tip.hidden = true; showPins(null); });
}
