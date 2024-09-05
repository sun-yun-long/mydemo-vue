<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-tree
          :data="treeData"
          style="height: 300px"
          node-key="id"
          default-expand-all
          draggable
          @node-drop="handleDrop"
          :allow-drop="allowDrop"
          ref="elTree1"
        >
          <div class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </el-col>
      <el-col :span="12">
        <el-tree
        :key="treeKey2"
        :data="treeData"
        style="height: 300px"
        node-key="id"
        show-checkbox
        default-expand-all
        ref="elTree2"
      >
      </el-tree>
      </el-col>
      
    </el-row>
  </div>
</template>
<script>
export default {
  name: "treeList",
  // props:{
  // 	treeData:{
  // 		type:Array,
  // 		default:[]
  // 	},
  // 	expand:{
  // 		type:Boolean,
  // 		default:true
  // 	}
  // },
  data() {
    return {
      treeKey2: "treeKey2",
      defaultProps: {
        children: "children",
        label: "label"
      },
      treeData: [
        {
          id: 1,
          list: "",
          list1: "",
          label: "一级 1",
          children: [
            {
              fatherId: 1,
              id: 4,
              list: "",
              list1: "",
              label: "二级 1-1",
              children: [
                {
                  fatherId: 4,
                  id: 9,
                  list: "",
                  list1: "",
                  label: "三级 1-1-1"
                },
                {
                  fatherId: 4,
                  id: 91,
                  list: "",
                  list1: "",
                  label: "三级 1-1-2"
                },
                {
                  fatherId: 4,
                  id: 92,
                  list: "",
                  list1: "",
                  label: "三级 1-1-3"
                }
              ]
            },
            {
              fatherId: 1,
              id: 41,
              list: "",
              list1: "",
              label: "二级 1-2",
              children: [
                {
                  fatherId: 41,
                  id: 9111,
                  list: "",
                  list1: "",
                  label: "三级 1-1-1"
                },
                {
                  fatherId: 41,
                  id: 91211,
                  list: "",
                  list1: "",
                  label: "三级 1-1-2"
                },
                {
                  fatherId: 41,
                  id: 93111,
                  list: "",
                  list1: "",
                  label: "三级 1-1-3"
                }
              ]
            }
          ]
        }
      ],
      expand: false
    };
  },
  methods: {
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // let obj = {
      //   aboveId:'',
      //   arr:[]
      // }
      // obj.aboveId = dropNode.data.aboveId
      // for (let item of dropNode.parent.childNodes) {
      //   obj.arr.push(item.data.id)
      // }

      console.log(this.treeData);
      this.treeData = this.treeData;
      this.treeKey2 = new Date().getTime();
      this.$forceUpdate()
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.level === dropNode.data.level) {
        //fatherId 是父节点id
        if (draggingNode.data.fatherId === dropNode.data.fatherId) {
          return type === "prev" || type === "next";
        } else {
          return false;
        }
      } else {
        // 不同级进行处理
        return false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
