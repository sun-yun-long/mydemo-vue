<!--
 * @Description: 
 * @Author: 
 * @Date: 2025-08-02 10:29:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-08-14 16:38:00
-->
<template>
  <div>
    <h1>Pako</h1>
    <el-input type="textarea" v-model="text" />
    <el-button @click="compress()">压缩</el-button>
    <el-button @click="decompress()">解压</el-button>
    <el-row>
      <el-col :span="12">
        <p>压缩后</p>
        <el-input type="textarea" v-model="compressed" />
      </el-col>
      <el-col :span="12">
        <p>解压后</p>
        <el-input type="textarea" v-model="decompressed" />
      </el-col>
    </el-row>
    <el-button @click="test()">测试</el-button>
  </div>
</template>

<script>
import axios from "axios";
import pako from "pako";
import pakoApi from "@/api/demo/pako_api";
export default {
  data() {
    return {
      text: "Hello World",
      compressed: "",
      compressedTextEncoder: null,
      decompressed: ""
    };
  },
  methods: {
    compress() {
      const jsonString = JSON.stringify({
        a: this.text,
        b: "aaaa"
      })
      console.log(pako.gzip(jsonString));
      console.log(new TextDecoder().decode(pako.ungzip(pako.gzip(jsonString))));
      
      
      const uint8Array = new TextEncoder().encode(this.text);
      // 使用pako进行gzip压缩
      const compressed = pako.gzip(uint8Array);
      this.compressedTextEncoder = compressed;
      // 将压缩后的数据转换为base64字符串
      const base64 = btoa(String.fromCharCode.apply(null, compressed));
      this.compressed = base64;

      console.log({
        aaa: compressed,
        bbb: base64
      });
      console.log(this.gzipText(this.text));
      
      // this.gzipText(this.text)
    },
    decompress() {
      const compressed = atob(this.compressed);
      const uint8Array = new Uint8Array(compressed.length);
      for (let i = 0; i < compressed.length; i++) {
        uint8Array[i] = compressed.charCodeAt(i);
      }
      const decompressed = pako.ungzip(uint8Array);
      console.log(decompressed);

      const text = new TextDecoder().decode(decompressed);
      this.decompressed = text;

      // 不转base64
      const decompressed2 = pako.ungzip(this.compressedTextEncoder);
      const text2 = new TextDecoder().decode(decompressed2);
      console.log(text2);
    },
    test() {
      const formData = new FormData();
      const params = {
        gzipcontent: this.compressedTextEncoder,
        text: this.text
      }
      const paramsStr = JSON.stringify(params);
      // 把paramsStr转成文件流
      // const file = new File([paramsStr], "params.txt", { type: "text/plain" });
      // 导出文件
      const blob = new Blob([paramsStr], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "params.txt";
      a.click();
      URL.revokeObjectURL(url);
      formData.append("txt", blob);
      pakoApi.test(formData)
    },
    async gzipText(text) {
      const encoder = new TextEncoder();
      const input = encoder.encode(text);
      const inputBlob = new Blob([input]);
      const reader = inputBlob.stream().getReader();

      const deflateStream = new TransformStream(new TextDecoderStream());
      const writer = deflateStream.writable.getWriter();

      await writer.write(input);
      writer.close();

      const { value, done } = await deflateStream.readable.getReader().read();
      if (done) {
        throw new Error("Failed to compress text");
      }
      console.log(value);
      
      return value;
    }
  }
};
</script>

<style>
</style>