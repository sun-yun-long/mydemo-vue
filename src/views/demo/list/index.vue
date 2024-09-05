<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-02 14:35:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-02 10:32:24
-->
<template>
  <div>
    <div class="box-out">
      <div class="box" v-for="(item, index) in boxList" :key="index">
        <p class="box-title">{{ item.title }}</p>
        <div class="box-content">
          <div class="box-content-img"><img class="img_" :src="item.imgSrc" alt="" /></div>
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

    <el-button @click="aaa"></el-button>

    <!-- <el-form :model="formData" :rules="rules">
      <el-form-item prop="">

      </el-form-item>
    </el-form> -->

    <el-select
      v-model="value1"
      placeholder="请选择"
      size="small"
      @change="(val) => handleChange(val, 'aaa')"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <MyInput v-model="value"></MyInput>
  </div>
</template>

<script>
import MyInput from "@/components/MyInputNum";
export default {
  name: "",
  components: {
    MyInput
  },
  data() {
    return {
      value: "122",
      value1: "",
      b_c: [],
      options: [
        { label: "选项一", value: "1" },
        { label: "选项二", value: "2" },
        { label: "选项三", value: "3" }
      ],
      boxList: [
        {
          id: 1,
          title: "title1",
          imgSrc: "",
          text:
            "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 2,
          title: "title2",
          imgSrc: "",
          text:
            "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 3,
          title: "title1",
          imgSrc: "",
          text:
            "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 4,
          title: "title1",
          imgSrc: "",
          text:
            "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        },
        {
          id: 5,
          title: "title1",
          imgSrc: "",
          text:
            "adadh  daddad dad 达到骄傲的大苏打阿达的阿达啊大的" +
            "啊啊的啊的阿达啊达到啊的阿达阿达啊的阿达达到啊大的阿达啊的啊达到x"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    aaa() {
      console.log(this.value);
    },
    handleChange(val, type) {
      this.b_c.push(val);
      this.b_c = this.b_c.slice(-2)
      console.log(this.b_c);
      // console.log(val);
      // console.log(type);
    }
  },
  watch: {
    value() {
      console.log(this.value);
    }
  }
};
</script>

<style lang="less" scoped>
.box-out :hover {
  background: #f2f6fc;
}
.box-out {
  width: 600px;
  margin: 0 auto;

  .box {
    border-bottom: 1px solid #ebeef5;
    padding: 10px 2px;
    .box-title {
      font-size: 20px;
      font-weight: 600;
    }
    .box-content {
      display: flex;
      .box-content-img {
        height: 80px;
        width: 130px;
        margin-right: 6px;
        .img_ {
          height: 100%;
          width: 100%;
        }
      }
      .box-content-text {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .text_ {
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