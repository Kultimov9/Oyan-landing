// v-reveal: добавляет класс .is-in, когда элемент попадает в область просмотра.
// Появление один раз (unobserve после срабатывания).
// Задержка: v-reveal="200" (мс) — уходит в CSS-переменную --reveal-delay.
// Направление прилёта: v-reveal:left / :right / :zoom (по умолчанию — снизу).
export const reveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.arg) el.classList.add(`reveal-${binding.arg}`)
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-in')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    el._revealIO = io
  },
  unmounted(el) {
    el._revealIO?.disconnect()
  },
}

// v-assemble: разбивает текст элемента на слова-«кусочки». Каждый кусочек
// прилетает со своей случайной траекторией (сдвиг + поворот + блюр) и они
// соединяются в целую фразу. Внутри скроллителлинга (.scrolly-step) сборка
// перезапускается каждый раз, когда шаг становится активным.
function wrapWords(node, state) {
  ;[...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment()
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
        } else {
          const span = document.createElement('span')
          span.className = 'piece'
          span.textContent = part
          span.style.setProperty('--i', state.i++)
          frag.appendChild(span)
        }
      })
      node.replaceChild(frag, child)
    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
      wrapWords(child, state)
    }
  })
}

function scatterPieces(el) {
  // Кусочки стартуют далеко за пределами своего места — случайный угол по кругу,
  // дистанция в масштабе экрана (30–75% ширины), и слетаются со всех сторон.
  const base = Math.min(window.innerWidth, 1000)
  el.querySelectorAll('.piece').forEach((p) => {
    const angle = Math.random() * Math.PI * 2
    const dist = base * (0.3 + Math.random() * 0.45)
    p.style.setProperty('--dx', `${Math.round(Math.cos(angle) * dist)}px`)
    p.style.setProperty('--dy', `${Math.round(Math.sin(angle) * dist)}px`)
    p.style.setProperty('--rot', `${Math.round(Math.random() * 56 - 28)}deg`)
  })
}

export const assemble = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('assemble')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    wrapWords(el, { i: 0 })
    scatterPieces(el)

    // Внутри скроллителлинга сборкой управляет активность шага (см. updated).
    if (el.closest('.scrolly-step')) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('assembled')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.3, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    el._assembleIO = io
  },
  updated(el) {
    const step = el.closest('.scrolly-step')
    if (!step) return
    const active = step.classList.contains('active')
    if (active && !el.classList.contains('assembled')) {
      scatterPieces(el) // новая траектория на каждый показ
      requestAnimationFrame(() => el.classList.add('assembled'))
    } else if (!active && el.classList.contains('assembled')) {
      el.classList.remove('assembled')
    }
  },
  unmounted(el) {
    el._assembleIO?.disconnect()
  },
}

// v-countup="7": число «набегает» от 0 до значения, когда элемент виден.
// Суффикс (например " мин") — через data-suffix на элементе.
export const countup = {
  mounted(el, binding) {
    const to = Number(binding.value)
    if (!Number.isFinite(to)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const suffix = el.dataset.suffix || ''
    el.textContent = '0' + suffix

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(el)
          const start = performance.now()
          const dur = 1400
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1)
            const eased = 1 - Math.pow(1 - p, 4)
            el.textContent = Math.round(to * eased) + suffix
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    el._countupIO = io
  },
  unmounted(el) {
    el._countupIO?.disconnect()
  },
}
