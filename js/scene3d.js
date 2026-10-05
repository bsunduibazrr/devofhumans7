/**
 * 3D WebGL Kinetic Sculpture: "EQUILIBRIUM" (Тэгш Хэм ба Оюун Санаа)
 * Designed with 30+ years aesthetic expertise: Swiss Minimalist & Kinetic Computational Art
 * Powered by Three.js
 */

class PresentationScene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found.`);
      return;
    }

    this.currentSlideIndex = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragRotation = { x: 0, y: 0 };
    this.dragVelocity = { x: 0, y: 0 };
    this.lastDragTime = 0;
    this.isUserInteracting = false;
    this.interactionTimeout = null;

    // 25 Cinematic slide transforms for the 3D Kinetic Monument
    this.slideTransforms = [
      // 01: Hero Center
      { camPos: { x: 0, y: 0, z: 5.6 }, sculpturePos: { x: 0, y: 0, z: 0 }, sculptureRot: { x: 0.15, y: 0, z: 0 }, expansion: 1.0, wireframeMode: false, speed: 0.004 },
      // 02: Why This Topic (Angle Right)
      { camPos: { x: 1.5, y: 0.3, z: 5.0 }, sculpturePos: { x: 1.1, y: 0.1, z: 0 }, sculptureRot: { x: 0.35, y: -0.5, z: 0.1 }, expansion: 1.15, wireframeMode: false, speed: 0.005 },
      // 03: Team of 6 (Angle Left)
      { camPos: { x: -1.6, y: -0.2, z: 4.8 }, sculpturePos: { x: -1.2, y: 0, z: 0 }, sculptureRot: { x: -0.2, y: 0.6, z: -0.1 }, expansion: 1.25, wireframeMode: false, speed: 0.005 },
      // 04: What is Human Development? (High Overhead)
      { camPos: { x: 1.6, y: 1.1, z: 4.7 }, sculpturePos: { x: 1.2, y: 0.3, z: 0 }, sculptureRot: { x: 0.6, y: -0.8, z: 0.2 }, expansion: 1.3, wireframeMode: false, speed: 0.006 },
      // 05: Sex vs Gender (Duality Separation)
      { camPos: { x: -1.7, y: 0.4, z: 4.5 }, sculpturePos: { x: -1.3, y: 0.1, z: 0 }, sculptureRot: { x: 0.4, y: 1.1, z: -0.3 }, expansion: 1.5, wireframeMode: false, speed: 0.006 },
      // 06: SDG 4 & 5 (Interlocking Horizon)
      { camPos: { x: 1.4, y: -0.5, z: 4.6 }, sculpturePos: { x: 1.1, y: -0.2, z: 0 }, sculptureRot: { x: -0.4, y: -0.7, z: 0.3 }, expansion: 1.2, wireframeMode: false, speed: 0.005 },
      // 07: Global 122M Girls (Isometric Overhead)
      { camPos: { x: -1.9, y: 1.4, z: 4.4 }, sculpturePos: { x: -1.3, y: 0.2, z: 0 }, sculptureRot: { x: 0.85, y: 0.9, z: -0.35 }, expansion: 1.35, wireframeMode: false, speed: 0.007 },
      // 08: Economic ROI (Core Focal Zoom)
      { camPos: { x: 1.5, y: 0.2, z: 4.2 }, sculpturePos: { x: 1.1, y: 0.0, z: 0 }, sculptureRot: { x: 0.2, y: 1.6, z: 0.1 }, expansion: 1.1, wireframeMode: false, speed: 0.007 },
      // 09: Global Boy Crisis (Tilted Orbit)
      { camPos: { x: -1.5, y: -0.7, z: 4.5 }, sculpturePos: { x: -1.1, y: -0.2, z: 0 }, sculptureRot: { x: -0.5, y: -1.2, z: 0.4 }, expansion: 1.25, wireframeMode: false, speed: 0.006 },
      // 10: Mongolia Reverse Gap (Dramatic Asymmetry)
      { camPos: { x: 1.8, y: -0.8, z: 4.3 }, sculpturePos: { x: 1.2, y: -0.2, z: 0 }, sculptureRot: { x: -0.7, y: 1.5, z: 0.6 }, expansion: 1.4, wireframeMode: false, speed: 0.007 },
      // 11: Rural Boys Drop Out (Low Angle Up)
      { camPos: { x: -1.6, y: -1.1, z: 4.4 }, sculpturePos: { x: -1.2, y: -0.3, z: 0 }, sculptureRot: { x: -0.8, y: 0.7, z: -0.2 }, expansion: 1.2, wireframeMode: false, speed: 0.005 },
      // 12: Glass Ceiling Paradox (High View Looking Down)
      { camPos: { x: 1.4, y: 1.5, z: 4.2 }, sculpturePos: { x: 1.0, y: 0.4, z: 0 }, sculptureRot: { x: 0.9, y: -0.9, z: 0.3 }, expansion: 1.35, wireframeMode: false, speed: 0.006 },
      // 13: Wage Gap 18.5% (Depth Offset)
      { camPos: { x: -1.5, y: 0.3, z: 4.5 }, sculpturePos: { x: -1.1, y: 0.1, z: 0 }, sculptureRot: { x: 0.3, y: 2.1, z: -0.2 }, expansion: 1.45, wireframeMode: false, speed: 0.006 },
      // 14: CS Student Perspective (Matrix Wireframe Entrance)
      { camPos: { x: 1.6, y: 0.4, z: 4.3 }, sculpturePos: { x: 1.2, y: 0.1, z: 0 }, sculptureRot: { x: 1.1, y: -1.1, z: 0.7 }, expansion: 1.5, wireframeMode: true, speed: 0.009 },
      // 15: AI Algorithmic Bias (Rapid Cybernetic Rotation)
      { camPos: { x: -1.6, y: -0.4, z: 4.0 }, sculpturePos: { x: -1.2, y: -0.1, z: 0 }, sculptureRot: { x: 1.4, y: 1.8, z: 0.5 }, expansion: 1.6, wireframeMode: true, speed: 0.011 },
      // 16: MUST Campus & Women in Tech (Warm Focus)
      { camPos: { x: 1.4, y: 0.1, z: 4.2 }, sculpturePos: { x: 1.0, y: 0.0, z: 0 }, sculptureRot: { x: 0.3, y: -1.4, z: 0.2 }, expansion: 1.2, wireframeMode: false, speed: 0.006 },
      // 17: History & Ada Lovelace (Astrolabe Dial Alignment)
      { camPos: { x: -1.4, y: 0.8, z: 4.4 }, sculpturePos: { x: -1.0, y: 0.2, z: 0 }, sculptureRot: { x: 0.6, y: 0.5, z: 0.8 }, expansion: 1.3, wireframeMode: false, speed: 0.005 },
      // 18: Myth 1 Math vs Language (Split Angle)
      { camPos: { x: 1.5, y: -0.4, z: 4.3 }, sculpturePos: { x: 1.1, y: -0.1, z: 0 }, sculptureRot: { x: -0.4, y: 1.2, z: -0.3 }, expansion: 1.35, wireframeMode: false, speed: 0.006 },
      // 19: Myth 2 Toxic Male Burden (Heavy Tilt)
      { camPos: { x: -1.5, y: -1.0, z: 4.4 }, sculpturePos: { x: -1.1, y: -0.3, z: 0 }, sculptureRot: { x: -0.7, y: -0.8, z: 0.4 }, expansion: 1.2, wireframeMode: false, speed: 0.005 },
      // 20: Myth 3 Not Anti-Men (Harmonizing)
      { camPos: { x: 1.3, y: 0.5, z: 4.6 }, sculpturePos: { x: 1.0, y: 0.1, z: 0 }, sculptureRot: { x: 0.2, y: 2.4, z: -0.1 }, expansion: 1.15, wireframeMode: false, speed: 0.005 },
      // 21: Solution 1 Rural Boys (Ascending Ring)
      { camPos: { x: -1.4, y: 0.3, z: 4.3 }, sculpturePos: { x: -1.0, y: 0.1, z: 0 }, sculptureRot: { x: 0.5, y: -1.3, z: 0.2 }, expansion: 1.25, wireframeMode: false, speed: 0.006 },
      // 22: Solution 2 Girls in STEM (Crystalline Core Illumination)
      { camPos: { x: 1.5, y: -0.2, z: 4.2 }, sculpturePos: { x: 1.1, y: 0.0, z: 0 }, sculptureRot: { x: -0.2, y: 0.9, z: 0.5 }, expansion: 1.3, wireframeMode: false, speed: 0.007 },
      // 23: Solution 3 Curriculum Revamp (Concentric Astrolabe)
      { camPos: { x: -1.3, y: 0.8, z: 4.4 }, sculpturePos: { x: -1.0, y: 0.2, z: 0 }, sculptureRot: { x: 0.7, y: -0.5, z: -0.4 }, expansion: 1.2, wireframeMode: false, speed: 0.005 },
      // 24: Epilogue: Two Wings of a Bird (Grand Soaring Symmetry)
      { camPos: { x: 0, y: 1.3, z: 4.6 }, sculpturePos: { x: 0, y: 0.3, z: 0 }, sculptureRot: { x: 0.4, y: 3.14, z: 0 }, expansion: 1.1, wireframeMode: false, speed: 0.004 },
      // 25: Gen-Z Finale / Celebration (Dynamic Jubilant Spin)
      { camPos: { x: 0, y: -0.5, z: 4.8 }, sculpturePos: { x: 0, y: -0.1, z: 0 }, sculptureRot: { x: -0.2, y: 4.5, z: 0.2 }, expansion: 1.45, wireframeMode: false, speed: 0.012 }
    ];

    this.currentTransform = JSON.parse(JSON.stringify(this.slideTransforms[0]));

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const width = this.container.clientWidth || window.innerWidth || 1200;
    const height = this.container.clientHeight || window.innerHeight || 800;
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.set(
      this.currentTransform.camPos.x,
      this.currentTransform.camPos.y,
      this.currentTransform.camPos.z
    );

    // 3. Renderer setup (Retina resolution, crisp antialiasing, alpha for paper white integration)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting setup: Museum / High-Fashion Editorial Studio
    this.setupLighting();

    // 5. Build the Kinetic 3D Monument
    this.buildSculpture();

    // 6. Build the Particle Constellation
    this.buildParticles();

    // 7. Event listeners
    this.bindEvents();

    // 8. Animation loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  setupLighting() {
    // Warm soft ambient fill to maintain editorial paper contrast
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Key Light: High directional soft light with clean specular highlights
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.keyLight.position.set(6, 9, 6);
    this.scene.add(this.keyLight);

    // Fill Light: Soft neutral side fill
    this.fillLight = new THREE.DirectionalLight(0xf4f4f5, 0.75);
    this.fillLight.position.set(-6, -2, 4);
    this.scene.add(this.fillLight);

    // Rim / Contour Light: Razor-sharp architectural edge backlight
    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    this.rimLight.position.set(0, -6, -5);
    this.scene.add(this.rimLight);

    // Subtle luminous focal point light inside the central core
    this.coreLight = new THREE.PointLight(0xffffff, 1.8, 12);
    this.coreLight.position.set(0, 0, 0);
    this.scene.add(this.coreLight);
  }

  buildSculpture() {
    this.sculptureGroup = new THREE.Group();
    this.scene.add(this.sculptureGroup);

    // Premium Materials: Polished Obsidian Graphite, Architectural Clay, Titanium Wireframe
    this.matObsidian = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      metalness: 0.45,
      roughness: 0.22,
      wireframe: false
    });

    this.matPaperClay = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      metalness: 0.2,
      roughness: 0.38
    });

    this.matWire = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    this.matAccentCore = new THREE.MeshStandardMaterial({
      color: 0x121216,
      metalness: 0.85,
      roughness: 0.12
    });

    // 1. Dual Gyro Ribbon Bands (The Gender Parity Interlocking Loops)
    // Primary Band A
    const torusGeomA = new THREE.TorusGeometry(1.6, 0.045, 32, 100);
    this.ringA = new THREE.Mesh(torusGeomA, this.matObsidian);
    this.ringA.rotation.x = Math.PI / 3;
    this.sculptureGroup.add(this.ringA);

    // Secondary Band B (Interlocking with A)
    const torusGeomB = new THREE.TorusGeometry(1.5, 0.04, 32, 100);
    this.ringB = new THREE.Mesh(torusGeomB, this.matPaperClay);
    this.ringB.rotation.y = Math.PI / 2.5;
    this.ringB.rotation.z = Math.PI / 4;
    this.sculptureGroup.add(this.ringB);

    // Tertiary Outer Astrolabe Horizon Ring
    const torusGeomC = new THREE.TorusGeometry(2.1, 0.015, 16, 120);
    this.ringC = new THREE.Mesh(torusGeomC, this.matWire);
    this.ringC.rotation.x = Math.PI / 2;
    this.sculptureGroup.add(this.ringC);

    // Astrolabe Tick marks around the horizon ring (representing HDI measurements)
    this.ticksGroup = new THREE.Group();
    const tickGeom = new THREE.BoxGeometry(0.015, 0.08, 0.015);
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const tick = new THREE.Mesh(tickGeom, this.matObsidian);
      tick.position.x = Math.cos(angle) * 2.1;
      tick.position.z = Math.sin(angle) * 2.1;
      tick.rotation.y = -angle;
      this.ticksGroup.add(tick);
    }
    this.sculptureGroup.add(this.ticksGroup);

    // 2. Central Polyhedral Core of Human Potential (Dual Icosahedron Prism)
    const coreGeom = new THREE.IcosahedronGeometry(0.68, 1);
    this.coreMesh = new THREE.Mesh(coreGeom, this.matAccentCore);
    this.sculptureGroup.add(this.coreMesh);

    // Inner wireframe prism cage
    const innerWireGeom = new THREE.IcosahedronGeometry(0.78, 1);
    this.coreWireMesh = new THREE.Mesh(innerWireGeom, this.matWire);
    this.sculptureGroup.add(this.coreWireMesh);

    // 3. Mathematical Orbit Knots (Delicate floating gyroscopic satellites)
    this.satellites = [];
    const satGeom = new THREE.OctahedronGeometry(0.09, 0);
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satGeom, this.matObsidian);
      this.sculptureGroup.add(sat);
      this.satellites.push({
        mesh: sat,
        orbitRadius: 1.8 + i * 0.25,
        speed: 0.8 + i * 0.4,
        angleOffset: (i * Math.PI) / 2
      });
    }
  }

  buildParticles() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical cloud around the sculpture
      const radius = 2.0 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = Math.random() * 0.03 + 0.015;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom circular points material
    const particleMat = new THREE.PointsMaterial({
      color: 0x18181b,
      size: 0.035,
      transparent: true,
      opacity: 0.45
    });

    this.particleCloud = new THREE.Points(geometry, particleMat);
    this.scene.add(this.particleCloud);
  }

  bindEvents() {
    // Resize handler
    window.addEventListener('resize', () => this.onResize());

    // Mouse movement / Parallax tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Interactive Drag to Rotate anywhere on 3D canvas
    this.container.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', () => this.onMouseUp());

    // Touch support for mobile / tablets
    this.container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
    window.addEventListener('touchend', () => this.onMouseUp());
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.isUserInteracting = true;
    this.dragStart.x = e.clientX;
    this.dragStart.y = e.clientY;
    this.lastDragTime = performance.now();
    clearTimeout(this.interactionTimeout);
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.isUserInteracting = true;
      this.dragStart.x = e.touches[0].clientX;
      this.dragStart.y = e.touches[0].clientY;
      clearTimeout(this.interactionTimeout);
    }
  }

  onMouseMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.dragStart.x;
    const deltaY = e.clientY - this.dragStart.y;

    this.dragRotation.y += deltaX * 0.006;
    this.dragRotation.x += deltaY * 0.006;

    this.dragVelocity.x = deltaX * 0.006;
    this.dragVelocity.y = deltaY * 0.006;

    this.dragStart.x = e.clientX;
    this.dragStart.y = e.clientY;
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - this.dragStart.x;
    const deltaY = e.touches[0].clientY - this.dragStart.y;

    this.dragRotation.y += deltaX * 0.006;
    this.dragRotation.x += deltaY * 0.006;

    this.dragStart.x = e.touches[0].clientX;
    this.dragStart.y = e.touches[0].clientY;
  }

  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      // After 2.5s of no interaction, smoothly ease back to the slide choreographic position
      this.interactionTimeout = setTimeout(() => {
        this.isUserInteracting = false;
      }, 2500);
    }
  }

  onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth || 1200;
    const height = this.container.clientHeight || window.innerHeight || 800;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Set target slide state (called when navigating slides or scrolling)
   */
  setSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= this.slideTransforms.length) return;
    this.currentSlideIndex = slideIndex;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();
    const targetTransform = this.slideTransforms[this.currentSlideIndex] || this.slideTransforms[0];

    // 1. Mouse parallax smoothing (Lerp)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Camera Choreography Interpolation (Smooth cinematic damping)
    const lerpSpeed = 0.045;
    this.currentTransform.camPos.x += (targetTransform.camPos.x - this.currentTransform.camPos.x) * lerpSpeed;
    this.currentTransform.camPos.y += (targetTransform.camPos.y - this.currentTransform.camPos.y) * lerpSpeed;
    this.currentTransform.camPos.z += (targetTransform.camPos.z - this.currentTransform.camPos.z) * lerpSpeed;

    this.camera.position.set(
      this.currentTransform.camPos.x + this.mouse.x * 0.25,
      this.currentTransform.camPos.y + this.mouse.y * 0.2,
      this.currentTransform.camPos.z
    );

    // Look at sculpture center with subtle parallax tilt
    this.camera.lookAt(
      targetTransform.sculpturePos.x,
      targetTransform.sculpturePos.y,
      targetTransform.sculpturePos.z
    );

    // 3. User Drag Momentum & Damping
    if (!this.isDragging) {
      this.dragRotation.x += this.dragVelocity.y;
      this.dragRotation.y += this.dragVelocity.x;
      this.dragVelocity.x *= 0.92;
      this.dragVelocity.y *= 0.92;

      // If user is no longer actively rotating, ease back drag offset to 0
      if (!this.isUserInteracting) {
        this.dragRotation.x *= 0.95;
        this.dragRotation.y *= 0.95;
      }
    }

    // 4. Sculpture Base Rotation & Kinetic Movement
    const rotSpeed = targetTransform.speed;
    this.ringA.rotation.x += rotSpeed * 1.2;
    this.ringA.rotation.y += rotSpeed * 0.8;

    this.ringB.rotation.y -= rotSpeed * 1.1;
    this.ringB.rotation.z += rotSpeed * 0.9;

    this.ringC.rotation.z += rotSpeed * 0.4;
    this.ticksGroup.rotation.y += rotSpeed * 0.4;

    // Central Core Pulse and Rotation
    const coreScale = 1.0 + Math.sin(time * 1.8) * 0.04;
    this.coreMesh.scale.set(coreScale, coreScale, coreScale);
    this.coreMesh.rotation.x = time * 0.25;
    this.coreMesh.rotation.y = time * 0.35;

    this.coreWireMesh.scale.set(coreScale * 1.12, coreScale * 1.12, coreScale * 1.12);
    this.coreWireMesh.rotation.x = -time * 0.2;
    this.coreWireMesh.rotation.y = -time * 0.3;

    // Smoothly apply wireframe transition for STEM / Tech slide
    if (targetTransform.wireframeMode) {
      this.matObsidian.wireframe = true;
      this.matPaperClay.wireframe = true;
      this.matAccentCore.wireframe = true;
    } else {
      this.matObsidian.wireframe = false;
      this.matPaperClay.wireframe = false;
      this.matAccentCore.wireframe = false;
    }

    // Smoothly scale ring expansion
    this.currentTransform.expansion += (targetTransform.expansion - this.currentTransform.expansion) * lerpSpeed;
    this.ringA.scale.set(this.currentTransform.expansion, this.currentTransform.expansion, this.currentTransform.expansion);
    this.ringB.scale.set(this.currentTransform.expansion * 0.95, this.currentTransform.expansion * 0.95, this.currentTransform.expansion * 0.95);

    // Orbiting Satellites
    for (let i = 0; i < this.satellites.length; i++) {
      const sat = this.satellites[i];
      const satAngle = time * sat.speed + sat.angleOffset;
      sat.mesh.position.x = Math.cos(satAngle) * sat.orbitRadius * this.currentTransform.expansion;
      sat.mesh.position.y = Math.sin(satAngle * 0.8) * 0.8;
      sat.mesh.position.z = Math.sin(satAngle) * sat.orbitRadius * this.currentTransform.expansion;
      sat.mesh.rotation.x = time * 1.5;
      sat.mesh.rotation.y = time * 2.0;
    }

    // Particle Cloud slow orbital drift
    if (this.particleCloud) {
      this.particleCloud.rotation.y = time * 0.05;
      this.particleCloud.rotation.x = Math.sin(time * 0.03) * 0.1;
    }

    // Apply User Drag + Slide orientation to sculpture group
    this.sculptureGroup.position.x += (targetTransform.sculpturePos.x - this.sculptureGroup.position.x) * lerpSpeed;
    this.sculptureGroup.position.y += (targetTransform.sculpturePos.y - this.sculptureGroup.position.y) * lerpSpeed;
    this.sculptureGroup.position.z += (targetTransform.sculpturePos.z - this.sculptureGroup.position.z) * lerpSpeed;

    this.sculptureGroup.rotation.x = targetTransform.sculptureRot.x + this.dragRotation.x;
    this.sculptureGroup.rotation.y = targetTransform.sculptureRot.y + this.dragRotation.y;
    this.sculptureGroup.rotation.z = targetTransform.sculptureRot.z;

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Make globally accessible
window.PresentationScene3D = PresentationScene3D;
// scene update
// lighting fix
// camera pos
// mesh color
// ambient light
// renderer fix
