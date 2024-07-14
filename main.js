let scene, camera, renderer, flame;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    'flame_texture.png',
    function (texture) {
      const flameMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      flame = new THREE.Sprite(flameMaterial);
      flame.scale.set(2, 3, 1);
      scene.add(flame);

      animate();
    },
    undefined,
    function (err) {
      console.error('An error happened.');
      console.error(err);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);

  if (flame) {
    flame.material.rotation += 0.01;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();

