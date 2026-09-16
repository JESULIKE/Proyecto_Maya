/**
 * useTextbookStore.js
 *
 * Central reactive store for the Intelligent Textbook.
 * Tracks learning telemetry, per-concept mastery, adaptive state,
 * completed phases, and study data (flashcards / summaries).
 *
 * Uses module-level state so every module and the page share the same store.
 */
import { ref, computed, reactive } from 'vue'

// ---------------------------------------------------------------------------
// Module / concept metadata (shared across the textbook)
// ---------------------------------------------------------------------------
export const MODULES = [
  { id: 'vocales', title: 'Vocales', icon: '🟢', color: 'green', concepts: ['a', 'e', 'i', 'o', 'u'] },
  { id: 'silabas', title: 'Sílabas', icon: '🔵', color: 'blue', concepts: ['ba', 'cha', 'che', 'ke', 'la', 'ma', 'na', 'po', 'wi'] },
  { id: 'bloques', title: 'Bloques', icon: '🟣', color: 'purple', concepts: ['posiciones', 'orden', 'composicion'] },
  { id: 'lectura', title: 'Lectura', icon: '🟠', color: 'orange', concepts: ['logogramas', 'complementos', 'orden-lectura'] },
  { id: 'escritura', title: 'Escritura', icon: '🔴', color: 'red', concepts: ['transcripcion', 'armonia', 'glifos'] },
]

// ---------------------------------------------------------------------------
// Module-level (shared) state
// ---------------------------------------------------------------------------
const telemetry = reactive({}) // { conceptId: { attempts, correct, timeMs, lastResult } }
const conceptMastery = reactive({}) // { conceptId: 0..100 }
const completedPhases = reactive(new Set())
const phaseStars = reactive({}) // { 'module-phase': stars }
const sessionStart = ref(Date.now())
const activeModule = ref('vocales')
const activePhase = ref('learn')
const adaptiveRemediation = reactive({}) // { conceptId: { active, level, insertedAt } }
const studyHighlights = ref([]) // user highlights for study tools
const readingTime = reactive({}) // { 'module-phase': ms }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function conceptKey(moduleId, concept) {
  return `${moduleId}:${concept}`
}

function recordAttempt(moduleId, concept, correct) {
  const key = conceptKey(moduleId, concept)
  if (!telemetry[key]) telemetry[key] = { attempts: 0, correct: 0, timeMs: 0, lastResult: null }
  telemetry[key].attempts++
  if (correct) telemetry[key].correct++
  telemetry[key].lastResult = correct
  recomputeMastery(moduleId, concept)
  return telemetry[key]
}

function recomputeMastery(moduleId, concept) {
  const key = conceptKey(moduleId, concept)
  const t = telemetry[key]
  if (!t || t.attempts === 0) {
    conceptMastery[key] = 0
    return
  }
  // Mastery = correct ratio, weighted by attempts (more attempts = more confidence)
  const ratio = t.correct / t.attempts
  const confidence = Math.min(1, t.attempts / 3)
  conceptMastery[key] = Math.round(ratio * 100 * confidence)
}

function getMastery(moduleId, concept) {
  return conceptMastery[conceptKey(moduleId, concept)] || 0
}

function getModuleMastery(moduleId) {
  const mod = MODULES.find(m => m.id === moduleId)
  if (!mod) return 0
  const scores = mod.concepts.map(c => getMastery(moduleId, c))
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

function getOverallMastery() {
  const scores = MODULES.map(m => getModuleMastery(m.id))
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

function getKnowledgeGaps() {
  const gaps = []
  for (const mod of MODULES) {
    for (const concept of mod.concepts) {
      const m = getMastery(mod.id, concept)
      if (m < 60) {
        gaps.push({ module: mod.id, moduleTitle: mod.title, concept, mastery: m })
      }
    }
  }
  return gaps.sort((a, b) => a.mastery - b.mastery)
}

// Adaptive: decide if a concept needs remediation
function needsRemediation(moduleId, concept) {
  const m = getMastery(moduleId, concept)
  return m < 50
}

function setRemediation(moduleId, concept, level) {
  const key = conceptKey(moduleId, concept)
  adaptiveRemediation[key] = { active: true, level, insertedAt: Date.now() }
}

function clearRemediation(moduleId, concept) {
  const key = conceptKey(moduleId, concept)
  if (adaptiveRemediation[key]) adaptiveRemediation[key].active = false
}

function markPhaseComplete(moduleId, phase, stars) {
  completedPhases.value.add(`${moduleId}-${phase}`)
  phaseStars[`${moduleId}-${phase}`] = stars
}

function isPhaseComplete(moduleId, phase) {
  return completedPhases.value.has(`${moduleId}-${phase}`)
}

function recordReadingTime(moduleId, phase, ms) {
  const key = `${moduleId}-${phase}`
  readingTime[key] = (readingTime[key] || 0) + ms
}

function getReadingTime(moduleId, phase) {
  return readingTime[`${moduleId}-${phase}`] || 0
}

function addHighlight(text) {
  if (!text || studyHighlights.value.includes(text)) return
  studyHighlights.value.push(text)
}

function resetAll() {
  for (const k of Object.keys(telemetry)) delete telemetry[k]
  for (const k of Object.keys(conceptMastery)) delete conceptMastery[k]
  completedPhases.value.clear()
  for (const k of Object.keys(phaseStars)) delete phaseStars[k]
  for (const k of Object.keys(adaptiveRemediation)) delete adaptiveRemediation[k]
  for (const k of Object.keys(readingTime)) delete readingTime[k]
  studyHighlights.value = []
  sessionStart.value = Date.now()
}

// ---------------------------------------------------------------------------
// Exposed API
// ---------------------------------------------------------------------------
export function useTextbookStore() {
  return reactive({
    // state
    telemetry,
    conceptMastery,
    completedPhases,
    phaseStars,
    adaptiveRemediation,
    studyHighlights,
    readingTime,
    sessionStart,
    activeModule,
    activePhase,
    // metadata
    MODULES,
    // actions
    recordAttempt,
    getMastery,
    getModuleMastery,
    getOverallMastery,
    getKnowledgeGaps,
    needsRemediation,
    setRemediation,
    clearRemediation,
    markPhaseComplete,
    isPhaseComplete,
    recordReadingTime,
    getReadingTime,
    addHighlight,
    resetAll,
  })
}
