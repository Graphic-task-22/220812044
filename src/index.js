import { SceneManager } from './scene/SceneManager';

// 初始化场景
const sceneManager = new SceneManager();

// 窗口响应
window.addEventListener('resize', () => sceneManager.onWindowResize());