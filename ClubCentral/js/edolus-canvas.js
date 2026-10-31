/**
 * ClubCentral — edolus.com Authentic 3D WebGL Canvas & Neutral Sound Engine
 * Engineered with Three.js, GSAP & Web Audio API in Pitch-Black (#000000)
 */

(function initEdolusEngine() {
  // 1. Audio Synthesizer (Neutral Cinematic Ambient Sound)
  let audioCtx = null;
  let isSoundEnabled = false;
  let ambientGain = null;
  let ambientOsc1 = null;
  let ambientOsc2 = null;

  function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    ambientGain.connect(audioCtx.destination);

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);
    ambientOsc1.connect(ambientGain);

    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);
    ambientOsc2.connect(ambientGain);

    ambientOsc1.start();
    ambientOsc2.start();
  }

  window.playUiSound = function(type = 'hover') {
    if (!isSoundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.035);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'success') {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((f, idx) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + idx * 0.05);
        g.gain.setValueAtTime(0.025, now + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.5);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(now + idx * 0.05);
        o.stop(now + idx * 0.05 + 0.55);
      });
    }
  };

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundWaveIcon = document.getElementById('sound-wave-icon');
  const soundLabel = document.getElementById('sound-toggle-label');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (ambientGain) ambientGain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 0.5);
        if (soundLabel) soundLabel.textContent = 'AUDIO: ON';
        if (soundWaveIcon) soundWaveIcon.classList.add('playing');
        soundToggleBtn.classList.add('active');
        playUiSound('success');
      } else {
        if (ambientGain && audioCtx) {
          ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        }
        if (soundLabel) soundLabel.textContent = 'AUDIO: OFF';
        if (soundWaveIcon) soundWaveIcon.classList.remove('playing');
        soundToggleBtn.classList.remove('active');
      }
    });
  }

  // 2. Custom Magnetic Cursor
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  if (cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, .deck-card, .directory-card, .category-chip').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hovering');
        playUiSound('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hovering');
      });
      el.addEventListener('click', () => {
        playUiSound('click');
      });
    });
  }

  // 3. Three.js Neutral Monochrome Scene in #000000 Void
  const container = document.getElementById('threejs-viewport');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Full pure black
  scene.fog = new THREE.FogExp2(0x000000, 0.04);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 11);

  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    alpha: false,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Neutral Monochrome Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const whiteKeyLight = new THREE.PointLight(0xffffff, 1.8, 60);
  whiteKeyLight.position.set(6, 10, 10);
  scene.add(whiteKeyLight);

  const subtleRimLight = new THREE.PointLight(0xaaaaaa, 1.2, 50);
  subtleRimLight.position.set(-6, -8, -6);
  scene.add(subtleRimLight);

  // Group for Central Crest System
  const crestSystem = new THREE.Group();
  scene.add(crestSystem);

  // High-Resolution Neutral Vector Texture of the Official Christ Crest
  function createCrestTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Pitch Black Void Background
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(512, 512, 500, 0, Math.PI * 2);
    ctx.fill();

    // Crisp White / Platinum Rings
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#888888';
    ctx.beginPath();
    ctx.arc(512, 512, 470, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(512, 512, 440, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Outer Text Arches in Crisp White
    ctx.font = 'bold 36px Cinzel, serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textTop = "CHRIST (DEEMED TO BE UNIVERSITY)";
    drawArcText(ctx, textTop, 512, 512, 380, -Math.PI * 0.72, -Math.PI * 0.28);

    ctx.font = 'bold 30px Cinzel, serif';
    ctx.fillStyle = '#aaaaaa';
    const textBottom = "PUNE LAVASA CAMPUS • THE HUB OF ANALYTICS";
    drawArcText(ctx, textBottom, 512, 512, 385, Math.PI * 0.22, Math.PI * 0.78, true);

    // Central Shield
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(512, 260);
    ctx.bezierCurveTo(680, 260, 720, 290, 720, 410);
    ctx.bezierCurveTo(720, 620, 512, 730, 512, 730);
    ctx.bezierCurveTo(512, 730, 304, 620, 304, 410);
    ctx.bezierCurveTo(304, 290, 344, 260, 512, 260);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Star of Heaven
    drawStar(ctx, 512, 340, 6, 40, 15, '#ffffff');

    // Candle / Flame
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(512, 455, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(503, 475, 18, 38);

    // Open Book
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(512, 590);
    ctx.lineTo(430, 560);
    ctx.lineTo(430, 640);
    ctx.lineTo(512, 665);
    ctx.lineTo(594, 640);
    ctx.lineTo(594, 560);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Motto Ribbon: EXCELLENCE AND SERVICE
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(262, 780, 500, 54, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 26px Cinzel, serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("EXCELLENCE AND SERVICE", 512, 808);

    return new THREE.CanvasTexture(canvas);
  }

  function drawArcText(ctx, text, cx, cy, radius, startAngle, endAngle, inward = false) {
    const angleStep = (endAngle - startAngle) / (text.length - 1);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const angle = startAngle + i * angleStep;
      ctx.save();
      ctx.translate(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.rotate(angle + (inward ? -Math.PI / 2 : Math.PI / 2));
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // 1. Official Christ University White Logo Texture (User Upload)
  const textureLoader = new THREE.TextureLoader();
  const christLogoTexture = textureLoader.load('assets/christ-official-white-logo.png');
  christLogoTexture.minFilter = THREE.LinearFilter;
  christLogoTexture.magFilter = THREE.LinearFilter;

  // 3D Double-Sided Medallion / Plaque for the Official Christ Logo
  const logoAspect = 442 / 137;
  const plaqueWidth = 4.4;
  const plaqueHeight = plaqueWidth / logoAspect;
  const plaqueGeo = new THREE.PlaneGeometry(plaqueWidth, plaqueHeight);
  const plaqueMat = new THREE.MeshStandardMaterial({
    map: christLogoTexture,
    transparent: true,
    roughness: 0.15,
    metalness: 0.9,
    side: THREE.DoubleSide
  });

  const medallion = new THREE.Mesh(plaqueGeo, plaqueMat);
  medallion.position.set(0, 0, 0);
  crestSystem.add(medallion);

  // Delicate white circular ring framing the 3D logo
  const framingRingGeo = new THREE.TorusGeometry(2.5, 0.015, 16, 120);
  const framingRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.4, transparent: true });
  const framingRing = new THREE.Mesh(framingRingGeo, framingRingMat);
  crestSystem.add(framingRing);

  // Concentric Minimalist Orbital Wire Rings
  const ring1Geo = new THREE.TorusGeometry(3.6, 0.015, 16, 120);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.35, transparent: true });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.3;
  crestSystem.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(4.8, 0.01, 16, 120);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x888888, opacity: 0.25, transparent: true });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 3;
  ring2.rotation.x = Math.PI / 4;
  crestSystem.add(ring2);

  // 23 Orbital Club Satellites / Nodes
  const orbitalNodes = [];
  const nodeCount = 23;
  const nodeGroup = new THREE.Group();
  crestSystem.add(nodeGroup);

  for (let i = 0; i < nodeCount; i++) {
    const radius = 3.6 + (i % 3) * 1.2 + Math.random() * 0.4;
    const angle = (i / nodeCount) * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * 1.6;

    const nodeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

    nodeMesh.position.set(
      Math.cos(angle) * radius,
      elevation,
      Math.sin(angle) * radius
    );

    nodeGroup.add(nodeMesh);
    orbitalNodes.push({
      mesh: nodeMesh,
      angle: angle,
      radius: radius,
      speed: 0.002 + (i % 4) * 0.001,
      elevation: elevation
    });
  }

  // Minimal Monochrome Starfield
  const starGeo = new THREE.BufferGeometry();
  const starCount = 500;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 60;
    starPos[i + 1] = (Math.random() - 0.5) * 60;
    starPos[i + 2] = (Math.random() - 0.5) * 60;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Rotation Control
  let rotationSpeed = 0.004; // Slow default
  window.setCrestSpeed = function(mode) {
    if (mode === 'paused') {
      rotationSpeed = 0;
    } else if (mode === 'fast') {
      rotationSpeed = 0.015;
    } else {
      rotationSpeed = 0.004;
    }
  };

  // Render Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    medallion.rotation.y += rotationSpeed;
    framingRing.rotation.z += rotationSpeed * 0.5;
    ring1.rotation.z -= rotationSpeed * 0.6;
    ring2.rotation.x += rotationSpeed * 0.4;

    orbitalNodes.forEach(node => {
      node.angle += node.speed;
      node.mesh.position.x = Math.cos(node.angle) * node.radius;
      node.mesh.position.z = Math.sin(node.angle) * node.radius;
    });

    starField.rotation.y += 0.0002;

    if (window.scrollY < window.innerHeight) {
      camera.position.x += (-(mouseX / window.innerWidth - 0.5) * 1.5 - camera.position.x) * 0.05;
      camera.position.y += ((mouseY / window.innerHeight - 0.5) * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 4. GSAP & ScrollTrigger Scrollytelling
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(crestSystem.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to(crestSystem.position, {
      y: -3.5,
      z: -4,
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    const deckTrack = document.getElementById('deck-track');
    if (deckTrack) {
      const slides = gsap.utils.toArray('.deck-slide');
      gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: '#spotlight-pinned-section',
          pin: true,
          scrub: 1,
          snap: 1 / (slides.length - 1),
          end: () => '+=' + (deckTrack.offsetWidth * 1.5)
        }
      });
    }
  }

  // 5. Lenis Smooth Momentum Scroll
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
})();
