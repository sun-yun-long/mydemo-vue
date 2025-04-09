<template>
  <div>
    <button @click="exportPDF">导出为 PDF</button>
    <div id="capture" ref="captureArea" style="padding: 20px; background-color: #fff;">
      <h1>导出示例</h1>
      <p>这是一个示例页面，我们将其导出为 PDF 文件。</p>
      <p v-for="i in 100" :key="i" style="margin-top: 25px;">这是第 {{ i }} 行内容</p>
      <p>更多内容...</p>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  methods: {
    exportPDF() {
      const element = this.$refs.captureArea; // 获取要导出的区域

      // 使用 html2canvas 将元素转换为 canvas
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // 将 canvas 转换为图片数据
        const pdf = new jsPDF('p', 'mm', 'a4'); // 创建新的 jsPDF 实例

        const imgWidth = 190; // 图片宽度（A4 页面宽度）
        const pageHeight = 295; // A4 页面高度
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // 计算图片高度
        let heightLeft = imgHeight; // 剩余高度

        // 设置页边距
        const margin = 10; // 设置边距为 10mm
        let position = margin; // 初始位置

        // 将图片添加到 PDF 中
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2); // 减去上下页边距后的高度

        // 如果图片高度大于页面高度，则需要分页
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + margin; // 新页的初始位置
          pdf.addPage(); // 添加新页
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= (pageHeight - margin * 2); // 减少剩余高度
        }

        pdf.save('download.pdf'); // 保存 PDF 文件
      });
    },
  },
};
</script>

<style>
#capture {
  border: 1px solid #ccc; /* 可选样式 */
}
</style>
