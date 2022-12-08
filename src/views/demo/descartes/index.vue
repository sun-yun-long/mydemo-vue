<!--
 * @Description: 笛卡尔集数据转换为列表数据
 * @Author: 
 * @Date: 2022-12-08 10:50:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-08 14:01:56
-->

<template>
  <div>
    <vxe-grid
      border
      stripe
      highlight-hover-row
      show-header-overflow
      resizable
      auto-resize
      show-overflow
      ref="vxeTable"
      :data="tableData"
      :columns="tableColumn"
    >
    </vxe-grid>
  </div>
</template>

<script>
import CONSTANTS from "./scripts/constants";
export default {
  name: "",
  components: {},
  data() {
    return {
      sourceData: CONSTANTS.SOURCE_DATA,
      tableColumn: [],
      tableData: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let sourceData = this.sourceData;
      let columns = [];
      sourceData.forEach((item) => {
        if (!columns.find((ite) => ite.field === item.FUNDCODE1)) {
          columns.push({
            field: item.FUNDCODE1,
            title: item.FUNDNAME,
            minWidth: "120",
            headerAlign: "center",
            align: "center"
          });
        }
      });
      this.getTableColumn(columns);
      this.getTableData(columns);
    },
    getTableColumn(columns) {
      const firstObj = {
        field: "fundName",
        title: "组合相关系数",
        minWidth: "120",
        headerAlign: "center",
        align: "left"
      };
      this.tableColumn = [firstObj, ...columns];
    },
    getTableData(columns) {
      let sourceData = this.sourceData;
      let list = [];
      columns.forEach((item) => {
        let row = {};
        row.fundName = item.title;
        sourceData.forEach((ite) => {
          if (item.field === ite.FUNDCODE1) {
            row[ite.FUNDCODE2] = ite.ZHXGXS;
          }
        });
        list.push(row);
      });
      this.tableData = list;
    }
  }
};
</script>
<style scoped lang='scss'>
</style>