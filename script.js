const particlesContainer = document.getElementById('particles');
const scrollProgress = document.getElementById('scrollProgress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const createParticles = () => {
  if (!particlesContainer) {
    return;
  }

  const particleTotal = prefersReducedMotion ? 25 : 80;
  const matrixColors = [
    { hue: 120, color: '#00ff00' }, // Bright Green
    { hue: 140, color: '#00ff88' }, // Green-Cyan
    { hue: 100, color: '#88ff00' }, // Lime Green
    { hue: 160, color: '#00ff44' }  // Emerald
  ];

  for (let i = 0; i < particleTotal; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 8 + 1;
    const opacity = Math.random() * 0.8 + 0.3;
    const colorData = matrixColors[Math.floor(Math.random() * matrixColors.length)];
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${Math.random() * 12 + 10}s`;
    particle.style.background = `${colorData.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
    particle.style.boxShadow = `
      0 0 ${size * 3}px ${colorData.color},
      0 0 ${size * 6}px ${colorData.color}40
    `;

    if (prefersReducedMotion) {
      particle.style.animationDuration = `${Math.random() * 6 + 15}s`;
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

// Matrix rain efekti
const createMatrixRain = () => {
  const matrixContainer = document.getElementById('matrixRain');
  if (!matrixContainer || prefersReducedMotion) return;

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  
  const createMatrixChar = () => {
    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = chars[Math.floor(Math.random() * chars.length)];
    char.style.left = Math.random() * 100 + '%';
    char.style.animationDuration = (Math.random() * 3 + 5) + 's';
    char.style.animationDelay = Math.random() * 2 + 's';
    
    matrixContainer.appendChild(char);
    
    setTimeout(() => {
      if (char.parentNode) {
        char.parentNode.removeChild(char);
      }
    }, 8000);
  };

  setInterval(createMatrixChar, 200);
};

// Matrix renk değişimi
const createMatrixShift = () => {
  if (prefersReducedMotion) return;
  
  setInterval(() => {
    const time = Date.now() * 0.001;
    const hue1 = Math.sin(time * 0.5) * 20 + 120; // Yeşil civarı
    const hue2 = Math.sin(time * 0.3) * 25 + 140; // Yeşil-cyan civarı
    
    document.documentElement.style.setProperty('--dynamic-hue-1', `${hue1}deg`);
    document.documentElement.style.setProperty('--dynamic-hue-2', `${hue2}deg`);
  }, 50);
};

// Atmosfer katmanları için ekstra efekt
const enhanceAtmosphere = () => {
  const atmosphere = document.querySelector('.atmosphere');
  if (!atmosphere) return;

  // Dinamik parlaklık efekti
  setInterval(() => {
    const brightness = Math.sin(Date.now() * 0.0005) * 0.1 + 1;
    atmosphere.style.filter = `brightness(${brightness})`;
  }, 50);
};

// Matrix kart hover efektleri
const enhanceMatrixCards = () => {
  const cards = document.querySelectorAll('.video-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const matrixColors = ['#00ff00', '#00ff88', '#88ff00', '#00ff44'];
      const randomColor = matrixColors[Math.floor(Math.random() * matrixColors.length)];
      
      card.style.boxShadow = `
        0 25px 45px rgba(0, 255, 0, 0.4),
        0 0 50px ${randomColor},
        0 0 100px ${randomColor}40,
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `;
      card.style.transform = 'translateY(-15px) scale(1.03)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  });
};

// Matrix glitch efekti
const createMatrixGlitch = () => {
  if (prefersReducedMotion) return;
  
  const title = document.querySelector('.site-title');
  if (!title) return;
  
  setInterval(() => {
    if (Math.random() < 0.1) { // %10 şans
      title.style.textShadow = `
        2px 0 0 #00ff00,
        -2px 0 0 #00ff88,
        0 0 10px #00ff00,
        0 0 20px #00ff88
      `;
      title.style.transform = 'translateX(2px)';
      
      setTimeout(() => {
        title.style.textShadow = '';
        title.style.transform = '';
      }, 100);
    }
  }, 2000);
};

createParticles();
trackPointer();
initScrollProgress();
revealCards();
enableSmoothAnchors();
createMatrixRain();
createMatrixShift();
enhanceAtmosphere();
enhanceMatrixCards();
createMatrixGlitch();