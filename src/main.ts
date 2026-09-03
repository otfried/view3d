import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function requireElement<T extends HTMLElement>(id: string, type: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof type)) {
    throw new Error(`Missing or wrong-typed element #${id}`);
  }
  return el;
}

const canvas = requireElement('canvas', HTMLCanvasElement);
const statusEl = requireElement('status', HTMLParagraphElement);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
// scene.fog = new THREE.Fog(0x1a1a1a, 1000, 10000);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);
camera.position.set(0, 50, 100);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 30);
directionalLight.position.set(0, 500, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.far = 10000;
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.dampingFactor = 0.05;
controls.autoRotate = false;

let currentModel: THREE.Group | null = null;

function loadModel(path: string): void {
  updateStatus('Loading model...');

  const loader = new GLTFLoader();

  loader.load(
    path,
    (gltf) => {
      if (currentModel !== null) {
        scene.remove(currentModel);
      }
      currentModel = gltf.scene;
      scene.add(currentModel);

      // Enable shadows for all meshes
      currentModel.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      fitCameraToObject(currentModel);

      updateStatus('Model loaded successfully');
    },
    (progress) => {
      if (progress.total > 0) {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        updateStatus(`Loading... ${percent}%`);
      }
    },
    (error) => {
      console.error('Error loading model:', error);
      const message = error instanceof Error ? error.message : String(error);
      updateStatus(`Error loading model: ${message}`);
    }
  );
}

function fitCameraToObject(object: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  cameraZ *= 1.5;

  camera.position.copy(center);
  camera.position.z += cameraZ;

  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}

function updateStatus(text: string): void {
  statusEl.textContent = text;
}

function onWindowResize(): void {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate(): void {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize);
animate();
updateStatus('Ready.');

// Load the model given by the `load` query parameter, if present.
const loadParam = new URLSearchParams(window.location.search).get('load');
if (loadParam != null)
  loadModel(loadParam);
else
  updateStatus('No model loaded.');
