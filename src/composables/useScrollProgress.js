import { onMounted, onUnmounted } from 'vue'

// Единый источник прогресса скролла на всю страницу.
//
// Секция регистрирует свой элемент и получает в CSS-переменной --p долю пути,
// пройденного через экран: 0 — только показалась снизу, 1 — полностью ушла
// вверх. Дальше секция двигает содержимое чистым CSS от этой переменной.
//
// Почему один слушатель: на странице уже было три независимых обработчика
// скролла, и каждая новая анимация добавляла бы ещё один. Здесь все секции
// пересчитываются за один кадр, поэтому их число не влияет на плавность.
//
// Движение привязано к позиции скролла, а не к триггеру входа — поэтому оно
// обратимо: крутишь назад, и содержимое едет назад.

// Элемент -> ref, в который дублируется прогресс числом (для счётчиков и
// прочего, что нельзя выразить чистым CSS).
const targets = new Map()
let ticking = false
let listening = false

const reduced = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function measure() {
  ticking = false
  const vh = window.innerHeight

  // Общий прогресс страницы 0..1 — им живут фоновые слои. Держим на <html>,
  // чтобы он был доступен любому элементу без прокидывания.
  const doc = document.documentElement
  const max = doc.scrollHeight - vh
  const sp = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  doc.style.setProperty('--sp', sp.toFixed(4))
  // Прокрутка в пикселях. Фоновым слоям нужна именно она: доля от всей
  // страницы бесполезна, когда страница высотой в 13 экранов — за один экран
  // доля меняется на ~0.07, и слой сдвигается на считаные пиксели.
  doc.style.setProperty('--sy', String(Math.round(window.scrollY)))

  for (const [el, out] of targets) {
    const r = el.getBoundingClientRect()
    // Полный путь секции — от появления снизу до ухода за верх экрана.
    const total = vh + r.height
    const passed = vh - r.top
    const p = total > 0 ? Math.min(1, Math.max(0, passed / total)) : 0
    el.style.setProperty('--p', p.toFixed(4))
    if (out) out.value = p
  }
}

function schedule() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(measure)
}

function start() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

function stop() {
  // Снимаем слушатели только когда не осталось ни одной секции.
  if (!listening || targets.size > 0) return
  listening = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
}

// progressRef — необязательный ref: туда дублируется прогресс числом.
export function useScrollProgress(elRef, progressRef = null) {
  onMounted(() => {
    const el = elRef.value
    if (!el) return
    // Уважаем настройку «уменьшить движение»: сразу финальное состояние,
    // слушатель не вешаем вовсе.
    if (reduced()) {
      el.style.setProperty('--p', '1')
      if (progressRef) progressRef.value = 1
      return
    }
    targets.set(el, progressRef)
    start()
    // Первое измерение — синхронно, не через rAF: иначе до первого кадра
    // переменная не задана и CSS берёт запасное значение, из-за чего секция
    // выглядит уже собранной.
    measure()
  })

  onUnmounted(() => {
    if (elRef.value) targets.delete(elRef.value)
    stop()
  })
}
