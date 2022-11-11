<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-11 10:30:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-11 11:12:47
-->
<template>
  <div>
    <div class="mBox">
      <div v-for="(item, index) in list" :key="index" :class="[item.className, 'box']">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      list: [
        { text: "前", className: "before" },
        { text: "后", className: "after" },
        { text: "左", className: "left" },
        { text: "右", className: "right" },
        { text: "上", className: "top" },
        { text: "下", className: "bottom" }
      ]
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped lang='less'>
.mBox {
  width: 300px;
  height: 300px;
  margin: 50px auto;
  position: relative;
  top: 100px;
  transform-style: preserve-3d; /*开启3D*/
  transform: rotateY(-45deg) rotateX(-45deg);
  animation: move 100s linear infinite; /*添加的观测动画效果*/
}
.box {
  width: 300px;
  height: 300px;
  text-align: center;
  line-height: 300px;
  position: absolute;
  opacity: 0.8;
}
.top {
  background-color: rgb(18, 196, 136);
  transform: translateZ(150px);
}

.bottom {
  background-color: rgb(70, 147, 209);
  transform: translateZ(-150px);
}

.left {
  background-color: rgb(189, 79, 112);
  transform: translateX(-150px) rotateY(90deg);
}

.right {
  background-color: rgb(59, 212, 59);
  transform: translateX(150px) rotateY(90deg);
}

.before {
  background-color: rgb(158, 136, 64);
  transform: translateY(150px) rotateX(90deg);
}

.after {
  background-color: rgb(9, 82, 57);
  transform: translateY(-150px) rotateX(90deg);
}

@keyframes move {
  0% {
    transform: rotateY(-45deg) rotateX(45deg);
  }

  100% {
    transform: rotateY(10000deg) rotateX(5000deg);
  }
}
</style>