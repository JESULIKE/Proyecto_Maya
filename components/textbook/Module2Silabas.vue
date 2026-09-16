<template>
  <div class="space-y-6">
    <!-- ============================================ -->
    <!-- PHASE: LEARN (Aprender)                      -->
    <!-- ============================================ -->
    <div v-if="phase === 'learn'" class="space-y-6">
      <!-- Intro -->
      <div v-if="learnStep === 'intro'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 text-center">
          <div class="text-5xl mb-4">🔤</div>
          <h3 class="text-2xl font-bold text-blue-900 mb-3">Las Sílabas Mayas</h3>
          <p class="text-gray-600 text-lg max-w-lg mx-auto">
            En maya, cada sílaba tiene una <strong>consonante</strong> + una <strong>vocal</strong>.
            Igual que en español: BA, CHA, KE, LA, MA...
          </p>
          <div class="bg-blue-50 rounded-xl p-4 mt-6 max-w-md mx-auto">
            <div class="flex items-center justify-center gap-3 text-2xl font-bold">
              <span class="text-blue-700">B</span>
              <span class="text-gray-400">+</span>
              <span class="text-amber-600">A</span>
              <span class="text-gray-400">=</span>
              <span class="text-green-600">BA</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">Consonante + Vocal = Sílaba</p>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'family'; learnFamilyIndex = 0"
                  class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar a aprender! →
          </button>
        </div>
      </div>

      <!-- Show each family -->
      <div v-if="learnStep === 'family'" class="space-y-6">
        <div class="text-center text-sm text-gray-500">
          Familia {{ learnFamilyIndex + 1 }} de {{ learnFamilies.length }}
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
          <div class="text-center mb-4">
            <span class="text-4xl font-bold text-blue-700">{{ learnFamilies[learnFamilyIndex] }}</span>
            <span class="text-lg text-gray-500 ml-2">VOCALES</span>
          </div>

          <div class="flex justify-center gap-4 flex-wrap">
            <div v-for="syl in currentFamilySyllables" :key="syl.id"
                 class="flex flex-col items-center gap-2 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div class="w-20 h-20 bg-white rounded-xl border border-blue-300 flex items-center justify-center">
                <img :src="syl.image" class="w-14 h-14 object-contain" />
              </div>
              <span class="font-bold text-blue-800 text-lg">{{ syl.syllable.toUpperCase() }}</span>
              <span class="text-xs text-gray-500">T{{ syl.thompson }}</span>
            </div>
          </div>

          <p class="text-center text-sm text-gray-500 mt-4">
            {{ getFamilyDescription(learnFamilies[learnFamilyIndex]) }}
          </p>
        </div>

        <div class="flex justify-between items-center">
          <button v-if="learnFamilyIndex > 0" @click="learnFamilyIndex--"
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            ← Anterior
          </button>
          <div v-else></div>

          <div class="flex gap-1">
            <div v-for="(f, idx) in learnFamilies" :key="idx"
                 class="w-3 h-3 rounded-full transition-colors"
                 :class="idx === learnFamilyIndex ? 'bg-blue-600' : (idx < learnFamilyIndex ? 'bg-blue-400' : 'bg-gray-300')">
            </div>
          </div>

          <button v-if="learnFamilyIndex < learnFamilies.length - 1" @click="learnFamilyIndex++"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
            Siguiente →
          </button>
          <button v-else @click="learnStep = 'rules'"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
            Ver reglas →
          </button>
        </div>
      </div>

      <!-- Writing Rules for syllables -->
      <div v-if="learnStep === 'rules'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
          <h3 class="text-2xl font-bold text-blue-900 mb-6 text-center">Reglas Importantes</h3>

          <div class="space-y-4 max-w-lg mx-auto">
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 class="font-bold text-blue-800 mb-1">1. Siempre terminan en vocal</h4>
              <p class="text-sm text-gray-600">Toda sílaba maya es CV (Consonante + Vocal). No existen sílabas que terminen en consonante.</p>
            </div>

            <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 class="font-bold text-blue-800 mb-1">2. Armonía vocálica</h4>
              <p class="text-sm text-gray-600">Cuando una palabra termina en vocal muda, esa vocal debe ser igual a la última vocal sonora.</p>
              <p class="text-xs text-blue-700 font-mono mt-1">CH'OK → ch'o-ko (ambas "o")</p>
            </div>

            <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 class="font-bold text-blue-800 mb-1">3. El apóstrofe (') = oclusión glotal</h4>
              <p class="text-sm text-gray-600">El apóstrofe indica una pausa brusca. Cambia el significado.</p>
              <p class="text-xs text-blue-700 font-mono mt-1">t'o ≠ to</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button @click="learnStep = 'summary'"
                  class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Ver resumen! →
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="learnStep === 'summary'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 text-center">
          <div class="text-5xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-blue-900 mb-4">¡Ya conoces las sílabas mayas!</h3>
          <p class="text-gray-600">Aprendiste {{ totalSyllablesLearned }} sílabas en {{ learnFamilies.length }} familias consonánticas.</p>
        </div>
        <div class="flex justify-center">
          <button @click="$emit('complete', { module: 'silabas', phase: 'learn', stars: 3 }); $emit('next-phase')"
                  class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Practicar! →
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: PRACTICE (Practicar)                  -->
    <!-- ============================================ -->
    <div v-if="phase === 'practice'" class="space-y-6">
      <!-- Practice 1: Match syllable to glyph -->
      <div v-if="practiceStep === 0" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-blue-900 mb-2">🔗 Empareja Sílaba con Glifo</h3>
          <p class="text-gray-600">Conecta cada sílaba con su glifo</p>
        </div>

        <div class="grid grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="(pair, idx) in practiceMatchPairs" :key="idx" class="flex flex-col items-center gap-2">
            <div class="text-sm font-bold text-blue-800">{{ pair.syllable.syllable.toUpperCase() }}</div>
            <div @click="selectPracticeMatchSlot(idx)"
                 class="w-20 h-20 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all"
                 :class="pair.matched ? 'border-green-400 bg-green-50' : (selectedPracticeSlot === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400')">
              <img v-if="pair.matched" :src="pair.glyph.image" class="w-14 h-14 object-contain" />
              <span v-else class="text-gray-400 text-xl">?</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="(glyph, idx) in shuffledPracticeGlyphs" :key="idx"
                  @click="placePracticeGlyph(glyph)"
                  class="w-16 h-16 bg-white rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105"
                  :class="glyph.used ? 'border-gray-200 opacity-30' : 'border-blue-300 hover:border-blue-500'"
                  :disabled="glyph.used">
            <img :src="glyph.image" class="w-12 h-12 object-contain" />
          </button>
        </div>
      </div>

      <!-- Practice 2: Family classification -->
      <div v-if="practiceStep === 1" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-blue-900 mb-2">📂 Clasifica por Familia</h3>
          <p class="text-gray-600">¿A qué familia consonántica pertenece cada sílaba?</p>
        </div>

        <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
          <div v-for="fam in practiceFamilies" :key="fam" class="flex flex-col items-center gap-2">
            <div class="text-lg font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-lg">{{ fam }}</div>
            <div @click="selectPracticeBucket(fam)"
                 class="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center flex-wrap gap-1"
                 :class="selectedPracticeBucket === fam ? 'border-blue-600 bg-blue-50' : 'border-gray-300'">
              <div v-for="(item, i) in practiceBuckets[fam]" :key="i" class="w-8 h-8">
                <img :src="item.image" class="w-full h-full object-contain" />
              </div>
              <span v-if="!practiceBuckets[fam]?.length" class="text-gray-400 text-lg">+</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="(syl, idx) in practiceFamilyGlyphs" :key="idx"
                  @click="selectPracticeFamilyGlyph(syl)"
                  class="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border-2 transition-all hover:scale-105"
                  :class="syl.placed ? 'border-gray-200 opacity-30' : (selectedPracticeFamilyGlyph === syl ? 'border-blue-500 bg-blue-50' : 'border-blue-300')"
                  :disabled="syl.placed">
            <img :src="syl.image" class="w-10 h-10 object-contain" />
            <span class="text-xs font-bold text-blue-700">{{ syl.syllable.toUpperCase() }}</span>
          </button>
        </div>
      </div>

      <!-- Practice 3: Memory game -->
      <div v-if="practiceStep === 2" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-blue-900 mb-2">🧠 Memorama</h3>
          <p class="text-gray-600">Encuentra las parejas: sílaba ↔ glifo</p>
        </div>

        <div class="grid grid-cols-4 gap-3 max-w-lg mx-auto">
          <button v-for="(card, idx) in practiceMemoryCards" :key="idx"
                  @click="flipMemoryCard(idx)"
                  class="w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all duration-300"
                  :class="card.matched ? 'bg-green-50 border-green-400' : (card.flipped ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400 cursor-pointer')"
                  :disabled="card.matched || practiceFlipped.length >= 2">
            <div v-if="card.flipped || card.matched" class="flex flex-col items-center gap-1">
              <img v-if="card.type === 'glyph'" :src="card.image" class="w-10 h-10 object-contain" />
              <span v-else class="text-sm font-bold" :class="card.matched ? 'text-green-600' : 'text-blue-700'">
                {{ card.label.toUpperCase() }}
              </span>
            </div>
            <span v-else class="text-2xl">🌟</span>
          </button>
        </div>

        <div class="text-center text-sm text-gray-500">
          Parejas: {{ practiceMemoryMatched }}/{{ practiceMemoryPairs }}
        </div>
      </div>

      <!-- Practice Navigation -->
      <div class="flex justify-between items-center mt-8">
        <button v-if="practiceStep > 0" @click="practiceStep--"
                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
          ← Anterior
        </button>
        <div v-else></div>
        <div class="flex gap-1">
          <div v-for="i in 3" :key="i" class="w-3 h-3 rounded-full transition-colors"
               :class="i - 1 === practiceStep ? 'bg-blue-600' : (i - 1 < practiceStep ? 'bg-blue-400' : 'bg-gray-300')">
          </div>
        </div>
        <button v-if="practiceStep < 2 && practiceStepComplete" @click="practiceStep++; practiceStepComplete = false"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
          Siguiente →
        </button>
        <button v-else-if="practiceStep === 2 && practiceStepComplete"
                @click="$emit('complete', { module: 'silabas', phase: 'practice', stars: 3 }); $emit('next-phase')"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
          ¡Siguiente! →
        </button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: TEST (Evaluar)                        -->
    <!-- ============================================ -->
    <div v-if="phase === 'test'" class="space-y-6">
      <div v-if="!testStarted" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 text-center">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-2xl font-bold text-blue-900 mb-3">Examen de Sílabas</h3>
          <p class="text-gray-600 text-lg">Responde 5 preguntas sobre sílabas mayas</p>
        </div>
        <div class="flex justify-center">
          <button @click="startTest" class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar Examen! 🚀
          </button>
        </div>
      </div>

      <div v-if="testStarted && !testComplete" class="space-y-6">
        <div class="text-center">
          <div class="text-lg font-bold text-blue-800">Pregunta {{ testIndex + 1 }}/{{ testQuestions.length }}</div>
          <div class="w-full h-2 bg-blue-100 rounded-full mt-2 max-w-md mx-auto">
            <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: (testIndex / testQuestions.length * 100) + '%' }"></div>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="w-48 h-48 bg-white rounded-2xl shadow-lg border-2 border-blue-200 flex items-center justify-center">
            <img :src="currentTestQuestion.image" class="w-36 h-36 object-contain" />
          </div>
        </div>

        <p class="text-center text-lg font-bold text-gray-700">¿Qué sílaba es esta?</p>

        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="syl in testChoices" :key="syl.id"
                  @click="answerTest(syl.id)"
                  class="px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all"
                  :class="getTestClass(syl.id)">
            {{ syl.syllable.toUpperCase() }}
          </button>
        </div>

        <!-- Socratic scaffolding hints -->
        <ScaffoldingHints :hints="testHints" :reset-key="testIndex" />
      </div>

      <div v-if="testComplete" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 text-center">
          <div class="text-5xl mb-4">{{ testScore >= 5 ? '🏆' : testScore >= 3 ? '🎉' : '💪' }}</div>
          <h3 class="text-2xl font-bold text-blue-900 mb-3">{{ testScore >= 5 ? '¡Perfecto!' : testScore >= 3 ? '¡Bien!' : '¡Sigue intentando!' }}</h3>
          <div class="text-4xl font-bold text-blue-700">{{ testScore }}/{{ testQuestions.length }}</div>
        </div>
        <div class="flex justify-center gap-4">
          <button @click="resetTest" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            Intentar de Nuevo
          </button>
          <button @click="$emit('complete', { module: 'silabas', phase: 'test', stars: testScore >= 5 ? 3 : testScore >= 3 ? 2 : 1 }); $emit('next-phase')"
                  class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Siguiente Módulo! →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { syllables, vowels } from '~/data/mayaDictionary'
import { useTextbookStore } from '~/composables/useTextbookStore'
import { useAccessibility } from '~/composables/useAccessibility'
import ScaffoldingHints from '~/components/textbook/ScaffoldingHints.vue'

const props = defineProps({ phase: { type: String, default: 'learn' } })
const emit = defineEmits(['complete', 'next-phase'])
const store = useTextbookStore()
const acc = useAccessibility()

const allSyllables = computed(() => [...vowels, ...syllables].map(s => ({
  ...s,
  image: s.variants?.[0]?.image || s.image,
})))

// ============================================
// LEARN
// ============================================
const learnStep = ref('intro')
const learnFamilyIndex = ref(0)
const learnFamilies = computed(() => [...new Set(syllables.map(s => s.consonant))].sort())
const totalSyllablesLearned = computed(() => syllables.length + vowels.length)

const currentFamilySyllables = computed(() => {
  const family = learnFamilies.value[learnFamilyIndex.value]
  return syllables.filter(s => s.consonant === family).map(s => ({
    ...s,
    image: s.variants?.[0]?.image || s.image,
  }))
})

function getFamilyDescription(family) {
  const descs = {
    B: 'La familia B incluye sílabas como BA. En maya, B sustituye a la V española.',
    CH: 'La familia CH incluye CHA, CHE. Son sonidos aspirados.',
    "CH'": "La familia CH' tiene oclusión glotal: CH'A.",
    H: 'La familia H incluye HA. El sonido H es suave en maya.',
    J: 'La familia J incluye JA. Similar a la J española pero más suave.',
    K: 'La familia K incluye KE. K sustituye a G y C(k) del español.',
    L: 'La familia L incluye LA. L sustituye a R del español.',
    M: 'La familia M incluye MA. Sonido nasal común.',
    N: 'La familia N incluye NA, NE, NI, NO, NU. Todas las vocales.',
    P: 'La familia P incluye PO. P sustituye a F del español.',
    S: 'La familia S incluye SA. Sustituye a C(s) del español.',
    W: 'La familia W incluye WI. Complemento fonético común.',
    Y: 'La familia Y incluye YA, YE, YI, YO, YU.',
  }
  return descs[family] || `Familia ${family}`
}

// ============================================
// PRACTICE
// ============================================
const practiceStep = ref(0)
const practiceStepComplete = ref(false)
const feedback = ref(null)

// Practice 1: Match
const practiceMatchPairs = ref([])
const selectedPracticeSlot = ref(null)
const shuffledPracticeGlyphs = ref([])

function initPracticeMatch() {
  const syls = allSyllables.value.slice(0, 6)
  practiceMatchPairs.value = syls.map(s => ({ syllable: s, glyph: s, matched: false }))
  shuffledPracticeGlyphs.value = shuffleArray([...syls.map(s => ({ ...s, used: false }))])
  selectedPracticeSlot.value = null
}

function selectPracticeMatchSlot(idx) {
  if (practiceMatchPairs.value[idx].matched) return
  selectedPracticeSlot.value = idx
}

function placePracticeGlyph(glyph) {
  if (selectedPracticeSlot.value === null) return
  const pair = practiceMatchPairs.value[selectedPracticeSlot.value]
  if (pair.syllable.id === glyph.id) {
    pair.matched = true
    glyph.used = true
    selectedPracticeSlot.value = null
    if (practiceMatchPairs.value.every(p => p.matched)) practiceStepComplete.value = true
  } else {
    feedback.value = { correct: false, message: '¡Intenta otro!' }
    setTimeout(() => { feedback.value = null }, 600)
  }
}

// Practice 2: Family classification
const practiceFamilies = computed(() => [...new Set(syllables.map(s => s.consonant))].sort())
const practiceBuckets = ref({})
const selectedPracticeBucket = ref(null)
const practiceFamilyGlyphs = ref([])
const selectedPracticeFamilyGlyph = ref(null)

function initPracticeFamily() {
  practiceBuckets.value = {}
  practiceFamilies.value.forEach(f => { practiceBuckets.value[f] = [] })
  practiceFamilyGlyphs.value = shuffleArray([...syllables]).slice(0, 6).map(s => ({
    ...s, image: s.variants?.[0]?.image || s.image, placed: false,
  }))
  selectedPracticeBucket.value = null
  selectedPracticeFamilyGlyph.value = null
}

function selectPracticeBucket(fam) {
  selectedPracticeBucket.value = fam
  if (selectedPracticeFamilyGlyph.value) placeFamilyGlyph()
}

function selectPracticeFamilyGlyph(syl) {
  selectedPracticeFamilyGlyph.value = syl
  if (selectedPracticeBucket.value) placeFamilyGlyph()
}

function placeFamilyGlyph() {
  const syl = selectedPracticeFamilyGlyph.value
  const fam = selectedPracticeBucket.value
  if (!syl || !fam) return
  if (syl.consonant === fam) {
    if (!practiceBuckets.value[fam]) practiceBuckets.value[fam] = []
    practiceBuckets.value[fam].push(syl)
    syl.placed = true
    selectedPracticeFamilyGlyph.value = null
    selectedPracticeBucket.value = null
    if (practiceFamilyGlyphs.value.every(g => g.placed)) practiceStepComplete.value = true
  } else {
    feedback.value = { correct: false, message: '¡Esta sílaba no es de esa familia!' }
    setTimeout(() => { feedback.value = null; selectedPracticeFamilyGlyph.value = null; selectedPracticeBucket.value = null }, 600)
  }
}

// Practice 3: Memory
const practiceMemoryCards = ref([])
const practiceFlipped = ref([])
const practiceMemoryMatched = ref(0)
const practiceMemoryPairs = computed(() => practiceMemoryCards.value.length / 2)

function initPracticeMemory() {
  const syls = shuffleArray([...allSyllables.value]).slice(0, 6)
  const cards = []
  syls.forEach(s => {
    cards.push({ type: 'glyph', label: s.syllable, image: s.image, id: s.id, flipped: false, matched: false })
    cards.push({ type: 'text', label: s.syllable, id: s.id, flipped: false, matched: false })
  })
  practiceMemoryCards.value = shuffleArray(cards)
  practiceFlipped.value = []
  practiceMemoryMatched.value = 0
}

function flipMemoryCard(idx) {
  const card = practiceMemoryCards.value[idx]
  if (card.matched || card.flipped) return
  card.flipped = true
  practiceFlipped.value.push(idx)
  if (practiceFlipped.value.length === 2) {
    const [a, b] = practiceFlipped.value
    const cA = practiceMemoryCards.value[a]
    const cB = practiceMemoryCards.value[b]
    if (cA.id === cB.id && cA.type !== cB.type) {
      cA.matched = true; cB.matched = true
      practiceMemoryMatched.value++
      practiceFlipped.value = []
      if (practiceMemoryMatched.value === practiceMemoryPairs.value) practiceStepComplete.value = true
    } else {
      setTimeout(() => { cA.flipped = false; cB.flipped = false; practiceFlipped.value = [] }, 800)
    }
  }
}

// ============================================
// TEST
// ============================================
const testStarted = ref(false)
const testIndex = ref(0)
const testScore = ref(0)
const testComplete = ref(false)
const testFeedback = ref(null)
const testAttempted = ref(new Set())
const testQuestions = ref([])
const currentTestQuestion = computed(() => testQuestions.value[testIndex.value] || {})

const testChoices = computed(() => {
  const correct = currentTestQuestion.value
  if (!correct.id) return []
  const others = allSyllables.value.filter(s => s.id !== correct.id)
  return shuffleArray([allSyllables.value.find(s => s.id === correct.id), ...shuffleArray([...others]).slice(0, 3)]).filter(Boolean)
})

const testHints = computed(() => {
  const q = currentTestQuestion.value
  if (!q || !q.correctId) return []
  return [
    'Observa la forma del glifo con atención.',
    'Recuerda: cada sílaba tiene una consonante y una vocal.',
    `La respuesta correcta es ${q.correctId.toUpperCase()}.`,
  ]
})

function startTest() {
  testStarted.value = true; testIndex.value = 0; testScore.value = 0; testComplete.value = false; testAttempted.value = new Set()
  testQuestions.value = shuffleArray([...allSyllables.value]).slice(0, 5).map(s => ({ id: s.id, image: s.image, correctId: s.id }))
}

function getTestClass(id) {
  if (!testAttempted.value.has(testIndex.value)) return 'bg-white border-gray-300 hover:border-blue-400'
  if (id === currentTestQuestion.value.correctId) return 'bg-green-100 border-green-500 text-green-700'
  return 'bg-red-100 border-red-400 text-red-600'
}

function answerTest(id) {
  if (testAttempted.value.has(testIndex.value)) return
  testAttempted.value.add(testIndex.value)
  const correct = id === currentTestQuestion.value.correctId
  store.recordAttempt('silabas', currentTestQuestion.value.correctId, correct)
  if (correct) { testScore.value++; testFeedback.value = { correct: true, message: '¡Correcto! 🎯' }; acc.speak(`¡Correcto! ${currentTestQuestion.value.correctId.toUpperCase()}`) }
  else { testFeedback.value = { correct: false, message: `Era: ${currentTestQuestion.value.correctId.toUpperCase()}` } }
  setTimeout(() => { testFeedback.value = null; if (testIndex.value >= testQuestions.value.length - 1) testComplete.value = true; else testIndex.value++ }, 1200)
}

function resetTest() { testStarted.value = false; testIndex.value = 0; testScore.value = 0; testComplete.value = false; testAttempted.value = new Set() }

// ============================================
// HELPERS
// ============================================
function shuffleArray(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a }

watch(() => props.phase, () => {
  if (props.phase === 'learn') { learnStep.value = 'intro'; learnFamilyIndex.value = 0 }
  if (props.phase === 'practice') { practiceStep.value = 0; practiceStepComplete.value = false; initPracticeMatch(); initPracticeFamily(); initPracticeMemory() }
  if (props.phase === 'test') { testStarted.value = false; testIndex.value = 0; testScore.value = 0; testComplete.value = false }
})
</script>
