let scene, camera, renderer, fireMesh, clock;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // Create a plane geometry for the fire
  const plane = new THREE.PlaneGeometry(3, 3);
  
  // Load fire texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('https://threejs.org/examples/textures/sprites/spark1.png', function(texture) {
    // Create fire material
    const fireMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: texture },
        time: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;
          uv.y += time * 0.1;
          vec4 tex = texture2D(texture, uv);
          gl_FragColor = tex;
        }
      `,
      transparent: true
    });

    // Create fire mesh
    fireMesh = new THREE.Mesh(plane, fireMaterial);
    fireMesh.position.set(0, 0, 0);
    scene.add(fireMesh);

    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  fireMesh.material.uniforms.time.value += delta;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();
