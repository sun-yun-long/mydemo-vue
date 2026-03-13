/**
 * 五子棋游戏核心逻辑
 */

// 棋盘大小 15x15
export const BOARD_SIZE = 15;

// 棋子类型
export const PIECE = {
  EMPTY: 0,
  BLACK: 1,
  WHITE: 2,
};

/**
 * 创建空棋盘
 */
export function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => PIECE.EMPTY)
  );
}

/**
 * 检查落子位置是否合法
 */
export function isValidMove(board, row, col) {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE &&
    board[row][col] === PIECE.EMPTY
  );
}

/**
 * 检查是否五子连珠（获胜）
 * @returns {Array|null} 返回获胜的五个坐标数组，或 null
 */
export function checkWin(board, row, col, piece) {
  // 四个方向：水平、垂直、左上-右下对角线、右上-左下对角线
  const directions = [
    [0, 1],   // 水平
    [1, 0],   // 垂直
    [1, 1],   // 左上-右下
    [1, -1],  // 右上-左下
  ];

  for (const [dr, dc] of directions) {
    const line = [{ row, col }];

    // 正方向查找
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r][c] !== piece) break;
      line.push({ row: r, col: c });
    }

    // 反方向查找
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r][c] !== piece) break;
      line.push({ row: r, col: c });
    }

    if (line.length >= 5) {
      return line;
    }
  }

  return null;
}

/**
 * 检查是否平局（棋盘已满）
 */
export function isDraw(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === PIECE.EMPTY) return false;
    }
  }
  return true;
}

// ========== AI 相关逻辑 ==========

/**
 * 评分表：用于评估棋型的威胁程度
 * 连子数 -> 两端开放情况 -> 分数
 */
const SCORES = {
  FIVE: 1000000,         // 五连
  OPEN_FOUR: 100000,     // 活四
  HALF_FOUR: 10000,      // 冲四
  OPEN_THREE: 10000,     // 活三
  HALF_THREE: 1000,      // 眠三
  OPEN_TWO: 1000,        // 活二
  HALF_TWO: 100,         // 眠二
  OPEN_ONE: 100,         // 活一
  HALF_ONE: 10,          // 眠一
};

/**
 * 评估某个位置在某个方向上的棋型
 */
function evaluateLine(board, row, col, dr, dc, piece) {
  let count = 1;
  let openEnds = 0;

  // 正方向
  let blocked = false;
  for (let i = 1; i <= 4; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
      blocked = true;
      break;
    }
    if (board[r][c] === piece) {
      count++;
    } else {
      if (board[r][c] === PIECE.EMPTY) openEnds++;
      blocked = true;
      break;
    }
  }
  if (!blocked) openEnds++;

  // 反方向
  blocked = false;
  for (let i = 1; i <= 4; i++) {
    const r = row - dr * i;
    const c = col - dc * i;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
      blocked = true;
      break;
    }
    if (board[r][c] === piece) {
      count++;
    } else {
      if (board[r][c] === PIECE.EMPTY) openEnds++;
      blocked = true;
      break;
    }
  }
  if (!blocked) openEnds++;

  // 根据连子数和开放端数评分
  if (count >= 5) return SCORES.FIVE;
  if (count === 4) {
    if (openEnds === 2) return SCORES.OPEN_FOUR;
    if (openEnds === 1) return SCORES.HALF_FOUR;
  }
  if (count === 3) {
    if (openEnds === 2) return SCORES.OPEN_THREE;
    if (openEnds === 1) return SCORES.HALF_THREE;
  }
  if (count === 2) {
    if (openEnds === 2) return SCORES.OPEN_TWO;
    if (openEnds === 1) return SCORES.HALF_TWO;
  }
  if (count === 1) {
    if (openEnds === 2) return SCORES.OPEN_ONE;
    if (openEnds === 1) return SCORES.HALF_ONE;
  }
  return 0;
}

/**
 * 评估某个位置对某个棋子颜色的得分
 */
function evaluatePosition(board, row, col, piece) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  let score = 0;
  for (const [dr, dc] of directions) {
    score += evaluateLine(board, row, col, dr, dc, piece);
  }
  return score;
}

/**
 * AI 落子（贪心策略：评估每个空位的攻防得分）
 * @param {number} difficulty - 难度等级 1-3
 * @returns {{ row: number, col: number }}
 */
export function aiMove(board, aiPiece, difficulty = 2) {
  const humanPiece = aiPiece === PIECE.BLACK ? PIECE.WHITE : PIECE.BLACK;
  let bestScore = -Infinity;
  let bestMoves = [];

  // 获取有意义的候选位置（邻近已有棋子的空位）
  const candidates = getCandidates(board);

  // 如果棋盘为空，下在中心
  if (candidates.length === 0) {
    return { row: Math.floor(BOARD_SIZE / 2), col: Math.floor(BOARD_SIZE / 2) };
  }

  for (const { row, col } of candidates) {
    // 模拟落子
    board[row][col] = aiPiece;
    const attackScore = evaluatePosition(board, row, col, aiPiece);
    board[row][col] = PIECE.EMPTY;

    // 模拟对手落在此处
    board[row][col] = humanPiece;
    const defendScore = evaluatePosition(board, row, col, humanPiece);
    board[row][col] = PIECE.EMPTY;

    // 攻击权重略高于防守
    let totalScore;
    switch (difficulty) {
      case 1: // 简单：随机性更大
        totalScore = attackScore * 1.0 + defendScore * 0.8 + Math.random() * 5000;
        break;
      case 3: // 困难：纯策略
        totalScore = attackScore * 1.1 + defendScore * 1.0;
        break;
      default: // 中等
        totalScore = attackScore * 1.05 + defendScore * 0.95 + Math.random() * 500;
        break;
    }

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMoves = [{ row, col }];
    } else if (totalScore === bestScore) {
      bestMoves.push({ row, col });
    }
  }

  // 从最佳候选中随机选一个
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/**
 * 获取候选落子位置（距离已有棋子 2 格以内的空位）
 */
function getCandidates(board) {
  const candidateSet = new Set();
  const range = 2;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== PIECE.EMPTY) {
        // 搜索周围的空位
        for (let dr = -range; dr <= range; dr++) {
          for (let dc = -range; dc <= range; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 && nr < BOARD_SIZE &&
              nc >= 0 && nc < BOARD_SIZE &&
              board[nr][nc] === PIECE.EMPTY
            ) {
              candidateSet.add(`${nr},${nc}`);
            }
          }
        }
      }
    }
  }

  return Array.from(candidateSet).map((key) => {
    const [row, col] = key.split(",").map(Number);
    return { row, col };
  });
}
