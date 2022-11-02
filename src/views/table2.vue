<template>
  <div>
    <hot-table :data="data" :rowHeaders="true" :colHeaders="true"></hot-table>
    <div>
      
      <vxe-pulldown ref="xDown4" transfer>
        <template slot="default" slot-scope="scope">
          <vxe-input
            v-model="value4"
            placeholder="实现下拉分页表格"
            @keyup="keyupEvent4"
            @focus="focusEvent4"
            @suffix-click="suffixClick4"
          ></vxe-input>
        </template>
        <template slot="dropdown" slot-scope="scope">
          <div class="my-dropdown4">
            <vxe-grid
              border
              size="mini"
              highlight-hover-row
              auto-resize
              height="auto"
              :loading="loading4"
              :data="tableData4"
              :columns="tableColumn4"
              @cell-click="cellClickEvent4"
            >
            </vxe-grid>
          </div>
        </template>
      </vxe-pulldown>
    </div>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import SelectTable from '../components/SelectTable.vue';
export default {
  components: { HotTable,SelectTable },
  data() {
    return {
      testValue:"testValue",
      data: [
        ["", "Ford", "Volvo", "Toyota", "Honda"],
        ["2016", 10, 11, 12, 13],
        ["2017", 20, 11, 14, 13],
        ["2018", 30, 15, 12, 13],
      ],
      value4: "",
      tableColumn4: [
        { field: "name", title: "Name" },
        { field: "role", title: "Role" },
        { field: "sex", title: "Sex" },
        // { field: "aaa", title: "aaa" },
      ],
      loading4: false,
      tableData4: [],
      tableList4: [
        { name: "Test1", role: "前端", sex: "男",aaa:"aaa" },
        { name: "Test2", role: "后端", sex: "男" ,aaa:'bbb'},
        { name: "Test3", role: "测试", sex: "男" },
        { name: "Test4", role: "设计师", sex: "女" },
        { name: "Test5", role: "前端", sex: "男" },
        { name: "Test6", role: "前端", sex: "男" },
        { name: "Test7", role: "前端", sex: "男" },
      ],
      tablePage4: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  watch:{
    value4(data){
      console.log('data',data);
      console.log('value4',this.value4);
    },
    testValue(data){
      console.log('data',data);
      console.log('testValue',this.testValue);
    }
  },
  created() {
    this.keyupEvent4();
    window.open('https://pb.gtja.com/')
  },
  methods: {
    focusEvent4() {
      this.$refs.xDown4.showPanel();
    },
    keyupEvent4() {
      const { value4 } = this;
      this.loading4 = true;
      setTimeout(() => {
        this.loading4 = false;
        if (value4) {
          this.tableData4 = this.tableList4.filter(
            (row) => row.name.indexOf(value4) > -1
          );
        } else {
          this.tableData4 = this.tableList4.slice(0);
        }
      }, 100);
    },
    suffixClick4() {
      this.$refs.xDown4.togglePanel();
    },
    cellClickEvent4( {row} ) {
      console.log(row);
      this.value4 = row.name;
      this.$refs.xDown4.hidePanel();
    },
    pageChangeEvent4({ currentPage, pageSize }) {
      this.tablePage4.currentPage = currentPage;
      this.tablePage4.pageSize = pageSize;
    },
  },
};
</script>

<style>
.my-dropdown4 {
  width: 600px;
  height: 300px;
  background-color: #fff;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
}
#hot-display-license-info{
  display: none;
}
</style>