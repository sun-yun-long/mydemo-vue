<template>
  <div class="multi-select-test">
    <div class="header">
      <h1>多选下拉框组件测试页面</h1>
      <p>这是一个基于 Element UI 的多选下拉框组件，支持全选功能和三种状态的 checkbox</p>
    </div>
    
    <div class="content">
      <div class="test-section">
        <h2>基础用法</h2>
        <MySelectMultiple
          v-model="selectedValues1"
          :options="options"
          :options-props="{ label: 'label', value: 'value' }"
          placeholder="请选择城市"
          @change="handleChange"
        />
        <div class="result">
          <strong>选中的值:</strong> {{ selectedValues1 }}
        </div>
      </div>
      
      <div class="test-section">
        <h2>禁用状态</h2>
        <MySelectMultiple
          v-model="selectedValues2"
          :options="options"
          :disabled="true"
          placeholder="禁用状态"
        />
        <div class="result">
          <strong>选中的值:</strong> {{ selectedValues2 }}
        </div>
      </div>
      
      <div class="test-section">
        <h2>小尺寸</h2>
        <MySelectMultiple
          v-model="selectedValues3"
          :options="options"
          size="small"
          placeholder="小尺寸"
        />
        <div class="result">
          <strong>选中的值:</strong> {{ selectedValues3 }}
        </div>
      </div>
      
      <div class="test-section">
        <h2>不显示全选选项</h2>
        <MySelectMultiple
          v-model="selectedValues4"
          :options="options"
          :show-select-all="false"
          placeholder="不显示全选"
        />
        <div class="result">
          <strong>选中的值:</strong> {{ selectedValues4 }}
        </div>
      </div>
      
      <div class="test-section">
        <h2>包含禁用选项</h2>
        <MySelectMultiple
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
      
      <div class="test-section">
        <h2>迷你尺寸</h2>
        <MySelectMultiple
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
  </div>
</template>

<script>
import MySelectMultiple from '@/components/MySelectMultiple'

export default {
  name: 'MultiSelectTest',
  components: {
    MySelectMultiple
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
        { label: '北京北京北京北京北京北京', value: 'beijing' },
        { label: '上海上海上海上海上海上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '南京', value: 'nanjing' },
        { label: '武汉', value: 'wuhan' },
        { label: '成都', value: 'chengdu' },
        { label: '西安', value: 'xian' },
        { label: '重庆', value: 'chongqing' }
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
.multi-select-test {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.header p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.content {
  display: grid;
  gap: 30px;
}

.test-section {
  padding: 25px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .multi-select-test {
    padding: 10px;
  }
  
  .test-section {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .header p {
    font-size: 14px;
  }
}
</style>
