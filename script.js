const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobileNav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.hidden = open;
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && mobileNav && menuButton) {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav && menuButton) {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCounters = (card) => {
  card.querySelectorAll('[data-counter]').forEach((counter, index) => {
    const target = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || '';
    const duration = 760;
    const delay = index * 120;
    const startAt = performance.now() + delay;

    const tick = (now) => {
      const progress = Math.max(0, Math.min(1, (now - startAt) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    counter.textContent = `0${suffix}`;
    requestAnimationFrame(tick);
  });
};

if (!reduceMotion) {
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters(entry.target);
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.example-funnel, .example-sources').forEach((card) => chartObserver.observe(card));
}

if (!reduceMotion) {
  const heroNetwork = document.querySelector('.hero-network');
  const heroCopy = document.querySelector('.hero-copy');
  let ticking = false;

  const updateParallax = () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    if (heroNetwork && window.innerWidth > 620) heroNetwork.style.transform = `translate3d(0, ${y * 0.065}px, 0) scale(1.035)`;
    if (heroCopy) heroCopy.style.transform = `translate3d(0, ${y * 0.035}px, 0)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

const progressBar = document.querySelector('#progressBar');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${Math.min(100, progress)}%`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
document.querySelector('#year').textContent = new Date().getFullYear();
