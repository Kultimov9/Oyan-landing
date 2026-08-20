<template>
  <div class="join">
    <div class="card">
      <img :src="eye" alt="" class="eye" />
      <h1>{{ t('join.title') }}</h1>
      <p class="sub">{{ t('join.sub') }}</p>

      <div class="code-box">
        <span class="code-label">{{ t('join.codeLabel') }}</span>
        <span class="code">{{ code }}</span>
      </div>

      <a class="btn btn-primary" :href="deepLink">{{ t('join.open') }}</a>
      <button class="btn btn-ghost" @click="copy">
        {{ copied ? t('join.copied') : t('join.copy') }}
      </button>

      <div class="steps">
        <p class="steps-title">{{ t('join.stepsTitle') }}</p>
        <ol>
          <li>{{ t('join.step1') }}</li>
          <li>{{ t('join.step2') }}</li>
          <li>{{ t('join.step3') }}</li>
          <li>{{ t('join.step4') }} <b>{{ code }}</b>.</li>
        </ol>
      </div>

      <router-link to="/" class="home-link">{{ t('join.home') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import eye from '../assets/eye.png'
import { t } from '../i18n'

const route = useRoute()
const code = computed(() => String(route.params.code || ''))
const deepLink = computed(() => `oyan://join/${code.value}`)
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(code.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // буфер недоступен — пользователь может скопировать код глазами
  }
}
</script>

<style scoped>
.join {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
.eye {
  width: 88px;
  height: auto;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 30px rgba(124, 92, 255, 0.35));
}
h1 {
  font-family: 'Sora', sans-serif;
  font-size: 28px;
  margin: 0;
}
.sub {
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 8px;
}
.code-box {
  width: 100%;
  background: #141414;
  border: 1px solid #242424;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
}
.code-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.code {
  font-family: 'Sora', sans-serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #fff;
}
.btn {
  width: 100%;
  border-radius: 14px;
  padding: 15px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: block;
}
.btn-primary {
  background: var(--accent);
  color: var(--bg);
  border: none;
}
.btn-ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--border);
}
.steps {
  width: 100%;
  text-align: left;
  margin-top: 12px;
  background: #101010;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 18px;
}
.steps-title {
  color: var(--text-2);
  font-size: 13px;
  margin: 0 0 8px;
}
.steps ol {
  margin: 0;
  padding-left: 18px;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.7;
}
.steps b {
  color: #fff;
  letter-spacing: 0.08em;
}
.home-link {
  color: var(--muted);
  font-size: 13px;
  text-decoration: none;
  margin-top: 10px;
}
</style>
