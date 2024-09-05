<template>
  <div id="custom_idid">
    <!-- 经理画像 -->
    <el-table :data="tableData" border>
      <el-table-column prop="prop" label="aaa"></el-table-column>
      <el-table-column prop="prop2" label="bbb" align="right">
        <template slot-scope="scope">
          <div class="custom-box">
            &nbsp;
            <span class="value-position">aaaaaaaa</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="prop3" label="ccc"></el-table-column>
    </el-table>
    <el-row>
      <el-col :span="12"> 1 </el-col>
      <el-col :span="12">
        <el-table
          :data="tableData2"
          border
          :span-method="objectSpanMethod"
          :header-cell-style="headerCellStyle"
        >
          <el-table-column
            prop="propa"
            label="风格"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="propb"
            label="风格"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column prop="prop1" label="近一年" header-align="center">
            <el-table-column prop="prop1" label="日均超低配" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop1 || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="prop2a" label="超额收益" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop2a || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="prop2b" label="超额收益" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop2b || "-" }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="prop3" label="近6个月" header-align="center">
            <el-table-column prop="prop3" label="日均超低配" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop3 || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="prop4a" label="超额收益" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop4a || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="prop4b" label="超额收益" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop4b || "-" }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="prop5" label="近3个月" header-align="center">
            <el-table-column prop="prop5" label="日均超低配" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop5 || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="prop6a" label="超额收益" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop6a || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="prop6b" label="超额收益" header-align="center" align="right">
              <template slot-scope="{ row }">
                {{ row.prop6b || "-" }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyChart from "@/components/MyCharts";
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [{ prop: "11" }],
      tableData2: [
        { propa: "成长", propb: "成长" },
        { propa: "流动性", propb: "流动性" },
        { propa: "动量", propb: "动量" },
        { propa: "公司质量", propb: "盈利质量" },
        { propa: "公司质量", propb: "盈利波动" },
        { propa: "公司质量", propb: "投资质量" },
        { propa: "公司质量", propb: "杠杆" },
        { propa: "公司质量", propb: "盈利能力" },
        { propa: "市值", propb: "中盘" },
        { propa: "市值", propb: "市值" },
        { propa: "价值", propb: "BP" },
        { propa: "价值", propb: "EP" },
        { propa: "价值", propb: "长期逆转" },
        { propa: "波动", propb: "贝塔" },
        { propa: "波动", propb: "残余波动率" },
        { propa: "股息率", propb: "股息率" },
        { propa: "合计", propb: "" }
      ],
      spanObj: {}
    };
  },
  mounted() {
    let list = this.tableData2.filter((item) => item.propa !== "合计");
    let aaa = {};
    list.forEach((item, index) => {
      if (!aaa[item.propa]) {
        aaa[item.propa] = [];
      }
      aaa[item.propa].push(index);
    });
    this.spanObj = aaa;
    console.log(aaa);
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = [0, 4, 7, 10];
      if (arr.includes(columnIndex)) {
        for (let key in this.spanObj) {
          if (this.spanObj[key].includes(rowIndex)) {
            if (rowIndex === this.spanObj[key][0]) {
              return {
                rowspan: this.spanObj[key].length,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
      }
      if (row.propa === "合计") {
        if ([0, 3, 6, 9].includes(columnIndex)) {
          return [1, 2];
        }
        if ([1, 4, 7, 10].includes(columnIndex)) {
          return [0, 0];
        }
      }
    },
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex);
      if (rowIndex === 0) {
        row[0].colSpan = 0; // 将表头第一列和第二列合并，内容展示为第二列的内容
        row[1].colSpan = 2;
        if (columnIndex === 0) {
          // 将表头第一列隐藏
          return {
            display: "none"
          };
        }
      }
      if (rowIndex === 1) {
        row[1].colSpan = 0;
        row[2].colSpan = 2;
        row[4].colSpan = 0;
        row[5].colSpan = 2;
        row[7].colSpan = 0;
        row[8].colSpan = 2;
        if (columnIndex === 1 || columnIndex === 4 || columnIndex === 7) {
          return {
            display: "none"
          };
        }
      }
    }
  }
};
</script>
<style lang='less'>
#custom_idid {
  .custom-box {
    display: inline-block;
    width: 70%;
    background: linear-gradient(to right, #fff 0%, red 10%) !important;
    border: 1px solid #fff !important;
    .value-position {
      position: absolute;
      right: 0;
    }
  }
  .el-table {
    th {
      padding: 0 !important;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    td {
      padding: 0 !important;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    .cell {
      padding: 0px !important;
      line-height: 40px !important;
    }
  }
}
</style>