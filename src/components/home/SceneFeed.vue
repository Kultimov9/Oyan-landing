<template>
  <!-- Сцена 2. Лента несётся быстрее, чем крутит палец; счётчик времени
       убегает; сверху падает баннер Oyan — и лента гаснет. -->
  <section ref="layer" class="layer feed-scene">
    <div class="feed">
      <div class="feed-cols">
        <div v-for="(col, ci) in COLUMNS" :key="ci" class="feed-col">
          <article v-for="post in col" :key="post.id" class="post">
            <div class="post-head">
              <i class="post-ava" :style="{ background: post.grad }" />
              <span class="post-lines"><i /><i /></span>
            </div>
            <div class="post-media" :style="{ background: post.grad, aspectRatio: post.ratio }">
              <b v-if="post.tag != null" class="post-tag">{{ tags[post.tag] }}</b>
              <i class="post-play" />
            </div>
            <div class="post-foot">
              <i class="post-dot" /><i class="post-dot" /><i class="post-dot" />
              <span class="post-lines"><i /><i /></span>
            </div>
          </article>
        </div>
      </div>
    </div>
    <div class="feed-shade" />

    <div class="caps">
      <p class="cap cap-1">{{ t('feed.cap1') }}</p>
      <div class="cap cap-clock">
        <span ref="clockEl" class="clock-num">00:01</span>
        <span class="clock-label">{{ t('feed.clockLabel') }}</span>
      </div>
      <p class="cap cap-2">{{ t('feed.cap2') }}</p>
      <div class="cap cap-3">
        <p class="cap-title">{{ t('feed.cap3') }}</p>
        <p class="cap-sub">{{ t('feed.cap3Sub') }}</p>
        <p class="cap-fine">{{ t('feed.fine') }}</p>
      </div>
    </div>

    <!-- Тот самый баннер анти-скролла: текст — как в приложении. -->
    <div class="banner">
      <div class="banner-icon"><OyanRing /></div>
      <div class="banner-text">
        <p class="banner-top">
          <b>{{ t('feed.bannerTitle') }}</b>
          <span>{{ t('feed.bannerNow') }}</span>
        </p>
        <p class="banner-body">{{ t('feed.bannerBody') }}</p>
      </div>
      <i class="banner-tap" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import OyanRing from './OyanRing.vue'
import { useScene, clamp01, layoutRect } from '../../composables/useStory'
import { t } from '../../i18n'

const layer = ref(null)
const clockEl = ref(null)
const tags = computed(() => t('feed.tags'))

// Кричащие цвета ленты — нарочно чужие спокойной палитре Oyan: на их фоне
// тёмный экран приложения читается как тишина.
const GRADS = [
  'linear-gradient(160deg, #ff5f6d, #ffc371)',
  'linear-gradient(160deg, #00c6ff, #0072ff)',
  'linear-gradient(160deg, #f953c6, #b91d73)',
  'linear-gradient(160deg, #f7971e, #ffd200)',
  'linear-gradient(160deg, #11998e, #38ef7d)',
  'linear-gradient(160deg, #fc466b, #3f5efb)',
  'linear-gradient(160deg, #ee0979, #ff6a00)',
  'linear-gradient(160deg, #00f260, #0575e6)',
  'linear-gradient(160deg, #fdc830, #f37335)',
]
const RATIOS = ['4 / 5', '1 / 1', '4 / 5', '9 / 14']

// Три колонки по шесть постов. Картинки и подписи расставлены по формуле, а не
// случайно: лента одинаковая при каждой загрузке и при смене языка.
const COLUMNS = [0, 1, 2].map((c) =>
  Array.from({ length: 6 }, (_, i) => {
    const n = c * 6 + i
    return {
      id: n,
      grad: GRADS[(n * 4 + c) % GRADS.length],
      ratio: RATIOS[(n + c) % RATIOS.length],
      // Подпись — на каждом втором посте.
      tag: (i + c) % 2 === 0 ? (n + c) % 6 : null,
    }
  }),
)

const pad = (n) => String(n).padStart(2, '0')

useScene('feed', layer, ({ tl, layer, q, portal }) => {
  const cols = q('.feed-col')
  const banner = q('.banner')[0]

  // Колонки едут с разной скоростью — у ленты появляется глубина. Быстро до
  // появления баннера, потом почти останавливаются.
  const speeds = [-50, -68, -44]
  cols.forEach((col, i) => {
    tl.fromTo(col, { yPercent: i === 1 ? 4 : 10 }, { yPercent: speeds[i], duration: 0.62 }, 0)
    tl.to(col, { yPercent: speeds[i] - 3, duration: 0.3, ease: 'power2.out' }, 0.62)
  })
  // Первый кадр сцены виден ещё из кольца (в миниатюре), поэтому лента в нём
  // уже на месте — без появления.

  // Подписи сменяют друг друга склейками, как субтитры в ролике.
  const pop = (el, at, hold) => {
    tl.fromTo(
      el,
      { autoAlpha: 0, scale: 0.86, y: 24 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.035, ease: 'power2.out' },
      at,
    )
    if (hold) tl.to(el, { autoAlpha: 0, y: -22, duration: 0.03, ease: 'power1.in' }, at + hold)
  }
  pop(q('.cap-1'), 0.05, 0.1)

  // Время в ленте: от секунды до сорока семи минут, с разгоном.
  const clock = { s: 1 }
  pop(q('.cap-clock'), 0.18, 0.27)
  tl.to(clock, { s: 47 * 60, duration: 0.25, ease: 'power2.in' }, 0.19)
  pop(q('.cap-2'), 0.49, 0.1)

  // Баннер падает сверху, лента гаснет.
  tl.fromTo(
    banner,
    { yPercent: -260, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, duration: 0.07, ease: 'back.out(1.5)' },
    0.61,
  )
    .to(q('.feed-shade'), { opacity: 0.86, duration: 0.1 }, 0.61)
    .fromTo(q('.cap-3'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.68)
    .from(q('.cap-sub, .cap-fine'), { autoAlpha: 0, y: 16, duration: 0.04, stagger: 0.02 }, 0.71)

  // Тап по баннеру: текст на нём гаснет, остаётся пустая плашка…
  tl.fromTo(q('.banner-tap'), { scale: 0, opacity: 0.55 }, { scale: 1, opacity: 0, duration: 0.05 }, 0.85)
    .to(banner, { scale: 0.96, duration: 0.015 }, 0.85)
    .to(banner, { scale: 1, duration: 0.02 }, 0.865)
    .to(q('.banner-icon, .banner-text'), { opacity: 0, duration: 0.03 }, 0.87)
    .to(q('.cap-3'), { autoAlpha: 0, y: -24, duration: 0.04 }, 0.87)

  // …и плашка превращается в экран телефона: едет на его место в следующей
  // сцене и принимает его форму, а лента за ней гаснет дочерна. open — доля
  // пути: 0 — окно на месте баннера, 1 — на месте экрана телефона.
  const open = { p: 0 }
  tl.to(q('.feed-shade'), { opacity: 1, duration: 0.1 }, 0.88)
    // Сам баннер прячем в тот же миг, когда появляется окно: оно того же
    // размера и цвета, подмены не видно.
    .to(banner, { autoAlpha: 0, duration: 0.001 }, 0.9)
    .to(open, { p: 1, duration: 0.1, ease: 'power2.inOut' }, 0.9)

  portal(() => {
    const screen = document.querySelector('.timer-scene .phone-screen')
    if (open.p <= 0 || !screen) return null
    const to = layoutRect(screen, screen.closest('.layer'))
    const mix = (a, b) => a + (b - a) * open.p
    const rect = {
      left: mix(banner.offsetLeft, to.left),
      top: mix(banner.offsetTop, to.top),
      right: mix(banner.offsetLeft + banner.offsetWidth, to.left + to.width),
      bottom: mix(banner.offsetTop + banner.offsetHeight, to.top + to.height),
      radius: mix(26, parseFloat(getComputedStyle(screen).borderTopLeftRadius)),
    }
    // Экран приложения едет вместе с окном: он увеличен так, чтобы закрывать
    // его целиком, а его середина (циферблат) стоит в середине окна. Окно
    // растёт вокруг неё, а не открывает неподвижную картинку по кускам.
    const w = rect.right - rect.left
    const h = rect.bottom - rect.top
    const scale = Math.max(w / to.width, h / to.height)
    const cx = layer.clientWidth / 2
    const cy = layer.clientHeight / 2
    return {
      rect,
      scale,
      shift: {
        x: rect.left + w / 2 - cx - scale * (to.left + to.width / 2 - cx),
        y: rect.top + h / 2 - cy - scale * (to.top + to.height / 2 - cy),
      },
      // Сначала окно — та же плашка баннера, по дороге сквозь неё проступает
      // экран приложения.
      color: '#2e283a',
      veil: 1 - clamp01((open.p - 0.25) / 0.45),
    }
  })

  // Цифры счётчика.
  return () => {
    const s = Math.round(clock.s)
    if (clockEl.value) clockEl.value.textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
  }
})
</script>

<style scoped>
/* ── Лента ── */
.feed {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.feed-cols {
  position: absolute;
  top: 0;
  left: 50%;
  display: flex;
  gap: 14px;
  /* Наклон и запас по масштабу: лента идёт по диагонали и нигде не кончается. */
  transform: translateX(-50%) rotate(-7deg) scale(1.16);
  transform-origin: 50% 30%;
}
.feed-col {
  width: min(64vw, 300px);
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  will-change: transform;
}
.post {
  background: #17131f;
  border-radius: 22px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.post-head,
.post-foot {
  display: flex;
  align-items: center;
  gap: 8px;
}
.post-ava {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: none;
}
.post-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.post-lines i {
  height: 7px;
  border-radius: 4px;
  background: rgba(245, 240, 232, 0.16);
  width: 62%;
}
.post-lines i + i {
  width: 38%;
  background: rgba(245, 240, 232, 0.09);
}
.post-media {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 12px;
}
.post-tag {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 19px;
  line-height: 1.05;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
  max-width: 90%;
}
.post-play {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 0;
  height: 0;
  border-left: 13px solid rgba(255, 255, 255, 0.9);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}
.post-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(245, 240, 232, 0.32);
  flex: none;
}
.post-foot .post-lines {
  margin-left: 6px;
}
/* На широком экране колонки растут вместе с окном — лента занимает его целиком. */
@media (min-width: 900px) {
  .feed-col {
    width: 31vw;
    gap: 18px;
  }
  .feed-cols {
    gap: 18px;
  }
  .post {
    padding: 16px;
    border-radius: 28px;
  }
  .post-tag {
    font-size: clamp(22px, 2.4vw, 40px);
  }
}
.feed-shade {
  position: absolute;
  inset: 0;
  background: var(--ink);
  opacity: 0.42;
  pointer-events: none;
}

/* ── Подписи ── */
.caps {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.cap {
  position: absolute;
  left: 24px;
  right: 24px;
  top: 50%;
  translate: 0 -50%;
  text-align: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(30px, 8.6vw, 76px);
  line-height: 1.06;
  letter-spacing: -0.03em;
  text-shadow:
    0 2px 6px rgba(11, 6, 18, 0.5),
    0 6px 60px rgba(11, 6, 18, 0.9);
  text-wrap: balance;
  will-change: transform, opacity;
}
.cap-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.clock-num {
  font-size: clamp(64px, 21vw, 190px);
  font-weight: 800;
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}
.clock-label {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--cream);
  background: rgba(11, 6, 18, 0.72);
  padding: 6px 14px;
  border-radius: 999px;
  text-shadow: none;
}
.cap-3 {
  /* Ниже центра: сверху место занято баннером. */
  top: 58%;
  max-width: 760px;
  margin: 0 auto;
}
.cap-title {
  font-size: clamp(28px, 7.6vw, 64px);
}
.cap-sub,
.cap-fine {
  font-family: var(--font-body);
  font-weight: 400;
  letter-spacing: 0;
  text-shadow: none;
  text-wrap: balance;
}
.cap-sub {
  margin-top: 16px;
  font-size: clamp(16px, 4.3vw, 21px);
  line-height: 1.45;
  color: var(--cream);
}
.cap-fine {
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--cream-2);
}

/* ── Баннер ── */
.banner {
  position: absolute;
  top: clamp(76px, 12svh, 120px);
  left: 0;
  right: 0;
  margin: 0 auto;
  width: min(calc(100vw - 28px), 430px);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px 13px 13px;
  border-radius: 26px;
  /* Плотная заливка вместо backdrop-filter: размытие фона под движущейся
     лентой на телефонах стоит кадров. */
  background: #2e283a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  will-change: transform, opacity;
}
.banner-icon {
  width: 42px;
  height: 42px;
  flex: none;
  padding: 7px;
  border-radius: 11px;
  background: #0f0618;
}
.banner-text {
  flex: 1;
  min-width: 0;
}
.banner-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-size: 15px;
}
.banner-top b {
  font-weight: 600;
}
.banner-top span {
  font-size: 13px;
  color: rgba(245, 240, 232, 0.5);
  flex: none;
}
.banner-body {
  font-size: 15px;
  line-height: 1.3;
  color: rgba(245, 240, 232, 0.92);
}
.banner-tap {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  background: rgba(245, 240, 232, 0.5);
  opacity: 0;
  pointer-events: none;
}

/* ── Без анимаций ── Только суть сцены: баннер и объяснение под ним. */
.is-static .feed-scene {
  min-height: 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 28px;
  padding: 72px 24px;
}
.is-static .feed,
.is-static .feed-shade,
.is-static .cap-1,
.is-static .cap-clock,
.is-static .cap-2,
.is-static .banner-tap {
  display: none;
}
.is-static .caps,
.is-static .cap-3,
.is-static .banner {
  position: static;
  translate: none;
}
</style>
