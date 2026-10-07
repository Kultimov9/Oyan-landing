<template>
  <div class="home" :class="{ 'is-static': isStatic }">
    <!-- Полоски сверху — как у сторис: по одной на сцену, заполняются по мере
         прокрутки. Показывают, сколько «ролика» осталось. -->
    <div class="bars" aria-hidden="true">
      <i v-for="s in SCENES" :key="s.name" class="bar"><b :ref="(el) => (barEls[s.name] = el)" /></i>
    </div>

    <header class="nav">
      <a href="#top" class="brand" @click.prevent="goTo('hero')">
        <span class="brand-mark"><OyanRing /></span>
        <span class="brand-name">OYAN</span>
      </a>
      <nav class="nav-links">
        <a href="#features" class="nav-link" @click.prevent="goTo('reel')">{{ t('nav.features') }}</a>
        <a href="#ai" class="nav-link" @click.prevent="goTo('mentor')">{{ t('nav.ai') }}</a>
        <LangSwitch />
        <StoreButton compact />
      </nav>
    </header>

    <!-- История. Экран (stage) закреплён на всё время, сцены на нём — слоями.
         Длину каждой сцены в прокрутке задаёт её распорка в .track.
         Смена языка пересобирает историю целиком: анимации привязаны к
         элементам с текстом, а текст меняется. -->
    <main :key="locale" ref="storyEl" class="story">
      <div class="stage">
        <SceneHero />
        <SceneFeed />
        <SceneTimer />
        <SceneReel />
        <SceneMentor />
        <SceneFinale :meters="meters" />
      </div>
      <div class="track" aria-hidden="true">
        <div
          v-for="(s, i) in SCENES"
          :id="s.id"
          :key="s.name"
          class="spacer"
          :data-scene="s.name"
          :style="{ height: `calc(${s.len + (i === SCENES.length - 1 ? 100 : 0)} * var(--u))` }"
        />
      </div>
    </main>

    <!-- Счётчик пролистанного: мелкая деталь, которая возвращается в финале. -->
    <p class="odo" :class="{ on: scrolled && !inFinale }" aria-hidden="true">
      {{ t('finale.odoLabel') }} ≈ <b>{{ meters }}</b> {{ t('finale.meter') }}
    </p>

    <footer class="footer">
      <span class="brand-name">OYAN</span>
      <router-link to="/privacy" class="footer-link">{{ t('footer.privacy') }}</router-link>
      <span class="footer-note">© {{ year }} Oyan — {{ t('footer.note') }}</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import OyanRing from '../components/home/OyanRing.vue'
import StoreButton from '../components/home/StoreButton.vue'
import SceneHero from '../components/home/SceneHero.vue'
import SceneFeed from '../components/home/SceneFeed.vue'
import SceneTimer from '../components/home/SceneTimer.vue'
import SceneReel from '../components/home/SceneReel.vue'
import SceneMentor from '../components/home/SceneMentor.vue'
import SceneFinale from '../components/home/SceneFinale.vue'
import LangSwitch from '../components/LangSwitch.vue'
import { ScrollTrigger, motionOff, startStory, stopStory } from '../composables/useStory'
import { t, locale, applyDocumentLocale } from '../i18n'

const year = new Date().getFullYear()
const isStatic = motionOff()

// Сцены по порядку.
//  len   — сколько прокрутки длится сцена, в процентах высоты экрана;
//  id    — якорь её распорки;
//  layer — слой сцены (нужен, когда анимации выключены и распорок нет);
//  enter — доля сцены, на которую приводит ссылка из шапки: в самом начале
//          сцены кадр ещё пустой, содержимое только появляется.
const SCENES = [
  { name: 'hero', id: 'top', layer: '.hero', len: 130, enter: 0 },
  { name: 'feed', id: 'antiscroll', layer: '.feed-scene', len: 340, enter: 0.07 },
  { name: 'timer', id: 'timer', layer: '.timer-scene', len: 300, enter: 0.12 },
  { name: 'reel', id: 'features', layer: '.reel-scene', len: 380, enter: 0.1 },
  { name: 'mentor', id: 'ai', layer: '.mentor-scene', len: 280, enter: 0.12 },
  { name: 'finale', id: 'get', layer: '.finale', len: 140, enter: 1 },
]

const storyEl = ref(null)
const barEls = {}
const meters = ref('0,0')
const scrolled = ref(false)
// В финале то же число стоит в тексте сцены — угловой счётчик там лишний.
const inFinale = ref(false)

// Один CSS-пиксель на телефоне физически мельче, чем на мониторе. Числа
// примерные — поэтому везде стоит «≈».
const MM_PER_PX = window.matchMedia('(pointer: coarse)').matches ? 0.16 : 0.26

let ticking = false
let lastY = window.scrollY
let travelled = 0

function update() {
  ticking = false
  const y = window.scrollY
  const vh = window.innerHeight

  // Одометр считает весь путь пальца, в обе стороны, а не позицию на странице.
  travelled += Math.abs(y - lastY)
  lastY = y
  const m = ((travelled * MM_PER_PX) / 1000).toFixed(1).replace('.', ',')
  if (m !== meters.value) meters.value = m
  if (!scrolled.value && y > 40) scrolled.value = true

  SCENES.forEach((s, i) => {
    const bar = barEls[s.name]
    const spacer = document.getElementById(s.id)
    if (!bar || !spacer) return
    const r = spacer.getBoundingClientRect()
    // У последней распорки лишний экран: история открепляется раньше её конца.
    const span = r.height - (i === SCENES.length - 1 ? vh : 0)
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
    bar.style.transform = `scaleX(${p.toFixed(4)})`
    if (i === SCENES.length - 1 && inFinale.value !== p > 0) inFinale.value = p > 0
  })
}

// Переход к сцене по ссылке. Плавная прокрутка проматывает всё, что по пути, —
// как ускоренная перемотка ролика.
function goTo(name) {
  const i = SCENES.findIndex((s) => s.name === name)
  const scene = SCENES[i]
  if (!scene) return
  let top = 0
  if (isStatic) {
    const el = document.querySelector(scene.layer)
    top = el ? window.scrollY + el.getBoundingClientRect().top : 0
  } else {
    const r = document.getElementById(scene.id).getBoundingClientRect()
    const span = r.height - (i === SCENES.length - 1 ? window.innerHeight : 0)
    top = window.scrollY + r.top + span * scene.enter
  }
  window.scrollTo({ top, behavior: isStatic ? 'auto' : 'smooth' })
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

onMounted(() => {
  // lang, <title> и description под выбранный язык — для SEO и скринридеров.
  applyDocumentLocale()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  // Сцены (дочерние компоненты) к этому моменту уже на странице и сообщили о
  // себе — собираем из них общую шкалу.
  startStory(storyEl.value, SCENES)
  update()
  // Ссылка извне сразу на сцену (oyan…/#features): открываем её в том кадре,
  // где уже есть на что смотреть.
  const linked = SCENES.find((s) => s.id === window.location.hash.slice(1))
  if (linked && linked.name !== 'hero') requestAnimationFrame(() => goTo(linked.name))
})

onUnmounted(() => {
  stopStory()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

// Смена языка пересоздаёт сцены (см. :key в разметке) — собираем шкалу заново
// из новых элементов и ставим её на текущую позицию прокрутки.
watch(locale, async () => {
  await nextTick()
  startStory(storyEl.value, SCENES)
  ScrollTrigger.refresh()
  update()
})
</script>

<style scoped>
.home {
  /* Палитра снята с иконки приложения: фиолетово-чёрный фон, дуга от
     фиолетового к пурпурному. Кремовый — цвет интерфейса самого Oyan. */
  --ink: #0b0612;
  --cream: #f5f0e8;
  --cream-2: #a9a2b2;
  --cream-3: #6f6779;
  --violet: #7c5cff;
  --violet-2: #a98bff;
  --magenta: #ce5cff;
  --line: rgba(245, 240, 232, 0.12);
  --font-display: 'Unbounded', 'Inter', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  /* Единица длины сцен: высота экрана. svh, а не vh: на iPhone vh прыгает,
     когда прячется адресная строка. */
  --u: 1vh;
  position: relative;
  background: var(--ink);
  color: var(--cream);
  font-family: var(--font-body);
}
@supports (height: 1svh) {
  .home {
    --u: 1svh;
  }
}

/* ── История ── */
.story {
  position: relative;
}
.stage {
  position: sticky;
  top: 0;
  height: calc(100 * var(--u));
  overflow: hidden;
}
.track {
  position: relative;
  /* Распорки начинаются от верха истории, под закреплённым экраном. */
  margin-top: calc(-100 * var(--u));
  pointer-events: none;
}
.stage :deep(.layer) {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: var(--ink);
}
/* До сборки шкалы слои скрыты, чтобы не мелькнуть стопкой друг на друге. */
.home:not(.is-static) .stage :deep(.layer) {
  visibility: hidden;
}
/* Заливка «окна» между сценами — см. useStory. */
.stage :deep(.portal-veil) {
  position: absolute;
  inset: 0;
  z-index: 40;
  opacity: 0;
  pointer-events: none;
}
.stage :deep(.eyebrow) {
  color: var(--violet-2);
  letter-spacing: 0.2em;
}

/* ── Полоски сцен ── */
.bars {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  display: flex;
  gap: 4px;
  padding: calc(env(safe-area-inset-top) + 8px) 12px 0;
  pointer-events: none;
}
.bar {
  flex: 1;
  height: 2px;
  border-radius: 2px;
  background: rgba(245, 240, 232, 0.2);
  overflow: hidden;
}
.bar b {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--cream);
  transform: scaleX(0);
  transform-origin: left;
}

/* ── Шапка ── */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: calc(env(safe-area-inset-top) + 20px) 16px 18px;
  /* Затемнение вместо плашки: шапка не отрезает сцену, а растворяется в ней. */
  background: linear-gradient(rgba(11, 6, 18, 0.82), rgba(11, 6, 18, 0));
  pointer-events: none;
}
.nav > * {
  pointer-events: auto;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
}
.brand-mark {
  width: 28px;
  height: 28px;
}
.brand-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.16em;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-link {
  display: none;
  font-size: 14px;
  color: var(--cream-2);
  transition: color 0.2s;
}
.nav-link:hover {
  color: var(--cream);
}

/* ── Счётчик пролистанного ── */
.odo {
  position: fixed;
  left: 16px;
  bottom: calc(env(safe-area-inset-bottom) + 12px);
  z-index: 40;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--cream-3);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}
.odo.on {
  opacity: 1;
}
.odo b {
  color: var(--cream-2);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* ── Подвал ── */
.footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px 24px;
  flex-wrap: wrap;
  padding: 28px 24px calc(env(safe-area-inset-bottom) + 44px);
  border-top: 1px solid var(--line);
  background: var(--ink);
}
.footer-link {
  color: var(--cream-2);
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.footer-link:hover {
  color: var(--cream);
}
.footer-note {
  color: var(--cream-3);
  font-size: 13px;
}

/* На самых узких телефонах слово OYAN не помещается рядом с кнопкой — остаётся знак. */
@media (max-width: 359px) {
  .nav .brand-name {
    display: none;
  }
}

@media (min-width: 900px) {
  .nav {
    padding-left: 32px;
    padding-right: 32px;
  }
  .nav-links {
    gap: 22px;
  }
  .nav-link {
    display: block;
  }
  .footer {
    padding-left: 48px;
    padding-right: 48px;
  }
  .odo {
    left: 32px;
  }
}

/* ── Без анимаций ──
   Сцены идут обычной страницей, одна под другой, в своих финальных кадрах. */
.is-static .stage {
  position: static;
  height: auto;
  overflow: visible;
}
.is-static .track,
.is-static .bars,
.is-static .odo {
  display: none;
}
.is-static .stage :deep(.layer) {
  position: relative;
  inset: auto;
}
/* Первый и последний экран — в полный рост, остальные по содержимому. */
.is-static .stage :deep(.hero),
.is-static .stage :deep(.finale) {
  min-height: calc(100 * var(--u));
}
</style>
