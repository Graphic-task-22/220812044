import * as THREE from 'three';

export function createEarth() {
    // 创建地球几何体
    const geometry = new THREE.SphereGeometry(2, 32, 32);

    // 加载地球纹理
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const bumpTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_bump_2048.jpg');

    // 创建材质
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.05,
        specular: 0x222222,
        shininess: 10
    });

    // 创建地球网格
    const earth = new THREE.Mesh(geometry, material);
    earth.castShadow = true;
    earth.receiveShadow = true;

    return { mesh: earth, material };
}