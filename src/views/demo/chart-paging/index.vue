<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-24 13:15:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-24 14:08:05
-->
<template>
  <div class="chart-paging">
    <el-row :gutter="20" type="flex">
      <el-col :span="12">
        <el-card style="height: 100%">
          <div slot="header">
            <span>不分页</span>
          </div>
          <MyChart
            id="chartPaging_chart"
            ref="chartPaging_chart"
            :options="testOption"
            resize-dom="ddia"
            style="height: 400px; width: auto"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 100%">
          <div slot="header">
            <span>分页</span>
          </div>
          <MyChart
            id="chartPaging_chart2"
            ref="chartPaging_chart2"
            :options="testOption2"
            resize-dom="ddia"
            style="height: 400px; width: auto"
          />
          <el-pagination
            small
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            style="text-align: right"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <div style="width: 300px; height: 300px">
      <MyChart
        id="chartPaging_chart3"
        ref="chartPaging_chart3"
        :options="testOption3"
        resize-dom="ddia"
        style="height: 300px; width: auto"
      />
    </div>
  </div>
</template>

<script>
import MyChart from "@/components/MyCharts";
import CONSTANTS from "./scripts/constants";
export default {
  name: "",
  components: {
    MyChart
  },
  data() {
    return {
      testOption: CONSTANTS.CHART_OPTION,
      testOption2: CONSTANTS.CHART_OPTION2,
      testOption3: CONSTANTS.CHART_OPTION3,
      total: CONSTANTS.dataX.length,
      pageSize: 3
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      let start = (val - 1) * this.pageSize;
      let end = val * this.pageSize;
      this.testOption2.xAxis.data = CONSTANTS.dataX.slice(start, end);
      this.testOption2.series[0].data = CONSTANTS.dataY.slice(start, end);
    }
  }
};
</script>
<style scoped lang='scss'>
</style>