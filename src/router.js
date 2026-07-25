import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import PrivacyView from './views/PrivacyView.vue'
import ResetPasswordView from './views/ResetPasswordView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/privacy', component: PrivacyView },
    { path: '/reset-password', component: ResetPasswordView },
  ],
  scrollBehavior(to) {
    // Хэш от recovery-ссылки (#access_token=…) — не якорь для скролла, пропускаем.
    if (to.hash && !to.hash.includes('=')) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
