<template>
  <!-- Сцена 4. Что внутри: карточки едут горизонтально, как сторис. Та, что
       в центре, «оживает» — внутри неё срабатывает маленькая анимация. -->
  <section ref="layer" class="layer reel-scene">
    <header class="reel-head">
      <p class="eyebrow">{{ t('reel.eyebrow') }}</p>
      <h2 class="reel-title">{{ t('reel.title') }}</h2>
    </header>

    <div class="reel-view">
      <div class="reel-track">
        <article v-for="(c, i) in cards" :key="i" class="rcard" :class="{ 'is-active': isStatic || active === i }">
          <div class="rcard-ui">
            <!-- 1. Привычки -->
            <div v-if="i === 0" class="mu mu-habits">
              <p v-for="(h, hi) in ui.habits" :key="h" class="mu-row" :style="{ '--d': hi }">
                <i class="mu-check" /><span>{{ h }}</span><em>🔥 {{ [10, 11, 4][hi] }}</em>
              </p>
              <div class="mu-bar"><i /></div>
              <p class="mu-note">{{ ui.habitsDone }}</p>
            </div>

            <!-- 2. Задачи с датой -->
            <div v-else-if="i === 1" class="mu mu-tasks">
              <div class="mu-toast">
                <b>{{ ui.toastTitle }}</b><span>{{ ui.task2 }}</span>
              </div>
              <p class="mu-label">{{ ui.today }}</p>
              <p class="mu-row"><i class="mu-circle" /><span>{{ ui.task1 }}</span></p>
              <p class="mu-label">{{ ui.planned }} · 1</p>
              <p class="mu-row dashed">
                <i class="mu-circle" /><span>{{ ui.task2 }}</span>
              </p>
              <p class="mu-chip">🔔 {{ ui.task2Date }}</p>
            </div>

            <!-- 3. Цели -->
            <div v-else-if="i === 2" class="mu mu-goal">
              <p class="mu-strong">{{ ui.goal }}</p>
              <div class="mu-bar"><i /></div>
              <p class="mu-note">{{ ui.goalStep }}</p>
              <p v-for="(s, si) in ui.goalSteps" :key="s" class="mu-row" :class="{ todo: si === 2 }">
                <i :class="si === 2 ? 'mu-circle' : 'mu-check on'" /><span>{{ s }}</span>
              </p>
            </div>

            <!-- 4. Рефлексия -->
            <div v-else-if="i === 3" class="mu mu-mood">
              <p class="mu-strong">{{ ui.mood }}</p>
              <div class="mu-faces">
                <i v-for="(f, fi) in ['😔', '😕', '😐', '🙂', '😄']" :key="f" :class="{ pick: fi === 3 }">{{ f }}</i>
              </div>
              <div class="mu-chips">
                <span v-for="(o, oi) in ui.obstacles" :key="o" :class="{ pick: oi === 1 }">{{ o }}</span>
              </div>
              <div class="mu-lines"><i /><i /></div>
            </div>

            <!-- 5. Вдвоём с другом -->
            <div v-else-if="i === 4" class="mu mu-pair">
              <div class="mu-pair-head">
                <i class="mu-ava">А</i><i class="mu-ava two">Н</i>
                <span>{{ ui.pair }}</span><em>🔥 12</em>
              </div>
              <div v-for="(who, wi) in [ui.you, ui.friend]" :key="who" class="mu-week">
                <span>{{ who }}</span>
                <i v-for="n in 7" :key="n" :class="{ on: wi === 0 || n < 6 }" />
              </div>
              <p class="mu-nudge">{{ ui.nudge }}</p>
            </div>

            <!-- 6. Прогресс -->
            <div v-else class="mu mu-heat">
              <div class="mu-grid">
                <i v-for="n in 42" :key="n" :style="{ '--o': HEAT[n - 1], '--d': n }" />
              </div>
              <p class="mu-note">{{ ui.days }}</p>
            </div>
          </div>

          <div class="rcard-text">
            <span class="rcard-idx">0{{ i + 1 }}</span>
            <h3 class="rcard-title">{{ c.title }}</h3>
            <p class="rcard-body">{{ c.text }}</p>
          </div>
        </article>
      </div>
    </div>

    <div class="reel-dots">
      <i v-for="(c, i) in cards" :key="i" :class="{ on: active === i }" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useScene, gsap, motionOff } from '../../composables/useStory'
import { t } from '../../i18n'

const layer = ref(null)
const cards = computed(() => t('reel.cards'))
const ui = computed(() => t('reel.ui'))

// Карточка в центре. Без анимаций useScene не запускается: тогда карточки
// листаются пальцем и «оживлены» все сразу.
const active = ref(0)
const isStatic = motionOff()

// Насыщенность клеток тепловой карты: к концу месяца ритм набирается.
const HEAT = Array.from({ length: 42 }, (_, i) => {
  const v = ((i * 37) % 10) / 10
  return i < 12 ? (v > 0.6 ? 0.35 : 0.1) : i < 28 ? (v > 0.3 ? 0.6 : 0.2) : v > 0.15 ? 1 : 0.45
})

// Движение с «залипанием»: карточка задерживается в центре и быстро сменяется
// следующей — листается как карусель, а не тянется как лента.
const dwell = (x) => {
  const i = Math.floor(x)
  const f = x - i
  return i + f * f * f * (f * (f * 6 - 15) + 10)
}

useScene('reel', layer, ({ tl, layer, q, portal }) => {
  const track = q('.reel-track')[0]
  const items = q('.rcard')
  const n = items.length
  const step = () => items[1].offsetLeft - items[0].offsetLeft
  const setX = gsap.quickSetter(track, 'x', 'px')

  const pos = { v: 0 }
  const place = () => {
    const at = dwell(Math.min(n - 1, Math.max(0, pos.v)))
    setX(-at * step())
    items.forEach((el, i) => {
      const d = Math.min(1.6, Math.abs(i - at))
      gsap.set(el, { scale: 1 - Math.min(1, d) * 0.1, opacity: 1 - d * 0.42 })
    })
    const now = Math.round(at)
    if (now !== active.value) active.value = now
  }

  // Первый кадр виден ещё на экране телефона (в миниатюре): карточки уже на
  // месте. Заголовок и точки появляются, когда камера влетела внутрь, — в
  // узком экране телефона заголовок был бы обрезан.
  tl.from(q('.reel-head'), { autoAlpha: 0, y: 30, duration: 0.06, ease: 'power2.out' }, 0.01)
    .from(q('.reel-dots'), { autoAlpha: 0, duration: 0.05 }, 0.04)
    .to(pos, { v: n - 1, duration: 0.76 }, 0.1)

  // Камера пролетает сквозь карточку: лента карточек надвигается, а из центра
  // раскрывается круглое окно к наставнику. iris — доля раскрытия.
  const iris = { p: 0 }
  tl.to(q('.reel-head, .reel-dots'), { autoAlpha: 0, duration: 0.04 }, 0.88)
    .to(q('.reel-view'), { scale: 2.3, duration: 0.11, ease: 'power2.in' }, 0.89)
    .to(iris, { p: 1, duration: 0.1, ease: 'power2.in' }, 0.9)

  portal(() => {
    if (iris.p <= 0) return null
    const l = layer.getBoundingClientRect()
    // Окно раскрывается от кольца наставника — оно первым и покажется.
    const o = document.querySelector('.mentor-orbit')?.getBoundingClientRect()
    const x = o ? o.left + o.width / 2 - l.left : l.width / 2
    const y = o ? o.top + o.height / 2 - l.top : l.height / 2
    const reach = Math.hypot(Math.max(x, l.width - x), Math.max(y, l.height - y))
    return { clip: `circle(${(iris.p * reach).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)` }
  })

  // Положение карусели и то, какая карточка «оживлена».
  return place
})
</script>

<style scoped>
.reel-scene {
  display: flex;
  flex-direction: column;
  /* Внизу — место под счётчик пролистанного, чтобы он не лёг на точки. */
  padding: clamp(78px, 12svh, 112px) 0 clamp(38px, 5svh, 44px);
  background:
    radial-gradient(70% 40% at 50% 100%, rgba(124, 92, 255, 0.16), transparent 70%),
    var(--ink);
}
.reel-head {
  flex: none;
  padding: 0 24px;
  text-align: center;
}
.reel-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(21px, 5.6vw, 40px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-top: 8px;
  text-wrap: balance;
}

/* ── Лента карточек ── */
.reel-view {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  /* Первая карточка стоит по центру: отступ слева — половина свободного места. */
  --cw: min(74vw, 44svh, 330px);
  padding-left: calc(50% - var(--cw) / 2);
  will-change: transform, opacity;
}
.reel-track {
  display: flex;
  gap: 16px;
  height: min(100%, 520px);
  will-change: transform;
}
.rcard {
  flex: none;
  width: var(--cw);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  background: linear-gradient(170deg, #1b1626, #110c19);
  border: 1px solid rgba(245, 240, 232, 0.09);
  overflow: hidden;
  will-change: transform, opacity;
}
.rcard.is-active {
  border-color: rgba(206, 92, 255, 0.45);
  box-shadow: 0 30px 80px -20px rgba(124, 92, 255, 0.45);
}
.rcard-ui {
  flex: 1;
  min-height: 0;
  padding: 18px 18px 6px;
  display: flex;
  align-items: center;
  /* Мини-интерфейсы — в em, сжимаются вместе с карточкой на низких экранах. */
  font-size: clamp(11px, 2svh, 16px);
}
.rcard-text {
  flex: none;
  padding: 12px 20px 20px;
}
.rcard-idx {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--violet-2);
}
.rcard-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 2.6svh, 22px);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 6px 0 6px;
}
.rcard-body {
  font-size: clamp(13px, 1.9svh, 15px);
  line-height: 1.45;
  color: var(--cream-2);
}
.reel-dots {
  flex: none;
  display: flex;
  justify-content: center;
  gap: 7px;
  padding-top: clamp(10px, 2svh, 20px);
}
.reel-dots i {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(245, 240, 232, 0.2);
  transition:
    width 0.3s ease,
    background 0.3s ease;
}
.reel-dots i.on {
  width: 22px;
  background: var(--cream);
}

/* ── Мини-интерфейсы ──
   Состояние покоя — «до», .is-active — «после»: когда карточка встаёт в центр,
   галочки ставятся, полосы заполняются, клетки проявляются. */
.mu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  color: #fff;
}
.mu-row {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.75em 0.9em;
  border-radius: 1em;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  font-size: 1em;
}
.mu-row span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mu-row em {
  font-style: normal;
  font-size: 0.85em;
  color: #9a9a92;
}
.mu-row.dashed {
  background: transparent;
  border-style: dashed;
}
.mu-row.todo span {
  color: #9a9a92;
}
.mu-check,
.mu-circle {
  flex: none;
  width: 1.4em;
  height: 1.4em;
  border-radius: 50%;
  border: 2px solid #3a3a3a;
  position: relative;
  transition:
    background 0.35s ease,
    border-color 0.35s ease;
  transition-delay: calc(var(--d, 0) * 0.18s + 0.15s);
}
.mu-check::after {
  content: '';
  position: absolute;
  left: 30%;
  top: 14%;
  width: 28%;
  height: 52%;
  border: solid #0a0a0a;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.3s ease;
  transition-delay: calc(var(--d, 0) * 0.18s + 0.2s);
}
.mu-check.on,
.is-active .mu-check {
  background: #f5f0e8;
  border-color: #f5f0e8;
}
.mu-check.on::after,
.is-active .mu-check::after {
  transform: rotate(45deg) scale(1);
}
.mu-bar {
  height: 0.45em;
  border-radius: 1em;
  background: #2a2a2a;
  overflow: hidden;
  margin-top: 0.3em;
}
.mu-bar i {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 1em;
  background: linear-gradient(90deg, #7c5cff, #ce5cff);
  transform: scaleX(0.08);
  transform-origin: left;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
}
.is-active .mu-habits .mu-bar i {
  transform: scaleX(1);
}
.is-active .mu-goal .mu-bar i {
  transform: scaleX(0.6);
}
.mu-note {
  font-size: 0.85em;
  color: #9a9a92;
}
.mu-label {
  font-size: 0.72em;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9a9a92;
  margin-top: 0.3em;
}
.mu-strong {
  font-size: 1.15em;
  font-weight: 600;
}

/* Задачи: в нужный день прилетает напоминание. */
.mu-chip {
  align-self: flex-start;
  font-size: 0.85em;
  color: #c9c4bb;
  border: 1px solid #2a2a2a;
  border-radius: 0.7em;
  padding: 0.3em 0.7em;
  transition:
    border-color 0.4s ease 0.3s,
    color 0.4s ease 0.3s;
}
.is-active .mu-chip {
  border-color: #ce5cff;
  color: #fff;
}
.mu-toast {
  /* Место под напоминание занято всегда — появляясь, оно не закрывает список. */
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  padding: 0.75em 1em;
  border-radius: 1.1em;
  background: rgba(58, 50, 72, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 1em 2.4em rgba(0, 0, 0, 0.5);
  font-size: 0.92em;
  opacity: 0;
  transform: translateY(-1.6em) scale(0.94);
  transition:
    opacity 0.4s ease 0.9s,
    transform 0.5s cubic-bezier(0.22, 1.3, 0.36, 1) 0.9s;
}
.mu-toast span {
  color: rgba(245, 240, 232, 0.8);
}
.is-active .mu-toast {
  opacity: 1;
  transform: none;
}

/* Рефлексия. */
.mu-faces {
  display: flex;
  justify-content: space-between;
  font-style: normal;
}
.mu-faces i {
  font-style: normal;
  font-size: 1.9em;
  opacity: 0.4;
  transition:
    transform 0.4s cubic-bezier(0.22, 1.6, 0.36, 1) 0.3s,
    opacity 0.3s ease 0.3s;
}
.is-active .mu-faces .pick {
  opacity: 1;
  transform: scale(1.35);
}
.mu-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  margin-top: 0.4em;
}
.mu-chips span {
  font-size: 0.82em;
  padding: 0.4em 0.75em;
  border-radius: 999px;
  border: 1px solid #2a2a2a;
  color: #9a9a92;
  transition:
    background 0.3s ease 0.6s,
    color 0.3s ease 0.6s;
}
.is-active .mu-chips .pick {
  background: #f5f0e8;
  border-color: #f5f0e8;
  color: #0a0a0a;
}
.mu-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin-top: 0.5em;
}
.mu-lines i {
  height: 0.5em;
  border-radius: 0.3em;
  background: #2a2a2a;
  width: 88%;
}
.mu-lines i + i {
  width: 54%;
}

/* Пара. */
.mu-pair-head {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.4em;
}
.mu-pair-head span {
  flex: 1;
  margin-left: 0.7em;
}
.mu-pair-head em {
  font-style: normal;
  font-weight: 400;
  font-size: 0.9em;
  color: #9a9a92;
}
.mu-ava {
  width: 2.2em;
  height: 2.2em;
  border-radius: 50%;
  background: #2a2a2a;
  color: #f5f0e8;
  font-style: normal;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #15101d;
}
.mu-ava.two {
  margin-left: -0.7em;
  background: linear-gradient(135deg, #7c5cff, #ce5cff);
  color: #fff;
}
.mu-week {
  display: flex;
  align-items: center;
  gap: 0.35em;
}
.mu-week span {
  width: 3.4em;
  font-size: 0.8em;
  color: #9a9a92;
}
.mu-week i {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 0.35em;
  background: #2a2a2a;
}
.mu-week i.on {
  background: #f5f0e8;
}
.mu-nudge {
  align-self: flex-start;
  margin-top: 0.5em;
  padding: 0.6em 1.1em;
  border-radius: 999px;
  background: #f5f0e8;
  color: #0a0a0a;
  font-weight: 600;
  font-size: 0.92em;
}
.is-active .mu-nudge {
  animation: nudge 0.7s ease 0.5s 2;
}
@keyframes nudge {
  0%,
  100% {
    transform: none;
  }
  25% {
    transform: rotate(-4deg) scale(1.05);
  }
  75% {
    transform: rotate(4deg) scale(1.05);
  }
}

/* Тепловая карта. */
.mu-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.35em;
}
.mu-grid i {
  aspect-ratio: 1;
  border-radius: 0.3em;
  background: #f5f0e8;
  opacity: 0.08;
  transition: opacity 0.4s ease;
  transition-delay: calc(var(--d) * 14ms);
}
.is-active .mu-grid i {
  opacity: var(--o);
}

@media (min-width: 900px) {
  .reel-view {
    --cw: min(330px, 46svh);
  }
  .reel-track {
    gap: 22px;
  }
}

/* ── Без анимаций ── Обычная горизонтальная лента с прилипанием. */
.is-static .reel-view {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-right: calc(50% - var(--cw) / 2);
  -webkit-overflow-scrolling: touch;
}
.is-static .reel-track {
  height: 480px;
}
.is-static .rcard {
  scroll-snap-align: center;
}
.is-static .reel-dots {
  display: none;
}
</style>
