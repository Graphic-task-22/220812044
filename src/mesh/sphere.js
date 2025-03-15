import * as THREE from 'three';

export function createSphere(params = {}) {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        metalness: params.metalness || 0.3,
        roughness: params.roughness || 0.6
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    return { mesh: sphere, material };
}