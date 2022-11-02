<template>
  <div>
    <div style="padding:10px">
      <QueryForm
        ref="QueryForm"
        :model="formQuery"
        :formList="formList"
        :buttonList="buttonList"
        labelWidth="auto"
      />
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="code" label="学号" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="editRow(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="dialogClosed"
      center>
      <addForm ref="addForm" @close="dialogVisible=false" @refresh="onQuery()" v-if="addFormShow" />
    </el-dialog>

    

    

  </div>
</template>

<script>
import pageApi from "./api";
import addForm from "./components/addForm.vue"
export default {
  components: { addForm },
  data(){
    return{
      formQuery: {
        code: "",
        name: "",
        address: ""
      },
      formList: [
        { prop: "code", label: "学号", clearable: true },
        { prop: "name", label: "姓名", clearable: true },
        { prop: "address", label: "地址", clearable: true },
      ],
      buttonList: [
        { name: "查询", type: "primary", size: "small", icon: "el-icon-search", loading: false, click: this.onQuery },
        { name: "重置", size: "small", click: this.chongzhi },
        { name: "新增", size: "small", click: this.openAdd },
      ],
      tableData: [],
      dialogTitle: "",
      dialogVisible: false,
      addFormShow: false,
    }
  },
  mounted(){
    this.onQuery()
  },
  methods:{
    onQuery(){
      let params = JSON.parse(JSON.stringify(this.formQuery))
      pageApi.list(params).then(res=>{
        const { status, message, data } = res;
        if(status === 200){
          this.tableData = data;
        }
      })
    },
    chongzhi(){
      let params = {
        code: "1",
        name: "1",
      }
      let arr = [
        { code: "123", name: "name001" },
        { code: "111", name: "name002" },
        { code: "122", name: "name012" },
        { code: "222", name: "name012" },
      ]

      let list = arr.filter(item=>{
        let num = 0;
        for(let key in params){
          if(!params[key]){
            num++
          }else{
            if(item[key] && item[key].indexOf(params[key]) != -1){
              num++
            }
          }
        }
        if(num === Object.keys(params).length){
          return item
        }
      })
      console.log(list);
    },
    editRow(row){
      let data = JSON.parse(JSON.stringify(row));
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      this.addFormShow = true;
      this.$nextTick(()=>{
        this.$refs.addForm.init("edit", data)
      })
    },
    deleteRow(row){
      let params = {
        id: row.id
      }
      pageApi._delete(params).then(res=>{
        const { status, message } = res;
        if(status === 200){
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.onQuery();
        }else{
          this.$message({
            type: "error",
            message: message || "删除失败"
          })
        }
      })
    },
    openAdd(){
      this.dialogTitle = "新增";
      this.dialogVisible = true;
      this.addFormShow = true;
      this.$nextTick(()=>{
        this.$refs.addForm.init("add", null)
      })
    },
    dialogClosed(){
      this.addFormShow = false;
    }
  }
}
</script>

