<template>
  <div class="my-multi-select-dropdown">
    <div class="select-wrapper">
      <!-- 全选 checkbox -->
      <div class="select-all-checkbox-wrapper">
        <el-checkbox
          :value="isAllSelected"
          :disabled="disabled"
          :indeterminate="isIndeterminate"
          @change="handleSelectAllChange"
          class="select-all-checkbox"
        />
      </div>

      <!-- 下拉选择框 -->
      <el-select
        v-model="selectedValues"
        :title="selectedNameStr"
        multiple
        collapse-tags
        :placeholder="'    ' + placeholder"
        :disabled="disabled"
        :clearable="clearable"
        :filterable="filterable"
        :size="size"
        :class="[
          'with-select-all',
          selectedValues.length > 1 ? 'my-select-multiple-tags50' : '',
          selectedValues.length == options.length && selectedValues.length > 0
            ? 'all-selected-custom'
            : ''
        ]"
        @change="handleChange"
        @clear="handleClear"
        @remove-tag="handleRemoveTag"
      >
        <el-option
          v-for="item in options"
          :key="item[optionsProps.value]"
          :label="item[optionsProps.label]"
          :value="item[optionsProps.value]"
          :disabled="item.disabled"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiSelectDropdown",
  props: {
    // 选项数据
    options: {
      type: Array,
      default: () => [],
      required: true
    },
    optionsProps: {
      type: Object,
      default: () => ({
        label: "label",
        value: "value"
      })
    },
    // 选中的值
    value: {
      type: Array,
      default: () => []
    },
    // 占位符
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: true
    },
    // 尺寸
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["medium", "small", "mini"].includes(value)
    }
  },
  data() {
    return {
      selectedValues: []
    };
  },
  computed: {
    // 可选择的选项（排除禁用的）
    selectableOptions() {
      return this.options.filter((option) => !option.disabled);
    },
    // 可选择的选项值
    selectableValues() {
      return this.selectableOptions.map((option) => option[this.optionsProps.value]);
    },
    // 是否全选
    isAllSelected() {
      return (
        this.selectableValues.length > 0 &&
        this.selectableValues.every((value) => this.selectedValues.includes(value))
      );
    },
    // 是否半选状态
    isIndeterminate() {
      const selectedCount = this.selectableValues.filter((value) =>
        this.selectedValues.includes(value)
      ).length;
      return selectedCount > 0 && selectedCount < this.selectableValues.length;
    },
    // 选中的名称字符串
    selectedNameStr() {
      return this.selectedValues.map((value) => {
        const option = this.options.find((option) => option[this.optionsProps.value] === value);
        return option ? option[this.optionsProps.label] : "";
      }).join(", ");
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectedValues = [...newVal];
      },
      immediate: true
    }
  },
  methods: {
    // 处理选项变化
    handleChange(value) {
      this.selectedValues = value;
      this.$emit("input", value);
      this.$emit("change", value);
    },

    // 处理清空
    handleClear() {
      this.selectedValues = [];
      this.$emit("input", []);
      this.$emit("change", []);
      this.$emit("clear");
    },

    // 处理移除标签
    handleRemoveTag(removedValue) {
      const newValues = this.selectedValues.filter((v) => v !== removedValue);
      this.selectedValues = newValues;
      this.$emit("input", newValues);
      this.$emit("change", newValues);
      this.$emit("remove-tag", removedValue);
    },

    // 处理全选变化
    handleSelectAllChange(checked) {
      let newValues = [];

      if (checked) {
        // 全选
        newValues = [...this.selectableValues];
      } else {
        // 取消全选
        newValues = [];
      }

      this.selectedValues = newValues;
      this.$emit("input", newValues);
      this.$emit("change", newValues);
      this.$emit("select-all-change", checked);
    }
  }
};
</script>

<style lang="less">
.my-multi-select-dropdown {
  display: inline-block;
  .select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .select-all-checkbox-wrapper {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    pointer-events: auto;
  }

  .select-all-checkbox {
    margin: 0;
  }

  .select-all-checkbox .el-checkbox__label {
    display: none;
  }

  .el-select {
    width: 100%;
    .el-select__tags {
      padding-left: 22px;
      .el-tag {
        max-width: 70% !important;
      }
      .el-select__input {
        margin-left: 10px;
      }
    }
    .el-input {
      width: 210px !important;
    }
  }

  .el-select.my-select-multiple-tags50 {
    .el-select__tags .el-tag {
      max-width: 50% !important;
    }
  }

  // 全选时，输入框展示“全部”
  .all-selected-custom {
    .el-select__tags {
      padding-left: 30px;
      span {
        display: none;
      }
    }
    .el-select__tags::before {
      content: "全部";
      color: #606266;
      font-size: 12px;
    }
  }

  .el-checkbox {
    width: 100%;
    margin-right: 0;
  }

  .el-checkbox__label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
