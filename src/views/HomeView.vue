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
          <a href="#features">{{ t('nav.features') }}</a>
          <a href="#ai">{{ t('nav.ai') }}</a>
          <LangSwitch />
          <a href="#get" class="nav-cta">{{ t('nav.try') }}</a>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <section id="top" class="hero" ref="heroEl">
      <div class="hero-glow" />
      <div class="wrap hero-inner">
        <img :src="eye" alt="Oyan" class="hero-eye" />
        <h1 :key="locale" class="hero-title">
          {{ t('hero.line1') }}<br />{{ t('hero.line2') }}<br /><span class="accent">{{
            t('hero.line3')
          }}</span>
        </h1>
        <p class="hero-sub">{{ t('hero.sub') }}</p>
        <div class="hero-actions">
          <a href="#get" class="btn btn-primary">{{ t('hero.start') }}</a>
          <a href="#features" class="btn btn-ghost">{{ t('hero.how') }}</a>
        </div>
      </div>
      <div class="scroll-hint">
        <span>{{ t('hero.scroll') }}</span>
        <div class="scroll-line" />
      </div>
    </section>

    <!-- ПУТЕШЕСТВИЕ ВОКРУГ ОДНОГО ОБЪЕКТА (scroll-driven 3D) -->
    <PhoneJourney />

    <!-- FEATURES -->
    <section id="features" class="section" ref="featuresSectionEl">
      <div class="wrap">
        <p class="eyebrow">{{ t('features.eyebrow') }}</p>
        <h2 class="section-title">
          {{ t('features.title1') }}<br />{{ t('features.title2') }}
        </h2>
        <!-- Карточки двигаются как одна группа от позиции скролла: внутренние
             элементы отдельно не анимируются, иначе на экране слишком много
             независимого движения. -->
        <div class="grid" ref="featuresEl">
          <div v-for="f in features" :key="f.title" class="card">
            <div class="card-icon">{{ f.icon }}</div>
            <h3 class="card-title">{{ f.title }}</h3>
            <p class="card-text">{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AI -->
    <section id="ai" class="section ai-section" ref="aiEl">
      <div class="wrap ai-inner">
        <div class="ai-copy">
          <p class="eyebrow">{{ t('ai.eyebrow') }}</p>
          <h2 class="section-title">{{ t('ai.title1') }}<br />{{ t('ai.title2') }}</h2>
          <p class="ai-lead">{{ t('ai.lead') }}</p>
          <ul class="ai-list">
            <!-- Пункты проявляются по очереди по мере прокрутки: --i задаёт
                 сдвиг очереди, сама очередь считается в CSS от --p. -->
            <li v-for="(a, i) in aiPoints" :key="a" :style="{ '--i': i }">
              <span class="tick">→</span>{{ a }}
            </li>
          </ul>
        </div>
        <div class="ai-card-wrap">
          <div class="ai-card">
            <div class="ai-card-head">
              <img :src="eye" alt="" class="ai-card-eye" />
              <span>OYAN</span>
            </div>
            <p class="ai-card-msg">{{ t('ai.msg') }}</p>
            <div class="ai-card-actions">
              <span class="ai-btn ai-btn-primary">{{ t('ai.btnPrimary') }}</span>
              <span class="ai-btn ai-btn-ghost">{{ t('ai.btnGhost') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS / PROGRESS -->
    <section class="section" ref="statsEl">
      <div class="wrap">
        <p class="eyebrow">{{ t('stats.eyebrow') }}</p>
        <h2 class="section-title">{{ t('stats.title1') }}<br />{{ t('stats.title2') }}</h2>
        <div class="stats">
          <!-- Цифры набегают вместе с прокруткой: крутишь назад — уменьшаются. -->
          <div class="stat" :style="{ '--i': 0 }">
            <span class="stat-num">{{ countTo(7) }}</span>
            <span class="stat-label">{{ t('stats.label1') }}</span>
          </div>
          <div class="stat" :style="{ '--i': 1 }">
            <span class="stat-num">{{ countTo(5) }}{{ t('stats.minSuffix') }}</span>
            <span class="stat-label">{{ t('stats.label2') }}</span>
          </div>
          <div class="stat" :style="{ '--i': 2 }">
            <span class="stat-num">∞</span>
            <span class="stat-label">{{ t('stats.label3') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="get" class="cta" ref="ctaEl">
      <div class="cta-glow" />
      <div class="wrap cta-inner">
        <img :src="eye" alt="" class="cta-eye" />
        <h2 class="cta-title">{{ t('cta.title') }}</h2>
        <p class="cta-sub">{{ t('cta.sub') }}</p>
        <div class="hero-actions">
          <!-- Появилась ссылка — кнопка сама становится ссылкой (см. STORES) -->
          <component
            v-for="store in stores"
            :key="store.key"
            :is="store.url ? 'a' : 'span'"
            :href="store.url || undefined"
            :target="store.url ? '_blank' : undefined"
            rel="noopener"
            class="btn"
            :class="store.primary ? 'btn-primary' : 'btn-ghost'"
          >
            {{ store.url ? t(store.keyReady) : t(store.keySoon) }}
          </component>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="wrap footer-inner">
        <span class="brand-name">OYAN</span>
        <router-link to="/privacy" class="footer-link">{{ t('footer.privacy') }}</router-link>
        <span class="footer-note">© {{ year }} Oyan — {{ t('footer.note') }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import eye from '../assets/eye.png'
import PhoneJourney from '../components/PhoneJourney.vue'
import { useScrollProgress } from '../composables/useScrollProgress'
import LangSwitch from '../components/LangSwitch.vue'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '../lib/links'
import { t, locale, applyDocumentLocale } from '../i18n'

const year = new Date().getFullYear()

// Ссылки на магазины в одном месте: как появится адрес в App Store Connect —
// вписать сюда, и кнопка сама превратится в ссылку с другим текстом.
// Google Play скрыт: Android-сборка пока без пуш-уведомлений и в стор не идёт.
// Чтобы вернуть — снять show: false.
const STORES = [
  {
    key: 'ios',
    url: APP_STORE_URL,
    primary: true,
    keySoon: 'cta.appStore',
    keyReady: 'cta.appStoreReady',
    show: true,
  },
  {
    key: 'android',
    url: GOOGLE_PLAY_URL,
    primary: false,
    keySoon: 'cta.googlePlay',
    keyReady: 'cta.googlePlayReady',
    show: false,
  },
]
const stores = STORES.filter((s) => s.show)

// Иконки не переводятся — берём их отдельно и склеиваем с текстом локали.
const FEATURE_ICONS = ['◆', '✓', '◎', '☾', '▦', '❋', '◈', '⊛', '↺']

const features = computed(() =>
  t('features.items').map((f, i) => ({ icon: FEATURE_ICONS[i], title: f.title, text: f.text })),
)

const aiPoints = computed(() => t('ai.points'))

// --- Параллакс hero ---
// Все секции подключены к одному движку прогресса: он раздаёт долю пройденного
// пути в CSS-переменную --p, а секции двигают содержимое чистым CSS.
// Отдельных слушателей скролла больше нет — раньше их было три.
const heroEl = ref(null)
useScrollProgress(heroEl)

// Прогресс считаем по самой сетке, а не по секции: секция начинается с
// заголовка, и по ней карточки успевали собраться ещё до появления на экране.
const featuresSectionEl = ref(null)
useScrollProgress(featuresSectionEl)

const featuresEl = ref(null)
useScrollProgress(featuresEl)

const aiEl = ref(null)
useScrollProgress(aiEl)

const ctaEl = ref(null)
useScrollProgress(ctaEl)

// Цифрам нужен прогресс числом: текст в CSS не посчитать.
const statsEl = ref(null)
const statsP = ref(0)
useScrollProgress(statsEl, statsP)

// Счётчик набегает на первой половине прохода секции и держится дальше.
function countTo(target) {
  const t = Math.min(1, Math.max(0, (statsP.value - 0.1) / 0.4))
  return Math.round(target * t)
}

onMounted(() => {
  // lang, <title> и description под выбранный язык — важно для SEO и скринридеров.
  applyDocumentLocale()
})
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
  /* Перспектива на контейнере: без неё rotateX даёт плоский сдвиг, а не глубину */
  perspective: 1400px;
  perspective-origin: 50% 40%;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 30px;
  /* Сборка: 0 — карточка ещё в стороне, 1 — на месте. Сетка входит в экран на
     p≈0 и оказывается по центру на p≈0.5, поэтому сборка укладывается в
     0.05–0.45 — она целиком происходит на глазах, а не за кадром. */
  --enter: clamp(0, calc((var(--p, 1) - 0.02) / 0.45), 1);
  /* Сквозной снос: после сборки движение не замирает, поэтому скролл
     туда-обратно всегда что-то двигает. */
  --drift: calc((var(--p, 1) - 0.5) * -60px);
  --x: calc(var(--dx, 0px) * (1 - var(--enter)));
  --y: calc(var(--dy, 40px) * (1 - var(--enter)) + var(--drift));
  --scale: calc(0.82 + 0.18 * var(--enter));
  /* Карточка выходит из глубины: отъезд по Z и наклон выпрямляются к сборке. */
  --z: calc((1 - var(--enter)) * -320px);
  --rot: calc((1 - var(--enter)) * 14deg);
  transform: translate3d(var(--x), calc(var(--y) + var(--lift, 0px)), var(--z))
    rotateX(var(--rot)) scale(var(--scale));
  transform-style: preserve-3d;
  opacity: var(--enter);
  /* transform без transition: движение привязано к скроллу, сглаживание дало бы
     отставание от пальца. Анимируем только transform и opacity. */
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
  will-change: transform, opacity;
}
/* Крайние колонки приезжают с боков, средняя — снизу. */
.card:nth-child(3n + 1) {
  --dx: -190px;
  --dy: 60px;
}
.card:nth-child(3n + 2) {
  --dx: 0px;
  --dy: 150px;
}
.card:nth-child(3n + 3) {
  --dx: 190px;
  --dy: 60px;
}
.card:hover {
  --lift: -4px;
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
  /* В одну колонку боковой разлёт не нужен — карточки приезжают только снизу. */
  .card:nth-child(3n + 1),
  .card:nth-child(3n + 2),
  .card:nth-child(3n + 3) {
    --dx: 0px;
    --dy: 60px;
  }
  .ai-inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .section {
    padding: 90px 0;
  }
}

/* ── Привязка к прокрутке ─────────────────────────────────────────────────
   Каждая секция получает --p (0 — только показалась снизу, 1 — ушла вверх)
   от общего движка. Всё движение ниже — чистая функция от неё, поэтому оно
   обратимо: крутишь назад — элементы едут назад.
   Двигаем только transform и opacity — это не вызывает пересчёт раскладки. */

/* Первый экран уходит вверх, а не входит снизу: на самом верху страницы его
   середина совпадает с серединой экрана, то есть --p уже равен 0.5. Поэтому
   отсчёт ведём от 0.5 — иначе hero был бы скрыт сразу при загрузке. */
.hero-inner {
  --out: clamp(0, calc((var(--p, 0.5) - 0.5) / 0.35), 1);
  transform: translate3d(0, calc(var(--out) * 120px), 0) scale(calc(1 - var(--out) * 0.06));
  opacity: calc(1 - var(--out));
  will-change: transform, opacity;
}
.hero-glow {
  transform: translate(-50%, calc(max(0, var(--p, 0.5) - 0.5) * 420px));
  will-change: transform;
}
.scroll-hint {
  opacity: calc(1 - clamp(0, calc((var(--p, 0.5) - 0.5) / 0.12), 1));
}

/* AI: текст приезжает слева, карточка справа, пункты списка — по очереди. */
.ai-copy {
  --in: clamp(0, calc((var(--p, 1) - 0.05) / 0.4), 1);
  transform: translate3d(calc((1 - var(--in)) * -80px), 0, 0);
  opacity: var(--in);
  will-change: transform, opacity;
}
.ai-card-wrap {
  --in: clamp(0, calc((var(--p, 1) - 0.1) / 0.4), 1);
  perspective: 1200px;
  opacity: var(--in);
  will-change: transform, opacity;
}
.ai-card {
  /* Карточка развёрнута к зрителю и выпрямляется по мере прокрутки. */
  transform: translate3d(calc((1 - var(--in, 1)) * 90px), 0, calc((1 - var(--in, 1)) * -240px))
    rotateY(calc((1 - var(--in, 1)) * -16deg));
}
.ai-list li {
  /* Каждый следующий пункт стартует на 0.06 позже — очередь по прокрутке. */
  --in: clamp(0, calc((var(--p, 1) - 0.18 - var(--i, 0) * 0.06) / 0.16), 1);
  transform: translate3d(calc((1 - var(--in)) * -28px), 0, 0);
  opacity: var(--in);
}

/* Цифры: карточки поднимаются по очереди, значения набегают в шаблоне. */
.stats {
  perspective: 1200px;
}
.stat {
  --in: clamp(0, calc((var(--p, 1) - 0.08 - var(--i, 0) * 0.06) / 0.3), 1);
  transform: translate3d(0, calc((1 - var(--in)) * 60px), calc((1 - var(--in)) * -260px))
    rotateX(calc((1 - var(--in)) * 12deg))
    scale(calc(0.88 + 0.12 * var(--in)));
  opacity: var(--in);
  will-change: transform, opacity;
}

/* Финал: свечение растёт по мере приближения, содержимое поднимается. */
.cta-inner {
  --in: clamp(0, calc((var(--p, 1) - 0.05) / 0.45), 1);
  transform: translate3d(0, calc((1 - var(--in)) * 70px), 0);
  opacity: var(--in);
  will-change: transform, opacity;
}
.cta-glow {
  transform: translate(-50%, 0) scale(calc(0.6 + var(--p, 0) * 0.8));
  opacity: calc(0.3 + var(--p, 0) * 0.7);
}

/* Заголовки секций: лёгкий подъём, чтобы шапка не стояла мёртво. */
.section .eyebrow,
.section .section-title {
  --in: clamp(0, calc((var(--p, 1) - 0.02) / 0.3), 1);
  transform: translate3d(0, calc((1 - var(--in)) * 34px), 0);
  opacity: var(--in);
}
</style>