import { LitElement, html, css } from 'lit';
import * as THREE from 'three';
import { Cat } from './Cat.js';
import { Tunnel } from './Tunnel.js';

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
    this.cat = null;
    this.tunnel = null;
    this.tunnelTexture = null;
    this.cameraOffset = new THREE.Vector3(0, 0, 0);
    this.catPosition = 0;
    this.speed = 0.002;
    this.rotationAngle = 0;
    this.cameraRotation = 0;
  }

  firstUpdated() {
    this.init();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(0, 0, 1);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    
    // 将渲染器的 canvas 添加到 shadowRoot
    this.shadowRoot.appendChild(this.renderer.domElement);

    // 加载纹理
    const textureLoader = new THREE.TextureLoader();
    this.tunnelTexture = textureLoader.load('./Star texture.jpg');
    this.tunnelTexture.wrapS = THREE.RepeatWrapping;
    this.tunnelTexture.wrapT = THREE.RepeatWrapping;
    this.tunnelTexture.repeat.set(1, 1);

    // 创建隧道
    this.tunnel = new Tunnel(this.tunnelTexture);
    this.scene.add(this.tunnel.group);

    // 创建小猫
    this.cat = new Cat();
    this.scene.add(this.cat.group);

    // 添加环境光（增加亮度）
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    // 添加主方向光（增加亮度）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // 添加点光源（增加局部亮度）
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);

    // 添加事件监听
    window.addEventListener('resize', this.handleResize.bind(this));

    // 开始动画循环
    this.animate();
  }

  updateCamera() {
    // 获取当前在管道中的位置
    const position = this.tunnel.getPositionAt(this.catPosition);
    
    // 更新相机位置
    this.camera.position.copy(position);
    
    // 计算下一个位置点
    const nextPosition = this.tunnel.getPositionAt((this.catPosition + 0.01) % 1);
    
    // 更新旋转角度
    this.rotationAngle += 0.05;
    const rotationRadius = 1;
    const offsetX = Math.sin(this.rotationAngle) * rotationRadius;
    const offsetY = Math.cos(this.rotationAngle) * rotationRadius;
    
    // 更新相机旋转
    this.cameraRotation += 0.01;
    this.camera.rotation.z = Math.sin(this.cameraRotation) * 0.2;
    this.camera.rotation.x = Math.cos(this.cameraRotation) * 0.1;
    
    // 设置相机朝向，添加旋转效果
    const targetPosition = nextPosition.clone();
    targetPosition.x += offsetX;
    targetPosition.y += offsetY;
    this.camera.lookAt(targetPosition);

    // 更新点光源位置（跟随相机）
    const pointLight = this.scene.children.find(child => child instanceof THREE.PointLight);
    if (pointLight) {
      pointLight.position.copy(position);
    }
  }

  animateCat() {
    // 更新位置
    this.catPosition += this.speed;
    if (this.catPosition > 0.51) {
      this.catPosition = 0;
    }

    // 获取小猫在管道中的位置
    const position = this.tunnel.getPositionAt(this.catPosition);
    
    // 更新小猫位置
    this.cat.group.position.copy(position);

    // 更新小猫动画
    this.cat.update();
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
    
    // 更新隧道动画
    this.tunnel.update();
    
    // 更新小猫动画和位置
    this.animateCat();
    
    // 更新相机位置
    this.updateCamera();
    
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return html``;
  }
}

customElements.define('my-element', MyElement); 