<template>
  <section class="journey" ref="root" :style="{ height: SECTION_VH + 'vh' }">
    <div class="stage" :style="stageVars">
      <!-- Фон: меняет настроение от главы к главе -->
      <div class="bg" />
      <div class="bokeh">
        <span v-for="d in DOTS" :key="d.i" class="dot" :style="d.style" />
      </div>

      <!-- Текст глав (кроме разбора — там подписи к слоям) -->
      <div class="copy">
        <div
          v-for="(c, i) in chapters"
          :key="i"
          class="chapter"
          :style="chapterStyle(c)"
        >
          <p class="ch-index">0{{ i + 1 }}</p>
          <h2 class="ch-title">{{ c.title }}</h2>
          <p class="ch-sub">{{ c.sub }}</p>
        </div>
      </div>

      <!-- Объект: телефон -->
      <div class="scene">
        <div class="assembly">
          <div
            v-for="(l, i) in layers"
            :key="l.key"
            class="layer"
            :class="l.key"
            :style="{ '--i': i - 2.5, opacity: l.always ? 1 : 'var(--ex)' }"
          >
            <div v-if="l.key === 'shell'" class="shell">
              <span class="lens" />
              <span class="lens lens-2" />
            </div>

            <!-- Экран: скриншоты сменяются по мере поворота -->
            <div v-else-if="l.key === 'screen'" class="screen">
              <img
                v-for="(s, si) in SHOTS"
                :key="s"
                :src="s"
                alt=""
                class="shot"
                :style="{ opacity: shotOpacity(si) }"
              />
            </div>

            <div v-else-if="l.key === 'habits'" class="plate">
              <div class="row">
                <span class="dot-ic">✓</span>
                <span class="row-name">{{ t('journey.plate.habit1') }}</span>
                <span class="row-streak">🔥 7</span>
              </div>
              <div class="row">
                <span class="dot-ic">✓</span>
                <span class="row-name">{{ t('journey.plate.habit2') }}</span>
                <span class="row-streak">🔥 4</span>
              </div>
              <div class="bar"><span class="bar-fill" /></div>
            </div>

            <div v-else-if="l.key === 'pair'" class="plate">
              <div class="pair-row">
                <span class="av">Т</span><span class="av av-2">А</span>
                <span class="pair-name">{{ t('journey.plate.pairName') }}</span>
              </div>
              <div class="heat">
                <span v-for="n in 14" :key="n" class="cell" :class="{ on: n % 3 !== 0 }" />
              </div>
            </div>

            <div v-else-if="l.key === 'ai'" class="plate ai-plate">
              <p class="ai-msg">{{ t('journey.plate.aiMsg') }}</p>
              <span class="ai-pill">{{ t('journey.plate.aiPill') }}</span>
            </div>

            <div v-else class="glass" />
          </div>
        </div>
      </div>

      <!-- Подписи к слоям (только на главе «разбор») -->
      <div class="labels">
        <div v-for="(l, i) in labelled" :key="l.key" class="label" :style="labelStyle(i)">
          <span class="label-line" />
          <span class="label-text"><b>{{ l.title }}</b><i>{{ l.desc }}</i></span>
        </div>
      </div>

      <!-- Финал: камера залетела внутрь экрана — интерфейс во весь экран -->
      <div class="inside" :style="{ opacity: inside, pointerEvents: inside > 0.5 ? 'auto' : 'none' }">
        <div class="inside-inner">
          <p class="eyebrow">{{ t('journey.inside.eyebrow') }}</p>
          <h2 class="inside-title">
            {{ t('journey.inside.title1') }}<br />{{ t('journey.inside.title2') }}
          </h2>
          <div class="inside-grid">
            <div v-for="(c, i) in insideCards" :key="c.title" class="in-card">
              <span class="in-ic">{{ INSIDE_ICONS[i] }}</span>
              <b>{{ c.title }}</b>
              <i>{{ c.text }}</i>
            </div>
          </div>
          <a href="#get" class="in-cta">{{ t('journey.inside.cta') }}</a>
        </div>
      </div>

      <!-- Прогресс путешествия -->
      <div class="rail"><span class="rail-fill" :style="{ height: p * 100 + '%' }" /></div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { t } from '../i18n'

// Путешествие занимает несколько экранов подряд — телефон всё это время на сцене.
const SECTION_VH = 820

const SHOTS = ['/screens/home.png', '/screens/habits.png', '/screens/progress.png', '/screens/ai.png']

const LAYER_KEYS = [
  { key: 'shell', always: true },
  { key: 'screen', always: true },
  { key: 'habits' },
  { key: 'pair' },
  { key: 'ai' },
  { key: 'glass' },
]

const layers = computed(() =>
  LAYER_KEYS.map((l) => ({
    ...l,
    title: t(`journey.layers.${l.key}.title`),
    desc: t(`journey.layers.${l.key}.desc`),
  })),
)
const labelled = computed(() =>
  layers.value.filter((l) => l.key !== 'shell' && l.key !== 'glass'),
)

// Ключевые кадры «камеры». Между ними значения интерполируются.
// ex — разбор на слои, sc — масштаб (>1 = камера залетает внутрь экрана).
const KEYS = [
  { p: 0.0, rotY: -20, rotX: 5, rotZ: 0, sc: 0.88, ex: 0, ty: 34 },
  { p: 0.1, rotY: 0, rotX: 0, rotZ: 0, sc: 1, ex: 0, ty: 0 },
  { p: 0.22, rotY: -34, rotX: 8, rotZ: 0, sc: 1.02, ex: 0, ty: 0 },
  { p: 0.34, rotY: 0, rotX: 0, rotZ: 0, sc: 1, ex: 0, ty: 0 },
  { p: 0.5, rotY: 0, rotX: 44, rotZ: 47, sc: 0.5, ex: 1, ty: 52 },
  { p: 0.62, rotY: 0, rotX: 44, rotZ: 47, sc: 0.5, ex: 1, ty: 52 },
  { p: 0.74, rotY: 0, rotX: 0, rotZ: 0, sc: 1, ex: 0, ty: 0 },
  { p: 0.9, rotY: 0, rotX: 0, rotZ: 0, sc: 5.2, ex: 0, ty: 0 },
  { p: 1.0, rotY: 0, rotX: 0, rotZ: 0, sc: 5.2, ex: 0, ty: 0 },
]

// Отрезки скролла для глав — текст берётся из локали по тому же порядку.
const CHAPTER_RANGES = [
  { from: 0.0, to: 0.15 },
  { from: 0.17, to: 0.29 },
  { from: 0.31, to: 0.41 },
  { from: 0.64, to: 0.78 },
]

const chapters = computed(() =>
  CHAPTER_RANGES.map((r, i) => ({ ...r, ...t('journey.chapters')[i] })),
)

const INSIDE_ICONS = ['◆', '❋', '▦']
const insideCards = computed(() => t('journey.inside.cards'))

const root = ref(null)
const p = ref(0)
let ticking = false

const clamp = (v) => Math.min(1, Math.max(0, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Состояние «камеры» на текущем прогрессе — линейная интерполяция ключевых кадров.
const cam = computed(() => {
  const v = p.value
  let a = KEYS[0]
  let b = KEYS[KEYS.length - 1]
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (v >= KEYS[i].p && v <= KEYS[i + 1].p) {
      a = KEYS[i]
      b = KEYS[i + 1]
      break
    }
  }
  const span = b.p - a.p
  const t = span > 0 ? easeInOut(clamp((v - a.p) / span)) : 0
  const mix = (k) => a[k] + (b[k] - a[k]) * t
  return { rotY: mix('rotY'), rotX: mix('rotX'), rotZ: mix('rotZ'), sc: mix('sc'), ex: mix('ex'), ty: mix('ty') }
})

// Когда камера «внутри» экрана — показываем чёткий интерфейс вместо растянутого скриншота.
const inside = computed(() => clamp((cam.value.sc - 2.2) / 1.6))

const stageVars = computed(() => ({
  '--rot-y': cam.value.rotY + 'deg',
  '--rot-x': cam.value.rotX + 'deg',
  '--rot-z': cam.value.rotZ + 'deg',
  '--sc': cam.value.sc,
  '--ex': cam.value.ex,
  '--ty': cam.value.ty + 'px',
  '--p': p.value,
  '--phone-fade': 1 - inside.value,
}))

// Скриншот на экране меняется по мере поворота телефона.
function shotOpacity(i) {
  const stops = [0.06, 0.22, 0.34, 0.46]
  const cur = stops.reduce((acc, s, idx) => (p.value >= s ? idx : acc), 0)
  return i === cur ? 1 : 0
}

function chapterStyle(c) {
  const inT = clamp((p.value - c.from) / 0.05)
  const outT = 1 - clamp((p.value - (c.to - 0.05)) / 0.05)
  const t = Math.min(inT, outT)
  return { opacity: t, transform: `translateY(${(1 - t) * 22}px)` }
}

function labelStyle(i) {
  const start = 0.35 + i * 0.16
  const t = clamp((cam.value.ex - start) / 0.25)
  return { opacity: t, transform: `translateX(${(1 - t) * -26}px)` }
}

// Боке на фоне — лёгкая глубина, как в референсе.
const DOTS = Array.from({ length: 18 }, (_, i) => {
  const size = 4 + ((i * 37) % 9)
  return {
    i,
    style: {
      left: ((i * 53) % 100) + '%',
      top: ((i * 29) % 100) + '%',
      width: size + 'px',
      height: size + 'px',
      opacity: 0.05 + ((i * 13) % 10) / 60,
      '--depth': 0.3 + ((i * 7) % 10) / 12,
    },
  }
})

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const el = root.value
    if (el) {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      p.value = total > 0 ? clamp(-rect.top / total) : 0
    }
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped>
.journey {
  position: relative;
  border-top: 1px solid var(--border);
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  --spread: 220px;
  --lift: 10px;
}

/* Фон меняет настроение по ходу путешествия */
/* Прозрачный базовый цвет — сквозь сцену виден общий фон сайта */
.bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    120% 80% at 70% calc(20% + var(--p) * 40%),
    rgba(245, 240, 232, calc(0.05 + var(--p) * 0.05)),
    transparent 60%
  );
}
.bokeh {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.dot {
  position: absolute;
  border-radius: 50%;
  background: var(--accent);
  filter: blur(1px);
  transform: translateY(calc(var(--p) * -260px * var(--depth)));
}

/* Текст глав — снизу слева, как в референсе */
.copy {
  position: absolute;
  left: clamp(24px, 5vw, 90px);
  bottom: clamp(60px, 12vh, 130px);
  width: min(420px, 42vw);
  z-index: 3;
}
.chapter {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  will-change: opacity, transform;
}
.ch-index {
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 10px;
}
.ch-title {
  font-size: clamp(26px, 3.6vw, 44px);
  margin-bottom: 12px;
}
.ch-sub {
  font-size: clamp(15px, 1.5vw, 18px);
  color: var(--text-2);
}

/* Сцена */
.scene {
  perspective: 1600px;
  perspective-origin: 50% 45%;
  opacity: var(--phone-fade);
}
.assembly {
  position: relative;
  height: clamp(260px, 46vh, 460px);
  aspect-ratio: 590 / 1280;
  transform-style: preserve-3d;
  /* rotateZ снаружи rotateX — веер раскрывается по диагонали, в ширину экрана */
  transform: translateY(var(--ty)) rotateZ(var(--rot-z)) rotateX(var(--rot-x))
    rotateY(var(--rot-y)) scale(var(--sc));
}
.layer {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--i) * var(--spread) * var(--ex)))
    translateY(calc(var(--i) * var(--lift) * var(--ex) * -1));
  border-radius: 34px;
  will-change: transform, opacity;
}

.shell {
  position: absolute;
  inset: 0;
  border-radius: 38px;
  background: linear-gradient(160deg, #131313, #060606);
  border: 1px solid #2a2a2a;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7), 0 0 70px rgba(245, 240, 232, 0.04);
}
.lens {
  position: absolute;
  top: 22px;
  left: 24px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0a0a0a;
  border: 1px solid #2f2f2f;
}
.lens-2 {
  top: 54px;
  left: 30px;
  width: 16px;
  height: 16px;
}
.screen {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  overflow: hidden;
  background: var(--bg);
}
.shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.6s ease;
}

.plate {
  position: absolute;
  inset: 12% 8%;
  border-radius: 20px;
  background: rgba(20, 20, 20, 0.94);
  border: 1px solid #2e2e2e;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text);
}
.dot-ic {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  color: #0a0a0a;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.row-name {
  flex: 1;
}
.row-streak {
  color: var(--text-2);
  font-size: 11px;
}
.bar {
  height: 6px;
  border-radius: 999px;
  background: #242424;
  overflow: hidden;
}
.bar-fill {
  display: block;
  width: 68%;
  height: 100%;
  background: var(--accent);
}
.pair-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2a2a2a;
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.av-2 {
  margin-left: -10px;
  background: var(--accent);
  color: #0a0a0a;
}
.pair-name {
  margin-left: 6px;
  color: var(--text);
}
.heat {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cell {
  aspect-ratio: 1;
  border-radius: 3px;
  background: #222;
}
.cell.on {
  background: var(--accent);
  opacity: 0.85;
}
.ai-plate {
  gap: 12px;
}
.ai-msg {
  font-size: 12px;
  line-height: 1.45;
  color: var(--text);
}
.ai-pill {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 600;
  color: #0a0a0a;
  background: var(--accent);
  padding: 6px 12px;
  border-radius: 999px;
}
.glass {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  background: linear-gradient(
    135deg,
    rgba(245, 240, 232, 0.14),
    rgba(245, 240, 232, 0.02) 42%,
    rgba(245, 240, 232, 0.08)
  );
  border: 1px solid rgba(245, 240, 232, 0.16);
}

/* Подписи к слоям — слева, веер уходит вправо-вверх */
.labels {
  position: absolute;
  top: 46%;
  left: clamp(24px, 4vw, 80px);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 280px;
  z-index: 3;
}
.label {
  display: flex;
  align-items: center;
  gap: 12px;
  will-change: opacity, transform;
}
.label-line {
  width: 26px;
  height: 1px;
  background: var(--border);
  flex-shrink: 0;
}
.label-text b {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}
.label-text i {
  display: block;
  font-style: normal;
  font-size: 13px;
  color: var(--text-2);
  margin-top: 2px;
}

/* Камера внутри экрана */
.inside {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(13, 13, 13, 0.97), rgba(10, 10, 10, 0.99));
  z-index: 4;
  will-change: opacity;
}
.inside-inner {
  width: min(var(--maxw), 100%);
  padding: 0 24px;
  text-align: center;
}
.inside-title {
  font-size: clamp(28px, 4.4vw, 52px);
  margin: 12px 0 34px;
}
.inside-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: left;
}
.in-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
}
.in-ic {
  display: block;
  font-size: 20px;
  color: var(--accent);
  margin-bottom: 12px;
}
.in-card b {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  margin-bottom: 8px;
}
.in-card i {
  font-style: normal;
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.5;
}
.in-cta {
  display: inline-block;
  margin-top: 32px;
  background: var(--accent);
  color: #0a0a0a;
  font-weight: 600;
  padding: 14px 30px;
  border-radius: 999px;
}

.rail {
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 140px;
  background: var(--border);
  border-radius: 2px;
  z-index: 5;
}
.rail-fill {
  display: block;
  width: 100%;
  background: var(--accent);
  border-radius: 2px;
}

@media (max-width: 1100px) {
  .stage {
    --spread: 100px;
    --lift: 6px;
  }
  .assembly {
    height: clamp(200px, 30vh, 320px);
  }
  .scene {
    transform: translateY(-11vh);
  }
  .copy {
    width: auto;
    right: clamp(24px, 5vw, 90px);
    bottom: clamp(40px, 7vh, 80px);
  }
  .labels {
    top: auto;
    bottom: 5vh;
    left: 24px;
    right: 24px;
    max-width: none;
    transform: none;
    gap: 10px;
  }
  .label-line {
    width: 14px;
  }
  .label-text b {
    font-size: 13px;
  }
  .label-text i {
    font-size: 12px;
  }
  .inside-grid {
    grid-template-columns: 1fr;
  }
  .rail {
    display: none;
  }
}

/* Без анимаций — статичная сцена, весь текст на месте */
@media (prefers-reduced-motion: reduce) {
  .journey {
    height: auto !important;
  }
  .stage {
    position: relative;
    height: auto;
    flex-direction: column;
    padding: 80px 24px;
    gap: 40px;
  }
  .scene {
    opacity: 1;
    transform: none;
  }
  .assembly {
    transform: none;
  }
  .layer {
    transform: none;
  }
  .layer:not(.shell):not(.screen) {
    display: none;
  }
  .copy,
  .labels,
  .inside {
    position: relative;
    inset: auto;
    transform: none;
    width: auto;
    max-width: none;
  }
  .chapter {
    position: relative;
    opacity: 1 !important;
    transform: none !important;
    margin-bottom: 28px;
  }
  .label {
    opacity: 1 !important;
    transform: none !important;
  }
  .inside {
    opacity: 1 !important;
  }
  .bokeh,
  .rail {
    display: none;
  }
}
</style>
