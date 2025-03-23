import * as THREE from 'three';

export function createAmbientLight() {
    // 使用半球光代替普通环境光
    // 半球光在天空和地面之间创建渐变效果
    const skyColor = new THREE.Color(0x88aaff);  // 天空蓝色
    const groundColor = new THREE.Color(0x330066);  // 深紫色地面
    const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, 0.5);
    
    // 创建半球光辅助器（如果需要）
    // const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.5);
    
    return {
        light: hemisphereLight,
        skyColor: skyColor,
        groundColor: groundColor
    };
}