<!--
 * @Author: yejinliang
 * @Date: 2022-03-24 16:09:04
 * @LastEditTime: 2022-03-28 21:01:56
 * @LastEditors: yejinliang
 * @Description: 
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
const threeWrap = ref();
const vertexshader = `
    varying vec2 vUv;
    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fragmentshader = `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;
    varying vec2 vUv;
    vec4 getTexture( sampler2D texelToLinearTexture ) {
      return texture2D( texelToLinearTexture , vUv );
    }
    void main() {
      gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );
    }
  `;
var scene: THREE.Scene, camera: THREE.PerspectiveCamera | THREE.Camera, controls;
var renderer: THREE.WebGLRenderer;
var ENTIRE_SCENE = 0,
  BLOOM_SCENE = 1;
var bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);
var params = {
  exposure: 1,
  bloomStrength: 5,
  bloomThreshold: 0,
  bloomRadius: 0,
  scene: "Scene with Glow",
};
var darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
var materials = {} as any;
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
onMounted(() => {
  console.log(threeWrap.value)
  console.log(renderer.domElement)
  threeWrap.value.appendChild(renderer.domElement);
})


scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);
controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 1;
controls.maxDistance = 100;
controls.addEventListener("change", render);
scene.add(new THREE.AmbientLight(0x404040));
var renderScene = new RenderPass(scene, camera);
var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
var bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);
var finalPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture },
    },
    vertexShader: vertexshader,
    fragmentShader: fragmentshader,
    defines: {},
  }),
  "baseTexture"
);
finalPass.needsSwap = true;
var finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
window.addEventListener("click", onDocumentMouseClick, false);
// var gui = new GUI();
// gui.add(params, "scene", ["Scene with Glow", "Glow only", "Scene only"]).onChange(function (value) {
//   switch (value) {
//     case "Scene with Glow":
//       bloomComposer.renderToScreen = false;
//       break;
//     case "Glow only":
//       bloomComposer.renderToScreen = true;
//       break;
//     case "Scene only":
//       // nothing to do
//       break;
//   }
//   render();
// });
// var folder = gui.addFolder("Bloom Parameters");
// folder.add(params, "exposure", 0.1, 2).onChange(function (value) {
//   renderer.toneMappingExposure = Math.pow(value, 4.0);
//   render();
// });
// folder.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
//   bloomPass.threshold = Number(value);
//   render();
// });
// folder.add(params, "bloomStrength", 0.0, 10.0).onChange(function (value) {
//   bloomPass.strength = Number(value);
//   render();
// });
// folder
//   .add(params, "bloomRadius", 0.0, 1.0)
//   .step(0.01)
//   .onChange(function (value) {
//     bloomPass.radius = Number(value);
//     render();
//   });
setupScene();
function onDocumentMouseClick(event: { preventDefault: () => void; clientX: number; clientY: number }) {
  debugger
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    var object = intersects[0].object;
    object.layers.toggle(BLOOM_SCENE);
    render();
  }
}
window.onresize = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  (camera as any).aspect = width / height;
  (camera as any).updateProjectionMatrix();
  renderer.setSize(width, height);
  bloomComposer.setSize(width, height);
  finalComposer.setSize(width, height);
  render();
};
function setupScene() {
  scene.traverse(disposeMaterial);
  scene.children.length = 0;
  var geometry = new THREE.IcosahedronBufferGeometry(1, 4);
  for (var i = 0; i < 50; i++) {
    var color = new THREE.Color();
    color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = Math.random() * 10 - 5;
    sphere.position.y = Math.random() * 10 - 5;
    sphere.position.z = Math.random() * 10 - 5;
    sphere.position.normalize().multiplyScalar(Math.random() * 4.0 + 2.0);
    sphere.scale.setScalar(Math.random() * Math.random() + 0.5);
    scene.add(sphere);
    if (Math.random() < 0.25) sphere.layers.enable(BLOOM_SCENE);
  }
  render();
}
function disposeMaterial(obj: any) {
  if (obj.material) {
    obj.material.dispose();
  }
}
function render() {
  switch (params.scene) {
    case "Scene only":
      renderer.render(scene, camera);
      break;
    case "Glow only":
      renderBloom(false);
      break;
    case "Scene with Glow":
    default:
      // render scene with bloom
      renderBloom(true);
      // render the entire scene, then render bloom scene on top
      finalComposer.render();
      break;
  }
}
function renderBloom(mask: Boolean) {
  if (mask === true) {
    scene.traverse(darkenNonBloomed);
    bloomComposer.render();
    scene.traverse(restoreMaterial);
  } else {
    camera.layers.set(BLOOM_SCENE);
    bloomComposer.render();
    camera.layers.set(ENTIRE_SCENE);
  }
}
function darkenNonBloomed(obj: any) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}
function restoreMaterial(obj: any) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}
</script>

<template>
<div id="threeWrap" ref="threeWrap"></div>
</template>

<style scoped></style>
