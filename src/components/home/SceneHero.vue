<template>
  <!-- Сцена 1. Кольцо «просыпается», три слова встают одно за другим.
       При прокрутке слова разлетаются, а камера пролетает сквозь кольцо. -->
  <section ref="layer" class="layer hero">
    <div class="hero-aura" />
    <div class="hero-grid">
      <div class="hero-ring-slot">
        <div class="hero-ring"><OyanRing /></div>
      </div>
      <div class="hero-copy">
        <h1 class="hero-title">
          <span class="line"><span class="line-in">{{ t('hero.line1') }}</span></span>
          <span class="line"><span class="line-in">{{ t('hero.line2') }}</span></span>
          <span class="line"><span class="line-in grad">{{ t('hero.line3') }}</span></span>
        </h1>
        <div class="hero-foot">
          <p class="hero-sub">{{ t('hero.sub') }}</p>
          <div class="hero-actions"><StoreButton /></div>
        </div>
      </div>
    </div>
    <div class="hero-hint">
      <div class="hero-hint-in">
        <span>{{ t('hero.scroll') }}</span>
        <i />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import OyanRing from './OyanRing.vue'
import StoreButton from './StoreButton.vue'
import { useScene, gsap, clamp01 } from '../../composables/useStory'
import { t } from '../../i18n'

const layer = ref(null)

// Доля размера кольца от центра до внутреннего края дуги (см. OyanRing).
const INNER_EDGE = (39.7 - 16.5 / 2) / 100

useScene('hero', layer, ({ tl, layer, q, portal }) => {
  const ring = q('.hero-ring')[0]
  const slot = q('.hero-ring-slot')[0]
  const lines = q('.line')

  // Вступление идёт по времени, а не по прокрутке, и трогает только
  // внутренние элементы. Внешние обёртки оставлены прокрутке — так они не
  // спорят, если начать листать, пока вступление не доиграло.
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .fromTo(
      q('.ring-arc'),
      { attr: { 'stroke-dasharray': '0.01 100' } },
      { attr: { 'stroke-dasharray': '83.5 100' }, duration: 1.5, ease: 'power3.inOut' },
      0.1,
    )
    .from(q('.ring-glow'), { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.2)
    .from(
      q('.ring-dot'),
      { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.4)' },
      0.6,
    )
    .from(q('.line-in'), { yPercent: 118, duration: 1, stagger: 0.11 }, 0.35)
    .from(q('.hero-sub, .hero-actions'), { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.09 }, 0.95)
    .from(q('.hero-hint-in'), { autoAlpha: 0, duration: 0.9 }, 1.5)

  // Куда везти кольцо, чтобы оно встало в центр экрана, и во сколько раз
  // увеличить, чтобы дуга целиком ушла за края. Считаем от места в раскладке
  // (slot), а не от самого кольца: оно к моменту пересчёта уже сдвинуто.
  const toCenter = () => {
    const l = layer.getBoundingClientRect()
    const s = slot.getBoundingClientRect()
    return {
      x: l.left + l.width / 2 - (s.left + s.width / 2),
      y: l.top + l.height / 2 - (s.top + s.height / 2),
    }
  }
  const flyThrough = () => {
    const l = layer.getBoundingClientRect()
    const hole = slot.getBoundingClientRect().width * INNER_EDGE
    return (Math.hypot(l.width, l.height) / 2 / hole) * 1.25
  }

  tl.to(q('.hero-foot'), { autoAlpha: 0, y: -28, duration: 0.2 }, 0)
    .to(q('.hero-hint'), { autoAlpha: 0, duration: 0.1 }, 0)
    .to(lines[0], { xPercent: -70, autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 0.04)
    .to(lines[1], { xPercent: 70, autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 0.08)
    .to(lines[2], { yPercent: 90, autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 0.12)
    .to(ring, { x: () => toCenter().x, y: () => toCenter().y, duration: 0.42, ease: 'power2.inOut' }, 0.04)
    // Разгон к концу — ощущение, что влетаешь внутрь, а не просто увеличиваешь.
    .to(ring, { scale: flyThrough, duration: 0.78, ease: 'power3.in' }, 0.22)
    .to(q('.ring-dot'), { opacity: 0, duration: 0.1 }, 0.18)
    .to(q('.hero-aura'), { opacity: 0, duration: 0.45 }, 0.5)

  // Окно в ленту — отверстие кольца. Лента видна в нём целиком, в миниатюре,
  // и растёт вместе с кольцом: камера влетает в кольцо — и оказывается в
  // ленте. Радиус чуть больше внутреннего края дуги, чтобы край окна
  // спрятался под ней.
  portal((t) => {
    if (t < 0.26) return null
    const b = ring.getBoundingClientRect()
    const l = layer.getBoundingClientRect()
    const r = b.width * (INNER_EDGE + 0.008)
    const x = b.left + b.width / 2 - l.left
    const y = b.top + b.height / 2 - l.top
    return {
      circle: { x, y, r },
      // Масштаб такой, что короткая сторона кадра умещается в отверстии:
      // лента закрывает его целиком и доходит до натурального размера, когда
      // отверстие дорастает до краёв экрана.
      scale: Math.min(1, r / (Math.min(l.width, l.height) / 2)),
      // Центр ленты стоит в центре кольца.
      shift: { x: x - l.width / 2, y: y - l.height / 2 },
      alpha: clamp01((t - 0.26) / 0.14),
    }
  })
})
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-aura {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 46% at 50% 34%, rgba(124, 92, 255, 0.26), transparent 70%),
    radial-gradient(40% 30% at 62% 46%, rgba(206, 92, 255, 0.14), transparent 70%);
  pointer-events: none;
}
.hero-grid {
  position: relative;
  width: 100%;
  max-width: 1180px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.hero-ring-slot {
  width: min(56vw, 32svh, 300px);
  aspect-ratio: 1;
  flex: none;
}
.hero-ring {
  width: 100%;
  height: 100%;
  /* Слой держится растром и растягивается видеокартой: без этого браузер
     перерисовывал бы SVG на каждом шаге увеличения. */
  will-change: transform;
}
.hero-copy {
  position: relative;
  /* Просвет между кольцом и заголовком: слово не должно ложиться на дугу. */
  margin-top: clamp(10px, 2.4svh, 22px);
}
.hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(42px, 13vw, 128px);
  line-height: 1;
  letter-spacing: -0.035em;
}
.line {
  display: block;
  /* Строка выезжает из-под «шторки». Запас сверху и снизу — чтобы шторка не
     срезала «й» и хвосты «р», «у». */
  overflow: hidden;
  padding: 0.1em 0 0.14em;
  margin: -0.1em 0 -0.14em;
  will-change: transform, opacity;
}
.line-in {
  display: inline-block;
  will-change: transform;
}
.grad {
  background: linear-gradient(100deg, #8a5cff 10%, #ce5cff 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-foot {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-sub {
  max-width: 30em;
  margin-top: clamp(16px, 3svh, 28px);
  color: var(--cream-2);
  font-size: clamp(15px, 4.2vw, 19px);
  line-height: 1.5;
  text-wrap: balance;
}
.hero-actions {
  margin-top: clamp(18px, 3.4svh, 32px);
}
.hero-hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(14px, 3svh, 30px);
  display: flex;
  justify-content: center;
}
.hero-hint-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cream-3);
}
.hero-hint-in i {
  width: 1px;
  height: 34px;
  background: linear-gradient(var(--cream-2), transparent);
  animation: hint 2s ease-in-out infinite;
  transform-origin: top;
}
@keyframes hint {
  0%,
  100% {
    transform: scaleY(0.4);
    opacity: 0.4;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* Невысокий экран: подсказка «листай» легла бы на кнопку, а кольцо в полный
   размер упёрлось бы в шапку — уменьшаем его и опускаем блок под неё. */
@media (max-height: 700px) {
  .hero-hint {
    display: none;
  }
  .hero-ring-slot {
    width: min(50vw, 26svh);
  }
  .hero-grid {
    padding-top: 48px;
  }
}
/* Совсем низкий (телефон на боку): уменьшаем и кольцо. */
@media (max-height: 560px) and (orientation: landscape) {
  .hero-ring-slot {
    width: min(30vw, 26svh);
  }
}

/* Без анимаций подсказка «листай» ни к чему. */
.is-static .hero-hint {
  display: none;
}

@media (min-width: 900px) {
  .hero-grid {
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    max-width: 1320px;
    padding: 0 48px;
    gap: 40px;
  }
  .hero-ring-slot {
    width: min(34vw, 60svh, 460px);
  }
  .hero-copy {
    margin-top: 0;
  }
  /* Размер подобран так, чтобы самое длинное слово и кольцо помещались в ряд
     на любой ширине от 900px. */
  .hero-title {
    font-size: clamp(54px, 6.5vw, 112px);
    white-space: nowrap;
  }
  .hero-foot {
    align-items: flex-start;
  }
  .hero-sub {
    text-wrap: pretty;
  }
}
</style>
