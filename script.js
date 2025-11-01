const particlesContainer = document.getElementById('particles');
const scrollProgress = document.getElementById('scrollProgress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const createParticles = () => {
  if (!particlesContainer) {
    return;
  }

  const particleTotal = prefersReducedMotion ? 15 : 40;

  for (let i = 0; i < particleTotal; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 8 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${Math.random() * 12 + 16}s`;

    if (prefersReducedMotion) {
      particle.style.animationDuration = `${Math.random() * 6 + 20}s`;
    }

    particlesContainer.appendChild(particle);
  }
};

const trackPointer = () => {
  const body = document.body;
  if (!body) {
    return;
  }

  const updatePointer = (event) => {
    const x = `${(event.clientX / window.innerWidth) * 100}%`;
    const y = `${(event.clientY / window.innerHeight) * 100}%`;
    body.style.setProperty('--pointerX', x);
    body.style.setProperty('--pointerY', y);
  };

  window.addEventListener('mousemove', updatePointer);
};

const initScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const maxScroll = () => {
    const doc = document.documentElement;
    return doc.scrollHeight - doc.clientHeight;
  };

  const updateProgress = () => {
    const total = maxScroll();
    if (total <= 0) {
      scrollProgress.style.transform = 'scaleX(0)';
      return;
    }

    const progress = window.scrollY / total;
    scrollProgress.style.transform = `scaleX(${progress})`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
};

const revealCards = () => {
  const cards = document.querySelectorAll('.video-card');
  if (!cards.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -80px 0px'
    }
  );

  cards.forEach((card, index) => {
    card.style.transitionDelay = prefersReducedMotion ? '0s' : `${index * 0.05}s`;
    observer.observe(card);
  });
};

const enableSmoothAnchors = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetSelector = anchor.getAttribute('href');
      if (!targetSelector || targetSelector.length <= 1) {
        return;
      }

      const target = document.querySelector(targetSelector);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });
};

createParticles();
trackPointer();
initScrollProgress();
revealCards();
enableSmoothAnchors();