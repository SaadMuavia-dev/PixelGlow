/* PixelGlow — Three.js animated 3D hero background */
(function () {
  try {
    const mount = document.getElementById("hero");
    if (!mount || typeof THREE === "undefined") return;

    const isSmall = window.innerWidth < 768;
    const canvas = document.createElement("canvas");
    canvas.id = "hero3d-canvas";
    mount.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.z = 9;

  function size() {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  size();
  window.addEventListener("resize", size);

  // Neon wireframe shapes
  const neonColors = [0x4c7bff, 0xb347ff, 0x00e5ff];
  const shapes = [];
  const geoPool = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.8, 0.25, 8, 24),
  ];
  const shapeCount = isSmall ? 4 : 8;
  for (let i = 0; i < shapeCount; i++) {
    const geo = geoPool[i % geoPool.length];
    const mat = new THREE.MeshBasicMaterial({
      color: neonColors[i % neonColors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(0.5 + Math.random() * 0.9);
    mesh.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6 - 2
    );
    mesh.userData.spin = {
      x: (Math.random() - 0.5) * 0.006,
      y: (Math.random() - 0.5) * 0.006,
    };
    mesh.userData.float = {
      amp: 0.4 + Math.random() * 0.6,
      speed: 0.4 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Particle field
  const particleCount = isSmall ? 120 : 300;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x8fd3ff,
    size: 0.045,
    transparent: true,
    opacity: 0.7,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    shapes.forEach((m) => {
      m.rotation.x += m.userData.spin.x;
      m.rotation.y += m.userData.spin.y;
      m.position.y += Math.sin(t * m.userData.float.speed + m.userData.float.offset) * 0.002;
    });
    particles.rotation.y = t * 0.015;
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  // Pause when hero not visible (perf)
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!raf) animate();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    },
    { threshold: 0.05 }
  );
  obs.observe(mount);
  } catch (err) {
    console.warn("PixelGlow hero3d: 3D background skipped —", err);
  }
})();
