import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const pig = new THREE.Group(); // 创建一个空的组

const loader = new GLTFLoader();
loader.load(
  '/gltf/pig.gltf', // 使用相对于public目录的路径
  function (gltf) {
    console.log('模型加载成功', gltf);

    pig.add(gltf.scene);

    // 遍历模型所有子对象
    gltf.scene.traverse(obj => {
      if (obj.isMesh) {
        console.log('mesh:', obj);

        if (obj.name === 'Cylinder') {
          obj.material.color.set(0xffb6c1);   // 设置为粉色
          obj.material.wireframe = true;      // 开启线框
        } else if (obj.name === 'Foot') {
          obj.material.color.set(0x0000ff);   // 设置为蓝色
        } else {
          obj.material.color.set(0x00ff00);   // 其它为绿色
        }
      }
    });
  },
  undefined,
  function (error) {
    console.error('模型加载失败:', error);
  }
);
pig.position.set(-5, 0, 0); // 将猪模型移动到左侧


export default pig;