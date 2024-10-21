<template>
  <div class="main">
    <div class="containers" v-loading="loading">
      <div class="canvas" ref="canvas"></div>
      <div
        id="js-properties-panel"
        :class="isShowPanel ? 'panel' : 'panel-hidden'"
      >
        <div
          v-if="!loading"
          class="icon-toggle"
          :class="isShowPanel ? 'toggle-pos-20' : 'toggle-pos-0'"
          @click="handleTogglePanel"
        >
          <i
            :class="isShowPanel ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
          ></i>
        </div>
      </div>
    </div>
    <ul class="buttons">
      <li>
        <a
          ref="saveDiagram"
          href="javascript:"
          title="保存"
          onClick="javascript:saveWorkFlow()"
          >保存</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "./components/properties-panel/provider/activiti";

// 小地图
import minimapModule from "diagram-js-minimap";
import "diagram-js-minimap/assets/diagram-js-minimap.css";

// 导入汉化包
import customTranslate from "./components/customTranslate/customTranslate";
import activitiModdleDescriptor from "@/assets/activiti.json";

// xml结构
import { defaultXmlStr } from "./scripts/defaultXml";
import { requestXmlStr } from "./scripts/requestXml";

export default {
  name: "workFlow",
  props: {
    dialogStatus: {
      type: String,
      default: "",
    },
  },
  watch: {
    dialogStatus: {
      handler(val) {
        this.status = val;
      },
      immediate: true,
    },
  },
  mounted() {
    this.init(this.status);
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      // loading状态
      loading: false,
      // 当前画布xml
      currentXML: "",
      //流程通过项
      viewSuccess: [],
      //流程执行中
      viewReading: [],
      // xmlId
      xmlIdArr: [],
      // 当前状态
      status: "",
      // 是否显示右侧面板
      isShowPanel: true,
    };
  },
  // 方法集合
  methods: {
    /**
     * @description 初始化mounted调用
     */
    init(status) {
      // 挂载vue方法至window
      window.saveWorkFlow = this.saveWorkFlow;
      this.$nextTick(() => {
        this.initBpmn(status);
        // 移除右下角自带logo
        const BjsDom = document.querySelector(".bjs-container");
        const aDom = document.querySelector(".bjs-powered-by");
        BjsDom.removeChild(aDom);
      });
    },
    /**
     * @description 初始化bpmn
     */
    initBpmn(status) {
      // 添加汉化组件
      const customTranslateModule = {
        translate: ["value", customTranslate],
      };
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas;
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        //添加控制板
        propertiesPanel: {
          parent: "#js-properties-panel",
        },
        additionalModules: [
          // 左边工具栏以及节点
          propertiesProviderModule,
          // 右边的工具栏
          propertiesPanelModule,
          // 汉化组件
          customTranslateModule,
          // 小地图
          minimapModule,
        ],
        moddleExtensions: {
          activiti: activitiModdleDescriptor,
        },
      });
      this.createNewDiagram(status);
    },
    /**
     * @description 创建新的画布流程
     */
    createNewDiagram(status) {
      console.log(status);
      let bpmnXmlStr = "";
      if (status === "ADD") {
        bpmnXmlStr = defaultXmlStr;
        this.transformCanvas(bpmnXmlStr);
      } else if (status === "EDIT") {
        this.loading = true;
        setTimeout(async () => {
          bpmnXmlStr = requestXmlStr;
          this.loading = false;
          await this.transformCanvas(bpmnXmlStr);
          this.updatePosition();
        }, 2000);
      }
    },
    /**
     * @description 渲染xml至画布
     */
    transformCanvas(bpmnXmlStr) {
      return new Promise((resolve, reject) => {
        // 将字符串转换成图显示出来
        this.bpmnModeler.importXML(bpmnXmlStr, (err) => {
          if (err) {
            reject(err);
            return;
          } else {
            this.success();
          }
          // 让图能自适应屏幕
          var canvas = this.bpmnModeler.get("canvas");
          canvas.zoom("fit-viewport");
          resolve();
        });
      });
    },

    /**
     * @description 初始化偏移量
     */
    updatePosition() {
      const viewPortDom = document.querySelector(".viewport");
      viewPortDom.attributes["transform"].nodeValue = "matrix(1 0 0 1 35 26)";
    },
    /**
     * @description 渲染至画布成功回调
     */
    success() {
      this.addBpmnListener();
      this.addEventBusListener();
    },
    /**
     * @description 监听element
     */
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get("eventBus");
      const eventTypes = [
        "element.click",
        "element.changed",
        "element.updateLabel",
      ];
      eventTypes.forEach(function (eventType) {
        eventBus.on(eventType, (e) => {
          console.log(eventType, "eventType");
          if (!e || e.element.type == "bpmn:Process") return;
          if (eventType === "element.changed") {
            // this.updateNodeColor();
            console.log(e.gfx);
          } else if (eventType === "element.click") {
            console.log("点击了element", e);
          } else if (eventType === "element.updateLabel") {
            console.log("element.updateLabel", e.element);
          }
        });
      });
    },
    /**
     * @description 添加a标签绑定事件
     */
    addBpmnListener() {
      const that = this;
      // 获取a标签dom节点
      const saveDiagramLink = this.$refs.saveDiagram;
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on("commandStack.changed", function () {
        that.uploadDiagram(function (err, xml) {
          that.getCurrentXML(saveDiagramLink, err ? null : xml);
        });
      });
    },
    /**
     * @description 下载为bpmn格式
     */
    uploadDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml);
      });
    },
    /**
     * @description 当图发生改变的时候会调用这个函数，获取当前xml结构
     */
    getCurrentXML(link, data) {
      if (data) {
        link.className = "active";
        this.currentXML = data;
      }
    },
    /**
     * @description 保存画布
     */
    saveWorkFlow() {
      console.log(this.currentXML);
      
      alert(this.currentXML);
    },
    /**
     * @description 切换右侧面板是否显示
     */
    handleTogglePanel() {
      this.isShowPanel = !this.isShowPanel;
    },
  },
};
</script>

<style lang="less" scoped>
.containers {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - (100vh / 5));
  display: flex;
  position: relative;
}
.loading {
  font-size: 26px;
}
.canvas {
  flex: 1;
  height: 100%;
}

.panel {
  overflow-y: auto;
  height: 100%;
  width: 20%;
  background-color: #f8f8f8;
  transition: width 0.15s;
}
.panel-hidden {
  width: 0%;
  transition: width 0.15s;
}

.icon-toggle {
  position: absolute;
  top: 50%;
  right: 20%;
  margin-top: -50px;
  height: 100px;
  width: 20px;
  background-color: #f8f8f8;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: right 0.15s;
}
.toggle-pos-20 {
  right: 20%;
  transition: right 0.15s;
}
.toggle-pos-0 {
  right: 0;
  transition: right 0.15s;
}

.buttons {
  position: absolute;
  right: 50px;
  top: 12px;
}
.buttons li {
  display: inline-block;
  margin: 5px;
}
.buttons li a {
  color: #999;
  background: #eee;
  cursor: not-allowed;
  padding: 8px 20px;
  border: 1px solid #ccc;
  text-decoration: none;
  border-radius: 5px;
}
.buttons li a.active {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  border-radius: 5px;
  cursor: pointer;
}

::v-deep .bpp-properties-group.group-closed {
  max-height: 27px;
}
::v-deep .djs-minimap .toggle {
  padding: 5px;
  cursor: pointer;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(153, 151, 151, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(153, 150, 150, 0.3);
  background-color: #ddd;
}
</style>
