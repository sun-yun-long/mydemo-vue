<!--
 * @Description: 
 * @Author: 
 * @Date: 2024-10-21 09:13:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-21 09:48:59
-->
<template>
  <div>
    <div v-html="outputHtml" style="position: relative;"></div>
    <div v-html="outputHtml2" style="position: relative;"></div>
  </div>
</template>

<script>
import * as Diff from "diff";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
export default {
  name: "",
  components: {},
  data() {
    return {
      outputHtml: "",
      outputHtml2: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const oldFile = `{
        "projectName": "ExampleProject",
        "version": "1.0.0",
        "author": "John Doe",
        "dependencies": {
          "libraryA": "^1.2.3",
          "libraryB": "^3.4.5"
        },
        "devDependencies": {
          "toolX": "^0.9.8"
        },
        "scripts": {
          "start": "node index.js"
        }
      }`;

      const newFile = `{
        "projectName": "ExampleProject",
        "version": "1.0.1",
        "author": "Jane Doe",
        "dependencies": {
          "libraryA": "^1.2.3",
          "libraryC": "^7.8.9"
        },
        "devDependencies": {
          "toolX": "^0.9.8",
          "toolY": "^2.3.4"
        },
        "scripts": {
          "start": "node app.js",
          "test": "npm test"
        }
      }`;

      const diff = Diff.createTwoFilesPatch("旧文件", "新文件", oldFile, newFile);

      const outputHtml = Diff2Html.html(diff, {
        inputFormat: "diff",
        showFiles: false,
        matching: "lines",
        highlight: true,
        outputFormat: "side-by-side"
      });
      this.outputHtml = outputHtml;

      const outputHtml2 = Diff2Html.html(diff, {
        inputFormat: "diff",
        showFiles: false,
        matching: "lines",
        highlight: true,
        outputFormat: "line-by-line"
      });
      this.outputHtml2 = outputHtml2;
      
    }
  }
};
</script>
<style scoped lang='less'>
</style>