let scene, camera, renderer, fire;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const fireTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
  const fireMaterial = new THREE.Fire.FireMaterial({
    map: fireTexture,
    color: 0xff2200,
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  const fireGeometry = new THREE.PlaneBufferGeometry(2, 2);
  fire = new THREE.Fire(fireGeometry, {
    fireMaterial: fireMaterial,
    color1: new THREE.Color(0xffff00),
    color2: new THREE.Color(0xff0000),
    burnRate: 1,
    diffuse: 1,
    viscosity: 0.3,
    expansion: -0.2,
    swirl: 10,
    drag: 0.3,
    airSpeed: 0.6,
    speed: 0.6,
    massConservation: false
  });

  fire.position.set(0, 0, 0);
  scene.add(fire);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  fire.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();



