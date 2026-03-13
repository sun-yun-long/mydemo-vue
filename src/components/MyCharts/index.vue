<template>
  <div class="echarts component-my-echarts">
    <div ref="pubEchart" :id="$attrs.id" :style="$attrs.style" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import ResizeObserver from 'resize-observer-polyfill'
import _ from "lodash"
export default {
  name: 'Echarts',
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resizeDom: {
      type: String,
      default: ''
    },
    eventParam: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      myChart: null,
      EchartsObj: null,
      observer: null,
      ischange: false
    }
  },
  computed: {
    echartsOption() {
      let val = this.options
      val.textStyle = {
        fontSize: '14'
      }
      return val
    }
  },
  watch: {
    targetNodeWidth() {
      this.resize()
    },
    options: {
      handler() {
        this.reload(this.echartsOption)
      },
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.loadChart()
    })
  },
  mounted() {
    this.$nextTick(() => {
      this._chartResize(this.getChart())
      this.resizeDom && this.domRize()
    })
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    domRize() {
      let targetNode = document.getElementById(this.$attrs.id).parentNode
      this.observer = new ResizeObserver(() => {
        this.resize()
      })
      this.observer.observe(targetNode)
    },
    resize() {
      this.myChart.resize()
    },
    _chartResize(instance) {
      const _resize = _.debounce(() => {
        this.$nextTick(() => instance.resize())
      })
      window.addEventListener('resize', _resize)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', _resize)
      })
    },
    reload(options) {
      if (this.myChart) {
        this.myChart.clear()
        this.myChart.setOption(options, true)
      }
    },
    loadChart() {
      this.myChart = echarts.init(document.getElementById(this.$attrs.id))
      this.myChart.setOption(this.echartsOption, true)
      if (this.eventParam) {
        let { type, param } = this.eventParam
        this.myChart[type || 'on'](...param)
      }
    },
    getChart() {
      return this.myChart
    }
  }
}
</script>

<style lang="less" scoped>
.component-my-echarts {
  /* 数据视图-表格 */
  /deep/ table {
    tbody {
      /* 表格文字颜色 */
      color: #606266;

      tr:first-child {
        /* 固定表头 */
        position: -webkit-sticky;
        position: sticky;
        /* 表头固定位置 */
        top: 0;
        /* 表头背景色 */
        background: #F2F2F2;
        /* 表头边框 */
        outline: 1px solid #DCDFE6;
        /* 表头边框偏移 */
        outline-offset: -1px;
        /* 表头文字颜色 */
        color: #000000;
        /* 表头文字粗细 */
        font-weight: 600;
      }

      tr:nth-child(n+2):nth-child(odd) {
        /* 奇数行背景色 */
        background-color: #EAEFF7;
      }

      tr:nth-child(n+2):nth-child(even) {
        /* 偶数行背景色（可选） */
        background-color: #ffffff;
      }

      tr:nth-child(n+2):hover {
        /* 鼠标悬停时的背景色 */
        background-color: #C7EBFF;
      }

      td {
        /* 表格单元格的边框 */
        border: 1px solid #DCDFE6 !important;
      }
    }
  }
}
</style>