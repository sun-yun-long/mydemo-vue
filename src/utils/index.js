/**
 * 线性结构转树形结构
 * @param {*} nodes 节点
 * @param {*} treeRootId 顶级根节点
 * @param {*} pidName 父节点名
 * @param {*} idName 子节点名
 * @param {*} mid 树形key
 * @returns
 */
const converTreeData = (nodes, treeRootId, pidName, idName, mid) => {
  if (!pidName) pidName = "pid";
  if (!idName) idName = "id";
  if (!mid) {
    mid = "id";
  } else {
    // 增加唯一标识key
    nodes = nodes.map((item) => {
      item.mid = item[idName] + item[pidName] + Math.random() * 1000;
      return item;
    });
  }
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i][pidName] == treeRootId) {
      break;
    } else if (i == nodes.length - 1) {
      Message.closeAll();
      Message({
        message: "数据格式错误",
        type: "error",
        duration: 2 * 1000,
      });
    }
  }
  const nodesFilters = nodes;

  const groups = {};
  // 默认展开的节点
  const expandRowKeys = [];
  // 按父节点将节点分组
  for (const i in nodesFilters) {
    if (!groups[nodesFilters[i][pidName]]) {
      groups[nodesFilters[i][pidName]] = [];
    }
    groups[nodesFilters[i][pidName]].push(nodesFilters[i]);
    if (treeRootId && treeRootId === nodesFilters[i][idName]) {
      // 发现传入的根节点id作为节点id时，将根节点设置为该节点的父节点
      treeRootId = nodesFilters[i][pidName];
    }
  }

  const rootNodes = groups[treeRootId];
  groups[treeRootId] = null; // [SAFEGUARD]防止自为父节点或互为父节点（有环图结构）导致的死循环

  function traverseTreeNodeGroup(treeNodeGroup) {
    for (const i in treeNodeGroup) {
      const node = treeNodeGroup[i];
      if (groups[node[idName]]) {
        node.children = groups[node[idName]];
        groups[node[idName]] = null; // [SAFEGUARD]防止自为父节点或互为父节点（有环图结构）导致的死循环
        traverseTreeNodeGroup(node.children);
      }
      // 选择默认展开的节点
      if (node[pidName] == treeRootId) {
        expandRowKeys.push(node[mid]);
      }
    }
  }
  traverseTreeNodeGroup(rootNodes);

  return { data: rootNodes, expandRowKeys: expandRowKeys };
};

/**
 * @description 处理完成状态下颜色
 */
const handleColorUpdate = (node, self, status) => {
  self.$nextTick(() => {
    const shapeArr = document.querySelectorAll(".djs-shape");
    shapeArr.forEach((item) => {
      const xmlNodeId = item.attributes["data-element-id"].nodeValue;
      if (xmlNodeId === node.xmlId) {
        const rectDom = item.firstChild.childNodes[0];
        const textDom = item.firstChild.childNodes[1];

        if (status === "COMPLATE") {
          rectDom.style.stroke = "rgb(67, 160, 71)";
          rectDom.style.fill = "#fff";
          textDom.style.fill = "rgb(67, 160, 71)";
        } else {
          rectDom.style.stroke = "rgb(64, 158, 255)";
          rectDom.style.fill = "#fff";
          textDom.style.fill = "rgb(64, 158, 255)";
        }
      }
    });
  });
};

/**
 * @description xml流程图根据状态修改颜色
 */
const handleRenderBpmnColor = (xmlId, completeNode, runningNode, self) => {
  for (let item of completeNode) {
    handleColorUpdate(item, self, "COMPLATE");
  }
  for (let item of runningNode) {
    handleColorUpdate(item, self, "RUNNING");
  }
};

/**
 * @description 去除无值字段，包含数组
 */
const parameterSrc = (data) => {
  const newData = {};
  for (const key in data) {
    if (
      data[key] === "" ||
      data[key] === undefined ||
      data[key] === null ||
      JSON.stringify(data[key]) === "[]"
    ) {
    } else {
      newData[key] = data[key];
    }
  }
  return newData;
};

export default {
  converTreeData,
  handleRenderBpmnColor,
  parameterSrc,
};
