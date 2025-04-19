import { LitElement, html, css } from 'lit';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.planeMesh = null;
    this.noise2D = createNoise2D();
  }

  firstUpdated() {
    this.init();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 100, 200);
    this.camera.lookAt(0, 0, 0);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0.2);
    
    // 将渲染器的 canvas 添加到 shadowRoot
    this.shadowRoot.appendChild(this.renderer.domElement);

    // 创建山脉地形
    this.createTerrain();

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // 添加平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // 添加事件监听
    window.addEventListener('resize', this.handleResize.bind(this));

    // 开始动画循环
    this.animate();
  }

  createTerrain() {
    const geometry = new THREE.PlaneGeometry(300, 300, 50, 60);
    
    // 创建颜色属性
    const colors = [];
    const positionAttr = geometry.attributes.position;

    for (let i = 0; i < positionAttr.count; i++) {
      const y = positionAttr.getY(i);
      const t = (y + 250) / 500;
      const r = 0.2 + 0.8 * t;
      const g = 0.5 + 0.5 * (1 - t);
      const b = 1.0 - 0.5 * t;

      colors.push(r, g, b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
    });

    this.planeMesh = new THREE.Mesh(geometry, material);
    this.planeMesh.rotateX(Math.PI / 2);
    this.scene.add(this.planeMesh);
  }

  updateTerrain() {
    if (!this.planeMesh) return;
    
    const positions = this.planeMesh.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      let z = this.noise2D(x/100, y/100) * 50;
      const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10;
      positions.setZ(i, z + sinNum);
    }
    positions.needsUpdate = true;
  }

  handleResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    if (!this.scene || !this.camera || !this.renderer) return;
    
    requestAnimationFrame(this.animate.bind(this));
    this.updateTerrain();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return html``;
  }
}

customElements.define('my-element', MyElement); 