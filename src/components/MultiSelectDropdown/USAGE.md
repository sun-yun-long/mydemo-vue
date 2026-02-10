# 快速使用指南

## 1. 引入组件

```javascript
import MultiSelectDropdown from '@/components/MultiSelectDropdown'
```

## 2. 注册组件

```javascript
export default {
  components: {
    MultiSelectDropdown
  }
}
```

## 3. 在模板中使用

```vue
<template>
  <MultiSelectDropdown
    v-model="selectedValues"
    :options="options"
    placeholder="请选择城市"
    @change="handleChange"
  />
</template>
```

## 4. 数据准备

```javascript
data() {
  return {
    selectedValues: [],
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' }
    ]
  }
}
```

## 5. 测试组件

要测试组件功能，您可以：

1. 在任意页面中引入并使用组件
2. 或者创建一个新的测试页面，手动添加到路由中

### 测试页面示例

```vue
<template>
  <div>
    <h2>多选下拉框测试</h2>
    <MultiSelectDropdown
      v-model="selectedValues"
      :options="options"
      placeholder="请选择城市"
    />
    <p>选中的值: {{ selectedValues }}</p>
  </div>
</template>

<script>
import MultiSelectDropdown from '@/components/MultiSelectDropdown'

export default {
  components: {
    MultiSelectDropdown
  },
  data() {
    return {
      selectedValues: [],
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ]
    }
  }
}
</script>
```

## 功能特性

✅ **全选功能**: 点击全选可以选中所有可选项（checkbox 位于输入框内部左侧）  
✅ **半选状态**: 部分选中时显示半选状态  
✅ **搜索过滤**: 支持输入搜索选项  
✅ **禁用选项**: 支持禁用特定选项  
✅ **清空功能**: 支持一键清空所有选择  
✅ **多种尺寸**: 支持 medium、small、mini 三种尺寸  
✅ **双向绑定**: 支持 v-model 双向数据绑定  
✅ **自动 padding**: 输入框自动添加左侧 padding 为 checkbox 留出空间  

## 布局特性

### 全选 checkbox 布局
- 全选 checkbox 位于输入框内部左侧
- 只显示 checkbox，不显示"全选"文字
- 输入框自动添加左侧 padding 为 checkbox 留出空间
- 支持不同尺寸的适配

### 尺寸适配
- **medium**: checkbox 距离左边 8px，输入框 padding-left 32px
- **small**: checkbox 距离左边 6px，输入框 padding-left 28px  
- **mini**: checkbox 距离左边 4px，输入框 padding-left 24px

## 注意事项

1. 组件会自动过滤掉禁用的选项，全选功能只对可选择的选项生效
2. 全选 checkbox 会显示三种状态：全选、半选、无选择
3. 组件基于 Element UI，确保项目中已正确安装和配置 Element UI
4. 全选 checkbox 现在位于输入框内部左侧，用户无需打开下拉框即可进行全选操作
5. 输入框会自动添加左侧 padding，确保文字不会被 checkbox 遮挡
