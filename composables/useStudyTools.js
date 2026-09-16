/**
 * useStudyTools.js
 *
 * Generative study tools for the Intelligent Textbook:
 *  - Flashcards based on spaced repetition (weakest concepts first)
 *  - Chapter summaries
 *  - Personalized mock exams focused on weakest areas
 *
 * Reads telemetry from useTextbookStore to personalize content.
 */
import { ref, computed, reactive } from 'vue'
import { useTextbookStore } from './useTextbookStore'
import { vowels, syllables, logograms, words, writingRules } from '~/data/mayaDictionary'

// ---------------------------------------------------------------------------
// Knowledge base for flashcards / summaries
// ---------------------------------------------------------------------------
const flashcardBank = [
  // Vowels
  ...vowels.map(v => ({
    id: `v-${v.id}`,
    module: 'vocales',
    concept: v.id,
    front: `¿Qué vocal es este glifo? (${v.syllable.toUpperCase()})`,
    back: `La vocal ${v.syllable.toUpperCase()}. Código Thompson T${v.thompson}.`,
    image: v.image,
  })),
  // Syllables
  ...syllables.map(s => ({
    id: `s-${s.id}`,
    module: 'silabas',
    concept: s.syllable,
    front: `¿Qué sílaba es? (${s.syllable.toUpperCase()})`,
    back: `La sílaba ${s.syllable.toUpperCase()}, familia ${s.consonant}. Thompson T${s.thompson}.`,
    image: s.image,
  })),
  // Logograms
  ...logograms.map(l => ({
    id: `l-${l.id}`,
    module: 'lectura',
    concept: 'logogramas',
    front: `¿Qué significa ${l.word}?`,
    back: `${l.word} = ${l.meaningEs}. ${l.description}`,
    image: l.image,
  })),
  // Writing rules
  ...writingRules.map(r => ({
    id: `r-${r.id}`,
    module: 'escritura',
    concept: 'transcripcion',
    front: r.rule,
    back: `${r.description} Ejemplo: ${r.example}`,
  })),
]

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------
const flashcards = ref([])
const currentCardIndex = ref(0)
const cardFlipped = ref(false)
const knownCards = ref(new Set())
const unknownCards = ref(new Set())
const mockExam = ref([])
const mockExamIndex = ref(0)
const mockExamScore = ref(0)
const mockExamComplete = ref(false)
const mockExamAnswers = ref(new Set())

// ---------------------------------------------------------------------------
// Generate flashcards, weakest concepts first (spaced repetition)
// ---------------------------------------------------------------------------
function generateFlashcards(limit = 10) {
  const store = useTextbookStore()
  const gaps = store.getKnowledgeGaps()
  const gapConcepts = new Set(gaps.map(g => `${g.module}:${g.concept}`))

  // Sort: weakest concepts first, then the rest
  const sorted = [...flashcardBank].sort((a, b) => {
    const aKey = `${a.module}:${a.concept}`
    const bKey = `${b.module}:${b.concept}`
    const aGap = gapConcepts.has(aKey) ? 0 : 1
    const bGap = gapConcepts.has(bKey) ? 0 : 1
    if (aGap !== bGap) return aGap - bGap
    return 0
  })

  flashcards.value = sorted.slice(0, limit)
  currentCardIndex.value = 0
  cardFlipped.value = false
  knownCards.value = new Set()
  unknownCards.value = new Set()
  return flashcards.value
}

function flipCard() {
  cardFlipped.value = !cardFlipped.value
}

function markCard(known) {
  const card = flashcards.value[currentCardIndex.value]
  if (!card) return
  if (known) knownCards.value.add(card.id)
  else unknownCards.value.add(card.id)
  cardFlipped.value = false
  if (currentCardIndex.value < flashcards.value.length - 1) {
    currentCardIndex.value++
  }
}

function getCurrentCard() {
  return flashcards.value[currentCardIndex.value] || null
}

// ---------------------------------------------------------------------------
// Chapter summaries
// ---------------------------------------------------------------------------
function generateSummary(moduleId) {
  const summaries = {
    vocales: {
      title: 'Las Vocales Mayas',
      points: [
        'El maya usa 5 vocales: A, E, I, O, U.',
        'Cada vocal tiene su propio glifo y código Thompson.',
        'Las vocales son la base de todas las sílabas.',
        'La U también funciona como prefijo posesivo "su".',
      ],
    },
    silabas: {
      title: 'Las Sílabas Mayas',
      points: [
        'Toda sílaba maya tiene estructura CV (Consonante + Vocal).',
        'Las sílabas se agrupan en familias por consonante (B, CH, K, L, M...).',
        'Cada sílaba tiene variantes con códigos Thompson.',
        'Las sílabas se combinan para formar palabras.',
      ],
    },
    bloques: {
      title: 'Los Bloques de Glifos',
      points: [
        'Las sílabas se combinan en bloques de glifos.',
        'Cada bloque tiene posiciones: principal, izquierda, derecha, arriba, abajo.',
        'El orden de lectura es de arriba hacia abajo y de izquierda a derecha.',
        'Los bloques forman palabras y frases completas.',
      ],
    },
    lectura: {
      title: 'Lectura de Inscripciones',
      points: [
        'Los logogramas representan palabras completas.',
        'Los complementos fonéticos ayudan a pronunciar los logogramas.',
        'El orden de lectura es en dos columnas: arriba→abajo, izquierda→derecha.',
        'Cada bloque tiene un significado completo.',
      ],
    },
    escritura: {
      title: 'Escritura Maya',
      points: [
        'Se escribe combinando logogramas y sílabas.',
        'La armonía vocálica: la vocal muda final es igual a la anterior.',
        'El apóstrofe (\') marca oclusión glotal.',
        'Hay sustituciones entre maya y español (r→l, d→t, etc.).',
      ],
    },
  }
  return summaries[moduleId] || { title: moduleId, points: [] }
}

// ---------------------------------------------------------------------------
// Personalized mock exam (weakest areas first)
// ---------------------------------------------------------------------------
function generateMockExam(questionCount = 5) {
  const store = useTextbookStore()
  const gaps = store.getKnowledgeGaps()
  const gapConcepts = new Set(gaps.map(g => `${g.module}:${g.concept}`))

  // Prioritize cards from weak concepts
  const weakCards = flashcardBank.filter(c => gapConcepts.has(`${c.module}:${c.concept}`))
  const strongCards = flashcardBank.filter(c => !gapConcepts.has(`${c.module}:${c.concept}`))

  const pool = [...weakCards, ...strongCards]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, questionCount)

  mockExam.value = selected.map(card => {
    // Build 3 distractors from other cards' back text
    const others = pool.filter(c => c.id !== card.id)
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.back)
    const options = [...distractors, card.back].sort(() => Math.random() - 0.5)
    return {
      id: card.id,
      front: card.front,
      image: card.image,
      correct: card.back,
      options,
    }
  })

  mockExamIndex.value = 0
  mockExamScore.value = 0
  mockExamComplete.value = false
  mockExamAnswers.value = new Set()
  return mockExam.value
}

function getCurrentMockQuestion() {
  return mockExam.value[mockExamIndex.value] || null
}

function answerMockExam(option) {
  const q = getCurrentMockQuestion()
  if (!q || mockExamAnswers.value.has(mockExamIndex.value)) return
  mockExamAnswers.value.add(mockExamIndex.value)
  if (option === q.correct) mockExamScore.value++
  setTimeout(() => {
    if (mockExamIndex.value < mockExam.value.length - 1) {
      mockExamIndex.value++
    } else {
      mockExamComplete.value = true
    }
  }, 900)
}

export function useStudyTools() {
  return reactive({
    flashcards,
    currentCardIndex,
    cardFlipped,
    knownCards,
    unknownCards,
    mockExam,
    mockExamIndex,
    mockExamScore,
    mockExamComplete,
    generateFlashcards,
    flipCard,
    markCard,
    getCurrentCard,
    generateSummary,
    generateMockExam,
    getCurrentMockQuestion,
    answerMockExam,
  })
}
