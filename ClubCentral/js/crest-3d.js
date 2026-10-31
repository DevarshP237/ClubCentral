/**
 * ClubCentral — 3D Crest Animation & Interactive Starfield Canvas
 */

(function initCrestAndCanvas() {
  // Canvas particle starfield
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 65;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? '#d4af37' : '#38bdf8'
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // Crest rotation speed controller
  const crestBox = document.getElementById('hero-crest-box');
  const speedButtons = document.querySelectorAll('.crest-control-btn');

  if (crestBox && speedButtons.length) {
    speedButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const speed = btn.getAttribute('data-speed');
        crestBox.classList.remove('paused', 'fast');

        if (speed === 'paused') {
          crestBox.classList.add('paused');
        } else if (speed === 'fast') {
          crestBox.classList.add('fast');
        } // 'slow' is default
      });
    });

    // Gentle 3D tilt on mouse hover
    const container = document.querySelector('.hero-crest-container');
    if (container) {
      container.addEventListener('mousemove', (e) => {
        if (crestBox.classList.contains('paused')) {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          crestBox.style.transform = `rotateY(${x * 0.15}deg) rotateX(${-y * 0.15}deg)`;
        }
      });

      container.addEventListener('mouseleave', () => {
        if (crestBox.classList.contains('paused')) {
          crestBox.style.transform = `rotateY(0deg) rotateX(0deg)`;
        }
      });
    }
  }

  // Scroll animations observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, can unobserve
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
})();
