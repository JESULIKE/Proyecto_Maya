<template>
  <div class="space-y-6">
    <!-- ============ LEARN ============ -->
    <div v-if="phase === 'learn'" class="space-y-6">
      <div v-if="learnStep === 'intro'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200 text-center">
          <div class="text-5xl mb-4"></div>
          <h3 class="text-2xl font-bold text-orange-900 mb-3">Lectura de Inscripciones Mayas</h3>
          <p class="text-gray-600 text-lg max-w-lg mx-auto">
            Para leer una inscripción maya, necesitas entender el <strong>orden de lectura</strong>:
            dos columnas, de <strong>arriba hacia abajo</strong>, y de <strong>izquierda a derecha</strong>.
          </p>
          <div class="bg-orange-50 rounded-xl p-6 mt-6 max-w-sm mx-auto">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-orange-200 rounded-lg p-3 text-center">
                <div class="text-xs text-orange-600">Columna 1</div>
                <div class="font-bold text-orange-800">1 → 2</div>
              </div>
              <div class="bg-orange-300 rounded-lg p-3 text-center">
                <div class="text-xs text-orange-600">Columna 2</div>
                <div class="font-bold text-orange-800">3 → 4</div>
              </div>
            </div>
            <p class="text-xs text-orange-600 mt-3">Primero columna izquierda, luego derecha</p>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'logograms'" class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Aprender más! →
          </button>
        </div>
      </div>

      <div v-if="learnStep === 'logograms'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200">
          <h3 class="text-2xl font-bold text-orange-900 mb-6 text-center">Logogramas</h3>
          <div class="space-y-4 max-w-lg mx-auto">
            <div class="flex items-center gap-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div class="w-20 h-20 bg-white rounded-xl border border-orange-300 flex items-center justify-center flex-shrink-0">
                <img :src="'/glifos/k\'al-aw-tuun.svg'" class="w-14 h-14 object-contain" />
              </div>
              <div>
                <div class="font-bold text-orange-800 text-lg">K'AL</div>
                <div class="text-sm text-gray-600">= "levantar" / "erigir"</div>
                <div class="text-xs text-orange-600">Un solo glifo representa toda la palabra</div>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div class="w-20 h-20 bg-white rounded-xl border border-orange-300 flex items-center justify-center flex-shrink-0">
                <img :src="'/glifos/k\'al-aw-tuun.svg'" class="w-14 h-14 object-contain" />
              </div>
              <div>
                <div class="font-bold text-orange-800 text-lg">TUUN</div>
                <div class="text-sm text-gray-600">= "piedra"</div>
                <div class="text-xs text-orange-600">Un solo glifo representa toda la palabra</div>
              </div>
            </div>
          </div>
          <p class="text-center text-sm text-gray-500 mt-6">
            Los logogramas son como <strong>ideogramas</strong>: una imagen = una palabra completa
          </p>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'complements'" class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            Complementos fonéticos →
          </button>
        </div>
      </div>

      <div v-if="learnStep === 'complements'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200">
          <h3 class="text-2xl font-bold text-orange-900 mb-6 text-center">Complementos Fonéticos</h3>
          <div class="bg-orange-50 rounded-xl p-6 border border-orange-200 max-w-lg mx-auto">
            <p class="text-gray-600 mb-4">
              Los logogramas a menudo tienen <strong>complementos fonéticos</strong> que ayudan a leerlos.
              Son sílabas pequeñas que dan pistas sobre la pronunciación.
            </p>
            <div class="bg-white rounded-xl p-4 border border-orange-300">
              <div class="text-center mb-3">
                <span class="text-lg font-bold text-orange-800">K'AL-wi-TUUN</span>
              </div>
              <div class="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <img :src="'/glifos/k\'al-aw-tuun.svg'" class="w-12 h-12 object-contain mx-auto mb-1" />
                  <div class="font-bold text-orange-700">K'AL</div>
                  <div class="text-xs text-gray-500">logograma</div>
                  <div class="text-xs text-orange-600">"levantar"</div>
                </div>
                <div>
                  <img :src="'/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg'" class="w-10 h-10 object-contain mx-auto mb-1" />
                  <div class="font-bold text-orange-700">wi</div>
                  <div class="text-xs text-gray-500">complemento</div>
                  <div class="text-xs text-orange-600">ayuda a leer</div>
                </div>
                <div>
                  <img :src="'/glifos/k\'al-aw-tuun.svg'" class="w-12 h-12 object-contain mx-auto mb-1" />
                  <div class="font-bold text-orange-700">TUUN</div>
                  <div class="text-xs text-gray-500">logograma</div>
                  <div class="text-xs text-orange-600">"piedra"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'meaning'" class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            Ver significado →
          </button>
        </div>
      </div>

      <div v-if="learnStep === 'meaning'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200">
          <h3 class="text-2xl font-bold text-orange-900 mb-6 text-center">Significado de los Bloques</h3>
          <div class="space-y-4 max-w-lg mx-auto">
            <div class="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="flex gap-1">
                  <img :src="'/glifos/k\'al-aw-tuun.svg'" class="w-10 h-10 object-contain" />
                  <img :src="'/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg'" class="w-7 h-7 object-contain" />
                  <img :src="'/glifos/k\'al-aw-tuun.svg'" class="w-10 h-10 object-contain" />
                </div>
                <span class="font-bold text-orange-800">→</span>
                <span class="font-bold text-orange-800">"él levanta la piedra"</span>
              </div>
              <p class="text-xs text-gray-600">K'AL (levantar) + wi (complemento) + TUUN (piedra)</p>
            </div>
            <div class="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="flex gap-1">
                  <img :src="'/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg'" class="w-10 h-10 object-contain" />
                  <img :src="'/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg'" class="w-7 h-7 object-contain" />
                  <img :src="'/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg'" class="w-10 h-10 object-contain" />
                </div>
                <span class="font-bold text-orange-800">→</span>
                <span class="font-bold text-orange-800">"jaguar"</span>
              </div>
              <p class="text-xs text-gray-600">BA-LA-MA = BAHLAM (jaguar)</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'summary'" class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Ver resumen! →
          </button>
        </div>
      </div>

      <div v-if="learnStep === 'summary'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200 text-center">
          <div class="text-5xl mb-4"></div>
          <h3 class="text-2xl font-bold text-orange-900 mb-4">¡Ahora puedes leer inscripciones mayas!</h3>
          <div class="bg-orange-50 rounded-xl p-4 border border-orange-200 max-w-md mx-auto text-left space-y-2">
            <div class="text-sm text-gray-600"><strong class="text-orange-700">1.</strong> Lee en dos columnas: arriba→abajo, izquierda→derecha</div>
            <div class="text-sm text-gray-600"><strong class="text-orange-700">2.</strong> Identifica logogramas (palabras completas)</div>
            <div class="text-sm text-gray-600"><strong class="text-orange-700">3.</strong> Los complementos fonéticos ayudan a leer</div>
            <div class="text-sm text-gray-600"><strong class="text-orange-700">4.</strong> Los bloques tienen significado completo</div>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="handleLearnComplete" class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Practicar! →
          </button>
        </div>
      </div>
    </div>

    <!-- ============ PRACTICE ============ -->
    <div v-if="phase === 'practice'" class="space-y-6">
      <div v-if="practiceStep === 0" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-orange-900 mb-2"> Empareja Bloque con Significado</h3>
          <p class="text-gray-600">Lee el bloque y elige su significado</p>
        </div>
        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div class="relative w-40 h-40">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="matchBlock.main.image" class="w-24 h-24 object-contain" />
              </div>
              <div v-if="matchBlock.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                <img :src="matchBlock.left.image" class="w-10 h-10 object-contain" />
              </div>
              <div v-if="matchBlock.right" class="absolute right-0 top-1/2 -translate-y-1/2">
                <img :src="matchBlock.right.image" class="w-10 h-10 object-contain" />
              </div>
              <div v-if="matchBlock.below" class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <img :src="matchBlock.below.image" class="w-10 h-10 object-contain" />
              </div>
            </div>
          </div>
        </div>
        <p class="text-center text-lg font-bold text-gray-700">¿Qué significa este bloque?</p>
        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="opt in matchChoices" :key="opt.id" @click="checkMatch(opt.id)"
            class="px-6 py-3 rounded-xl border-2 font-bold transition-all" :class="getMatchClass(opt.id)">
            {{ opt.meaning }}
          </button>
        </div>
        <div v-if="feedback" class="text-center text-lg font-bold" :class="feedback.correct ? 'text-green-600' : 'text-red-500'">
          {{ feedback.message }}
        </div>
      </div>

      <div v-if="practiceStep === 1" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-orange-900 mb-2"> Completa el Bloque</h3>
          <p class="text-gray-600">Este bloque tiene una parte que falta. ¡Encuéntrala!</p>
        </div>
        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div class="relative w-40 h-40">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="completeBlock.main.image" class="w-24 h-24 object-contain" />
              </div>
              <div v-if="completeBlock.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                <img :src="completeBlock.left.image" class="w-10 h-10 object-contain" />
              </div>
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-lg border-2 border-dashed border-red-400 bg-red-50 flex items-center justify-center">
                <span class="text-red-400 text-lg">?</span>
              </div>
            </div>
          </div>
        </div>
        <p class="text-center text-lg font-bold text-gray-700">¿Qué sílaba falta?</p>
        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="opt in completeChoices" :key="opt.id" @click="checkComplete(opt.id)"
            class="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all" :class="getCompleteClass(opt.id)">
            <img :src="opt.image" class="w-10 h-10 object-contain" />
            <span class="text-xs font-bold text-orange-700">{{ opt.syllable.toUpperCase() }}</span>
          </button>
        </div>
        <div v-if="feedback" class="text-center text-lg font-bold" :class="feedback.correct ? 'text-green-600' : 'text-red-500'">
          {{ feedback.message }}
        </div>
      </div>

      <div v-if="practiceStep === 2" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-orange-900 mb-2"> Quiz de Lectura</h3>
          <p class="text-gray-600">Lee los bloques y elige la transcripción correcta</p>
          <div class="text-sm text-gray-500 mt-1">Bloque {{ readingQuizIndex + 1 }}/{{ readingQuizBlocks.length }}</div>
        </div>
        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div class="relative w-40 h-40">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="readingQuizBlock.main.image" class="w-24 h-24 object-contain" />
              </div>
              <div v-if="readingQuizBlock.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                <img :src="readingQuizBlock.left.image" class="w-10 h-10 object-contain" />
              </div>
              <div v-if="readingQuizBlock.below" class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <img :src="readingQuizBlock.below.image" class="w-10 h-10 object-contain" />
              </div>
            </div>
          </div>
        </div>
        <p class="text-center text-lg font-bold text-gray-700">¿Cómo se lee este bloque?</p>
        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="opt in readingQuizChoices" :key="opt.id" @click="checkReadingQuiz(opt.id)"
            class="px-5 py-3 rounded-xl border-2 font-bold transition-all" :class="getReadingQuizClass(opt.id)">
            {{ opt.reading }}
          </button>
        </div>
        <div v-if="feedback" class="text-center text-lg font-bold" :class="feedback.correct ? 'text-green-600' : 'text-red-500'">
          {{ feedback.message }}
        </div>
      </div>

      <div class="flex justify-between items-center mt-8">
        <button v-if="practiceStep > 0" @click="practiceStep--" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
          ← Anterior
        </button>
        <div v-else></div>
        <div class="flex gap-1">
          <div v-for="i in 3" :key="i" class="w-3 h-3 rounded-full transition-colors"
            :class="i - 1 === practiceStep ? 'bg-orange-600' : (i - 1 < practiceStep ? 'bg-orange-400' : 'bg-gray-300')"></div>
        </div>
        <button v-if="practiceStep < 2 && practiceStepComplete" @click="nextPracticeStep"
          class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
          Siguiente →
        </button>
        <button v-else-if="practiceStep === 2 && practiceStepComplete" @click="handlePracticeComplete"
          class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
          ¡Siguiente! →
        </button>
      </div>
    </div>

    <!-- ============ TEST ============ -->
    <div v-if="phase === 'test'" class="space-y-6">
      <div v-if="!testStarted" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200 text-center">
          <div class="text-5xl mb-4"></div>
          <h3 class="text-2xl font-bold text-orange-900 mb-3">Examen de Lectura</h3>
          <p class="text-gray-600 text-lg">Responde 3 preguntas sobre lectura de inscripciones</p>
          <div class="mt-4 text-sm text-gray-500">
            ⭐ 3/3 = 3 estrellas | ⭐ 2 = 2 estrellas | ⭐ 1 = 1 estrella
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="startTest" class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar Examen! 
          </button>
        </div>
      </div>

      <div v-if="testStarted && !testComplete" class="space-y-6">
        <div class="text-center">
          <div class="text-lg font-bold text-orange-800">Pregunta {{ testIndex + 1 }}/{{ testQuestions.length }}</div>
          <div class="w-full h-2 bg-orange-100 rounded-full mt-2 max-w-md mx-auto">
            <div class="h-full bg-orange-500 rounded-full transition-all" :style="{ width: testProgress + '%' }"></div>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div class="relative w-40 h-40">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="currentTestQuestion.block.main.image" class="w-24 h-24 object-contain" />
              </div>
              <div v-if="currentTestQuestion.block.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                <img :src="currentTestQuestion.block.left.image" class="w-10 h-10 object-contain" />
              </div>
              <div v-if="currentTestQuestion.block.below" class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <img :src="currentTestQuestion.block.below.image" class="w-10 h-10 object-contain" />
              </div>
            </div>
          </div>
        </div>
        <p class="text-center text-lg font-bold text-gray-700">{{ currentTestQuestion.prompt }}</p>
        <div class="flex justify-center gap-3 flex-wrap">
          <button v-for="opt in currentTestQuestion.choices" :key="opt.id" @click="answerTest(opt.id)"
            class="px-6 py-3 rounded-xl border-2 font-bold transition-all" :class="getTestClass(opt.id)">
            {{ opt.label }}
          </button>
        </div>

        <!-- Socratic scaffolding hints -->
        <ScaffoldingHints :hints="testHints" :reset-key="testIndex" />
      </div>

      <div v-if="testComplete" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-orange-200 text-center">
          <div class="text-5xl mb-4">{{ testEmoji }}</div>
          <h3 class="text-2xl font-bold text-orange-900 mb-3">{{ testMessage }}</h3>
          <div class="text-4xl font-bold text-orange-700">{{ testScore }}/{{ testQuestions.length }}</div>
        </div>
        <div class="flex justify-center gap-4">
          <button @click="resetTest" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            Intentar de Nuevo
          </button>
          <button @click="handleTestComplete" class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Siguiente Módulo! →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTextbookStore } from '~/composables/useTextbookStore'
import { useAccessibility } from '~/composables/useAccessibility'
import ScaffoldingHints from '~/components/textbook/ScaffoldingHints.vue'

const props = defineProps({ phase: { type: String, default: 'learn' } })
const emit = defineEmits(['complete', 'next-phase'])
const store = useTextbookStore()
const acc = useAccessibility()

const blockData = {
  'kal-tuun': {
    id: 'kal-tuun',
    reading: "K'AL-wi-TUUN",
    meaning: 'él levanta la piedra',
    main: { syllable: "k'al", image: '/glifos/k\'al-aw-tuun.svg' },
    left: { syllable: 'wi', image: '/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg' },
    right: null,
    above: null,
    below: { syllable: 'tuun', image: '/glifos/k\'al-aw-tuun.svg' },
  },
  balam: {
    id: 'balam',
    reading: 'BA-LA-MA',
    meaning: 'jaguar',
    main: { syllable: 'ba', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg' },
    left: { syllable: 'la', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg' },
    right: null,
    above: null,
    below: { syllable: 'ma', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg' },
  },
  chok: {
    id: 'chok',
    reading: "CH'O-KO",
    meaning: 'joven',
    main: { syllable: "ch'o", image: '/escritura_maya/escritura%20maya%20mejorada/CH%27%20VOCALES/93bh.svg' },
    left: null,
    right: { syllable: 'ko', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/738bh.svg' },
    above: null,
    below: null,
  },
}

const allBlocks = Object.values(blockData)
const learnStep = ref('intro')
const practiceStep = ref(0)
const practiceStepComplete = ref(false)
const feedback = ref(null)

const matchIndex = ref(0)
const matchBlock = computed(() => allBlocks[matchIndex.value % allBlocks.length])
const matchAttempted = ref(new Set())
const matchChoices = computed(() => shuffleArray([...allBlocks]))

function getMatchClass(id) {
  if (!matchAttempted.value.has(id)) return 'bg-white border-gray-300 hover:border-orange-400'
  if (id === matchBlock.value.id) return 'bg-green-100 border-green-500 text-green-700'
  return 'bg-red-100 border-red-400 text-red-600'
}

function checkMatch(id) {
  matchAttempted.value.add(id)
  if (id === matchBlock.value.id) {
    feedback.value = { correct: true, message: '¡Correcto! ' }
    setTimeout(() => {
      feedback.value = null
      matchAttempted.value = new Set()
      matchIndex.value++
      if (matchIndex.value >= allBlocks.length) practiceStepComplete.value = true
    }, 1200)
  } else {
    feedback.value = { correct: false, message: 'Intenta otra vez' }
    setTimeout(() => {
      feedback.value = null
      matchAttempted.value.delete(id)
    }, 600)
  }
}

const completeBlockData = {
  main: { syllable: 'ba', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg' },
  left: { syllable: 'la', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg' },
  missing: { syllable: 'ma', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg' },
}
const completeBlock = ref(completeBlockData)
const completeAttempted = ref(new Set())

const completeChoices = computed(() => {
  const correct = completeBlock.value.missing
  const others = [
    { id: 'o', syllable: 'o', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/99hc.svg' },
    { id: 'u', syllable: 'u', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1bh.svg' },
  ]
  return shuffleArray([{ ...correct, id: correct.syllable }, ...others])
})

function getCompleteClass(id) {
  if (!completeAttempted.value.has(id)) return 'bg-white border-gray-300 hover:border-orange-400'
  if (id === completeBlock.value.missing.syllable) return 'bg-green-100 border-green-500'
  return 'bg-red-100 border-red-400'
}

function checkComplete(id) {
  completeAttempted.value.add(id)
  if (id === completeBlock.value.missing.syllable) {
    feedback.value = { correct: true, message: '¡Correcto! ' }
    setTimeout(() => {
      feedback.value = null
      completeAttempted.value = new Set()
      practiceStepComplete.value = true
    }, 1200)
  } else {
    feedback.value = { correct: false, message: 'Intenta otra vez' }
    setTimeout(() => {
      feedback.value = null
      completeAttempted.value.delete(id)
    }, 600)
  }
}

const readingQuizIndex = ref(0)
const readingQuizAttempted = ref(new Set())
const readingQuizBlocks = [blockData['kal-tuun'], blockData.balam, blockData.chok]
const readingQuizBlock = computed(() => readingQuizBlocks[readingQuizIndex.value % readingQuizBlocks.length])
const readingQuizChoices = computed(() => {
  const correct = readingQuizBlock.value
  const others = readingQuizBlocks.filter(b => b.id !== correct.id)
  return shuffleArray([correct, ...others])
})

function getReadingQuizClass(id) {
  if (!readingQuizAttempted.value.has(id)) return 'bg-white border-gray-300 hover:border-orange-400'
  if (id === readingQuizBlock.value.id) return 'bg-green-100 border-green-500 text-green-700'
  return 'bg-red-100 border-red-400 text-red-600'
}

function checkReadingQuiz(id) {
  readingQuizAttempted.value.add(id)
  if (id === readingQuizBlock.value.id) {
    feedback.value = { correct: true, message: '¡Correcto! ' }
    setTimeout(() => {
      feedback.value = null
      readingQuizAttempted.value = new Set()
      readingQuizIndex.value++
      if (readingQuizIndex.value >= readingQuizBlocks.length) practiceStepComplete.value = true
    }, 1200)
  } else {
    feedback.value = { correct: false, message: 'Intenta otra vez' }
    setTimeout(() => {
      feedback.value = null
      readingQuizAttempted.value.delete(id)
    }, 600)
  }
}

function nextPracticeStep() {
  practiceStep.value++
  practiceStepComplete.value = false
  feedback.value = null
  initPracticeStep()
}

function initPracticeStep() {
  feedback.value = null
  if (practiceStep.value === 0) { matchIndex.value = 0; matchAttempted.value = new Set(); practiceStepComplete.value = false }
  if (practiceStep.value === 1) { completeAttempted.value = new Set(); practiceStepComplete.value = false }
  if (practiceStep.value === 2) { readingQuizIndex.value = 0; readingQuizAttempted.value = new Set(); practiceStepComplete.value = false }
}

const testStarted = ref(false)
const testIndex = ref(0)
const testScore = ref(0)
const testComplete = ref(false)
const testAttempted = ref(new Set())

const testQuestions = [
  {
    block: blockData['kal-tuun'],
    prompt: '¿Qué significa este bloque?',
    choices: [
      { id: 'kal-tuun', label: "K'AL-wi-TUUN (él levanta la piedra)" },
      { id: 'balam', label: 'BA-LA-MA (jaguar)' },
      { id: 'chok', label: "CH'O-KO (joven)" },
    ],
    correct: 'kal-tuun',
  },
  {
    block: blockData.balam,
    prompt: '¿Cómo se lee este bloque?',
    choices: [
      { id: 'kal-tuun', label: "K'AL-wi-TUUN" },
      { id: 'balam', label: 'BA-LA-MA' },
      { id: 'chok', label: "CH'O-KO" },
    ],
    correct: 'balam',
  },
  {
    block: blockData.chok,
    prompt: '¿Qué significa este bloque?',
    choices: [
      { id: 'kal-tuun', label: "K'AL-wi-TUUN (erección)" },
      { id: 'balam', label: 'BA-LA-MA (piedra)' },
      { id: 'chok', label: "CH'O-KO (joven)" },
    ],
    correct: 'chok',
  },
]

const currentTestQuestion = computed(() => testQuestions[testIndex.value] || testQuestions[0])
const testProgress = computed(() => (testIndex.value / testQuestions.length) * 100)
const testEmoji = computed(() => testScore.value >= 3 ? '🏆' : testScore.value >= 2 ? '🎉' : '💪')
const testMessage = computed(() => testScore.value >= 3 ? '¡Perfecto!' : testScore.value >= 2 ? '¡Bien hecho!' : '¡Sigue practicando!')

const testHints = computed(() => {
  const q = currentTestQuestion.value
  if (!q || !q.correct) return []
  return [
    'Observa cada glifo del bloque cuidadosamente.',
    'Recuerda: se lee de arriba hacia abajo, de izquierda a derecha.',
    `La lectura correcta es ${q.choices.find(c => c.id === q.correct)?.label || ''}.`,
  ]
})

function startTest() {
  testStarted.value = true
  testIndex.value = 0
  testScore.value = 0
  testComplete.value = false
  testAttempted.value = new Set()
}

function getTestClass(id) {
  if (!testAttempted.value.has(testIndex.value)) return 'bg-white border-gray-300 hover:border-orange-400'
  if (id === currentTestQuestion.value.correct) return 'bg-green-100 border-green-500 text-green-700'
  return 'bg-red-100 border-red-400 text-red-600'
}

function answerTest(id) {
  if (testAttempted.value.has(testIndex.value)) return
  testAttempted.value.add(testIndex.value)
  const correct = id === currentTestQuestion.value.correct
  store.recordAttempt('lectura', currentTestQuestion.value.correct, correct)
  if (correct) { testScore.value++; acc.speak('¡Correcto!') }
  setTimeout(() => {
    if (testIndex.value >= testQuestions.length - 1) testComplete.value = true
    else testIndex.value++
  }, 1200)
}

function resetTest() {
  testStarted.value = false
  testIndex.value = 0
  testScore.value = 0
  testComplete.value = false
  testAttempted.value = new Set()
}

function handleLearnComplete() {
  emit('complete', { module: 'lectura', phase: 'learn', stars: 3 })
  emit('next-phase')
}

function handlePracticeComplete() {
  emit('complete', { module: 'lectura', phase: 'practice', stars: 3 })
  emit('next-phase')
}

function handleTestComplete() {
  const stars = testScore.value >= 3 ? 3 : testScore.value >= 2 ? 2 : 1
  emit('complete', { module: 'lectura', phase: 'test', stars })
  emit('next-phase')
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i]
    a[i] = a[j]
    a[j] = temp
  }
  return a
}

watch(() => props.phase, () => {
  if (props.phase === 'learn') learnStep.value = 'intro'
  if (props.phase === 'practice') {
    practiceStep.value = 0
    practiceStepComplete.value = false
    feedback.value = null
    matchIndex.value = 0
    matchAttempted.value = new Set()
  }
  if (props.phase === 'test') {
    testStarted.value = false
    testIndex.value = 0
    testScore.value = 0
    testComplete.value = false
  }
})
</script>
