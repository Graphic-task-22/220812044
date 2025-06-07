import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const horse = new THREE.Group();
const loader = new GLTFLoader();
loader.load(
  '/gltf/Horse.gltf',
  function (gltf) {
    horse.add(gltf.scene);
    gltf.scene.traverse(obj => {
      if (obj.isMesh) {
        obj.material.color.set(0xffb6c1); // 设置为粉色
        obj.material.wireframe = true; // 开启线框
      }
    });
  },
  undefined,
  function (error) {
    console.error('Horse模型加载失败:', error);
  }
);
horse.position.set(20, 0, 0);
export default horse; 