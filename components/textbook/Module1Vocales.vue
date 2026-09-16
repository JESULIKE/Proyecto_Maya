<template>
  <div class="space-y-6">
    <!-- ============================================ -->
    <!-- PHASE: LEARN (Aprender)                      -->
    <!-- ============================================ -->
    <div v-if="phase === 'learn'" class="space-y-6">
      <!-- Step 1: Introduction -->
      <div v-if="learnStep === 'intro'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-green-200 text-center">
          <div class="text-5xl mb-4">🌿</div>
          <h3 class="text-2xl font-bold text-green-900 mb-3">Las Vocales Mayas</h3>
          <p class="text-gray-600 text-lg max-w-lg mx-auto">
            El sistema de escritura maya usa <strong>cinco vocales</strong>, igual que en español:
          </p>
          <div class="flex justify-center gap-4 mt-6">
            <div v-for="v in allVowels" :key="v.id"
                 class="w-16 h-16 bg-green-50 rounded-xl border-2 border-green-200 flex items-center justify-center text-2xl font-bold text-green-700">
              {{ v.syllable.toUpperCase() }}
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">Todas las palabras mayas usan estas vocales</p>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'vowel'; learnIndex = 0"
                  class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar a aprender! →
          </button>
        </div>
      </div>

      <!-- Step 2: Show each vowel one by one -->
      <div v-if="learnStep === 'vowel'" class="space-y-6">
        <div class="text-center text-sm text-gray-500">
          Vocal {{ learnIndex + 1 }} de {{ allVowels.length }}
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Glyph Display -->
            <div class="flex-shrink-0">
              <div class="w-40 h-40 bg-green-50 rounded-2xl border-2 border-green-200 flex items-center justify-center">
                <img :src="currentLearnVowel.image" :alt="currentLearnVowel.syllable" class="w-28 h-28 object-contain" />
              </div>
            </div>

            <!-- Info -->
            <div class="text-center md:text-left flex-1">
              <div class="text-6xl font-bold text-green-700 mb-2">
                {{ currentLearnVowel.syllable.toUpperCase() }}
              </div>
              <p class="text-gray-600 text-lg mb-3">{{ currentLearnVowel.description }}</p>
              <div class="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <span class="text-sm text-green-800">Código Thompson:</span>
                <span class="font-mono font-bold text-green-900">T{{ currentLearnVowel.thompson }}</span>
              </div>

              <!-- Listen button (TTS) -->
              <button @click="acc.speak(`La vocal ${currentLearnVowel.syllable.toUpperCase()}`)"
                class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors">
                🔊 Escuchar
              </button>

              <!-- Variants -->
              <div v-if="currentLearnVowel.variants && currentLearnVowel.variants.length > 1" class="mt-4">
                <p class="text-sm text-gray-500 mb-2">Variantes conocidas:</p>
                <div class="flex gap-2 flex-wrap">
                  <div v-for="v in currentLearnVowel.variants" :key="v.thompson"
                       class="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <img :src="v.image" class="w-9 h-9 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center">
          <button v-if="learnIndex > 0" @click="learnIndex--"
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            ← Anterior
          </button>
          <div v-else></div>

          <div class="flex gap-1">
            <div v-for="(v, idx) in allVowels" :key="idx"
                 class="w-3 h-3 rounded-full transition-colors"
                 :class="idx === learnIndex ? 'bg-green-600' : (idx < learnIndex ? 'bg-green-400' : 'bg-gray-300')">
            </div>
          </div>

          <button v-if="learnIndex < allVowels.length - 1" @click="learnIndex++"
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors">
            Siguiente →
          </button>
          <button v-else @click="learnStep = 'summary'"
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors">
            ¡Ver resumen! →
          </button>
        </div>
      </div>

      <!-- Step 3: Summary -->
      <div v-if="learnStep === 'summary'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-green-200 text-center">
          <div class="text-5xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-green-900 mb-4">¡Ya conoces las vocales mayas!</h3>

          <div class="grid grid-cols-5 gap-4 max-w-md mx-auto">
            <div v-for="v in allVowels" :key="v.id" class="flex flex-col items-center gap-2">
              <div class="w-16 h-16 bg-green-50 rounded-xl border-2 border-green-300 flex items-center justify-center">
                <img :src="v.image" class="w-12 h-12 object-contain" />
              </div>
              <span class="font-bold text-green-700 text-lg">{{ v.syllable.toUpperCase() }}</span>
            </div>
          </div>

          <p class="text-gray-600 mt-6">
            Ahora puedes pasar a <strong>Practicar</strong> para reforzar lo que aprendiste,
            o directamente a <strong>Evaluar</strong> si ya te sientes seguro.
          </p>
        </div>

        <div class="flex justify-center gap-4">
          <button @click="$emit('complete', { module: 'vocales', phase: 'learn', stars: 3 }); $emit('next-phase')"
                  class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Practicar! →
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: PRACTICE (Practicar)                  -->
    <!-- ============================================ -->
    <div v-if="phase === 'practice'" class="space-y-6">
      <!-- Practice 1: Match vowel to glyph -->
      <div v-if="practiceStep === 0" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-green-900 mb-2">🔗 Empareja Vocal con Glifo</h3>
          <p class="text-gray-600">Conecta cada vocal con su glifo correspondiente</p>
        </div>

        <div class="grid grid-cols-5 gap-4">
          <div v-for="(pair, idx) in practiceMatchPairs" :key="idx" class="flex flex-col items-center gap-2">
            <div class="text-lg font-bold text-green-800">{{ pair.vowel.syllable.toUpperCase() }}</div>
            <div @click="selectPracticeMatchSlot(idx)"
                 class="w-20 h-20 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all"
                 :class="pair.matched ? 'border-green-400 bg-green-50' : (selectedPracticeSlot === idx ? 'border-green-600 bg-green-100' : 'border-gray-300 bg-white hover:border-green-400')">
              <img v-if="pair.matched" :src="pair.glyph.image" class="w-14 h-14 object-contain" />
              <span v-else class="text-gray-400 text-2xl">?</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="(glyph, idx) in shuffledPracticeGlyphs" :key="idx"
                  @click="placePracticeGlyph(glyph)"
                  class="w-20 h-20 bg-white rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105"
                  :class="glyph.used ? 'border-gray-200 opacity-30' : 'border-green-300 hover:border-green-500'"
                  :disabled="glyph.used">
            <img :src="glyph.image" class="w-14 h-14 object-contain" />
          </button>
        </div>

        <div v-if="feedback" class="text-center text-lg font-bold" :class="feedback.correct ? 'text-green-600' : 'text-red-500'">
          {{ feedback.message }}
        </div>
      </div>

      <!-- Practice 2: Identify which vowel -->
      <div v-if="practiceStep === 1" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-green-900 mb-2">🔍 ¿Qué vocal es?</h3>
          <p class="text-gray-600">Mira el glifo y elige la vocal correcta</p>
        </div>

        <div class="flex justify-center">
          <div class="w-48 h-48 bg-white rounded-2xl shadow-lg border-2 border-green-200 flex items-center justify-center">
            <img :src="practiceIdentifyChallenge.image" class="w-36 h-36 object-contain" />
          </div>
        </div>

        <div class="flex justify-center gap-4 flex-wrap">
          <button v-for="v in allVowels" :key="v.id"
                  @click="checkPracticeIdentify(v.id)"
                  class="w-20 h-20 rounded-xl border-3 font-bold text-2xl transition-all duration-200"
                  :class="getPracticeIdentifyClass(v.id)">
            {{ v.syllable.toUpperCase() }}
          </button>
        </div>

        <!-- Socratic scaffolding hints -->
        <ScaffoldingHints
          :hints="practiceIdentifyHints"
          :reset-key="practiceIdentifyIndex"
        />
      </div>

      <!-- Practice 3: Complete the sequence -->
      <div v-if="practiceStep === 2" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-green-900 mb-2">✏️ Completa la Secuencia</h3>
          <p class="text-gray-600">Rellena la vocal que falta</p>
        </div>

        <div class="flex justify-center gap-3 items-center">
          <div v-for="(item, idx) in practiceSequence" :key="idx" class="flex flex-col items-center">
            <div v-if="item.missing"
                 class="w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold"
                 :class="item.selected ? 'border-green-400 bg-green-50 text-green-700' : (item.wrong ? 'border-red-400 bg-red-50 text-red-700' : 'border-dashed border-green-400 bg-green-50 text-green-600')">
              {{ item.selected || item.wrong || '?' }}
            </div>
            <div v-else class="w-16 h-16 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center text-2xl font-bold text-gray-700">
              {{ item.value }}
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3">
          <button v-for="choice in ['A', 'E', 'I', 'O', 'U']" :key="choice"
                  @click="fillPracticeSequence(choice)"
                  class="w-14 h-14 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 font-bold text-xl transition-colors border-2 border-green-300">
            {{ choice }}
          </button>
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
          <div v-for="i in 3" :key="i"
               class="w-3 h-3 rounded-full transition-colors"
               :class="i - 1 === practiceStep ? 'bg-green-600' : (i - 1 < practiceStep ? 'bg-green-400' : 'bg-gray-300')">
          </div>
        </div>

        <button v-if="practiceStep < 2 && practiceStepComplete" @click="practiceStep++"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors">
          Siguiente →
        </button>
        <button v-else-if="practiceStep === 2 && practiceStepComplete" @click="completePractice"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors">
          ¡Práctica completa! →
        </button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: TEST (Evaluar)                        -->
    <!-- ============================================ -->
    <div v-if="phase === 'test'" class="space-y-6">
      <!-- Test not started -->
      <div v-if="!testStarted" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-green-200 text-center">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-2xl font-bold text-green-900 mb-3">Examen de Vocales</h3>
          <p class="text-gray-600 text-lg">Responde 5 preguntas para demostrar lo que aprendiste</p>
          <div class="mt-4 text-sm text-gray-500">
            ⭐ 5/5 = 3 estrellas | ⭐ 3-4 = 2 estrellas | ⭐ 1-2 = 1 estrella
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="startTest"
                  class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar Examen! 🚀
          </button>
        </div>
      </div>

      <!-- Test in progress -->
      <div v-if="testStarted && !testComplete" class="space-y-6">
        <div class="text-center">
          <div class="text-lg font-bold text-green-800">Pregunta {{ testIndex + 1 }}/{{ testQuestions.length }}</div>
          <div class="w-full h-2 bg-green-100 rounded-full mt-2 max-w-md mx-auto">
            <div class="h-full bg-green-500 rounded-full transition-all"
                 :style="{ width: (testIndex / testQuestions.length * 100) + '%' }"></div>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="w-48 h-48 bg-white rounded-2xl shadow-lg border-2 border-green-200 flex items-center justify-center">
            <img :src="currentTestQuestion.image" class="w-36 h-36 object-contain" />
          </div>
        </div>

        <p class="text-center text-lg font-bold text-gray-700">¿Qué vocal es esta?</p>

        <div class="flex justify-center gap-4 flex-wrap">
          <button v-for="v in allVowels" :key="v.id"
                  @click="answerTest(v.id)"
                  class="w-20 h-20 rounded-xl border-3 font-bold text-2xl transition-all duration-200"
                  :class="getTestClass(v.id)">
            {{ v.syllable.toUpperCase() }}
          </button>
        </div>

        <!-- Socratic scaffolding hints -->
        <ScaffoldingHints
          :hints="testHints"
          :reset-key="testIndex"
        />

        <div v-if="testFeedback" class="text-center text-lg font-bold" :class="testFeedback.correct ? 'text-green-600' : 'text-red-500'">
          {{ testFeedback.message }}
        </div>
      </div>

      <!-- Test complete -->
      <div v-if="testComplete" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-green-200 text-center">
          <div class="text-5xl mb-4">{{ testScore >= 5 ? '🏆' : testScore >= 3 ? '🎉' : '💪' }}</div>
          <h3 class="text-2xl font-bold text-green-900 mb-3">
            {{ testScore >= 5 ? '¡Perfecto!' : testScore >= 3 ? '¡Bien hecho!' : '¡Sigue practicando!' }}
          </h3>
          <div class="text-4xl font-bold text-green-700 mb-2">{{ testScore }}/{{ testQuestions.length }}</div>
          <div class="text-lg text-gray-600">
            {{ testScore === 5 ? '¡Respuestas perfectas! +3 estrellas' :
               testScore >= 3 ? '¡Muy bien! +2 estrellas' :
               '¡Buen intento! +1 estrella' }}
          </div>
          <div class="flex justify-center gap-1 mt-4">
            <span v-for="i in testStars" :key="i" class="text-3xl">⭐</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button @click="resetTest"
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            Intentar de Nuevo
          </button>
          <button @click="completeTest"
                  class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Siguiente Módulo! →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { vowels } from '~/data/mayaDictionary'
import { useTextbookStore } from '~/composables/useTextbookStore'
import { useAccessibility } from '~/composables/useAccessibility'
import ScaffoldingHints from '~/components/textbook/ScaffoldingHints.vue'

const props = defineProps({ phase: { type: String, default: 'learn' } })
const emit = defineEmits(['complete', 'next-phase'])
const store = useTextbookStore()
const acc = useAccessibility()

const allVowels = computed(() => vowels.map(v => ({
  ...v,
  image: v.variants?.[0]?.image || v.image,
})))

// ============================================
// LEARN PHASE
// ============================================
const learnStep = ref('intro')
const learnIndex = ref(0)
const currentLearnVowel = computed(() => allVowels.value[learnIndex.value])

// ============================================
// PRACTICE PHASE
// ============================================
const practiceStep = ref(0)
const practiceStepComplete = ref(false)
const feedback = ref(null)

// Practice 1: Match
const practiceMatchPairs = ref([])
const selectedPracticeSlot = ref(null)
const shuffledPracticeGlyphs = ref([])

function initPracticeMatch() {
  practiceMatchPairs.value = allVowels.value.map(v => ({
    vowel: v,
    glyph: v,
    matched: false,
  }))
  shuffledPracticeGlyphs.value = shuffleArray([...allVowels.value.map(v => ({ ...v, used: false }))])
  selectedPracticeSlot.value = null
}

function selectPracticeMatchSlot(idx) {
  if (practiceMatchPairs.value[idx].matched) return
  selectedPracticeSlot.value = idx
}

function placePracticeGlyph(glyph) {
  if (selectedPracticeSlot.value === null) return
  const pair = practiceMatchPairs.value[selectedPracticeSlot.value]
  if (pair.vowel.id === glyph.id) {
    pair.matched = true
    glyph.used = true
    selectedPracticeSlot.value = null
    if (practiceMatchPairs.value.every(p => p.matched)) {
      practiceStepComplete.value = true
    }
  } else {
    feedback.value = { correct: false, message: '¡Intenta otro!' }
    setTimeout(() => { feedback.value = null }, 600)
  }
}

// Practice 2: Identify
const practiceIdentifyIndex = ref(0)
const practiceIdentifyAttempted = ref(new Set())
const practiceIdentifyChallenge = computed(() => {
  return allVowels.value[practiceIdentifyIndex.value % allVowels.value.length]
})

const practiceIdentifyHints = computed(() => {
  const v = practiceIdentifyChallenge.value
  if (!v) return []
  return [
    `Mira bien la forma del glifo. ¿A qué vocal se parece?`,
    `El código Thompson de este glifo es T${v.thompson}.`,
    `La vocal es la ${v.syllable.toUpperCase()}.`,
  ]
})

function getPracticeIdentifyClass(id) {
  if (!practiceIdentifyAttempted.value.has(id)) return 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50'
  if (id === practiceIdentifyChallenge.value.id) return 'bg-green-100 border-green-500 text-green-700'
  return 'bg-red-100 border-red-400 text-red-600'
}

function checkPracticeIdentify(id) {
  practiceIdentifyAttempted.value.add(id)
  const correct = id === practiceIdentifyChallenge.value.id
  store.recordAttempt('vocales', practiceIdentifyChallenge.value.id, correct)
  if (correct) {
    feedback.value = { correct: true, message: '¡Correcto! 🎯' }
    acc.speak(`¡Correcto! La vocal ${practiceIdentifyChallenge.value.syllable.toUpperCase()}`)
    setTimeout(() => {
      feedback.value = null
      practiceIdentifyAttempted.value = new Set()
      practiceIdentifyIndex.value++
      if (practiceIdentifyIndex.value >= allVowels.value.length) {
        practiceStepComplete.value = true
      }
    }, 1000)
  } else {
    feedback.value = { correct: false, message: 'Intenta otra vez' }
    setTimeout(() => { feedback.value = null; practiceIdentifyAttempted.value.delete(id) }, 600)
  }
}

// Practice 3: Complete sequence
const practiceSequence = ref([])

function initPracticeSequence() {
  const shuffled = shuffleArray([...allVowels.value])
  const missingIdx = Math.floor(Math.random() * 5)
  practiceSequence.value = allVowels.value.map((v, i) => ({
    value: v.syllable.toUpperCase(),
    missing: i === missingIdx,
    selected: null,
    wrong: null,
    correctValue: v.syllable.toUpperCase(),
  }))
}

function fillPracticeSequence(choice) {
  const missing = practiceSequence.value.find(s => s.missing && !s.selected && !s.wrong)
  if (!missing) return
  if (choice === missing.correctValue) {
    missing.selected = choice
    practiceStepComplete.value = true
  } else {
    missing.wrong = choice
    setTimeout(() => { missing.wrong = null }, 600)
  }
}

function completePractice() {
  emit('complete', { module: 'vocales', phase: 'practice', stars: 3 })
  emit('next-phase')
}

// ============================================
// TEST PHASE
// ============================================
const testStarted = ref(false)
const testIndex = ref(0)
const testScore = ref(0)
const testComplete = ref(false)
const testFeedback = ref(null)
const testAttempted = ref(new Set())
const testQuestions = ref([])

const currentTestQuestion = computed(() => testQuestions.value[testIndex.value] || {})
const testStars = computed(() => testScore.value >= 5 ? 3 : testScore.value >= 3 ? 2 : 1)

const testHints = computed(() => {
  const q = currentTestQuestion.value
  if (!q || !q.correctId) return []
  return [
    'Observa la forma del glifo con atención.',
    'Recuerda: cada vocal tiene un glifo y un sonido únicos.',
    `La respuesta correcta es la vocal ${q.correctId.toUpperCase()}.`,
  ]
})

function startTest() {
  testStarted.value = true
  testIndex.value = 0
  testScore.value = 0
  testComplete.value = false
  testAttempted.value = new Set()
  testQuestions.value = shuffleArray([...allVowels.value]).map(v => ({
    id: v.id,
    image: v.image,
    correctId: v.id,
  }))
}

function getTestClass(id) {
  if (!testAttempted.value.has(testIndex.value)) return 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50'
  if (id === currentTestQuestion.value.correctId) return 'bg-green-100 border-green-500 text-green-700'
  if (testAttempted.value.has(testIndex.value) && id !== currentTestQuestion.value.correctId) return 'bg-white border-gray-300 opacity-50'
  return 'bg-white border-gray-300'
}

function answerTest(id) {
  if (testAttempted.value.has(testIndex.value)) return
  testAttempted.value.add(testIndex.value)
  const correct = id === currentTestQuestion.value.correctId
  store.recordAttempt('vocales', currentTestQuestion.value.correctId, correct)
  if (correct) {
    testScore.value++
    testFeedback.value = { correct: true, message: '¡Correcto! 🎯' }
    acc.speak(`¡Correcto! La vocal ${currentTestQuestion.value.correctId.toUpperCase()}`)
  } else {
    testFeedback.value = { correct: false, message: `Era: ${currentTestQuestion.value.correctId.toUpperCase()}` }
  }
  setTimeout(() => {
    testFeedback.value = null
    if (testIndex.value >= testQuestions.value.length - 1) {
      testComplete.value = true
    } else {
      testIndex.value++
    }
  }, 1200)
}

function resetTest() {
  testStarted.value = false
  testIndex.value = 0
  testScore.value = 0
  testComplete.value = false
  testAttempted.value = new Set()
}

function completeTest() {
  emit('complete', { module: 'vocales', phase: 'test', stars: testStars.value })
  emit('next-phase')
}

// ============================================
// HELPERS
// ============================================
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Reset on phase change
watch(() => props.phase, () => {
  if (props.phase === 'practice') {
    practiceStep.value = 0
    practiceStepComplete.value = false
    feedback.value = null
    initPracticeMatch()
    initPracticeSequence()
    practiceIdentifyIndex.value = 0
    practiceIdentifyAttempted.value = new Set()
  }
  if (props.phase === 'test') {
    testStarted.value = false
    testIndex.value = 0
    testScore.value = 0
    testComplete.value = false
  }
  if (props.phase === 'learn') {
    learnStep.value = 'intro'
    learnIndex.value = 0
  }
})
</script>
