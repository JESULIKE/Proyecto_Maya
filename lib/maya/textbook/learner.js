// lib/maya/textbook/learner.js
// Modelo del estudiante del libro interactivo (funciones puras, sin DOM ni Vue).
//
// Sigue el diseño de K'in (E1 RF-03/RF-04, E3):
//  - Modelo superpuesto: un estado de dominio por concepto del currículo.
//  - Las pistas se retiran tras ≥3 aciertos seguidos; tras un fallo la ayuda SIEMPRE aumenta.
//  - Sin castigo: un fallo nunca baja el dominio de golpe ni quita lo ya revelado.
//  - Repaso espaciado (cajas de Leitner) sin rachas visibles ni presión.
// Es una propuesta pedagógica basada en reglas; los umbrales están en las constantes de abajo.

export const STORAGE_VERSION = 1
export const DAY_MS = 24 * 60 * 60 * 1000

/** Días hasta el próximo repaso por caja (caja 0 = en la próxima sesión). */
export const BOX_DAYS = [0, 1, 3, 7, 14]

export const STREAK_TO_REDUCE_HINTS = 3 // RF-04
export const STREAK_FOR_SUPER = 6
export const MASTERY_THRESHOLD = 0.8
export const MAX_HINT_LEVEL = 3

export const NIVELES = ['Aprendiz', 'Autónomo', 'Súper Pro']

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const finite = (v, d) => (Number.isFinite(v) ? v : d)

export const emptyConcept = () => ({ p: 0, attempts: 0, correct: 0, streak: 0, box: 0, due: 0, seen: false })

export function createLearner(now = Date.now()) {
  return { v: STORAGE_VERSION, alias: '', createdAt: now, concepts: {}, lessons: {} }
}

const conceptOf = (state, id) => ({ ...emptyConcept(), ...(state.concepts[id] || {}) })

/**
 * Registra una respuesta. `hints` es cuántos niveles de pista se usaron (0..3).
 * Devuelve un estado nuevo (inmutable).
 */
export function recordAnswer(state, conceptId, { correct, hints = 0 }, now = Date.now()) {
  const c = conceptOf(state, conceptId)
  const h = clamp(Math.floor(finite(hints, 0)), 0, MAX_HINT_LEVEL)
  c.attempts += 1
  c.seen = true

  if (correct) {
    c.correct += 1
    // Con la solución revelada (3 pistas) no cuenta como logro propio
    const own = h >= MAX_HINT_LEVEL ? 0 : h === 0 ? 0.35 : 0.18
    c.p = clamp(c.p + (1 - c.p) * own, 0, 1)
    if (h < MAX_HINT_LEVEL) c.streak += 1
    if (h === 0) {
      c.box = clamp(c.box + 1, 1, BOX_DAYS.length - 1)
      c.due = now + BOX_DAYS[c.box] * DAY_MS
    } else {
      c.box = Math.max(c.box, 1)
      c.due = now + DAY_MS * (h === 1 ? 1 : 0)
    }
  } else {
    // Sin castigo: el dominio baja poco, la racha se reinicia y el repaso vuelve pronto
    c.p = clamp(c.p * 0.88, 0, 1)
    c.streak = 0
    c.box = 0
    c.due = now
  }
  return { ...state, concepts: { ...state.concepts, [conceptId]: c } }
}

export const masteryOf = (state, id) => conceptOf(state, id).p
export const isMastered = (state, id) => {
  const c = conceptOf(state, id)
  return c.p >= MASTERY_THRESHOLD && c.streak >= STREAK_TO_REDUCE_HINTS
}

/**
 * Nivel de andamiaje de un concepto: 2 = Aprendiz (pista visible),
 * 1 = Autónomo (pista a pedido), 0 = Súper Pro (sin pistas visuales).
 */
export function scaffoldLevel(state, id) {
  const { streak } = conceptOf(state, id)
  if (streak >= STREAK_FOR_SUPER) return 0
  if (streak >= STREAK_TO_REDUCE_HINTS) return 1
  return 2
}

export const levelName = (state, id) => NIVELES[2 - scaffoldLevel(state, id)]

/** Nivel general: Aprendiz → Autónomo (la mitad con pistas reducidas) → Súper Pro (todos sin pistas). */
export function overallLevel(state, conceptIds) {
  if (!conceptIds.length) return NIVELES[0]
  const levels = conceptIds.map((id) => scaffoldLevel(state, id))
  if (levels.every((l) => l === 0)) return NIVELES[2]
  if (levels.filter((l) => l <= 1).length >= Math.ceil(conceptIds.length / 2)) return NIVELES[1]
  return NIVELES[0]
}

export const overallMastery = (state, conceptIds) =>
  conceptIds.length ? conceptIds.reduce((s, id) => s + masteryOf(state, id), 0) / conceptIds.length : 0

/** Conceptos cuyo repaso ya toca (solo los ya vistos). */
export function dueConcepts(state, conceptIds, now = Date.now()) {
  return conceptIds.filter((id) => {
    const c = state.concepts[id]
    return c && c.seen && now >= finite(c.due, 0)
  })
}

// ---------- Currículo: navegación adaptativa ----------

/** Prerrequisitos pendientes de un concepto (blandos: aconsejan, no bloquean). */
export function missingPrereqs(state, curriculum, conceptId) {
  const concept = curriculum.concepts.find((c) => c.id === conceptId)
  return (concept?.prereq || []).filter((id) => !isMastered(state, id))
}

export function lessonStatus(state, curriculum, lesson) {
  const done = !!state.lessons[lesson.id]?.done
  const mastered = lesson.concepts.every((id) => isMastered(state, id))
  const started = lesson.concepts.some((id) => conceptOf(state, id).attempts > 0)
  if (mastered && done) return 'dominada'
  if (done) return 'completada'
  if (started) return 'en-curso'
  return 'nueva'
}

/**
 * Lección recomendada: la primera no completada cuyos prerrequisitos estén cubiertos;
 * si no, la primera no completada. El estudiante puede ir a cualquiera.
 */
export function recommendLesson(state, curriculum) {
  const pending = curriculum.lessons.filter((l) => !state.lessons[l.id]?.done)
  if (!pending.length) return null
  const ready = pending.find((l) => l.concepts.every((c) => missingPrereqs(state, curriculum, c).length === 0))
  return ready || pending[0]
}

export function markLessonDone(state, lessonId, now = Date.now()) {
  const prev = state.lessons[lessonId] || { done: false, completions: 0 }
  return { ...state, lessons: { ...state.lessons, [lessonId]: { done: true, completions: prev.completions + 1, at: now } } }
}

export const setAlias = (state, alias) => ({ ...state, alias: String(alias ?? '').trim().slice(0, 24) })

// ---------- Persistencia segura ----------

/** Reconstruye un estado válido desde datos externos (localStorage puede estar dañado o manipulado). */
export function normalizeLearner(raw, now = Date.now()) {
  const fresh = createLearner(now)
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fresh
  if (raw.v !== STORAGE_VERSION) return fresh
  const state = { ...fresh, createdAt: finite(raw.createdAt, now), alias: typeof raw.alias === 'string' ? raw.alias.trim().slice(0, 24) : '' }
  for (const [id, c] of Object.entries(raw.concepts && typeof raw.concepts === 'object' ? raw.concepts : {})) {
    if (!/^[\w-]{1,40}$/.test(id) || !c || typeof c !== 'object') continue
    const attempts = clamp(Math.floor(finite(c.attempts, 0)), 0, 100000)
    state.concepts[id] = {
      p: clamp(finite(c.p, 0), 0, 1),
      attempts,
      correct: clamp(Math.floor(finite(c.correct, 0)), 0, attempts),
      streak: clamp(Math.floor(finite(c.streak, 0)), 0, 100000),
      box: clamp(Math.floor(finite(c.box, 0)), 0, BOX_DAYS.length - 1),
      due: finite(c.due, 0),
      seen: c.seen === true
    }
  }
  for (const [id, l] of Object.entries(raw.lessons && typeof raw.lessons === 'object' ? raw.lessons : {})) {
    if (!/^[\w-]{1,40}$/.test(id) || !l || typeof l !== 'object') continue
    state.lessons[id] = { done: l.done === true, completions: clamp(Math.floor(finite(l.completions, 0)), 0, 100000), at: finite(l.at, 0) }
  }
  return state
}
