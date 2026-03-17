<template>
  <div id="app" style="height: 100%">
    <vue2-water-marker
      v-if="$route.path !== '/login'"
      :text="watermarkText"
      :opacity="0.2"
      :openPrevent="true"
      :beDeleteTips="'禁止删除水印！'"
      :beChangeTips="'禁止篡改水印！'"
      :zIndex="9999"
      :rotateDeg="45"
    />
    <transition name="fade-transform" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    watermarkText() {
      return `张三 ${new Date().toLocaleString()}`;
    }
  }
};
</script>

<style>
/* 整个 App 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  height: 100%;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
