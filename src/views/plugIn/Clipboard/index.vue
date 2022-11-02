<template>
  <div class="countTo_out">
    <div>
      {{ txt }}
    </div>
    <button class="tag-read" :data-clipboard-text="txt" @click="copy">复制</button>
  </div>
</template>

<script>
import Clipboard from "clipboard";
export default {
  data() {
    return {
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
