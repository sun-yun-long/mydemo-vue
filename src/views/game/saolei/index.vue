<template>
  <div class="saolei">
    <div class="out">
      <div class="row" v-for="(row, index) in minesArray" :key="index">
        <div
          class="cell"
          v-for="(cell, ind) in row"
          :key="ind"
          @click="cellClick(index, ind)"
          :class="['num-color-' + minesArray[index][ind], 'num-color']"
        >
          <span class="cell_">{{ cell }}</span>
          <span :class="['mask', { visited: visited[index][ind] }]" @contextmenu.prevent="setFlag(index, ind)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posArr: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1]
      ],
      minesArray: null,
      isGameOver: false,
      isFirstClick: true,
      rowSize: 8,
      colSize: 8,
      mineSize: 9,
      //timer: '',
      //time: 0.0,
      visited: null
      //noMineBlocks: ''
    };
  },
  mounted() {
    this.minesArray = new Array();
    this.visited = new Array();
    for (let i = 0; i < this.rowSize; i++) {
      this.minesArray[i] = new Array();
      this.visited[i] = new Array();
      for (let j = 0; j < this.colSize; j++) {
        this.minesArray[i][j] = 0;
        this.visited[i][j] = false;
      }
    }
  },
  methods: {
    cellClick(row, col) {
      if (this.isFirstClick) {
        this.initMines(row, col);
      }
      this.visited[row][col] = true;
      this.$set(this.visited, row, [...this.visited[row]]);

      let cell = this.minesArray[row][col];
      if (cell === -1) {
        // 踩雷了，爆炸
        this.fail();
        return;
      }
      if (cell === 0) {
        // 踩空了
        this.search(row, col);
      }
    },
    setFlag(row, col) {
      console.log(row, col);
    },
    initMines(row, col) {
      // 传入第一格的坐标
      console.log("-----------------------");
      console.log("初始化地雷...");
      // 地雷设为 -1
      for (let i = 0; i < this.mineSize; i++) {
        do {
          /* 生成行/列随机数 */
          var mineRow = Math.floor(Math.random() * this.rowSize);
          var mineCol = Math.floor(Math.random() * this.colSize);
        } while (
          (mineRow === row && mineCol === col) || // 防止与第一格坐标重复
          this.minesArray[mineRow][mineCol] === -1 // 防止地雷坐标重复
        );
        // console.log(mineRow, mineCol);
        this.minesArray[mineRow][mineCol] = -1;
        this.$set(this.minesArray, mineRow, [...this.minesArray[mineRow]]); // 很重要！见下面解释
      }
      // 初始化数字
      this.initNum();

      console.log("初始化地雷完成...");
      console.log("-----------------------");

      this.isFirstClick = false;
    },
    initNum() {
      console.log("初始化数字...");
      let borderX = this.minesArray.length;
      let borderY = this.minesArray[0].length;
      for (let i = 0; i < this.minesArray.length; i++) {
        for (let j = 0; j < this.minesArray[i].length; j++) {
          // 如果是雷，雷周围 8 个格子除了地雷数字加 1
          if (this.minesArray[i][j] === -1) {
            this.posArr.forEach((pos) => {
              let x = pos[0] + i;
              let y = pos[1] + j;
              if (x < borderX && x >= 0 && y < borderY && y >= 0) {
                if (this.minesArray[x][y] !== -1) {
                  this.minesArray[x][y]++;
                }
              }
            });
          }
        }
      }
    },
    search(r, c) {
      this.posArr.forEach((pos) => {
        let x = pos[0] + r;
        let y = pos[1] + c;
        if (x < this.visited.length && x >= 0 && y < this.visited[0].length && y >= 0 && !this.visited[x][y]) {
          // 若未访问过
          this.cellClick(x, y);
        }
      });
    },
    fail(isSuccess) {
      for (let i = 0; i < this.minesArray.length; i++) {
        for (let j = 0; j < this.minesArray[0].length; j++) {
          if (this.minesArray[i][j] === -1) {
            if (isSuccess) {
              this.minesArray[i][j] = -2; // 插旗
            }
            this.$set(this.minesArray, i, [...this.minesArray[i]]);
            // Amazing!! 这里竟然不需要用 $set
            this.visited[i][j] = true;
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.saolei {
  .out {
    display: inline-block;
    border: 1px solid #333;
    .row {
      .cell {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 1px solid #ccc;
        margin: 2px;
        position: relative;
        .cell_ {
          display: inline-block;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
        }
      }
    }
  }
}
.num-color {
  font-weight: bold;
}

.num-color-0 {
  color: darkgrey;
}

.num-color-1 {
  color: blue;
}

.num-color-2 {
  color: green;
}

.num-color-3 {
  color: red;
}

.num-color-4 {
  color: darkblue;
}

.num-color-5 {
  color: darkred;
}

.num-color-6 {
  color: darkcyan;
}

.num-color-7 {
  color: black;
}

.num-color-8 {
  color: gray;
}

.num-color--1 {
  background: red;
}

.num-color--2 {
  background: greenyellow;
}

.mask {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 1px solid #ccc;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background: #c0c0c0;
}
.visited {
  display: none;
}
</style>