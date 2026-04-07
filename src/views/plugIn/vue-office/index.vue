<template>
  <div class="vue-office-preview-container">
    <el-card>
      <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
        <span>@vue-office 文件预览演示</span>
        <el-upload action="" :auto-upload="false" :show-file-list="false" accept=".docx,.xlsx,.xls,.pdf,.pptx"
          :on-change="handleFileChange">
          <el-button size="small" type="primary">选择本地文件</el-button>
        </el-upload>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Word (docx)" name="docx">
          <vue-office-docx v-if="activeName === 'docx'" v-loading="loading" element-loading-text="文件加载中..." :src="docxUrl" style="height: 80vh;" @rendered="onRendered"
            @error="onError" />
        </el-tab-pane>

        <el-tab-pane label="Excel (xlsx)" name="excel">
          <vue-office-excel v-if="activeName === 'excel'" v-loading="loading" element-loading-text="文件加载中..." :src="excelUrl" style="height: 80vh;" @rendered="onRendered"
            @error="onError" />
        </el-tab-pane>

        <el-tab-pane label="PDF" name="pdf">
          <vue-office-pdf v-if="activeName === 'pdf'" v-loading="loading" element-loading-text="文件加载中..." :src="pdfUrl" style="height: 80vh;" @rendered="onRendered"
            @error="onError" />
        </el-tab-pane>

        <el-tab-pane label="PPT (pptx)" name="pptx">
          <vue-office-pptx v-if="activeName === 'pptx'" v-loading="loading" element-loading-text="文件加载中..." :src="pptxUrl" style="height: 80vh;" @rendered="onRendered"
            @error="onError" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 引入各文件类型的VueOffice组件
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficePptx from '@vue-office/pptx'

// 引入特定格式的相关样式 (docx和excel需要引入样式)
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'

export default {
  name: 'VueOfficePreview',
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf,
    VueOfficePptx
  },
  data() {
    return {
      activeName: 'docx',
      loading: true,
      docxUrl: 'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.docx',
      excelUrl: 'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.xlsx',
      pdfUrl: 'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.pdf',
      pptxUrl: 'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.pptx'
    }
  },
  watch: {
    activeName() {
      this.loading = true;
    }
  },
  methods: {
    handleFileChange(file) {
      if (!file || !file.raw) return;
      this.loading = true;
      const rawFile = file.raw;
      const fileName = rawFile.name.toLowerCase();

      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;

        if (fileName.endsWith('.docx')) {
          this.activeName = 'docx';
          this.docxUrl = arrayBuffer;
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
          this.activeName = 'excel';
          this.excelUrl = arrayBuffer;
        } else if (fileName.endsWith('.pdf')) {
          this.activeName = 'pdf';
          this.pdfUrl = arrayBuffer;
        } else if (fileName.endsWith('.pptx')) {
          this.activeName = 'pptx';
          this.pptxUrl = arrayBuffer;
        } else {
          this.$message.warning('暂不支持该类型文件的预览！');
        }
      };

      reader.onerror = () => {
        this.$message.error('文件读取失败');
      };

      reader.readAsArrayBuffer(rawFile);
    },
    onRendered() {
      this.loading = false;
      console.log('文件渲染完成')
    },
    onError() {
      this.loading = false;
      console.error('文件渲染失败')
      this.$message.error('文件渲染失败，请检查链接或文件格式！')
    }
  }
}
</script>

<style scoped>
.vue-office-preview-container {
  /* padding: 20px; */
  height: 100%;
}
</style>
