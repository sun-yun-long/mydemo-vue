<template>
  <div style="width:800px">
    <el-table :data="tableData" border>
     <el-table-column v-for="(item, index) in col"
        :key="`col_${index}`"
        :prop="dropCol[index].prop"
        :label="item.label"> 
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Sortable from 'sortablejs'//引入插件
export default {
  data() {
    return {
      col: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      dropCol: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      tableData: [
        {
          id: '1',
          date: '2016-05-02',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 100 弄'
        },
        {
          id: '2',
          date: '2016-05-04',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 200 弄'
        },
        {
          id: '3',
          date: '2016-05-01',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 300 弄'
        },
        {
          id: '4',
          date: '2016-05-03',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 400 弄'
        }
      ]
    }
  },
  mounted() {
    // 阻止默认行为
	  document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    // this.rowDrop()//行拖拽
    this.columnDrop()//列拖拽
  },
  methods: {
    //行拖拽
    // rowDrop() {
    //   const tbody = document.querySelector('.el-table__body-wrapper tbody')
    //   const _this = this
    //   Sortable.create(tbody, {
    //     onEnd({ newIndex, oldIndex }) {
    //       if (newIndex == oldIndex) return
    //       _this.tableData.splice(
    //         newIndex,
    //         0,
    //         _this.tableData.splice(oldIndex, 1)[0]
    //       )
    //       var newArray = _this.tableData.slice(0)
    //       _this.tableData = []
    //       _this.$nextTick(function () {
    //         _this.tableData = newArray
    //       })
    //     }
    //   })
    // },
    //列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    }
  }
}
</script>