<template>
  <div class="print">
    <button class="print_btn" @click="print">打印1</button>
    <button class="print_btn" v-print="printObj">打印2</button>
    <div class="out" ref="out">
      <div class="print_view">
        <h3>打印区域</h3>
        <div class="table_out" ref="print_view" id="printTest" style="max-width: 1175px">
          <h2 class="c" style="margin-bottom: 5px">划款指令报表</h2>
          <h3 class="c">恒生电子＿路博迈股票基金＿专用表</h3>
          <div class="tit_">
            <p class="c">编号：<span>$number$</span></p>
            <p class="c">指令日期：<span>$date$</span></p>
            <p>中国工商银行股份有限公司资产托管部：</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;敬请贵部根据以下提供的收款人名称、开户行、账号、到账日期和划款金额划款。
            </p>
          </div>
          <ul class="ul_list">
            <li>
              <span class="left">到账日期：</span>
              <span class="endDate">$endDate$</span>
            </li>
            <li>
              <span class="left">付款人：</span>
              <span>$fkr$</span>
            </li>
            <li>
              <span class="left">开户行：</span>
              <span>$khh$</span>
            </li>
            <li>
              <span class="left">账号：</span>
              <span>$zh$</span>
            </li>
            <li>
              <span class="left">收款人：</span>
              <span>$skr$</span>
            </li>
            <li>
              <span class="left">开户行：</span>
              <span>$khh1$</span>
            </li>
            <li>
              <span class="left">账号：</span>
              <span>$zh1$</span>
            </li>
            <li>
              <span class="left">划款金额（小写）：</span>
              <span>$moneyl$</span>
            </li>
            <li>
              <span class="left">划款金额（大写）：</span>
              <span>$moneyb$</span>
            </li>
          </ul>
          <div class="hkyt">
            <p>划款用途：</p>
            <p>$hkyt$</p>
          </div>
          <div class="bz">
            <p>备注:</p>
            <span>$bz$</span>
          </div>
          <div class="banliren">
            <ul class="banliren_i banliren_left">
              <li class="li_man">管理人签章：</li>
              <li>审批人：</li>
              <li>复核人：</li>
              <li>经办人：</li>
            </ul>
            <ul class="banliren_i">
              <li class="li_man">托管人签章：</li>
              <li>审批人：</li>
              <li>复核人：</li>
              <li>经办人：</li>
            </ul>
          </div>
          <div class="table_bottom">
            <p class="table_bottom_1"><span>制表：朱岩岩</span><span>复核：</span><span>审核：</span></p>
            <p class="table_bottom_2"><span>打印：朱岩岩</span><span>打印日期：2020-02-01</span></p>
          </div>
        </div>
      </div>
      <div class="print_view">
        <h3>不打印区域</h3>
        <ul>
          <li>********************</li>
          <li>********************</li>
          <li>********************</li>
          <li>********************</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Watermark from "@/utils/watermark/watermark";
export default {
  data() {
    return {
      printObj: {
        id: "printTest",
        popTitle: "vue-print-nb"
      }
    };
  },
  mounted() {
    Watermark.set("水印内容",this.$refs.print_view);
  },
  methods: {
    print() {
      console.log("print", this.$refs.table);
      this.$p({
        el: this.$refs.print_view, //打印目标dom节点， this.$refs.table.$refs.table_
        debug: false, //打开调试模式，会显示iframe,
        importCss: false, //引入head 中的link stylesheet
        importStyle: true, //引入style标签中的样式
        loadCss: [], //需要载入的第三方样式表
        title: "", //打印标题
        delay: 300, //延迟打印时间，确保iframe中的静态资源加载完成
        beforePrinfHandle: function () {}, //打开打印窗口前的钩子函数,可以针对打印文档进行自定义调整，接受一个document参数
        afterPrintHandle: null //打印完成的钩子函数,
      });
    }
  }
};
</script>

<style lang="less">
// @media print{
// .table_out{
//   color: red;
//   width: 90%;
//   margin: 0 auto;
//   font-size: 14px;
//   div{
//     border: 1px solid #000;
//   }
//   .tit_{
//     p{
//       margin: 5px 0;
//     }
//   }
//   .ul_list{
//     // border: 1px solid #000;
//     border-left: 1px solid #000;
//     border-right: 1px solid #000;
//     li{
//       border-bottom: 1px solid #000;
//       height: 30px;
//       span{
//         display: inline-block;
//         height: 30px;
//         line-height: 30px;
//       }
//       .left{
//         width: 150px;
//         border-right: 1px solid #000;
//       }
//     }
//   }
//   .hkyt{
//     height: 70px;
//     border-top: none;
//     border-bottom: none;
//   }
//   .bz{
//     height: 70px;
//   }
//   .banliren{
//     border-top: none;
//     border-bottom: none;
//     display: flex;
//     .banliren_i{
//       width: 50%;
//       li{
//         height: 40px;
//         border-bottom: 1px solid #000;
//       }
//       .li_man{
//         height: 80px;
//       }
//     }
//     .banliren_left{
//       border-right: 1px solid #000;
//     }
//   }
//   .table_bottom{
//     border: none;
//     .table_bottom_1{
//       span{
//         display: inline-block;
//         width: 33%;
//       }
//     }
//     .table_bottom_2{
//       span{
//         display: inline-block;
//         width: 50%;
//       }
//     }
//   }
// }
// }
.print_view {
  width: 50%;
}
.out {
  display: flex;
}
ul,
li {
  list-style: none;
  // margin: 0;
  // padding: 0;
}
.print_btn {
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.c {
  text-align: center;
}
.table_out {
  width: 90%;
  margin: 0 auto;
  font-size: 14px;
  div {
    border: 1px solid #000;
  }
  .tit_ {
    p {
      margin: 5px 0;
    }
  }
  .ul_list {
    // border: 1px solid #000;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    li {
      border-bottom: 1px solid #000;
      height: 30px;
      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
      }
      .left {
        width: 150px;
        border-right: 1px solid #000;
      }
    }
  }
  .hkyt {
    height: 70px;
    border-top: none;
    border-bottom: none;
  }
  .bz {
    height: 70px;
  }
  .banliren {
    border-top: none;
    border-bottom: none;
    display: flex;
    .banliren_i {
      width: 50%;
      li {
        height: 40px;
        border-bottom: 1px solid #000;
      }
      .li_man {
        height: 80px;
      }
    }
    .banliren_left {
      border-right: 1px solid #000;
    }
  }
  .table_bottom {
    border: none;
    .table_bottom_1 {
      span {
        display: inline-block;
        width: 33%;
      }
    }
    .table_bottom_2 {
      span {
        display: inline-block;
        width: 50%;
      }
    }
  }
}
.hkzl_drawer {
  // height: 99%;
  // overflow: hidden;
  // overflow-y: scroll;
  padding: 0 20px 30px 20px;
  .hkzl_drawer_top {
    overflow: hidden;
    margin-bottom: 20px;
    .top_button {
      float: right;
    }
  }
}
</style>