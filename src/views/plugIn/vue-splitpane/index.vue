<template>
  <div class="components-container">
    <split-pane split="vertical" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <split-pane split="vertical">
            <template slot="paneL">
              <div class="left-container-1"></div>
            </template>
            <template slot="paneR">
              <div class="right-container-1"></div>
            </template>
          </split-pane>
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container"></div>
      </template>
    </split-pane>
    <!-- <splitpanes style="height: 400px">
      <pane :min-size="20">1</pane>
      <pane>
        2
      </pane>
      <pane :min-size="70">5</pane>
    </splitpanes> -->
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
// import { Splitpanes, Pane } from "splitpanes";
// import 'splitpanes/dist/splitpanes.css'
export default {
  name: "SplitpaneDemo",
  components: {
    splitPane,
    // Splitpanes,
    // Pane
  },
  methods: {
    resize(val) {
      console.log("resize", val);
    }
  }
};
</script>

<style >
.splitpanes__pane {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica, Arial, sans-serif;
  color: rgba(255, 255, 255, 0.6);
  font-size: 5em;
  background: #f38181;
}
.components-container {
  position: relative;
  height: 100vh;
}

.left-container {
  background-color: #f38181;
  height: 100%;
}

.right-container {
  background-color: #fce38a;
  height: 100%;
}

.left-container-1 {
  background-color: #ccc;
  height: 100%;
}
.right-container-1 {
  background-color: #ddd;
  height: 100%;
}
</style>