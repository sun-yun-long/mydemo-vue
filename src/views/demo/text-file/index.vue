<template>
  <div>
    <el-input type="textarea" v-model="text" />
    <el-button @click="textToFile">文本转文件</el-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      text: ""
    }
  },
  methods: {
    textToFile() {
      const blob = new Blob([this.text], { type: "text/plain" });
      console.log(blob);
      const file = new File([this.text], "filename.txt", { type: 'text/plain' });
      console.log(file);
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "text.txt";
      // a.click();
      // URL.revokeObjectURL(url);
      
      //POST请求
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("filename", "text.txt");
      formData.append("filetype", "text/plain");
      formData.append("filesize", blob.size);
      formData.append("filecontent", this.text);
      
      axios.post("http://localhost:3000/upload", formData).then(res => {
        console.log(res);
      });
    }
  }
}
</script>

<style>

</style>