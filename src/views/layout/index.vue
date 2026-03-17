<template>
  <el-container class="app-wrapper" style="height: 100%; background-color: #f0f2f5;">
    <el-aside :width="isCollapse ? '64px' : asideWidth" ref="aside" class="custom-aside">
      <!-- 头部 Logo 区域 -->
      <div class="logo-container">
        <img src="~@/assets/logo.png" alt="logo" class="logo" />
        <transition name="fade">
          <span v-show="!isCollapse" class="sys-title">后台管理系统</span>
        </transition>
      </div>

      <!-- 拖拽手柄 -->
      <div 
        v-show="!isCollapse"
        class="aside-drag-handle"
        @mousedown="onDragStart"
      ></div>
      
      <el-menu
        class="custom-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
        :default-active="$route.path"
      >
        <template v-for="item in menuList">
          <el-submenu :index="item.path" :key="item.id" v-if="item.children && item.children.length > 0">
            <template slot="title">
              <i :class="item.icon || 'el-icon-folder'"></i>
              <span slot="title">{{ item.title || item.name || '模块' }}</span>
            </template>
            <el-menu-item 
              :index="item.path + '/' + ite.path"
              v-for="ite in item.children"
              :key="ite.id"
            >
              <i :class="ite.icon || 'el-icon-document'"></i>
              <span slot="title">{{ ite.title || ite.name }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item 
            :index="item.path" 
            :key="`${item.id}_${item.path}`" 
            v-else
          >
            <i :class="item.icon || 'el-icon-menu'"></i>
            <span slot="title">{{ item.title || item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <el-header class="custom-header">
        <div class="header-left">
          <div class="toggle-btn" @click="toggleCollapse">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
          </div>
          <el-breadcrumb separator="/" class="custom-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(matched, index) in breadCrumbs" :key="index">
              {{ matched.meta && matched.meta.title || matched.name || '页面' }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-profile">
              <img src="~@/assets/logo.png" class="avatar" />
              <span class="username">Admin</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="custom-main">
        <div class="main-content-wrap">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { constantRouterMap } from "@/router";

export default {
  name: "Layout",
  data() {
    return {
      asideWidth: '220px',
      isDragging: false,
      startX: 0,
      isCollapse: false
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
    breadCrumbs() {
      if (this.$route && this.$route.matched) {
        // 过滤掉空白 layout 路由和根路由
        return this.$route.matched.filter(item => item.name && item.path !== '/' && item.path !== '');
      }
      return [];
    },
    menuList() {
      const list = constantRouterMap;
      let menuList = [];
      const icons = ['el-icon-s-home', 'el-icon-picture', 'el-icon-magic-stick', 'el-icon-reading', 'el-icon-box'];
      
      list.forEach((item, index) => {
        let obj = {};
        if (!item.noShow) {
          obj = {
            id: item.id,
            path: item.path,
            name: item.name,
            title: item.title,
            icon: icons[index % icons.length]
          };
          if (item.children) {
            obj.children = [];
            item.children.forEach((ite) => {
              if (!ite.noShow) {
                obj.children.push({
                  id: ite.id,
                  path: ite.path,
                  name: ite.name,
                  title: ite.title,
                  icon: 'el-icon-document'
                });
              }
            });
          }
        }
        if (Object.keys(obj).length > 0) {
          menuList.push(obj);
        }
      });
      return menuList;
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('isLogin');
      this.$router.push('/login');
      this.$message.success('已退出登录');
    },
    toggleCollapse() {
      if (this.isCollapse) {
        this.asideWidth = '220px';
      }
      this.isCollapse = !this.isCollapse;
    },
    onDragStart(e) {
      if (this.isCollapse) return;
      this.isDragging = true;
      this.startX = e.clientX;
      this.startWidth = parseInt(this.asideWidth, 10);
      // 拖拽时禁用 transition，确保宽度实时跟手
      this.$refs.aside.$el.classList.add('is-dragging');
      // 锁定全局光标 & 禁止选中文字
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    onDragMove(e) {
      if (!this.isDragging) return;
      const newWidth = Math.max(150, Math.min(500, this.startWidth + (e.clientX - this.startX)));
      this.asideWidth = `${newWidth}px`;
    },
    onDragEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.$refs.aside.$el.classList.remove('is-dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }
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
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(64, 158, 255, 0.6);
  }
  
  &:active {
    background-color: rgba(64, 158, 255, 0.8);
  }
}

/* 自定义布局样式 */
.custom-aside {
  background-color: #304156;
  position: relative;
  transition: width 0.28s;
  &.is-dragging {
    transition: none !important;  /* 拖拽时关掉宽度过渡 */
  }
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  display: flex;
  flex-direction: column;
}
.logo-container {
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.28s;
  flex-shrink: 0;
}
.logo-container .logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
.logo-container .sys-title {
  display: inline-block;
  margin-left: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  vertical-align: middle;
  white-space: nowrap;
}
.custom-menu {
  flex: 1;
  border-right: none !important;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  border-right: solid 0px transparent !important;
}
.custom-menu::-webkit-scrollbar {
  width: 5px;
  background-color: #304156;
}
.custom-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
}
.custom-menu:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.4);
}
.custom-menu::-webkit-scrollbar-track {
  background: transparent;
}

/* 头部样式 */
.custom-header {
  height: 50px !important;
  line-height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 0;
  z-index: 9;
}
.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}
.toggle-btn {
  padding: 0 15px;
  font-size: 20px;
  cursor: pointer;
  transition: background .3s;
  height: 50px;
  display: flex;
  align-items: center;
}
.toggle-btn:hover {
  background: rgba(0,0,0,.025);
}
.custom-breadcrumb {
  margin-left: 10px;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}
.user-profile .avatar {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-right: 8px;
}
.user-profile .username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 主容器样式 */
.custom-main {
  background-color: #f0f2f5;
  padding: 15px !important;
  position: relative;
  overflow-x: hidden;
}
.main-content-wrap {
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  min-height: calc(100vh - 80px); /* 减去头部高度和内边距 */
  box-shadow: 0 1px 3px rgba(0,21,41,.08);
  box-sizing: border-box;
}

/* 侧边滑动和淡入淡出过场动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<!-- 全局样式：控制折叠状态下弹出子菜单的滚动条 -->
<style lang="less">
.el-menu--popup {
  max-height: 80vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
