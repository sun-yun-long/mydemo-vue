<!--
 * @Description: 
 * @Author: 
 * @Date: 2024-08-07 19:03:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-07 19:08:49
-->
<template>
  <div>
    <vxe-table
      border
      ref="xTable2"
      :data="tableData"
      :checkbox-config="{ checkMethod: checCheckboxkMethod2 }"
    >
      <vxe-table-column type="checkbox" title="All"></vxe-table-column>
      <vxe-table-column field="sex" title="Sex"></vxe-table-column>
      <vxe-table-column field="age" title="Age"></vxe-table-column>
      <vxe-table-column field="address" title="Address" show-overflow></vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [
        { id: 10001, name: "Test1", role: "Develop", sex: "Man", age: 28, address: "test abc" },
        { id: 10002, name: "Test2", role: "Test", sex: "Women", age: 22, address: "Guangzhou" },
        { id: 10003, name: "Test3", role: "PM", sex: "Man", age: 32, address: "Shanghai" },
        { id: 10004, name: "Test4", role: "Designer", sex: "Women ", age: 23, address: "test abc" },
        { id: 10005, name: "Test5", role: "Develop", sex: "Women ", age: 30, address: "Shanghai" }
      ]
    };
  },
  mounted() {
    this.setDefaultCheckedRow();
  },
  methods: {
    setDefaultCheckedRow() {
      this.$refs.xTable2.setCheckboxRow(this.tableData[1], true);
      this.tableData[1].disabled = true;
    },
    checCheckboxkMethod2({ row }) {
      return !row.disabled
    }
  }
};
</script>
<style scoped lang='scss'>
</style>