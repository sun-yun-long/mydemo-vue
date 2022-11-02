<template>
  <div>
    前端excel导出
    <el-button @click="aaa"></el-button>
    <!-- <el-button type="success" icon="el-icon-download" size="small" class="width1"> -->
    <download-excel
      id="downloadExcel"
      ref="downloadExcel"
      :fields="json_fields"
      name="用户问题"
      :fetch="getData"
      :before-generate="startDownload"
      :before-finish="finishDownload"
      style="display: inline-block"
      >导出</download-excel
    >
    <!-- </el-button> -->

    <!-- <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import pageApi from "@/api/index.js"
export default {
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
      ],
      json_data: [
        { student_id: "001", student_name: "张三" },
        { student_id: "002", student_name: "张三" },
        { student_id: "003", student_name: "张三" },
        { student_id: "004", student_name: "张三" },
        { student_id: "005", student_name: "张三" }
      ],
      json_fields: {
        学号: "student_id",
        姓名: "student_name",
        姓名2: "student_name2"
      },
      chartData: [
        { type: "a", name: "aaa", date: "2021-01-01", num: "1" },
        { type: "a", name: "aaa", date: "2021-01-02", num: "2" },
        { type: "a", name: "aaa", date: "2021-01-03", num: "3" },
        { type: "a", name: "aaa", date: "2021-01-04", num: "4" },
        { type: "b", name: "bbb", date: "2021-01-03", num: "3" },
        { type: "b", name: "bbb", date: "2021-01-04", num: "4" }
      ]
    };
  },
  mounted() {
    // this.chart();
    this.chartInit(this.chartData, "type", "name", "date", "num");
  },
  methods: {
    getData() {
      console.log("12");
      return this.json_data;
    },
    aaa() {
      // this.$refs.downloadExcel.export()
      // console.log(this.$refs.downloadExcel);
      document.getElementById("downloadExcel").click();
    },
    startDownload(val) {
      console.log("startDownload", val);
    },
    finishDownload(val) {
      console.log("finishDownload", val);
    },

    chart() {
      let data = [
        { type: "a", name: "aaa", date: "2021-01-01", num: "1" },
        { type: "a", name: "aaa", date: "2021-01-02", num: "2" },
        { type: "a", name: "aaa", date: "2021-01-03", num: "3" },
        { type: "a", name: "aaa", date: "2021-01-04", num: "4" },
        { type: "b", name: "bbb", date: "2021-01-03", num: "3" },
        { type: "b", name: "bbb", date: "2021-01-04", num: "4" }
      ];
      let typeArr = [];
      let nameArr = [];
      let dateArr = [];
      data.forEach((item) => {
        typeArr.push(item.type);
        dateArr.push(item.date);
      });
      typeArr = Array.from(new Set(typeArr));
      dateArr = Array.from(new Set(dateArr));
      console.log(typeArr);
      console.log(dateArr);
      let obj = {};
      typeArr.forEach((item) => {
        let arr = [];
        data.forEach((i) => {
          if (item === i.type) {
            arr.push(i);
          }
        });
        obj[item] = arr;
      });
      console.log(obj);
      let seriesArr = [];
      for (let key in obj) {
        let seriesObj = {};
        seriesObj.name = key;
        seriesObj.type = "line";
        let arr = obj[key].map((item) => item.date) || [];
        dateArr.forEach((i) => {
          if (!arr.includes(i)) {
            obj[key].push({
              type: obj[key][0].type,
              name: obj[key][0].name,
              date: i,
              num: ""
            });
          }
        });
        obj[key].sort((a, b) => {
          return a.date.localeCompare(b.date);
        });
        seriesObj.data = obj[key].map((item) => item.num) || [];
        seriesArr.push(seriesObj);
      }
      console.log(obj);
      console.log(seriesArr);
    },
    chartInit(chartData, type, name, date, val) {
      let data = JSON.parse(JSON.stringify(chartData)) || [];
      let _type = type || "type";
      let _name = name || "name";
      let _date = date || "date";
      let _val = val || "num";
      let typeArr = [];
      let nameArr = [];
      let dateArr = [];
      let seriesArr = [];
      // 获取类型数据、X轴数据
      for (let i = 0; i < data.length; i++) {
        typeArr.push(data[i][_type]);
        dateArr.push(data[i][_date]);
      }
      typeArr = Array.from(new Set(typeArr));
      dateArr = Array.from(new Set(dateArr));
      // 日期数组排序
      dateArr.sort((a, b) => {
        return a.localeCompare(b);
      });
      // 对数据进行分类处理
      let obj = {};
      for (let i = 0; i < typeArr.length; i++) {
        let arr = [];
        for (let j = 0; j < data.length; j++) {
          if (typeArr[i] === data[j][_type]) {
            arr.push(data[j]);
          }
        }
        obj[typeArr[i]] = arr;
      }
      // 根据X对数据进行补全
      for (let key in obj) {
        nameArr.push(obj[key][0][_name]);
        let seriesObj = {};
        seriesObj.name = obj[key][0][_name];
        seriesObj.type = "line";
        let arr = obj[key].map((item) => item[_date]) || [];
        for (let i = 0; i < dateArr.length; i++) {
          if (!arr.includes(dateArr[i])) {
            let oo = JSON.parse(JSON.stringify(obj[key][0]));
            oo[_date] = dateArr[i];
            oo[_val] = "";
            obj[key].push(oo);
          }
        }

        obj[key].sort((a, b) => {
          return a[_date].localeCompare(b[_date]);
        });
        seriesObj.data = obj[key].map((item) => item[_val]) || [];
        seriesArr.push(seriesObj);
      }
      console.log(obj);
      console.log(seriesArr);
      return {
        dateArr,
        nameArr,
        typeArr,
        seriesArr,
        obj
      };
    },
    onQuery() {
      this.$refs.QueryForm.Form().validate((valid) => {
        if (valid) {
          console.log(this.formQuery);
          console.log("查询");
          this.buttonList[0].loading = true;
          setTimeout(() => {
            this.buttonList[0].loading = false;
          }, 1000);
        } else {
        }
      });
    },
    chongzhi() {
      this.$refs.QueryForm.Form().resetFields()
    },
    getList(){
      let params = {}
      pageApi.list(params).then(res=>{

      })
    }
  }
};
</script>

<style>
</style>