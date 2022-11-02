<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-03-10 17:00:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-02 15:02:01
-->
<template>
  <div id="app" style="height: 100%">
    <el-container style="height: 100%">
      <el-aside width="200px" style="background-color: #304156">
        <el-menu :unique-opened="true" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
          <template v-for="item in menuList">
            <el-submenu :index="item.id" :key="item.id" v-if="item.children">
              <template slot="title"> <i class="el-icon-setting"></i>{{ item.title || item.name }}</template>
              <el-menu-item :index="ite.id" v-for="ite in item.children" :key="ite.id">
                <router-link :to="item.path+'/'+ite.path">{{ ite.title || ite.name }}</router-link>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.id" :key="item.id" v-else>
              <router-link :to="item.path">{{ item.title || item.name }}</router-link>
            </el-menu-item>
          </template>


          <!-- <el-menu-item index="1-1">
            <router-link to="/">Home</router-link>
          </el-menu-item>
          <el-menu-item index="2-1">
            <router-link to="/about">About</router-link>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title"> <i class="el-icon-setting"></i>game </template>
            <el-menu-item index="3-1">
              <router-link to="/game/saolei">扫雷</router-link>
            </el-menu-item>
            <el-menu-item index="3-1">
              <router-link to="/game/zsgc">增删改查demo</router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"> <i class="el-icon-setting"></i>组件 </template>
            <el-menu-item index="4-1">
              <router-link to="/plugIn/JsonExcel">前端excel导出</router-link>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>

      <el-container>
        <el-header
          style="font-size: 16px; font-weight: 600; height: 40px; line-height: 40px; border-bottom: 1px solid #d8dce5"
        >
          <span>xxxxxxx</span>
        </el-header>
        <el-main style="padding: 5px !important">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { constantRouterMap } from "./router"
export default {
  name: "",
  data() {
    return {
      
    };
  },
  mounted() {},
  computed: {
    menuList(){
      const list = constantRouterMap;
      let menuList = []
      list.forEach(item=>{
        let obj = {}
        if(!item.noShow){
          obj = {
            id: item.id,
            path: item.path,
            name: item.name,
            title: item.title
          }
          if(item.children){
            obj.children = [];
            item.children.forEach(ite=>{
              if(!ite.noShow){
                obj.children.push({
                  id: ite.id,
                  path: ite.path,
                  name: ite.name,
                  title: ite.title
                })
              }
            })
          }
        }
        menuList.push(obj)
      })
      return menuList
    }
  },
  methods: {},
  watch: {},
  methods: {},

};
</script>

<style lang="less">
html,
body {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
</style>
<style lang="less" scoped>
a{
  color: aliceblue;
}
</style>
