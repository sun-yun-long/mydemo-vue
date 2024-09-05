<template>
  <div ref="wrapper" class="out-box">
    <h2>element-resize-detector</h2>
    <p>box宽度：{{boxWidth}}</p>
    <p>box高度：{{boxHeight}}</p>
  </div>
</template>

<script>
import ElementResizeDetectorMaker from "element-resize-detector";
export default {
  name: "",
  components: {},
  data() {
    return {
      erd: null,
      boxWidth: 0,
      boxHeight: 0
    };
  },
  mounted() {
    this.init();
  },
  // 组件销毁前记得销毁插件,否则可能会内存泄漏
  beforeDestroy() {
    this.erd.uninstall(this.$refs.wrapper);
  },
  methods: {
    init() {
      this.erd = ElementResizeDetectorMaker();
      this.$nextTick(() => {
        this.erd.listenTo(this.$refs.wrapper, (ele) => {
          console.log("=======offsetWidth", ele.offsetWidth);
          console.log("=======offsetHeight", ele.offsetHeight);
          console.log("=======clientWidth", ele.clientWidth);
          this.boxWidth = ele.offsetWidth;
          this.boxHeight = ele.offsetHeight;
          //  监听到html元素尺寸变化后执行一些逻辑处理
          //  this.doSomething()
        });
      });
    }
  }
};
</script>
<style scoped lang='less'>
.out-box {
  height: 50%;
  width: 50%;
  background: skyblue;
}
</style>