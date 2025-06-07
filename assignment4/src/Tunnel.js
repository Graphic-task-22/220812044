import * as THREE from 'three';

export class Tunnel {
  constructor(texture) {
    this.group = new THREE.Group();
    this.texture = texture;
    this.createTunnel();
  }

  createTunnel() {
    // 创建控制点
    const points = [];
    const segments = 64; // 增加分段数
    const amplitude = 30;
    const frequency = 0.5;

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 8; // 增加曲线长度到8π
      const x = t * 10;
      const y = Math.sin(t * frequency) * amplitude;
      const z = Math.cos(t * frequency) * amplitude;
      points.push(new THREE.Vector3(x, y, z));
    }

    // 创建曲线
    const curve = new THREE.CatmullRomCurve3(points);
    curve.closed = false;

    // 创建管道几何体
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      200,
      3,
      64,
      false
    );

    // 创建材质
    const material = new THREE.MeshPhongMaterial({
      map: this.texture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.8
    });

    // 创建管道网格
    this.tubeMesh = new THREE.Mesh(tubeGeometry, material);
    this.group.add(this.tubeMesh);
  }

  getPositionAt(t) {
    return this.tubeMesh.geometry.parameters.path.getPointAt(t);
  }

  update() {
    // 更新纹理偏移
    this.tubeMesh.material.map.offset.x += 0.01;
  }
} 