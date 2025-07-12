import * as THREE from 'three';

/* Setup Three.js scene */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(200, 200);
camera.aspect = 1;
camera.updateProjectionMatrix();
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.bottom = '20px';
renderer.domElement.style.right = '20px';
renderer.domElement.style.zIndex = '1000'; // Ensure it's clickable
document.body.appendChild(renderer.domElement);

/* Create spinning cube */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff6600, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 3;

/* Animate the cube */
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

/* Background switching */
let currentBoard = 1;
function switchBoard() {
  currentBoard = currentBoard === 1 ? 2 : 1;
  document.body.style.backgroundImage = `url('./board${currentBoard}.png')`;
}

/* Toggle background on cube click */
renderer.domElement.addEventListener('click', switchBoard);
