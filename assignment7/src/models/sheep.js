import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const sheep = new THREE.Group();
const loader = new GLTFLoader();
loader.load(
  '/gltf/Sheep.gltf',
  function (gltf) {
    sheep.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error('Sheep模型加载失败:', error);
  }
);
sheep.position.set(5, 0, 0);
export default sheep; 