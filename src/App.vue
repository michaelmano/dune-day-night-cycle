<script setup lang="ts">
import { computed } from 'vue';
import { DayNightCycle } from './classes/DayNightCycle';

const cycle = new DayNightCycle();

const sunMoonPosition = computed(() => {
  return cycle.phase.value === 'day' ? '90deg' : '270deg';
})

const backgroundPosition = computed(() => {
  return `${cycle.backgroundPosition.value}%`;
});

function reset() {
  cycle.stop();
}
</script>

<template>
  <div class="min-h-screen min-w-full bg-slate-800 text-white flex items-center justify-center">
    <div v-if="cycle.isRunning.value">

      <div style="position: relative; width: 500px;">
        <div class="absolute -top-12 left-0 transform translate-x-50">
          <img src="./assets/sun-moon.png" class="w-24 sun-moon">
        </div>
      </div>
      <div class="day-night-bg"></div>
      <div class="flex items-center gap-x-2 justify-end">
        <p class="text-slate-400">Remaining {{ cycle.phase }} time: {{ cycle.timeRemaining }}</p>
      <button
        class="w-4 h-4 mt-1 text-white cursor-pointer"
        title="Clear timer"
        @click="reset"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fill-current">
          <path fill-rule="evenodd" d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667Zm0 42.667c-94.256 0-170.666 76.41-170.666 170.666 0 94.257 76.41 170.667 170.666 170.667 94.257 0 170.667-76.41 170.667-170.667 0-94.256-76.41-170.666-170.667-170.666Zm75.425 65.072 30.17 30.17L286.169 256l75.426 75.425-30.17 30.17L256 286.169l-75.424 75.426-30.17-30.17L225.83 256l-75.424-75.424 30.17-30.17L256 225.83l75.425-75.424Z"/>
        </svg>
      </button>
    </div>
    </div>
    <div v-else class="flex gap-x-4 items-center">
      <p>No cycle running. Start a new one:</p>
      <button
        class="px-4 py-2 bg-amber-600 text-white"
        @click="cycle.start('day')"
      >Start as Day</button>
      <button
        class="px-4 py-2 bg-amber-600 text-white"
        @click="cycle.start('night')"
      >Start as Night</button>
    </div>
  </div>
</template>
<style scoped>
.day-night-bg {
  position: relative;
  width: 500px;
  height: 300px;
  background-image: url('./assets/cycle.png');
  background-size: 1000px 100%;
  background-repeat: repeat-x;
  background-position: v-bind(backgroundPosition);
  z-index: 20;
}
.sun-moon {
  z-index: 10;
  transform: rotate(v-bind(sunMoonPosition));
  transition: all 1s linear;
}
</style>