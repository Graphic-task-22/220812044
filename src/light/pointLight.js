import * as THREE from 'three';

export function createPointLight(params = {}) {
    const light = new THREE.PointLight(0xff8800, params.intensity || 2, 20);
    light.position.set(-5, 3, 0);
    light.castShadow = true;
    
    const helper = new THREE.PointLightHelper(light, 0.5);
    return { light, helper };
}