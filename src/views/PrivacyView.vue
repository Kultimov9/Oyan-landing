<template>
  <div class="privacy">
    <header class="p-nav">
      <div class="wrap p-nav-inner">
        <router-link to="/" class="p-brand">
          <img :src="eye" alt="" class="p-eye" />
          <span class="p-name">OYAN<span class="p-ai"> AI</span></span>
        </router-link>
        <div class="lang">
          <button class="lang-btn" :class="{ on: lang === 'ru' }" @click="lang = 'ru'">РУС</button>
          <button class="lang-btn" :class="{ on: lang === 'en' }" @click="lang = 'en'">ENG</button>
        </div>
      </div>
    </header>

    <main class="wrap p-body">
      <!-- РУССКАЯ ВЕРСИЯ -->
      <article v-if="lang === 'ru'">
        <h1>Политика конфиденциальности</h1>
        <p class="updated">Обновлено: 4 июля 2026</p>

        <p>
          Oyan AI — приложение для привычек и продуктивности. Мы собираем только те данные,
          которые нужны для работы приложения, и бережно к ним относимся.
        </p>

        <h2>Какие данные мы собираем</h2>
        <ul>
          <li><strong>Email</strong> — для создания аккаунта и входа в приложение.</li>
          <li>
            <strong>Данные привычек и задач</strong> — привычки, задачи, цели и рефлексии,
            которые вы создаёте в приложении, а также отметки об их выполнении.
          </li>
          <li>
            <strong>События входа</strong> — дата и время открытия приложения, чтобы понимать,
            как используется продукт, и делать его лучше.
          </li>
        </ul>

        <h2>Где хранятся данные</h2>
        <p>
          Все данные хранятся в защищённой облачной базе данных
          <a href="https://supabase.com" target="_blank" rel="noopener">Supabase</a>.
          Доступ к вашим данным есть только у вас — через ваш аккаунт.
        </p>

        <h2>AI-функции</h2>
        <p>
          Для персональных советов и напоминаний приложение отправляет обезличенный контекст
          (названия привычек, задач и целей) в API Anthropic (Claude). Эти данные используются
          только для генерации ответа и не применяются для обучения моделей.
        </p>

        <h2>Мы не продаём ваши данные</h2>
        <p>
          Мы не продаём и не передаём ваши персональные данные третьим лицам. Данные не
          используются для рекламы.
        </p>

        <h2>Удаление данных</h2>
        <p>
          Вы можете запросить полное удаление аккаунта и всех связанных данных — просто напишите
          нам.
        </p>

        <h2>Контакт</h2>
        <p>
          По любым вопросам о данных и приватности:
          <a href="mailto:kultimov@mail.kz">kultimov@mail.kz</a>
        </p>
      </article>

      <!-- ENGLISH VERSION -->
      <article v-else>
        <h1>Privacy Policy</h1>
        <p class="updated">Last updated: July 4, 2026</p>

        <p>
          Oyan AI is a habit and productivity app. We collect only the data required for the app
          to work, and we treat it with care.
        </p>

        <h2>What data we collect</h2>
        <ul>
          <li><strong>Email</strong> — to create your account and sign you in.</li>
          <li>
            <strong>Habit and task data</strong> — the habits, tasks, goals and reflections you
            create in the app, along with their completion records.
          </li>
          <li>
            <strong>Login events</strong> — the date and time the app is opened, so we can
            understand product usage and improve it.
          </li>
        </ul>

        <h2>Where your data is stored</h2>
        <p>
          All data is stored in a secure cloud database provided by
          <a href="https://supabase.com" target="_blank" rel="noopener">Supabase</a>.
          Only you can access your data — through your account.
        </p>

        <h2>AI features</h2>
        <p>
          To provide personal coaching and reminders, the app sends anonymized context (names of
          your habits, tasks and goals) to the Anthropic API (Claude). This data is used only to
          generate a response and is not used to train models.
        </p>

        <h2>We do not sell your data</h2>
        <p>
          We do not sell or share your personal data with third parties. Your data is not used
          for advertising.
        </p>

        <h2>Data deletion</h2>
        <p>
          You can request complete deletion of your account and all associated data — just
          contact us.
        </p>

        <h2>Contact</h2>
        <p>
          For any questions about data and privacy:
          <a href="mailto:kultimov@mail.kz">kultimov@mail.kz</a>
        </p>
      </article>

      <router-link to="/" class="back">← {{ lang === 'ru' ? 'На главную' : 'Back to home' }}</router-link>
    </main>

    <footer class="p-footer">
      <div class="wrap">
        <span class="p-note">© {{ year }} Oyan AI</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import eye from '../assets/eye.png'

const lang = ref('ru')
const year = new Date().getFullYear()
</script>

<style scoped>
.privacy {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.p-nav {
  border-bottom: 1px solid var(--border);
}
.p-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.p-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.p-eye {
  width: 34px;
  height: auto;
}
.p-name {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  letter-spacing: 0.14em;
  font-size: 15px;
}
.p-ai {
  color: var(--text-2);
}
.lang {
  display: flex;
  gap: 6px;
}
.lang-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-2);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-btn.on {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}

.p-body {
  flex: 1;
  max-width: 760px;
  padding-top: 56px;
  padding-bottom: 80px;
}
h1 {
  font-size: clamp(30px, 5vw, 44px);
  margin-bottom: 10px;
}
.updated {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 28px;
}
h2 {
  font-size: 20px;
  margin: 34px 0 12px;
}
p {
  color: var(--text-2);
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 12px;
}
ul {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;
}
li {
  color: var(--text-2);
  font-size: 16px;
  line-height: 1.7;
}
strong {
  color: var(--text);
  font-weight: 600;
}
a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.back {
  display: inline-block;
  margin-top: 44px;
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  transition: border-color 0.2s;
}
.back:hover {
  border-color: #3a3a3a;
}

.p-footer {
  border-top: 1px solid var(--border);
  padding: 24px 0;
}
.p-note {
  color: var(--muted);
  font-size: 13px;
}
</style>
