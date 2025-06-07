import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const llama = new THREE.Group();
const loader = new GLTFLoader();
loader.load(
  '/gltf/Llama.gltf',
  function (gltf) {
    llama.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error('Llama模型加载失败:', error);
  }
);
llama.position.set(15, 0, 0);
export default llama; 