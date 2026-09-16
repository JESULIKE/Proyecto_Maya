<template>
  <div class="space-y-6">
    <!-- ============================================ -->
    <!-- PHASE: LEARN (Aprender)                      -->
    <!-- ============================================ -->
    <div v-if="phase === 'learn'" class="space-y-6">
      <!-- Step 1: Intro -->
      <div v-if="learnStep === 'intro'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-purple-200 text-center">
          <div class="text-5xl mb-4">🧱</div>
          <h3 class="text-2xl font-bold text-purple-900 mb-3">Bloques de Glifos</h3>
          <p class="text-gray-600 text-lg max-w-lg mx-auto">
            En maya, las <strong>sílabas se combinan</strong> para formar bloques.
            Cada bloque tiene varias <strong>posiciones</strong>: principal, izquierda, derecha, arriba y abajo.
          </p>
          <div class="bg-purple-50 rounded-xl p-6 mt-6 max-w-md mx-auto">
            <div class="relative w-40 h-40 mx-auto">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 bg-purple-200 rounded-lg border-2 border-purple-400 flex items-center justify-center text-purple-700 font-bold text-xs">PRINCIPAL</div>
              </div>
              <div class="absolute left-0 top-1/2 -translate-y-1/2">
                <div class="w-10 h-10 bg-purple-100 rounded-lg border border-purple-300 flex items-center justify-center text-purple-600 font-bold text-[10px]">IZQ</div>
              </div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2">
                <div class="w-10 h-10 bg-purple-100 rounded-lg border border-purple-300 flex items-center justify-center text-purple-600 font-bold text-[10px]">DER</div>
              </div>
              <div class="absolute top-0 left-1/2 -translate-x-1/2">
                <div class="w-10 h-10 bg-purple-100 rounded-lg border border-purple-300 flex items-center justify-center text-purple-600 font-bold text-[10px]">ARR</div>
              </div>
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div class="w-10 h-10 bg-purple-100 rounded-lg border border-purple-300 flex items-center justify-center text-purple-600 font-bold text-[10px]">ABA</div>
              </div>
            </div>
            <p class="text-sm text-purple-600 mt-4">Un bloque puede tener hasta 5 posiciones</p>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'positions'; learnPositionIndex = 0"
                  class="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Ver las posiciones! →
          </button>
        </div>
      </div>

      <!-- Step 2: Positions -->
      <div v-if="learnStep === 'positions'" class="space-y-6">
        <div class="text-center text-sm text-gray-500">
          Posición {{ learnPositionIndex + 1 }} de {{ learnPositions.length }}
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 border border-purple-200">
          <div class="text-center mb-4">
            <span class="text-2xl font-bold text-purple-700">{{ learnPositions[learnPositionIndex].name }}</span>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="flex-shrink-0">
              <div class="relative w-48 h-48 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <div class="absolute inset-0 flex items-center justify-center">
                  <img :src="learnPositions[learnPositionIndex].block.main.image" class="w-24 h-24 object-contain" />
                </div>
                <div v-if="learnPositions[learnPositionIndex].block.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                  <img :src="learnPositions[learnPositionIndex].block.left.image" class="w-10 h-10 object-contain" />
                </div>
                <div v-if="learnPositions[learnPositionIndex].block.right" class="absolute right-0 top-1/2 -translate-y-1/2">
                  <img :src="learnPositions[learnPositionIndex].block.right.image" class="w-10 h-10 object-contain" />
                </div>
                <div v-if="learnPositions[learnPositionIndex].block.above" class="absolute top-0 left-1/2 -translate-x-1/2">
                  <img :src="learnPositions[learnPositionIndex].block.above.image" class="w-10 h-10 object-contain" />
                </div>
                <div v-if="learnPositions[learnPositionIndex].block.below" class="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <img :src="learnPositions[learnPositionIndex].block.below.image" class="w-10 h-10 object-contain" />
                </div>
                <div class="absolute inset-0 border-4 border-purple-400 rounded-2xl pointer-events-none"
                     :class="learnPositions[learnPositionIndex].highlightClass"></div>
              </div>
            </div>

            <div class="text-center md:text-left flex-1">
              <p class="text-gray-600 text-lg mb-3">{{ learnPositions[learnPositionIndex].description }}</p>
              <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div class="text-sm text-purple-600 font-bold mb-1">Ejemplo en este bloque:</div>
                <div class="text-lg font-bold text-purple-800">{{ learnPositions[learnPositionIndex].example }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button v-if="learnPositionIndex > 0" @click="learnPositionIndex--"
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            ← Anterior
          </button>
          <div v-else></div>

          <div class="flex gap-1">
            <div v-for="(p, idx) in learnPositions" :key="idx"
                 class="w-3 h-3 rounded-full transition-colors"
                 :class="idx === learnPositionIndex ? 'bg-purple-600' : (idx < learnPositionIndex ? 'bg-purple-400' : 'bg-gray-300')">
            </div>
          </div>

          <button v-if="learnPositionIndex < learnPositions.length - 1" @click="learnPositionIndex++"
                  class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
            Siguiente →
          </button>
          <button v-else @click="learnStep = 'reading-order'"
                  class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
            Orden de lectura →
          </button>
        </div>
      </div>

      <!-- Step 3: Reading order -->
      <div v-if="learnStep === 'reading-order'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-purple-200">
          <h3 class="text-2xl font-bold text-purple-900 mb-6 text-center">Orden de Lectura</h3>

          <div class="space-y-6 max-w-lg mx-auto">
            <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 class="font-bold text-purple-800 mb-2">1. Dentro del bloque</h4>
              <p class="text-sm text-gray-600">Primero se lee el glifo <strong>principal</strong>, luego los afijos (complementos).</p>
              <p class="text-xs text-purple-700 font-mono mt-1">K'AL → wi → TUUN = K'AL-wi-TUUN</p>
            </div>

            <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 class="font-bold text-purple-800 mb-2">2. Entre bloques</h4>
              <p class="text-sm text-gray-600">Los bloques se organizan en <strong>dos columnas</strong>, leídos de <strong>arriba hacia abajo</strong> y de <strong>izquierda a derecha</strong>.</p>
              <div class="flex justify-center gap-4 mt-3">
                <div class="grid grid-cols-2 gap-2">
                  <div class="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center text-xs font-bold text-purple-700">1</div>
                  <div class="w-12 h-12 bg-purple-300 rounded-lg flex items-center justify-center text-xs font-bold text-purple-700">3</div>
                  <div class="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center text-xs font-bold text-white">2</div>
                  <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button @click="learnStep = 'summary'"
                  class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Ver resumen! →
          </button>
        </div>
      </div>

      <!-- Step 4: Summary -->
      <div v-if="learnStep === 'summary'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-purple-200 text-center">
          <div class="text-5xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-purple-900 mb-4">¡Ahora entiendes la estructura de bloques!</h3>
          <p class="text-gray-600">Los bloques mayas combinan sílabas en posiciones fijas: principal, izquierda, derecha, arriba y abajo.</p>
        </div>
        <div class="flex justify-center">
          <button @click="$emit('complete', { module: 'bloques', phase: 'learn', stars: 3 }); $emit('next-phase')"
                  class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Practicar! →
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: PRACTICE (Practicar)                  -->
    <!-- ============================================ -->
    <div v-if="phase === 'practice'" class="space-y-6">
      <!-- Exercise 1: Observe - identify parts -->
      <div v-if="practiceStep === 0" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-purple-900 mb-2">👀 Observa el Bloque</h3>
          <p class="text-gray-600">Identifica cada parte del bloque</p>
        </div>

        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div class="relative w-48 h-48">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="observeBlock.main.image" class="w-28 h-28 object-contain" />
              </div>
              <div v-if="observeBlock.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                <img :src="observeBlock.left.image" class="w-12 h-12 object-contain opacity-80" />
              </div>
              <div v-if="observeBlock.right" class="absolute right-0 top-1/2 -translate-y-1/2">
                <img :src="observeBlock.right.image" class="w-12 h-12 object-contain opacity-80" />
              </div>
              <div v-if="observeBlock.above" class="absolute top-0 left-1/2 -translate-x-1/2">
                <img :src="observeBlock.above.image" class="w-12 h-12 object-contain opacity-80" />
              </div>
              <div v-if="observeBlock.below" class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <img :src="observeBlock.below.image" class="w-12 h-12 object-contain opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-md mx-auto space-y-3">
          <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 class="font-bold text-purple-800 mb-2">Posiciones del bloque:</h4>
            <div class="grid grid-cols-3 gap-2 text-center text-sm">
              <div class="bg-white rounded-lg p-2 border border-purple-200">
                <div class="text-xs text-gray-500">arriba</div>
                <div class="font-bold text-purple-700">{{ observeBlock.above?.syllable || '—' }}</div>
              </div>
              <div></div>
              <div class="bg-white rounded-lg p-2 border border-purple-200">
                <div class="text-xs text-gray-500">derecha</div>
                <div class="font-bold text-purple-700">{{ observeBlock.right?.syllable || '—' }}</div>
              </div>
              <div class="bg-white rounded-lg p-2 border border-purple-200">
                <div class="text-xs text-gray-500">izquierda</div>
                <div class="font-bold text-purple-700">{{ observeBlock.left?.syllable || '—' }}</div>
              </div>
              <div class="bg-purple-200 rounded-lg p-2 border border-purple-400">
                <div class="text-xs text-purple-600">principal</div>
                <div class="font-bold text-purple-800">{{ observeBlock.main.syllable }}</div>
              </div>
              <div class="bg-white rounded-lg p-2 border border-purple-200">
                <div class="text-xs text-gray-500">abajo</div>
                <div class="font-bold text-purple-700">{{ observeBlock.below?.syllable || '—' }}</div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <div class="text-sm font-bold text-purple-700">{{ observeBlock.reading }}</div>
            <div class="text-xs text-gray-500">{{ observeBlock.meaning }}</div>
          </div>

          <button @click="nextObserve" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
            Siguiente bloque →
          </button>
        </div>
      </div>

      <!-- Exercise 2: Build - place syllables in positions -->
      <div v-if="practiceStep === 1" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-purple-900 mb-2">🔨 Construye el Bloque</h3>
          <p class="text-gray-600">Coloca las sílabas en las posiciones correctas</p>
        </div>

        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <div class="text-center mb-3 text-sm text-purple-600 font-bold">{{ buildTarget.reading }}</div>
            <div class="relative w-48 h-48">
              <div
                v-for="(slot, idx) in buildSlots"
                :key="idx"
                @click="selectBuildSlot(idx)"
                class="absolute rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all"
                :class="getBuildSlotClass(idx, slot)"
                :style="getSlotPosition(slot.position)"
              >
                <img v-if="slot.filled" :src="slot.glyph.image" class="w-12 h-12 object-contain" />
                <span v-else class="text-purple-300 text-lg">{{ slot.positionLabel }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3 flex-wrap">
          <button
            v-for="(syl, idx) in buildChoices"
            :key="idx"
            @click="selectBuildChoice(syl)"
            class="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border-2 transition-all hover:scale-105"
            :class="syl.used ? 'border-gray-200 opacity-30' : (selectedBuildChoice === syl ? 'border-purple-500 bg-purple-50' : 'border-purple-300')"
            :disabled="syl.used"
          >
            <img :src="syl.image" class="w-10 h-10 object-contain" />
            <span class="text-xs font-bold text-purple-700">{{ syl.syllable.toUpperCase() }}</span>
          </button>
        </div>

        <div v-if="feedback" class="text-center text-lg font-bold" :class="feedback.correct ? 'text-green-600' : 'text-red-500'">
          {{ feedback.message }}
        </div>
      </div>

      <!-- Exercise 3: Puzzle - click pieces in order -->
      <div v-if="practiceStep === 2" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-purple-900 mb-2">🧩 Puzzle de Glifos</h3>
          <p class="text-gray-600">Ensambra las piezas para formar el bloque</p>
        </div>

        <div class="flex justify-center">
          <div class="relative w-56 h-56 bg-white rounded-2xl shadow-lg border-2 border-purple-200">
            <div class="absolute inset-4 border-2 border-dashed border-purple-300 rounded-xl"></div>
            <div
              v-for="(piece, idx) in puzzlePieces"
              :key="idx"
              :style="piece.placed ? getPiecePosition(piece.position) : {}"
              class="absolute transition-all duration-300"
              :class="piece.placed ? '' : 'hidden'"
            >
              <img :src="piece.image" class="w-14 h-14 object-contain" />
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3 flex-wrap">
          <button
            v-for="(piece, idx) in shuffledPuzzlePieces"
            :key="idx"
            @click="placePuzzlePiece(piece)"
            class="w-16 h-16 bg-white rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105"
            :class="piece.placed ? 'border-gray-200 opacity-30' : 'border-purple-300 hover:border-purple-500'"
            :disabled="piece.placed"
          >
            <img :src="piece.image" class="w-12 h-12 object-contain" />
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
          <div v-for="i in 3" :key="i" class="w-3 h-3 rounded-full transition-colors"
               :class="i - 1 === practiceStep ? 'bg-purple-600' : (i - 1 < practiceStep ? 'bg-purple-400' : 'bg-gray-300')">
          </div>
        </div>

        <button v-if="practiceStep < 2 && practiceStepComplete" @click="practiceStep++; practiceStepComplete = false; initPracticeStep()"
                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
          Siguiente →
        </button>
        <button v-else-if="practiceStep === 2 && practiceStepComplete"
                @click="$emit('complete', { module: 'bloques', phase: 'practice', stars: 3 }); $emit('next-phase')"
                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
          ¡Siguiente! →
        </button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: TEST (Evaluar)                        -->
    <!-- ============================================ -->
    <div v-if="phase === 'test'" class="space-y-6">
      <div v-if="!testStarted" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-purple-200 text-center">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-2xl font-bold text-purple-900 mb-3">Examen de Bloques</h3>
          <p class="text-gray-600 text-lg">Responde 3 preguntas sobre bloques mayas</p>
          <div class="mt-4 text-sm text-gray-500">
            ⭐ 3/3 = 3 estrellas | ⭐ 2 = 2 estrellas | ⭐ 1 = 1 estrella
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="startTest" class="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar Examen! 🚀
          </button>
        </div>
      </div>

      <div v-if="testStarted && !testComplete" class="space-y-6">
        <div class="text-center">
          <div class="text-lg font-bold text-purple-800">Pregunta {{ testIndex + 1 }}/{{ testQuestions.length }}</div>
          <div class="w-full h-2 bg-purple-100 rounded-full mt-2 max-w-md mx-auto">
            <div class="h-full bg-purple-500 rounded-full transition-all" :style="{ width: (testIndex / testQuestions.length * 100) + '%' }"></div>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div class="relative w-40 h-40">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="currentTestQuestion.block.main.image" class="w-24 h-24 object-contain" />
              </div>
              <div v-if="currentTestQuestion.block.left" class="absolute left-0 top-1/2 -translate-y-1/2">
                <img :src="currentTestQuestion.block.left.image" class="w-10 h-10 object-contain" />
              </div>
              <div v-if="currentTestQuestion.block.right" class="absolute right-0 top-1/2 -translate-y-1/2">
                <img :src="currentTestQuestion.block.right.image" class="w-10 h-10 object-contain" />
              </div>
              <div v-if="currentTestQuestion.block.below" class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <img :src="currentTestQuestion.block.below.image" class="w-10 h-10 object-contain" />
              </div>
            </div>
          </div>
        </div>

        <p class="text-center text-lg font-bold text-gray-700">¿Cómo se lee este bloque?</p>

        <div class="flex justify-center gap-3 flex-wrap">
          <button
            v-for="opt in currentTestQuestion.choices"
            :key="opt.id"
            @click="answerTest(opt.id)"
            class="px-6 py-3 rounded-xl border-2 font-bold transition-all"
            :class="getTestClass(opt.id)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Socratic scaffolding hints -->
        <ScaffoldingHints :hints="testHints" :reset-key="testIndex" />
      </div>

      <div v-if="testComplete" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-purple-200 text-center">
          <div class="text-5xl mb-4">{{ testScore >= 3 ? '🏆' : testScore >= 2 ? '🎉' : '💪' }}</div>
          <h3 class="text-2xl font-bold text-purple-900 mb-3">
            {{ testScore >= 3 ? '¡Perfecto!' : testScore >= 2 ? '¡Bien hecho!' : '¡Sigue practicando!' }}
          </h3>
          <div class="text-4xl font-bold text-purple-700">{{ testScore }}/{{ testQuestions.length }}</div>
        </div>
        <div class="flex justify-center gap-4">
          <button @click="resetTest" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            Intentar de Nuevo
          </button>
          <button @click="$emit('complete', { module: 'bloques', phase: 'test', stars: testScore >= 3 ? 3 : testScore >= 2 ? 2 : 1 }); $emit('next-phase')"
                  class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Siguiente Módulo! →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { syllables } from '~/data/mayaDictionary'
import { useTextbookStore } from '~/composables/useTextbookStore'
import { useAccessibility } from '~/composables/useAccessibility'
import ScaffoldingHints from '~/components/textbook/ScaffoldingHints.vue'

const props = defineProps({ phase: { type: String, default: 'learn' } })
const emit = defineEmits(['complete', 'next-phase'])
const store = useTextbookStore()
const acc = useAccessibility()

// ============================================
// DATA
// ============================================
const blockData = [
  {
    reading: "K'AL-wi-TUUN",
    meaning: 'él levanta la piedra',
    main: { syllable: "k'al", image: '/escritura_maya/escritura%20maya%20mejorada/K%27AL.svg' },
    left: { syllable: 'wi', image: '/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg' },
    right: null,
    above: null,
    below: { syllable: 'tuun', image: '/escritura_maya/escritura%20maya%20mejorada/TUUN.svg' },
  },
  {
    reading: 'BA-LA-MA',
    meaning: 'jaguar',
    main: { syllable: 'ba', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg' },
    left: { syllable: 'la', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg' },
    right: null,
    above: null,
    below: { syllable: 'ma', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg' },
  },
  {
    reading: "CH'O-KO",
    meaning: 'joven',
    main: { syllable: "ch'o", image: '/escritura_maya/escritura%20maya%20mejorada/CH%27%20VOCALES/93bh.svg' },
    left: null,
    right: { syllable: 'ko', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/738bh.svg' },
    above: null,
    below: null,
  },
]

// ============================================
// LEARN PHASE
// ============================================
const learnStep = ref('intro')
const learnPositionIndex = ref(0)

const learnPositions = [
  {
    name: 'Glifo Principal',
    description: 'El glifo principal es el más grande y está en el centro del bloque. Representa la parte más importante de la palabra.',
    example: "En K'AL-wi-TUUN, el principal es K'AL (levantar)",
    highlightClass: 'border-purple-500',
    block: blockData[0],
  },
  {
    name: 'Afijo Izquierdo',
    description: 'El afijo izquierdo se coloca a la izquierda del principal. Es más pequeño y sirve como complemento.',
    example: "En K'AL-wi-TUUN, el izquierdo es WI (complemento fonético)",
    highlightClass: 'border-purple-300',
    block: blockData[0],
  },
  {
    name: 'Afijo Derecho',
    description: 'El afijo derecho se coloca a la derecha del principal. No todos los bloques tienen afijo derecho.',
    example: "En CH'O-KO, el derecho es KO",
    highlightClass: 'border-purple-300',
    block: blockData[2],
  },
  {
    name: 'Afijo Inferior',
    description: 'El afijo inferior se coloca debajo del principal. Es muy común en los bloques mayas.',
    example: "En K'AL-wi-TUUN, el inferior es TUUN (piedra)",
    highlightClass: 'border-purple-300',
    block: blockData[0],
  },
]

// ============================================
// PRACTICE PHASE
// ============================================
const practiceStep = ref(0)
const practiceStepComplete = ref(false)
const feedback = ref(null)

// --- Practice 1: Observe ---
const observeIndex = ref(0)
const observeBlock = computed(() => blockData[observeIndex.value % blockData.length])

function nextObserve() {
  observeIndex.value++
  if (observeIndex.value >= blockData.length) {
    practiceStepComplete.value = true
  }
}

// --- Practice 2: Build ---
const buildTarget = computed(() => blockData[0])
const selectedBuildSlot = ref(null)
const selectedBuildChoice = ref(null)
const buildSlots = ref([])

function initBuild() {
  const target = buildTarget.value
  const slots = []
  if (target.left) slots.push({ position: 'left', positionLabel: 'IZQ', filled: false, glyph: null, expected: target.left })
  slots.push({ position: 'main', positionLabel: 'PRIN', filled: false, glyph: null, expected: target.main })
  if (target.right) slots.push({ position: 'right', positionLabel: 'DER', filled: false, glyph: null, expected: target.right })
  if (target.above) slots.push({ position: 'above', positionLabel: 'ARR', filled: false, glyph: null, expected: target.above })
  if (target.below) slots.push({ position: 'below', positionLabel: 'ABA', filled: false, glyph: null, expected: target.below })
  buildSlots.value = slots
  selectedBuildSlot.value = null
  selectedBuildChoice.value = null
}

const buildChoices = computed(() => {
  const all = buildSlots.value.map(s => s.expected)
  const extras = shuffleArray([...syllables]).slice(0, 2)
  return shuffleArray([...all, ...extras]).map(s => ({ ...s, image: s.image || s.variants?.[0]?.image, used: false }))
})

function getSlotPosition(position) {
  const positions = {
    main: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '5rem', height: '5rem' },
    left: { left: '0', top: '50%', transform: 'translateY(-50%)', width: '3rem', height: '3rem' },
    right: { right: '0', top: '50%', transform: 'translateY(-50%)', width: '3rem', height: '3rem' },
    above: { left: '50%', top: '0', transform: 'translateX(-50%)', width: '3rem', height: '3rem' },
    below: { left: '50%', bottom: '0', transform: 'translateX(-50%)', width: '3rem', height: '3rem' },
  }
  return positions[position] || {}
}

function getBuildSlotClass(idx, slot) {
  if (slot.filled) return 'border-green-400 bg-green-50'
  if (selectedBuildSlot.value === idx) return 'border-purple-500 bg-purple-100'
  return 'border-dashed border-purple-300 bg-purple-50 cursor-pointer'
}

function selectBuildSlot(idx) {
  if (buildSlots.value[idx].filled) return
  selectedBuildSlot.value = idx
  if (selectedBuildChoice.value) placeBuildChoice()
}

function selectBuildChoice(syl) {
  if (syl.used) return
  selectedBuildChoice.value = syl
  if (selectedBuildSlot.value !== null) placeBuildChoice()
}

function placeBuildChoice() {
  const slot = buildSlots.value[selectedBuildSlot.value]
  const choice = selectedBuildChoice.value
  if (slot.expected.syllable === choice.syllable) {
    slot.filled = true
    slot.glyph = choice
    choice.used = true
    selectedBuildSlot.value = null
    selectedBuildChoice.value = null
    if (buildSlots.value.every(s => s.filled)) practiceStepComplete.value = true
  } else {
    feedback.value = { correct: false, message: '¡Posición incorrecta!' }
    setTimeout(() => { feedback.value = null; selectedBuildSlot.value = null; selectedBuildChoice.value = null }, 600)
  }
}

// --- Practice 3: Puzzle ---
const puzzlePieces = ref([])
const shuffledPuzzlePieces = ref([])

function initPuzzle() {
  const block = blockData[0]
  const pieces = []
  if (block.main) pieces.push({ ...block.main, position: 'main', placed: false })
  if (block.left) pieces.push({ ...block.left, position: 'left', placed: false })
  if (block.right) pieces.push({ ...block.right, position: 'right', placed: false })
  if (block.above) pieces.push({ ...block.above, position: 'above', placed: false })
  if (block.below) pieces.push({ ...block.below, position: 'below', placed: false })
  puzzlePieces.value = pieces
  shuffledPuzzlePieces.value = shuffleArray([...pieces])
}

function getPiecePosition(position) {
  const positions = {
    main: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
    left: { left: '0', top: '50%', transform: 'translateY(-50%)' },
    right: { right: '0', top: '50%', transform: 'translateY(-50%)' },
    above: { left: '50%', top: '0', transform: 'translateX(-50%)' },
    below: { left: '50%', bottom: '0', transform: 'translateX(-50%)' },
  }
  return positions[position] || {}
}

function placePuzzlePiece(piece) {
  piece.placed = true
  if (puzzlePieces.value.every(p => p.placed)) practiceStepComplete.value = true
}

function initPracticeStep() {
  feedback.value = null
  if (practiceStep.value === 0) { observeIndex.value = 0; practiceStepComplete.value = false }
  if (practiceStep.value === 1) { initBuild(); practiceStepComplete.value = false }
  if (practiceStep.value === 2) { initPuzzle(); practiceStepComplete.value = false }
}

// ============================================
// TEST PHASE
// ============================================
const testStarted = ref(false)
const testIndex = ref(0)
const testScore = ref(0)
const testComplete = ref(false)
const testAttempted = ref(new Set())

const testQuestions = [
  {
    block: { main: { syllable: "k'al", image: '/escritura_maya/escritura%20maya%20mejorada/K%27AL.svg' }, left: { syllable: 'wi', image: '/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg' }, below: { syllable: 'tuun', image: '/escritura_maya/escritura%20maya%20mejorada/TUUN.svg' } },
    choices: [
      { id: 'kal-tuun', label: "K'AL-wi-TUUN" },
      { id: 'balam', label: 'BA-LA-MA' },
      { id: 'chok', label: "CH'O-KO" },
    ],
    correct: 'kal-tuun',
  },
  {
    block: { main: { syllable: 'ba', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg' }, left: { syllable: 'la', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg' }, below: { syllable: 'ma', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg' } },
    choices: [
      { id: 'kal-tuun', label: "K'AL-wi-TUUN" },
      { id: 'balam', label: 'BA-LA-MA' },
      { id: 'chok', label: "CH'O-KO" },
    ],
    correct: 'balam',
  },
  {
    block: { main: { syllable: "ch'o", image: '/escritura_maya/escritura%20maya%20mejorada/CH%27%20VOCALES/93bh.svg' }, right: { syllable: 'ko', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/738bh.svg' } },
    choices: [
      { id: 'kal-tuun', label: "K'AL-wi-TUUN" },
      { id: 'balam', label: 'BA-LA-MA' },
      { id: 'chok', label: "CH'O-KO" },
    ],
    correct: 'chok',
  },
]

const currentTestQuestion = computed(() => testQuestions[testIndex.value] || testQuestions[0])

const testHints = computed(() => {
  const q = currentTestQuestion.value
  if (!q || !q.correct) return []
  return [
    'Los bloques se leen de arriba hacia abajo y de izquierda a derecha.',
    'Identifica el glifo principal y los complementos fonéticos.',
    `La lectura correcta es ${q.choices.find(c => c.id === q.correct)?.label || ''}.`,
  ]
})

function startTest() {
  testStarted.value = true; testIndex.value = 0; testScore.value = 0; testComplete.value = false; testAttempted.value = new Set()
}

function getTestClass(id) {
  if (!testAttempted.value.has(testIndex.value)) return 'bg-white border-gray-300 hover:border-purple-400'
  if (id === currentTestQuestion.value.correct) return 'bg-green-100 border-green-500 text-green-700'
  return 'bg-red-100 border-red-400 text-red-600'
}

function answerTest(id) {
  if (testAttempted.value.has(testIndex.value)) return
  testAttempted.value.add(testIndex.value)
  const correct = id === currentTestQuestion.value.correct
  store.recordAttempt('bloques', currentTestQuestion.value.correct, correct)
  if (correct) { testScore.value++; acc.speak('¡Correcto!') }
  setTimeout(() => {
    if (testIndex.value >= testQuestions.length - 1) { testComplete.value = true }
    else { testIndex.value++ }
  }, 1200)
}

function resetTest() {
  testStarted.value = false; testIndex.value = 0; testScore.value = 0; testComplete.value = false; testAttempted.value = new Set()
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
  if (props.phase === 'learn') { learnStep.value = 'intro'; learnPositionIndex.value = 0 }
  if (props.phase === 'practice') { practiceStep.value = 0; practiceStepComplete.value = false; feedback.value = null; observeIndex.value = 0 }
  if (props.phase === 'test') { testStarted.value = false; testIndex.value = 0; testScore.value = 0; testComplete.value = false }
})
</script>
