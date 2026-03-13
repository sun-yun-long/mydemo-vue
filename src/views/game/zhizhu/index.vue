<!--
 * @Description: 蜘蛛触手动画
 * @Author:
 * @Date: 2024-10-10 13:32:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-10 13:49:25
-->
<template>
  <div class="zhizhu">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import SpiderAnimation from "./scripts/index.js";

export default {
  name: "ZhizhuGame",
  data() {
    return {
      animation: null,
    };
  },
  mounted() {
    this.animation = new SpiderAnimation(this.$refs.canvas);
  },
  beforeDestroy() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
  },
};
</script>

<style scoped>
.zhizhu {
  background: #000;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.zhizhu canvas {
  display: block;
}
</style>