import * as THREE from 'three'

export class CameraManager {
  constructor(aspect) {
    this.frustumSize = 600
    this.aspect = aspect
    this.activeCameraType = 'perspective'
    
    this.initCameras()
  }

  initCameras() {
    // 主视角相机
    this.mainCamera = new THREE.PerspectiveCamera(
      50,
      this.aspect,
      0.1,
      10000
    )
    this.mainCamera.position.set(4.5, 2, 3)

    // 透视相机
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      50,
      0.5 * this.aspect,
      150,
      1000
    )

    // 正交相机
    this.orthographicCamera = new THREE.OrthographicCamera(
      -0.5 * this.frustumSize * this.aspect / 2,
      0.5 * this.frustumSize * this.aspect / 2,
      this.frustumSize / 2,
      -this.frustumSize / 2,
      150,
      1000
    )

    // 相机辅助工具
    this.helpers = {
      perspective: new THREE.CameraHelper(this.perspectiveCamera),
      orthographic: new THREE.CameraHelper(this.orthographicCamera)
    }

    // 初始化相机方向
    this.perspectiveCamera.rotation.y = Math.PI
    this.orthographicCamera.rotation.y = Math.PI
  }

  get activeCamera() {
    return this[`${this.activeCameraType}Camera`]
  }

  get activeHelper() {
    return this.helpers[this.activeCameraType]
  }

  updateOnResize(aspect) {
    this.aspect = aspect
    
    // 更新主相机
    this.mainCamera.aspect = aspect
    this.mainCamera.updateProjectionMatrix()

    // 更新透视相机
    this.perspectiveCamera.aspect = 0.5 * aspect
    this.perspectiveCamera.updateProjectionMatrix()

    // 更新正交相机
    this.orthographicCamera.left = -0.5 * this.frustumSize * aspect / 2
    this.orthographicCamera.right = 0.5 * this.frustumSize * aspect / 2
    this.orthographicCamera.top = this.frustumSize / 2
    this.orthographicCamera.bottom = -this.frustumSize / 2
    this.orthographicCamera.updateProjectionMatrix()
  }
}