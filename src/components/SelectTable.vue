<template>
  <div>
    <vxe-pulldown ref="xDown4" transfer>
      <template slot="default" slot-scope="scope">
        <vxe-input
          v-model="value"
          placeholder="请选择"
          @keyup="keyupEvent"
          @focus="focusEvent"
          @suffix-click="suffixClick"
        ></vxe-input>
      </template>
      <template slot="dropdown" slot-scope="scope">
        <div class="my-dropdown4">
          <vxe-grid
            border
            show-overflow
            size="mini"
            highlight-hover-row
            auto-resize
            height="auto"
            :loading="loading4"
            :data="tableData"
            :columns="tableColumn"
            @cell-click="cellClickEvent"
          >
          </vxe-grid>
        </div>
      </template>
    </vxe-pulldown>
  </div>
</template>

<script>
export default {
  components: {  },
  props:{
    tableColumn:{
      type:Array,
      default:()=>{
        return [
          { field: "name", title: "Name" },
          { field: "role", title: "Role" },
          { field: "sex", title: "Sex" },
        ]
      }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value(data) {
      this.value=data;
      
    },
  },
  data() {
    return {
      value: "",
      // tableColumn: [
      //   { field: "name", title: "Name" },
      //   { field: "role", title: "Role" },
      //   { field: "sex", title: "Sex" },
      // ],
      loading4: false,
      tableData: [],
      tableList: [
        { name: "Test1", role: "前端", sex: "男", aaa: "aaa" },
        { name: "Test2", role: "后端", sex: "男", aaa: "bbb" },
        { name: "Test3", role: "测试", sex: "男" },
        { name: "Test4", role: "设计师", sex: "女" },
        { name: "Test5", role: "前端", sex: "男" },
        { name: "Test6", role: "前端", sex: "男" },
        { name: "Test777777777777", role: "前端前端前端前端前端前端前端前端前端", sex: "男" },
      ],
      tablePage4: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.keyupEvent();
  },
  methods: {
    focusEvent() {
      this.$refs.xDown4.showPanel();
    },
    keyupEvent(data) {
      console.log(data);
      if(data){
        this.$emit('change',data.value)
      }
      const { value } = this;
      this.loading4 = true;
      setTimeout(() => {
        this.loading4 = false;
        if (value) {
          this.tableData = this.tableList.filter(
            (row) => row.name.indexOf(value) > -1
          );
        } else {
          this.tableData = this.tableList.slice(0);
        }
      }, 100);
    },
    suffixClick() {
      this.$refs.xDown4.togglePanel();
    },
    cellClickEvent({ row }) {
      this.value = row.name;
      this.$emit('change',row.name);
      this.$emit('getRow',row);
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
</style>