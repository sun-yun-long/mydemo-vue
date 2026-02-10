<template>
  <div class="fund-tree-container">
    <div class="header">
      <h3>组合选择器（自定义联动逻辑）</h3>
      <div class="actions">
        <el-button type="primary" size="small" @click="getCheckedData">
          获取选中数据
        </el-button>
        <el-button size="small" @click="clearAll">清空选择</el-button>
      </div>
    </div>

    <!-- 类型说明 -->
    <div class="type-legend">
      <span class="legend-item all">全部 (all)</span>
      <span class="legend-item fund-type">组合类型 (fundType)</span>
      <span class="legend-item fund">组合 (fund)</span>
      <span class="legend-item child-fund">资产单元/子组合 (childFund)</span>
    </div>

    <div class="tree-wrapper">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        check-strictly
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @check="handleCheck"
      >
        <span slot-scope="{ node, data }" :class="getNodeClass(data)">
          <span class="node-label">
            <i :class="getNodeIcon(data)"></i>
            {{ node.label }}
            <span class="node-type-tag">{{ getTypeLabel(data.type) }}</span>
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 已选结果展示 -->
    <div class="result-area" v-if="checkedResult.fundTypes.length || checkedResult.funds.length || checkedResult.childFunds.length">
      <h4>已选择的数据：</h4>
      
      <div class="result-section" v-if="checkedResult.fundTypes.length">
        <div class="section-title">组合类型 ({{ checkedResult.fundTypes.length }}个)：</div>
        <div class="tags-wrapper">
          <el-tag 
            v-for="item in checkedResult.fundTypes" 
            :key="item.id" 
            type="warning"
            size="small"
          >
            {{ item.label }}
          </el-tag>
        </div>
      </div>

      <div class="result-section" v-if="checkedResult.funds.length">
        <div class="section-title">组合 ({{ checkedResult.funds.length }}个)：</div>
        <div class="tags-wrapper">
          <el-tag 
            v-for="item in checkedResult.funds" 
            :key="item.id" 
            type="success"
            size="small"
          >
            {{ item.label }}
          </el-tag>
        </div>
      </div>

      <div class="result-section" v-if="checkedResult.childFunds.length">
        <div class="section-title">资产单元/子组合 ({{ checkedResult.childFunds.length }}个)：</div>
        <div class="tags-wrapper">
          <el-tag 
            v-for="item in checkedResult.childFunds" 
            :key="item.id" 
            type="info"
            size="small"
          >
            {{ item.label }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 操作说明 -->
    <div class="tips-area">
      <h4><i class="el-icon-info"></i> 操作逻辑说明：</h4>
      <ul>
        <li><strong>勾选【全部】：</strong>选中所有组合类型 + 所有组合</li>
        <li><strong>取消【全部】：</strong>取消所有组合类型 + 所有组合</li>
        <li><strong>勾选【组合类型】：</strong>选中该类型下所有组合</li>
        <li><strong>取消【组合类型】：</strong>取消该类型下所有组合，若全选已选中则取消</li>
        <li><strong>勾选【组合】：</strong>选中该组合</li>
        <li><strong>取消【组合】：</strong>取消该组合，若父级组合类型/全选已选中则取消</li>
        <li><strong>资产单元/子组合：</strong>独立操作，不影响其他节点</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomFundTree",
  data() {
    return {
      checkedResult: {
        fundTypes: [],
        funds: [],
        childFunds: [],
      },
      defaultProps: {
        children: "children",
        label: "label",
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
  methods: {
    /**
     * 获取节点样式类
     */
    getNodeClass(data) {
      return {
        'tree-node': true,
        'node-all': data.type === 'all',
        'node-fund-type': data.type === 'fundType',
        'node-fund': data.type === 'fund',
        'node-child-fund': data.type === 'childFund',
      };
    },

    /**
     * 获取节点图标
     */
    getNodeIcon(data) {
      const iconMap = {
        all: 'el-icon-folder-opened',
        fundType: 'el-icon-collection',
        fund: 'el-icon-coin',
        childFund: 'el-icon-document',
      };
      return iconMap[data.type] || 'el-icon-document';
    },

    /**
     * 获取类型标签文字
     */
    getTypeLabel(type) {
      const labelMap = {
        all: '全部',
        fundType: '类型',
        fund: '组合',
        childFund: '子',
      };
      return labelMap[type] || '';
    },

    /**
     * 处理勾选事件 - 核心逻辑
     */
    handleCheck(data, { checkedKeys }) {
      const tree = this.$refs.treeRef;
      const isChecked = checkedKeys.includes(data.id);

      if (data.type === 'all') {
        this.handleAllCheck(isChecked);
      } else if (data.type === 'fundType') {
        this.handleFundTypeCheck(data, isChecked);
      } else if (data.type === 'fund') {
        this.handleFundCheck(data, isChecked);
      }
      // childFund 类型不需要额外处理，独立操作
    },

    /**
     * 处理【全部】勾选/取消
     */
    handleAllCheck(isChecked) {
      const tree = this.$refs.treeRef;
      const allNode = this.treeData[0];

      if (isChecked) {
        // 勾选全部：选中所有 fundType 和 fund
        const keysToCheck = ['all'];
        this.collectNodesByType(allNode, ['fundType', 'fund'], keysToCheck);
        tree.setCheckedKeys(keysToCheck);
        this.$message.success('已选中所有组合类型和组合');
      } else {
        // 取消全部：取消所有 fundType 和 fund
        const currentKeys = tree.getCheckedKeys();
        
        // 收集需要移除的所有 key（all + fundType + fund）
        const keysToRemove = ['all'];
        this.collectNodesByType(allNode, ['fundType', 'fund'], keysToRemove);
        const keysToRemoveSet = new Set(keysToRemove);
        
        // 保留 childFund 的选中状态
        const newKeys = currentKeys.filter(key => !keysToRemoveSet.has(key));
        tree.setCheckedKeys(newKeys);
        this.$message.warning('已取消所有组合类型和组合');
      }
    },

    /**
     * 处理【组合类型】勾选/取消
     */
    handleFundTypeCheck(data, isChecked) {
      const tree = this.$refs.treeRef;
      let currentKeys = tree.getCheckedKeys();

      if (isChecked) {
        // 勾选组合类型：选中该类型下所有 fund
        const fundKeys = [];
        this.collectNodesByType(data, ['fund'], fundKeys);
        const newKeys = [...new Set([...currentKeys, ...fundKeys])];
        tree.setCheckedKeys(newKeys);
        this.$message.success(`已选中 ${data.label} 下的所有组合`);
      } else {
        // 取消组合类型：取消该类型下所有 fund
        const fundKeysToRemove = new Set();
        this.collectNodesByType(data, ['fund'], [...fundKeysToRemove]);
        fundKeysToRemove.add(data.id);

        // 收集需要移除的 fund keys
        const allFundKeys = [];
        this.collectNodesByType(data, ['fund'], allFundKeys);
        const keysToRemove = new Set([data.id, ...allFundKeys]);

        // 若【全选】为选中状态，则取消
        if (currentKeys.includes('all')) {
          keysToRemove.add('all');
        }

        const newKeys = currentKeys.filter(key => !keysToRemove.has(key));
        tree.setCheckedKeys(newKeys);
        this.$message.warning(`已取消 ${data.label} 及其下所有组合`);
      }
    },

    /**
     * 处理【组合】勾选/取消
     */
    handleFundCheck(data, isChecked) {
      const tree = this.$refs.treeRef;
      let currentKeys = tree.getCheckedKeys();

      if (isChecked) {
        // 勾选组合：仅选中该组合（已由 el-tree 处理）
        // 无需额外操作
      } else {
        // 取消组合：需要检查父级状态
        const keysToRemove = new Set([data.id]);

        // 找到父级 fundType
        const parentFundType = this.findParentByType(data.id, 'fundType');
        if (parentFundType && currentKeys.includes(parentFundType.id)) {
          keysToRemove.add(parentFundType.id);
        }

        // 若【全选】为选中状态，则取消
        if (currentKeys.includes('all')) {
          keysToRemove.add('all');
        }

        const newKeys = currentKeys.filter(key => !keysToRemove.has(key));
        tree.setCheckedKeys(newKeys);
      }
    },

    /**
     * 递归收集指定类型的节点 ID
     */
    collectNodesByType(node, types, result) {
      if (!node) return;
      
      if (types.includes(node.type)) {
        result.push(node.id);
      }

      if (node.children && node.children.length) {
        node.children.forEach(child => {
          this.collectNodesByType(child, types, result);
        });
      }
    },

    /**
     * 查找指定节点的父节点（按类型）
     */
    findParentByType(nodeId, parentType) {
      const findInTree = (nodes, targetId, parent = null) => {
        for (const node of nodes) {
          if (node.id === targetId) {
            // 找到目标节点，向上查找指定类型的父节点
            return parent && parent.type === parentType ? parent : null;
          }
          if (node.children && node.children.length) {
            // 如果当前节点是目标类型，则作为潜在父节点传递
            const nextParent = node.type === parentType ? node : parent;
            const result = findInTree(node.children, targetId, nextParent);
            if (result) return result;
          }
        }
        return null;
      };

      return findInTree(this.treeData, nodeId);
    },

    /**
     * 获取选中数据
     */
    getCheckedData() {
      const tree = this.$refs.treeRef;
      const checkedNodes = tree.getCheckedNodes();

      this.checkedResult = {
        fundTypes: checkedNodes.filter(n => n.type === 'fundType'),
        funds: checkedNodes.filter(n => n.type === 'fund'),
        childFunds: checkedNodes.filter(n => n.type === 'childFund'),
      };

      const total = this.checkedResult.fundTypes.length + 
                    this.checkedResult.funds.length + 
                    this.checkedResult.childFunds.length;

      if (total === 0) {
        this.$message.info('暂无选中的数据');
      } else {
        this.$message.success(`共选中 ${total} 项数据`);
      }
    },

    /**
     * 清空所有选择
     */
    clearAll() {
      const tree = this.$refs.treeRef;
      tree.setCheckedKeys([]);
      this.checkedResult = {
        fundTypes: [],
        funds: [],
        childFunds: [],
      };
      this.$message.info('已清空所有选择');
    },
  },
};
</script>

<style lang="less" scoped>
.fund-tree-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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

  .type-legend {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    padding: 10px 15px;
    background: #f5f7fa;
    border-radius: 4px;

    .legend-item {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      
      &.all {
        background: #e8f4fd;
        color: #409eff;
        border: 1px solid #409eff;
      }
      &.fund-type {
        background: #fdf6ec;
        color: #e6a23c;
        border: 1px solid #e6a23c;
      }
      &.fund {
        background: #f0f9eb;
        color: #67c23a;
        border: 1px solid #67c23a;
      }
      &.child-fund {
        background: #f4f4f5;
        color: #909399;
        border: 1px solid #909399;
      }
    }
  }

  .tree-wrapper {
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fafafa;

    .tree-node {
      display: flex;
      align-items: center;
      padding: 2px 0;

      .node-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;

        i {
          font-size: 16px;
        }

        .node-type-tag {
          font-size: 10px;
          padding: 1px 4px;
          border-radius: 2px;
          margin-left: 4px;
        }
      }

      &.node-all {
        .node-label {
          color: #409eff;
          font-weight: bold;
          i { color: #409eff; }
          .node-type-tag {
            background: #e8f4fd;
            color: #409eff;
          }
        }
      }

      &.node-fund-type {
        .node-label {
          color: #e6a23c;
          font-weight: 500;
          i { color: #e6a23c; }
          .node-type-tag {
            background: #fdf6ec;
            color: #e6a23c;
          }
        }
      }

      &.node-fund {
        .node-label {
          color: #67c23a;
          i { color: #67c23a; }
          .node-type-tag {
            background: #f0f9eb;
            color: #67c23a;
          }
        }
      }

      &.node-child-fund {
        .node-label {
          color: #909399;
          i { color: #909399; }
          .node-type-tag {
            background: #f4f4f5;
            color: #909399;
          }
        }
      }
    }
  }

  .result-area {
    margin-top: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;

    h4 {
      margin: 0 0 15px;
      color: #303133;
      font-size: 14px;
    }

    .result-section {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 13px;
        color: #606266;
        margin-bottom: 8px;
      }

      .tags-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
    }
  }

  .tips-area {
    margin-top: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
    border-radius: 4px;
    border-left: 3px solid #409eff;

    h4 {
      margin: 0 0 10px;
      color: #409eff;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: #606266;
      font-size: 13px;
      line-height: 1.8;

      li {
        margin-bottom: 4px;

        strong {
          color: #303133;
        }
      }
    }
  }
}
</style>
