<!--
 * @Author: yejinliang
 * @Date: 2022-03-23 15:09:05
 * @LastEditTime: 2022-03-28 19:08:45
 * @LastEditors: yejinliang
 * @Description: 
-->
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import LightBall from './components/threeComponents/LightBall.vue'
import CustomBar from './components/echartsComponents/CustomBar.vue'
import CustomBar1 from './components/echartsComponents/CustomBar1.vue'
</script>

<template>
  <CustomBar></CustomBar>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
