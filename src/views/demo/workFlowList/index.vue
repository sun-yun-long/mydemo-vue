<template>
  <div class="work-flow-list">
    <div class="search-bar">
      <el-form :inline="true" ref="formInline" :model="formInline">
        <el-row>
          <el-col :span="18">
            <el-form-item label="报告名称">
              <el-input
                v-model="formInline.reportName"
                size="small"
                placeholder="请输入报告名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="报告编码">
              <el-input
                v-model="formInline.reportCode"
                size="small"
                placeholder="请输入报告编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="报告类型">
              <el-select
                v-model="formInline.reportType"
                size="small"
                clearable
                filterable
                placeholder="请选择报告类型"
              >
                <el-option
                  v-for="item in reportTypeOptions"
                  :key="item.dimCde"
                  :label="item.dimNme"
                  :value="item.dimCde"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="float: right">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="handleAddFlow"
                >新增</el-button
              >
              <el-button type="primary" size="mini" icon="el-icon-search"
                >查询</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-list">
      <div class="tabletable_top">
        <div class="tableTitle">流程图列表</div>
      </div>
      <el-table
        ref="refsTable"
        v-loading="tableLoading"
        :data="tableData"
        :height="tableHeight"
        :header-cell-style="{
          background: '#f4f5f6',
          color: 'grey',
        }"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column type="index" width="50" align="center">
        </el-table-column>
        <el-table-column
          v-for="(col, i) in TABLE_COLUMNS"
          :key="i"
          :prop="col.prop"
          :label="col.label"
          :align="col.align"
          :show-overflow-tooltip="col.showoverflowtooltip"
          :header-align="col.headerAlign"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              size="small"
              @click="handleFlowView"
              >查看</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              size="small"
              style="padding: 0 10px"
              @click="handleEditFlow"
              >编辑</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              size="small"
              @click="handleDeleteFlow"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-pagination">
      <!-- <Pagination
        :total="total"
        :limit="pageList.pageSize"
        :page="pageList.pageNum"
        @pagination="handlePagination"
      ></Pagination> -->
    </div>
    <el-dialog
      v-if="isShowEdit"
      :title="dialogTitle"
      :visible.sync="isShowEdit"
      width="80%"
      custom-class="editDialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeEdit"
    >
      <work-flow :dialog-status="dialogStatus"></work-flow>
    </el-dialog>
    <el-dialog
      v-if="isShowView"
      title="查看流程图"
      :visible.sync="isShowView"
      width="38%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeView"
    >
      <work-flow-view></work-flow-view>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from "@/components/Pagination";
import WorkFlow from "./components/workFlow";
import WorkFlowView from "./components/workFlowView";
import { TABLE_COLUMNS } from "./scripts/constants";
export default {
  name: "workFlowList",
  components: {
    // Pagination,
    WorkFlow,
    WorkFlowView,
  },
  data() {
    return {
      // form表单绑定
      formInline: {
        reportName: "",
        reportType: "",
        reportCode: "",
      },
      // 报告类型下拉
      reportTypeOptions: [],
      // 表格列
      TABLE_COLUMNS,
      // 表格数据
      tableData: [
        {
          reporType: "证监会FISP",
          reporName: "审核流程图",
          reporCode: "appoveFlow",
          updateTime: "2020-02-02 17:17:17",
        },
      ],
      // 表格loading
      tableLoading: false,
      // 表格高度
      tableHeight: 0,
      // 总数
      total: 1,
      // 分页
      pageList: {
        pageSize: 20,
        pageNum: 1,
      },
      // 流程图弹窗
      isShowEdit: false,
      // 组件状态
      dialogStatus: "",
      // 组件标题
      dialogTitle: "",
      // 流程图查看弹窗
      isShowView: false,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * @description 初始化数据
     */
    initData() {
      // 动态设置表格高度
      this.handleTableHeight();
      // 获取报告类型下拉
      // this.queryReportTypeOptions();
    },
    /**
     * @description 获取报告类型下拉
     */
    // async queryReportTypeOptions() {
    //   const params = {
    //     type: "report_type",
    //   };
    //   try {
    //     const res = await getReportTypeList(params);
    //     this.reportTypeOptions = res || [];
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    /**
     * @description 动态设置表格高度
     */
    handleTableHeight() {
      this.$nextTick(() => {
        // 根据浏览器高度设置初始高度
        this.tableHeight =
          window.innerHeight - this.$refs.refsTable.$el.offsetTop - 80;
        // 监听浏览器高度变化，修改表格高度
        window.onresize = () => {
          this.tableHeight =
            window.innerHeight - this.$refs.refsTable.$el.offsetTop - 80;
        };
      });
    },
    /**
     * @description 监听分页
     */
    handlePagination(val) {
      let { page, limit } = val;
      this.pageList.pageNum = page;
      this.pageList.pageSize = limit;
    },
    /**
     * @description 新增流程图
     */
    handleAddFlow() {
      this.isShowEdit = true;
      this.dialogStatus = "ADD";
      this.dialogTitle = "新增流程图";
    },
    /**
     * @description 编辑流程图
     */
    handleEditFlow() {
      this.isShowEdit = true;
      this.dialogStatus = "EDIT";
      this.dialogTitle = "编辑流程图";
    },
    /**
     * @description 删除流程图
     */
    handleDeleteFlow() {
      this.$confirm(`是否确认删除该流程图?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {});
    },
    /**
     * @description 查看流程图
     */
    handleFlowView() {
      this.isShowView = true;
    },
    /**
     * @description 关闭弹窗
     */
    closeEdit() {
      this.isShowEdit = false;
    },
    /**
     * @description 关闭弹窗
     */
    closeView() {
      this.isShowView = false;
    },
  },
  beforeDestroy() {
    window.onresize = null;
  },
};
</script>

<style lang="less" scoped>
.work-flow-list {
  .search-bar {
    padding: 10px;
    border: 1px solid #d3d3d3;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  .table-list {
    .tabletable_top {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px 10px 0;
      font-size: 14px;
      .tableTitle {
        border-left: 3px solid #4f95dd;
        padding-left: 10px;
        color: #4f95dd;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  ::v-deep .el-table {
    th {
      padding: 0 !important;
      height: 40px;
      line-height: 35px;
    }
    td {
      padding: 0 !important;
      height: 35px;
      line-height: 35px;
    }
  }

  ::v-deep .el-dialog__title {
    font-size: 14px;
  }

  ::v-deep .el-dialog__body {
    padding: 5px;
  }

  ::v-deep .editDialog.el-dialog {
    margin-top: 7vh !important;
  }
}
</style>
