<template>
  <div>
    <VueFlowy :chart="chart"></VueFlowy>
  </div>
</template>

<script>
import { VueFlowy, FlowChart } from "vue-flowy";

export default {
  name: "App",

  components: {
    VueFlowy
  },

  data: () => ({
    chart: new FlowChart(),
  }),
  mounted() {
    const idea = this.chart.addElement("idea");
    const A = this.chart.addElement("A", { label: "vscode" });
    const B = this.chart.addElement("B", { label: "github" });
    const C = this.chart.addElement("C", { label: "npm" });
    const D = this.chart.addElement("D", { label: "node" });
    idea.leadsTo(A).leadsTo(B);
    A.leadsTo(C);
    A.leadsTo(D);

    A.on("click", function () {
      console.log("click!");
    });
  }
};
</script>