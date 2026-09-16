<template>
  <div class="space-y-6">
    <!-- ============================================ -->
    <!-- PHASE: LEARN (Aprender)                      -->
    <!-- ============================================ -->
    <div v-if="phase === 'learn'" class="space-y-6">
      <!-- Step 1: Intro -->
      <div v-if="learnStep === 'intro'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-red-200 text-center">
          <div class="text-5xl mb-4">✍️</div>
          <h3 class="text-2xl font-bold text-red-900 mb-3">Escritura en Maya</h3>
          <p class="text-gray-600 text-lg max-w-lg mx-auto">
            Ahora puedes <strong>escribir tus propios nombres y palabras</strong> en maya.
            El proceso tiene <strong>3 pasos simples</strong>.
          </p>
          <div class="bg-red-50 rounded-xl p-6 mt-6 max-w-md mx-auto">
            <div class="flex items-center justify-center gap-4 text-lg">
              <span class="bg-red-100 px-3 py-1 rounded-lg font-bold text-red-700">1. Español</span>
              <span class="text-gray-400">→</span>
              <span class="bg-red-200 px-3 py-1 rounded-lg font-bold text-red-800">2. Sílabas</span>
              <span class="text-gray-400">→</span>
              <span class="bg-red-300 px-3 py-1 rounded-lg font-bold text-red-900">3. Glifos</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="learnStep = 'process'"
                  class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Aprender el proceso! →
          </button>
        </div>
      </div>

      <!-- Step 2: Process -->
      <div v-if="learnStep === 'process'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
          <h3 class="text-2xl font-bold text-red-900 mb-6 text-center">Los 3 Pasos</h3>

          <div class="space-y-4 max-w-lg mx-auto">
            <div class="bg-red-50 rounded-xl p-4 border border-red-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h4 class="font-bold text-red-800">Escribe en español</h4>
              </div>
              <p class="text-sm text-gray-600 ml-11">Escribe tu nombre o palabra en español normal.</p>
            </div>

            <div class="bg-red-50 rounded-xl p-4 border border-red-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h4 class="font-bold text-red-800">Divide en sílabas</h4>
              </div>
              <p class="text-sm text-gray-600 ml-11">Separa la palabra en sílabas: JUAN → JA-U-AN</p>
            </div>

            <div class="bg-red-50 rounded-xl p-4 border border-red-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <h4 class="font-bold text-red-800">Busca los glifos</h4>
              </div>
              <p class="text-sm text-gray-600 ml-11">Encuentra el glifo maya correspondiente a cada sílaba.</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button @click="learnStep = 'example'"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            Ver ejemplo →
          </button>
        </div>
      </div>

      <!-- Step 3: Example -->
      <div v-if="learnStep === 'example'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
          <h3 class="text-2xl font-bold text-red-900 mb-6 text-center">Ejemplo: "JUAN"</h3>

          <div class="max-w-lg mx-auto space-y-4">
            <div class="flex items-center gap-4 bg-red-50 rounded-xl p-4 border border-red-200">
              <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <div class="text-xs text-gray-500">Nombre en español:</div>
                <div class="text-xl font-bold text-red-800">JUAN</div>
              </div>
            </div>

            <div class="flex justify-center text-gray-400 text-xl">↓</div>

            <div class="flex items-center gap-4 bg-red-50 rounded-xl p-4 border border-red-200">
              <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <div class="text-xs text-gray-500">Dividido en sílabas:</div>
                <div class="flex gap-2">
                  <span class="text-lg font-bold text-red-800 bg-red-100 px-3 py-1 rounded-lg">JA</span>
                  <span class="text-lg font-bold text-red-800 bg-red-100 px-3 py-1 rounded-lg">U</span>
                  <span class="text-lg font-bold text-red-800 bg-red-100 px-3 py-1 rounded-lg">AN</span>
                </div>
              </div>
            </div>

            <div class="flex justify-center text-gray-400 text-xl">↓</div>

            <div class="flex items-center gap-4 bg-red-50 rounded-xl p-4 border border-red-200">
              <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <div class="text-xs text-gray-500">Glifos mayas:</div>
                <div class="flex gap-3 items-center">
                  <div class="text-center">
                    <div class="w-14 h-14 bg-white rounded-lg border border-red-300 flex items-center justify-center">
                      <img :src="'/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg'" class="w-10 h-10 object-contain" />
                    </div>
                    <div class="text-xs text-red-700 font-bold mt-1">JA</div>
                  </div>
                  <div class="text-center">
                    <div class="w-14 h-14 bg-white rounded-lg border border-red-300 flex items-center justify-center">
                      <img :src="'/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1bh.svg'" class="w-10 h-10 object-contain" />
                    </div>
                    <div class="text-xs text-red-700 font-bold mt-1">U</div>
                  </div>
                  <div class="text-center">
                    <div class="w-14 h-14 bg-white rounded-lg border border-red-300 flex items-center justify-center">
                      <img :src="'/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg'" class="w-10 h-10 object-contain" />
                    </div>
                    <div class="text-xs text-red-700 font-bold mt-1">AN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button @click="learnStep = 'summary'"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Ver resumen! →
          </button>
        </div>
      </div>

      <!-- Step 4: Summary -->
      <div v-if="learnStep === 'summary'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-red-200 text-center">
          <div class="text-5xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-red-900 mb-4">¡Ya puedes escribir en maya!</h3>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200 max-w-md mx-auto text-left space-y-2">
            <div class="text-sm text-gray-600"><strong class="text-red-700">1.</strong> Escribe la palabra en español</div>
            <div class="text-sm text-gray-600"><strong class="text-red-700">2.</strong> Divídela en sílabas (CV)</div>
            <div class="text-sm text-gray-600"><strong class="text-red-700">3.</strong> Busca el glifo maya para cada sílaba</div>
            <div class="text-sm text-gray-600"><strong class="text-red-700">4.</strong> Combínalos en un bloque o secuencia</div>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="$emit('complete', { module: 'escritura', phase: 'learn', stars: 3 }); $emit('next-phase')"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Practicar! →
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: PRACTICE (Practicar)                  -->
    <!-- ============================================ -->
    <div v-if="phase === 'practice'" class="space-y-6">
      <!-- Exercise 1: Write your name -->
      <div v-if="practiceStep === 0" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-red-900 mb-2">✏️ Escribe tu Nombre</h3>
          <p class="text-gray-600">Convierte tu nombre en glifos mayas</p>
        </div>

        <!-- Step 1: Enter name -->
        <div v-if="nameStep === 1" class="space-y-4">
          <div class="flex justify-center">
            <input
              v-model="userName"
              @keyup.enter="processName"
              type="text"
              placeholder="Escribe tu nombre..."
              class="w-full max-w-md px-6 py-4 text-xl text-center rounded-xl border-2 border-red-300 focus:border-red-500 focus:outline-none"
            />
          </div>
          <div class="flex justify-center">
            <button
              @click="processName"
              :disabled="!userName.trim()"
              class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50"
            >
              ¡Convertir a Maya! →
            </button>
          </div>
        </div>

        <!-- Step 2: Match syllables to glyphs -->
        <div v-if="nameStep === 2" class="space-y-4">
          <div class="text-center text-lg text-gray-700">
            Tu nombre se divide en sílabas mayas:
          </div>

          <div class="flex justify-center gap-4 flex-wrap">
            <div
              v-for="(syl, idx) in nameSyllables"
              :key="idx"
              class="flex flex-col items-center gap-2"
            >
              <div class="text-lg font-bold text-red-800 bg-red-100 px-4 py-2 rounded-xl">
                {{ syl.spanish }}
              </div>
              <div class="text-2xl text-gray-400">↓</div>
              <div
                v-if="syl.matched"
                class="w-20 h-20 bg-white rounded-xl border-2 border-green-400 flex items-center justify-center"
              >
                <img :src="syl.glyph.image" class="w-14 h-14 object-contain" />
              </div>
              <div
                v-else
                @click="selectNameSyllable(idx)"
                class="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all"
                :class="selectedNameSyllable === idx ? 'border-red-500 bg-red-50' : 'border-gray-300'"
              >
                <span class="text-gray-400 text-lg">?</span>
              </div>
              <div class="text-xs text-gray-500">{{ syl.maya }}</div>
            </div>
          </div>

          <div class="flex justify-center gap-3 flex-wrap">
            <button
              v-for="(glyph, idx) in nameGlyphChoices"
              :key="idx"
              @click="assignNameGlyph(glyph)"
              class="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border-2 transition-all hover:scale-105"
              :class="glyph.used ? 'border-gray-200 opacity-30' : (selectedNameGlyph === glyph ? 'border-red-500 bg-red-50' : 'border-red-300')"
              :disabled="glyph.used"
            >
              <img :src="glyph.image" class="w-10 h-10 object-contain" />
              <span class="text-xs font-bold text-red-700">{{ glyph.syllable.toUpperCase() }}</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Show result -->
        <div v-if="nameStep === 3" class="space-y-4">
          <div class="text-center text-lg text-gray-700">¡Tu nombre en maya!</div>

          <div class="flex justify-center">
            <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
              <div class="flex gap-4 items-center">
                <div
                  v-for="(syl, idx) in nameSyllables"
                  :key="idx"
                  class="w-20 h-20 bg-red-50 rounded-xl border-2 border-red-300 flex items-center justify-center"
                >
                  <img :src="syl.glyph.image" class="w-14 h-14 object-contain" />
                </div>
              </div>
              <div class="text-center mt-4">
                <div class="text-xl font-bold text-red-800">{{ nameSyllables.map(s => s.maya).join('-') }}</div>
                <div class="text-sm text-gray-500">= {{ userName }}</div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button @click="nameStep = 1; userName = ''; practiceStepComplete = false" class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
              Escribir otro nombre
            </button>
            <button @click="practiceStepComplete = true" class="ml-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
              ¡Completado! 🎉
            </button>
          </div>
        </div>
      </div>

      <!-- Exercise 2: Build a word from dictionary -->
      <div v-if="practiceStep === 1" class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-red-900 mb-2">📝 Construye una Palabra</h3>
          <p class="text-gray-600">Elige una palabra y constrúyela con glifos</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="word in dictionaryWords"
            :key="word.id"
            @click="selectedBuildWord = word; initWordBuild()"
            class="p-4 bg-white rounded-xl border-2 text-left transition-all hover:shadow-md"
            :class="selectedBuildWord?.id === word.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'"
          >
            <div class="font-bold text-red-800 text-lg">{{ word.reading }}</div>
            <div class="text-sm text-gray-500">{{ word.meaning }}</div>
            <div class="text-xs text-gray-400 mt-1">Componentes: {{ word.components.join(' + ') }}</div>
          </button>
        </div>

        <div v-if="selectedBuildWord" class="space-y-4">
          <div class="text-center text-lg text-gray-700">
            Construye: <span class="font-bold text-red-800">{{ selectedBuildWord.reading }}</span>
          </div>

          <div class="flex justify-center gap-4 flex-wrap">
            <div
              v-for="(comp, idx) in wordSlots"
              :key="idx"
              @click="selectWordSlot(idx)"
              class="w-20 h-20 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all"
              :class="comp.filled ? 'border-green-400 bg-green-50' : (selectedWordSlot === idx ? 'border-red-500 bg-red-50' : 'border-dashed border-gray-300')"
            >
              <img v-if="comp.filled" :src="comp.glyph.image" class="w-14 h-14 object-contain" />
              <span v-else class="text-gray-400 text-lg">{{ idx + 1 }}</span>
            </div>
          </div>

          <div class="flex justify-center gap-3 flex-wrap">
            <button
              v-for="(syl, idx) in wordChoices"
              :key="idx"
              @click="selectWordGlyph(syl)"
              class="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border-2 transition-all"
              :class="syl.used ? 'border-gray-200 opacity-30' : 'border-red-300 hover:border-red-500'"
              :disabled="syl.used"
            >
              <img :src="syl.image" class="w-10 h-10 object-contain" />
              <span class="text-xs font-bold text-red-700">{{ syl.syllable.toUpperCase() }}</span>
            </button>
          </div>
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
          <div v-for="i in 2" :key="i" class="w-3 h-3 rounded-full transition-colors"
               :class="i - 1 === practiceStep ? 'bg-red-600' : (i - 1 < practiceStep ? 'bg-red-400' : 'bg-gray-300')">
          </div>
        </div>

        <button v-if="practiceStep < 1 && practiceStepComplete" @click="practiceStep++; practiceStepComplete = false"
                class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
          Siguiente →
        </button>
        <button v-else-if="practiceStep === 1 && practiceStepComplete"
                @click="$emit('complete', { module: 'escritura', phase: 'practice', stars: 3 }); $emit('next-phase')"
                class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
          ¡Siguiente! →
        </button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHASE: TEST (Evaluar)                        -->
    <!-- ============================================ -->
    <div v-if="phase === 'test'" class="space-y-6">
      <div v-if="!testStarted" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-red-200 text-center">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-2xl font-bold text-red-900 mb-3">Examen de Escritura</h3>
          <p class="text-gray-600 text-lg">Crea una inscripción combinando 2-3 bloques</p>
          <div class="mt-4 text-sm text-gray-500">
            Completa la inscripción correctamente para ganar estrellas
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="startTest" class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Empezar Examen! 🚀
          </button>
        </div>
      </div>

      <div v-if="testStarted && !testComplete" class="space-y-6">
        <div class="text-center">
          <div class="text-lg font-bold text-red-800">Crea la inscripción: "{{ testInscription.prompt }}"</div>
          <div class="text-sm text-gray-500 mt-1">Bloque {{ testBlockIndex + 1 }}/{{ testInscription.blocks.length }}</div>
          <div class="w-full h-2 bg-red-100 rounded-full mt-2 max-w-md mx-auto">
            <div class="h-full bg-red-500 rounded-full transition-all" :style="{ width: (testBlockIndex / testInscription.blocks.length * 100) + '%' }"></div>
          </div>
        </div>

        <div class="flex justify-center gap-4 flex-wrap">
          <div
            v-for="(slot, idx) in testSlots"
            :key="idx"
            class="w-24 h-24 rounded-xl border-2 flex items-center justify-center"
            :class="slot.filled ? 'border-green-400 bg-green-50' : 'border-dashed border-red-300 bg-red-50'"
          >
            <div v-if="slot.filled" class="text-center">
              <img :src="slot.glyph.image" class="w-14 h-14 object-contain" />
              <div class="text-xs text-red-700 font-bold mt-1">{{ slot.label }}</div>
            </div>
            <span v-else class="text-red-300 text-lg">{{ idx + 1 }}</span>
          </div>
        </div>

        <p class="text-center text-sm text-gray-500">
          Necesitas: {{ testInscription.blocks[testBlockIndex].components.join(' + ') }}
        </p>

        <div class="flex justify-center gap-3 flex-wrap">
          <button
            v-for="(syl, idx) in testChoices"
            :key="idx"
            @click="selectTestGlyph(syl)"
            class="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border-2 transition-all"
            :class="syl.used ? 'border-gray-200 opacity-30' : 'border-red-300 hover:border-red-500'"
            :disabled="syl.used"
          >
            <img :src="syl.image" class="w-10 h-10 object-contain" />
            <span class="text-xs font-bold text-red-700">{{ syl.syllable.toUpperCase() }}</span>
          </button>
        </div>
      </div>

      <div v-if="testComplete" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-red-200 text-center">
          <div class="text-5xl mb-4">{{ testScore >= 3 ? '🏆' : testScore >= 2 ? '🎉' : '💪' }}</div>
          <h3 class="text-2xl font-bold text-red-900 mb-3">
            {{ testScore >= 3 ? '¡Inscripción perfecta!' : testScore >= 2 ? '¡Bien hecho!' : '¡Sigue practicando!' }}
          </h3>
          <div class="text-4xl font-bold text-red-700">{{ testScore }}/{{ testInscription.blocks.length }}</div>
          <div class="text-sm text-gray-500 mt-2">bloques completados correctamente</div>
        </div>
        <div class="flex justify-center gap-4">
          <button @click="resetTest" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-700 transition-colors">
            Intentar de Nuevo
          </button>
          <button @click="$emit('complete', { module: 'escritura', phase: 'test', stars: testScore >= 3 ? 3 : testScore >= 2 ? 2 : 1 }); $emit('next-phase')"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            ¡Módulo Completo! →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { syllables, words as dictionaryWords } from '~/data/mayaDictionary'
import { useTextbookStore } from '~/composables/useTextbookStore'
import { useAccessibility } from '~/composables/useAccessibility'

const props = defineProps({ phase: { type: String, default: 'learn' } })
const emit = defineEmits(['complete', 'next-phase'])
const store = useTextbookStore()
const acc = useAccessibility()

// ============================================
// LEARN PHASE
// ============================================
const learnStep = ref('intro')

// ============================================
// PRACTICE PHASE
// ============================================
const practiceStep = ref(0)
const practiceStepComplete = ref(false)
const feedback = ref(null)

// --- Exercise 1: Write your name ---
const nameStep = ref(1)
const userName = ref('')
const nameSyllables = ref([])
const selectedNameSyllable = ref(null)
const selectedNameGlyph = ref(null)
const nameGlyphChoices = ref([])

function decomposeName(name) {
  const n = name.toLowerCase().trim()
  const result = []
  const vowels = 'aeiouáéíóú'
  let i = 0
  while (i < n.length) {
    let syl = ''
    while (i < n.length && !vowels.includes(n[i]) && n[i] !== ' ') {
      syl += n[i]; i++
    }
    while (i < n.length && vowels.includes(n[i])) {
      syl += n[i]; i++
    }
    if (i < n.length && !vowels.includes(n[i]) && n[i] !== ' ') {
      if (i + 1 < n.length && vowels.includes(n[i + 1])) {
      } else {
        syl += n[i]; i++
      }
    }
    if (syl.trim()) result.push(syl.trim())
  }
  return result
}

function mapToMaya(spanishSyl) {
  const mapping = {
    'a': 'a', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u',
    'ba': 'ba', 'be': 'ba', 'bi': 'ba', 'bo': 'ba', 'bu': 'ba',
    'ca': 'ka', 'ce': 'ke', 'ci': 'ki', 'co': 'ko', 'cu': 'ku',
    'cha': 'cha', 'che': 'che', 'chi': 'cha', 'cho': 'cha', 'chu': 'cha',
    'da': 'ta', 'de': 'te', 'di': 'ti', 'do': 'to', 'du': 'tu',
    'fa': 'pa', 'fe': 'pa', 'fi': 'pa', 'fo': 'pa', 'fu': 'pa',
    'ga': 'ka', 'ge': 'ke', 'gi': 'ki', 'go': 'ko', 'gu': 'ku',
    'ja': 'ja', 'je': 'ja', 'ji': 'ja', 'jo': 'ja', 'ju': 'ja',
    'la': 'la', 'le': 'la', 'li': 'la', 'lo': 'la', 'lu': 'la',
    'ma': 'ma', 'me': 'ma', 'mi': 'ma', 'mo': 'ma', 'mu': 'ma',
    'na': 'na', 'ne': 'na', 'ni': 'na', 'no': 'na', 'nu': 'na',
    'pa': 'pa', 'pe': 'pa', 'pi': 'pa', 'po': 'po', 'pu': 'pa',
    'ra': 'la', 're': 'la', 'ri': 'la', 'ro': 'la', 'ru': 'la',
    'sa': 'sa', 'se': 'sa', 'si': 'sa', 'so': 'sa', 'su': 'sa',
    'ta': 'ta', 'te': 'ta', 'ti': 'ta', 'to': 'ta', 'tu': 'ta',
    'va': 'ba', 've': 'ba', 'vi': 'ba', 'vo': 'ba', 'vu': 'ba',
    'ya': 'ya', 'ye': 'ya', 'yi': 'ya', 'yo': 'ya', 'yu': 'ya',
    'za': 'sa', 'ze': 'sa', 'zi': 'sa', 'zo': 'sa', 'zu': 'sa',
  }
  return mapping[spanishSyl.toLowerCase()] || 'a'
}

function processName() {
  if (!userName.value.trim()) return
  const syls = decomposeName(userName.value)
  nameSyllables.value = syls.map(s => ({
    spanish: s,
    maya: mapToMaya(s),
    matched: false,
    glyph: null,
  }))
  nameStep.value = 2

  const mayaSyls = [...new Set(nameSyllables.value.map(s => s.maya))]
  nameGlyphChoices.value = shuffleArray(mayaSyls.map(m => {
    const found = syllables.find(s => s.syllable === m) || syllables.find(s => s.syllable.startsWith(m[0]))
    return found ? { ...found, image: found.variants?.[0]?.image || found.image, used: false } : null
  }).filter(Boolean))
}

function selectNameSyllable(idx) {
  if (nameSyllables.value[idx].matched) return
  selectedNameSyllable.value = idx
  if (selectedNameGlyph.value) assignNameGlyph(selectedNameGlyph.value)
}

function assignNameGlyph(glyph) {
  if (selectedNameSyllable.value === null) {
    selectedNameGlyph.value = glyph
    return
  }
  const syl = nameSyllables.value[selectedNameSyllable.value]
  if (syl.maya === glyph.syllable || glyph.syllable.startsWith(syl.maya[0])) {
    syl.matched = true
    syl.glyph = glyph
    glyph.used = true
    selectedNameSyllable.value = null
    selectedNameGlyph.value = null
    if (nameSyllables.value.every(s => s.matched)) nameStep.value = 3
  }
}

// --- Exercise 2: Build a word ---
const selectedBuildWord = ref(null)
const wordSlots = ref([])
const selectedWordSlot = ref(0)

const wordChoices = computed(() => {
  if (!selectedBuildWord.value) return []
  const components = selectedBuildWord.value.components
  const all = [...syllables]
  const matched = components.map(c => {
    const found = all.find(s => s.syllable === c)
    return found ? { ...found, image: found.variants?.[0]?.image || found.image } : null
  }).filter(Boolean)
  const extras = shuffleArray(all.filter(s => !components.includes(s.syllable))).slice(0, 3)
  return shuffleArray([...matched, ...extras.map(e => ({ ...e, image: e.variants?.[0]?.image || e.image }))])
})

function initWordBuild() {
  if (!selectedBuildWord.value) return
  wordSlots.value = selectedBuildWord.value.components.map(() => ({ filled: false, glyph: null }))
  selectedWordSlot.value = 0
  practiceStepComplete.value = false
}

function selectWordSlot(idx) {
  if (wordSlots.value[idx].filled) return
  selectedWordSlot.value = idx
}

function selectWordGlyph(syl) {
  const slot = wordSlots.value[selectedWordSlot.value]
  if (!slot || slot.filled) return
  if (selectedBuildWord.value.components[selectedWordSlot.value] === syl.syllable) {
    slot.filled = true
    slot.glyph = syl
    selectedWordSlot.value++
    if (wordSlots.value.every(s => s.filled)) practiceStepComplete.value = true
  }
}

// ============================================
// TEST PHASE
// ============================================
const testStarted = ref(false)
const testBlockIndex = ref(0)
const testSlotIndex = ref(0)
const testScore = ref(0)
const testComplete = ref(false)

const testInscription = {
  prompt: 'Él levanta la piedra',
  blocks: [
    { reading: "K'AL-wi-TUUN", components: ["k'al", 'wi', 'tuun'] },
  ],
}

const testSlots = ref([])
const testCurrentSlot = ref(0)

const testChoices = computed(() => {
  const components = testInscription.blocks[testBlockIndex.value]?.components || []
  const all = [...syllables]
  const matched = components.map(c => {
    const found = all.find(s => s.syllable === c)
    return found ? { ...found, image: found.variants?.[0]?.image || found.image } : null
  }).filter(Boolean)
  const extras = shuffleArray(all.filter(s => !components.includes(s.syllable))).slice(0, 3)
  return shuffleArray([...matched, ...extras.map(e => ({ ...e, image: e.variants?.[0]?.image || e.image }))])
})

function startTest() {
  testStarted.value = true
  testBlockIndex.value = 0
  testScore.value = 0
  testComplete.value = false
  testCurrentSlot.value = 0
  const block = testInscription.blocks[0]
  testSlots.value = block.components.map((c, i) => ({
    position: i,
    filled: false,
    glyph: null,
    label: c.toUpperCase(),
    expected: c,
  }))
}

function selectTestGlyph(syl) {
  const slot = testSlots.value[testCurrentSlot.value]
  if (!slot || slot.filled) return
  const block = testInscription.blocks[testBlockIndex.value]
  const correct = block.components[testCurrentSlot.value] === syl.syllable
  store.recordAttempt('escritura', block.components[testCurrentSlot.value], correct)
  if (correct) {
    slot.filled = true
    slot.glyph = syl
    testCurrentSlot.value++
    if (testSlots.value.every(s => s.filled)) {
      testScore.value++
      testComplete.value = true
      acc.speak('¡Inscripción completada!')
    }
  }
}

function resetTest() {
  testStarted.value = false; testBlockIndex.value = 0; testScore.value = 0; testComplete.value = false
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
  if (props.phase === 'learn') { learnStep.value = 'intro' }
  if (props.phase === 'practice') {
    practiceStep.value = 0; practiceStepComplete.value = false; feedback.value = null
    nameStep.value = 1; userName.value = ''; selectedBuildWord.value = null
  }
  if (props.phase === 'test') { testStarted.value = false; testBlockIndex.value = 0; testScore.value = 0; testComplete.value = false }
})
</script>
