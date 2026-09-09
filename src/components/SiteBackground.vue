<template>
  <!-- Слоистый фон: три плана с разной скоростью, поверх — зерно и виньетка.
       Слои закреплены, не ловят курсор, контент лежит выше. -->
  <div class="site-bg" aria-hidden="true">
    <div class="layer far" />
    <div class="layer mid" />
    <div class="layer near" />
    <div class="layer beam" />
    <div class="layer grain" />
  </div>
</template>

<style scoped>
/* Все слои — бесшовные повторяющиеся узоры, которые двигаются от прокрутки в
   пикселях (--sy). Так движение видно на каждом экране и никогда не кончается.
   Привязка к доле пройденной страницы здесь не годится: страница высотой в 13
   экранов, и за один экран слой сдвигался бы на считаные пиксели.

   Разные скорости дают глубину: дальний план почти стоит, ближний уезжает
   заметно (профиль parallax-storytelling: 0.3 / 0.6 / 1.0 в относительных). */

.site-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
.layer {
  position: absolute;
  inset: 0;
  will-change: background-position;
}

/* Дальний: поле мягких тёплых пятен с большим шагом. */
.far {
  background-image:
    radial-gradient(closest-side, rgba(245, 240, 232, 0.22), transparent 100%),
    radial-gradient(closest-side, rgba(245, 240, 232, 0.16), transparent 100%),
    radial-gradient(closest-side, rgba(245, 240, 232, 0.12), transparent 100%);
  background-size:
    820px 820px,
    600px 600px,
    460px 460px;
  background-position:
    12% calc(var(--sy, 0) * -0.16px),
    80% calc(var(--sy, 0) * -0.12px + 380px),
    48% calc(var(--sy, 0) * -0.2px + 700px);
  background-repeat: repeat;
}

/* Средний: сетка, растворяющаяся к краям. */
.mid {
  background-image:
    repeating-linear-gradient(0deg, rgba(245, 240, 232, 0.065) 0 1px, transparent 1px 84px),
    repeating-linear-gradient(90deg, rgba(245, 240, 232, 0.055) 0 1px, transparent 1px 84px);
  background-position:
    0 calc(var(--sy, 0) * -0.45px),
    calc(var(--sy, 0) * -0.12px) 0;
  -webkit-mask-image: radial-gradient(120% 80% at 50% 30%, #000 15%, transparent 78%);
  mask-image: radial-gradient(130% 95% at 50% 30%, #000 25%, transparent 88%);
}

/* Ближний: россыпь точек, самая быстрая. */
.near {
  background-image:
    radial-gradient(circle at 20% 30%, rgba(245, 240, 232, 0.9) 0 2.4px, transparent 3.2px),
    radial-gradient(circle at 70% 65%, rgba(245, 240, 232, 0.7) 0 1.8px, transparent 2.6px),
    radial-gradient(circle at 45% 85%, rgba(245, 240, 232, 0.55) 0 1.4px, transparent 2.2px);
  background-size:
    240px 240px,
    170px 170px,
    310px 310px;
  background-position:
    0 calc(var(--sy, 0) * -0.8px),
    calc(var(--sy, 0) * -0.1px) calc(var(--sy, 0) * -0.62px),
    0 calc(var(--sy, 0) * -1.05px);
  opacity: 0.9;
}

/* Световой луч: широкая мягкая полоса, проходящая по экрану вместе с
   прокруткой. Даёт ощущение движущегося источника света, а не просто сдвига. */
.beam {
  background-image: linear-gradient(
    100deg,
    transparent 30%,
    rgba(245, 240, 232, 0.07) 45%,
    rgba(245, 240, 232, 0.12) 50%,
    rgba(245, 240, 232, 0.07) 55%,
    transparent 70%
  );
  background-size: 100% 1600px;
  background-position: 0 calc(var(--sy, 0) * -0.55px);
  background-repeat: repeat-y;
}

/* Зерно и виньетка неподвижны: движущаяся текстура читается как дефект. */
.grain {
  background-image:
    radial-gradient(130% 105% at 50% 40%, transparent 52%, rgba(0, 0, 0, 0.42) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .layer {
    background-position: 0 0;
  }
}
</style>
