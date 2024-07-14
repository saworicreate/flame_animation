let scene, camera, renderer, fireMesh;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a plane geometry for the fire
  const plane = new THREE.PlaneGeometry(3, 3);
  
  // Load fire texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('https://threejs.org/examples/textures/sprites/fire_particle.png', function(texture) {
    // Create fire material
    const fireMaterial = new THREE.Fire(texture);

    // Create fire mesh
    fireMesh = new THREE.Mesh(plane, fireMaterial);
    fireMesh.position.set(0, 0, 0);
    scene.add(fireMesh);

    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);

  // Update the fire effect
  fireMesh.material.update();

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();

