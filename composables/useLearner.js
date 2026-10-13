// composables/useLearner.js
// Estado del estudiante compartido por todo el libro, con guardado local tolerante a fallos.
// Anónimo por diseño: solo un apodo opcional (E1 RF-01). No se envía nada a ningún servidor.
import { reactive, computed, watch } from 'vue'
import {
  createLearner, normalizeLearner, recordAnswer, markLessonDone, setAlias, masteryOf, isMastered,
  scaffoldLevel, levelName, overallLevel, overallMastery, dueConcepts, recommendLesson, lessonStatus, missingPrereqs
} from '~/lib/maya/textbook/learner'
import { CURRICULUM, CONCEPTS } from '~/lib/maya/textbook/curriculum'

const KEY = 'maya-libro-estudiante-v1'
const ids = CONCEPTS.map((c) => c.id)

const store = reactive({ state: createLearner(), loaded: false })
let started = false

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    store.state = raw ? normalizeLearner(JSON.parse(raw)) : createLearner()
  } catch (e) {
    store.state = createLearner() // almacenamiento bloqueado o dañado: se empieza de cero
  }
  store.loaded = true
}

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(store.state))
  } catch (e) { /* sin almacenamiento: el libro sigue funcionando en memoria */ }
}

export const useLearner = () => {
  if (!started && typeof window !== 'undefined') {
    started = true
    load()
    watch(() => store.state, save, { deep: true })
  }

  return {
    store,
    curriculum: CURRICULUM,
    conceptIds: ids,
    alias: computed(() => store.state.alias),
    level: computed(() => overallLevel(store.state, ids)),
    mastery: computed(() => overallMastery(store.state, ids)),
    masteredCount: computed(() => ids.filter((id) => isMastered(store.state, id)).length),
    recommended: computed(() => recommendLesson(store.state, CURRICULUM)),
    due: (now = Date.now()) => dueConcepts(store.state, ids, now),
    answer: (conceptId, result) => { store.state = recordAnswer(store.state, conceptId, result) },
    finishLesson: (lessonId) => { store.state = markLessonDone(store.state, lessonId) },
    rename: (alias) => { store.state = setAlias(store.state, alias) },
    reset: () => { store.state = createLearner() },
    masteryOf: (id) => masteryOf(store.state, id),
    isMastered: (id) => isMastered(store.state, id),
    scaffold: (id) => scaffoldLevel(store.state, id),
    levelName: (id) => levelName(store.state, id),
    status: (lesson) => lessonStatus(store.state, CURRICULUM, lesson),
    missing: (conceptId) => missingPrereqs(store.state, CURRICULUM, conceptId)
  }
}
