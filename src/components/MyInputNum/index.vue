<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-12-01 14:18:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-01 15:18:02
-->
<template>
  <div class="my-input-num">
    <el-input
      v-model="inputValue"
      size="small"
      placeholder="请输入"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  model: {
    prop: "value",
    event: "sendData"
  },
  data() {
    return {
      inputValue: ""
    };
  },
  watch: {
    value(data) {
      this.inputValue = data;
    }
  },
  mounted() {
    this.inputValue = this.value;
  },
  methods: {
    onFocus() {
      if (this.inputValue) {
        if (this.inputValue.includes(",")) {
          this.inputValue = this.inputValue.toString().replace(/,/gi, "") - 0 + "";
        } else {
          this.inputValue = this.inputValue - 0 + "";
        }
      }
    },
    onBlur() {
      this.inputValue = this.moneyYuan(this.inputValue);
      if (this.inputValue) {
        let value = "";
        if (this.inputValue.includes(",")) {
          value = this.inputValue.toString().replace(/,/gi, "") - 0 + "";
        } else {
          value = this.inputValue - 0 + "";
        }
        this.$emit("sendData", value);
      }
    },
    onInput(val) {
      this.$emit("sendData", val);
    },
    moneyYuan(n) {
      if (!n && n !== 0) return "";
      if (n === 0) return "0.00";
      // 如果前面有加减符号
      let head = "";
      if (typeof n === "number") n = String(n);
      head = n.substring(0, 1);
      if (head === "+" || head === "-") {
        n = n.substring(1);
      } else {
        head = "";
      }
      n = n.toString().replace(/,/gi, "");
      n = Number(n).toFixed(2);
      let re = /\d{1,3}(?=(\d{3})+$)/g;
      let backValue = n.replace(/^(\d+)((\.\d*)?)$/, function (s, s1, s2) {
        return s1.replace(re, "$&,") + s2;
      });
      // 转换完加上加减号
      if (head) backValue = head + backValue;
      return backValue;
    }
  }
};
</script>
<style scoped lang='scss'>
</style>