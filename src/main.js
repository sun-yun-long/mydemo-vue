import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

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
