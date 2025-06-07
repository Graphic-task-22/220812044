import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const cow = new THREE.Group();
const loader = new GLTFLoader();
loader.load(
  '/gltf/Cow.gltf',
  function (gltf) {
    cow.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error('Cow模型加载失败:', error);
  }
);
cow.position.set(25, 0, 0);
export default cow; 