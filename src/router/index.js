import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
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
        name: '表格',
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
        title: "chart-paging",
        component: () => import("@/views/demo/chart-paging"),
      },
      {
        id: '0408',
        path: 'descartes',
        name: 'descartes',
        title: "笛卡尔集数据转换",
        component: () => import("@/views/demo/descartes"),
      },
    ]
  },
  
]

export const constantRouterMap = routes;

const router = new VueRouter({
  routes
})

export default router
