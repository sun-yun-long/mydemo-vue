<template>
  <div class="tinymce-editor">
    <Editor
      v-model="editorValue"
      :init="mergedInitOptions"
      :disabled="disabled"
      @onChange="handleChange"
    />
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/skins/ui/oxide/skin.css'
// import 'tinymce-i18n/langs/zh_CN'

// 引入基础插件
import 'tinymce/themes/silver'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/code'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/help'
import 'tinymce/plugins/preview'


// 默认配置
const DEFAULT_INIT_OPTIONS = {
  // language: 'zh_CN',
  height: 500,
  menubar: false,
  plugins: 'paste link image table code',
  toolbar: 'undo redo | formatselect | bold italic underline strikethrough | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | link image table | code',
  paste_as_text: false,
  branding: false,
  content_css: false
}

export default {
  name: 'TinymceEditor',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    },
    initOptions: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: [Number, String],
      default: 500
    },
    disabled: {
      type: Boolean,
      default: false
    },
    uploadHandler: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      editorValue: this.value,
      editorInstance: null
    }
  },
  computed: {
    mergedInitOptions() {
      return {
        ...DEFAULT_INIT_OPTIONS,
        ...this.initOptions,
        height: this.height,
        images_upload_handler: this.handleImageUpload,
        setup: (editor) => {
          this.editorInstance = editor
          editor.on('init', () => {
            editor.setContent(this.value)
          })
          // 暴露编辑器实例给父组件
          this.$emit('init', editor)
        }
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.editorValue) {
        this.editorValue = newVal
      }
    },
    disabled(newVal) {
      if (this.editorInstance) {
        this.editorInstance.setMode(newVal ? 'readonly' : 'design')
      }
    }
  },
  mounted() {
    tinymce.init({})
  },
  beforeDestroy() {
    if (this.editorInstance) {
      tinymce.remove(this.editorInstance)
    }
  },
  methods: {
    handleChange(content) {
      this.$emit('input', content)
      this.$emit('change', content)
    },
    async handleImageUpload(blobInfo, success, failure) {
      try {
        const url = await this.uploadHandler(blobInfo.blob(), blobInfo.filename())
        success(url)
        this.$emit('upload-success', url)
      } catch (error) {
        failure(error.message)
        this.$emit('upload-error', error)
      }
    }
  }
}
</script>

<style scoped>
.tinymce-editor {
  position: relative;
  line-height: normal;
}
</style>