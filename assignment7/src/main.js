import { scene, camera, renderer } from './environment.js';

import sheep from './models/sheep.js';
import pug from './models/pug.js';
import llama from './models/llama.js';
import horse from './models/horse.js';
import cow from './models/cow.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 调整相机位置
camera.position.set(0, 10, 30);
camera.lookAt(0, 0, 0);

// 添加模型
scene.add(sheep);
scene.add(pug);
scene.add(llama);
scene.add(horse);
scene.add(cow);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// 自适应窗口大小
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
