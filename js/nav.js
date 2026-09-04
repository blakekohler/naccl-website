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

// Background video: skip entirely on small screens and for reduced motion
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && (reducedMotion || window.matchMedia('(max-width: 700px)').matches)) {
  heroVideo.remove();
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
    '.band > .container > p, section.block > p, .faq h3 + p, form.stacked'
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
