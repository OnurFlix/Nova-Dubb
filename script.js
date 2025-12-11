// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initCursor();
  initAnimations();
  initGlitchEffect();
});


function initThreeJS() {
  const canvas = document.getElementById('webgl-canvas');
  const scene = new THREE.Scene();
  // Fog for depth
  scene.fog = new THREE.FogExp2(0x000000, 0.001);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create Stars
  const starGeo = new THREE.BufferGeometry();
  const starCount = 6000;
  const positions = new Float32Array(starCount * 3);
  const velocities = [];

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 600; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600; // z
    velocities.push(0);
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0x39ff14, // Neon Lime
    size: 0.7,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  // Animation Loop
  let speed = 0;
  let targetSpeed = 2;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;

    // Increase speed on mouse move slightly
    targetSpeed = 4;
    clearTimeout(window.speedTimeout);
    window.speedTimeout = setTimeout(() => { targetSpeed = 2; }, 500);
  });

  function animate() {
    // Smooth acceleration
    speed += (targetSpeed - speed) * 0.1;

    const positions = starGeo.attributes.position.array;

    for (let i = 0; i < starCount; i++) {
      // Move stars towards camera (which is looking down Y in this setup, effectively)
      // Actually let's just move them in Y direction to simulate forward movement
      positions[i * 3 + 1] -= speed;

      // Reset if behind camera
      if (positions[i * 3 + 1] < -200) {
        positions[i * 3 + 1] = 200;
        positions[i * 3] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      }
    }

    starGeo.attributes.position.needsUpdate = true;

    // Camera rotation based on mouse
    targetRotationX += (mouseY - targetRotationX) * 0.05;
    targetRotationY += (mouseX - targetRotationY) * 0.05;

    stars.rotation.x = targetRotationX;
    stars.rotation.y = targetRotationY;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


function initCursor() {
  const cursor = document.querySelector('.cursor-follower');

  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  });

  // Hover effects
  const clickables = document.querySelectorAll('a, button, .video-card');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}


function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Animations
  const tl = gsap.timeline();

  tl.from('.logo', {
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: 'elastic.out(1, 0.3)'
  })
    .from('.site-title', {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    }, '-=1')
    .from('.subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, '-=0.5')
    .from('.description', {
      y: 30,
      opacity: 0,
      duration: 0.8
    }, '-=0.6');

  // Scroll Animations for Video Cards
  gsap.utils.toArray('.video-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      rotationX: 45,
      duration: 0.8,
      delay: i * 0.1, // Stagger effect
      ease: 'power3.out'
    });

    // 3D Tilt Effect on Hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}


function initGlitchEffect() {
  const title = document.querySelector('.site-title');
  if (title) {
    title.setAttribute('data-text', title.innerText);
    title.classList.add('glitch-text');
  }

  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(t => {
    t.setAttribute('data-text', t.innerText);
    t.addEventListener('mouseenter', () => t.classList.add('glitch-text'));
    t.addEventListener('mouseleave', () => t.classList.remove('glitch-text'));
  });
}