<template>
  <div>
    <!-- <canvas id="pdf-canvas"></canvas> -->
    <div class="center">
      <div class="contor">
        <button
          
          style="cursor:pointer"
          @click="prev"
        >上一页</button>
        <span>
          <span v-text="page_num" /> /
          <span v-text="page_count" />
        </span>
        <button
          @click="next"
        >下一页</button>
        <button
          @click="addscale"
        >放大</button>
        <button
          @click="minus"
        >缩小</button>
      </div>
      <canvas id="the-canvas" class="canvasstyle" />
    </div>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js'
export default {
  // data(){
  //   return{}
  // },
  // mounted(){
  //   console.log('PDFJS',PDFJS);
  //   // PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
  //   var url = 'src/assets/1.pdf';

  //   PDFJS.getDocument(url).then((pdf) => {
  //       return pdf.getPage(1);
  //   }).then((page) => {
  //       // 设置展示比例
  //       var scale = 1.5;
  //       // 获取pdf尺寸
  //       var viewport = page.getViewport(scale);
  //       // 获取需要渲染的元素
  //       var canvas = document.getElementById('pdf-canvas');
  //       var context = canvas.getContext('2d');
  //       canvas.height = viewport.height;
  //       canvas.width = viewport.width;
        
  //       var renderContext = {
  //           canvasContext: context,
  //           viewport: viewport
  //       };
        
  //       page.render(renderContext);
  //   });
  // }


   data() {
    return {
      pdfUrl: "",
      pdfDoc: null, // pdfjs 生成的对象
      pageNum: 1, //
      pageRendering: false,
      pageNumPending: null,
      scale: 1.7, // 放大倍数
      page_num: 0, // 当前页数
      page_count: 0, // 总页数
      maxscale: 2.2, // 最大放大倍数
      minscale: 1.2 // 最小放大倍数
    };
  },
  computed: {
    ctx() {
      const id = document.getElementById("the-canvas");
      return id.getContext("2d");
    }
  },

  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    init(pdfUrl) {
      let _this = this;
      // 初始化pdf
      PDFJS.getDocument(pdfUrl).then(function(pdfDoc_) {
        _this.pdfDoc = pdfDoc_;
        _this.page_count = _this.pdfDoc.numPages;
        _this.renderPage(_this.pageNum);
      });
    },
    renderPage(num) {
      // 渲染pdf
      const vm = this;
      this.pageRendering = true;
      const canvas = document.getElementById("the-canvas");
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(vm.scale);
        // alert(vm.canvas.height)
        canvas.height = viewport.height;
        vm.pdfWidth = canvas.width = viewport.width;
        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: vm.ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        // Wait for rendering to finish
        renderTask.promise.then(function() {
          vm.pageRendering = false;
          if (vm.pageNumPending !== null) {
            // New page rendering is pending
            vm.renderPage(vm.pageNumPending);
            vm.pageNumPending = null;
          }
        });
      });
      vm.page_num = vm.pageNum;
    },
    addscale() {
      // 放大
      if (this.scale >= this.maxscale) {
        return;
      }
      this.scale += 0.5;
      this.queueRenderPage(this.pageNum);
    },
    minus() {
      // 缩小
      if (this.scale <= this.minscale) {
        return;
      }
      this.scale -= 0.5;
      this.queueRenderPage(this.pageNum);
    },
    prev() {
      // 上一页
      const vm = this;
      if (vm.pageNum <= 1) {
        return;
      }
      vm.pageNum--;
      vm.queueRenderPage(vm.pageNum);
    },
    next() {
      // 下一页
      const vm = this;
      if (vm.pageNum >= vm.page_count) {
        return;
      }
      vm.pageNum++;
      vm.queueRenderPage(vm.pageNum);
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    }
  },
  mounted() {
  //解决字体问题
    const CMAP_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/cmaps/";
    let obj = {};
    obj.url = "http://vip.datadriver.com.cn:9600/pfom/api/file/v1.0/downloadFile?id=29550af8-43ae-4600-86f7-7407ca0fc255&token=aAgIvnjzPvKMoEkF1zXMEi8N7ucYUXHCJLsAfnHPa%2Bn%2FD0Vm0iHxrk%2B7oX29ntOYAOQlIsv8NTmT0lPI77zYbHKdQDvYq9U1";  //pdf文件地址，根据情景自行修改
    obj.cMapUrl = CMAP_URL;
    obj.cMapPacked = true;
    this.init(obj);
  }
}
</script>

<style>

</style>
