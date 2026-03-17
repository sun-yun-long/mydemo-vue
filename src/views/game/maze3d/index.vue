<template>
  <div class="maze3d-container" @keydown="onKeyDown" @keyup="onKeyUp" tabindex="0" ref="container">
    <!-- HUD 信息栏 -->
    <div class="hud-bar">
      <div class="hud-left">
        <span class="hud-label">🏆 步数</span>
        <span class="hud-value">{{ steps }}</span>
      </div>
      <div class="hud-center">
        <span class="hud-title">3D 迷宫探险</span>
      </div>
      <div class="hud-right">
        <span class="hud-label">⏱ 时间</span>
        <span class="hud-value">{{ formattedTime }}</span>
      </div>
    </div>

    <!-- Three.js 渲染容器 -->
    <div ref="threeContainer" class="three-container" @click="requestPointerLock"></div>

    <!-- 准星 -->
    <div class="crosshair" v-show="isPointerLocked">+</div>

    <!-- 点击提示 -->
    <div class="lock-hint" v-show="!isPointerLocked && !showHint && !hasWon">
      <span>🖱 点击画面锁定鼠标控制视角</span>
    </div>

    <!-- 小地图 -->
    <canvas ref="minimap" class="minimap"></canvas>

    <!-- 操作提示 -->
    <div class="controls-hint" v-if="showHint">
      <div class="hint-content">
        <p><kbd>W</kbd><kbd>S</kbd> 前后移动　<kbd>A</kbd><kbd>D</kbd> 左右平移</p>
        <p>🖱 <strong>鼠标</strong> 控制视角方向</p>
        <p>到达 <span class="goal-marker">🟢 绿色光柱</span> 即为过关</p>
        <button class="hint-close" @click="startPlay">开始探险</button>
      </div>
    </div>

    <!-- 胜利弹窗 -->
    <transition name="fade">
      <div class="win-overlay" v-if="hasWon">
        <div class="win-dialog">
          <div class="win-emoji">🎉</div>
          <h2>恭喜通关！</h2>
          <p>步数：<strong>{{ steps }}</strong>　耗时：<strong>{{ formattedTime }}</strong></p>
          <div class="win-btns">
            <button class="btn-restart" @click="restartGame">再来一局</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as THREE from 'three';

// ===== 迷宫生成算法（递归回溯 DFS）=====
function generateMaze(rows, cols) {
  const h = rows * 2 + 1;
  const w = cols * 2 + 1;
  const grid = [];
  for (let y = 0; y < h; y++) {
    grid[y] = [];
    for (let x = 0; x < w; x++) {
      grid[y][x] = 1;
    }
  }

  const visited = [];
  for (let y = 0; y < rows; y++) {
    visited[y] = [];
    for (let x = 0; x < cols; x++) {
      visited[y][x] = false;
    }
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function carve(cy, cx) {
    visited[cy][cx] = true;
    grid[cy * 2 + 1][cx * 2 + 1] = 0;
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    shuffle(dirs);
    for (const [dy, dx] of dirs) {
      const ny = cy + dy;
      const nx = cx + dx;
      if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && !visited[ny][nx]) {
        grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = 0;
        carve(ny, nx);
      }
    }
  }

  carve(0, 0);
  return { grid, w, h };
}

export default {
  name: 'Maze3D',
  data() {
    return {
      maze: null,
      mazeW: 0,
      mazeH: 0,
      playerX: 1.5,
      playerY: 1.5,
      playerAngle: 0,
      goalX: 0,
      goalY: 0,
      keys: {},
      steps: 0,
      startTime: 0,
      elapsed: 0,
      hasWon: false,
      showHint: true,
      animFrame: null,
      timerInterval: null,
      // Three.js 对象
      scene: null,
      camera: null,
      renderer: null,
      playerLight: null,
      goalGroup: null,
      clock: null,
      // 鼠标控制
      isPointerLocked: false,
    };
  },
  computed: {
    formattedTime() {
      const s = Math.floor(this.elapsed / 1000);
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
  },
  mounted() {
    this.initGame();
    this.$refs.container.focus();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animFrame);
    clearInterval(this.timerInterval);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initGame() {
      const MAZE_ROWS = 8;
      const MAZE_COLS = 8;
      const { grid, w, h } = generateMaze(MAZE_ROWS, MAZE_COLS);
      this.maze = grid;
      this.mazeW = w;
      this.mazeH = h;

      this.playerX = 1.5;
      this.playerY = 1.5;
      this.playerAngle = 0;
      this.goalX = w - 2;
      this.goalY = h - 2;

      this.steps = 0;
      this.elapsed = 0;
      this.hasWon = false;
      this.startTime = Date.now();

      // 设置小地图
      this.setupMinimap();

      // 设置 Three.js 场景
      this.setupThreeScene();

      // 计时器
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (!this.hasWon) {
          this.elapsed = Date.now() - this.startTime;
        }
      }, 200);

      // 启动游戏循环
      cancelAnimationFrame(this.animFrame);
      this.clock = new THREE.Clock();
      this.gameLoop();
    },

    setupMinimap() {
      const minimap = this.$refs.minimap;
      const scale = 6;
      minimap.width = this.mazeW * scale;
      minimap.height = this.mazeH * scale;
    },

    // ===== Three.js 场景搭建 =====
    setupThreeScene() {
      const container = this.$refs.threeContainer;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // 清理旧渲染器
      if (this.renderer) {
        container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
      }

      // 场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a1e);
      scene.fog = new THREE.FogExp2(0x0a0a1e, 0.06);
      this.scene = scene;

      // 摄像机（第一人称）
      const camera = new THREE.PerspectiveCamera(65, width / height, 0.05, 100);
      camera.position.set(this.playerX, 0.6, this.playerY);
      this.camera = camera;

      // 渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      // 环境光 - 提高基本亮度，确保视野内有基本可见度
      const ambientLight = new THREE.AmbientLight(0x6688bb, 0.8);
      scene.add(ambientLight);

      // 半球光（天/地色对比，增加层次感）
      const hemiLight = new THREE.HemisphereLight(0x6688cc, 0x222244, 0.6);
      scene.add(hemiLight);

      // 玩家随身提灯（点光源）- 增大范围和强度
      const playerLight = new THREE.PointLight(0xffeedd, 3, 15, 1.5);
      playerLight.position.set(this.playerX, 1.0, this.playerY);
      playerLight.castShadow = true;
      playerLight.shadow.mapSize.width = 512;
      playerLight.shadow.mapSize.height = 512;
      scene.add(playerLight);
      this.playerLight = playerLight;

      // ===== 构建迷宫几何 =====
      this.buildMazeGeometry(scene);

      // ===== 终点标记 =====
      this.createGoalMarker(scene);
    },

    buildMazeGeometry(scene) {
      const wallHeight = 1.8;

      // 墙壁材质
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x4466aa,
        roughness: 0.7,
        metalness: 0.15,
      });

      // 使用合并几何体优化性能
      const wallGeometry = new THREE.BoxGeometry(1, wallHeight, 1);
      const wallMeshes = [];

      for (let y = 0; y < this.mazeH; y++) {
        for (let x = 0; x < this.mazeW; x++) {
          if (this.maze[y][x] === 1) {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.position.set(x + 0.5, wallHeight / 2, y + 0.5);
            wall.castShadow = true;
            wall.receiveShadow = true;
            scene.add(wall);
            wallMeshes.push(wall);
          }
        }
      }

      // 地面
      const floorGeometry = new THREE.PlaneGeometry(this.mazeW, this.mazeH);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3e,
        roughness: 0.8,
        metalness: 0.1,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(this.mazeW / 2, 0, this.mazeH / 2);
      floor.receiveShadow = true;
      scene.add(floor);

      // 天花板
      const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0e0e1a,
        roughness: 1.0,
        metalness: 0,
      });
      const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.set(this.mazeW / 2, wallHeight, this.mazeH / 2);
      scene.add(ceiling);
    },

    createGoalMarker(scene) {
      const gx = this.goalX + 0.5;
      const gy = this.goalY + 0.5;

      const goalGroup = new THREE.Group();

      // 发光光柱（中心圆柱）
      const pillarGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
      const pillarMaterial = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.9,
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(0, 0.6, 0);
      goalGroup.add(pillar);

      // 外层光晕
      const glowGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16, 1, true);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(0, 0.6, 0);
      goalGroup.add(glow);

      // 底部环形光
      const ringGeometry = new THREE.RingGeometry(0.15, 0.4, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.01, 0);
      goalGroup.add(ring);

      // 终点点光源
      const goalLight = new THREE.PointLight(0x4ade80, 2, 5, 2);
      goalLight.position.set(0, 0.8, 0);
      goalGroup.add(goalLight);

      goalGroup.position.set(gx, 0, gy);
      scene.add(goalGroup);
      this.goalGroup = goalGroup;
    },

    // ===== 输入处理 =====
    onKeyDown(e) {
      this.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
      }
    },
    onKeyUp(e) {
      this.keys[e.key] = false;
    },

    // ===== 鼠标控制 =====
    requestPointerLock() {
      const container = this.$refs.threeContainer;
      if (container && container.requestPointerLock) {
        container.requestPointerLock();
      }
    },
    onPointerLockChange() {
      this.isPointerLocked = (document.pointerLockElement === this.$refs.threeContainer);
    },
    onMouseMove(e) {
      if (!this.isPointerLocked) return;
      const sensitivity = 0.002;
      this.playerAngle -= e.movementX * sensitivity;
    },
    startPlay() {
      this.showHint = false;
      // 注册 pointer lock 事件
      document.addEventListener('pointerlockchange', this.onPointerLockChange);
      document.addEventListener('mousemove', this.onMouseMove);
      this.$nextTick(() => {
        this.requestPointerLock();
      });
    },

    // ===== 游戏主循环 =====
    gameLoop() {
      this.update();
      this.renderScene();
      this.renderMinimap();
      this.animFrame = requestAnimationFrame(() => this.gameLoop());
    },

    update() {
      if (this.hasWon) return;

      const moveSpeed = 0.06;
      let moved = false;
      const k = this.keys;

      // 前方方向向量
      const dirX = Math.sin(this.playerAngle);
      const dirZ = Math.cos(this.playerAngle);
      // 右方方向向量
      const rightX = -Math.cos(this.playerAngle);
      const rightZ = Math.sin(this.playerAngle);

      // 前进
      if (k['ArrowUp'] || k['w'] || k['W']) {
        const nx = this.playerX + dirX * moveSpeed;
        const ny = this.playerY + dirZ * moveSpeed;
        if (this.canMove(nx, ny)) {
          this.playerX = nx;
          this.playerY = ny;
          moved = true;
        }
      }
      // 后退
      if (k['ArrowDown'] || k['s'] || k['S']) {
        const nx = this.playerX - dirX * moveSpeed;
        const ny = this.playerY - dirZ * moveSpeed;
        if (this.canMove(nx, ny)) {
          this.playerX = nx;
          this.playerY = ny;
          moved = true;
        }
      }
      // 左平移
      if (k['ArrowLeft'] || k['a'] || k['A']) {
        const nx = this.playerX - rightX * moveSpeed;
        const ny = this.playerY - rightZ * moveSpeed;
        if (this.canMove(nx, ny)) {
          this.playerX = nx;
          this.playerY = ny;
          moved = true;
        }
      }
      // 右平移
      if (k['ArrowRight'] || k['d'] || k['D']) {
        const nx = this.playerX + rightX * moveSpeed;
        const ny = this.playerY + rightZ * moveSpeed;
        if (this.canMove(nx, ny)) {
          this.playerX = nx;
          this.playerY = ny;
          moved = true;
        }
      }

      if (moved) this.steps++;

      // 更新摄像机：position + lookAt
      this.camera.position.set(this.playerX, 0.6, this.playerY);
      const lookX = this.playerX + dirX;
      const lookZ = this.playerY + dirZ;
      this.camera.lookAt(lookX, 0.6, lookZ);

      // 更新玩家灯光
      this.playerLight.position.set(this.playerX, 1.0, this.playerY);

      // 终点动画：光柱旋转 + 呼吸发光
      if (this.goalGroup) {
        const t = Date.now() * 0.001;
        this.goalGroup.rotation.y = t * 1.5;
        const pulse = 0.7 + 0.3 * Math.sin(t * 3);
        this.goalGroup.children.forEach(child => {
          if (child.isLight) {
            child.intensity = 1.5 + pulse;
          }
        });
      }

      // 检查胜利
      const dx = this.playerX - (this.goalX + 0.5);
      const dy = this.playerY - (this.goalY + 0.5);
      if (Math.sqrt(dx * dx + dy * dy) < 0.6) {
        this.hasWon = true;
      }
    },

    canMove(nx, ny) {
      const margin = 0.2;
      const checks = [
        [nx - margin, ny - margin],
        [nx + margin, ny - margin],
        [nx - margin, ny + margin],
        [nx + margin, ny + margin],
      ];
      for (const [cx, cy] of checks) {
        const mx = Math.floor(cx);
        const my = Math.floor(cy);
        if (mx < 0 || my < 0 || mx >= this.mazeW || my >= this.mazeH) return false;
        if (this.maze[my][mx] === 1) return false;
      }
      return true;
    },

    renderScene() {
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },

    // ===== 小地图 =====
    renderMinimap() {
      const canvas = this.$refs.minimap;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const scale = 6;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // 背景
      ctx.fillStyle = 'rgba(5, 5, 16, 0.75)';
      ctx.fillRect(0, 0, W, H);

      // 迷宫
      for (let y = 0; y < this.mazeH; y++) {
        for (let x = 0; x < this.mazeW; x++) {
          if (this.maze[y][x] === 1) {
            ctx.fillStyle = 'rgba(42, 58, 92, 0.8)';
          } else {
            ctx.fillStyle = 'rgba(26, 26, 46, 0.3)';
          }
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }

      // 终点
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc((this.goalX + 0.5) * scale, (this.goalY + 0.5) * scale, scale * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 玩家
      ctx.fillStyle = '#ff6b6b';
      ctx.shadowColor = '#ff6b6b';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(this.playerX * scale, this.playerY * scale, scale * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 朝向线
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.playerX * scale, this.playerY * scale);
      ctx.lineTo(
        (this.playerX + Math.sin(this.playerAngle) * 2) * scale,
        (this.playerY + Math.cos(this.playerAngle) * 2) * scale
      );
      ctx.stroke();
    },

    onResize() {
      const container = this.$refs.threeContainer;
      if (!container || !this.camera || !this.renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },

    restartGame() {
      // 清除旧场景
      if (this.scene) {
        while (this.scene.children.length > 0) {
          this.scene.remove(this.scene.children[0]);
        }
      }
      this.initGame();
      this.$refs.container.focus();
    }
  }
};
</script>

<style scoped>
.maze3d-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 130px);
  background: #050510;
  outline: none;
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
}

.three-container {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
  cursor: pointer;
}

/* 准星 */
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 15;
  text-shadow: 0 0 4px rgba(0,0,0,0.8);
  font-family: monospace;
  line-height: 1;
}

/* 鼠标锁定提示 */
.lock-hint {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;
}
.lock-hint span {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 24px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* HUD 信息栏 */
.hud-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, rgba(5, 5, 16, 0.95) 0%, rgba(5, 5, 16, 0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 10;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(74, 222, 128, 0.15);
}
.hud-left, .hud-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hud-label {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
}
.hud-value {
  font-size: 20px;
  font-weight: 700;
  color: #67e8f9;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 8px rgba(103, 232, 249, 0.5);
}
.hud-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  letter-spacing: 3px;
  text-shadow: 0 0 12px rgba(74, 222, 128, 0.3);
}

/* 小地图 */
.minimap {
  position: absolute;
  bottom: 16px;
  right: 16px;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 2px 16px rgba(0,0,0,0.6), 0 0 12px rgba(74, 222, 128, 0.1);
}

/* 操作提示 */
.controls-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.hint-content {
  background: rgba(5, 5, 16, 0.9);
  backdrop-filter: blur(12px);
  padding: 20px 32px;
  border-radius: 14px;
  color: #fff;
  text-align: center;
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
.hint-content p {
  margin: 8px 0;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}
.hint-content kbd {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  padding: 3px 10px;
  margin: 0 3px;
  font-size: 13px;
  font-family: monospace;
  color: #67e8f9;
  text-shadow: 0 0 4px rgba(103, 232, 249, 0.4);
}
.goal-marker {
  color: #4ade80;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.4);
}
.hint-close {
  margin-top: 12px;
  padding: 8px 28px;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.7), rgba(34, 197, 94, 0.7));
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(74, 222, 128, 0.3);
}
.hint-close:hover {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.9), rgba(34, 197, 94, 0.9));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.5);
}

/* 胜利弹窗 */
.win-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 16, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  backdrop-filter: blur(8px);
}
.win-dialog {
  background: linear-gradient(145deg, #1a1a3e, #0a0a20);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 20px;
  padding: 44px 56px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(74, 222, 128, 0.1);
}
.win-emoji {
  font-size: 60px;
  margin-bottom: 12px;
}
.win-dialog h2 {
  margin: 0;
  font-size: 30px;
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
}
.win-dialog p {
  font-size: 16px;
  color: rgba(255,255,255,0.65);
  margin: 18px 0 28px;
}
.win-dialog strong {
  color: #fbbf24;
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
}
.btn-restart {
  padding: 12px 36px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(135deg, #409EFF, #3b82f6);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.4);
}
.btn-restart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(64, 158, 255, 0.6);
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
