<template>
  <div>
    <TinymceEditor
      v-model="content"
      :upload-handler="uploadImage"
      @upload-success="handleUploadSuccess"
      @upload-error="handleUploadError"
    />
  </div>
</template>

<script>
import TinymceEditor from '@/components/Tinymce'

export default {
  components: { TinymceEditor },
  data() {
    return {
      content: ''
    }
  },
  mounted() {
    console.log("TinymceEditorTinymceEditor");
    
  },
  methods: {
    async uploadImage(file, filename) {
      const formData = new FormData()
      formData.append('file', file, filename)
      
      // const { data } = await axios.post('/api/upload', formData)
      // return data.url
    },
    handleUploadSuccess(url) {
      console.log('图片上传成功:', url)
    },
    handleUploadError(error) {
      console.error('图片上传失败:', error)
    }
  }
}
</script>