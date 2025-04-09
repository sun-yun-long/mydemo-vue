<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-03 09:08:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 15:54:32
-->
<template>
  <div class="table_view">
    <!-- <qunji-button :showLoading='false'>打开alert</qunji-button> -->
    <h3>点击指定区域单元格触发事件</h3> <br>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :cell-class-name="cellStyle"
      @click.native="tableClick($event)"
    >
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180" class-name=""> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import methods from ''
export default {
  // mixins: [methods],
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let classNames = []
      const propertyList = ["date", "name"];
      if (propertyList.includes(column.property)) {
        // return "pointer";
        classNames.push("pointer")
      }
      if(column.property === 'date'){
        classNames.push("red")
      }
      return classNames.join(" ")
    },
    tableClick(e) {
      console.log(e);
      if (e.target && e.target.className === "cell") {
        try {
          if (e.target.parentNode.className.indexOf("pointer") !== -1) {
            console.log("open");
            alert("open")
          }
        } catch (error) {
          return false;
        }
      } else {
        try {
          if (e.target.className.indexOf("pointer") !== -1) {
            console.log("open");
            alert("open")
          }
        } catch (error) {
          return false;
        }
      }
    }
  }
};
</script>

<style lang="less">
.table_view{
  .pointer {
    cursor: pointer;
  }
}
</style>