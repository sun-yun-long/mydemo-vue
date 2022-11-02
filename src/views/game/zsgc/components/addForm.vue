<template>
  <div>
    <el-form
      ref="formData"
      :model="formData"
      :rules="formDataRules"
      style="margin: 0 auto; width: 85% !important"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="学号" prop="code">
        <el-input size="small" v-model="formData.code" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input size="small" v-model="formData.name" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input size="small" v-model="formData.address" clearable placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button :loading="btn_loading" size="small" @click="closeDialog">取 消</el-button>
      <el-button :loading="btn_loading" type="primary" size="small" @click="submitFormV">确 定</el-button>
    </div>
  </div>
</template>

<script>
import pageApi from "./../api/index"
export default {
  components: {},
  data() {
    return {
      formType: "",
      rowData: {},
      formData: {
        code: "",
        name: "",
        address: "",
      },
      formDataRules: {
        code: { required: true, message: "请填写学号", trigger: "change" },
        name: { required: true, message: "请填写姓名", trigger: "change" },
      },
      btn_loading: false
    };
  },
  methods: {
    init(type, data){
      this.formType = type;
      if(type == "edit"){
        if(data){
          this.rowData = JSON.parse(JSON.stringify(data));
        }
        for(let key in this.formData){
          this.formData[key] = this.rowData[key] || ""
        }
      }
    },
    // 提交前表单校验
    submitFormV() {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          if(this.formType == "add"){
            this.submitFormAdd();
          }else{
            this.submitFormEdit();
          }
        } else {
          return false;
        }
      });
    },
    // 新增提交
    submitFormAdd() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.btn_loading = true;
      pageApi
        .add(params)
        .then((res) => {
          this.btn_loading = false;
          const { status, message } = res;
          if (status === 200) {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.$emit("refresh");
            this.$emit("close");
          } else {
            this.$message({
              type: "error",
              message: message || "新增失败"
            });
          }
        })
        .catch((err) => {
          this.btn_loading = false;
          console.log(err, "错误提示");
        });
    },
    // 编辑提交
    submitFormEdit() {
      let params = JSON.parse(JSON.stringify(this.formData));
      params.id = this.rowData.id;
      this.btn_loading = true;
      pageApi
        .update(params)
        .then((res) => {
          this.btn_loading = false;
          const { status, message } = res;
          if (status === 200) {
            this.$message({
              type: "success",
              message: "编辑成功"
            });
            this.$emit("refresh");
            this.$emit("close");
          } else {
            this.$message({
              type: "error",
              message: message || "编辑失败"
            });
          }
        })
        .catch((err) => {
          this.btn_loading = false;
          console.log(err, "错误提示");
        });
    },
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
