import * as THREE from 'three';

export class Cat {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;
    this.createCat();
  }

  createCat() {
    // 身体（椭球体）
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xf5a623 })
    );
    body.scale.set(1, 0.8, 0.8);
    body.castShadow = true;
    this.group.add(body);

    // 头部
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xf5a623 })
    );
    head.position.set(0, 0.7, 0.3);
    head.castShadow = true;
    this.group.add(head);

    // 耳朵
    const earGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
    const earMaterial = new THREE.MeshPhongMaterial({ color: 0xf5a623 });

    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.3, 1.2, 0.3);
    leftEar.rotation.x = -0.2;
    leftEar.rotation.z = -0.2;
    leftEar.castShadow = true;
    this.group.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.3, 1.2, 0.3);
    rightEar.rotation.x = -0.2;
    rightEar.rotation.z = 0.2;
    rightEar.castShadow = true;
    this.group.add(rightEar);

    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.8, 0.8);
    this.group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.8, 0.8);
    this.group.add(rightEye);

    // 鼻子
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xff9999 })
    );
    nose.position.set(0, 0.7, 0.9);
    this.group.add(nose);

    // 尾巴（使用曲线）
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -0.8),
      new THREE.Vector3(0.2, 0.2, -1),
      new THREE.Vector3(0.4, 0.4, -1.2),
      new THREE.Vector3(0.6, 0.6, -1.4)
    ]);

    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.1, 8, false);
    const tail = new THREE.Mesh(
      tailGeometry,
      new THREE.MeshPhongMaterial({ color: 0xf5a623 })
    );
    tail.castShadow = true;
    this.group.add(tail);
  }

  update() {
    // 简单的摆动动画
    this.group.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    this.group.position.y = Math.sin(Date.now() * 0.002) * 0.1;
  }
} 