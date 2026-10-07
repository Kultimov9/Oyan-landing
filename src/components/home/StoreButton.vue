<template>
  <!-- Кнопка магазина. Пока ссылки нет (APP_STORE_URL пуст) — это не ссылка,
       а подпись «скоро». -->
  <component
    :is="url ? 'a' : 'span'"
    :href="url || undefined"
    :target="url ? '_blank' : undefined"
    rel="noopener"
    class="store-btn"
    :class="{ compact, soon: !url }"
  >
    <span>{{ compact && url ? t('nav.get') : t(url ? 'cta.appStoreReady' : 'cta.appStore') }}</span>
    <svg v-if="url" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
  </component>
</template>

<script setup>
import { APP_STORE_URL } from '../../lib/links'
import { t } from '../../i18n'

defineProps({
  // Короткая версия для шапки: «Скачать».
  compact: { type: Boolean, default: false },
})

const url = APP_STORE_URL
</script>

<style scoped>
.store-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--cream);
  color: var(--ink);
  font-weight: 600;
  font-size: 16px;
  padding: 17px 26px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.25s ease;
  box-shadow: 0 0 0 0 rgba(206, 92, 255, 0);
  white-space: nowrap;
}
a.store-btn:hover {
  box-shadow: 0 10px 40px -6px rgba(206, 92, 255, 0.55);
}
a.store-btn:active {
  transform: scale(0.97);
}
.store-btn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.store-btn.compact {
  font-size: 14px;
  padding: 10px 16px;
  gap: 6px;
}
.store-btn.compact svg {
  width: 11px;
  height: 11px;
}
.store-btn.soon {
  background: transparent;
  color: var(--cream-2);
  border: 1px solid var(--line);
  cursor: default;
}
</style>
