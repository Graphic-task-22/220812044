import * as THREE from 'three';
import { setupScene } from './scene.js';
import createHouse from './house.js';

// 创建 canvas 挂载到页面
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 设置场景
const { scene, camera, renderer, controls } = setupScene(canvas);

// 添加多个不同样式的房子
const houses = [
  createHouse({ baseColor: 0xffe4b5, roofColor: 0x8b0000, baseSize: [20, 10, 20], roofHeight: 8, roofRadius: 18, hasChimney: true }),
  createHouse({ baseColor: 0xadd8e6, roofColor: 0x4682b4, baseSize: [16, 12, 16], roofHeight: 10, roofRadius: 14, hasChimney: false }),
  createHouse({ baseColor: 0x90ee90, roofColor: 0xffa500, baseSize: [24, 8, 18], roofHeight: 7, roofRadius: 20, hasChimney: true, chimneyColor: 0x333333 }),
  createHouse({ baseColor: 0xffffff, roofColor: 0x00008b, baseSize: [22, 9, 15], roofHeight: 6, roofRadius: 16, hasChimney: false })
];

const positions = [
  [0, 0, 0],
  [35, 0, 0],
  [-35, 0, 0],
  [0, 0, 35],
  [0, 0, -35]
];

houses.forEach((house, i) => {
  house.position.set(...positions[i]);
  scene.add(house);
});

// 添加城堡
function createCastle() {
  const group = new THREE.Group();
  // 第一层主体
  const base1 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 10, 40),
    new THREE.MeshLambertMaterial({ color: 0xffb6c1 }) // 粉红色
  );
  base1.position.y = 5;
  group.add(base1);

  // 第二层主体
  const base2 = new THREE.Mesh(
    new THREE.BoxGeometry(32, 8, 32),
    new THREE.MeshLambertMaterial({ color: 0xffc0cb }) // 浅粉色
  );
  base2.position.y = 10 + 4;
  group.add(base2);

  // 第三层主体
  const base3 = new THREE.Mesh(
    new THREE.BoxGeometry(24, 6, 24),
    new THREE.MeshLambertMaterial({ color: 0xffb6c1 }) // 粉红色
  );
  base3.position.y = 18 + 3;
  group.add(base3);

  // 第四层主体
  const base4 = new THREE.Mesh(
    new THREE.BoxGeometry(16, 4, 16),
    new THREE.MeshLambertMaterial({ color: 0xffc0cb }) // 浅粉色
  );
  base4.position.y = 24 + 2;
  group.add(base4);

  // 上层城垛
  for (let i = -8; i <= 8; i += 4) {
    for (let j = -8; j <= 8; j += 4) {
      if (Math.abs(i) === 8 || Math.abs(j) === 8) {
        const battlement = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshLambertMaterial({ color: 0xffb6c1 }) // 粉红色
        );
        battlement.position.set(i, 28 + 1, j);
        group.add(battlement);
      }
    }
  }

  // 大门
  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(8, 12, 2),
    new THREE.MeshLambertMaterial({ color: 0xff69b4 }) // 深芭比粉
  );
  gate.position.set(0, 6, 21);
  group.add(gate);

  // 四角塔楼
  const towerGeo = new THREE.CylinderGeometry(4, 4, 28, 32);
  const towerMat = new THREE.MeshLambertMaterial({ color: 0xffb6c1 }); // 粉红色
  const towerPositions = [
    [18, 14, 18],
    [-18, 14, 18],
    [18, 14, -18],
    [-18, 14, -18]
  ];
  towerPositions.forEach(pos => {
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(...pos);
    group.add(tower);
    // 塔顶
    const top = new THREE.Mesh(
      new THREE.ConeGeometry(5, 6, 32),
      new THREE.MeshLambertMaterial({ color: 0xff69b4 }) // 深芭比粉
    );
    top.position.set(pos[0], pos[1] + 17, pos[2]);
    group.add(top);
    // 旗帜
    const flagPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 8, 8),
      new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    );
    flagPole.position.set(pos[0], pos[1] + 23, pos[2]);
    group.add(flagPole);
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(3, 2, 0.2),
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    flag.position.set(pos[0] + 2, pos[1] + 25, pos[2]);
    group.add(flag);
  });

  return group;
}

const castle = createCastle();
castle.position.set(0, 0, -80);
scene.add(castle);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 更新控制器
  renderer.render(scene, camera);
}

animate();
