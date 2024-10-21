/*
 * @Description: 
 * @Author: 
 * @Date: 2022-11-02 15:41:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-17 13:08:08
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/index.less' // global css

// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import DataDriverUI from 'dd-ui-library'
import 'dd-ui-library/dd-ui-library.css'

// import Handsontable from "handsontable";
// import 'handsontable/dist/handsontable.full.css';

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import TreeTable from 'vue-table-with-tree-grid'

// 以下为bpmn工作流绘图工具的样式
import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式

// import './utils/render/filter'

import format from 'vue-text-format'
Vue.use(format)

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
VXETable.use(VXETablePluginElement)

import './views/render'

import vuePrint from '@theshy/vue-print'
Vue.use(vuePrint)

import Print from 'vue-print-nb'
Vue.use(Print); //注册

Vue.component('tree-table', TreeTable)

import VueFlowy from 'vue-flowy';
 
Vue.use(VueFlowy);

Vue.use(DataDriverUI);
Vue.use(ElementUI);
Vue.use(VXETable)
Vue.config.productionTip = false

// 前端导出
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// 引入font-awesome
import 'font-awesome/css/font-awesome.css'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
