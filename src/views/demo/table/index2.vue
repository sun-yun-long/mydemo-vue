<!--
 * @Description: 
 * @Author: 
 * @Date: 2023-11-17 09:37:00
 * @LastEditors: 
 * @LastEditTime: 2023-11-17 09:37:20
-->
<template>
  <div>

  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    return {
      columnOption: [
        {
          title: "券商名称",
          prop: "VC_NAME",
          align: "center"
        },
        {
          title: "基金交易",
          option: [
            {
              title: "成交金额",
              prop: "F_JJJYJE",
              align: "right"
            },
            {
              title: "占当期基金成交总额的比例",
              prop: "VC_JJJYBL",
              align: "right"
            }
          ]
        },
        {
          title: "债券交易",
          option: [
            {
              title: "成交金额",
              prop: "F_ZQJYJE",
              align: "right"
            },
            {
              title: "占当期债券成交总额的比例",
              prop: "VC_ZQJYBL",
              align: "right"
            }
          ]
        },
        {
          title: "债券回购交易",
          option: [
            {
              title: "成交金额",
              prop: "F_HGJE",
              align: "right"
            },
            {
              title: "占当期债券回购交易成交总额的比例",
              prop: "VC_HGBL",
              align: "right"
            }
          ]
        },
        {
          title: "权证交易",
          option: [
            {
              title: "成交金额",
              prop: "F_QZJQJE",
              align: "right"
            },
            {
              title: "占当期权证交易成交总额的比例",
              prop: "VC_QZJYBL",
              align: "right"
            }
          ]
        }
      ],
    }
  },
  mounted() {},
  methods: {},
}

</script>
<style scoped lang='scss'>
</style>