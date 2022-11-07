<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-07 10:32:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 10:41:08
-->
<template>
  <div class="vxe-table-view">
    <vxe-table border height="400" :data="tableData">
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column
        field="name"
        title="name"
        :filters="[
          { data: { vals: [], sVal: '', fMenu: '', f1Type: '', f1Val: '', fMode: 'and', f2Type: '', f2Val: '' } }
        ]"
        :filter-render="{ name: 'FilterExcel' }"
      ></vxe-table-column>
      <vxe-table-column
        field="role"
        title="role"
        :filters="[
          { data: { vals: [], sVal: '', fMenu: '', f1Type: '', f1Val: '', fMode: 'and', f2Type: '', f2Val: '' } }
        ]"
        :filter-render="{ name: 'FilterExcel' }"
      ></vxe-table-column>
      <vxe-table-column
        field="age"
        title="age"
        :filters="[
          { data: { vals: [], sVal: '', fMenu: '', f1Type: '', f1Val: '', fMode: 'and', f2Type: '', f2Val: '' } }
        ]"
        :filter-render="{ name: 'FilterExcel' }"
      ></vxe-table-column>
      <vxe-table-column
        field="address"
        title="address"
        sortable
        :filters="[
          { data: { vals: [], sVal: '', fMenu: '', f1Type: '', f1Val: '', fMode: 'and', f2Type: '', f2Val: '' } }
        ]"
        :filter-render="{ name: 'FilterExcel' }"
      ></vxe-table-column>
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
        { id: 10001, name: "Test1", role: "Develop", sex: "Man", age: "28", address: "Shenzhen" },
        { id: 10002, name: "Test2", role: "Test", sex: "Women", age: "22", address: "Guangzhou" },
        { id: 10003, name: "Test3", role: "PM", sex: "Man", age: "32", address: "Shanghai" },
        { id: 10004, name: "Test4", role: "Designer", sex: "Women ", age: "23", address: "Shenzhen" },
        { id: 10005, name: "Test5", role: "Develop", sex: "Women ", age: "30", address: "Shanghai" },
        { id: 10006, name: "Test6", role: "Designer", sex: "Women ", age: "21", address: "Shenzhen" },
        { id: 10007, name: "Test7", role: "Test", sex: "Man ", age: "29", address: "Shenzhen" },
        { id: 10008, name: "Test8", role: "Develop", sex: "Man ", age: "35", address: "Shenzhen" }
      ]
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped lang='scss'>
</style>