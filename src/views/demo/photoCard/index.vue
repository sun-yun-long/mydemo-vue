<!--
 * @Description: 
 * @Author: 
 * @Date: 2024-10-18 10:03:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-18 10:42:39
-->
<template>
  <div style="height: 100%;" class="demo-photo-card">
    <el-tabs>
      <el-tab-pane label="page1">
        <page1></page1>
      </el-tab-pane>
      <el-tab-pane label="page2">
        <page2></page2>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import page1 from './pages/page1.vue'
import page2 from './pages/page2.vue'
export default {
  name: '',
  components: {
    page1,
    page2
  },
  data () {
    return {

    }
  },
  mounted() {},
  methods: {},
}

</script>
<style lang='less'>
.demo-photo-card{
  .el-tabs{
    height: 100%;
    .el-tabs__content{
      height: calc(100% - 40px);
      .el-tab-pane{
        height: 100%
      }
    }
  }
}
</style>