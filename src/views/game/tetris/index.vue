<!--
 * @Description: 俄罗斯方块游戏 (纯 Vue 现代化重构版)
 * @Author: 
 * @Date: 2026-03-13
-->
<template>
  <div class="tetris-container" tabindex="0" @keydown="handleKeydown" ref="gameContainer">
    <!-- 装饰背景 -->
    <div class="bg-decoration">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
    </div>

    <!-- 游戏面板主体 -->
    <div class="game-panel">
      <!-- 左侧信息区 (Next piece & Score) -->
      <aside class="side-panel left-panel">
        <div class="info-card">
          <div class="card-title">下一个</div>
          <div class="next-piece-box">
            <div 
              v-for="(row, rowIndex) in 4" 
              :key="'next-row-'+rowIndex" 
              class="mini-row"
            >
              <div 
                v-for="(col, colIndex) in 4" 
                :key="'next-col-'+colIndex" 
                class="mini-cell"
                :class="getNextPieceCellClass(rowIndex, colIndex)"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="info-card score-card">
          <div class="card-title">分数</div>
          <div class="score-value">{{ score }}</div>
        </div>
        <div class="info-card level-card">
          <div class="card-title">等级</div>
          <div class="score-value">{{ level }}</div>
        </div>
        <div class="info-card lines-card">
          <div class="card-title">消除行数</div>
          <div class="score-value">{{ lines }}</div>
        </div>
      </aside>

      <!-- 中间游戏主网格 -->
      <div class="main-board">
        <div class="board-grid">
          <div v-for="(row, y) in ROWS" :key="'r' + y" class="board-row">
            <div 
              v-for="(cell, x) in COLS" 
              :key="'c' + x" 
              class="board-cell"
              :class="getCellClass(x, y)"
            >
            </div>
          </div>
        </div>
        
        <!-- 游戏结束/暂停遮罩层 -->
        <div v-if="gameOver || isPaused" class="overlay">
          <div class="overlay-content">
            <h2 :class="gameOver ? 'game-over-text' : 'paused-text'">
              {{ gameOver ? 'GAME OVER' : '已暂停' }}
            </h2>
            <button class="action-btn" @click="startGame">
              {{ gameOver ? '重新开始' : '继续游戏' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧控制/操作区 -->
      <aside class="side-panel right-panel">
        <div class="info-card controls-card">
          <div class="card-title">操作说明</div>
          <ul class="controls-list">
            <li><kbd>↑</kbd> / <kbd>W</kbd><span>旋转</span></li>
            <li><kbd>←</kbd> / <kbd>A</kbd><span>左移</span></li>
            <li><kbd>→</kbd> / <kbd>D</kbd><span>右移</span></li>
            <li><kbd>↓</kbd> / <kbd>S</kbd><span>下落</span></li>
            <li><kbd>Space</kbd><span>瞬间落下</span></li>
            <li><kbd>P</kbd><span>暂停/继续</span></li>
          </ul>
        </div>
        
        <div class="mobile-controls">
          <div class="control-row">
            <button class="ctrl-btn" @click="rotate" title="旋转 (↑/W)">↻</button>
          </div>
          <div class="control-row">
            <button class="ctrl-btn" @click="moveLeft" title="左移 (←/A)">←</button>
            <button class="ctrl-btn" @click="moveDown" title="下落 (↓/S)">↓</button>
            <button class="ctrl-btn" @click="moveRight" title="右移 (→/D)">→</button>
          </div>
          <div class="control-row">
            <button class="ctrl-btn drop-btn" @click="hardDrop" title="瞬间落下 (Space)">⏬ 瞬间落下</button>
          </div>
        </div>
        
        <button v-if="!gameOver" class="action-btn pause-btn" @click="togglePause">
          {{ isPaused ? '▶ 继续' : '⏸ 暂停' }}
        </button>
      </aside>
    </div>
  </div>
</template>

<script>
// Tetromino 定义和颜色
const TETROMINOES = {
  I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: 'cyan' },
  J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: 'blue' },
  L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: 'orange' },
  O: { shape: [[1,1], [1,1]], color: 'yellow' },
  S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: 'green' },
  T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: 'purple' },
  Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: 'red' }
};

const SHAPES = Object.keys(TETROMINOES);
const ROWS = 20;
const COLS = 10;
const BASE_SPEED = 800;

export default {
  name: "TetrisGame",
  data() {
    return {
      ROWS,
      COLS,
      grid: [],           // 20x10 的静态网格
      currentPiece: null, // 当前下落的方块
      nextPieceType: '',  // 下一个方块类型
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      isPaused: true,     // 初始暂停，需点击开始
      timer: null
    };
  },
  created() {
    this.initGrid();
    // 强制游戏初始状态为 GameOver 或展示一个友好的开始界面
    this.gameOver = true; 
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.gameContainer) {
        this.$refs.gameContainer.focus();
      }
    });
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    // 1. 初始化
    initGrid() {
      this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    },
    startGame() {
      if (this.isPaused && !this.gameOver) {
        this.isPaused = false;
        this.startTimer();
        this.$refs.gameContainer.focus();
        return;
      }
      
      this.initGrid();
      this.score = 0;
      this.level = 1;
      this.lines = 0;
      this.gameOver = false;
      this.isPaused = false;
      
      this.nextPieceType = this.getRandomType();
      this.spawnPiece();
      this.startTimer();
      this.$nextTick(() => {
        if (this.$refs.gameContainer) {
          this.$refs.gameContainer.focus();
        }
      });
    },
    togglePause() {
      if (this.gameOver) return;
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.clearTimer();
      } else {
        this.startTimer();
        this.$nextTick(() => {
          if (this.$refs.gameContainer) {
            this.$refs.gameContainer.focus();
          }
        });
      }
    },
    
    // 2. 方块生成与时钟
    getRandomType() {
      return SHAPES[Math.floor(Math.random() * SHAPES.length)];
    },
    spawnPiece() {
      const type = this.nextPieceType;
      this.nextPieceType = this.getRandomType();
      
      const tetromino = TETROMINOES[type];
      this.currentPiece = {
        type: type,
        matrix: tetromino.shape,
        x: Math.floor(COLS / 2) - Math.floor(tetromino.shape[0].length / 2),
        y: 0,
      };

      // 出生即碰撞 = 游戏结束
      if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.matrix)) {
        this.gameOver = true;
        this.isPaused = false;
        this.clearTimer();
      }
    },
    startTimer() {
      this.clearTimer();
      // 根据等级提速
      const speed = Math.max(100, BASE_SPEED - (this.level - 1) * 70);
      this.timer = setInterval(() => {
        this.moveDown();
      }, speed);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    // 3. 移动与按键
    handleKeydown(e) {
      if (this.gameOver || this.isPaused) return;
      
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft();
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight();
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.moveDown();
          this.score += 1; // 软降加分
          e.preventDefault();
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.rotate();
          e.preventDefault();
          break;
        case 'Space':
          this.hardDrop();
          e.preventDefault();
          break;
        case 'KeyP':
          this.togglePause();
          e.preventDefault();
          break;
      }
    },
    moveLeft() {
      if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.matrix)) {
        this.currentPiece.x--;
      }
    },
    moveRight() {
      if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.matrix)) {
        this.currentPiece.x++;
      }
    },
    moveDown() {
      if (!this.currentPiece) return;
      if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.matrix)) {
        this.currentPiece.y++;
      } else {
        this.lockPiece();
      }
    },
    hardDrop() {
      let dropDistance = 0;
      while (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.matrix)) {
        this.currentPiece.y++;
        dropDistance++;
      }
      this.score += dropDistance * 2; // 硬降加分较多
      this.lockPiece();
    },
    rotate() {
      // 矩阵顺时针旋转
      const matrix = this.currentPiece.matrix;
      const N = matrix.length;
      const result = Array.from({ length: N }, () => Array(N).fill(0));
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          result[c][N - 1 - r] = matrix[r][c];
        }
      }
      
      // 踢墙判定 (Wall Kick)
      let offset = 0;
      if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, result)) {
        // 直接可以转
        this.currentPiece.matrix = result;
      } else if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, result)) {
        this.currentPiece.x--;
        this.currentPiece.matrix = result;
      } else if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, result)) {
        this.currentPiece.x++;
        this.currentPiece.matrix = result;
      }
    },

    // 4. 碰撞与结算
    checkCollision(x, y, matrix) {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] !== 0) {
            const gridX = x + c;
            const gridY = y + r;
            // 越界
            if (gridX < 0 || gridX >= COLS || gridY >= ROWS) {
              return true;
            }
            // 碰到底部已锁定方块 (由于在生出时可能gridY是负数，限制一下)
            if (gridY >= 0 && this.grid[gridY][gridX] !== null) {
              return true;
            }
          }
        }
      }
      return false;
    },
    lockPiece() {
      const { x, y, matrix, type } = this.currentPiece;
      
      // 将当前方块写死在棋盘里
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            const gridY = y + r;
            const gridX = x + c;
            if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
              // 必须使用Vue.$set或者改对象来触发视图更新
              this.$set(this.grid[gridY], gridX, TETROMINOES[type].color);
            }
          }
        }
      }
      
      this.clearLines();
      
      if (!this.gameOver) {
        this.spawnPiece();
      }
    },
    clearLines() {
      let linesCleared = 0;
      
      for (let r = ROWS - 1; r >= 0; r--) {
        // 如果该行没有任何一个是 null（代表满了）
        if (this.grid[r].every(cell => cell !== null)) {
          // 移除该行
          this.grid.splice(r, 1);
          // 顶部加一空行
          this.grid.unshift(Array(COLS).fill(null));
          linesCleared++;
          r++; // 因为整体下沉了，要重新检查当前行
        }
      }
      
      if (linesCleared > 0) {
        this.lines += linesCleared;
        // 计分系统：1行100，2行300，3行500，4行800，随着等级提高
        const scores = [0, 100, 300, 500, 800];
        this.score += scores[linesCleared] * this.level;
        
        // 每消除10行升级
        this.level = Math.floor(this.lines / 10) + 1;
        
        // 升级重新计算速度
        this.startTimer();
      }
    },

    // 5. 渲染绑定辅助方法
    getCellClass(x, y) {
      if (!this.grid || !this.grid[y]) return 'cell-empty';
      
      // 1. 本格子是否被锁定
      let color = this.grid[y][x];
      
      // 2. 本格子是否属于当前活动下落的方块
      if (!color && this.currentPiece) {
        const cx = x - this.currentPiece.x;
        const cy = y - this.currentPiece.y;
        if (
          cy >= 0 && cy < this.currentPiece.matrix.length &&
          cx >= 0 && cx < this.currentPiece.matrix[0].length &&
          this.currentPiece.matrix[cy][cx]
        ) {
          color = TETROMINOES[this.currentPiece.type].color;
        }
      }
      
      return color ? `cell-filled color-${color}` : 'cell-empty';
    },
    getNextPieceCellClass(r, c) {
      if (!this.nextPieceType) return 'cell-empty';
      const matrix = TETROMINOES[this.nextPieceType].shape;
      
      // 让方块在小方格网中居中
      const N = matrix.length; 
      const offset = N === 2 ? 1 : 0;
      
      if (r >= offset && r < offset + N && c >= offset && c < offset + N) {
        if (matrix[r - offset][c - offset]) {
           return `cell-filled color-${TETROMINOES[this.nextPieceType].color}`;
        }
      }
      return 'cell-empty';
    }
  }
};
</script>

<style scoped>
:root {
  --cell-size: 24px;
  --panel-bg: rgba(20, 25, 40, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}

/* 全局容器 */
.tetris-container {
  min-height: 100vh;
  background-color: #0b0f19;
  background-image: radial-gradient(circle at 50% 50%, #151f33 0%, #06080d 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none; /* 去除focus边框 */
  font-family: 'Inter', "Microsoft YaHei", sans-serif;
  color: #fff;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* 装饰光效 */
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}
.glow-1 {
  width: 400px; height: 400px; background: #3b82f6; 
  top: -100px; left: -100px; 
  animation: float 20s infinite alternate;
}
.glow-2 {
  width: 300px; height: 300px; background: #8b5cf6;
  bottom: -50px; right: -50px;
  animation: float 15s infinite alternate-reverse;
}
.glow-3 {
  width: 500px; height: 500px; background: #ec4899;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  animation: pulse 12s infinite;
  opacity: 0.1;
}

@keyframes float {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* 游戏主体布局 */
.game-panel {
  display: flex;
  gap: 30px;
  z-index: 10;
  align-items: flex-start;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

/* 侧边信息栏 */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 160px;
}

.info-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.05);
}

.card-title {
  font-size: 0.85rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 8px;
}

.score-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.8rem;
  font-weight: 800;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

.lines-card .score-value { color: #34d399; text-shadow: 0 0 10px rgba(52, 211, 153, 0.4); }
.level-card .score-value { color: #f472b6; text-shadow: 0 0 10px rgba(244, 114, 182, 0.4); }

/* 预览盒子 */
.next-piece-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 80px;
}
.mini-row {
  display: flex;
  gap: 2px;
}
.mini-cell {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

/* 主干网格 */
.main-board {
  position: relative;
  background: #0f121b;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.board-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
}

.board-row {
  display: flex;
  gap: 1px;
}

.board-cell {
  width: 28px;
  height: 28px;
  border-radius: 3px;
  transition: background-color 0.1s;
}

.cell-empty {
  background: rgba(30, 35, 50, 0.6);
}

/* 颜色配置 (灵感来自经典方块颜色) */
.cell-filled {
  box-shadow: inset 0px 4px 6px -2px rgba(255,255,255,0.4), 
              inset 0px -4px 6px -2px rgba(0,0,0,0.5);
}

.color-cyan   { background-color: #06b6d4; }
.color-blue   { background-color: #3b82f6; }
.color-orange { background-color: #f97316; }
.color-yellow { background-color: #eab308; }
.color-green  { background-color: #22c55e; }
.color-purple { background-color: #a855f7; }
.color-red    { background-color: #ef4444; }

/* 暂停/结束 弹窗 */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.overlay-content {
  text-align: center;
}

.game-over-text {
  font-size: 2.2rem;
  color: #ef4444;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
}

.paused-text {
  font-size: 2.2rem;
  color: #38bdf8;
  margin-bottom: 20px;
  letter-spacing: 5px;
}

/* 按钮及交互 */
.action-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
}

.pause-btn {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  font-size: 0.95rem;
}
.pause-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 帮助面板 */
.controls-card {
  text-align: left;
}
.controls-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.8rem;
  color: #cbd5e1;
}
.controls-list li {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 6px;
}
.controls-list li span {
  margin-left: auto;
  color: #94a3b8;
}
kbd {
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: inherit;
  font-size: 0.75rem;
  box-shadow: 0 2px 0 rgba(0,0,0,0.5);
}

/* 移动端屏幕按键 (响应式) */
.mobile-controls {
  display: none;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.control-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.ctrl-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
}
.ctrl-btn:active {
  background: rgba(255, 255, 255, 0.25);
}
.drop-btn {
  width: 100%;
  border-radius: 12px;
  font-size: 1rem;
}

@media (max-width: 800px) {
  .game-panel {
    flex-direction: column;
    align-items: center;
    padding: 15px;
  }
  .side-panel {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  .info-card { flex: 1; min-width: 100px;}
  .controls-card { display: none; }
  .mobile-controls { display: flex; width: 100%; order: 10; }
  .board-cell { width: 22px; height: 22px; }
}
</style>