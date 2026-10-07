<template>
  <!-- У главной свой фон внутри сцен; общий параллакс-фон — для остальных страниц. -->
  <SiteBackground v-if="route.path !== '/'" />
  <router-view />
</template>

<script setup>
import { useRoute } from 'vue-router'
import SiteBackground from './components/SiteBackground.vue'

const route = useRoute()
</script>
