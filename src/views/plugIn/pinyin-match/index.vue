<!--
 * @Description: 
 * @Author: 
 * @Date: 2023-02-22 16:11:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-23 17:51:38
-->
<template>
  <div>
    <el-select
      v-model="formInline.substation"
      placeholder="请选择"
      value-key="value"
      filterable
      :filter-method="pinyingSub"
      clearable
      @clear="subArr = copySub"
      @focus="subArr = copySub"
    >
      <el-option
        v-for="item in subArr"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>

    <div class="block">
      <div class="demonstration" :title="`带快捷选项带快捷选项\nasasa`">带快捷选项</div>
      <div title="测试换行&#10;asas">测试title换行</div>
      <el-date-picker
        v-model="value2"
        type="daterange"
        align="right"
        unlink-panels
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import { pinyingSubs } from "@/utils/PinyinMatch";
export default {
  name: "",
  components: {},
  data() {
    return {
      formInline: {
        substation: ""
      },
      subArr: [
        { label: "北京", value: "01" },
        { label: "上海", value: "02" },
        { label: "深圳", value: "03" },
        { label: "杭州", value: "04" },
        { label: "南京", value: "05" }
      ],
      copySub: [],
      value2: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate: (val) => {
          return (
            val.getTime() < new Date("2022-12-30").getTime() ||
            val.getTime() > new Date().getTime() - 3600 * 1000 * 24
          );
        }
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.copySub = this.subArr;
    },
    pinyingSub(val) {
      let _this = this;
      this.subArr = pinyingSubs(val, "label", _this.subArr, _this.copySub);
    }
  }
};
</script>
<style scoped lang='scss'>
</style>