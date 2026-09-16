<template>
  <div class="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
    <h3 class="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
      <span>🧠</span> Herramientas de Estudio
    </h3>

    <!-- Tabs -->
    <div class="flex gap-2 mb-4">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="flex-1 py-2 rounded-lg text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
        {{ tab.label }}
      </button>
    </div>

    <!-- ============ FLASHCARDS ============ -->
    <div v-if="activeTab === 'flashcards'">
      <div v-if="study.flashcards.length === 0" class="text-center py-6">
        <p class="text-gray-500 mb-3">Genera tarjetas didácticas basadas en tus áreas más débiles.</p>
        <button @click="study.generateFlashcards(10)"
          class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors">
          🎴 Generar tarjetas
        </button>
      </div>

      <div v-else>
        <!-- Card -->
        <div class="mb-4">
          <div class="text-center text-sm text-gray-500 mb-2">
            Tarjeta {{ study.currentCardIndex + 1 }}/{{ study.flashcards.length }}
          </div>
          <div @click="study.flipCard()"
            class="cursor-pointer min-h-40 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 flex flex-col items-center justify-center text-center transition-all hover:shadow-md"
            :class="{ 'rotate-1': study.cardFlipped }">
            <img v-if="card.image && !study.cardFlipped" :src="card.image" class="w-20 h-20 object-contain mb-3" />
            <div class="text-lg font-bold text-amber-900">{{ study.cardFlipped ? card.back : card.front }}</div>
            <div class="text-xs text-amber-500 mt-2">Haz clic para voltear</div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-3">
          <button @click="study.markCard(false)"
            class="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold transition-colors">
            ❌ No sabía
          </button>
          <button @click="study.markCard(true)"
            class="px-5 py-2.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-bold transition-colors">
            ✅ Lo sabía
          </button>
        </div>

        <div class="text-center text-xs text-gray-400 mt-3">
          Conocidas: {{ study.knownCards.size }} | Por repasar: {{ study.unknownCards.size }}
        </div>
      </div>
    </div>

    <!-- ============ SUMMARY ============ -->
    <div v-if="activeTab === 'summary'">
      <div class="mb-3">
        <label class="text-sm font-semibold text-gray-700">Elige un módulo:</label>
        <select v-model="summaryModule" class="mt-1 w-full p-2 border border-gray-300 rounded-lg text-sm">
          <option v-for="mod in store.MODULES" :key="mod.id" :value="mod.id">{{ mod.icon }} {{ mod.title }}</option>
        </select>
      </div>
      <div class="bg-amber-50 rounded-xl border border-amber-200 p-4">
        <h4 class="font-bold text-amber-900 mb-2">{{ summary.title }}</h4>
        <ul class="space-y-2">
          <li v-for="(point, i) in summary.points" :key="i" class="flex gap-2 text-sm text-gray-700">
            <span class="text-amber-600 font-bold">{{ i + 1 }}.</span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- ============ MOCK EXAM ============ -->
    <div v-if="activeTab === 'mockexam'">
      <div v-if="study.mockExam.length === 0" class="text-center py-6">
        <p class="text-gray-500 mb-3">Simulacro de examen personalizado enfocado en tus áreas débiles.</p>
        <button @click="study.generateMockExam(5)"
          class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors">
          📝 Generar simulacro
        </button>
      </div>

      <div v-else-if="!study.mockExamComplete">
        <div class="text-center text-sm text-gray-500 mb-2">
          Pregunta {{ study.mockExamIndex + 1 }}/{{ study.mockExam.length }}
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-3 text-center">
          <img v-if="question.image" :src="question.image" class="w-16 h-16 object-contain mx-auto mb-2" />
          <div class="font-bold text-amber-900">{{ question.front }}</div>
        </div>
        <div class="space-y-2">
          <button v-for="(opt, i) in question.options" :key="i" @click="study.answerMockExam(opt)"
            class="w-full text-left p-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors">
            {{ opt }}
          </button>
        </div>
      </div>

      <div v-else class="text-center py-6">
        <div class="text-5xl mb-3">{{ study.mockExamScore >= 4 ? '🏆' : study.mockExamScore >= 3 ? '🎉' : '💪' }}</div>
        <div class="text-3xl font-bold text-amber-900 mb-2">{{ study.mockExamScore }}/{{ study.mockExam.length }}</div>
        <p class="text-gray-600 mb-4">Resultado del simulacro</p>
        <button @click="study.generateMockExam(5)"
          class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors">
          🔄 Intentar de nuevo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudyTools } from '~/composables/useStudyTools'
import { useTextbookStore } from '~/composables/useTextbookStore'

const study = useStudyTools()
const store = useTextbookStore()

const tabs = [
  { id: 'flashcards', label: '🎴 Tarjetas' },
  { id: 'summary', label: '📄 Resumen' },
  { id: 'mockexam', label: '📝 Simulacro' },
]
const activeTab = ref('flashcards')
const summaryModule = ref('vocales')

const card = computed(() => study.getCurrentCard())
const question = computed(() => study.getCurrentMockQuestion())
const summary = computed(() => study.generateSummary(summaryModule.value))
</script>
