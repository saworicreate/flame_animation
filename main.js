export function init() {
  let scene, camera, renderer, box, fire, clock;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // ボックスを追加して、three.js の基本レンダリングが機能するか確認します
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  box = new THREE.Mesh(geometry, material);
  scene.add(box);

  const plane = new THREE.PlaneBufferGeometry(2, 2);

  fire = new window.Fire(plane, {
    textureWidth: 512,
    textureHeight: 512,
    debug: false
  });

  fire.position.set(0, 0, 0);
  scene.add(fire);

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    fire.update(delta);

    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
}
