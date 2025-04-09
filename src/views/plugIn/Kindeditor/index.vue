<!--
 * @Description: 
 * @Author: 
 * @Date: 2025-02-28 10:17:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-18 17:04:42
-->
<template>
  <div>
    <Kindeditor
      id="editor_id"
      height="400px"
      width="100%"
      :content.sync="editorText"
      :afterChange="afterChange"
      :loadStyleMode="false"
      @on-content-change="onContentChange"
    ></Kindeditor>
    <!-- :items="['customImage']"
      :htmlTags="htmlTags" -->
    <div>editorTextCopy: {{ editorText }}</div>
    <div>removeHTMLTags: {{ htmlToTextWithImages(editorTextCopy) }}</div>

  </div>
</template>

<script>
import Kindeditor from "@/components/Kindeditor";
// import Kindeditor from "@/components/Kindeditor/index_text_img";

export default {
  name: "",
  components: {
    Kindeditor
  },
  data() {
    return {
      htmlTags: {
        img: ["src", "/"],
        br: ["/"]
      },
      editorText: "", // 双向同步的变量
      editorTextCopy: "" // content-change 事件回掉改变的对象
    };
  },
  methods: {
    onContentChange(val) {
      console.log(this.editorText);
      this.editorTextCopy = val;
      console.log(this.editorTextCopy);
    },
    afterChange(val) {
      // console.log("afterChange", this.editorText);
    },
    removeHTMLTags(inputString) {
      // 创建一个临时的 div 元素来解析 HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = inputString;

      // 获取纯文本内容
      const textContent = tempDiv.textContent || tempDiv.innerText;
      return textContent;
      // 使用正则表达式替换多个换行符
      return textContent.replace(/\n/g, "\\").replace(/\s+/g, " ").trim();
    },
    removeHtmlTags(html) {
      html = _.cloneDeep(html);
      // 匹配所有<p>标签内的内容，并处理内部的标签和空格
      const regex = /<p>(.*?)<\/p>/gs;
      const parts = [];
      let match;
      html = html.replace(/<br \/>/g, "&br&");
      while ((match = regex.exec(html)) !== null) {
        // 去除内容中的所有p标签
        const text = match[1].replace(/<\/?p>/g, "");
        // const text = match[1].replace(/<[^>]+>/g, '');
        if (text) parts.push(text);
      }

      return parts.join("&br&");
    },
    htmlToTextWithImages(html) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const blockTags = new Set([
        "div",
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "pre",
        "hr",
        "section",
        "article",
        "header",
        "footer",
        "nav",
        "table",
        "tr",
        "form",
        "br"
      ]);

      function processNode(node) {
        let text = "";
        if (node.nodeType === Node.TEXT_NODE) {
          // 保留文本内容，合并连续空格
          text += node.textContent.replace(/\s+/g, " ");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          if (tagName === "img") {
            // 保留图片标签
            text += node.outerHTML;
          } else if (tagName === "br") {
            // 直接替换为换行
            text += "\n";
          } else {
            // 递归处理子节点
            for (const child of node.childNodes) {
              text += processNode(child);
            }
            // 块级元素后添加换行
            if (blockTags.has(tagName)) {
              text += "\n";
            }
          }
        }
        return text;
      }

      let result = "";
      // 遍历所有子节点，避免根div引入额外换行
      for (const child of tempDiv.childNodes) {
        result += processNode(child);
      }

      // 处理换行：合并3个以上换行为两个，并移除首尾空白
      result = result.replace(/\n{3,}/g, "\n\n").trim();
      result = result.replace(/<img\s+([^>]*)\/?>/g, '<img $1></img>');
      return result;
    }
  }
};
</script>