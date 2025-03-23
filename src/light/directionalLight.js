import * as THREE from 'three';

export function createDirectionalLight() {
    // 创建平行光（模拟太阳光）
    const sunColor = new THREE.Color(0xffffff); // 白色的太阳光
    const directionalLight = new THREE.DirectionalLight(sunColor, 1.2);
    
    // 设置阴影属性
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0003;
    
    // 配置平行光的阴影范围
    const shadowSize = 5;
    directionalLight.shadow.camera.left = -shadowSize;
    directionalLight.shadow.camera.right = shadowSize;
    directionalLight.shadow.camera.top = shadowSize;
    directionalLight.shadow.camera.bottom = -shadowSize;
    
    return {
        light: directionalLight
    };
}