<template>
  <div class="tree-select-container">
    <div class="header">
      <h3>树形多选（父子不关联，右键快速选子级）</h3>
      <div class="actions">
        <el-button type="primary" size="small" @click="getCheckedNodes">
          获取选中节点
        </el-button>
        <el-button size="small" @click="clearChecked">清空选择</el-button>
      </div>
    </div>

    <div class="tree-wrapper" @click="hideContextMenu">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        check-strictly
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-contextmenu="handleContextMenu"
        @node-click="hideContextMenu"
      >
        <!-- 自定义节点内容 -->
        <!-- <span slot-scope="{ node, data }" :class="{ 'is-folder-node': data.type === 'all' || data.type === 'fundType' }"> -->
        <span slot-scope="{ node, data }">
          <span class="custom-tree-node">
            <!-- <i v-if="data.type === 'all' || data.type === 'fundType'" :class="getNodeIcon(data.type)"></i> -->
            <span class="node-label">{{ node.label }}</span>
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 右键菜单 -->
    <div
      v-show="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="menu-header">{{ contextMenu.nodeLabel }}</div>
      <div class="menu-item" @click="handleMenuSelect">
        <i class="el-icon-check"></i>
        选择子级
      </div>
      <div class="menu-item menu-item-warning" @click="handleMenuDeselect">
        <i class="el-icon-close"></i>
        取消子级
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item" @click="handleMenuSelectAll">
        <i class="el-icon-folder-checked"></i>
        选择所有后代
      </div>
      <div class="menu-item menu-item-warning" @click="handleMenuDeselectAll">
        <i class="el-icon-folder-delete"></i>
        取消所有后代
      </div>
    </div>

    <!-- 已选节点展示区域 -->
    <div class="selected-area" v-if="selectedNodes.length">
      <h4>已选择的节点 ({{ selectedNodes.length }}个):</h4>
      <div class="selected-tags">
        <el-tag
          v-for="node in selectedNodes"
          :key="node.id"
          closable
          size="small"
          @close="removeNode(node)"
          class="selected-tag"
        >
          {{ node.label }}
        </el-tag>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-area">
      <i class="el-icon-info"></i>
      <span>提示：右键点击有子节点的节点可以快速选择/取消子级</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTree",
  data() {
    return {
      selectedNodes: [],
      // 右键菜单相关
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        nodeData: null,
        nodeLabel: "",
      },
      defaultProps: {
        children: "children",
        label: "label",
        // disabled: (data) => data.type === "all" || data.type === "fundType",
      },
      treeData: [
        {
          id: "all",
          label: "全部",
          type: "all",
          children: [
            {
              id: "type1",
              label: "股票型",
              type: "fundType",
              children: [
                {
                  id: "fund1",
                  label: "股票基金A",
                  type: "fund",
                  children: [
                    { id: "child1-1", label: "资产单元A-1", type: "childFund" },
                    { id: "child1-2", label: "子组合A-1", type: "childFund" },
                  ],
                },
                {
                  id: "fund2",
                  label: "股票基金B",
                  type: "fund",
                  children: [
                    { id: "child2-1", label: "资产单元B-1", type: "childFund" },
                  ],
                },
              ],
            },
            {
              id: "type2",
              label: "债券型",
              type: "fundType",
              children: [
                {
                  id: "fund3",
                  label: "债券基金A",
                  type: "fund",
                  children: [
                    { id: "child3-1", label: "资产单元C-1", type: "childFund" },
                    { id: "child3-2", label: "子组合C-1", type: "childFund" },
                    { id: "child3-3", label: "子组合C-2", type: "childFund" },
                  ],
                },
                {
                  id: "fund4",
                  label: "债券基金B",
                  type: "fund",
                },
                {
                  id: "fund5",
                  label: "债券基金C",
                  type: "fund",
                },
              ],
            },
            {
              id: "type3",
              label: "混合型",
              type: "fundType",
              children: [
                {
                  id: "fund6",
                  label: "混合基金A",
                  type: "fund",
                },
                {
                  id: "fund7",
                  label: "混合基金B",
                  type: "fund",
                  children: [
                    { id: "child7-1", label: "资产单元D-1", type: "childFund" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // 点击其他地方关闭菜单
    document.addEventListener("click", this.hideContextMenu);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hideContextMenu);
  },
  methods: {

    /**
     * 根据节点类型获取图标
     */
    getNodeIcon(type) {
      const iconMap = {
        all: 'el-icon-folder-opened',
        fundType: 'el-icon-collection',
        fund: 'el-icon-coin',
        childFund: 'el-icon-document',
      };
      return iconMap[type] || 'el-icon-document';
    },

    /**
     * 处理右键菜单
     */
    handleContextMenu(event, data) {
      // 阻止默认右键菜单
      event.preventDefault();

      // 只有有子节点的节点才显示菜单
      if (!data.children || !data.children.length) {
        this.$message.info("该节点没有子级，无需使用快捷操作");
        return;
      }

      // 显示菜单
      this.contextMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        nodeData: data,
        nodeLabel: data.label,
      };
    },

    /**
     * 隐藏右键菜单
     */
    hideContextMenu() {
      this.contextMenu.visible = false;
    },

    /**
     * 菜单操作：全选子级
     * 如果是 folder 类型，选中所有后代中 type === 'fund' 的节点
     * 否则选中所有直接子级
     */
    handleMenuSelect() {
      const nodeData = this.contextMenu.nodeData;
      // if (nodeData.type === 'all' || nodeData.type === 'fundType') {
      //   // folder 类型：选中所有后代中的 fund 节点
      //   this.selectFundDescendants(nodeData);
      // } else {
      //   // 其他类型：选中所有直接子级
      //   this.selectAllChildren(nodeData);
      // }
      this.selectAllChildren(nodeData);
      this.hideContextMenu();
    },

    /**
     * 菜单操作：取消子级
     * 如果是 folder 类型，取消所有后代中 type === 'fund' 的节点
     * 否则取消所有直接子级
     */
    handleMenuDeselect() {
      const nodeData = this.contextMenu.nodeData;
      if (nodeData.type === 'all' || nodeData.type === 'fundType') {
        // folder 类型：取消所有后代中的 fund 节点
        this.deselectFundDescendants(nodeData);
      } else {
        // 其他类型：取消所有直接子级
        this.deselectAllChildren(nodeData);
      }
      this.hideContextMenu();
    },

    /**
     * 菜单操作：全选所有后代节点
     */
    handleMenuSelectAll() {
      this.selectAllDescendants(this.contextMenu.nodeData);
      this.hideContextMenu();
    },

    /**
     * 菜单操作：取消所有后代节点
     */
    handleMenuDeselectAll() {
      this.deselectAllDescendants(this.contextMenu.nodeData);
      this.hideContextMenu();
    },

    /**
     * 递归获取所有 type === 'fund' 的后代节点的 key
     */
    getFundDescendantKeys(data) {
      let keys = [];
      if (data.children && data.children.length) {
        data.children.forEach((child) => {
          // 只收集 type === 'fund' 的节点
          if (child.type === 'fund') {
            keys.push(child.id);
          }
          // 继续递归查找
          keys = keys.concat(this.getFundDescendantKeys(child));
        });
      }
      return keys;
    },

    /**
     * 递归获取所有后代节点的 key
     */
    getAllDescendantKeys(data) {
      let keys = [];
      if (data.children && data.children.length) {
        data.children.forEach((child) => {
          keys.push(child.id);
          keys = keys.concat(this.getAllDescendantKeys(child));
        });
      }
      return keys;
    },

    /**
     * [folder 专用] 选中某个节点下所有 type === 'fund' 的后代节点
     */
    selectFundDescendants(data) {
      if (!data.children || !data.children.length) return;

      const tree = this.$refs.treeRef;
      const checkedKeys = tree.getCheckedKeys();
      const fundKeys = this.getFundDescendantKeys(data);
      
      if (fundKeys.length === 0) {
        this.$message.info('该节点下没有可选择的 fund 类型节点');
        return;
      }

      const newKeys = [...new Set([...checkedKeys, ...fundKeys])];
      tree.setCheckedKeys(newKeys);
      this.$message.success(`已选中 ${data.label} 下的所有 ${fundKeys.length} 个 fund 节点`);
    },

    /**
     * [folder 专用] 取消选中某个节点下所有 type === 'fund' 的后代节点
     */
    deselectFundDescendants(data) {
      if (!data.children || !data.children.length) return;

      const tree = this.$refs.treeRef;
      const checkedKeys = tree.getCheckedKeys();
      const fundKeys = new Set(this.getFundDescendantKeys(data));
      
      if (fundKeys.size === 0) {
        this.$message.info('该节点下没有可取消的 fund 类型节点');
        return;
      }

      const newKeys = checkedKeys.filter((key) => !fundKeys.has(key));
      tree.setCheckedKeys(newKeys);
      this.$message.warning(`已取消 ${data.label} 下的所有 fund 节点选择`);
    },

    /**
     * 选中某个节点下所有后代节点
     */
    selectAllDescendants(data) {
      if (!data.children || !data.children.length) return;

      const tree = this.$refs.treeRef;
      const checkedKeys = tree.getCheckedKeys();
      const descendantKeys = this.getAllDescendantKeys(data);
      const newKeys = [...new Set([...checkedKeys, ...descendantKeys])];

      tree.setCheckedKeys(newKeys);
      this.$message.success(`已选中 ${data.label} 下的所有 ${descendantKeys.length} 个后代节点`);
    },

    /**
     * 取消选中某个节点下所有后代节点
     */
    deselectAllDescendants(data) {
      if (!data.children || !data.children.length) return;

      const tree = this.$refs.treeRef;
      const checkedKeys = tree.getCheckedKeys();
      const descendantKeys = new Set(this.getAllDescendantKeys(data));
      const newKeys = checkedKeys.filter((key) => !descendantKeys.has(key));

      tree.setCheckedKeys(newKeys);
      this.$message.warning(`已取消 ${data.label} 下的所有后代节点选择`);
    },

    /**
     * 选中某个节点下所有的直接子级
     * @param {Object} data - 父节点数据
     */
    selectAllChildren(data) {
      if (!data.children || !data.children.length) return;

      const tree = this.$refs.treeRef;
      const checkedKeys = tree.getCheckedKeys();

      // 收集所有直接子级的 key
      const childKeys = data.children.map((child) => child.id);

      const newKeys = [...new Set([...checkedKeys, ...childKeys])];
      tree.setCheckedKeys(newKeys);
      this.$message.success(`已选中 ${data.label} 下的 ${childKeys.length} 个子级`);
    },

    /**
     * 取消选中某个节点下所有的直接子级
     * @param {Object} data - 父节点数据
     */
    deselectAllChildren(data) {
      if (!data.children || !data.children.length) return;

      const tree = this.$refs.treeRef;
      const checkedKeys = tree.getCheckedKeys();

      // 获取所有直接子级的 key
      const childKeys = new Set(data.children.map((child) => child.id));

      const newKeys = checkedKeys.filter((key) => !childKeys.has(key));
      tree.setCheckedKeys(newKeys);
      this.$message.warning(`已取消 ${data.label} 下的子级选择`);
    },

    /**
     * 获取所有选中的节点
     */
    getCheckedNodes() {
      const tree = this.$refs.treeRef;
      this.selectedNodes = tree.getCheckedNodes();
      
      if (this.selectedNodes.length === 0) {
        this.$message.info("暂无选中的节点");
      } else {
        this.$message.success(`共选中 ${this.selectedNodes.length} 个节点`);
      }
    },

    /**
     * 清空所有选择
     */
    clearChecked() {
      const tree = this.$refs.treeRef;
      tree.setCheckedKeys([]);
      this.selectedNodes = [];
      this.$message.info("已清空所有选择");
    },

    /**
     * 移除单个已选节点
     * @param {Object} node - 要移除的节点
     */
    removeNode(node) {
      const tree = this.$refs.treeRef;
      tree.setChecked(node.id, false);
      this.selectedNodes = this.selectedNodes.filter((n) => n.id !== node.id);
    },
  },
};
</script>

<style lang="less" scoped>
.tree-select-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;

    h3 {
      margin: 0;
      color: #303133;
      font-size: 18px;
    }

    .actions {
      display: flex;
      gap: 10px;
    }
  }

  .tree-wrapper {
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fafafa;

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      padding-right: 10px;
      gap: 6px;

      i {
        font-size: 16px;
        
        // 全部节点图标
        &.el-icon-folder-opened {
          color: #409eff;
        }
        // 组合类型图标
        &.el-icon-collection {
          color: #e6a23c;
        }
        // 组合图标
        &.el-icon-coin {
          color: #67c23a;
        }
        // 子组合/资产单元图标
        &.el-icon-document {
          color: #909399;
        }
      }

      .node-label {
        font-size: 14px;
        color: #606266;
      }
    }
  }

  // 右键菜单样式
  .context-menu {
    position: fixed;
    z-index: 3000;
    min-width: 160px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 6px 0;
    animation: fadeIn 0.15s ease-out;

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .menu-header {
      padding: 8px 16px;
      font-size: 12px;
      color: #909399;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    .menu-divider {
      height: 1px;
      background: #ebeef5;
      margin: 4px 0;
    }

    .menu-item {
      padding: 10px 16px;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;

      i {
        font-size: 14px;
      }

      &:hover {
        background: #f0f7ff;
        color: #409eff;
      }

      &.menu-item-warning:hover {
        background: #fef0f0;
        color: #f56c6c;
      }
    }
  }

  .selected-area {
    margin-top: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;

    h4 {
      margin: 0 0 10px;
      color: #606266;
      font-size: 14px;
    }

    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .selected-tag {
        cursor: pointer;
      }
    }
  }

  .tip-area {
    margin-top: 15px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
    border-radius: 4px;
    border-left: 3px solid #409eff;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #606266;

    i {
      color: #409eff;
      font-size: 16px;
    }
  }
}
</style>

<!-- 非 scoped 样式，用于 CSS :has() 选择器隐藏 folder 节点的 checkbox -->
<style lang="less">
.tree-select-container {
  // 使用 :has() 选择器隐藏包含 .is-folder-node 的节点的 checkbox
  .el-tree-node__content:has(.is-folder-node) {
    .el-checkbox {
      display: none;
    }
  }
}
</style>