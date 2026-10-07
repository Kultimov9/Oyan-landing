<template>
  <!-- Знак Oyan — то же кольцо, что на иконке приложения: дуга с разрывом,
       точка в центре, фиолетовое свечение внутри. Части размечены классами,
       чтобы сцены могли анимировать их по отдельности. -->
  <svg class="oyan-ring" viewBox="0 0 100 100" aria-hidden="true">
    <defs>
      <linearGradient :id="gid" x1="0.12" y1="0.12" x2="0.88" y2="0.88">
        <stop offset="0" stop-color="#7c5cff" />
        <stop offset="1" stop-color="#ce5cff" />
      </linearGradient>
      <radialGradient :id="gid + 'g'">
        <stop offset="0" stop-color="#4e2b7d" stop-opacity="0.95" />
        <stop offset="0.7" stop-color="#2a1647" stop-opacity="0.75" />
        <stop offset="1" stop-color="#1e0f30" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle class="ring-glow" cx="50" cy="50" r="49" :fill="`url(#${gid}g)`" />
    <!-- Полная окружность, начало сверху, по часовой. pathLength=100 — длина
         дуги задаётся в процентах: 83.5 — как на иконке, 100 — замкнутое кольцо. -->
    <path
      class="ring-arc"
      d="M50,10.3 a39.7,39.7 0 1,1 0,79.4 a39.7,39.7 0 1,1 0,-79.4"
      fill="none"
      :stroke="`url(#${gid})`"
      stroke-width="16.5"
      stroke-linecap="round"
      pathLength="100"
      :stroke-dasharray="`${arc} 100`"
    />
    <circle class="ring-dot" cx="50" cy="50" r="8.3" fill="#fff" />
  </svg>
</template>

<script setup>
defineProps({
  // Длина дуги в процентах окружности.
  arc: { type: Number, default: 83.5 },
})

// У каждого экземпляра свой id градиента: одинаковые id в одном документе
// ссылались бы на первый попавшийся.
const gid = `oyan-ring-${++count}`
</script>

<script>
let count = 0
</script>

<style scoped>
.oyan-ring {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
