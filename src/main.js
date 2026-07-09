import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { reveal, countup, assemble } from './composables/reveal'
import './style.css'

createApp(App)
  .use(router)
  .directive('reveal', reveal)
  .directive('countup', countup)
  .directive('assemble', assemble)
  .mount('#app')
