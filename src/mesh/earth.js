// src/mesh/earth.js
import * as THREE from 'three';

// 创建地球对象并返回
export function createEarth() {
  try {
    // 使用 Vite 的静态资源处理方式
    const textureLoader = new THREE.TextureLoader();
    const basePath = '/assets/'; // 使用public/assets目录下的纹理

    // 加载纹理函数
    const loadTexture = (path) => {
      try {
        const tex = textureLoader.load(`${basePath}${path}`);
        tex.anisotropy = 8;
        return tex;
      } catch (error) {
        console.error(`加载纹理失败: ${path}`, error);
        return new THREE.Texture();
      }
    };

    // 加载所有需要的纹理
    const dayTexture = loadTexture('earth_day_4096.jpg');
    dayTexture.colorSpace = THREE.SRGBColorSpace;

    const nightTexture = loadTexture('earth_lights_2048.png');
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    
    const cloudsTexture = loadTexture('earth_clouds_1024.png');
    
    const normalTexture = loadTexture('earth_normal_2048.jpg');
    
    const bumpTexture = loadTexture('earth_bump_roughness_clouds_4096.jpg');

    // 创建地球材质
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        normalMap: { value: normalTexture },
        bumpMap: { value: bumpTexture },
        bumpScale: { value: 0.2 },
        roughness: { value: 0.4 },
        transitionWidth: { value: 0.3 },
        blendFactor: { value: 0.3 },
        lightDirection: { value: new THREE.Vector3(1, 0, 0) } // 假设光源方向
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldNormal;
        
        void main() {
          vUv = uv;
          // 法线在模型空间
          vNormal = normalize(normalMatrix * normal);
          // 计算世界空间的法线
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D normalMap;
        uniform sampler2D bumpMap;
        uniform float bumpScale;
        uniform float roughness;
        uniform float transitionWidth;
        uniform float blendFactor;
        uniform vec3 lightDirection;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldNormal;
        
        void main() {
          // 获取法线贴图值并应用到法线
          vec3 normalValue = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
          vec3 bumpValue = texture2D(bumpMap, vUv).xyz;
          vec3 newNormal = normalize(vWorldNormal + normalValue * bumpScale);
          
          vec3 normalizedLightDir = normalize(lightDirection);
          // 使用修改后的法线计算光照强度
          float intensity = dot(newNormal, normalizedLightDir);
          
          // 使用粗糙度来调整光照分布
          float adjustedIntensity = mix(intensity, pow(intensity, 1.0 + roughness * 2.0), roughness);
          
          // 扩展过渡区域，使用更平滑的过渡函数
          // 使用自定义曲线而非简单的smoothstep，增加过渡的自然度
          float t = clamp((adjustedIntensity + transitionWidth) / (2.0 * transitionWidth), 0.0, 1.0);
          float transition = smoothstep(0.0, 1.0, t);
          transition = transition * transition * (3.0 - 2.0 * transition); // 更平滑的过渡曲线
          
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);
          
          // 使用混合因子增强过渡效果
          // 即使在完全白天区域也保留一点夜间纹理的细节，反之亦然
          // 在交界线附近增强融合效果
          float edgeFactor = 1.0 - abs(2.0 * transition - 1.0); // 在过渡中间区域达到最大值
          float enhancedBlendFactor = blendFactor * (1.0 + edgeFactor * 2.0); // 交界线附近增强融合
          
          vec4 blendedDay = mix(dayColor, nightColor, min(enhancedBlendFactor * 0.5, 0.5));
          vec4 blendedNight = mix(nightColor, dayColor, min(enhancedBlendFactor * 0.2, 0.4));
          
          // 背光面使用夜间灯光纹理，受光面使用白天纹理
          vec4 finalColor = mix(blendedNight, blendedDay, transition);
          
          gl_FragColor = finalColor;
        }
      `
    });
    
    // 添加设置相关属性的 getter/setter 以便 GUI 使用
    Object.defineProperties(globeMaterial, {
      'roughness': {
        get: function() { return this.uniforms.roughness.value; },
        set: function(v) { this.uniforms.roughness.value = v; }
      },
      'bumpScale': {
        get: function() { return this.uniforms.bumpScale.value; },
        set: function(v) { this.uniforms.bumpScale.value = v; }
      },
      'transitionWidth': {
        get: function() { return this.uniforms.transitionWidth.value; },
        set: function(v) { this.uniforms.transitionWidth.value = v; }
      },
      'blendFactor': {
        get: function() { return this.uniforms.blendFactor.value; },
        set: function(v) { this.uniforms.blendFactor.value = v; }
      }
    });
    
    // 创建地球网格
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    globe.castShadow = true;
    globe.receiveShadow = true;
    
    // 创建云层 - 使用标准材质
    const cloudsMaterial = new THREE.MeshStandardMaterial({ 
      map: cloudsTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // 防止z-fighting
      side: THREE.DoubleSide
    });
    
    const cloudsGeometry = new THREE.SphereGeometry(1.015, 48, 48);
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    clouds.castShadow = false; // 云层不需要投射阴影
    clouds.receiveShadow = true;
    globe.add(clouds);

    return {
      mesh: globe,
      clouds: clouds,
      atmosphere: null,
      material: globeMaterial,
      cloudsMaterial: cloudsMaterial,
      atmosphereMaterial: null
    };
  } catch (error) {
    console.error("创建地球对象失败", error);
    // 返回基本球体
    const fallbackSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x4444ff })
    );
    return {
      mesh: fallbackSphere,
      clouds: null,
      atmosphere: null,
      material: fallbackSphere.material,
      cloudsMaterial: null,
      atmosphereMaterial: null
    };
  }
}