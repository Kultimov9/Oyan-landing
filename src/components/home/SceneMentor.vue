<template>
  <!-- Сцена 5. Наставник: то, что он знает о тебе, слетается в кольцо, и из
       кольца появляется сообщение — буква за буквой. -->
  <section ref="layer" class="layer mentor-scene">
    <div class="mentor-aura" />
    <header class="mentor-head">
      <p class="eyebrow">{{ t('ai.eyebrow') }}</p>
      <h2 class="mentor-title">{{ t('ai.title1') }}<br />{{ t('ai.title2') }}</h2>
    </header>

    <div class="mentor-stage">
      <div class="mentor-orbit">
        <span v-for="(c, i) in chips" :key="c" class="chip" :class="`chip-${i}`">{{ c }}</span>
        <i class="mentor-halo" />
        <div class="mentor-core"><OyanRing /></div>
      </div>

      <div class="bubble">
        <p class="bubble-msg">
          <!-- Слова — неразрывные блоки, буквы внутри проявляются по одной. -->
          <template v-for="(w, wi) in words" :key="wi"
            ><span class="word"><span v-for="(ch, ci) in w" :key="ci" class="ch">{{ ch }}</span></span
            >{{ ' ' }}</template
          >
        </p>
        <div class="bubble-actions">
          <span class="bbtn primary">{{ t('ai.btnPrimary') }}</span>
          <span class="bbtn ghost">{{ t('ai.btnGhost') }}</span>
        </div>
      </div>
    </div>

    <p class="mentor-note">{{ t('ai.note') }}</p>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import OyanRing from './OyanRing.vue'
import { useScene } from '../../composables/useStory'
import { t } from '../../i18n'

const layer = ref(null)
const chips = computed(() => t('ai.chips'))
// Array.from, а не split(''): эмодзи и составные символы остаются целыми.
const words = computed(() =>
  t('ai.msg')
    .split(' ')
    .map((w) => Array.from(w)),
)

useScene('mentor', layer, ({ tl, q }) => {
  const core = q('.mentor-core')[0]
  const orbit = q('.mentor-orbit')[0]
  const chipEls = q('.chip')

  // Первый кадр виден ещё сквозь карточку: кольцо уже светится. Войдя,
  // камера доводит его до полного размера.
  tl.fromTo(core, { scale: 0.7 }, { scale: 1, duration: 0.07, ease: 'back.out(1.8)' }, 0).from(
    q('.mentor-head'),
    { autoAlpha: 0, y: 30, duration: 0.06, ease: 'power2.out' },
    0.02,
  )

  // Факты прилетают с четырёх сторон, задерживаются и втягиваются в кольцо.
  const from = [
    { xPercent: -160, yPercent: -40 },
    { xPercent: 160, yPercent: -30 },
    { xPercent: -160, yPercent: 40 },
    { xPercent: 160, yPercent: 50 },
  ]
  chipEls.forEach((el, i) => {
    const at = 0.08 + i * 0.035
    tl.fromTo(
      el,
      { ...from[i], autoAlpha: 0, scale: 0.8 },
      { xPercent: 0, yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.08, ease: 'power3.out' },
      at,
    )
    // Втягивание: к центру орбиты, где стоит кольцо. У кольца left/top: 50% и
    // сдвиг на полразмера назад, поэтому его offsetLeft/Top — уже центр.
    tl.to(
      el,
      {
        x: () => core.offsetLeft - (el.offsetLeft + el.offsetWidth / 2),
        y: () => core.offsetTop - (el.offsetTop + el.offsetHeight / 2),
        scale: 0.2,
        autoAlpha: 0,
        duration: 0.07,
        ease: 'power2.in',
      },
      0.3 + i * 0.03,
    )
    // Кольцо «проглатывает» каждый факт.
    tl.to(core, { scale: 1.16, duration: 0.015, yoyo: true, repeat: 1, ease: 'power1.out' }, 0.36 + i * 0.03)
  })

  // Сообщение вырастает из кольца и печатается.
  tl.fromTo(
    q('.bubble'),
    { autoAlpha: 0, scale: 0.7, yPercent: -18 },
    { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.06, ease: 'back.out(1.4)' },
    0.47,
  )
  tl.fromTo(q('.ch'), { opacity: 0 }, { opacity: 1, duration: 0.004, stagger: { amount: 0.22 } }, 0.52)
    .from(q('.bbtn'), { autoAlpha: 0, y: 14, duration: 0.04, stagger: 0.03, ease: 'power2.out' }, 0.76)
    .from(q('.mentor-note'), { autoAlpha: 0, duration: 0.05 }, 0.8)

  // Переход в финал без склейки: всё гаснет, а кольцо едет туда, где стоит
  // кольцо финала, и вырастает до его размера. Финал начинается с точно
  // такого же кольца на том же месте — подмены не видно.
  const toFinale = () => {
    const target = document.querySelector('.finale-ring')
    if (!target) return { x: 0, y: 0, scale: 1 }
    const f = target.getBoundingClientRect()
    const o = orbit.getBoundingClientRect()
    return {
      x: f.left + f.width / 2 - (o.left + o.width / 2),
      y: f.top + f.height / 2 - (o.top + o.height / 2),
      scale: f.width / core.offsetWidth,
    }
  }
  tl.to(q('.mentor-head, .bubble, .mentor-note'), { autoAlpha: 0, y: -20, duration: 0.05, ease: 'power1.in' }, 0.87)
    .to(q('.mentor-aura, .mentor-halo'), { opacity: 0, duration: 0.1 }, 0.9)
    .to(
      core,
      { x: () => toFinale().x, y: () => toFinale().y, scale: () => toFinale().scale, duration: 0.11, ease: 'power2.inOut' },
      0.89,
    )
})
</script>

<style scoped>
.mentor-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Внизу — место под счётчик пролистанного. */
  padding: clamp(78px, 12svh, 116px) 24px clamp(40px, 5svh, 48px);
}
/* Свечение фона и ореол кольца — отдельные элементы: к переходу в финал они
   гаснут, и кольцо остаётся на чистом фоне. */
.mentor-aura {
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 44% at 50% 44%, rgba(124, 92, 255, 0.2), transparent 72%);
  pointer-events: none;
}
.mentor-head,
.mentor-stage,
.mentor-note {
  position: relative;
}
.mentor-halo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(150px, 26svh, 220px);
  aspect-ratio: 1;
  translate: -50% -50%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(206, 92, 255, 0.42), transparent);
  pointer-events: none;
}
.mentor-head {
  flex: none;
  text-align: center;
}
.mentor-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 7.4vw, 56px);
  line-height: 1.06;
  letter-spacing: -0.03em;
  margin-top: 8px;
}
.mentor-stage {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 2svh, 20px);
}

/* Орбита: кольцо в центре, вокруг — четыре факта. */
.mentor-orbit {
  position: relative;
  width: 100%;
  height: clamp(150px, 26svh, 220px);
  flex: none;
}
.mentor-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(64px, 11svh, 92px);
  aspect-ratio: 1;
  translate: -50% -50%;
  /* Без will-change: кольцо вырастает в финальное, и браузер должен
     перерисовывать его чётким на каждом размере, а не растягивать растр. */
}
.chip {
  position: absolute;
  padding: 8px 13px;
  border-radius: 999px;
  background: #1a1524;
  border: 1px solid rgba(245, 240, 232, 0.12);
  font-size: clamp(12px, 3.3vw, 14px);
  white-space: nowrap;
  will-change: transform, opacity;
}
.chip-0 {
  left: 0;
  top: 2%;
}
.chip-1 {
  right: 0;
  top: 16%;
}
.chip-2 {
  left: 2%;
  bottom: 14%;
}
.chip-3 {
  right: 3%;
  bottom: 0;
}

/* Сообщение наставника. */
.bubble {
  width: 100%;
  padding: clamp(16px, 2.6svh, 22px);
  border-radius: 24px 24px 24px 8px;
  background: #17121f;
  border: 1px solid rgba(245, 240, 232, 0.1);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  transform-origin: 50% 0;
  /* Сообщение начинается сразу под кольцом: нижние факты к этому моменту уже
     втянулись, место под ними свободно. */
  margin-top: calc(clamp(150px, 26svh, 220px) * -0.26);
  will-change: transform, opacity;
}
.bubble-msg {
  font-size: clamp(15px, 4.1vw, 18px);
  line-height: 1.5;
  color: #ece7de;
}
.word {
  display: inline-block;
}
.bubble-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: clamp(12px, 2svh, 18px);
}
.bbtn {
  padding: 12px;
  border-radius: 13px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.bbtn.primary {
  background: var(--cream);
  color: var(--ink);
}
.bbtn.ghost {
  border: 1px solid rgba(245, 240, 232, 0.14);
  color: var(--cream-2);
  font-weight: 500;
}
.mentor-note {
  flex: none;
  max-width: 34em;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--cream-3);
  text-wrap: balance;
}

/* Без анимаций факты остаются вокруг кольца — сообщение на них не наезжает. */
.is-static .bubble {
  margin-top: 0;
}

@media (min-width: 900px) {
  .mentor-stage {
    max-width: 640px;
  }
  .bubble-actions {
    flex-direction: row;
  }
  .bbtn {
    flex: 1;
  }
}
</style>
