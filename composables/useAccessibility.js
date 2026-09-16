/**
 * useAccessibility.js
 *
 * Universal accessibility for the Intelligent Textbook:
 *  - Text-to-speech narration (Web Speech API)
 *  - Font size adjustment
 *  - Dyslexia-friendly mode (OpenDyslexic-like letter spacing / line height)
 *  - High contrast mode
 *  - Multi-language translation of UI strings
 *  - Pop-up glossary
 *
 * Uses module-level reactive state so settings persist across modules.
 */
import { ref, computed, reactive } from 'vue'

// ---------------------------------------------------------------------------
// Translations (ES / EN) for key UI strings
// ---------------------------------------------------------------------------
const translations = {
  es: {
    learn: 'Aprender',
    practice: 'Practicar',
    test: 'Evaluar',
    next: 'Siguiente',
    previous: 'Anterior',
    correct: '¡Correcto!',
    tryAgain: 'Intenta otra vez',
    start: 'Empezar',
    complete: 'Completar',
    dashboard: 'Panel de Progreso',
    studyTools: 'Herramientas de Estudio',
    accessibility: 'Accesibilidad',
    glossary: 'Glosario',
  },
  en: {
    learn: 'Learn',
    practice: 'Practice',
    test: 'Test',
    next: 'Next',
    previous: 'Previous',
    correct: 'Correct!',
    tryAgain: 'Try again',
    start: 'Start',
    complete: 'Complete',
    dashboard: 'Progress Dashboard',
    studyTools: 'Study Tools',
    accessibility: 'Accessibility',
    glossary: 'Glossary',
  },
}

// ---------------------------------------------------------------------------
// Glossary (pop-up definitions)
// ---------------------------------------------------------------------------
const glossary = [
  { term: 'Glifo', definition: 'Un símbolo o dibujo que representa un sonido o una palabra.' },
  { term: 'Logograma', definition: 'Un glifo que representa una palabra completa, como TUUN (piedra).' },
  { term: 'Sílabograma', definition: 'Un glifo que representa una sílaba, como BA o LA.' },
  { term: 'Complemento fonético', definition: 'Un glifo pequeño que ayuda a pronunciar un logograma.' },
  { term: 'Armonía vocálica', definition: 'Cuando la vocal muda final es igual a la vocal anterior.' },
  { term: 'Oclusión glotal', definition: 'Una pausa brusca en la garganta, marcada con un apóstrofe (\').' },
  { term: 'Thompson', definition: 'Un código numérico que identifica cada glifo maya.' },
  { term: 'Estela', definition: 'Una piedra tallada con inscripciones, común en la cultura maya.' },
]

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------
const settings = reactive({
  ttsEnabled: false,
  ttsRate: 1,
  fontSize: 100, // percent
  dyslexiaMode: false,
  highContrast: false,
  language: 'es',
  glossaryOpen: false,
  glossaryTerm: null,
})

let speechSynthesis = null
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis = window.speechSynthesis
}

// ---------------------------------------------------------------------------
// TTS
// ---------------------------------------------------------------------------
function speak(text) {
  if (!settings.ttsEnabled || !speechSynthesis) return
  speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = settings.language === 'es' ? 'es-ES' : 'en-US'
  utterance.rate = settings.ttsRate
  speechSynthesis.speak(utterance)
}

function stopSpeaking() {
  if (speechSynthesis) speechSynthesis.cancel()
}

// ---------------------------------------------------------------------------
// Translation
// ---------------------------------------------------------------------------
function t(key) {
  const dict = translations[settings.language] || translations.es
  return dict[key] || key
}

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------
function openGlossary(term) {
  settings.glossaryTerm = term
  settings.glossaryOpen = true
}

function closeGlossary() {
  settings.glossaryOpen = false
  settings.glossaryTerm = null
}

function getGlossaryDefinition(term) {
  const entry = glossary.find(g => g.term.toLowerCase() === (term || '').toLowerCase())
  return entry ? entry.definition : null
}

// ---------------------------------------------------------------------------
// Computed CSS classes / styles
// ---------------------------------------------------------------------------
const bodyClasses = computed(() => {
  const classes = []
  if (settings.dyslexiaMode) classes.push('dyslexia-mode')
  if (settings.highContrast) classes.push('high-contrast')
  return classes
})

const fontSizeStyle = computed(() => {
  return { fontSize: settings.fontSize + '%' }
})

export function useAccessibility() {
  return reactive({
    settings,
    bodyClasses,
    fontSizeStyle,
    speak,
    stopSpeaking,
    t,
    openGlossary,
    closeGlossary,
    getGlossaryDefinition,
    glossary,
  })
}
