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
    <section id="top" class="hero">
      <div class="hero-glow" ref="heroGlow" />
      <div class="wrap hero-inner" ref="heroInner">
        <img :src="eye" alt="Oyan" class="hero-eye" />
        <h1 :key="locale" class="hero-title" v-assemble="80">
          {{ t('hero.line1') }}<br />{{ t('hero.line2') }}<br /><span class="accent">{{
            t('hero.line3')
          }}</span>
        </h1>
        <p class="hero-sub" v-reveal="180">{{ t('hero.sub') }}</p>
        <div class="hero-actions" v-reveal="280">
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
    <section id="features" class="section">
      <div class="wrap">
        <p class="eyebrow" v-reveal>{{ t('features.eyebrow') }}</p>
        <h2 :key="locale" class="section-title" v-assemble="60">
          {{ t('features.title1') }}<br />{{ t('features.title2') }}
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
          <p class="eyebrow" v-reveal:left>{{ t('ai.eyebrow') }}</p>
          <h2 :key="locale" class="section-title" v-assemble="60">
            {{ t('ai.title1') }}<br />{{ t('ai.title2') }}
          </h2>
          <p class="ai-lead" v-reveal:left="140">{{ t('ai.lead') }}</p>
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
            <p class="ai-card-msg" v-reveal:right="300">{{ t('ai.msg') }}</p>
            <div class="ai-card-actions">
              <span class="ai-btn ai-btn-primary" v-reveal:left="420">{{ t('ai.btnPrimary') }}</span>
              <span class="ai-btn ai-btn-ghost" v-reveal="520">{{ t('ai.btnGhost') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS / PROGRESS -->
    <section class="section">
      <div class="wrap">
        <p class="eyebrow" v-reveal>{{ t('stats.eyebrow') }}</p>
        <h2 :key="locale" class="section-title" v-assemble="60">
          {{ t('stats.title1') }}<br />{{ t('stats.title2') }}
        </h2>
        <div class="stats">
          <div class="stat" v-reveal:zoom="60">
            <span class="stat-num" v-countup="7">7</span>
            <span class="stat-label">{{ t('stats.label1') }}</span>
          </div>
          <div class="stat" v-reveal:zoom="150">
            <span :key="locale" class="stat-num" v-countup="5" :data-suffix="t('stats.minSuffix')">
              5{{ t('stats.minSuffix') }}
            </span>
            <span class="stat-label">{{ t('stats.label2') }}</span>
          </div>
          <div class="stat" v-reveal:zoom="240">
            <span class="stat-num">∞</span>
            <span class="stat-label">{{ t('stats.label3') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="get" class="cta">
      <div class="cta-glow" />
      <div class="wrap cta-inner">
        <img :src="eye" alt="" class="cta-eye" v-reveal />
        <h2 :key="locale" class="cta-title" v-assemble="80">{{ t('cta.title') }}</h2>
        <p class="cta-sub" v-reveal="160">{{ t('cta.sub') }}</p>
        <div class="hero-actions" v-reveal="240">
          <span class="btn btn-primary">{{ t('cta.appStore') }}</span>
          <span class="btn btn-ghost">{{ t('cta.googlePlay') }}</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import eye from '../assets/eye.png'
import PhoneJourney from '../components/PhoneJourney.vue'
import LangSwitch from '../components/LangSwitch.vue'
import { t, locale, applyDocumentLocale } from '../i18n'

const year = new Date().getFullYear()

// Иконки не переводятся — берём их отдельно и склеиваем с текстом локали.
const FEATURE_ICONS = ['◆', '✓', '◎', '☾', '▦', '❋']

const features = computed(() =>
  t('features.items').map((f, i) => ({ icon: FEATURE_ICONS[i], title: f.title, text: f.text })),
)

const aiPoints = computed(() => t('ai.points'))

// Направление прилёта карточек: левая колонка — слева, средняя — снизу, правая — справа.
function cardDir(i) {
  return ['left', null, 'right'][i % 3]
}

// --- Параллакс hero ---
const heroGlow = ref(null)
const heroInner = ref(null)
let ticking = false
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
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
  // lang, <title> и description под выбранный язык — важно для SEO и скринридеров.
  applyDocumentLocale()
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
}
</style>
