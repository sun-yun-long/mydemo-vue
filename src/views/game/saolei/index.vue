<!--
 * @Description: 扫雷游戏 (优化版)
 * @Author: 
 * @Date: 2026-03-13
-->
<template>
  <div class="minesweeper-container">
    <div class="game-board">
      
      <header class="game-header">
        <h1 class="game-title">
          <span class="title-icon">💣</span>
          扫雷游戏
        </h1>
        <p class="game-subtitle">Minesweeper</p>
      </header>

      <!-- 难度选择 -->
      <div class="difficulty-panel">
        <button
          v-for="diff in difficulties"
          :key="diff.name"
          class="diff-btn"
          :class="{ active: currentDiff === diff }"
          @click="setDifficulty(diff)"
        >
          {{ diff.name }}
        </button>
      </div>

      <!-- 游戏头部信息栏 -->
      <div class="header-panel">
        <div class="mine-counter">
          <span class="icon">🚩</span>
          <span class="lcd-text">{{ zeroPad(minesLeft, 3) }}</span>
        </div>
        <div class="status-face" @click="resetGame" title="重新开始">
          {{ faceEmoji }}
        </div>
        <div class="timer">
          <span class="icon">⏱️</span>
          <span class="lcd-text">{{ zeroPad(seconds, 3) }}</span>
        </div>
      </div>

      <!-- 棋盘区域 -->
      <div class="grid-container" @contextmenu.prevent>
        <div
          class="grid"
          :style="{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`
          }"
        >
          <template v-for="(row, r) in board">
            <div
              v-for="(cell, c) in row"
              :key="`${r}-${c}`"
              class="cell"
              :class="{
                'revealed': cell.isRevealed,
                'mine': cell.isRevealed && cell.isMine,
                'exploded': cell.isExploded,
                'flagged': cell.isFlagged,
                ['num-' + cell.neighborMines]: cell.isRevealed && !cell.isMine && cell.neighborMines > 0
              }"
              @click="handleLeftClick(r, c)"
              @contextmenu.prevent="handleRightClick(r, c)"
              @mousedown="handleMouseDown"
              @mouseup="handleMouseUp"
            >
              <template v-if="cell.isRevealed">
                <span v-if="cell.isMine">💣</span>
                <span v-else-if="cell.neighborMines > 0">{{ cell.neighborMines }}</span>
              </template>
              <template v-else-if="cell.isFlagged">
                🚩
              </template>
              <template v-else-if="gameState === 'lost' && cell.isMine && !cell.isFlagged">
                 💣
              </template>
              <!-- 输了的时候显示插错的旗子 -->
              <template v-else-if="gameState === 'lost' && !cell.isMine && cell.isFlagged">
                 ❌
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SaoleiGame",
  data() {
    return {
      difficulties: [
        { name: "初级", rows: 9, cols: 9, mines: 10 },
        { name: "中级", rows: 16, cols: 16, mines: 40 },
        { name: "高级", rows: 16, cols: 30, mines: 99 },
      ],
      currentDiff: null,
      rows: 0,
      cols: 0,
      totalMines: 0,
      
      board: [],
      gameState: "ready", // ready, playing, won, lost
      isFirstClick: true,
      
      minesLeft: 0,
      seconds: 0,
      timer: null,
      isMouseDown: false,
      
      dirs: [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ],
    };
  },
  computed: {
    faceEmoji() {
      if (this.gameState === "lost") return "😵"; // 晕
      if (this.gameState === "won") return "😎";  // 酷
      if (this.isMouseDown) return "😮";         // 惊讶
      return "🙂";                               // 微笑
    },
  },
  created() {
    this.setDifficulty(this.difficulties[0]);
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    setDifficulty(diff) {
      this.currentDiff = diff;
      this.rows = diff.rows;
      this.cols = diff.cols;
      this.totalMines = diff.mines;
      this.resetGame();
    },
    resetGame() {
      this.stopTimer();
      this.seconds = 0;
      this.minesLeft = this.totalMines;
      this.gameState = "ready";
      this.isFirstClick = true;
      this.isMouseDown = false;
      this.initBoard();
    },
    initBoard() {
      const newBoard = [];
      for (let r = 0; r < this.rows; r++) {
        const row = [];
        for (let c = 0; c < this.cols; c++) {
          row.push({
            r,
            c,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            isExploded: false,
            neighborMines: 0,
          });
        }
        newBoard.push(row);
      }
      this.board = Object.freeze(newBoard).map(r => r.slice()); // triggers Vue reactivity properly for inner objects
      this.board = newBoard; // Let Vue observe all objects deeply
    },
    placeMines(firstR, firstC) {
      let placed = 0;
      
      // 第一步点击位置及其周围8格不放置地雷
      const excludeSet = new Set();
      excludeSet.add(`${firstR},${firstC}`);
      for (const [dr, dc] of this.dirs) {
        const nr = firstR + dr;
        const nc = firstC + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          excludeSet.add(`${nr},${nc}`);
        }
      }

      while (placed < this.totalMines) {
        const r = Math.floor(Math.random() * this.rows);
        const c = Math.floor(Math.random() * this.cols);
        
        if (!this.board[r][c].isMine && !excludeSet.has(`${r},${c}`)) {
          this.board[r][c].isMine = true;
          placed++;
        }
        
        // 降级：如果地图太小排雷区域限制导致无法放置全部地雷，只保护点击中心点
        if (placed < this.totalMines && excludeSet.size > 1 && (this.rows * this.cols - excludeSet.size < this.totalMines)) {
           excludeSet.clear();
           excludeSet.add(`${firstR},${firstC}`);
        }
      }

      // 计算每个格子周围的雷数
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (!this.board[r][c].isMine) {
            let count = 0;
            for (const [dr, dc] of this.dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                if (this.board[nr][nc].isMine) count++;
              }
            }
            this.board[r][c].neighborMines = count;
          }
        }
      }
    },
    handleLeftClick(r, c) {
      if (this.gameState === "won" || this.gameState === "lost") return;
      
      const cell = this.board[r][c];
      if (cell.isFlagged || cell.isRevealed) return;

      if (this.isFirstClick) {
        this.isFirstClick = false;
        this.gameState = "playing";
        this.placeMines(r, c);
        this.startTimer();
      }

      if (cell.isMine) {
        this.gameOver(false, cell);
      } else {
        this.reveal(r, c);
        this.checkWin();
      }
    },
    handleRightClick(r, c) {
      if (this.gameState === "won" || this.gameState === "lost") return;
      if (this.isFirstClick) return; 
      
      const cell = this.board[r][c];
      if (cell.isRevealed) return;

      cell.isFlagged = !cell.isFlagged;
      this.minesLeft += cell.isFlagged ? -1 : 1;
    },
    handleMouseDown(e) {
      // 左键点击时产生惊讶表情
      if (e.button === 0 && (this.gameState === "playing" || this.gameState === "ready")) {
        this.isMouseDown = true;
      }
    },
    handleMouseUp() {
      this.isMouseDown = false;
    },
    reveal(r, c) {
      const cell = this.board[r][c];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
      
      cell.isRevealed = true;
      
      // 如果周围没有地雷，展开周围的格子
      if (cell.neighborMines === 0) {
        const queue = [[r, c]];
        while (queue.length > 0) {
          const [currR, currC] = queue.shift();
          for (const [dr, dc] of this.dirs) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
              const neighbor = this.board[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    },
    checkWin() {
      let unrevealed = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (!this.board[r][c].isRevealed) {
            unrevealed++;
          }
        }
      }
      
      // 所有非雷区域都被揭开
      if (unrevealed === this.totalMines) {
        this.gameOver(true);
      }
    },
    gameOver(isWin, explodedCell = null) {
      this.gameState = isWin ? "won" : "lost";
      this.stopTimer();
      
      if (isWin) {
        this.minesLeft = 0;
        // 把所有的雷标上红旗
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            if (this.board[r][c].isMine && !this.board[r][c].isFlagged) {
              this.board[r][c].isFlagged = true;
            }
          }
        }
      } else {
        if (explodedCell) {
          explodedCell.isExploded = true;
        }
        // 显示除了正确插旗外的所有雷
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            const cell = this.board[r][c];
            if (cell.isMine && !cell.isFlagged) {
              cell.isRevealed = true;
            }
          }
        }
      }
    },
    startTimer() {
      this.stopTimer();
      this.timer = setInterval(() => {
        if (this.seconds < 999) {
          this.seconds++;
        }
      }, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    zeroPad(num, places) {
      // 容错负数
      if (num < 0) return "-" + String(Math.abs(num)).padStart(places - 1, '0');
      return String(num).padStart(places, '0');
    }
  }
};
</script>

<style scoped>
/* 全局容器 */
.minesweeper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b);
  font-family: 'Inter', "PingFang SC", "Microsoft YaHei", sans-serif;
  user-select: none;
  padding: 20px;
}

/* 游戏面板 */
.game-board {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 标题 */
.game-header {
  text-align: center;
  position: relative;
}

.game-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #c7d2fe, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
  margin: 0;
}

.title-icon {
  font-size: 1.4rem;
  -webkit-text-fill-color: initial;
}

.game-subtitle {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

/* 难度面板 */
.difficulty-panel {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.diff-btn {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.diff-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.diff-btn.active {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
}

/* 顶部信息栏 */
.header-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px 20px;
  border-radius: 12px;
  border: inset 2px rgba(255, 255, 255, 0.05);
}

.mine-counter, .timer {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #000;
  padding: 6px 12px;
  border-radius: 8px;
  border: inset 2px #333;
}

.icon {
  font-size: 1.2rem;
}

.lcd-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ef4444; 
  line-height: 1;
  text-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
}

.status-face {
  font-size: 2rem;
  cursor: pointer;
  background: radial-gradient(circle at 35% 35%, #fde047, #eab308);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 
    inset -2px -2px 5px rgba(0, 0, 0, 0.3),
    inset 2px 2px 5px rgba(255, 255, 255, 0.6),
    0 4px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.1s, box-shadow 0.1s;
}

.status-face:active {
  transform: scale(0.95);
  box-shadow: inset 2px 2px 6px rgba(0, 0, 0, 0.4);
}

/* 棋盘 */
.grid-container {
  display: inline-block;
  background: #9ca3af;
  padding: 10px;
  border-radius: 10px;
  border: inset 4px #6b7280;
  align-self: center;
}

.grid {
  display: grid;
  gap: 1px;
  background: #4b5563;
}

/* 单元格 */
.cell {
  width: 32px;
  height: 32px;
  background: #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 
    inset 2px 2px 0px rgba(255, 255, 255, 0.9),
    inset -2px -2px 0px rgba(0, 0, 0, 0.4);
  transition: background-color 0.1s;
}

.cell:active:not(.revealed):not(.flagged) {
  background: #9ca3af;
  box-shadow: none;
}

.cell.revealed {
  background: #e5e7eb;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.15);
  cursor: default;
}

/* 特殊格子 */
.cell.mine {
  background: #f3f4f6;
}

.cell.exploded {
  background: #ef4444 !important; /* 红底爆炸 */
}

/* 数字颜色 */
.num-1 { color: #2563eb; }
.num-2 { color: #16a34a; }
.num-3 { color: #dc2626; }
.num-4 { color: #1e3a8a; }
.num-5 { color: #7f1d1d; }
.num-6 { color: #0d9488; }
.num-7 { color: #000000; }
.num-8 { color: #52525b; }

@media (max-width: 800px) {
  .cell {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
}
</style>