<template>
  <div class="kindeditor">
    <textarea :id="id" name="content" v-model="outContent"></textarea>
    <el-upload
      ref="imgUploadRef"
      :show-file-list="false"
      :http-request="httpRequest"
      :accept="'image/*'"
      style="display: none"
      class="quill-upload"
      action="#"
    >
      <el-button>导入</el-button>
    </el-upload>
  </div>
</template>

<script>
import "kindeditor/kindeditor-all.js"; // 引入KindEditor核心文件
import "kindeditor/lang/zh-CN.js"; // 中文语言包
import "kindeditor/themes/default/default.css"; // 默认主题样式

export default {
  name: "kindeditor",
  data() {
    return {
      editor: null, // 编辑器实例引用
      outContent: this.content // 用于双向绑定的内容副本
    };
  },
  props: {
    // 核心配置属性 ==============================================
    content: {
      // 编辑器内容（父组件传入）
      type: String,
      default: ""
    },
    id: {
      // 必须的唯一ID（用于绑定DOM）
      type: String,
      required: true
    },
    // 样式配置 =================================================
    width: {
      // 编辑器宽度
      type: String
    },
    height: {
      // 编辑器高度
      type: String
    },
    minWidth: {
      // 最小宽度
      type: Number,
      default: 650
    },
    minHeight: {
      // 最小高度
      type: Number,
      default: 100
    },
    // 功能配置 =================================================
    items: {
      // 工具栏按钮配置
      type: Array,
      default: function () {
        return [
          // "source",
          // "|",
          // "undo",
          // "redo",
          // "|",
          // "preview",
          // "print",
          // "template",
          // "code",
          // "cut",
          // "copy",
          // "paste",
          // "plainpaste",
          // "wordpaste",
          // "|",
          // "justifyleft",
          // "justifycenter",
          // "justifyright",
          // "justifyfull",
          // "insertorderedlist",
          // "insertunorderedlist",
          // "indent",
          // "outdent",
          // "subscript",
          // "superscript",
          // "clearhtml",
          // "quickformat",
          // "selectall",
          // "|",
          // "fullscreen",
          // "/",
          // "formatblock",
          // "fontname",
          // "fontsize",
          // "|",
          // "forecolor",
          // "hilitecolor",
          // "bold",
          // "italic",
          // "underline",
          // "strikethrough",
          // "lineheight",
          // "removeformat",
          // "|",
          "customImage"
          // "image",
          // "multiimage",
          // "flash",
          // "media",
          // "insertfile",
          // "table",
          // "hr",
          // "emoticons",
          // "baidumap",
          // "pagebreak",
          // "anchor",
          // "link",
          // "unlink",
          // "|",
          // "about"
        ];
      }
    },
    noDisableItems: {
      type: Array,
      default: function () {
        return ["source", "fullscreen"];
      }
    },
    filterMode: {
      type: Boolean,
      default: true
    },
    htmlTags: {
      type: Object,
      default: function () {
        return {
          // font: ["color", "size", "face", ".background-color"],
          // span: ["style"],
          // div: ["class", "align", "style"],
          // table: [
          //   "class",
          //   "border",
          //   "cellspacing",
          //   "cellpadding",
          //   "width",
          //   "height",
          //   "align",
          //   "style"
          // ],
          // "td,th": [
          //   "class",
          //   "align",
          //   "valign",
          //   "width",
          //   "height",
          //   "colspan",
          //   "rowspan",
          //   "bgcolor",
          //   "style"
          // ],
          // a: ["class", "href", "target", "name", "style"],
          // embed: [
          //   "src",
          //   "width",
          //   "height",
          //   "type",
          //   "loop",
          //   "autostart",
          //   "quality",
          //   "style",
          //   "align",
          //   "allowscriptaccess",
          //   "/"
          // ],
          // img: ["src", "width", "height", "border", "alt", "title", "align", "style", "/"],
          img: ["src", "alt"],
          // hr: ["class", "/"],
          br: [],
          p: [],
          // "p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6": ["align", "style"],
          // "tbody,tr,strong,b,sub,sup,em,i,u,strike": []
        };
      }
    },
    wellFormatMode: {
      type: Boolean,
      default: true
    },
    resizeType: {
      type: Number,
      default: 2
    },
    themeType: {
      type: String,
      default: "default"
    },
    langType: {
      type: String,
      default: "zh-CN"
    },
    designMode: {
      type: Boolean,
      default: true
    },
    fullscreenMode: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String
    },
    themesPath: {
      type: String
    },
    pluginsPath: {
      type: String,
      default: ""
    },
    langPath: {
      type: String
    },
    minChangeSize: {
      type: Number,
      default: 5
    },
    loadStyleMode: {
      type: Boolean,
      default: true
    },
    urlType: {
      type: String,
      default: ""
    },
    newlineTag: {
      type: String,
      default: "p"
    },
    pasteType: {
      type: Number,
      default: 2
    },
    dialogAlignType: {
      type: String,
      default: "page"
    },
    shadowMode: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 811213
    },
    useContextmenu: {
      type: Boolean,
      default: true
    },
    syncType: {
      type: String,
      default: "form"
    },
    indentChar: {
      type: String,
      default: "\t"
    },
    cssPath: {
      type: [String, Array]
    },
    cssData: {
      type: String
    },
    bodyClass: {
      type: String,
      default: "ke-content"
    },
    colorTable: {
      type: Array
    },
    afterCreate: {
      type: Function
    },
    afterChange: {
      type: Function
    },
    afterTab: {
      type: Function
    },
    afterFocus: {
      type: Function
    },
    afterBlur: {
      type: Function
    },
    afterUpload: {
      type: Function
    },
    uploadJson: {
      type: String
    },
    fileManagerJson: {
      type: Function
    },
    allowPreviewEmoticons: {
      type: Boolean,
      default: true
    },
    allowImageUpload: {
      type: Boolean,
      default: true
    },
    allowFlashUpload: {
      type: Boolean,
      default: true
    },
    allowMediaUpload: {
      type: Boolean,
      default: true
    },
    allowFileUpload: {
      type: Boolean,
      default: true
    },
    allowFileManager: {
      type: Boolean,
      default: false
    },
    fontSizeTable: {
      type: Array,
      default: function () {
        return ["9px", "10px", "12px", "14px", "16px", "18px", "24px", "32px"];
      }
    },
    imageTabIndex: {
      type: Number,
      default: 0
    },
    formatUploadUrl: {
      type: Boolean,
      default: true
    },
    fullscreenShortcut: {
      type: Boolean,
      default: false
    },
    extraFileUploadParams: {
      type: Array,
      default: function () {
        return [];
      }
    },
    filePostName: {
      type: String,
      default: "imgFile"
    },
    fillDescAfterUploadImage: {
      type: Boolean,
      default: false
    },
    afterSelectFile: {
      type: Function
    },
    pagebreakHtml: {
      type: String,
      default: "<hr style=”page-break-after: always;” class=”ke-pagebreak” />"
    },
    allowImageRemote: {
      type: Boolean,
      default: true
    },
    autoHeightMode: {
      type: Boolean,
      default: false
    },
    fixToolBar: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    content(val) {
      this.editor && val !== this.outContent && this.editor.html(val);
    },
    outContent(val) {
      this.$emit("update:content", val);
      this.$emit("on-content-change", val);
    }
  },
  mounted() {
    var _this = this;
    _this.editor = window.KindEditor.create("#" + this.id, {
      width: _this.width,
      height: _this.height,
      minWidth: _this.minWidth,
      minHeight: _this.minHeight,
      items: _this.items,
      noDisableItems: _this.noDisableItems,
      filterMode: _this.filterMode,
      htmlTags: _this.htmlTags,
      wellFormatMode: _this.wellFormatMode,
      resizeType: _this.resizeType,
      themeType: _this.themeType,
      langType: _this.langType,
      designMode: _this.designMode,
      fullscreenMode: _this.fullscreenMode,
      basePath: _this.basePath,
      themesPath: _this.cssPath,
      pluginsPath: _this.pluginsPath,
      langPath: _this.langPath,
      minChangeSize: _this.minChangeSize,
      loadStyleMode: _this.loadStyleMode,
      urlType: _this.urlType,
      newlineTag: _this.newlineTag,
      pasteType: _this.pasteType,
      dialogAlignType: _this.dialogAlignType,
      shadowMode: _this.shadowMode,
      zIndex: _this.zIndex,
      useContextmenu: _this.useContextmenu,
      syncType: _this.syncType,
      indentChar: _this.indentChar,
      cssPath: _this.cssPath,
      cssData: _this.cssData,
      bodyClass: _this.bodyClass,
      colorTable: _this.colorTable,
      // afterCreate: _this.afterCreate,
      afterCreate: function () {
        const customImage = document.querySelector('.ke-outline[data-name="customImage"]');
        customImage.title = "插入图片";
        customImage.innerHTML =
          "<span class='ke-toolbar-icon ke-toolbar-icon-url ke-icon-image' unselectable='on'></span>";
        // 绑定点击事件
        if (customImage) {
          customImage.addEventListener("click", () => {
            const uploadInput = _this.$refs.imgUploadRef.$el.querySelector('input[type="file"]');
            if (uploadInput) {
              !_this.disabled && uploadInput.click(); // 触发input的点击事件
            }
          });
        }
        // 获取编辑区域的 document 并绑定粘贴事件
        const editDoc = this.edit.doc;
        editDoc.addEventListener("paste", _this.handlePaste);
        _this.afterCreate && _this.afterCreate();
      },
      afterChange: function () {
        _this.afterChange && _this.afterChange();
        _this.outContent = this.html();
      },
      afterTab: _this.afterTab,
      afterFocus: _this.afterFocus,
      afterBlur: _this.afterBlur,
      afterUpload: _this.afterUpload,
      uploadJson: _this.uploadJson,
      fileManagerJson: _this.fileManagerJson,
      allowPreviewEmoticons: _this.allowPreviewEmoticons,
      allowImageUpload: _this.allowImageUpload,
      allowFlashUpload: _this.allowFlashUpload,
      allowMediaUpload: _this.allowMediaUpload,
      allowFileUpload: _this.allowFileUpload,
      allowFileManager: _this.allowFileManager,
      fontSizeTable: _this.fontSizeTable,
      imageTabIndex: _this.imageTabIndex,
      formatUploadUrl: _this.formatUploadUrl,
      fullscreenShortcut: _this.fullscreenShortcut,
      extraFileUploadParams: _this.extraFileUploadParams,
      filePostName: _this.filePostName,
      fillDescAfterUploadImage: _this.fillDescAfterUploadImage,
      afterSelectFile: _this.afterSelectFile,
      pagebreakHtml: _this.pagebreakHtml,
      allowImageRemote: _this.allowImageRemote,
      autoHeightMode: _this.autoHeightMode,
      fixToolBar: _this.fixToolBar,
      tabIndex: _this.tabIndex
    });
    _this.$nextTick(() => {
      if (_this.disabled) {
        _this.editor.readonly(true);
      } else {
        _this.editor.readonly(false);
      }
    });
  },
  methods: {
    getEditor() {
      return this.editor;
    },
    httpRequest(e) {
      console.log(e);
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        this.editor.insertHtml('<img src="' + url + '"></img>');
      };
      reader.readAsDataURL(e.file);
    },
    // 粘贴事件处理函数
    handlePaste(e) {
      // e.preventDefault(); // 阻止默认粘贴行为

      // 获取剪贴板中的纯文本
      // const clipboardData = e.clipboardData || window.clipboardData;
      
      // const text = clipboardData.getData("text/plain");

      // if (text) {
      //   // 替换所有换行符为 <br>，并去除其他 HTML 标签
      //   const cleanedHtml = text.replace(/\r?\n/g, "<br>"); // 处理不同系统的换行符
      //   // .replace(/</g, '&lt;')    // 转义潜在 HTML 标签
      //   // .replace(/>/g, '&gt;');

      //   // 插入处理后的内容
      //   this.editor.insertHtml(cleanedHtml);
      // }
    }
  }
};
</script>

<style>
</style>