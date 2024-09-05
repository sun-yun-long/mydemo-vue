<!--
 * @Description: 
 * @Author: 
 * @Date: 2023-11-22 11:02:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-29 16:06:32
-->
<template>
  <div>
    <div>从持仓风格看，投资经理风格偏大盘成长型</div>
    <el-row>
      <el-col :span="8">
        <div>
          <MyChart
            id="positionStyleSituation_chart1"
            ref="positionStyleSituation_chart1"
            :options="testOption1"
            resize-dom="ddia"
            style="height: 400px; width: auto"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <MyChart
            id="positionStyleSituation_chart2"
            ref="positionStyleSituation_chart2"
            :options="testOption2"
            resize-dom="ddia"
            style="height: 400px; width: auto"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <MyChart
            id="positionStyleSituation_chart3"
            ref="positionStyleSituation_chart3"
            :options="testOption3"
            resize-dom="ddia"
            style="height: 400px; width: auto"
          />
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      class="cart_table"
      style="width: 100%"
    >
      <template v-for="(item, index) in Columns">
        <el-table-column
          :key="index"
          :prop="item.prop"
          :label="item.label"
          header-align="center"
          :align="item.align"
          :width="item.width"
          :min-width="item.minWidth"
        >
          <template slot-scope="scope">
            {{ scope.row[item.prop] || '0.00' }}
          </template>
        </el-table-column>
      </template>
    </el-table>
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
      testOption1: CONSTANTS.CHART_OPTION1,
      testOption2: CONSTANTS.CHART_OPTION1,
      testOption3: CONSTANTS.CHART_OPTION1,
      tableData: CONSTANTS.tableData,
      Columns: CONSTANTS.Columns
    };
  },
  mounted() {},
  methods: {
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === "prop") {
      } else {
        let redArr = [0, 2, 3]
        let greenArr = [1, 4]
        if (redArr.includes(rowIndex)) {
          return "custom-red";
        }
        if (greenArr.includes(rowIndex)) {
          return "custom-green";
        }
        if(rowIndex === 5){
          if(columnIndex !== 4){
            return "custom-red";
          }
        }
        if(rowIndex === 6){
          if(columnIndex !== 5){
            return "custom-green";
          }
        }
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {}
  }
};
</script>
<style lang='less'>
.custom-red {
  background: linear-gradient(#fff -50%, #f56c6c 50%) !important;
  border: none !important;
  border-top: 1px solid #fff !important;
  border-bottom: 1px solid #fff !important;
}
.custom-green {
  background: linear-gradient(#fff -50%, #67c23a 50%) !important;
  border: none !important;
  border-top: 1px solid #fff !important;
  border-bottom: 1px solid #fff !important;
}
</style>