<template>
  <!-- Сцена 6. Финал зеркалит начало: кольцо, которое в первой сцене
       раскрылось, здесь замыкается — день закрыт. И одна кнопка. -->
  <section ref="layer" class="layer finale">
    <div class="finale-aura" />
    <div class="finale-inner">
      <div class="finale-ring">
        <i class="finale-wave" />
        <!-- С анимацией дуга замыкается по ходу сцены; без неё кольцо сразу целое. -->
        <OyanRing :arc="isStatic ? 100 : 83.5" />
      </div>
      <h2 class="finale-title">{{ t('cta.title') }}</h2>
      <p class="finale-sub">{{ t('cta.sub') }}</p>
      <div class="finale-cta"><StoreButton /></div>
      <p class="finale-trust">{{ t('finale.trust') }}</p>
      <!-- Сколько страницы человек пролистал, пока шёл сюда, — число живое. -->
      <p class="finale-odo">
        {{ odo[0] }}<b>{{ meters }}</b>{{ odo[1] }}<br />{{ t('finale.odo2') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import OyanRing from './OyanRing.vue'
import StoreButton from './StoreButton.vue'
import { useScene, motionOff } from '../../composables/useStory'
import { t } from '../../i18n'

defineProps({
  // Пролистанное расстояние, уже отформатированное («2,3»).
  meters: { type: String, default: '0' },
})

const layer = ref(null)
const isStatic = motionOff()
// Фраза делится по месту числа, чтобы выделить его отдельным элементом.
const odo = computed(() => t('finale.odo1').split('{m}'))

useScene('finale', layer, ({ tl, q }) => {
  // Кольцо уже на месте с первого кадра: сюда оно «приехало» из сцены
  // наставника. Здесь разрыв в дуге закрывается — кольцо замыкается.
  tl.from(q('.finale-aura'), { opacity: 0, duration: 0.3 }, 0)
    .fromTo(
      q('.ring-arc'),
      { attr: { 'stroke-dasharray': '83.5 100' } },
      { attr: { 'stroke-dasharray': '100 100' }, duration: 0.42, ease: 'power1.inOut' },
      0.12,
    )
    .fromTo(
      q('.finale-wave'),
      { scale: 0.8, opacity: 0 },
      {
        keyframes: [
          { scale: 0.95, opacity: 0.6, duration: 0.03 },
          { scale: 2.3, opacity: 0, duration: 0.23, ease: 'power1.out' },
        ],
      },
      0.54,
    )
    .from(q('.finale-title'), { autoAlpha: 0, y: 40, duration: 0.2, ease: 'power3.out' }, 0.1)
    .from(q('.finale-sub'), { autoAlpha: 0, y: 26, duration: 0.18, ease: 'power3.out' }, 0.26)
    .from(q('.finale-cta'), { autoAlpha: 0, y: 26, scale: 0.92, duration: 0.18, ease: 'back.out(1.6)' }, 0.42)
    .from(q('.finale-trust, .finale-odo'), { autoAlpha: 0, y: 14, duration: 0.14, stagger: 0.07 }, 0.6)
})
</script>

<style scoped>
.finale {
  display: flex;
  align-items: center;
  justify-content: center;
}
.finale-aura {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 44% at 50% 30%, rgba(124, 92, 255, 0.3), transparent 70%),
    radial-gradient(70% 40% at 50% 100%, rgba(206, 92, 255, 0.14), transparent 70%);
  pointer-events: none;
}
.finale-inner {
  position: relative;
  width: 100%;
  max-width: 820px;
  padding: clamp(70px, 10svh, 100px) 24px clamp(16px, 3svh, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.finale-ring {
  position: relative;
  width: min(44vw, 26svh, 230px);
  aspect-ratio: 1;
  flex: none;
}
.finale-wave {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(206, 92, 255, 0.7);
  opacity: 0;
  pointer-events: none;
}
.finale-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(34px, 10vw, 92px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  margin-top: clamp(14px, 3svh, 30px);
  text-wrap: balance;
}
.finale-sub {
  margin-top: clamp(10px, 2svh, 18px);
  max-width: 26em;
  color: var(--cream-2);
  font-size: clamp(15px, 4.2vw, 19px);
  line-height: 1.5;
  text-wrap: balance;
}
.finale-cta {
  margin-top: clamp(18px, 3.4svh, 32px);
}
.finale-trust {
  margin-top: 14px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--cream-2);
}
.finale-odo {
  margin-top: clamp(16px, 3.4svh, 34px);
  font-size: 14px;
  line-height: 1.6;
  color: var(--cream-3);
}
.finale-odo b {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--cream);
  font-variant-numeric: tabular-nums;
}
</style>
