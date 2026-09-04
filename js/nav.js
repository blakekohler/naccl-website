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
} else if (heroVideo) {
  // restart just before the file ends — avoids the flicker native loop causes
  heroVideo.addEventListener('timeupdate', () => {
    if (heroVideo.duration && heroVideo.currentTime > heroVideo.duration - 0.35) {
      heroVideo.currentTime = 0.05;
    }
  });
}

// Ambient network animation — nodes drifting and connecting over the hero
const net = document.querySelector('.hero-net');
if (net && !reducedMotion && window.innerWidth > 700) {
  const ctx = net.getContext('2d');
  const heroEl = net.parentElement;
  const COUNT = 60;
  const LINK = 150;
  let w, h, nodes = [], visible = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = heroEl.clientWidth;
    h = heroEl.clientHeight;
    net.width = w * dpr;
    net.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawn = () => {
    nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      r: 1.5 + Math.random() * 1.5,
      gold: Math.random() < 0.18,
    }));
  };

  const tick = () => {
    if (!visible || document.hidden) { requestAnimationFrame(tick); return; }
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - d / LINK) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.gold ? 'rgba(212, 173, 106, 0.9)' : 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };

  resize();
  spawn();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(heroEl);
  }
  requestAnimationFrame(tick);
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
