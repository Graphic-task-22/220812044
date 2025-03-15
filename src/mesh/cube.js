import * as THREE from 'three';

export function createCube(params = {}) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: params.metalness || 0.5,
        roughness: params.roughness || 0.4
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    return { mesh: cube, material };
}
