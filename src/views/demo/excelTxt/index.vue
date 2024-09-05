<template>
  <div>
    <el-input type="textarea" v-model="textarea" :rows="10" placeholder="请输入内容"></el-input>
    <el-button @click="test">解析</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="field1" label="field1"></el-table-column>
      <el-table-column prop="field2" label="field2"></el-table-column>
      <el-table-column prop="field3" label="field3"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      textarea: "",
      tableData: []
    };
  },
  mounted() {},
  methods: {
    test() {
      this.tableData = [];
      console.log(this.textarea);
      let arr = this.textarea.split("\n");
      console.log(arr);
      let newArr = [];
      arr.forEach((item) => {
        if(item){
          let obj = {};
          let arr2 = item.split("\t");
          obj.field1 = arr2[0];
          obj.field2 = arr2[1];
          obj.field3 = arr2[2];
          newArr.push(obj);
        }
      });
      console.log(newArr);
      this.tableData = newArr;
    }
  }
};
</script>
<style scoped lang='scss'>
</style>