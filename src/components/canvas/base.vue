<!--
 * @Author: yejinliang
 * @Date: 2022-03-29 15:40:56
 * @LastEditTime: 2022-03-29 17:33:20
 * @LastEditors: yejinliang
 * @Description: canvas api基础
-->
<script setup lang="ts">
import { onMounted, ref } from "vue"

let myCanvas: HTMLCanvasElement
onMounted(() => {
  myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement
  let ctx = myCanvas.getContext("2d")

  let cw = (myCanvas.width = 500)
  let cy = (myCanvas.height = 500)

  if (ctx) {
    // ctx.beginPath()
    // ctx.arc(100, 100, 10, 0, Math.PI * 2, true)
    // ctx.closePath()
    // ctx.fillStyle = "rgb(0,255,255)"
    // ctx.fill()

    ctx.beginPath()
    ctx.arc(100, 100, 50, 0, Math.PI * 0.5, false)
    ctx.strokeStyle = "rgb(0,255,255)"
    ctx.stroke()
  }
})
</script>

<template>
  <canvas id="myCanvas"></canvas>
</template>

<style scoped>
#myCanvas {
  border: 1px solid royalblue;
}
</style>
