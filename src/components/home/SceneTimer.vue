<template>
  <!-- Сцена 3. Телефон с таймером: прокрутка отсчитывает пять минут, в конце
       привычка засчитывается и серия прибавляет день. -->
  <section ref="layer" class="layer timer-scene">
    <div class="timer-glow" />
    <div class="timer-grid">
      <div class="timer-copy">
        <div v-for="(c, i) in caps" :key="i" class="tcap">
          <h2 class="tcap-title">{{ c.title }}</h2>
          <p class="tcap-sub">{{ c.sub }}</p>
        </div>
      </div>

      <div class="phone-slot">
        <i class="wave" /><i class="wave" />
        <div class="phone">
          <!-- Корпус — отдельным элементом: в начале сцены есть только экран
               (в него превратился баннер), корпус проявляется вокруг. -->
          <i class="phone-shell" />
          <div class="phone-screen">
            <i class="phone-island" />

            <!-- Экран таймера — как в приложении. -->
            <div class="ui ui-run">
              <p class="ui-back">← {{ t('timer.back') }}</p>
              <p class="ui-emoji">📚</p>
              <p class="ui-name">{{ t('timer.habit') }}</p>
              <p class="ui-hint">{{ t('timer.hint') }}</p>
              <div class="dial">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" class="dial-track" />
                  <circle
                    ref="dialEl"
                    cx="60"
                    cy="60"
                    r="54"
                    class="dial-fill"
                    pathLength="100"
                    stroke-dasharray="100 100"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span ref="timeEl" class="dial-time">5:00</span>
              </div>
              <p class="ui-btn">{{ t('timer.pause') }}</p>
            </div>

            <!-- Готово: привычка засчитана. -->
            <div class="ui ui-done">
              <div class="done-mark">
                <svg viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="timer-done" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
                      <stop offset="0" stop-color="#7c5cff" />
                      <stop offset="1" stop-color="#ce5cff" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#timer-done)" stroke-width="10" />
                  <path d="M40 62 54 76 82 46" class="done-check" />
                </svg>
              </div>
              <p class="done-title">{{ t('timer.done') }}</p>
              <p class="done-sub">{{ t('timer.counted') }}</p>
              <p class="done-streak">
                🔥 <b ref="streakEl">{{ STREAK_START }}</b> {{ t('timer.streak') }}
              </p>
              <div class="done-week">
                <i v-for="n in 7" :key="n" :class="{ on: n < 7, last: n === 7 }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useScene, motionOff, clamp01 } from '../../composables/useStory'
import { t } from '../../i18n'

const layer = ref(null)
const dialEl = ref(null)
const timeEl = ref(null)
const streakEl = ref(null)
const caps = computed(() => t('timer.caps'))
// Серия на экране «Готово»: анимация доводит её с 6 до 7. Без анимаций сразу
// показываем итог.
const STREAK_START = motionOff() ? 7 : 6

useScene('timer', layer, ({ tl, layer, q, portal }) => {
  const phone = q('.phone')[0]
  const slot = q('.phone-slot')[0]
  const screen = q('.phone-screen')[0]
  const tcaps = q('.tcap')

  const capIn = (el, at) =>
    tl.fromTo(el, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, at)
  const capOut = (el, at) => tl.to(el, { autoAlpha: 0, y: -26, duration: 0.04, ease: 'power1.in' }, at)

  // «Крупный план»: телефон в центре кадра, увеличенный до его высоты. Им
  // сцена заканчивается — камера ныряет в экран. На вертикальном кадре экран
  // телефона при этом закрывает его целиком; на широком закрывает по высоте,
  // а по бокам окно раздвигается само (см. portal ниже) — иначе телефон
  // пришлось бы растягивать впятеро. Считаем от места в раскладке (slot): сам
  // телефон к моменту пересчёта уже сдвинут.
  const closeUp = () => {
    const l = layer.getBoundingClientRect()
    const s = slot.getBoundingClientRect()
    const byHeight = l.height / screen.offsetHeight
    const cover = l.height >= l.width ? Math.max(l.width / screen.offsetWidth, byHeight) : byHeight
    return {
      x: l.left + l.width / 2 - (s.left + s.width / 2),
      y: l.top + l.height / 2 - (s.top + s.height / 2),
      scale: cover * 1.03,
    }
  }

  // Первый кадр: телефон стоит на месте лицом к зрителю, и виден только его
  // экран — в него превратился баннер из прошлой сцены. Корпус проявляется
  // вокруг, и телефон поворачивается боком.
  tl.fromTo(q('.phone-shell'), { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'power1.out' }, 0)
    .from(q('.timer-glow'), { opacity: 0, duration: 0.1 }, 0)
    .fromTo(
      phone,
      { rotateY: 0, rotateX: 0 },
      { rotateY: -14, rotateX: 5, duration: 0.1, ease: 'power2.out' },
      0.02,
    )
  capIn(tcaps[0], 0.05)

  // Пять минут: 300 секунд → 0, кольцо убывает, телефон медленно доворачивается.
  const clock = { s: 300 }
  tl.to(clock, { s: 0, duration: 0.48 }, 0.12).to(phone, { rotateY: 9, rotateX: 2, duration: 0.48 }, 0.12)

  capOut(tcaps[0], 0.31)
  capIn(tcaps[1], 0.35)
  capOut(tcaps[1], 0.56)

  // Готово: экран таймера сменяется отметкой, от телефона расходятся волны.
  tl.to(q('.ui-run'), { autoAlpha: 0, scale: 0.92, duration: 0.03 }, 0.6)
    .fromTo(
      q('.ui-done'),
      { autoAlpha: 0, scale: 0.86 },
      { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(1.6)' },
      0.62,
    )
    .fromTo(
      q('.done-check'),
      { strokeDashoffset: 70 },
      { strokeDashoffset: 0, duration: 0.04, ease: 'power2.out' },
      0.64,
    )
    // Волна вспыхивает и гаснет, расходясь. До этого момента её не видно.
    .fromTo(
      q('.wave'),
      { scale: 0.7, opacity: 0 },
      {
        keyframes: [
          { scale: 0.85, opacity: 0.55, duration: 0.02 },
          { scale: 1.9, opacity: 0, duration: 0.14, ease: 'power1.out' },
        ],
        stagger: 0.04,
      },
      0.62,
    )
  capIn(tcaps[2], 0.63)

  // Серия: шестой день становится седьмым.
  const streak = { n: 6 }
  tl.to(streak, { n: 7, duration: 0.02, snap: { n: 1 } }, 0.69)
    .fromTo(q('.done-streak'), { scale: 1 }, { scale: 1.14, duration: 0.02, yoyo: true, repeat: 1 }, 0.69)
    .fromTo(q('.done-week .last'), { scale: 0.3, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.03, ease: 'back.out(2)' }, 0.7)
    .to(phone, { rotateY: 0, rotateX: 0, scale: 1.04, duration: 0.18, ease: 'power1.inOut' }, 0.64)

  // Камера ныряет в телефон. Сначала на его экране, ещё в обычном размере,
  // вместо «Готово» появляется следующая сцена в миниатюре — будто в
  // приложении открыли другой экран. Потом телефон едет в центр и растёт.
  capOut(tcaps[2], 0.83)
  tl.to(q('.ui-done'), { autoAlpha: 0, duration: 0.03 }, 0.84)
    .to(q('.timer-glow'), { opacity: 0, duration: 0.08 }, 0.9)
    .to(
      phone,
      { x: () => closeUp().x, y: () => closeUp().y, scale: () => closeUp().scale, duration: 0.11, ease: 'power2.in' },
      0.89,
    )

  // Окно в «Что внутри» — экран телефона. Следующая сцена вписана в него и
  // растёт вместе с ним.
  portal((t) => {
    if (t < 0.86) return null
    const l = layer.getBoundingClientRect()
    const b = screen.getBoundingClientRect()
    const left = b.left - l.left
    const top = b.top - l.top
    // В самом конце окно раздвигается до краёв кадра: на широком экране
    // телефон закрывает его только по высоте.
    const wide = clamp01((t - 0.94) / 0.06)
    const mix = (a, to) => a + (to - a) * wide
    return {
      rect: {
        left: mix(left, 0),
        top: mix(top, 0),
        right: mix(left + b.width, l.width),
        bottom: mix(top + b.height, l.height),
        radius:
          parseFloat(getComputedStyle(screen).borderTopLeftRadius) * (b.width / screen.offsetWidth) * (1 - wide),
      },
      // Сцена закрывает экран телефона целиком и дорастает до натурального
      // размера, когда он дорастает до кадра.
      scale: Math.min(1, Math.max(b.width / l.width, b.height / l.height)),
      shift: { x: left + b.width / 2 - l.width / 2, y: top + b.height / 2 - l.height / 2 },
      // Сначала окно тёмное, как пустой экран, потом проступают карточки.
      color: '#0a0a0a',
      veil: 1 - clamp01((t - 0.86) / 0.035),
    }
  })

  // Цифры таймера, кольцо и счётчик серии.
  return () => {
    const s = Math.ceil(clock.s)
    if (timeEl.value) timeEl.value.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    if (dialEl.value) dialEl.value.setAttribute('stroke-dasharray', `${(clock.s / 300) * 100} 100`)
    if (streakEl.value) streakEl.value.textContent = String(Math.round(streak.n))
  }
})
</script>

<style scoped>
.timer-scene {
  display: flex;
  align-items: stretch;
  justify-content: center;
}
.timer-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(46% 38% at 50% 62%, rgba(124, 92, 255, 0.3), transparent 72%);
  pointer-events: none;
}
.timer-grid {
  position: relative;
  width: 100%;
  max-width: 1120px;
  padding: clamp(84px, 13svh, 120px) 24px clamp(20px, 4svh, 48px);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2.5svh, 28px);
}

/* Подписи лежат одна на другой и сменяются на месте. */
.timer-copy {
  position: relative;
  flex: none;
  height: clamp(118px, 21svh, 190px);
}
.tcap {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
  will-change: transform, opacity;
}
.tcap-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(25px, 7.2vw, 54px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  text-wrap: balance;
}
.tcap-sub {
  margin-top: 10px;
  color: var(--cream-2);
  font-size: clamp(15px, 4vw, 19px);
  line-height: 1.45;
  text-wrap: balance;
}

/* ── Телефон ── */
.phone-slot {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1400px;
  /* Высота телефона — от неё считается и размер шрифта на его экране. */
  --ph: min(56svh, 560px);
}
.phone {
  position: relative;
  height: var(--ph);
  aspect-ratio: 9 / 18.6;
  padding: calc(var(--ph) * 0.016);
  will-change: transform, opacity;
}
.phone-shell {
  position: absolute;
  inset: 0;
  border-radius: calc(var(--ph) * 0.085);
  background: linear-gradient(150deg, #2a2433, #0d0a12 60%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 50px 110px rgba(0, 0, 0, 0.65),
    0 0 90px rgba(124, 92, 255, 0.22);
}
.phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(var(--ph) * 0.07);
  background: #0a0a0a;
  overflow: hidden;
  /* Всё на экране — в em от высоты телефона. */
  font-size: calc(var(--ph) / 40);
  color: #fff;
}
.phone-island {
  position: absolute;
  top: 2.4%;
  left: 50%;
  width: 28%;
  height: 3.6%;
  margin-left: -14%;
  border-radius: 999px;
  background: #000;
  z-index: 2;
}
.ui {
  position: absolute;
  inset: 0;
  padding: 4.2em 1.5em 1.6em;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform, opacity;
}
.ui-back {
  align-self: flex-start;
  font-size: 0.95em;
  color: #f5f0e8;
}
.ui-emoji {
  font-size: 3em;
  margin-top: 0.5em;
  line-height: 1;
}
.ui-name {
  font-size: 1.45em;
  font-weight: 600;
  margin-top: 0.4em;
}
.ui-hint {
  font-size: 0.82em;
  color: #9a9a92;
  text-align: center;
  margin-top: 0.4em;
}
.dial {
  position: relative;
  width: 12.4em;
  height: 12.4em;
  margin-top: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dial svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.dial-track,
.dial-fill {
  fill: none;
  stroke-width: 8;
}
.dial-track {
  stroke: #1a1a1a;
}
.dial-fill {
  stroke: #f5f0e8;
  stroke-linecap: round;
}
.dial-time {
  position: relative;
  font-size: 2.7em;
  font-weight: 600;
  color: #f5f0e8;
  font-variant-numeric: tabular-nums;
}
.ui-btn {
  width: 100%;
  margin-top: auto;
  padding: 1.05em;
  border-radius: 1em;
  background: #2a2a2a;
  color: #f5f0e8;
  text-align: center;
  font-size: 1.05em;
  font-weight: 500;
}
.ui-done {
  justify-content: center;
  gap: 0.5em;
  padding-top: 1.6em;
}
.done-mark {
  width: 8.4em;
  height: 8.4em;
}
.done-mark svg {
  width: 100%;
  height: 100%;
}
.done-check {
  fill: none;
  stroke: #fff;
  stroke-width: 9;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 70;
}
.done-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.9em;
  margin-top: 0.5em;
}
.done-sub {
  font-size: 0.95em;
  color: #9a9a92;
}
.done-streak {
  margin-top: 1.1em;
  padding: 0.6em 1.1em;
  border-radius: 999px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  font-size: 1.05em;
  white-space: nowrap;
}
.done-streak b {
  font-variant-numeric: tabular-nums;
}
.done-week {
  display: flex;
  gap: 0.45em;
  margin-top: 0.9em;
}
.done-week i {
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.4em;
  background: #f5f0e8;
}
.done-week .last {
  background: linear-gradient(135deg, #7c5cff, #ce5cff);
}

/* Волны от телефона в момент «готово». */
.wave {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(var(--ph) * 0.9);
  height: calc(var(--ph) * 0.9);
  margin: calc(var(--ph) * -0.45) 0 0 calc(var(--ph) * -0.45);
  border-radius: 50%;
  border: 2px solid rgba(206, 92, 255, 0.7);
  opacity: 0;
  pointer-events: none;
}

@media (min-width: 900px) {
  .timer-glow {
    background: radial-gradient(34% 46% at 70% 52%, rgba(124, 92, 255, 0.3), transparent 72%);
  }
  .timer-grid {
    flex-direction: row;
    align-items: center;
    gap: 40px;
    padding: 100px 48px 48px;
  }
  .timer-copy {
    flex: 1;
    height: 260px;
  }
  .tcap {
    justify-content: center;
    text-align: left;
  }
  .tcap-title {
    font-size: clamp(34px, 3.7vw, 50px);
  }
  .phone-slot {
    flex: none;
    width: 46%;
    height: 100%;
    --ph: min(70svh, 640px);
  }
}

/* ── Без анимаций ── Подписи идут списком, на телефоне — итоговый экран. */
.is-static .timer-copy {
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.is-static .tcap {
  position: static;
}
.is-static .ui-run,
.is-static .wave {
  display: none;
}
.is-static .phone-slot {
  padding: 24px 0;
}
</style>
