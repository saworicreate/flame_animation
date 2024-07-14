let scene, camera, renderer, particleSystem, clock;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  const particleCount = 2000;
  const particles = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];

  const color = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() * 2 - 1) * 1.5);
    positions.push((Math.random() * 2 - 1) * 1.5);
    positions.push((Math.random() * 2 - 1) * 1.5);

    color.setHSL(0.1, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);

    sizes.push(Math.random() * 0.5);
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthTest: false
  });

  particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  const positions = particleSystem.geometry.attributes.position.array;
  const sizes = particleSystem.geometry.attributes.size.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += 0.02; // 上昇
    if (positions[i + 1] > 1.5) {
      positions[i + 1] = -1.5; // 下に戻す
    }
    sizes[i / 3] = (Math.sin(time * 5 + i) + 1) * 0.5; // サイズを変化させる
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();



