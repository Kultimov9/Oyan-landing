<template>
  <div class="reset">
    <div class="card">
      <img :src="eye" alt="" class="eye" />

      <template v-if="done">
        <h1>Пароль обновлён</h1>
        <p class="sub">Вернитесь в приложение Oyan и войдите с новым паролем.</p>
      </template>

      <template v-else-if="!ready">
        <h1>Восстановление пароля</h1>
        <p class="sub">{{ error || 'Проверяем ссылку…' }}</p>
      </template>

      <template v-else>
        <h1>Новый пароль</h1>
        <p class="sub">Придумайте новый пароль для входа.</p>
        <input
          v-model="password"
          type="password"
          class="input"
          placeholder="Новый пароль"
          autocomplete="new-password"
        />
        <input
          v-model="confirm"
          type="password"
          class="input"
          placeholder="Повторите пароль"
          autocomplete="new-password"
        />
        <p v-if="error" class="err">{{ error }}</p>
        <button class="btn" :disabled="loading" @click="submit">
          {{ loading ? 'Сохранение…' : 'Сохранить пароль' }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import eye from '../assets/eye.png'

const ready = ref(false) // получена ли recovery-сессия из ссылки
const done = ref(false)
const loading = ref(false)
const error = ref('')
const password = ref('')
const confirm = ref('')

let sub = null

onMounted(async () => {
  // Событие PASSWORD_RECOVERY приходит, когда supabase распарсил токен из ссылки.
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY' || session) ready.value = true
  })
  sub = data.subscription

  // На случай, если сессия уже установлена к моменту монтирования.
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session) ready.value = true

  // Если через 2.5 с сессии нет — ссылка недействительна или истекла.
  setTimeout(() => {
    if (!ready.value) error.value = 'Ссылка недействительна или устарела. Запросите новую в приложении.'
  }, 2500)
})

onUnmounted(() => sub?.unsubscribe())

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'Пароль должен быть не короче 6 символов'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    const { error: e } = await supabase.auth.updateUser({ password: password.value })
    if (e) throw e
    done.value = true
  } catch (e) {
    error.value = e.message || 'Не удалось обновить пароль'
  }
  loading.value = false
}
</script>

<style scoped>
.reset {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
.eye {
  width: 96px;
  height: auto;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 30px rgba(124, 92, 255, 0.35));
}
h1 {
  font-family: 'Sora', sans-serif;
  font-size: 26px;
  margin: 0;
}
.sub {
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 8px;
}
.input {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  color: var(--text);
  outline: none;
}
.input::placeholder {
  color: var(--muted);
}
.input:focus {
  border-color: #3a3a3a;
}
.err {
  color: #f5f0e8;
  font-size: 13px;
  margin: 0;
}
.btn {
  width: 100%;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 14px;
  padding: 15px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
}
.btn:disabled {
  opacity: 0.6;
}
</style>
