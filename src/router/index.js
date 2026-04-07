/*
 * @Description: 
 * @Author: 
 * @Date: 2022-11-07 10:52:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-08-14 14:44:43
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Layout from '@/views/layout/index.vue'

Vue.use(VueRouter)

const originalRoutes = [
  {
    id: '01',
    path: '/',
    name: 'Home',
    title: '首页',
    component: Home
  },
  {
    id: '02',
    path: '/plugIn',
    name: 'plugIn',
    title: '插件',
    component: () => import("@/roter.vue"),
    children:[
      {
        id: '0201',
        path: 'JsonExcel',
        name: 'JsonExcel',
        title: '前端导出Excel',
        component: () => import("@/views/plugIn/JsonExcel"),
      },
      {
        id: '0202',
        path: 'countTo',
        name: 'countTo',
        title: 'countTo',
        component: () => import('@/views/plugIn/countTo')
      },
      {
        id: '0203',
        path: 'about',
        name: 'About',
        title: 'PDF',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
      },
      {
        id: '0204',
        path: 'print',
        name: 'print',
        component: () => import('@/views/plugIn/print')
      },
      {
        id: '0205',
        path: 'format',
        name: 'format',
        noShow: true,
        component: () => import('@/views/format')
      },
      {
        id: '0206',
        path: 'clipboard',
        name: 'clipboard',
        component: () => import('@/views/plugIn/Clipboard')
      },
      {
        id: '0207',
        path: 'pinyin-match',
        name: 'pinyin-match',
        component: () => import('@/views/plugIn/pinyin-match')
      },
      {
        id: '0208',
        path: 'vue-splitpane',
        name: 'vue-splitpane',
        component: () => import('@/views/plugIn/vue-splitpane')
      },
      {
        id: '0209',
        path: 'element-resize-detector',
        name: 'element-resize-detector',
        component: () => import('@/views/plugIn/element-resize-detector')
      },
      {
        id: '0210',
        path: 'vue-flowy',
        name: 'vue-flowy',
        component: () => import('@/views/plugIn/vue-flowy')
      },
      {
        id: '0211',
        path: 'diff',
        name: 'diff',
        component: () => import('@/views/plugIn/diff')
      },
      {
        id: '0212',
        path: 'Kindeditor',
        name: 'Kindeditor',
        component: () => import('@/views/plugIn/Kindeditor')
      },
      {
        id: '0213',
        path: 'tinymce',
        name: 'tinymce',
        component: () => import('@/views/plugIn/Tinymce')
      },
      {
        id: '0214',
        path: 'vue-virtual-scroller',
        name: 'vue-virtual-scroller',
        component: () => import('@/views/plugIn/vueVirtualScroller')
      },
      {
        id: '0215',
        path: 'vue-office',
        name: 'vue-office',
        title: '文件预览 (vue-office)',
        component: () => import('@/views/plugIn/vue-office/index.vue')
      },
    ]
  },
  {
    id: '03',
    path: '/game',
    name: 'game',
    component: () => import("@/roter.vue"),
    children:[
      {
        id: '0301',
        path: 'saolei',
        name: 'saolei',
        component: () => import("@/views/game/saolei"),
      },
      {
        id: '0302',
        path: 'zsgc',
        name: 'zsgc',
        component: () => import("@/views/game/zsgc"),
      },
      {
        id: '0303',
        path: 'tetris',
        name: 'tetris',
        component: () => import("@/views/game/tetris"),
      },
      {
        id: '0304',
        path: 'zhizhu',
        name: 'zhizhu',
        component: () => import("@/views/game/zhizhu"),
      },
      {
        id: '0305',
        path: 'fanpai',
        name: 'fanpai',
        component: () => import("@/views/game/fanpai"),
      },
      {
        id: '0306',
        path: 'gobang',
        name: 'gobang',
        title: '五子棋',
        component: () => import("@/views/game/gobang"),
      },
      {
        id: '0307',
        path: 'maze3d',
        name: 'maze3d',
        title: '3D迷宫',
        component: () => import("@/views/game/maze3d"),
      },
    ]
  },
  {
    id: '04',
    path: '/demo',
    name: 'demo',
    component: () => import("@/roter.vue"),
    children:[
      {
        id: '0401',
        path: 'list',
        name: '列表',
        component: () => import("@/views/demo/list"),
      },
      {
        id: '0402',
        path: 'table',
        name: 'table',
        component: () => import("@/views/demo/table"),
      },
      {
        id: '0403',
        path: 'iframe-html',
        name: '引入html',
        component: () => import("@/views/demo/iframe-html"),
      },
      {
        id: '0404',
        path: 'vxe-table',
        name: 'vxe-table 高级筛选',
        component: () => import("@/views/demo/vxe-table"),
      },
      {
        id: '0405',
        path: 'vxe-download',
        name: 'vxe-download',
        component: () => import("@/views/demo/vxe-download"),
      },
      {
        id: '0406',
        path: 'cube',
        name: 'cube',
        title: "立方体",
        component: () => import("@/views/demo/cube"),
      },
      {
        id: '0407',
        path: 'chart-paging',
        name: 'chart-paging',
        title: "图表分页",
        component: () => import("@/views/demo/chart-paging"),
      },
      {
        id: '040701',
        path: 'echarts-flag',
        name: 'echarts-flag',
        title: "echarts打点标记",
        component: () => import("@/views/demo/echarts-flag"),
      },
      {
        id: '0408',
        path: 'descartes',
        name: 'descartes',
        title: "笛卡尔集数据转换",
        component: () => import("@/views/demo/descartes"),
      },
      {
        id: '0409',
        path: 'positionStyleSituation',
        name: 'positionStyleSituation',
        title: "持仓风格情况",
        component: () => import("@/views/demo/positionStyleSituation"),
      },
      {
        id: '0410',
        path: 'touzijingli',
        name: 'touzijingli',
        title: "持仓风格情况",
        component: () => import("@/views/demo/touzijingli"),
      },
      {
        id: '0411',
        path: 'excelTxt',
        name: 'excelTxt',
        title: "excel复制文本解析",
        component: () => import("@/views/demo/excelTxt"),
      },
      {
        id: '0412',
        path: 'treeTableDrag',
        name: 'treeTableDrag',
        title: "树形表格拖拽排序",
        component: () => import("@/views/demo/treeTableDrag"),
      },
      {
        id: '0413',
        path: 'el-tree-filter',
        name: 'el-tree-filter',
        title: "tree筛选",
        component: () => import("@/views/demo/el-tree"),
      },
      {
        id: '0414',
        path: 'el-tree-drag',
        name: 'el-tree-drag',
        title: "tree拖拽",
        component: () => import("@/views/demo/el-tree/drag.vue"),
      },
      {
        id: '041401',
        path: 'el-tree-custom',
        name: 'el-tree-custom',
        title: "tree自定义",
        component: () => import("@/views/demo/el-tree/custom.vue"),
      },
      {
        id: '041402',
        path: 'el-tree-customFundTree',
        name: 'el-tree-customFundTree',
        title: "tree自定义组合",
        component: () => import("@/views/demo/el-tree/customFundTree.vue"),
      },
      {
        id: '0415',
        path: 'chechboxTable',
        name: 'chechboxTable',
        title: "chechboxTable",
        component: () => import("@/views/demo/chechboxTable"),
      },
      {
        id: '0416',
        path: 'workFlowList',
        name: 'workFlowList',
        title: "workFlowList",
        component: () => import("@/views/demo/workFlowList"),
      },
      {
        id: '0417',
        path: 'photoCard',
        name: 'photoCard',
        title: "photoCard",
        component: () => import("@/views/demo/photoCard"),
      },
      {
        id: '0418',
        path: 'downloadPdf',
        name: 'downloadPdf',
        title: "页面导出pdf",
        component: () => import("@/views/demo/downloadPdf"),
      },
      {
        id: '0419',
        path: 'pako',
        name: 'pako',
        title: "pako压缩",
        component: () => import("@/views/demo/pako"),
      },
      {
        id: '0420',
        path: 'text-file',
        name: 'text-file',
        title: "文本转文件",
        component: () => import("@/views/demo/text-file"),
      },
      {
        id: '0421',
        path: 'MultiSelectTest',
        name: 'MultiSelectTest',
        title: "自定义多选下拉框使用",
        component: () => import("@/views/demo/MultiSelectTest"),
      },
      {
        id: '0422',
        path: 'code',
        name: 'code',
        title: "代码展示",
        component: () => import("@/views/demo/code"),
      },
      {
        id: '0423',
        path: 'websocket',
        name: 'websocket',
        title: "WebSocket实时数据",
        component: () => import("@/views/demo/websocket"),
      },
    ]
  },
]

export const constantRouterMap = originalRoutes;

const routes = [
  {
    id: 'login',
    path: '/login',
    name: 'Login',
    title: '登录',
    noShow: true,
    component: () => import('@/views/Login.vue')
  },
  {
    path: '', // 匹配所有的内部路由
    component: Layout,
    children: originalRoutes
  }
];

const router = new VueRouter({
  routes
})

// 添加全局前置路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = sessionStorage.getItem('isLogin')
  if (to.path !== '/login' && !isLogin) {
    // 如果没有登录且访问的不是登录页，则跳转到登录页
    next('/login')
  } else {
    next()
  }
})

export default router
