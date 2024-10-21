<template>
  <div class="work-flow-view">
    <div class="cover"></div>
    <div class="canvasView" ref="canvasView"></div>
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnViewer from "bpmn-js/lib/Viewer";

import { requestXmlStr, processStatus } from "./scripts/requestXml";
import commonUtils from "@/utils/index";
export default {
  data() {
    return {
      // bpmn建模器
      bpmnDom: null,
    };
  },
  mounted() {
    this.open(requestXmlStr);
  },
  methods: {
    /**
     * @description 初始化mounted调用
     */
    open(bpmn20Xml) {
      this.visible = true;
      this.$nextTick(() => {
        this.init(bpmn20Xml);

        // 移除右下角自带logo
        const BjsDom = document.querySelector(".bjs-container");
        const aDom = document.querySelector(".bjs-powered-by");
        BjsDom.removeChild(aDom);
      });
    },
    /**
     * @description 初始化bpmn
     */
    init(bpmn20Xml) {
      // 获取到属性ref为“canvas”的dom节点
      // 建模
      this.bpmnDom = new BpmnViewer({
        container: this.$refs.canvasView,
        keyboard: {
          bindTo: window,
        },
      });
      this.createNewDiagram(bpmn20Xml);
    },
    /**
     * @description 创建新的画布流程
     */
    createNewDiagram(bpmn20Xml) {
      // 将字符串转换成图显示出来
      this.bpmnDom.importXML(bpmn20Xml, (err) => {
        if (err) {
          reject(err);
          return;
        }
        // 让图能自适应屏幕
        var canvas = this.bpmnDom.get("canvas");
        canvas.zoom("fit-viewport");
        // 变色
        this.updateNodeColor();
      });
    },
    /**
     * @description 更改节点颜色
     */
    updateNodeColor() {
      if (processStatus.data && processStatus.data.length) {
        this.viewSuccess = [];
        this.viewReading = [];
        this.xmlIdArr = [];
        let tempCom = [];
        let tempCRun = [];
        for (let item of processStatus.data) {
          let obj = {
            remark: "",
            xmlId: item.xmlId || "",
          };
          if (item.taskStatus == "COMPLETED") {
            obj["remark"] = "已完成";
            tempCom.push(obj);
          } else if (item.taskStatus == "RUNNING") {
            obj["remark"] = "当前处理";
            tempCRun.push(obj);
          }
          this.xmlIdArr.push(item.xmlId);
        }
        this.viewSuccess = tempCom;
        this.viewReading = tempCRun;
        commonUtils.handleRenderBpmnColor(
          this.xmlIdArr,
          this.viewSuccess,
          this.viewReading,
          this
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.work-flow-view {
  position: relative;
  height: 280px;
  .canvasView {
    width: 100%;
    height: 280px;
  }
  .cover {
    position: absolute;
    height: 280px;
    width: 100%;
    z-index: 999;
  }
}
</style>
