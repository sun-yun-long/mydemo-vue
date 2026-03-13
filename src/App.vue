<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-02 15:41:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-12-26 17:26:59
-->
<template>
  <div id="app" style="height: 100%">
    <vue2-water-marker
      :text="watermarkText"
      :opacity="0.2"
      :openPrevent="true"
      :beDeleteTips="'禁止删除水印！'"
      :beChangeTips="'禁止篡改水印！'"
      :zIndex="9999"
      :rotateDeg="45"
    />
    <el-container style="height: 100%">
      <el-aside :width="asideWidth" ref="aside" style="background-color: #304156; position: relative;">
        <!-- 拖拽手柄 -->
        <div 
          class="aside-drag-handle"
          @mousedown="onDragStart"
        ></div>
        <el-menu
          style="height: 100%; overflow-y: auto; overflow-x: hidden;"
          :unique-opened="true"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
          :default-active="$route.path"
        >
          <template v-for="item in menuList">
            <el-submenu :index="item.path" :key="item.id" v-if="item.children">
              <template slot="title">
                <i class="el-icon-setting"></i>{{ item.title || item.name }}</template
              >
              <el-menu-item 
                :index="item.path + '/' + ite.path"
                v-for="ite in item.children"
                :key="ite.id"
              >
                {{ ite.title || ite.name }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item 
              :index="item.path" 
              :key="`${item.id}_${item.path}`" 
              v-else
            >
              {{ item.title || item.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header
          style="
            font-size: 16px;
            font-weight: 600;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #d8dce5;
          "
        >
          <span>xxxxxxx</span>
        </el-header>
        <el-main style="padding: 10px !important; overflow-x: hidden">
          <transition name="scale" mode="out-in">
            <!-- <keep-alive> -->
              <router-view></router-view>
            <!-- </keep-alive> -->
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { constantRouterMap } from "./router";
export default {
  name: "",
  data() {
    return {
      asideWidth: '200px',
      isDragging: false,
      startX: 0
    };
  },
  mounted() {
    // 添加全局鼠标事件监听器
    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);
  },
  beforeDestroy() {
    // 清理事件监听器
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);
  },
  computed: {
    menuList() {
      const list = constantRouterMap;
      let menuList = [];
      list.forEach((item) => {
        let obj = {};
        if (!item.noShow) {
          obj = {
            id: item.id,
            path: item.path,
            name: item.name,
            title: item.title
          };
          if (item.children) {
            obj.children = [];
            item.children.forEach((ite) => {
              if (!ite.noShow) {
                obj.children.push({
                  id: ite.id,
                  path: ite.path,
                  name: ite.name,
                  title: ite.title
                });
              }
            });
          }
        }
        menuList.push(obj);
      });
      return menuList;
    },
    watermarkText() {
      return `张三 ${new Date().toLocaleString()}`;
    }
  },
  methods: {
    onDragStart(e) {
      this.isDragging = true;
      this.startX = e.clientX;
      e.preventDefault();
      e.stopPropagation();
    },
    onDragMove(e) {
      if (!this.isDragging) return;
      
      const deltaX = e.clientX - this.startX;
      const currentWidth = parseInt(this.asideWidth, 10);
      const newWidth = Math.max(150, Math.min(500, currentWidth + deltaX));
      
      this.asideWidth = `${newWidth}px`;
      this.startX = e.clientX;
    },
    onDragEnd() {
      this.isDragging = false;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
a {
  color: aliceblue;
}

/* 拖拽手柄样式 */
.aside-drag-handle {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #409EFF;
  }
  
  &:active {
    background-color: #66B1FF;
  }
}
</style>
