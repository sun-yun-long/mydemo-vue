<!--
 * @Description: 五子棋游戏
 * @Author:
 * @Date: 2026-03-13
-->
<template>
  <div class="gobang-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>

    <!-- 标题区域 -->
    <header class="game-header">
      <h1 class="game-title">
        <span class="title-icon">⚫</span>
        五子棋
        <span class="title-icon">⚪</span>
      </h1>
      <p class="game-subtitle">Gomoku</p>
    </header>

    <!-- 游戏主体 -->
    <div class="game-body">
      <!-- 左侧面板 -->
      <aside class="side-panel left-panel">
        <!-- 游戏信息 -->
        <div class="panel-card info-card">
          <div class="card-header">
            <span class="card-icon">🎮</span>
            <span>游戏信息</span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">模式</span>
              <span class="info-value">{{ modeLabel }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">难度</span>
              <span class="info-value">
                <span v-for="i in 3" :key="i" class="star" :class="{ active: i <= difficulty }">★</span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">步数</span>
              <span class="info-value step-count">{{ history.length }}</span>
            </div>
          </div>
        </div>

        <!-- 玩家信息 -->
        <div class="panel-card player-card">
          <div class="card-header">
            <span class="card-icon">👥</span>
            <span>对局双方</span>
          </div>
          <div class="card-body">
            <div class="player-info" :class="{ active: currentPlayer === 1 && !gameOver }">
              <div class="player-piece black-piece"></div>
              <div class="player-detail">
                <span class="player-name">{{ mode === 'ai' ? '你' : '玩家一' }}</span>
                <span class="player-score">{{ scores.black }} 胜</span>
              </div>
              <div class="turn-indicator" v-if="currentPlayer === 1 && !gameOver">
                <span class="pulse-dot"></span>
              </div>
            </div>
            <div class="vs-divider">VS</div>
            <div class="player-info" :class="{ active: currentPlayer === 2 && !gameOver }">
              <div class="player-piece white-piece"></div>
              <div class="player-detail">
                <span class="player-name">{{ mode === 'ai' ? 'AI' : '玩家二' }}</span>
                <span class="player-score">{{ scores.white }} 胜</span>
              </div>
              <div class="turn-indicator" v-if="currentPlayer === 2 && !gameOver">
                <span class="pulse-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 棋盘区域 -->
      <div class="board-area">
        <!-- 状态栏 -->
        <div class="status-bar" :class="statusClass">
          <transition name="fade" mode="out-in">
            <span :key="statusText" class="status-text">{{ statusText }}</span>
          </transition>
        </div>

        <!-- 棋盘 -->
        <div class="board-wrapper">
          <div class="board" ref="board">
            <div v-for="row in boardSize" :key="'row' + row" class="board-row">
              <div v-for="col in boardSize" :key="'cell' + row + '-' + col"
                class="board-cell"
                :class="{
                  'top-edge': row === 1,
                  'bottom-edge': row === boardSize,
                  'left-edge': col === 1,
                  'right-edge': col === boardSize,
                }"
                @click="handleClick(row - 1, col - 1)"
                @mouseenter="hoverPos = { row: row - 1, col: col - 1 }"
                @mouseleave="hoverPos = null">

                <!-- 星位标记 -->
                <span v-if="isStarPoint(row - 1, col - 1)" class="star-dot"></span>

                <!-- 棋子 -->
                <transition name="piece-drop">
                  <div v-if="board[row - 1][col - 1] !== 0" class="piece" :class="{
                    'black': board[row - 1][col - 1] === 1,
                    'white': board[row - 1][col - 1] === 2,
                    'last-move': isLastMove(row - 1, col - 1),
                    'win-piece': isWinPiece(row - 1, col - 1),
                  }">
                    <span v-if="showOrder" class="piece-order">{{ getMoveOrder(row - 1, col - 1) }}</span>
                  </div>
                </transition>

                <!-- 鼠标悬浮提示 -->
                <div v-if="showHover(row - 1, col - 1)" class="hover-hint"
                  :class="currentPlayer === 1 ? 'black' : 'white'">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <aside class="side-panel right-panel">
        <!-- 设置 -->
        <div class="panel-card settings-card">
          <div class="card-header">
            <span class="card-icon">⚙️</span>
            <span>游戏设置</span>
          </div>
          <div class="card-body">
            <div class="setting-group">
              <label class="setting-label">游戏模式</label>
              <div class="btn-group">
                <button class="toggle-btn" :class="{ active: mode === 'pvp' }" @click="setMode('pvp')" :disabled="isPlaying">
                  👥 双人
                </button>
                <button class="toggle-btn" :class="{ active: mode === 'ai' }" @click="setMode('ai')" :disabled="isPlaying">
                  🤖 人机
                </button>
              </div>
            </div>

            <div class="setting-group" v-if="mode === 'ai'">
              <label class="setting-label">AI 难度</label>
              <div class="btn-group">
                <button v-for="d in 3" :key="d" class="toggle-btn difficulty-btn"
                  :class="{ active: difficulty === d }" @click="setDifficulty(d)" :disabled="isPlaying">
                  {{ ['简单', '中等', '困难'][d - 1] }}
                </button>
              </div>
            </div>

            <div class="setting-group">
              <label class="setting-label">
                <input type="checkbox" v-model="showOrder" class="setting-checkbox" />
                显示落子序号
              </label>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="panel-card actions-card">
          <div class="card-header">
            <span class="card-icon">🎯</span>
            <span>操作</span>
          </div>
          <div class="card-body">
            <button class="action-btn btn-undo" @click="undoMove" :disabled="history.length === 0 || gameOver || aiThinking">
              ↩️ 悔棋
            </button>
            <button class="action-btn btn-restart" @click="restartGame">
              🔄 重新开始
            </button>
            <button class="action-btn btn-reset" @click="resetScores">
              🏆 重置比分
            </button>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="panel-card history-card">
          <div class="card-header">
            <span class="card-icon">📋</span>
            <span>落子记录</span>
          </div>
          <div class="card-body history-body" ref="historyList">
            <div v-if="history.length === 0" class="empty-history">
              暂无落子记录
            </div>
            <div v-for="(move, idx) in history" :key="idx" class="history-item"
              :class="{ 'is-black': move.piece === 1, 'is-white': move.piece === 2 }">
              <span class="history-step">{{ idx + 1 }}</span>
              <span class="history-piece-dot" :class="move.piece === 1 ? 'black' : 'white'"></span>
              <span class="history-coord">({{ move.row + 1 }}, {{ move.col + 1 }})</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 游戏结束弹窗 -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" :class="modalClass">
          <div class="modal-icon">{{ modalIcon }}</div>
          <h2 class="modal-title">{{ modalTitle }}</h2>
          <p class="modal-desc">{{ modalDesc }}</p>
          <div class="modal-actions">
            <button class="modal-btn btn-play-again" @click="restartGame">
              再来一局
            </button>
            <button class="modal-btn btn-close" @click="showModal = false">
              查看棋盘
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  BOARD_SIZE,
  PIECE,
  createBoard,
  isValidMove,
  checkWin,
  isDraw,
  aiMove,
} from "./scripts/game.js";

export default {
  name: "GobangGame",
  data() {
    return {
      boardSize: BOARD_SIZE,
      board: createBoard(),
      currentPlayer: PIECE.BLACK, // 黑子先手
      history: [],                // 落子历史
      gameOver: false,
      winner: null,               // null | 1 | 2
      winLine: [],                // 获胜连线坐标
      mode: "ai",                 // 'pvp' | 'ai'
      difficulty: 2,
      aiThinking: false,
      showOrder: false,
      hoverPos: null,
      showModal: false,
      scores: { black: 0, white: 0 },
      cellSize: 40,
    };
  },
  computed: {

    modeLabel() {
      return this.mode === "ai" ? "人机对战" : "双人对战";
    },
    isPlaying() {
      return this.history.length > 0 && !this.gameOver;
    },
    statusText() {
      if (this.aiThinking) return "🤔 AI 思考中...";
      if (this.gameOver) {
        if (this.winner) {
          const name =
            this.winner === PIECE.BLACK
              ? this.mode === "ai" ? "你" : "黑棋"
              : this.mode === "ai" ? "AI" : "白棋";
          return `🎉 ${name}获胜！`;
        }
        return "🤝 平局！";
      }
      const turn =
        this.currentPlayer === PIECE.BLACK
          ? this.mode === "ai" ? "你的回合（黑棋）" : "黑棋回合"
          : this.mode === "ai" ? "AI 回合（白棋）" : "白棋回合";
      return `${this.currentPlayer === PIECE.BLACK ? "⚫" : "⚪"} ${turn}`;
    },
    statusClass() {
      if (this.gameOver) return this.winner ? "status-win" : "status-draw";
      if (this.aiThinking) return "status-thinking";
      return this.currentPlayer === PIECE.BLACK ? "status-black" : "status-white";
    },
    modalIcon() {
      if (!this.winner) return "🤝";
      if (this.mode === "ai") {
        return this.winner === PIECE.BLACK ? "🎉" : "😢";
      }
      return "🏆";
    },
    modalTitle() {
      if (!this.winner) return "平局";
      if (this.mode === "ai") {
        return this.winner === PIECE.BLACK ? "恭喜你赢了！" : "AI 获胜";
      }
      return this.winner === PIECE.BLACK ? "黑棋获胜！" : "白棋获胜！";
    },
    modalDesc() {
      if (!this.winner) return "棋逢对手，旗鼓相当！";
      if (this.mode === "ai") {
        return this.winner === PIECE.BLACK
          ? `你在 ${this.history.length} 步内击败了 AI！`
          : "别灰心，再来一局！";
      }
      return `经过 ${this.history.length} 步的精彩对局，${this.winner === PIECE.BLACK ? "黑棋" : "白棋"}取得了胜利！`;
    },
    modalClass() {
      if (!this.winner) return "modal-draw";
      if (this.mode === "ai" && this.winner === PIECE.WHITE) return "modal-lose";
      return "modal-win";
    },
  },
  methods: {
    handleClick(row, col) {
      if (this.gameOver || this.aiThinking) return;
      if (this.mode === "ai" && this.currentPlayer === PIECE.WHITE) return;
      if (!isValidMove(this.board, row, col)) return;

      this.placePiece(row, col);

      // AI 回合
      if (this.mode === "ai" && !this.gameOver) {
        this.aiThinking = true;
        setTimeout(() => {
          const move = aiMove(this.board, PIECE.WHITE, this.difficulty);
          if (move) {
            this.placePiece(move.row, move.col);
          }
          this.aiThinking = false;
        }, 300 + Math.random() * 400);
      }
    },
    placePiece(row, col) {
      this.$set(this.board[row], col, this.currentPlayer);
      this.history.push({ row, col, piece: this.currentPlayer });

      // 检查胜负
      const winLine = checkWin(this.board, row, col, this.currentPlayer);
      if (winLine) {
        this.gameOver = true;
        this.winner = this.currentPlayer;
        this.winLine = winLine;
        // 更新比分
        if (this.currentPlayer === PIECE.BLACK) {
          this.scores.black++;
        } else {
          this.scores.white++;
        }
        setTimeout(() => {
          this.showModal = true;
        }, 600);
        return;
      }

      // 检查平局
      if (isDraw(this.board)) {
        this.gameOver = true;
        this.winner = null;
        setTimeout(() => {
          this.showModal = true;
        }, 600);
        return;
      }

      // 切换玩家
      this.currentPlayer =
        this.currentPlayer === PIECE.BLACK ? PIECE.WHITE : PIECE.BLACK;

      // 滚动历史记录到底部
      this.$nextTick(() => {
        const list = this.$refs.historyList;
        if (list) list.scrollTop = list.scrollHeight;
      });
    },
    undoMove() {
      if (this.history.length === 0 || this.gameOver) return;

      // AI 模式：撤销两步（自己 + AI）
      const steps = this.mode === "ai" && this.history.length >= 2 ? 2 : 1;
      for (let i = 0; i < steps; i++) {
        const last = this.history.pop();
        if (last) {
          this.$set(this.board[last.row], last.col, PIECE.EMPTY);
          this.currentPlayer = last.piece;
        }
      }
    },
    restartGame() {
      this.board = createBoard();
      this.currentPlayer = PIECE.BLACK;
      this.history = [];
      this.gameOver = false;
      this.winner = null;
      this.winLine = [];
      this.aiThinking = false;
      this.showModal = false;
      this.hoverPos = null;
    },
    resetScores() {
      this.scores = { black: 0, white: 0 };
    },
    setMode(mode) {
      this.mode = mode;
      this.restartGame();
    },
    setDifficulty(d) {
      this.difficulty = d;
      this.restartGame();
    },
    isLastMove(row, col) {
      if (this.history.length === 0) return false;
      const last = this.history[this.history.length - 1];
      return last.row === row && last.col === col;
    },
    isWinPiece(row, col) {
      return this.winLine.some((p) => p.row === row && p.col === col);
    },
    getMoveOrder(row, col) {
      const idx = this.history.findIndex(
        (m) => m.row === row && m.col === col
      );
      return idx >= 0 ? idx + 1 : "";
    },
    showHover(row, col) {
      if (this.gameOver || this.aiThinking) return false;
      if (this.mode === "ai" && this.currentPlayer === PIECE.WHITE) return false;
      if (this.board[row][col] !== PIECE.EMPTY) return false;
      return (
        this.hoverPos &&
        this.hoverPos.row === row &&
        this.hoverPos.col === col
      );
    },
    isStarPoint(row, col) {
      const stars = [[3,3],[3,11],[7,7],[11,3],[11,11]];
      return stars.some(([r, c]) => r === row && c === col);
    },
  },
};
</script>

<style scoped>
/* ===== 全局变量 ===== */
:root {
  --gobang-primary: #6366f1;
  --gobang-primary-rgb: 99, 102, 241;
}

/* ===== 容器 ===== */
.gobang-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #e2e8f0;
}

/* 背景装饰圆 */
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.bg-circle-1 {
  width: 500px;
  height: 500px;
  background: #6366f1;
  top: -100px;
  left: -100px;
  animation: float1 15s ease-in-out infinite;
}

.bg-circle-2 {
  width: 400px;
  height: 400px;
  background: #ec4899;
  bottom: -50px;
  right: -50px;
  animation: float2 18s ease-in-out infinite;
}

.bg-circle-3 {
  width: 300px;
  height: 300px;
  background: #06b6d4;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float3 12s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(60px, 40px); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-50px, -30px); }
}

@keyframes float3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

/* ===== 标题 ===== */
.game-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.game-title {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #c7d2fe, #e0e7ff, #fde68a);
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
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

/* ===== 游戏主体布局 ===== */
.game-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

/* ===== 侧面板 ===== */
.side-panel {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

/* ===== 卡片 ===== */
.panel-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.panel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.card-icon {
  font-size: 1rem;
}

.card-body {
  padding: 14px 16px;
}

/* ===== 游戏信息 ===== */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.info-row + .info-row {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.info-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
}

.info-value {
  font-size: 0.85rem;
  font-weight: 500;
}

.star {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
}

.star.active {
  color: #fbbf24;
}

.step-count {
  background: rgba(99, 102, 241, 0.2);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #a5b4fc;
}

/* ===== 玩家信息 ===== */
.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  transition: background 0.3s;
  position: relative;
}

.player-info.active {
  background: rgba(99, 102, 241, 0.15);
}

.player-piece {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
}

.black-piece {
  background: radial-gradient(circle at 35% 35%, #555, #111);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.white-piece {
  background: radial-gradient(circle at 35% 35%, #fff, #ccc);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.player-detail {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.player-score {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
}

.turn-indicator {
  margin-left: auto;
}

.pulse-dot {
  display: block;
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.vs-divider {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 0;
}

/* ===== 状态栏 ===== */
.status-bar {
  text-align: center;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.3s;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-black {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.6), rgba(60, 60, 60, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-white {
  background: linear-gradient(135deg, rgba(200, 200, 200, 0.15), rgba(255, 255, 255, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.status-thinking {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(99, 102, 241, 0.3);
  animation: thinking-glow 2s ease-in-out infinite;
}

@keyframes thinking-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.3); }
}

.status-win {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2));
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-draw {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.2));
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* 状态文字渐变过渡 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* ===== 棋盘 ===== */
.board-wrapper {
  display: flex;
  justify-content: center;
}

.board {
  display: inline-block;
  background: linear-gradient(145deg, #d4a843, #c49a38, #b8922e);
  border-radius: 12px;
  padding: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 0 4px rgba(139, 90, 20, 0.6);
}

.board-row {
  display: flex;
}

/* 每个格子代表一个交叉点，通过伪元素绘制网格线 */
.board-cell {
  width: 40px;
  height: 40px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 水平线 */
.board-cell::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-0.5px);
  pointer-events: none;
}

/* 垂直线 */
.board-cell::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(0, 0, 0, 0.4);
  transform: translateX(-0.5px);
  pointer-events: none;
}

/* 边缘格子裁剪线条 */
.board-cell.top-edge::after    { top: 50%; }
.board-cell.bottom-edge::after { bottom: 50%; }
.board-cell.left-edge::before  { left: 50%; }
.board-cell.right-edge::before { right: 50%; }

/* 星位点 */
.star-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
}

/* ===== 棋子 ===== */
.piece {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.piece.black {
  background: radial-gradient(circle at 35% 35%, #666, #222, #000);
  box-shadow:
    2px 3px 8px rgba(0, 0, 0, 0.6),
    inset 0 -2px 4px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.piece.white {
  background: radial-gradient(circle at 35% 35%, #fff, #eee, #ccc);
  box-shadow:
    2px 3px 8px rgba(0, 0, 0, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.6);
}

/* 最后一步标记 */
.piece.last-move::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.piece.black.last-move::after {
  background: rgba(255, 255, 255, 0.7);
}

.piece.white.last-move::after {
  background: rgba(0, 0, 0, 0.5);
}

/* 获胜棋子动画 */
.piece.win-piece {
  animation: win-glow 1s ease-in-out infinite alternate;
}

@keyframes win-glow {
  from { transform: scale(1); filter: brightness(1); }
  to { transform: scale(1.1); filter: brightness(1.3); }
}

/* 棋子落子动画 */
.piece-drop-enter-active {
  animation: dropIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dropIn {
  from {
    transform: scale(0) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* 棋子序号 */
.piece-order {
  font-size: 0.65rem;
  font-weight: 700;
  z-index: 1;
}

.piece.black .piece-order {
  color: rgba(255, 255, 255, 0.7);
}

.piece.white .piece-order {
  color: rgba(0, 0, 0, 0.5);
}

/* 悬浮提示 */
.hover-hint {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  opacity: 0.3;
  pointer-events: none;
}

.hover-hint.black {
  background: radial-gradient(circle at 35% 35%, #555, #111);
}

.hover-hint.white {
  background: radial-gradient(circle at 35% 35%, #fff, #ccc);
}

/* ===== 设置 ===== */
.setting-group {
  margin-bottom: 14px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  cursor: pointer;
}

.setting-checkbox {
  accent-color: #6366f1;
  cursor: pointer;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.toggle-btn.active {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
  color: #a5b4fc;
}

.toggle-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== 操作按钮 ===== */
.action-btn {
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.action-btn:last-child {
  margin-bottom: 0;
}

.btn-undo {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.btn-undo:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.25);
}

.btn-undo:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-restart {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.btn-restart:hover {
  background: rgba(16, 185, 129, 0.25);
}

.btn-reset {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.btn-reset:hover {
  background: rgba(245, 158, 11, 0.25);
}

/* ===== 历史记录 ===== */
.history-body {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.history-body::-webkit-scrollbar {
  width: 4px;
}

.history-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.empty-history {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  padding: 16px 0;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  transition: background 0.15s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.history-step {
  width: 22px;
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
}

.history-piece-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.history-piece-dot.black {
  background: #333;
  border: 1px solid #555;
}

.history-piece-dot.white {
  background: #eee;
  border: 1px solid #ccc;
}

.history-coord {
  color: rgba(255, 255, 255, 0.6);
}

/* ===== 弹窗 ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(145deg, #1e1b4b, #312e81);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 36px 44px;
  text-align: center;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
}

.modal-win {
  border-color: rgba(16, 185, 129, 0.3);
}

.modal-lose {
  border-color: rgba(239, 68, 68, 0.3);
}

.modal-draw {
  border-color: rgba(245, 158, 11, 0.3);
}

.modal-icon {
  font-size: 3.5rem;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #c7d2fe, #fde68a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 0 0 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-play-again {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
}

.btn-play-again:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-close {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* 弹窗动画 */
.modal-enter-active {
  animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  animation: modalIn 0.2s ease reverse;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== 响应式 ===== */
@media (max-width: 1000px) {
  .game-body {
    flex-direction: column;
    align-items: center;
  }

  .side-panel {
    width: 100%;
    max-width: 600px;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .panel-card {
    flex: 1;
    min-width: 180px;
  }
}
</style>
