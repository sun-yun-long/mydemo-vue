<template>
  <div>
    <vxe-table
      resizable
      border="inner"
      ref="xTree"
      :tree-config="{ children: 'childs' }"
      :data="tableData"
    >
      <vxe-table-column field="" title="" align="center" width="60">
        <template slot-scope="{ row }">
          <i class="vxe-icon--menu drag-btn"></i>
        </template>
      </vxe-table-column>
      <vxe-table-column field="name" title="label" tree-node></vxe-table-column>
      <vxe-table-column field="size" title="Size"></vxe-table-column>
      <vxe-table-column field="type" title="Type"></vxe-table-column>
      <vxe-table-column field="date" title="Date"></vxe-table-column>
    </vxe-table>

    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="width: 30%">Row 1, Cell 1</td>
          <td>Row 1, Cell 2</td>
        </tr>
        <tr>
          <td>Row 2, Cell 1</td>
          <td>Row 2, Cell 2</td>
        </tr>
        <tr>
          <td>Row 3, Cell 1</td>
          <td>Row 3, Cell 2</td>
        </tr>
        <tr class="last-row">
          <td colspan="2">Row 4, Combined Cell</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="width: 300px">Row 1, Cell 1</td>
          <td>Row 1, Cell 2 - Cell 1</td>
        </tr>
        <tr>
          <td rowspan="2">Row 1, Cell 1</td>
          <td>Row 1, Cell 2 - Cell 1</td>
        </tr>
        <tr>
          <td>Row 1, Cell 2 - Cell 2</td>
        </tr>
        <tr class="merge-row">
          <td colspan="2">Row 2, Combined Cell</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [
        { id: 1000, name: "test abc1", type: "mp3", size: 1024, date: "2020-08-01" },
        {
          id: 1005,
          name: "Test2",
          type: "mp4",
          size: null,
          date: "2021-04-01",
          childs: [
            { id: 24300, name: "Test2", type: "avi", size: 1024, date: "2020-03-01" },
            { id: 20045, name: "test abc4", type: "html", size: 600, date: "2021-04-01" },
            {
              id: 10053,
              name: "test abc96",
              type: "avi",
              size: null,
              date: "2021-04-01",
              childs: [
                { id: 24330, name: "test abc5", type: "txt", size: 25, date: "2021-10-01" },
                { id: 21011, name: "Test6", type: "pdf", size: 512, date: "2020-01-01" },
                { id: 22200, name: "Test7", type: "js", size: 1024, date: "2021-06-01" }
              ]
            }
          ]
        },
        {
          id: 1006,
          name: "Test3",
          type: "mp4",
          size: null,
          date: "2021-04-01",
          childs: [
            { id: 243001, name: "Test3", type: "avi", size: 1024, date: "2020-03-01" },
            { id: 200451, name: "test abc4", type: "html", size: 600, date: "2021-04-01" },
            {
              id: 100531,
              name: "test abc96",
              type: "avi",
              size: null,
              date: "2021-04-01",
              childs: [
                { id: 243301, name: "test abc5", type: "txt", size: 25, date: "2021-10-01" },
                { id: 210111, name: "Test6", type: "pdf", size: 512, date: "2020-01-01" },
                { id: 222001, name: "Test7", type: "js", size: 1024, date: "2021-06-01" }
              ]
            }
          ]
        },
        { id: 23666, name: "Test8", type: "xlsx", size: 2048, date: "2020-11-01" },
        { id: 24555, name: "test abc9", type: "avi", size: 224, date: "2020-10-01" }
      ]
    };
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.rowDrop();
  },
  methods: {
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector(".vxe-table--body tbody");
      const _this = this;
      Sortable.create(tbody, {
        handle: ".drag-btn",
        onEnd(data) {
          console.log(data);
          const { newIndex, oldIndex } = data;
          if (newIndex == oldIndex) return;
        }
      });
    }
  }
};
</script>
<style scoped lang='less'>
table {
  width: 100%;
  border: 1px solid #ccc; /* 表格整体边框 */
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc; /* 单元格边框 */
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f2f2f2;
}
.last-row td:last-child {
  /* Style for the last row's last column */
  border-right: none;
}
</style>