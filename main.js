let scene, camera, renderer, fire, clock;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  const plane = new THREE.PlaneBufferGeometry(2, 2);

  fire = new THREE.Fire(plane, {
    textureWidth: 512,
    textureHeight: 512,
    debug: false
  });

  fire.position.set(0, 0, 0);
  scene.add(fire);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  fire.update(delta);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();
