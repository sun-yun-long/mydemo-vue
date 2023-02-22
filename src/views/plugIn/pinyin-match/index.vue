<!--
 * @Description: 
 * @Author: 
 * @Date: 2023-02-22 16:11:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-22 16:26:18
-->
<template>
  <div>
    <el-select
     v-model="formInline.substation"
     placeholder="请选择"
     value-key="value"
     filterable
     :filter-method="pinyingSub"
     clearable
     @clear="subArr = copySub"
     @focus="subArr = copySub"
   >
     <el-option
       v-for="item in subArr"
       :key="item.value"
       :label="item.label"
       :value="item.value"
     ></el-option>
   </el-select>
  </div>
</template>

<script>
import { pinyingSubs } from '@/utils/PinyinMatch'
export default {
  name: '',
  components: {},
  data () {
    return {
      formInline: {
        substation: ""
      },
      subArr: [
        { label: "北京", value: "01" },
        { label: "上海", value: "02" },
        { label: "深圳", value: "03" },
        { label: "杭州", value: "04" },
        { label: "南京", value: "05" },
      ],
      copySub: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.copySub = this.subArr
    },
    pinyingSub(val) {
      let _this = this;
      this.subArr = pinyingSubs(val, "label", _this.subArr, _this.copySub)
    }
  },
}

</script>
<style scoped lang='scss'>
</style>