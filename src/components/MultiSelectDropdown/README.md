# MultiSelectDropdown 多选下拉框组件

一个基于 Element UI 的多选下拉框组件，支持全选功能和三种状态的 checkbox。全选 checkbox 位于输入框内部左侧，只显示 checkbox 不显示文字。

## 功能特性

- ✅ 支持多选
- ✅ 支持全选/取消全选（checkbox 位于输入框内部左侧）
- ✅ 支持半选状态显示
- ✅ 支持搜索过滤
- ✅ 支持禁用选项
- ✅ 支持清空选择
- ✅ 支持自定义尺寸
- ✅ 支持 v-model 双向绑定
- ✅ 输入框自动添加左侧 padding 为 checkbox 留出空间

## 使用方法

### 基础用法

```vue
<template>
  <MultiSelectDropdown
    v-model="selectedValues"
    :options="options"
    placeholder="请选择城市"
    @change="handleChange"
  />
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
  },
  methods: {
    handleChange(value) {
      console.log('选中的值:', value)
    }
  }
}
</script>
```

### 禁用状态

```vue
<MultiSelectDropdown
  v-model="selectedValues"
  :options="options"
  :disabled="true"
  placeholder="禁用状态"
/>
```

### 小尺寸

```vue
<MultiSelectDropdown
  v-model="selectedValues"
  :options="options"
  size="small"
  placeholder="小尺寸"
/>
```

### 不显示全选选项

```vue
<MultiSelectDropdown
  v-model="selectedValues"
  :options="options"
  :show-select-all="false"
  placeholder="不显示全选"
/>
```

### 包含禁用选项

```vue
<template>
  <MultiSelectDropdown
    v-model="selectedValues"
    :options="optionsWithDisabled"
    placeholder="包含禁用选项"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedValues: [],
      optionsWithDisabled: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou', disabled: true },
        { label: '深圳', value: 'shenzhen' }
      ]
    }
  }
}
</script>
```

## Props 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| options | 选项数据 | Array | — | [] |
| value / v-model | 绑定值 | Array | — | [] |
| placeholder | 占位符 | String | — | '请选择' |
| disabled | 是否禁用 | Boolean | — | false |
| clearable | 是否可清空 | Boolean | — | true |
| filterable | 是否可搜索 | Boolean | — | true |
| size | 输入框尺寸 | String | medium / small / mini | medium |
| show-select-all | 是否显示全选选项 | Boolean | — | true |

## Events 事件

| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| change | 选中值发生变化时触发 | (value: Array) |
| clear | 可清空的单选器用户点击清空按钮时触发 | — |
| remove-tag | 多选模式下移除tag时触发 | (removedValue: any) |
| select-all-change | 全选状态发生变化时触发 | (checked: Boolean) |

## Options 数据结构

```javascript
{
  label: String,    // 显示的文本
  value: any,       // 选项的值
  disabled: Boolean // 是否禁用该选项（可选）
}
```

## 布局特性

### 全选 checkbox 布局
- 全选 checkbox 位于输入框内部左侧
- 只显示 checkbox，不显示"全选"文字
- 输入框自动添加左侧 padding 为 checkbox 留出空间
- 支持不同尺寸的适配（medium、small、mini）

### 尺寸适配
- **medium**: checkbox 距离左边 8px，输入框 padding-left 32px
- **small**: checkbox 距离左边 6px，输入框 padding-left 28px  
- **mini**: checkbox 距离左边 4px，输入框 padding-left 24px

## 注意事项

1. 组件会自动过滤掉禁用的选项，全选功能只对可选择的选项生效
2. 全选 checkbox 会显示三种状态：
   - 全选：所有可选项都被选中
   - 半选：部分可选项被选中
   - 无选择：没有可选项被选中
3. 组件支持搜索功能，可以通过 `filterable` 属性控制
4. 组件支持清空功能，可以通过 `clearable` 属性控制
5. 组件支持自定义尺寸，可选值：medium、small、mini
6. 全选 checkbox 现在位于输入框内部左侧，用户无需打开下拉框即可进行全选操作
7. 输入框会自动添加左侧 padding，确保文字不会被 checkbox 遮挡

## 示例

查看 `example.vue` 文件获取完整的使用示例。
