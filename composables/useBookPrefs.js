// composables/useBookPrefs.js
// Preferencias de lectura del libro: tamaño de letra, espaciado para dislexia, alto contraste y lectura en voz alta.
import { reactive, watch } from 'vue'

const KEY = 'maya-libro-prefs-v1'
const SIZES = [100, 115, 130]

const prefs = reactive({ size: 100, spacing: false, contrast: false, voice: false })
let started = false

const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    if (SIZES.includes(raw.size)) prefs.size = raw.size
    prefs.spacing = raw.spacing === true
    prefs.contrast = raw.contrast === true
    prefs.voice = raw.voice === true
  } catch (e) { /* valores por defecto */ }
}

export const useBookPrefs = () => {
  if (!started && typeof window !== 'undefined') {
    started = true
    load()
    watch(prefs, () => {
      try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch (e) { /* sin almacenamiento */ }
    }, { deep: true })
  }

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  return {
    prefs,
    sizes: SIZES,
    canSpeak,
    speak(text) {
      if (!canSpeak || !prefs.voice) return
      const u = new SpeechSynthesisUtterance(String(text).replace(/[*_]/g, ''))
      u.lang = 'es-ES'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    },
    stop() {
      if (canSpeak) window.speechSynthesis.cancel()
    }
  }
}
