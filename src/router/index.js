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
    ]
  },
  
]

export const constantRouterMap = routes;

const router = new VueRouter({
  routes
})

export default router