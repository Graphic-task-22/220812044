import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const zebra = new THREE.Group();

loader.load('/gltf/zebra.gltf', (gltf) => {
  console.log('斑马模型加载成功:', gltf);
  const model = gltf.scene;

  model.traverse((obj) => {
    if (obj.isMesh) {
      console.log('子网格:', obj.name);
      // 使用简单线框材质替换
      obj.material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
      });
    }
  });

  model.scale.set(1, 1, 1);
  model.position.set(1, 0, 0); // 和猪错开
  zebra.add(model);
}, undefined, (error) => {
  console.error('斑马加载失败:', error);
});

export default zebra;
