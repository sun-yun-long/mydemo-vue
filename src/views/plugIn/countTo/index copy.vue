<template>
  <div class="countTo_out">
    <countTo class="countTo" :startVal="startVal" :endVal="endVal" :duration="duration"></countTo>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  components: { countTo },
  data() {
    return {
      startVal: 0,
      endVal: 2021,
      duration: 2000,
    };
  },
};
</script>

<style lang="less">
@red: red;
.countTo_out {
  .countTo {
    font-size: 40px;
    color: @red;
  }
}
</style>