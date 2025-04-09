<template>
  <div>
    <el-input type="textarea" v-model="textarea" :rows="10" placeholder="请输入内容"></el-input>
    <el-button @click="test">解析</el-button>
    <el-button @click="handleGzip">压缩字符串</el-button>
    <el-button @click="downloadFile">下载</el-button>
    <el-button @click="downloadFileDeflate">下载压缩后文件</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="field1" label="field1"></el-table-column>
      <el-table-column prop="field2" label="field2"></el-table-column>
      <el-table-column prop="field3" label="field3"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import pako from "pako";
import pageApi from "./api";
export default {
  name: "",
  components: {},
  data() {
    return {
      textarea: "",
      tableData: []
    };
  },
  mounted() {},
  methods: {
    test() {
      this.tableData = [];
      let arr = this.textarea.split("\n");
      console.log(arr);
      let newArr = [];
      arr.forEach((item) => {
        if (item) {
          let obj = {};
          let arr2 = item.split("\t");
          obj.field1 = arr2[0];
          obj.field2 = arr2[1];
          obj.field3 = arr2[2];
          newArr.push(obj);
        }
      });
      console.log(newArr);
      this.tableData = newArr;
    },
    handleGzip() {
      console.log(this.textarea);
      // 原始数据
      const originalData = JSON.stringify(this.textarea);
      // 压缩数据
      const compressedData = pako.deflate(originalData, { to: "string" });
      console.log(compressedData);
      const blob1 = new Blob([compressedData], { type: "application/gzip" });
      console.log(blob1);
      console.log("---------------------------------------");
      const compressedData2 = pako.gzip(originalData, { to: "string" });
      console.log(compressedData2);
      const blob2 = new Blob([compressedData2], { type: "application/gzip" });
      const fromData = new FormData();
      fromData.append("file", blob2);
      pageApi.list(fromData).then(res => {})
    },
    downloadFile() {
      const blob = new Blob([this.textarea], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // 创建一个指向 Blob 的 URL
      link.download = 'downloaded_text.txt'; // 设置下载文件的默认文件名
      // 触发点击事件，开始下载
      link.click();
    },
    downloadFileDeflate() {
      const compressedData = pako.gzip(this.textarea, { to: "string" });
      const blob = new Blob([compressedData], { type: "application/gzip" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // 创建一个指向 Blob 的 URL
      link.download = 'downloaded_deflate.txt'; // 设置下载文件的默认文件名
      // 触发点击事件，开始下载
      link.click();
    },
  }
};
</script>
<style scoped lang='scss'>
</style>