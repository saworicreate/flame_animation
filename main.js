let scene, camera, renderer, clock, particleSystem, stats;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  const particleCount = 5000;
  const particles = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];
  const colors = [];

  const color = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() * 2 - 1) * 0.5);
    positions.push(Math.random() * 0.5);
    positions.push((Math.random() * 2 - 1) * 0.5);

    velocities.push(0);
    velocities.push(Math.random() * 0.1 + 0.05);
    velocities.push(0);

    color.setHSL(0.1 + Math.random() * 0.2, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particles.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
  particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      varying float life;

      void main() {
        vColor = customColor;
        life = mod((time + position.y) / 3.0, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float life;

      void main() {
        float alpha = 1.0 - life;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    vertexColors: true,
  });

  particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  const positions = particleSystem.geometry.attributes.position.array;
  const velocities = particleSystem.geometry.attributes.velocity.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += velocities[i + 1] * delta;
    if (positions[i + 1] > 2.0) {
      positions[i + 1] = 0.0;
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.material.uniforms.time.value = time;

  renderer.render(scene, camera);
  stats.update();
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();




