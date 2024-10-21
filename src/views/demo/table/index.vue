<template>
  <div>
    <el-tabs v-model="activeName">
    <el-tab-pane label="单元格点击" name="first">
      <TableDemo1 />
    </el-tab-pane>
    <el-tab-pane label="表格合并" name="second">
      <TableDemo2 />
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import TableDemo1 from "./index2.vue"
import TableDemo2 from "./tableSpan.vue"
export default {
  components: {
    TableDemo1,
    TableDemo2
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style>

</style>