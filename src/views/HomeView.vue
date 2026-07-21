<template>
  <div class="site">
    <!-- NAV -->
    <header class="nav">
      <div class="wrap nav-inner">
        <a href="#top" class="brand">
          <img :src="eye" alt="" class="brand-eye" />
          <span class="brand-name">OYAN</span>
        </a>
        <nav class="nav-links">
          <a href="#features">Возможности</a>
          <a href="#ai">AI-наставник</a>
          <a href="#get" class="nav-cta">Попробовать</a>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <section id="top" class="hero">
      <div class="hero-glow" ref="heroGlow" />
      <div class="wrap hero-inner" ref="heroInner">
        <img :src="eye" alt="Oyan" class="hero-eye" />
        <h1 class="hero-title" v-assemble="80">
          Проснись.<br />Начни.<br /><span class="accent">Меняйся.</span>
        </h1>
        <p class="hero-sub" v-reveal="180">
          Большие перемены начинаются с одного маленького шага. Oyan ведёт тебя за руку —
          привычки, цели, рефлексия и личный наставник на базе искусственного интеллекта.
        </p>
        <div class="hero-actions" v-reveal="280">
          <a href="#get" class="btn btn-primary">Начать путь</a>
          <a href="#features" class="btn btn-ghost">Как это работает</a>
        </div>
      </div>
      <div class="scroll-hint">
        <span>листай</span>
        <div class="scroll-line" />
      </div>
    </section>

    <!-- SCROLLYTELLING -->
    <section class="scrolly" ref="scrollyEl" :style="{ height: steps.length * 100 + 'vh' }">
      <div class="scrolly-stage">
        <div class="scrolly-rail">
          <span class="scrolly-rail-fill" :style="{ height: progress * 100 + '%' }" />
        </div>
        <div class="wrap">
          <div
            v-for="(s, i) in steps"
            :key="i"
            class="scrolly-step"
            :class="{ active: i === activeStep, past: i < activeStep }"
          >
            <p class="scrolly-index">0{{ i + 1 }} / 0{{ steps.length }}</p>
            <h2 class="scrolly-title" v-assemble>{{ s.title }}</h2>
            <p class="scrolly-sub" v-assemble="250">{{ s.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SHOWCASE (scroll-driven) -->
    <PhoneShowcase />

    <!-- FEATURES -->
    <section id="features" class="section">
      <div class="wrap">
        <p class="eyebrow" v-reveal>Что внутри</p>
        <h2 class="section-title" v-assemble="60">
          Всё, чтобы двигаться<br />маленькими шагами
        </h2>
        <div class="grid">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="card"
            v-reveal:zoom="(i % 3) * 70"
          >
            <div class="card-icon" v-reveal:left="140 + (i % 3) * 70">{{ f.icon }}</div>
            <h3 class="card-title" v-reveal:right="220 + (i % 3) * 70">{{ f.title }}</h3>
            <p class="card-text" v-reveal="300 + (i % 3) * 70">{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AI -->
    <section id="ai" class="section ai-section">
      <div class="wrap ai-inner">
        <div class="ai-copy">
          <p class="eyebrow" v-reveal:left>Личный AI-наставник</p>
          <h2 class="section-title" v-assemble="60">Он знает тебя<br />и зовёт вперёд</h2>
          <p class="ai-lead" v-reveal:left="140">
            В основе — модель Claude от Anthropic. Наставник видит твои привычки, цели и
            настроение, и говорит с тобой как живой человек: тепло, по делу, без давления.
          </p>
          <ul class="ai-list">
            <li v-for="(a, i) in aiPoints" :key="a" v-reveal:left="60 + i * 70">
              <span class="tick">→</span>{{ a }}
            </li>
          </ul>
        </div>
        <div class="ai-card-wrap" v-reveal:right="120">
          <div class="ai-card">
            <div class="ai-card-head" v-reveal:down="200">
              <img :src="eye" alt="" class="ai-card-eye" />
              <span>OYAN</span>
            </div>
            <p class="ai-card-msg" v-reveal:right="300">
              Привет. Вижу, ты уже размялся сегодня — хороший старт. Может, найдёшь пять минут
              почитать, пока настрой ещё с тобой?
            </p>
            <div class="ai-card-actions">
              <span class="ai-btn ai-btn-primary" v-reveal:left="420">Начать 5 минут →</span>
              <span class="ai-btn ai-btn-ghost" v-reveal="520">Не сейчас — напомни вечером</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS / PROGRESS -->
    <section class="section">
      <div class="wrap">
        <p class="eyebrow" v-reveal>Видно каждый шаг</p>
        <h2 class="section-title" v-assemble="60">Прогресс, который<br />хочется продолжать</h2>
        <div class="stats">
          <div class="stat" v-reveal:zoom="60">
            <span class="stat-num" v-countup="7">7</span>
            <span class="stat-label">дней подряд — и привычка закрепляется</span>
          </div>
          <div class="stat" v-reveal:zoom="150">
            <span class="stat-num" v-countup="5" data-suffix=" мин">5 мин</span>
            <span class="stat-label">достаточно, чтобы начать сегодня</span>
          </div>
          <div class="stat" v-reveal:zoom="240">
            <span class="stat-num">∞</span>
            <span class="stat-label">маленьких шагов до большой цели</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="get" class="cta">
      <div class="cta-glow" />
      <div class="wrap cta-inner">
        <img :src="eye" alt="" class="cta-eye" v-reveal />
        <h2 class="cta-title" v-assemble="80">Пора просыпаться</h2>
        <p class="cta-sub" v-reveal="160">
          Один шаг сегодня — и завтрашний ты скажет спасибо.
        </p>
        <div class="hero-actions" v-reveal="240">
          <span class="btn btn-primary">Скоро в App Store</span>
          <span class="btn btn-ghost">Скоро в Google Play</span>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="wrap footer-inner">
        <span class="brand-name">OYAN</span>
        <router-link to="/privacy" class="footer-link">Политика конфиденциальности</router-link>
        <span class="footer-note">© {{ year }} Oyan — меняй жизнь маленькими шагами</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import eye from '../assets/eye.png'
import PhoneShowcase from '../components/PhoneShowcase.vue'

const year = new Date().getFullYear()

const steps = [
  {
    title: 'Ты хочешь изменить жизнь.',
    sub: 'Больше спорта, меньше прокрастинации, новое дело. Желание есть.',
  },
  {
    title: 'Но большие цели пугают.',
    sub: 'Их так много, что не знаешь, с чего начать — и всё откладывается на потом.',
  },
  {
    title: 'Секрет проще, чем кажется.',
    sub: 'Не рывок, а один маленький шаг, который легко сделать прямо сейчас.',
  },
  {
    title: 'Сегодня. Завтра. Каждый день.',
    sub: 'Маленькие шаги складываются в привычку, а привычки — в новую жизнь.',
  },
  {
    title: 'Oyan пройдёт этот путь с тобой.',
    sub: 'Напомнит, поддержит и подскажет — так, будто рядом заботливый наставник.',
  },
]

const features = [
  { icon: '◆', title: 'Привычки', text: 'Трекер с таймером и сериями (streak). Начни дело в один тап и доведи до конца.' },
  { icon: '✓', title: 'Задачи на день', text: 'Короткий список важного на сегодня — без хаоса и бесконечных списков.' },
  { icon: '◎', title: 'Цели по шагам', text: 'Большую цель разбиваешь на шаги с дедлайном и видишь, как приближаешься.' },
  { icon: '☾', title: 'Рефлексия', text: 'Пара минут вечером: настроение, что мешало, короткая заметка о дне.' },
  { icon: '▦', title: 'Прогресс', text: 'Тепловая карта и графики показывают ритм — и мотивируют не бросать.' },
  { icon: '❋', title: 'Умные напоминания', text: 'AI подбирает время и слова под твой день, а не шлёт одинаковые пуши.' },
]

const aiPoints = [
  'Встречает персональным приветствием и зовёт на первый шаг',
  'Отвечает в чате с полным контекстом твоих привычек и целей',
  'Придумывает напоминания под твой день, а не шаблонные',
  'Говорит тепло и коротко, без канцелярита и давления',
]

// Направление прилёта карточек: левая колонка — слева, средняя — снизу, правая — справа.
function cardDir(i) {
  return ['left', null, 'right'][i % 3]
}

// --- Скроллителлинг + параллакс hero ---
const scrollyEl = ref(null)
const heroGlow = ref(null)
const heroInner = ref(null)
const activeStep = ref(0)
const progress = ref(0)
let ticking = false
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const el = scrollyEl.value
    if (el) {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
      progress.value = p
      activeStep.value = Math.min(steps.length - 1, Math.floor(p * steps.length))
    }

    // Параллакс: глоу уплывает медленнее контента, hero мягко тает при уходе вниз.
    if (!reducedMotion) {
      const y = window.scrollY
      if (heroGlow.value) heroGlow.value.style.transform = `translate(-50%, ${y * 0.3}px)`
      if (heroInner.value && y < window.innerHeight) {
        heroInner.value.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.85), 0))
        heroInner.value.style.transform = `translateY(${y * 0.16}px)`
      }
    }
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.site {
  position: relative;
}

/* NAV */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  background: rgba(10, 10, 10, 0.55);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-eye {
  width: 34px;
  height: auto;
}
.brand-name {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  letter-spacing: 0.14em;
  font-size: 15px;
}
.brand-ai {
  color: var(--text-2);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 14px;
  color: var(--text-2);
}
.nav-links a {
  transition: color 0.2s;
}
.nav-links a:hover {
  color: var(--text);
}
.nav-cta {
  color: var(--bg) !important;
  background: var(--accent);
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
}

/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-glow {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 900px;
  max-width: 120vw;
  background: radial-gradient(circle, rgba(245, 240, 232, 0.12) 0%, transparent 60%);
  filter: blur(20px);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  text-align: center;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-eye {
  width: 150px;
  height: auto;
  margin-bottom: 26px;
  filter: drop-shadow(0 0 40px rgba(245, 240, 232, 0.25));
  animation: floaty 6s ease-in-out infinite;
}
@keyframes floaty {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
.hero-title {
  font-size: clamp(44px, 9vw, 92px);
  margin: 18px 0 22px;
}
.hero-title .accent {
  color: var(--accent);
}
.hero-sub {
  max-width: 560px;
  color: var(--text-2);
  font-size: clamp(16px, 2.4vw, 19px);
}
.hero-actions {
  display: flex;
  gap: 14px;
  margin-top: 34px;
  flex-wrap: wrap;
  justify-content: center;
}
.btn {
  padding: 15px 26px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.2s;
  display: inline-block;
}
.btn:active {
  transform: scale(0.97);
}
.btn-primary {
  background: var(--accent);
  color: var(--bg);
}
.btn-ghost {
  border: 1px solid var(--border);
  color: var(--text-2);
}
.btn-ghost:hover {
  color: var(--text);
  border-color: #3a3a3a;
}
.scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}
.scroll-line {
  width: 1px;
  height: 42px;
  background: linear-gradient(var(--muted), transparent);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* SCROLLYTELLING */
.scrolly {
  position: relative;
}
.scrolly-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.scrolly-rail {
  position: absolute;
  left: max(24px, calc((100vw - var(--maxw)) / 2 + 24px));
  top: 28vh;
  bottom: 28vh;
  width: 2px;
  background: var(--border);
  border-radius: 2px;
}
.scrolly-rail-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: height 0.15s linear;
}
.scrolly .wrap {
  position: relative;
  padding-left: 60px;
}
.scrolly-step {
  position: absolute;
  max-width: 720px;
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  pointer-events: none;
}
.scrolly-step.active {
  opacity: 1;
  transform: none;
  position: relative;
}
.scrolly-step.past {
  transform: translateY(-40px);
}
.scrolly-index {
  font-size: 13px;
  letter-spacing: 0.2em;
  color: var(--muted);
  margin-bottom: 20px;
}
.scrolly-title {
  font-size: clamp(34px, 6vw, 68px);
  margin-bottom: 20px;
}
.scrolly-sub {
  font-size: clamp(16px, 2.4vw, 21px);
  color: var(--text-2);
  max-width: 560px;
}

/* SECTIONS */
.section {
  padding: 130px 0;
  border-top: 1px solid var(--border);
}
.section-title {
  font-size: clamp(30px, 5vw, 52px);
  margin: 16px 0 54px;
}

/* FEATURES GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 30px;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: #333;
  background: var(--surface-2);
}
.card-icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--accent);
  font-size: 20px;
  margin-bottom: 20px;
}
.card-title {
  font-size: 20px;
  margin-bottom: 10px;
}
.card-text {
  color: var(--text-2);
  font-size: 15px;
}

/* AI */
.ai-inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 60px;
  align-items: center;
}
.ai-lead {
  color: var(--text-2);
  font-size: 18px;
  margin-bottom: 30px;
  max-width: 480px;
}
.ai-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ai-list li {
  display: flex;
  gap: 12px;
  color: var(--text);
  font-size: 16px;
}
.tick {
  color: var(--accent);
  font-weight: 700;
}
.ai-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.ai-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.ai-card-eye {
  width: 26px;
  height: auto;
}
.ai-card-head span {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--text-2);
}
.ai-card-msg {
  color: #e2e2dc;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 18px;
}
.ai-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ai-btn {
  border-radius: 12px;
  padding: 13px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.ai-btn-primary {
  background: var(--accent);
  color: var(--bg);
}
.ai-btn-ghost {
  border: 1px solid var(--border);
  color: var(--text-2);
  font-weight: 500;
}

/* STATS */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.stat {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 38px 30px;
  background: var(--surface);
}
.stat-num {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 56px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 14px;
}
.stat-label {
  color: var(--text-2);
  font-size: 15px;
}

/* CTA */
.cta {
  position: relative;
  text-align: center;
  padding: 150px 0;
  overflow: hidden;
  border-top: 1px solid var(--border);
}
.cta-glow {
  position: absolute;
  bottom: -30%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  max-width: 130vw;
  background: radial-gradient(circle, rgba(245, 240, 232, 0.1) 0%, transparent 60%);
  pointer-events: none;
}
.cta-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cta-eye {
  width: 90px;
  height: auto;
  margin-bottom: 24px;
  filter: drop-shadow(0 0 30px rgba(245, 240, 232, 0.3));
}
.cta-title {
  font-size: clamp(38px, 7vw, 76px);
  margin-bottom: 16px;
}
.cta-sub {
  color: var(--text-2);
  font-size: 18px;
  margin-bottom: 34px;
}

/* FOOTER */
.footer {
  border-top: 1px solid var(--border);
  padding: 30px 0;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.footer-note {
  color: var(--muted);
  font-size: 13px;
}
.footer-link {
  color: var(--text-2);
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.footer-link:hover {
  color: var(--text);
}

/* RESPONSIVE */
@media (max-width: 860px) {
  .nav-links a:not(.nav-cta) {
    display: none;
  }
  .grid,
  .stats {
    grid-template-columns: 1fr;
  }
  .ai-inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .section {
    padding: 90px 0;
  }
  .scrolly .wrap {
    padding-left: 44px;
  }
}
</style>
