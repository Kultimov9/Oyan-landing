import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import PrivacyView from './views/PrivacyView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/privacy', component: PrivacyView },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
