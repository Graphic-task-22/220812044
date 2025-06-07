import * as THREE from 'three';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 5);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 灯光设置
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(5, 5, 5);
scene.add(point);
