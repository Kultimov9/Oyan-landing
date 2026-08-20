<template>
  <div class="lang" role="group" aria-label="Тіл / Язык">
    <button
      v-for="l in LOCALES"
      :key="l.code"
      class="lang-btn"
      :class="{ on: locale === l.code }"
      :aria-pressed="locale === l.code"
      @click="setLocale(l.code)"
    >
      {{ l.label }}
    </button>
  </div>
</template>

<script setup>
import { LOCALES, locale, setLocale } from '../i18n'
</script>

<style scoped>
.lang {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: 999px;
  flex-shrink: 0;
}
.lang-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Sora', 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.lang-btn:hover {
  color: var(--text-2);
}
.lang-btn.on {
  background: var(--accent);
  color: var(--bg);
}
</style>
