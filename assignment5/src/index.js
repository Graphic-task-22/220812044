import * as THREE from 'three';

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// --- 正射相机设置 ---
const aspectRatio = window.innerWidth / window.innerHeight;
const viewSize = 15; // 视图大小，根据场景内容调整
const camera = new THREE.OrthographicCamera(
    viewSize * aspectRatio / -2,
    viewSize * aspectRatio / 2,
    viewSize / 2,
    viewSize / -2,
    0.1, // near
    1000 // far
);

camera.position.set(0, viewSize * 0.4, 10); // 调整相机位置，从正面 slightly above 看
camera.lookAt(0, viewSize * 0.3, 0); // 让相机看向图表的基础部分，使其更水平
// ----------------------

const renderer = new THREE.WebGLRenderer({ antialias: true }); // 启用抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 设置背景色为白色 ---
renderer.setClearColor(0xffffff, 1); // 白色，alpha为1
// 或者使用 scene.background = new THREE.Color(0xffffff);
// -----------------------

// 清空之前的对象
scene.clear();

// 添加环境光
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// 添加方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// 数据：标签和对应的百分比值 (根据图片大致推测)
const barData = [
    { label: '衬衫', value: 5 },
    { label: '羊毛衫', value: 20 },
    { label: '雪纺衫', value: 80 },
    { label: '裤子', value: 50 },
    { label: '高跟鞋', value: 10 },
    { label: '袜子', value: 100 },
];

const barWidth = 1; // 每个条形的宽度
const barGap = 0.5; // 条形之间的间隙
const totalWidth = barData.length * (barWidth + barGap) - barGap; // 总宽度，减去最后一个条形右侧的间隙
const startX = -totalWidth / 2 + barWidth / 2; // 第一个条形的中心 X 坐标 (旧的计算方式)

const maxHeight = 10; // 条形的最大高度 (对应100%)

// 计算图表左下角的位置作为坐标轴原点
const chartOriginX = startX - barWidth / 2 ; // 第一个条形左侧的间隙左边缘 (基于旧的startX)
const chartOriginY = 0;
const chartOriginZ = 0;
const chartOrigin = new THREE.Vector3(chartOriginX, chartOriginY, chartOriginZ);

// --- 绘制坐标轴线 ---
function createAxisLine(axis, length, color, origin) {
    const points = [];
    points.push(origin); // 坐标轴起点设置为图表原点
    if (axis === 'x') {
        points.push(new THREE.Vector3(origin.x + length, origin.y, origin.z));
    } else if (axis === 'y') {
        points.push(new THREE.Vector3(origin.x, origin.y + length, origin.z));
    } else if (axis === 'z') {
        points.push(new THREE.Vector3(origin.x, origin.y, origin.z + length));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.Line(geometry, material);
    return line;
}

const axisLength = 12; // 坐标轴长度，略大于图表高度和宽度
const black = 0x000000;
const xAxis = createAxisLine('x', axisLength, black, chartOrigin); // 黑色 X 轴
const yAxis = createAxisLine('y', axisLength, black, chartOrigin); // 黑色 Y 轴
// const zAxis = createAxisLine('z', axisLength, 0x0000ff, chartOrigin); // 蓝色 Z 轴 (可选)

scene.add(xAxis);
scene.add(yAxis);
// scene.add(zAxis); // 添加 Z 轴

// ---------------------

// --- 绘制刻度线和网格线 ---

// Y 轴刻度线和水平网格线
const yTickCount = 5; // 0, 20, 40, 60, 80, 100
const yTickLength = 0.3; // 调整 Y 轴刻度线长度
const tickColor = 0x000000; // 刻度线颜色
const gridColor = 0xd3d3d3; // 浅灰色网格线
const gridLineLength = totalWidth + barWidth; // 网格线长度，覆盖整个条形区域

// 存储标签元素和它们对应的3D位置
const labels = [];
const labelContainer = document.getElementById('label-container');

// 创建并定位标签函数
function createLabel(text, position3D) {
    const element = document.createElement('div');
    element.className = 'label';
    element.textContent = text;
    labelContainer.appendChild(element);
    labels.push({ element: element, position3D: position3D });
}

// Y 轴标签的水平偏移量，使其更靠近Y轴
const yLabelXOffset = -0.7; // 调整此值，使其更靠近Y轴线

for (let i = 0; i <= yTickCount; i++) {
    const value = (i / yTickCount) * 100; // 百分比值
    const yPos = (value / 100) * maxHeight; // 对应的 Y 轴位置
    const yValue = i * 20; // Y轴显示的数值
    
    // 绘制 Y 轴刻度线
    const yTickPoints = [];
    yTickPoints.push(new THREE.Vector3(chartOriginX - yTickLength, chartOriginY + yPos, chartOriginZ)); // 向左延伸
    yTickPoints.push(new THREE.Vector3(chartOriginX, chartOriginY + yPos, chartOriginZ));

    const yTickGeometry = new THREE.BufferGeometry().setFromPoints(yTickPoints);
    const yTickMaterial = new THREE.LineBasicMaterial({ color: tickColor });
    const yTick = new THREE.Line(yTickGeometry, yTickMaterial);
    scene.add(yTick);
    
    // 绘制水平网格线 (除了Y=0)
    if (yPos > 0) {
        const gridPoints = [];
        gridPoints.push(new THREE.Vector3(chartOriginX, chartOriginY + yPos, chartOriginZ));
        gridPoints.push(new THREE.Vector3(chartOriginX + gridLineLength, chartOriginY + yPos, chartOriginZ));
        
        const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
        const gridMaterial = new THREE.LineBasicMaterial({ color: gridColor });
        const gridLine = new THREE.Line(gridGeometry, gridMaterial);
        scene.add(gridLine);
    }
    
    // 创建 Y 轴数值标签
    createLabel(yValue.toString(), new THREE.Vector3(chartOriginX + yLabelXOffset, chartOriginY + yPos, chartOriginZ)); // 标签位置稍微偏左并调整偏移
}

// X 轴刻度线和文本标签
const xTickLength = 0.3; // 调整 X 轴刻度线长度
const labelYOffset = 0.7; // X 轴标签在Y轴上的偏移量，向下调整使其更远离X轴

barData.forEach((data, index) => {
    // 修改 X 轴位置计算，使其相对于 chartOriginX
    const xPos = chartOriginX + barWidth / 2 + index * (barWidth + barGap); // 每个条形的中心 X 坐标
    
    // 绘制 X 轴刻度线
    const xTickPoints = [];
    xTickPoints.push(new THREE.Vector3(xPos, chartOriginY, chartOriginZ)); // 从 X 轴开始
    xTickPoints.push(new THREE.Vector3(xPos, chartOriginY + xTickLength, chartOriginZ)); // 向上延伸

    const xTickGeometry = new THREE.BufferGeometry().setFromPoints(xTickPoints);
    const xTickMaterial = new THREE.LineBasicMaterial({ color: tickColor });
    const xTick = new THREE.Line(xTickGeometry, xTickMaterial);
    scene.add(xTick);
    
    // 创建 X 轴文本标签
    createLabel(data.label, new THREE.Vector3(xPos, chartOriginY - labelYOffset, chartOriginZ)); // 标签位置在刻度线下方，调整偏移
});

// ---------------------

barData.forEach((data, index) => {
    const value = data.value;
    const colorHeight = value / 100; // 有颜色的部分的高度比例
    const greyHeight = 1 - colorHeight; // 灰色的部分的高度比例

    // 修改 X 坐标计算，使其相对于 chartOriginX
    const x = chartOriginX + barWidth / 2 + index * (barWidth + barGap); // 每个条形的中心 X 坐标

    // 绘制有颜色的部分 (带渐变)
    if (colorHeight > 0) {
        const colorGeometry = new THREE.PlaneGeometry(barWidth, maxHeight * colorHeight);
        // 创建顶点颜色数组
        const colors = new Float32Array(colorGeometry.attributes.position.count * 3);
        
        // 定义三色渐变颜色：绿 -> 黄 -> 红
        const colorBottom = new THREE.Color(0x00ff00); // 绿色 (0%)
        const colorMiddle = new THREE.Color(0xffff00); // 黄色 (~50%)
        const colorTop = new THREE.Color(0xff0000);    // 红色 (100%)
        
        const tempColor = new THREE.Color();

        for (let i = 0; i < colorGeometry.attributes.position.count; i++) {
            // 获取顶点在几何体局部空间中的 Y 坐标
            const yLocal = colorGeometry.attributes.position.getY(i);
            // 将局部 Y 坐标转换为场景世界坐标中的 Y 坐标
            const yWorld = yLocal + (maxHeight * colorHeight) / 2; // 加上彩色部分的中心Y坐标

            // 基于整个 maxHeight 将世界 Y 坐标归一化到 [0, 1]
            const normalizedY = yWorld / maxHeight; 

            // 实现绿 -> 黄 -> 红渐变 (基于 overall height)
            if (normalizedY < 0.5) {
                // 绿到黄 (0.0 - 0.5)
                const percent = normalizedY / 0.5; // 映射到 [0, 1]
                tempColor.copy(colorBottom).lerp(colorMiddle, percent);
            } else {
                // 黄到红 (0.5 - 1.0)
                const percent = (normalizedY - 0.5) / 0.5; // 映射到 [0, 1]
                tempColor.copy(colorMiddle).lerp(colorTop, percent);
            }
            
            colors[i * 3] = tempColor.r;
            colors[i * 3 + 1] = tempColor.g;
            colors[i * 3 + 2] = tempColor.b;
        }

        colorGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const colorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
        const colorMesh = new THREE.Mesh(colorGeometry, colorMaterial);
        // PlaneGeometry 默认中心点在 (0,0)，需要向上偏移使其底部与Y轴对齐
        colorMesh.position.set(x, (maxHeight * colorHeight) / 2, 0);
        scene.add(colorMesh);
    }

    // 绘制灰色的部分
    if (greyHeight > 0) {
        const greyGeometry = new THREE.PlaneGeometry(barWidth, maxHeight * greyHeight);
        const greyMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // 灰色
        const greyMesh = new THREE.Mesh(greyGeometry, greyMaterial);
        // 灰色部分位于彩色部分上方，需要计算其中心位置
        greyMesh.position.set(x, maxHeight * colorHeight + (maxHeight * greyHeight) / 2, 0);
        scene.add(greyMesh);
    }
});

// ------------------------

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Add your animation logic here

  // 更新标签位置
  labels.forEach(label => {
    const position3D = label.position3D.clone(); // 使用克隆，避免修改原始位置
    // 将3D位置转换为2D屏幕坐标
    const position2D = position3D.project(camera);
    
    // 计算屏幕坐标 (原点在左上角)
    const screenX = (position2D.x + 1) / 2 * window.innerWidth;
    const screenY = (1 - position2D.y) / 2 * window.innerHeight;
    
    // 设置标签的CSS位置
    label.element.style.left = `${screenX}px`;
    label.element.style.top = `${screenY}px`;

    // 根据Z坐标判断是否在相机前面，如果在后面则隐藏标签
    if (position2D.z > 1) {
        label.element.style.display = 'none';
    } else {
        label.element.style.display = '';
    }
  });

  renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
  const newAspectRatio = window.innerWidth / window.innerHeight;
  const newViewSize = 15; // 保持视图大小不变
  
  camera.left = newViewSize * newAspectRatio / -2;
  camera.right = newViewSize * newAspectRatio / 2;
  camera.top = newViewSize / 2;
  camera.bottom = newViewSize / -2;
  
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // 窗口大小改变时也需要更新标签位置
  // 在animate函数中更新已经覆盖了这里，但为了清晰起见可以留着或者调用一次更新函数
}); 