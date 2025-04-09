<template>
  <div>
    <div style="height: 300px">
      <MyChart
        id="chart_one"
        ref="chart_oneRef"
        :options="testOption1"
        resize-dom="ddia"
        style="height: 300px; width: auto"
      />
    </div>
  </div>
</template>

<script>
import MyChart from "@/components/MyCharts";
export default {
  name: "echarts-flag",
  components: {
    MyChart
  },
  data() {
    return {
      testOption1: {}
    };
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.resizeChart);
  },
  methods: {
    resizeChart() {
      // 获取图表实例
      const chart = this.$refs.chart_oneRef.$el;
      console.log(chart.offsetWidth, chart.offsetHeight);
      this.testOption1.xAxis.offset = -(chart.offsetHeight * 0.92 / 2);
      this.testOption1.yAxis.offset = -(chart.offsetWidth * 0.92 / 2);
    },
    init() {
      // 准备 ECharts 数据
      var chartData = {
        // 时间数据（X轴）
        xAxisData: ["2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04", "2025-01-05"],
        // 对应的数值（Y轴）
        yAxisData: [30, 50, 70, 40, 60],
        // 标记点的位置和描述信息
        marks: [
          { x: "2025-01-02", y: 50, description: "标记点1：增加趋势" },
          { x: "2025-01-04", y: 40, description: "标记点2：下降趋势" }
        ]
      };

      // 配置图表
      var option = {
        // tooltip: {
        //   trigger: "item", // 鼠标触发方式
        //   formatter: function (params) {
        //     // 判断鼠标指向的是标记点还是普通数据点
        //     if (params.data && params.data.description) {
        //       return params.data.description; // 返回标记点的描述信息
        //     } else {
        //       return `${params.name}<br/>${params.seriesName}: ${params.value}`; // 正常数据点
        //     }
        //   }
        // },
        xAxis: {
          type: "category",
          data: chartData.xAxisData,
          boundaryGap: false // 确保线从第一点开始
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "数值",
            type: "line",
            data: chartData.yAxisData,
            markPoint: {
              // 定义标记点
              data: chartData.marks.map(function (mark) {
                return {
                  xAxis: mark.x,
                  yAxis: mark.y,
                  name: mark.description,
                  value: mark.y,
                  itemStyle: {
                    color: "#FF6347" // 红色标记点
                  }
                };
              }),
              tooltip: {
                trigger: "item", // 鼠标触发方式
                formatter: function (params) {
                  return params.name; // 标记点的描述信息
                }
              }
            }
          }
        ]
      };

      let option2 = {
        grid: {
            left: '4%',   // 控制左侧间距
            right: '4%',  // 控制右侧间距
            top: '4%',    // 控制上方间距
            bottom: '4%', // 控制下方间距
        },
        xAxis: {
          offset: -150,
          position: "bottom"
          // min: -10,
          // max: 10
        },
        yAxis: {
          offset: -850,
          position: "left",
          axisLabel: {
            formatter: function (value) {
                // 使用富文本将刻度标签渲染到固定位置
                return `{fixed|${value}}`;
            },
            rich: {
                fixed: {
                    align: 'left', // 左对齐
                    padding: [0, 0, 0, 10], // 调整左边距
                }
            }
          }
          // min: -10,
          // max: 10
        },
        tooltip: {},
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68]
            ],
            type: "scatter"
          }
        ]
      };
      // this.testOption1 = option;
      this.testOption1 = option2;
    }
  }
};
</script>
<style scoped lang='scss'>
</style>