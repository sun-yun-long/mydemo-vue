import Vue from 'vue'
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import FilterExcel from '../../views/renderer/components/FilterExcel.vue'

Vue.component(FilterExcel.name, FilterExcel)
// 创建一个实现Excel的筛选器
VXETable.renderer.add('FilterExcel', {
  // 不显示底部按钮，使用自定义的按钮
  isFooter: false,
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-excel params={ params }></filter-excel>
    ]
  },
  // 重置数据方法
  filterResetMethod ({ options }) {
    options.forEach(option => {
      option.data = { vals: [], sVal: '', fMenu: '', f1Type: '', f1Val: '', fMode: 'and', f2Type: '', f2Val: '' }
    })
  },
  // 筛选数据方法
  filterMethod ({ option, row, column }) {
    const cellValue = XEUtils.get(row, column.property)
    const { vals, f1Type, f1Val } = option.data
    if (cellValue) {
      if (f1Type) {
        return cellValue.indexOf(f1Val) > -1
      } else if (vals.length) {
        // 通过指定值筛选
        return vals.includes(cellValue)
      }
    }
    return false
  }
})