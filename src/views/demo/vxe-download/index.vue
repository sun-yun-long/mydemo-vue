<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-07 15:36:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-14 14:55:35
-->
<template>
  <div>
    <div>
      <vxe-button @click="exportDataEvent" content="默认导出">默认导出</vxe-button>
      <vxe-button @click="exportSelectEvent" content="导出选中">导出选中</vxe-button>
      <vxe-button @click="openExportEvent" content="高级导出">高级导出</vxe-button>
    </div>

    <vxe-table highlight-hover-row border="inner" ref="xTable1" height="300" :export-config="{}" :data="tableData1">
      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="自动转换"></vxe-table-column>
      <vxe-table-column field="amount" title="导出数值" cell-type="number"></vxe-table-column>
      <vxe-table-column field="num" title="导出字符串" cell-type="string" sortable></vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData1: [
        { name: "test1", amount: "12953.6985", num: 1259326 },
        { name: "154645623546345", amount: "45646464888888654654", num: 4564566456645 },
        { name: 1231242, amount: "4564564545646.6985", num: 0 },
        { name: true, amount: "12953.6985", num: 54646646 },
        { name: "0", amount: "0", num: "645645645665567645234326456" },
        { name: false, amount: "1231231213123.456", num: "45645645645646456" },
        { name: "test2", amount: "99999.08", num: 9999.88 }
      ]
    };
  },
  mounted() {},
  methods: {
    exportDataEvent() {
      this.$refs.xTable1.exportData({ type: "csv" });
    },
    exportSelectEvent() {
      this.$refs.xTable1.exportData({
        data: this.$refs.xTable1.getCheckboxRecords()
      });
    },
    openExportEvent() {
      let option = {
        type: "csv",
        types: ["csv"],
        mode: "selected",
        modes: ["selected"],
        isHeader: true
      };
      this.$refs.xTable1.openExport(option);
    }
  }
};
</script>
<style scoped lang='scss'>
</style>