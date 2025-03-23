// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // 基础配置示例
  server: {
    port: 3000 // 自定义端口
  },
  optimizeDeps: {
    include: [
        'three',
        'three/addons/controls/OrbitControls.js',
        'three/addons/libs/lil-gui.module.min.js',
        'three/addons/nodes/Nodes.js',
      ],
  }
})