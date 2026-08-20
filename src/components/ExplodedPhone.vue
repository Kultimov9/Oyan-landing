<template>
  <section class="exploded" ref="root" :style="{ height: SECTION_VH + 'vh' }">
    <div class="stage" :style="{ '--ex': ex, '--intro': intro }">
      <!-- Заголовок: уезжает вверх, когда начинается разбор -->
      <div class="head" :style="{ opacity: headOpacity }">
        <p class="eyebrow">Разбор по слоям</p>
        <h2 class="head-title">Что происходит<br />внутри одного экрана</h2>
      </div>

      <div class="scene">
        <div class="assembly">
          <div
            v-for="(l, i) in layers"
            :key="l.key"
            class="layer"
            :class="l.key"
            :style="{ '--i': i - 2.5, opacity: l.always ? 1 : ex }"
          >
            <!-- Корпус -->
            <div v-if="l.key === 'shell'" class="shell">
              <span class="lens" />
              <span class="lens lens-2" />
            </div>

            <!-- Скриншот приложения -->
            <img v-else-if="l.key === 'screen'" src="/screens/home.png" alt="" class="shot" />

            <!-- Синтетические UI-карточки: «внутренности» -->
            <div v-else-if="l.key === 'habits'" class="plate">
              <div class="row">
                <span class="dot-ic">✓</span>
                <span class="row-name">Зарядка</span>
                <span class="row-streak">🔥 7</span>
              </div>
              <div class="row">
                <span class="dot-ic">✓</span>
                <span class="row-name">Чтение</span>
                <span class="row-streak">🔥 4</span>
              </div>
              <div class="bar"><span class="bar-fill" /></div>
            </div>

            <div v-else-if="l.key === 'pair'" class="plate">
              <div class="pair-row">
                <span class="av">Т</span>
                <span class="av av-2">А</span>
                <span class="pair-name">Бег с другом</span>
              </div>
              <div class="heat">
                <span v-for="n in 14" :key="n" class="cell" :class="{ on: n % 3 !== 0 }" />
              </div>
            </div>

            <div v-else-if="l.key === 'ai'" class="plate ai-plate">
              <p class="ai-msg">Ты уже размялся сегодня. Может, пять минут чтения?</p>
              <span class="ai-pill">Начать 5 минут →</span>
            </div>

            <!-- Стекло сверху -->
            <div v-else class="glass" />
          </div>
        </div>
      </div>

      <!-- Подписи к слоям -->
      <div class="labels">
        <div
          v-for="(l, i) in labelled"
          :key="l.key"
          class="label"
          :style="labelStyle(i)"
        >
          <span class="label-line" />
          <span class="label-text">
            <b>{{ l.title }}</b>
            <i>{{ l.desc }}</i>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Длина секции: телефон держится залипшим почти через всю верхнюю часть страницы.
const SECTION_VH = 760

// Слои от задней крышки к стеклу. always: виден и в собранном виде.
const layers = [
  { key: 'shell', always: true, title: 'Корпус', desc: 'Всё живёт в телефоне' },
  { key: 'screen', always: true, title: 'Экран на сегодня', desc: 'Один шаг, с которого начать' },
  { key: 'habits', title: 'Привычки и серии', desc: 'Отметил — серия растёт' },
  { key: 'pair', title: 'Парные привычки', desc: 'Держитесь вдвоём, видно прогресс друга' },
  { key: 'ai', title: 'AI-наставник', desc: 'Знает контекст и зовёт вперёд' },
  { key: 'glass', title: 'Ничего лишнего', desc: 'Спокойный монохром без шума' },
]
const labelled = layers.filter((l) => l.key !== 'shell' && l.key !== 'glass')

const root = ref(null)
const p = ref(0)
let ticking = false

const clamp = (v) => Math.min(1, Math.max(0, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Появление сборки в начале секции.
const intro = computed(() => easeInOut(clamp(p.value / 0.1)))

// Разбор: раскрывается → держится открытым → собирается обратно.
const ex = computed(() => {
  const v = p.value
  if (v < 0.14) return 0
  if (v < 0.46) return easeInOut(clamp((v - 0.14) / 0.32))
  if (v < 0.78) return 1
  return 1 - easeInOut(clamp((v - 0.78) / 0.18))
})

// Заголовок уходит быстро, чтобы телефон никогда его не перекрывал.
const headOpacity = computed(() => 1 - clamp(ex.value * 4))

// Подписи проявляются по очереди по мере раскрытия.
function labelStyle(i) {
  const start = 0.35 + i * 0.16
  const t = clamp((ex.value - start) / 0.25)
  return {
    opacity: t,
    transform: `translateX(${(1 - t) * -26}px)`,
    pointerEvents: t > 0.5 ? 'auto' : 'none',
  }
}

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
.exploded {
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
  /* Разлёт слоёв по оси Z и вертикальный веер */
  --spread: 220px;
  --lift: 10px;
}

/* Заголовок сверху — тает, когда телефон начинает раскрываться */
.head {
  position: absolute;
  top: clamp(56px, 11vh, 110px);
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 24px;
  transition: opacity 0.2s linear;
}
.head-title {
  font-size: clamp(26px, 4vw, 44px);
  margin-top: 12px;
}

/* 3D-сцена */
.scene {
  perspective: 1600px;
  perspective-origin: 50% 45%;
  /* Пока телефон собран — он ниже заголовка и не наезжает на него */
  transform: translateY(calc(54px * (1 - var(--ex))));
}
.assembly {
  position: relative;
  height: clamp(260px, 46vh, 460px);
  aspect-ratio: 590 / 1280;
  transform-style: preserve-3d;
  /* rotateZ снаружи rotateX — веер раскрывается по диагонали вправо-вверх,
     используя ширину экрана, а не только его высоту. */
  transform: translateY(calc(46px * (1 - var(--intro)) + 52px * var(--ex)))
    rotateZ(calc(47deg * var(--ex))) rotateX(calc(44deg * var(--ex)))
    scale(calc(1 - 0.5 * var(--ex)));
  opacity: var(--intro);
}
.layer {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  /* Каждый слой уезжает вперёд по Z и чуть вверх — получается «веер» */
  transform: translateZ(calc(var(--i) * var(--spread) * var(--ex)))
    translateY(calc(var(--i) * var(--lift) * var(--ex) * -1));
  border-radius: 34px;
  will-change: transform, opacity;
}

/* Корпус */
.shell {
  position: absolute;
  inset: 0;
  border-radius: 38px;
  background: linear-gradient(160deg, #131313, #060606);
  border: 1px solid #2a2a2a;
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.7),
    0 0 70px rgba(245, 240, 232, 0.04);
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

/* Скриншот */
.shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 34px;
  background: var(--bg);
}

/* Внутренние UI-плашки */
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
  backdrop-filter: blur(4px);
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

/* Стекло */
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

/* Подписи справа */
/* Слева: веер уходит вправо-вверх, поэтому левая зона свободна */
.labels {
  position: absolute;
  top: 54%;
  left: clamp(24px, 4vw, 80px);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 26px;
  max-width: 280px;
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

/* Планшет и мобилка: слабее разлёт, подписи под телефоном */
@media (max-width: 1100px) {
  .stage {
    --spread: 100px;
    --lift: 6px;
  }
  .assembly {
    height: clamp(200px, 30vh, 320px);
  }
  .scene {
    transform: translateY(calc(-11vh + 46px * (1 - var(--ex))));
  }
  .labels {
    top: auto;
    bottom: 6vh;
    left: 24px;
    right: 24px;
    transform: none;
    max-width: none;
    gap: 12px;
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
}

/* Без анимаций: собранный телефон, все подписи видны */
@media (prefers-reduced-motion: reduce) {
  .exploded {
    height: auto !important;
  }
  .stage {
    position: relative;
    height: auto;
    padding: 80px 0;
    flex-direction: column;
    gap: 40px;
  }
  .head {
    position: relative;
    top: auto;
    opacity: 1 !important;
  }
  .assembly {
    transform: none;
    opacity: 1;
  }
  .layer {
    transform: none;
  }
  .layer:not(.shell):not(.screen) {
    display: none;
  }
  .labels {
    position: relative;
    inset: auto;
    transform: none;
  }
  .label {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
