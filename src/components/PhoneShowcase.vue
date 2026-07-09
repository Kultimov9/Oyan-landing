<template>
  <section class="showcase" ref="root" :style="{ height: screens.length * 100 + 'vh' }">
    <div class="stage">
      <div class="wrap stage-inner">
        <!-- Левая колонка: меняющийся текст -->
        <div class="copy">
          <p class="eyebrow">Загляни внутрь</p>
          <p class="counter">0{{ active + 1 }} <span>/ 0{{ screens.length }}</span></p>
          <Transition name="swap" mode="out-in">
            <div :key="active" class="copy-body">
              <h2 class="copy-title" v-assemble>{{ screens[active].title }}</h2>
              <p class="copy-desc" v-assemble="200">{{ screens[active].desc }}</p>
            </div>
          </Transition>
          <div class="dots">
            <span
              v-for="(s, i) in screens"
              :key="i"
              class="dot"
              :class="{ on: i === active }"
            />
          </div>
        </div>

        <!-- Телефон с кросс-фейдом экранов -->
        <div class="phone">
          <div class="notch" />
          <div class="screen">
            <img
              v-for="(s, i) in screens"
              :key="s.src"
              :src="s.src"
              :alt="s.title"
              class="shot"
              :class="{ show: i === active }"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const screens = [
  {
    src: '/screens/home.png',
    title: 'Главная',
    desc: 'Тёплое приветствие от AI и один шаг, с которого стоит начать день. Ничего лишнего.',
  },
  {
    src: '/screens/habits.png',
    title: 'Привычки',
    desc: 'Список на сегодня, серии (streak) и добавление новой привычки в пару тапов.',
  },
  {
    src: '/screens/progress.png',
    title: 'Прогресс',
    desc: 'Статистика, график за 14 дней и карта активности — виден каждый маленький шаг.',
  },
  {
    src: '/screens/ai.png',
    title: 'AI-помощник',
    desc: 'Личный наставник, который знает твои привычки и задачи и всегда подскажет.',
  },
]

const root = ref(null)
const active = ref(0)
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const el = root.value
    if (el) {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
      // небольшой сдвиг, чтобы последний экран успевал показаться до конца секции
      active.value = Math.min(screens.length - 1, Math.floor(p * screens.length * 0.999))
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
.showcase {
  position: relative;
  border-top: 1px solid var(--border);
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.stage-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  width: 100%;
}

/* Левая колонка */
.copy {
  max-width: 440px;
}
.counter {
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  color: var(--text);
  margin: 14px 0 18px;
  letter-spacing: 0.1em;
}
.counter span {
  color: var(--muted);
}
.copy-body {
  min-height: 150px;
}
.copy-title {
  font-size: clamp(30px, 4.4vw, 48px);
  margin-bottom: 16px;
}
.copy-desc {
  font-size: clamp(16px, 2.2vw, 19px);
  color: var(--text-2);
  max-width: 400px;
}
.dots {
  display: flex;
  gap: 8px;
  margin-top: 30px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--border);
  transition: all 0.3s ease;
}
.dot.on {
  width: 26px;
  background: var(--accent);
}

/* Телефон */
.phone {
  justify-self: center;
  width: 300px;
  border-radius: 46px;
  padding: 9px;
  background: #050505;
  border: 1px solid #2a2a2a;
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.65),
    0 0 70px rgba(245, 240, 232, 0.05);
  position: relative;
}
.notch {
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 24px;
  background: #050505;
  border-radius: 0 0 14px 14px;
  z-index: 3;
}
.screen {
  position: relative;
  border-radius: 38px;
  overflow: hidden;
  background: #0a0a0a;
  aspect-ratio: 590 / 1280;
}
.shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: translateY(90px) scale(1.12);
  filter: blur(10px);
  transition:
    opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}
.shot.show {
  opacity: 1;
  transform: none;
  filter: none;
}

/* Смена текста */
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

/* Мобилка: телефон сверху, текст под ним */
@media (max-width: 860px) {
  .stage-inner {
    grid-template-columns: 1fr;
    gap: 26px;
    justify-items: center;
    text-align: center;
  }
  .copy {
    order: 2;
  }
  .phone {
    order: 1;
    width: 220px;
  }
  .copy-body {
    min-height: 120px;
  }
  .dots {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shot {
    transition: opacity 0.2s ease;
    transform: none;
  }
}
</style>
