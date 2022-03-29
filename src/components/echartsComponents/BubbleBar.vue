<script setup lang="ts">
import * as echarts from "echarts"
import { ref, onMounted, Ref } from "vue"
import qipao from "../../assets/60x80.png"
onMounted(() => {
  const chartDom = document.getElementById("charts") as HTMLElement
  const myChart = echarts.init(chartDom, {}, { renderer: "svg" })
  //   const myChart = echarts.init(chartDom)
  let option: any
  option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value", 
    },
    aria: {
      enabled: true,
      decal: {
        show: true,
        decals: {
          symbol: `image://${qipao}`,
          dashArrayX: 58,
          dashArrayY: 80,
          maxTileWidth: 50,
          maxTileHeight: 80,
        },
      },
    },
    series: [
      {
        type: "bar",
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  }
  option && myChart.setOption(option)

  const animateDom = document.createElement("animate")
  const animateAttr: any = {
    attributeName: "y",
    dur: "500ms",
    to: "-80",
    repeatCount: "indefinite",
  }

  for (let key in animateAttr) {
    animateDom.setAttribute(key, animateAttr[key])
  }

  const pattern = chartDom.querySelector("pattern")
  pattern?.prepend(animateDom)
  const defsDom = chartDom.querySelector("defs")
  let ani = defsDom!.innerHTML;
  defsDom!.innerHTML = ani;
})
</script>

<template>
  <div id="charts" ref="chartDom"></div>
</template>

<style scoped>
#charts {
  width: 500px;
  height: 500px;
}
</style>
