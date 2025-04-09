<template>
  <el-select
    v-model="selectedValue"
    filterable
    placeholder="请选择"
    @visible-change="handleVisibleChange"
  >
    <!-- 下拉框内容 -->
    <div class="virtual-scroll-container" @scroll="handleScroll">
      <!-- 占位容器，模拟整个列表的高度 -->
      <div :style="{ height: totalHeight + 'px' }"></div>
      <!-- 可见选项 -->
      <div
        class="visible-options"
        :style="{ transform: `translateY(${startOffset}px)` }"
      >
        <el-option
          v-for="item in visibleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </div>
    </div>
  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    value: {
      type: [String, Number, Array],
      default: '',
    },
  },
  data() {
    return {
      selectedValue: this.value,
      isOpen: false,
      visibleOptions: [], // 当前可见的选项
      startIndex: 0, // 可见选项的起始索引
      endIndex: 10, // 可见选项的结束索引
      itemHeight: 40, // 每个选项的高度
      visibleCount: 10, // 可见的选项数量
      startOffset: 0, // 可见区域的偏移量
    };
  },
  computed: {
    // 计算整个列表的总高度
    totalHeight() {
      return this.options.length * this.itemHeight;
    },
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal;
    },
    selectedValue(newVal) {
      this.$emit('input', newVal);
    },
    isOpen(isOpen) {
      if (isOpen) {
        // 当下拉框打开时，初始化可见选项
        this.updateVisibleOptions();
      }
    },
  },
  methods: {
    // 更新可见选项
    updateVisibleOptions() {
      const container = document.querySelector('.virtual-scroll-container');
      if (container) {
        const scrollTop = container.scrollTop;
        this.startIndex = Math.floor(scrollTop / this.itemHeight);
        this.endIndex = this.startIndex + this.visibleCount;
        this.startOffset = this.startIndex * this.itemHeight;
        this.visibleOptions = this.options.slice(this.startIndex, this.endIndex);
      }
    },
    // 处理滚动事件
    handleScroll() {
      this.updateVisibleOptions();
    },
    // 监听下拉框的打开/关闭状态
    handleVisibleChange(isOpen) {
      this.isOpen = isOpen;
    },
  },
};
</script>

<style scoped>
.virtual-scroll-container {
  height: 200px; /* 设置下拉框的高度 */
  overflow-y: auto;
  position: relative;
}

.visible-options {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.el-select-dropdown__item {
  height: 40px; /* 设置每个选项的高度 */
  line-height: 40px;
}
</style>