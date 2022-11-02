<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-02 14:35:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-02 14:39:19
-->
<template>
  <div>
    <div class="box-out">
      <div class="box" v-for="(item, index) in boxList" :key="index">
        <p class="box-title">{{ item.title }}</p>
        <div class="box-content">
          <div class="box-content-img"><img class="img_" :src="item.imgSrc" alt=""></div>
          <div class="box-content-text">
            <span class="text_">{{ item.text }}</span>
            <span class="button_">
              <i class="el-icon-edit"></i>
              <i class="el-icon-share"></i>
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    return {
      boxList: [
        {
          id: 1,
          title: "title1",
          imgSrc: "",
          text: "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 2,
          title: "title1",
          imgSrc: "",
          text: "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 3,
          title: "title1",
          imgSrc: "",
          text: "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 4,
          title: "title1",
          imgSrc: "",
          text: "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 5,
          title: "title1",
          imgSrc: "",
          text: "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
      ],
    }
  },
  mounted() {},
  methods: {},
}

</script>

<style lang="less" scoped>
.box-out :hover{
  background: #F2F6FC;
}
.box-out{
  width: 600px;
  margin: 0 auto;
  
  .box{
    border-bottom: 1px solid #EBEEF5;
    padding: 10px 2px;
    .box-title{
      font-size: 20px;
      font-weight: 600;
    }
    .box-content{
      display: flex;
      .box-content-img{
        height: 80px;
        width: 130px;
        margin-right: 6px;
        .img_{
          height: 100%;
          width: 100%;
        }
      }
      .box-content-text{
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        
        .text_{
          overflow: hidden;
          white-space: normal;
          word-break: break-word;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}
</style>