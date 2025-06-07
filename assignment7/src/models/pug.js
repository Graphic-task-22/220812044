import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const pug = new THREE.Group();
const loader = new GLTFLoader();
loader.load(
  '/gltf/Pug.gltf',
  function (gltf) {
    pug.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error('Pug模型加载失败:', error);
  }
);
pug.position.set(10, 0, 0);
export default pug; 