import { LitElement, html, css } from 'lit';
import * as THREE from 'three';

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
    this.particles = [];
    this.gravity = 0.01;
    this.colors = [
      [1, 0, 0],    // 红色
      [0, 1, 0],    // 绿色
      [0, 0, 1],    // 蓝色
      [1, 1, 0],    // 黄色
      [1, 0, 1],    // 紫色
      [0, 1, 1],    // 青色
      [1, 0.5, 0],  // 橙色
      [0.5, 1, 0.5] // 粉绿色
    ];
  }

  firstUpdated() {
    this.init();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0.2); // 半透明黑色背景
    
    // 将渲染器的 canvas 添加到 shadowRoot
    this.shadowRoot.appendChild(this.renderer.domElement);

    // 添加事件监听
    this.addEventListener('click', this.handleClick.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));

    // 开始动画循环
    this.animate();
  }

  handleClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 创建烟花粒子
    this.createFirework(x, y);
  }

  createFirework(x, y) {
    const particleCount = 150; // 增加粒子数量
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];
    const lifetimes = [];
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    // 随机选择一个基础颜色
    const baseColor = this.colors[Math.floor(Math.random() * this.colors.length)];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = x * 5;     // x
      positions[i3 + 1] = y * 5; // y
      positions[i3 + 2] = 0;     // z

      // 基于基础颜色创建渐变效果
      const colorVariation = 0.3;
      colors[i3] = baseColor[0] + (Math.random() - 0.5) * colorVariation;
      colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * colorVariation;
      colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * colorVariation;

      // 随机速度，增加垂直方向的初始速度
      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3 + 0.2, // 向上偏移
        z: (Math.random() - 0.5) * 0.3
      });

      lifetimes.push(Math.random() * 2 + 1.5); // 1.5-3.5秒的生命周期
      sizes[i] = Math.random() * 0.05 + 0.02; // 随机大小
      opacities[i] = 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    this.particles.push({
      points,
      velocities,
      lifetimes,
      geometry,
      opacities,
      material
    });
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

    // 更新所有粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const positions = particle.geometry.attributes.position.array;

      for (let j = 0; j < positions.length; j += 3) {
        const index = j / 3;
        
        // 更新位置
        positions[j] += particle.velocities[index].x;
        positions[j + 1] += particle.velocities[index].y;
        positions[j + 2] += particle.velocities[index].z;

        // 应用重力
        particle.velocities[index].y -= this.gravity;

        // 更新生命周期和透明度
        particle.lifetimes[index] -= 0.016; // 假设60fps
        particle.opacities[index] = particle.lifetimes[index] / 2; // 渐变消失

        // 如果粒子生命结束，移除它
        if (particle.lifetimes[index] <= 0) {
          this.particles.splice(i, 1);
          this.scene.remove(particle.points);
          particle.geometry.dispose();
          particle.points.material.dispose();
          break;
        }
      }

      if (particle.geometry) {
        particle.geometry.attributes.position.needsUpdate = true;
        particle.material.opacity = Math.max(...particle.opacities);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return html``;
  }
}

customElements.define('my-element', MyElement); 