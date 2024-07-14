let scene, camera, renderer, particleSystem;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  const color = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() * 2 - 1) * 1.5);
    positions.push((Math.random() * 2 - 1) * 1.5);
    positions.push((Math.random() * 2 - 1) * 1.5);

    color.setHSL(0.1, 0.9, 0.5);
    colors.push(color.r, color.g, color.b);
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += 0.02;
    if (positions[i + 1] > 1.5) {
      positions[i + 1] = -1.5;
    }
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();


