import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./starField.js";

//renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//camera
const fov=75; //75 degrees (defines how narrow or wide the field of view is)
const aspect = w/h;
const near = 0.1; //anything closer to the camera than 0.1 units will not be visible
const far=1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

//scene
const scene = new THREE.Scene();

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
const stars = getStarfield({numStars: 5000});
console.log(stars);
scene.add(stars);

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader();
controls.enableDamping = true;
controls.dampingFactor = 0.03;
const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/8k_earth_daymap.webp"),
});
const mesh = new THREE.Mesh(geo, mat); // mesh is a container for the geometry and the material
earthGroup.add(mesh);
scene.add(earthGroup);
// adding a wiremat
// const wireMat = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     wireframe: true,
// })

// const wireMesh = new THREE.Mesh(geo, wireMat);
// wireMesh.scale.setScalar(1.001)
// mesh.add(wireMesh);

const sunLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(sunLight);

function animate(t = 0) {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.002;
    renderer.render(scene, camera);
    controls.update();
}
animate();