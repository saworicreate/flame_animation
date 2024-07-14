let scene, camera, renderer, particleSystem, clock;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('https://threejs.org/examples/textures/sprites/spark1.png', function(texture) {
    createParticles(texture);
    animate();
  }, undefined, function(err) {
    console.error('An error happened loading the texture:', err);
  });
}

function createParticles(texture) {
  const particleCount = 2000;
  const particles = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];
  const colors = [];
  const sizes = [];

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

    sizes.push(20 + Math.random() * 10);
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particles.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
  particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      pointTexture: { value: texture },
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
      }
    `,
    transparent: true,
    vertexColors: true,
  });

  particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
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
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();


