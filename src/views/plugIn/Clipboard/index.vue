<template>
  <div class="clipboard_out">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text" :data-clipboard-text="txt" class="tag-read" @click="copy">复制</el-button>
      </div>
      <div class="box">
        {{ txt }}
      </div>
    </el-card>
  </div>
</template>

<script>
import Clipboard from "clipboard";
export default {
  name: "clipboard",
  data() {
    return {
      txt: "测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本" +
        "测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本"
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

<style lang="less" scoped>
.box-card{
  width: 500px;
  margin: 0 auto;
}
</style>