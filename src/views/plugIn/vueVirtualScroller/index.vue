<template>
  <div class="vue-virtual-scroller-demo">
    <h2>Vue Virtual Scroller Demo</h2>

    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="1. Basic Usage (Fixed Height)" name="basic">
        <div class="scroller-container">
          <RecycleScroller
            class="scroller"
            :items="fixedHeightItems"
            :item-size="60"
            key-field="id"
          >
            <template slot-scope="{ item }">
              <div class="item fixed-height-item">
                <span class="item-id">{{ item.id }}</span>
                <span class="item-content">{{ item.content }}</span>
              </div>
            </template>
          </RecycleScroller>
        </div>
      </el-tab-pane>

      <el-tab-pane label="2. Dynamic Height Items" name="dynamic">
        <div class="scroller-container">
          <DynamicScroller
            ref="scroller"
            class="scroller"
            :items="dynamicHeightItems"
            :min-item-size="60"
            key-field="id"
            @resize="handleResize"
            @visible="handleVisible"
            @hidden="handleHidden"
            @scroll="handleScroll"
            :emitUpdate="true"
            @update="handleUpdate"
          >
            <template slot-scope="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[item.content.length]"
                :data-index="index"
              >
                <div
                  class="item"
                  v-html="item.content"
                ></div>
                <!-- <div class="item dynamic-height-item" :style="{ height: item.height + 'px' }">
                  <span class="item-id">{{ item.id }}</span>
                  <div class="item-content">{{ item.content }}</div>
                  <div class="item-meta">Height: {{ item.height }}px</div>
                </div> -->
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </div>
      </el-tab-pane>

      <el-tab-pane label="3. Large Dataset (100,000 Items)" name="large">
        <div class="scroller-container large-container">
          <RecycleScroller
            class="scroller"
            :items="largeDataset"
            :item-size="50"
            key-field="id"
          >
            <template slot-scope="{ item }">
              <div class="item large-dataset-item">
                <span class="item-id">{{ item.id }}</span>
                <span class="item-content">Item {{ item.id }} - {{ item.content }}</span>
              </div>
            </template>
          </RecycleScroller>
        </div>
        <div class="dataset-info">
          <el-tag type="info">Total items: {{ largeDataset.length.toLocaleString() }}</el-tag>
        </div>
      </el-tab-pane>

      <el-tab-pane label="4. Grid Layout" name="grid">
        <div class="grid-container">
          <RecycleScroller
            class="scroller grid-scroller"
            :items="gridItems"
            :item-size="120"
            key-field="id"
          >
            <template slot-scope="{ item }">
              <div class="grid-item">
                <div class="grid-item-content">
                  <span class="item-id">{{ item.id }}</span>
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-value">{{ item.value }}</div>
                </div>
              </div>
            </template>
          </RecycleScroller>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { RecycleScroller, DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
export default {
  name: "VueVirtualScrollerDemo",
  components: {
    RecycleScroller,
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      activeTab: 'dynamic',
      fixedHeightItems: [],
      dynamicHeightItems: [],
      largeDataset: [],
      gridItems: [],
      visibleItemIds: []
    };
  },
  mounted() {
    // 将echarts暴露到全局作用域，供动态脚本访问
    this.$nextTick(() => {
      window.echarts = echarts;
      this.generateFixedHeightItems();
      this.generateDynamicHeightItems();
      this.generateLargeDataset();
      this.generateGridItems();
    })
    
  },
  
  beforeDestroy() {
    // 组件销毁时，移除全局作用域的echarts，避免全局污染
    if (window.echarts) {
      delete window.echarts;
    }
  },
  methods: {
    generateFixedHeightItems() {
      this.fixedHeightItems = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        content: `Fixed height item ${index + 1} - This is a simple fixed height element`
      }));
    },

    generateDynamicHeightItems() {
      this.dynamicHeightItems = Array.from({ length: 100 }, (_, index) => {
        const htmlStr = `<div id="echarts_${index}" style="height: 300px; width: 100%;">${index}</div>`;
        const jsStr = `
          if (document.getElementById('echarts_${index}')) {
            echarts.init(document.getElementById('echarts_${index}')).setOption({
              title: {
                text: 'Dynamic height item ${index}'
              },
              xAxis: {
                data: ['A', 'B', 'C', 'D', 'E']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                type: 'bar',
                data: [10, 20, 30, 40, 50]
              }]
            });
          }
        `;
        return {
          id: index,
          content: htmlStr,
          jsStr: jsStr,
          height: 60
        };
      });
    },

    // 动态生成script标签
    dealRenderScriptList(jsStr, itemId) {
      // 动态生成script标签，对标签命名，便于删除
      const scriptTag = document.createElement("script");
      scriptTag.textContent = jsStr;
      scriptTag.id = itemId;
      document.body.appendChild(scriptTag);
    },

    // 移除script标签
    dealRemoveScriptList(itemId) {
      const scriptTag = document.getElementById(itemId);
      if (scriptTag) {
        document.body.removeChild(scriptTag);
      }
    },

    generateLargeDataset() {
      this.largeDataset = Array.from({ length: 100000 }, (_, index) => ({
        id: index + 1,
        content: `Data item with long description that needs virtual scrolling for performance`
      }));
    },

    generateGridItems() {
      const categories = ["A", "B", "C", "D", "E"];
      this.gridItems = Array.from({ length: 2000 }, (_, index) => ({
        id: index + 1,
        title: `Category ${categories[index % categories.length]}`,
        value: Math.floor(Math.random() * 10000)
      }));
    },
    handleUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
      // console.log('update', `startIndex: ${startIndex}, endIndex: ${endIndex}, visibleStartIndex: ${visibleStartIndex}, visibleEndIndex: ${visibleEndIndex}`);
      // 收集当前可见项的 id
      const visibleIds = this.dynamicHeightItems
        .slice(visibleStartIndex, visibleEndIndex + 1)
        .map(item => item.id);
      console.log(visibleIds);
      
      // 新增可见项：渲染 echarts
      visibleIds.forEach(id => {
        const item = this.dynamicHeightItems[id];
        if (item && item.jsStr && document.getElementById(`echarts_${id}`)) {
          this.dealRenderScriptList(item.jsStr, `echarts_script_${id}`);
          setTimeout(() => {
            this.dealRemoveScriptList(`echarts_script_${id}`);
          }, 1000);
        }
      });
    },
    handleResize(data) {
      console.log('resize', data);
    },
    handleVisible(data) {
      console.log('visible', data);
    },
    handleHidden(data) {
      console.log('hidden', data);
    },
    handleScroll(data) {
      console.log('scroll', data);
    },
  }
};
</script>

<style scoped>
.vue-virtual-scroller-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h3 {
  color: #555;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/* 移除了demo-section样式，因为现在使用el-tabs组件 */

.scroller-container {
  width: 100%;
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.scroller-container.large-container {
  height: 500px;
}

.scroller {
  height: 100%;
}

.item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.item:hover {
  background-color: #f5f7fa;
}

.fixed-height-item {
  height: 60px;
}

.dynamic-height-item {
  min-height: 60px;
  padding: 15px 20px;
  align-items: flex-start;
}

.item-id {
  width: 60px;
  font-weight: bold;
  color: #409eff;
  margin-right: 20px;
}

.item-content {
  flex: 1;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dynamic-height-item .item-content {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.item-meta {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.large-dataset-item {
  height: 50px;
  background: linear-gradient(90deg, #fafafa 0%, #f5f5f5 100%);
}

.dataset-info {
  margin-top: 10px;
  text-align: center;
}

.grid-container {
  width: 100%;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.grid-scroller {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.grid-item {
  width: calc(25% - 10px);
  height: 120px;
  margin: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.grid-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px;
  text-align: center;
}

.grid-item .item-id {
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0;
  font-size: 14px;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.item-value {
  font-size: 20px;
  font-weight: bold;
}
</style>