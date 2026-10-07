import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Главная устроена как ролик: один закреплённый «экран» (stage), на нём сцены
// лежат слоями, а прокрутка играет роль перемотки.
//
// Шкала времени одна на всю историю (master): сцены — её отрезки, идущие
// подряд. Одна шкала, а не по шкале на сцену, потому что переходы между
// сценами сквозные: следующая сцена видна внутри предыдущей (в кольце, в
// экране телефона) и растёт вместе с ней. Будь у каждой сцены своя шкала со
// своим запаздыванием, на стыке они расходились бы и переход рвался.

gsap.registerPlugin(ScrollTrigger)
// На iPhone адресная строка прячется при прокрутке и меняет высоту окна.
// Пересчитывать из-за этого всю историю нельзя — картинка дёргается.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

// Без анимаций: системная настройка «уменьшить движение» или ?motion=off в
// адресе (запасной выход и способ проверить статичную версию). Тогда сцены
// показываются обычной страницей, одна под другой.
export function motionOff() {
  if (typeof window === 'undefined') return true
  if (new URLSearchParams(window.location.search).get('motion') === 'off') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Место элемента внутри слоя по раскладке, без учёта transform — ни своего, ни
// слоя. Нужно, когда окно ведёт к предмету в следующей сцене: её слой в это
// время сам масштабируется, и getBoundingClientRect вернул бы уже сдвинутое.
export function layoutRect(el, layer) {
  let left = 0
  let top = 0
  for (let node = el; node && node !== layer; node = node.offsetParent) {
    left += node.offsetLeft
    top += node.offsetTop
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight }
}

// Сцены сами сообщают о себе: слой и функция, которая наполняет их отрезок
// шкалы. Собирает историю startStory — когда все сцены уже на странице.
const registry = new Map()

// build({ tl, layer, q, portal }) наполняет отрезок сцены. Позиции и
// длительности — в долях сцены: 0 — началась, 1 — закончилась.
//  q      — поиск внутри слоя;
//  portal — задаёт «окно» в следующую сцену (см. ниже);
//  return — необязательная функция paint: дорисовывает то, что твином не
//           выразить (текст счётчика, положение карусели). Вызывается на
//           каждом кадре, где шкала сдвинулась. Не через onUpdate твинов: при
//           пересчёте позиций ScrollTrigger ставит шкалу на место без событий,
//           и onUpdate не срабатывает.
// Корень слоя build не трогает: его видимостью и обрезкой управляет история.
export function useScene(name, layerRef, build) {
  let layer = null
  onMounted(() => {
    layer = layerRef.value
    if (layer) registry.set(name, { layer, build })
  })
  onUnmounted(() => {
    // Сравнение со своим слоем: при смене языка новая сцена с тем же именем
    // может зарегистрироваться раньше, чем размонтируется старая.
    if (registry.get(name)?.layer === layer) registry.delete(name)
  })
}

// ── Окно в следующую сцену ──
// Сцена может объявить portal(fn). Пока она на экране, fn(t) вызывается на
// каждом кадре (t — время сцены 0..1) и возвращает null или описание окна.
// Все координаты — в пикселях кадра (stage):
//   circle { x, y, r } или rect { left, top, right, bottom, radius } — форма;
//   scale — масштаб следующей сцены внутри окна, shift { x, y } — куда смещён
//           её центр. С ними следующая сцена видна в окне целиком, в
//           миниатюре, и растёт вместе с ним — камера именно влетает в неё.
//           Без них окно просто открывает кусок сцены в натуральную величину;
//   alpha — прозрачность следующей сцены в окне (по умолчанию 1);
//   color, veil — цвет и плотность заливки поверх следующей сцены: пока окно
//           маленькое, оно выглядит как сам предмет (плашка баннера, тёмный
//           экран телефона), и только потом сквозь него проступает сцена.
// Форма считается от реального положения предмета на экране, поэтому окно
// всегда совпадает с ним, как бы ни шла прокрутка.

let story = null

// scenes — [{ name, len }]: порядок сцен и их длина в процентах высоты экрана
// (те же числа, что у распорок в разметке).
export function startStory(root, scenes) {
  stopStory()
  if (!root || motionOff()) return

  const items = []
  let master
  let dirty = true
  let stale = true

  const ctx = gsap.context(() => {
    master = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        // scrub с запаздыванием: картинка догоняет палец плавно, без рывков.
        scrub: 0.5,
        invalidateOnRefresh: true,
        // После пересчёта позиций (загрузка, поворот экрана, смена размеров)
        // шкалу надо «прогреть» заново, а кадр — дорисовать, даже если она
        // не сдвинулась. См. frame.
        onRefresh: () => (dirty = stale = true),
      },
    })

    let at = 0
    for (const { name, len } of scenes) {
      const reg = registry.get(name)
      if (!reg) continue
      const { layer, build } = reg
      const item = { name, layer, start: at, dur: len / 100, portal: null, paint: null, visible: null, clipped: false }

      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      item.paint =
        build({ tl, layer, q: gsap.utils.selector(layer), portal: (fn) => (item.portal = fn) }) || null
      // Отрезок сцены всегда длиной ровно 1, чем бы ни закончились твины…
      tl.set({}, {}, 1)
      // …и растягивается на свою долю общей шкалы.
      tl.duration(item.dur)
      master.add(tl, at)
      at += item.dur

      // Заливка окна — отдельный элемент поверх содержимого слоя.
      item.veil = document.createElement('i')
      item.veil.className = 'portal-veil'
      layer.appendChild(item.veil)

      items.push(item)
    }
  }, root)

  const local = (item, time) => clamp01((time - item.start) / item.dur)

  let last = -1
  const frame = () => {
    // Прогрев: проигрываем шкалу до конца и возвращаем на место. При пересчёте
    // позиций ScrollTrigger сбрасывает твины, и те, до которых шкала ещё не
    // дошла, теряют стартовое состояние — скрытый элемент оказывается виден
    // раньше времени (так было с частью твинов со stagger). Проход до конца
    // заставляет каждый твин заново запомнить, откуда и куда он ведёт.
    if (stale) {
      stale = false
      const at = master.totalTime()
      master.totalTime(master.totalDuration(), true).totalTime(at, true)
    }

    const time = master.time()
    if (time === last && !dirty) return
    last = time
    dirty = false

    // Текущая сцена — последняя из начавшихся.
    let current = items[0]
    for (const item of items) if (time >= item.start - 1e-6) current = item

    items.forEach((item, i) => {
      // Окно в эту сцену открывает предыдущая — пока она текущая.
      const prev = items[i - 1]
      const shape = prev === current && prev.portal ? prev.portal(local(prev, time)) : null

      const visible = item === current || Boolean(shape)
      if (visible !== item.visible) {
        item.visible = visible
        item.layer.style.visibility = visible ? 'visible' : 'hidden'
      }

      const s = item.layer.style
      if (shape) {
        const clip = windowStyle(item.layer, shape)
        s.clipPath = s.webkitClipPath = clip.path
        s.transform = clip.transform
        s.opacity = shape.alpha ?? 1
        item.veil.style.background = shape.color || 'transparent'
        item.veil.style.opacity = shape.veil ?? 0
        item.clipped = true
      } else if (item.clipped) {
        s.clipPath = s.webkitClipPath = s.transform = ''
        s.opacity = ''
        item.veil.style.opacity = 0
        item.clipped = false
      }

      if (visible && item.paint) item.paint(local(item, time))
    })
  }
  gsap.ticker.add(frame)
  frame()

  story = { ctx, frame, items }
}

// Окно в координатах кадра → clip-path и transform слоя. Слой масштабируется
// вокруг своего центра, а clip-path задаётся в его собственных координатах (до
// масштаба), поэтому точки окна пересчитываются обратным преобразованием.
function windowStyle(layer, shape) {
  const w = layer.offsetWidth
  const h = layer.offsetHeight
  const k = shape.scale ?? 1
  const dx = shape.shift?.x ?? 0
  const dy = shape.shift?.y ?? 0
  const lx = (x) => w / 2 + (x - w / 2 - dx) / k
  const ly = (y) => h / 2 + (y - h / 2 - dy) / k
  const px = (v) => `${v.toFixed(1)}px`

  let path
  if (shape.circle) {
    const c = shape.circle
    path = `circle(${px(c.r / k)} at ${px(lx(c.x))} ${px(ly(c.y))})`
  } else {
    const r = shape.rect
    const edge = (v) => px(Math.max(0, v))
    path = `inset(${edge(ly(r.top))} ${edge(w - lx(r.right))} ${edge(h - ly(r.bottom))} ${edge(lx(r.left))} round ${px((r.radius || 0) / k)})`
  }
  const moved = k !== 1 || dx || dy
  return { path, transform: moved ? `translate(${px(dx)}, ${px(dy)}) scale(${k.toFixed(4)})` : '' }
}

export function stopStory() {
  if (!story) return
  gsap.ticker.remove(story.frame)
  for (const item of story.items) {
    item.veil.remove()
    const s = item.layer.style
    s.visibility = s.clipPath = s.webkitClipPath = s.transform = s.opacity = ''
  }
  story.ctx.revert()
  story = null
}
