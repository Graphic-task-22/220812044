import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { createCube } from '../mesh/cube';
import { createSphere } from '../mesh/sphere';
import { createGround } from '../mesh/ground';
import { createEarth } from '../mesh/earth'; // 导入地球
import { createAmbientLight } from '../light/ambientLight';
import { createDirectionalLight } from '../light/directionalLight';
import { createPointLight } from '../light/pointLight';

export class SceneManager {
    constructor() {
        this.initScene();
        this.initRenderer();
        this.initCamera();
        this.initLights();
        this.initObjects();
        this.initHelpers();
        this.initGUI();
        this.initStats();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(15, 10, 15); // 调整相机位置
        this.camera.lookAt(0, 0, 0);
    }

    initLights() {
        // 环境光
        this.ambientLight = createAmbientLight();
        this.scene.add(this.ambientLight);

        // 平行光
        const directionalLight = createDirectionalLight();
        this.directionalLight = directionalLight.light;
        this.scene.add(this.directionalLight);
        this.scene.add(directionalLight.helper);

        // 点光源
        const pointLight = createPointLight();
        this.pointLight = pointLight.light;
        this.scene.add(this.pointLight);
        this.scene.add(pointLight.helper);
    }

    initObjects() {
        // 立方体
        const cube = createCube();
        this.cube = cube.mesh;
        this.cubeMaterial = cube.material;
        this.cube.position.set(-5, 1, 0); // 初始位置
        this.scene.add(this.cube);

        // 球体
        const sphere = createSphere();
        this.sphere = sphere.mesh;
        this.sphereMaterial = sphere.material;
        this.sphere.position.set(5, 1.5, 0); // 初始位置
        this.scene.add(this.sphere);

        // 地球
        const earth = createEarth();
        this.earth = earth.mesh;
        this.earth.position.set(0, 5, 0); // 初始位置
        this.scene.add(this.earth);

        // 地面
        this.ground = createGround();
        this.ground.position.y = -1;
        this.scene.add(this.ground);

        // 初始化运动控制参数
        this.controls = {
            cubeRotationSpeed: 0.01,
            sphereRotationSpeed: 0.008,
            earthRotationSpeed: 0.005,
            autoRotate: true,
            cubePosition: { x: -5, y: 1, z: 0 }, // 立方体初始位置
            spherePosition: { x: 5, y: 1.5, z: 0 }, // 球体初始位置
            earthPosition: { x: 0, y: 5, z: 0 } // 地球初始位置
        };
    }

    initHelpers() {
        // 坐标轴
        this.axesHelper = new THREE.AxesHelper(10); // 增大坐标轴
        this.scene.add(this.axesHelper);
    }

    initGUI() {
        this.gui = new GUI();

        // 光源控制
        const lightFolder = this.gui.addFolder('光源设置');
        lightFolder.add(this.ambientLight, 'intensity', 0, 2).name('环境光强度');
        lightFolder.add(this.directionalLight, 'intensity', 0, 5).name('平行光强度');
        lightFolder.add(this.pointLight, 'intensity', 0, 5).name('点光源强度');

        // 立方体控制
        const cubeFolder = this.gui.addFolder('立方体');
        cubeFolder.add(this.controls, 'cubeRotationSpeed', 0, 0.1).name('旋转速度');
        cubeFolder.add(this.cube.position, 'x', -10, 10).name('X 位置');
        cubeFolder.add(this.cube.position, 'y', -10, 10).name('Y 位置');
        cubeFolder.add(this.cube.position, 'z', -10, 10).name('Z 位置');
        cubeFolder.addColor(this.cubeMaterial, 'color').name('颜色');

        // 球体控制
        const sphereFolder = this.gui.addFolder('球体');
        sphereFolder.add(this.controls, 'sphereRotationSpeed', 0, 0.1).name('旋转速度');
        sphereFolder.add(this.sphere.position, 'x', -10, 10).name('X 位置');
        sphereFolder.add(this.sphere.position, 'y', -10, 10).name('Y 位置');
        sphereFolder.add(this.sphere.position, 'z', -10, 10).name('Z 位置');
        sphereFolder.addColor(this.sphereMaterial, 'color').name('颜色');

        // 地球控制
        const earthFolder = this.gui.addFolder('地球');
        earthFolder.add(this.controls, 'earthRotationSpeed', 0, 0.1).name('旋转速度');
        earthFolder.add(this.earth.position, 'x', -10, 10).name('X 位置');
        earthFolder.add(this.earth.position, 'y', -10, 10).name('Y 位置');
        earthFolder.add(this.earth.position, 'z', -10, 10).name('Z 位置');

        // 动画控制
        const animationFolder = this.gui.addFolder('动画控制');
        animationFolder.add(this.controls, 'autoRotate').name('自动旋转');

        // 重置按钮
        const resetFolder = this.gui.addFolder('重置');
        resetFolder.add({
            resetPositions: () => {
                this.cube.position.set(this.controls.cubePosition.x, this.controls.cubePosition.y, this.controls.cubePosition.z);
                this.sphere.position.set(this.controls.spherePosition.x, this.controls.spherePosition.y, this.controls.spherePosition.z);
                this.earth.position.set(this.controls.earthPosition.x, this.controls.earthPosition.y, this.controls.earthPosition.z);
            }
        }, 'resetPositions').name('重置位置');
    }

    initStats() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.controls.autoRotate) {
            // 立方体旋转
            this.cube.rotation.x += this.controls.cubeRotationSpeed;
            this.cube.rotation.y += this.controls.cubeRotationSpeed;

            // 球体旋转
            this.sphere.rotation.x -= this.controls.sphereRotationSpeed;
            this.sphere.rotation.y -= this.controls.sphereRotationSpeed;

            // 地球旋转
            this.earth.rotation.y += this.controls.earthRotationSpeed;
        }

        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}