<template>
  <div class="countTo_out">
    <countTo class="countTo" :startVal="startVal" :endVal="endVal" :duration="duration"></countTo>
    <div>
      {{ txt }}
    </div>
    <button class="tag-read" :data-clipboard-text="txt" @click="copy">复制</button>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import countTo from "vue-count-to";
export default {
  components: { countTo },
  data() {
    return {
      startVal: 0,
      endVal: 2021,
      duration: 2000,
      txt: "qqshiqhsiqhsiqshqshqishiqhsi"
    };
  },
  methods: {
    copy() {
      const clipboard = new Clipboard(".tag-read");
      clipboard.on("success", (e) => {
        console.log("复制成功");
        this.$message.closeAll();
        this.$message({
          type: "success",
          message: "复制成功"
        });
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        this.$message.closeAll();
        this.$message({
          type: "warning",
          message: "该浏览器不支持自动复制"
        });
        // 释放内存
        clipboard.destroy();
      });
    }
  }
};
</script>

<style lang="less">
@red: red;
.countTo_out {
  .countTo {
    font-size: 40px;
    color: @red;
  }
}
</style>