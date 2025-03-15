import * as THREE from 'three';

export function createDirectionalLight(params = {}) {
    const light = new THREE.DirectionalLight(0xffffff, params.intensity || 1);
    light.position.set(5, 10, 7.5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    
    const helper = new THREE.DirectionalLightHelper(light);
    return { light, helper };
}