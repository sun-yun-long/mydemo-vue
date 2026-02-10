<template>
  <div class="example-container">
    <h2>多选下拉框组件示例</h2>
    <p class="description">全选 checkbox 现在位于输入框内部左侧，只显示 checkbox 不显示文字</p>
    
    <div class="example-section">
      <h3>基础用法</h3>
      <MultiSelectDropdown
        v-model="selectedValues1"
        :options="options"
        placeholder="请选择城市"
        @change="handleChange"
      />
      <div class="result">
        <strong>选中的值:</strong> {{ selectedValues1 }}
      </div>
    </div>
    
    <div class="example-section">
      <h3>禁用状态</h3>
      <MultiSelectDropdown
        v-model="selectedValues2"
        :options="options"
        :disabled="true"
        placeholder="禁用状态"
      />
      <div class="result">
        <strong>选中的值:</strong> {{ selectedValues2 }}
      </div>
    </div>
    
    <div class="example-section">
      <h3>小尺寸</h3>
      <MultiSelectDropdown
        v-model="selectedValues3"
        :options="options"
        size="small"
        placeholder="小尺寸"
      />
      <div class="result">
        <strong>选中的值:</strong> {{ selectedValues3 }}
      </div>
    </div>
    
    <div class="example-section">
      <h3>不显示全选选项</h3>
      <MultiSelectDropdown
        v-model="selectedValues4"
        :options="options"
        :show-select-all="false"
        placeholder="不显示全选"
      />
      <div class="result">
        <strong>选中的值:</strong> {{ selectedValues4 }}
      </div>
    </div>
    
    <div class="example-section">
      <h3>包含禁用选项</h3>
      <MultiSelectDropdown
        v-model="selectedValues5"
        :options="optionsWithDisabled"
        placeholder="包含禁用选项"
      />
      <div class="result">
        <strong>选中的值:</strong> {{ selectedValues5 }}
      </div>
      <div class="note">
        <small>注意：广州和南京选项被禁用，不会出现在全选范围内</small>
      </div>
    </div>
    
    <div class="example-section">
      <h3>迷你尺寸</h3>
      <MultiSelectDropdown
        v-model="selectedValues6"
        :options="options"
        size="mini"
        placeholder="迷你尺寸"
      />
      <div class="result">
        <strong>选中的值:</strong> {{ selectedValues6 }}
      </div>
    </div>
  </div>
</template>

<script>
import MultiSelectDropdown from './index.vue'

export default {
  name: 'MultiSelectDropdownExample',
  components: {
    MultiSelectDropdown
  },
  data() {
    return {
      selectedValues1: [],
      selectedValues2: ['beijing', 'shanghai'],
      selectedValues3: [],
      selectedValues4: [],
      selectedValues5: [],
      selectedValues6: [],
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '南京', value: 'nanjing' },
        { label: '武汉', value: 'wuhan' },
        { label: '成都', value: 'chengdu' }
      ],
      optionsWithDisabled: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou', disabled: true },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '南京', value: 'nanjing', disabled: true },
        { label: '武汉', value: 'wuhan' },
        { label: '成都', value: 'chengdu' }
      ]
    }
  },
  methods: {
    handleChange(value) {
      console.log('选中的值发生变化:', value)
    }
  }
}
</script>

<style scoped>
.example-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.description {
  text-align: center;
  color: #606266;
  margin-bottom: 30px;
  font-style: italic;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.example-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}

.result {
  margin-top: 15px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #606266;
}

.note {
  margin-top: 10px;
  color: #909399;
  font-style: italic;
}

.note small {
  color: #909399;
}
</style>
