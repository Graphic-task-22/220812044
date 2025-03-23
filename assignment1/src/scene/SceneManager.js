import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createEarth } from '../mesh/earth'; // 导入地球
import { createAmbientLight } from '../light/ambientLight';
import { createDirectionalLight } from '../light/directionalLight';

export class SceneManager {
  constructor() {
    // 定义实例属性
    this.clock = new THREE.Clock();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earth = null;
    this.clouds = null;
    this.atmosphere = null;
    this.earthMaterial = null;
    this.cloudsMaterial = null;
    this.atmosphereMaterial = null;
    this.earthParams = null;
    this.controls = null;
    this.hemisphereLight = null;
    this.skyColor = null;
    this.groundColor = null;
    this.directionalLight = null;
    this.orbitControls = null;
    this.stats = null;
    this.gui = null;
    this.animationFrameId = null;
    this.isRenderingPaused = false;

    try {
      // 初始化各组件
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initLights();
    this.initObjects();
      this.initControls();
    this.initGUI();
    this.initStats();

      // 添加窗口大小变化事件监听
      window.addEventListener('resize', this.onWindowResize.bind(this));

      // 启动动画循环
    this.animate();
    } catch (error) {
      console.error("SceneManager 初始化失败:", error);
    }
  }

  initScene() {
    try {
      this.scene = new THREE.Scene();
      
      // 添加星空背景
      this.scene.background = this.createStarfield();
    } catch (error) {
      console.error("初始化场景失败:", error);
    this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
    }
  }
  
  // 创建星空背景
  createStarfield() {
    try {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,          // 增加星星尺寸
        transparent: true,
        opacity: 0.8,       // 增加不透明度
        sizeAttenuation: false
      });
      
      // 创建随机星星位置
      const starsVertices = [];
      for (let i = 0; i < 5000; i++) { 
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      
      // 添加星星到场景
      if (this.scene) {
        this.scene.add(stars);
      }
      
  
      return new THREE.Color(0x000000);
    } catch (error) {
      console.error("创建星空背景失败:", error);
      return new THREE.Color(0x000000);
    }
  }

  initRenderer() {
    try {
      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
        alpha: true
      });
      
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // 限制像素比以提高性能
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      
      document.body.appendChild(renderer.domElement);
      this.renderer = renderer;
    } catch (error) {
      console.error("初始化渲染器失败:", error);
      // 创建基本渲染器作为备用
      const fallbackRenderer = new THREE.WebGLRenderer({ antialias: false });
      fallbackRenderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(fallbackRenderer.domElement);
      this.renderer = fallbackRenderer;
    }
  }

  initCamera() {
    try {
    this.camera = new THREE.PerspectiveCamera(
      20, 
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
      this.camera.position.set(20, 30, 0); // 相机位置  
      this.camera.lookAt(0, 0, 0);
    } catch (error) {
      console.error("初始化相机失败:", error);
      // 创建默认相机
      this.camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 1000
      );
      this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    }
  }

  initLights() {
    try {
      // 使用半球环境光代替普通环境光
      const ambientLightData = createAmbientLight();
      this.hemisphereLight = ambientLightData.light;
      this.skyColor = ambientLightData.skyColor;
      this.groundColor = ambientLightData.groundColor;
      if (this.scene && this.hemisphereLight) {
        this.scene.add(this.hemisphereLight);
      }

      // 平行光 - 作为太阳光源
      const directionalLight = createDirectionalLight();
      this.directionalLight = directionalLight.light;
      if (this.directionalLight) {
        this.directionalLight.position.set(1, 0.5, 2);
        this.directionalLight.intensity = 1.5;
        if (this.scene) {
          this.scene.add(this.directionalLight);
        }
      }
    } catch (error) {
      console.error("初始化光照失败:", error);
      // 添加备用光源
      if (this.scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
      }
    }
  }

  initObjects() {
    try {
      // 创建地球
      const earth = createEarth();
      if (!earth || !earth.mesh) {
        throw new Error("地球创建失败");
      }
      
      this.earth = earth.mesh;
      this.clouds = earth.clouds;
      this.atmosphere = earth.atmosphere;
      this.earthMaterial = earth.material;
      this.cloudsMaterial = earth.cloudsMaterial;
      this.atmosphereMaterial = earth.atmosphereMaterial;
      
      // 添加地球到场景
      if (this.earth && this.scene) {
        this.scene.add(this.earth);
      }

      // 初始化运动控制参数
      this.controls = {
        earthRotationSpeed: 0.05,
        cloudsRotationSpeed: 0.07,
        autoRotate: true
      };
    } catch (error) {
      console.error("初始化对象失败:", error);
      
      // 创建备用简单球体
      if (this.scene) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x3366ff });
        this.earth = new THREE.Mesh(geometry, material);
        this.scene.add(this.earth);
        
        // 基本控制参数
        this.controls = {
          earthRotationSpeed: 0.05,
          cloudsRotationSpeed: 0.07,
          autoRotate: true
        };
      }
    }
  }

  initControls() {
    try {
      // 初始化轨道控制器
      if (this.camera && this.renderer) {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.minDistance = 1.5;
        this.orbitControls.maxDistance = 10;
        this.orbitControls.enablePan = false;
        this.orbitControls.rotateSpeed = 0.5;
        this.orbitControls.autoRotate = false;
      }
    } catch (error) {
      console.error("初始化控制器失败:", error);
    }
  }

  initGUI() {
    try {
      if (!this.controls) {
        return;
      }
      
    this.gui = new GUI();

      // 地球控制
      const earthFolder = this.gui.addFolder('地球控制');
      earthFolder.add(this.controls, 'earthRotationSpeed', 0, 0.2).step(0.01).name('地球旋转速度');
      earthFolder.add(this.controls, 'cloudsRotationSpeed', 0, 0.2).step(0.01).name('云层旋转速度');
      earthFolder.add(this.controls, 'autoRotate').name('自动旋转');
      
      // 地球材质调整
      if (this.earthMaterial) {
        const materialFolder = this.gui.addFolder('地球材质');
        materialFolder.add(this.earthMaterial, 'roughness', 0, 1).step(0.01).name('粗糙度');
        materialFolder.add(this.earthMaterial, 'bumpScale', 0, 0.2).step(0.01).name('凹凸强度');
        materialFolder.add(this.earthMaterial, 'transitionWidth', 0.1, 1.0).step(0.05).name('昼夜过渡宽度');
        materialFolder.add(this.earthMaterial, 'blendFactor', 0, 0.5).step(0.01).name('昼夜混合度');
      }
      
      // 半球环境光控制
      if (this.hemisphereLight && this.skyColor && this.groundColor) {
        const hemiLightFolder = this.gui.addFolder('环境光');
        hemiLightFolder.add(this.hemisphereLight, 'intensity', 0, 1).step(0.01).name('环境光强度');
      }
      
      // 平行光（太阳光）控制
      if (this.directionalLight) {
        const sunLightFolder = this.gui.addFolder('太阳光');
        sunLightFolder.add(this.directionalLight, 'intensity', 0, 3).step(0.1).name('太阳光强度');
      }
      
      // 添加重置渲染按钮
      const debugFolder = this.gui.addFolder('调试');
      debugFolder.add(
        {
          resetRender: () => {
            this.resetRenderer();
          }
        }, 
        'resetRender'
      ).name('重置渲染');
    } catch (error) {
      console.error("初始化GUI失败:", error);
    }
  }
  
  // 重置渲染器 - 用于出现渲染错误时手动恢复
  resetRenderer() {
    try {
      // 停止当前动画循环
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      // 标记为未暂停
      this.isRenderingPaused = false;
      
      // 重新初始化对象
      this.initObjects();
      
      // 重启动画循环
      this.animate();
      
      console.log("渲染器已重置");
    } catch (error) {
      console.error("重置渲染器失败:", error);
    }
  }

  initStats() {
    try {
    this.stats = new Stats();
      const statsElement = document.getElementById('stats');
      if (statsElement) {
        statsElement.appendChild(this.stats.dom);
      } else {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'stats';
        statsContainer.style.position = 'fixed';
        statsContainer.style.top = '0';
        statsContainer.style.left = '0';
        statsContainer.appendChild(this.stats.dom);
        document.body.appendChild(statsContainer);
      }
    } catch (error) {
      console.error("初始化状态面板失败:", error);
      this.stats = null;
    }
  }

  animate = () => {
    try {
      // 如果渲染已暂停，不继续执行
      if (this.isRenderingPaused) {
        return;
      }
      
      // 保存动画帧ID以便需要时取消
      this.animationFrameId = requestAnimationFrame(this.animate);
      
      // 计算时间增量并限制最大值以防止在切换标签页后跳跃
      const delta = this.clock ? Math.min(this.clock.getDelta(), 0.1) : 0.016;

      // 地球和云层旋转
      if (this.controls && this.controls.autoRotate) {
        if (this.earth) {
          this.earth.rotation.y += delta * this.controls.earthRotationSpeed;
        }
        
        if (this.clouds) {
          this.clouds.rotation.y += delta * this.controls.cloudsRotationSpeed;
        }
      }
      
      // 更新光照方向
      if (this.earth && this.earth.material && this.earth.material.uniforms && this.directionalLight) {
        // 计算世界坐标系中的光照方向，不再应用地球旋转的逆变换
        const lightDirection = this.directionalLight.position.clone()
          .sub(this.earth.position)
          .normalize();
        
        // 直接使用世界坐标系中的光照方向
        this.earth.material.uniforms.lightDirection.value.copy(lightDirection);
      }

      // 更新轨道控制器
      if (this.orbitControls) {
        this.orbitControls.update();
      }

      // 更新性能统计
      if (this.stats) {
    this.stats.update();
      }
      
      // 使用try/catch包裹渲染调用，捕获渲染错误
      if (this.renderer && this.scene && this.camera) {
        try {
    this.renderer.render(this.scene, this.camera);
        } catch (error) {
          console.error("渲染错误，暂停动画循环:", error);
          this.isRenderingPaused = true;
          
          // 不继续调用动画循环
          return;
        }
      }
    } catch (error) {
      console.error("动画循环错误:", error);
    }
  };

  onWindowResize() {
    try {
      if (this.camera) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
      }
      
      if (this.renderer) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    } catch (error) {
      console.error("窗口大小改变处理错误:", error);
    }
  }
}