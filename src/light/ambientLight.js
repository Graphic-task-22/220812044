import * as THREE from 'three';

export function createAmbientLight(intensity = 0.5) {
    const light = new THREE.AmbientLight(0x404040, intensity);
    return light;
}