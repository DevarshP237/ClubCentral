/**
 * ClubCentral — Floema-Style 3D Spatial Canvas
 * Features:
 * 1. 3D White Christ University Official Logo rotating in slow speed
 * 2. 16 floating spatial cards scattered in 3D depth (Floema.com signature)
 * 3. Mouse parallax & Scroll-driven depth transitions
 */

(function initFloema3D() {
  const canvas = document.getElementById('floema-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Full pitch black
  scene.fog = new THREE.FogExp2(0x000000, 0.045);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: false,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Minimal Monochrome Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const frontLight = new THREE.DirectionalLight(0xffffff, 1.4);
  frontLight.position.set(0, 5, 10);
  scene.add(frontLight);

  const backRimLight = new THREE.PointLight(0xffffff, 0.8, 30);
  backRimLight.position.set(0, -4, -4);
  scene.add(backRimLight);

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. 3D Official Christ University White Logo in Center
  const textureLoader = new THREE.TextureLoader();
  const christLogoTexture = textureLoader.load('assets/christ-official-white-logo.png');

  // Double-sided 3D Medallion for the Christ Logo
  const logoAspect = 900 / 300; // Aspect ratio of official banner
  const logoGeo = new THREE.PlaneGeometry(3.6, 3.6 / logoAspect);
  const logoMat = new THREE.MeshStandardMaterial({
    map: christLogoTexture,
    transparent: true,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide
  });

  const christLogoMesh = new THREE.Mesh(logoGeo, logoMat);
  christLogoMesh.position.set(0, 0.2, 0);
  mainGroup.add(christLogoMesh);

  // Delicate white circular ring around the 3D logo
  const ringGeo = new THREE.TorusGeometry(2.2, 0.012, 16, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.35, transparent: true });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2.2;
  mainGroup.add(ringMesh);

  // 2. Floema Scattered Floating Spatial Cards (representing clubs around the center)
  const floatingCardsGroup = new THREE.Group();
  mainGroup.add(floatingCardsGroup);

  const sampleLogos = [
    'assets/logos/2.png',  // Trekkers
    'assets/logos/20.png', // Esports
    'assets/logos/22.png', // Pika Play
    'assets/logos/6.png',  // Inclusiverse
    'assets/logos/4.png',  // Art & Creative
    'assets/logos/10.png', // Film
    'assets/logos/15.png', // Music
    'assets/logos/16.png', // Equestrian
    'assets/logos/14.png', // Running
    'assets/logos/19.png', // Photography
    'assets/logos/11.png', // Quest Reach
    'assets/logos/13.png', // Speaksphere
    'assets/logos/5.png',  // Rotaract
    'assets/logos/7.png',  // Yoga
    'assets/logos/1.png',  // Under 25
    'assets/logos/18.png'  // Nature
  ];

  const floatingCards = [];
  const cardCount = sampleLogos.length;

  for (let i = 0; i < cardCount; i++) {
    const cardTex = textureLoader.load(sampleLogos[i]);
    const cGeo = new THREE.PlaneGeometry(0.85, 0.85);
    const cMat = new THREE.MeshBasicMaterial({
      map: cardTex,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    const cMesh = new THREE.Mesh(cGeo, cMat);

    // Scatter in a hollow elliptical cylinder around the center text (like floema.com)
    const angle = (i / cardCount) * Math.PI * 2;
    const radiusX = 4.2 + (i % 3) * 1.0;
    const radiusY = 2.4 + (i % 2) * 0.8;
    const zPos = (Math.random() - 0.5) * 4 - 0.5;

    cMesh.position.set(
      Math.cos(angle) * radiusX,
      Math.sin(angle) * radiusY,
      zPos
    );

    // Subtle natural tilt
    cMesh.rotation.z = (Math.random() - 0.5) * 0.3;
    cMesh.rotation.y = (Math.random() - 0.5) * 0.2;

    floatingCardsGroup.add(cMesh);

    floatingCards.push({
      mesh: cMesh,
      baseX: cMesh.position.x,
      baseY: cMesh.position.y,
      baseZ: cMesh.position.z,
      floatSpeed: 0.001 + Math.random() * 0.0015,
      rotSpeed: (Math.random() - 0.5) * 0.002
    });
  }

  // 3. Mouse Parallax Reaction
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // 4. Render & Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Slow 3D Rotation of the White Christ Logo
    christLogoMesh.rotation.y = Math.sin(time * 0.3) * 0.25;
    christLogoMesh.rotation.x = Math.cos(time * 0.2) * 0.1;
    ringMesh.rotation.z += 0.003;

    // Floating cards gentle wave oscillation
    floatingCards.forEach((c, idx) => {
      c.mesh.position.y = c.baseY + Math.sin(time * 1.2 + idx) * 0.12;
      c.mesh.position.x = c.baseX + Math.cos(time * 0.8 + idx) * 0.08;
      c.mesh.rotation.z += c.rotSpeed;
    });

    // Camera responds smoothly to mouse
    if (window.scrollY < window.innerHeight * 1.5) {
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }
  animate();

  // Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 5. Scroll-driven 3D expansion (upon scrolling, cards fly outward & down)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(floatingCardsGroup.position, {
      z: 5,
      y: -6,
      opacity: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    gsap.to(christLogoMesh.position, {
      y: -2.5,
      z: -3,
      scale: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }
})();
