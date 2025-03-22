// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // 基础配置示例
  server: {
    port: 3000 // 自定义端口
  },
  optimizeDeps: {
    include: ['three'] ,// 如果你需要优化 three.js 的依赖
    include: ['three', 'three/addons/controls/OrbitControls']
  }
})