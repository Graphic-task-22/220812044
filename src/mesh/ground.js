import * as THREE from 'three';

export function createGround() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({
        color: 0x444444,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = Math.PI / 2;
    ground.receiveShadow = true;
    return ground;
}