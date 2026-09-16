<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    :class="acc.bodyClasses.join(' ')"
    :style="acc.fontSizeStyle">
    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-white py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-6xl mb-4">📚</div>
        <h1 class="text-4xl md:text-5xl font-bold mb-3">Intelligent Textbook</h1>
        <p class="text-amber-200 text-lg md:text-xl">Aprende a leer y escribir en maya</p>
        <div class="flex items-center justify-center gap-2 mt-4 text-amber-300">
          <span class="text-sm">Progreso:</span>
          <div class="w-48 h-3 bg-amber-900 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                 :style="{ width: overallProgress + '%' }"></div>
          </div>
          <span class="text-sm font-bold">{{ overallProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Module Selector -->
    <div class="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
      <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          v-for="mod in modules"
          :key="mod.id"
          @click="selectModule(mod.id)"
          class="flex-shrink-0 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-2"
          :class="activeModule === mod.id
            ? `${mod.color} text-white shadow-lg scale-105`
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:shadow'"
        >
          <span class="mr-2">{{ mod.icon }}</span>
          {{ mod.title }}
          <span v-if="store.getModuleMastery(mod.id) >= 80" class="ml-1">✅</span>
        </button>
      </div>
    </div>

    <!-- Phase Tabs: Aprender / Practicar / Evaluar -->
    <div class="max-w-4xl mx-auto px-4 mt-4">
      <div class="flex gap-1 bg-white rounded-xl p-1 shadow-md border border-amber-100">
        <button
          v-for="phase in phases"
          :key="phase.id"
          @click="activePhase = phase.id"
          class="flex-1 py-3 rounded-lg font-bold text-sm transition-all"
          :class="activePhase === phase.id
            ? `${currentModuleData.phaseColors[phase.id]} text-white shadow`
            : 'text-gray-500 hover:bg-gray-50'"
        >
          <span class="mr-1">{{ phase.icon }}</span>
          {{ acc.t(phase.id) }}
        </button>
      </div>
    </div>

    <!-- Module Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Module Description -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-amber-100">
        <h2 class="text-2xl font-bold text-amber-900 mb-2">
          {{ currentModuleData.icon }} {{ currentModuleData.title }}
        </h2>
        <p class="text-gray-600">{{ currentModuleData.description }}</p>

        <!-- Phase-specific subtitle -->
        <div class="mt-3 text-sm font-medium" :class="phaseSubtitleColor">
          {{ phaseSubtitle }}
        </div>

        <!-- Adaptive remediation notice -->
        <div v-if="remediationActive" class="mt-3">
          <RemediationCard
            :explanation="remediationExplanation"
            :example="remediationExample"
            @retry="clearRemediation"
            @skip="clearRemediation"
          />
        </div>
      </div>

      <!-- Phase Content -->
      <component
        :is="currentModuleComponent"
        :phase="activePhase"
        :key="activeModule + '-' + activePhase"
        @complete="onPhaseComplete"
        @next-phase="nextPhase"
      />

      <!-- Deep Interactivity: Block Lab (shown in learn phase) -->
      <div v-if="activePhase === 'learn'" class="mt-8">
        <BlockLab />
      </div>
    </div>

    <!-- Writing Rules Reference (collapsible) -->
    <div class="max-w-4xl mx-auto px-4 pb-12">
      <div class="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        <button
          @click="showRules = !showRules"
          class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-amber-50 transition-colors"
        >
          <span class="font-bold text-amber-900">📜 Reglas de Escritura Maya</span>
          <svg class="w-5 h-5 text-amber-600 transition-transform" :class="{ 'rotate-180': showRules }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <transition
          enter-active-class="transition-all duration-300"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[1000px] opacity-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="max-h-[1000px] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="showRules" class="px-6 pb-6 overflow-hidden">
            <div class="grid gap-4 md:grid-cols-2">
              <div
                v-for="rule in writingRules"
                :key="rule.id"
                class="p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <h4 class="font-bold text-amber-800 mb-1">{{ rule.rule }}</h4>
                <p class="text-sm text-gray-600 mb-2">{{ rule.description }}</p>
                <p class="text-xs text-amber-700 font-mono bg-amber-100 px-2 py-1 rounded">{{ rule.example }}</p>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-4">Fuente: GlifosMayasLibro1.pdf — Mark Pitts</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- Dashboard & Study Tools Toggle -->
    <div class="max-w-4xl mx-auto px-4 pb-12">
      <div class="flex gap-2 mb-4">
        <button @click="showDashboard = !showDashboard"
          class="flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2"
          :class="showDashboard ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'">
          📊 {{ acc.t('dashboard') }}
        </button>
        <button @click="showStudyTools = !showStudyTools"
          class="flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2"
          :class="showStudyTools ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'">
          🧠 {{ acc.t('studyTools') }}
        </button>
      </div>

      <transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showDashboard" class="mb-4">
          <DashboardPanel />
        </div>
      </transition>

      <transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showStudyTools">
          <StudyToolsPanel />
        </div>
      </transition>
    </div>

    <!-- Accessibility toolbar -->
    <AccessibilityToolbar />

    <!-- Glossary modal -->
    <GlossaryModal />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { getWritingRules } from '~/data/mayaDictionary'
import { useTextbookStore } from '~/composables/useTextbookStore'
import { useAccessibility } from '~/composables/useAccessibility'
import Module1Vocales from '~/components/textbook/Module1Vocales.vue'
import Module2Silabas from '~/components/textbook/Module2Silabas.vue'
import Module3Bloques from '~/components/textbook/Module3Bloques.vue'
import Module4Lectura from '~/components/textbook/Module4Lectura.vue'
import Module5Escritura from '~/components/textbook/Module5Escritura.vue'
import AccessibilityToolbar from '~/components/textbook/AccessibilityToolbar.vue'
import DashboardPanel from '~/components/textbook/DashboardPanel.vue'
import StudyToolsPanel from '~/components/textbook/StudyToolsPanel.vue'
import GlossaryModal from '~/components/textbook/GlossaryModal.vue'
import RemediationCard from '~/components/textbook/RemediationCard.vue'
import BlockLab from '~/components/textbook/BlockLab.vue'

useHead({ title: 'Intelligent Textbook — Escritura Maya' })

const store = useTextbookStore()
const acc = useAccessibility()

const phases = [
  { id: 'learn', title: 'Aprender', icon: '📖' },
  { id: 'practice', title: 'Practicar', icon: '🎯' },
  { id: 'test', title: 'Evaluar', icon: '🏆' },
]

const modules = [
  {
    id: 'vocales',
    title: 'Vocales',
    icon: '🟢',
    color: 'bg-green-600',
    component: Module1Vocales,
    phaseColors: { learn: 'bg-green-600', practice: 'bg-green-500', test: 'bg-green-700' },
    description: 'Las cinco vocales del maya: A, E, I, O, U. Son la base de todas las sílabas.',
    phaseSubtitles: {
      learn: '📖 Conoce cada vocal maya y su glifo',
      practice: '🎯 Practica identificando y emparejando vocales',
      test: '🏆 Demuestra lo que aprendiste',
    },
  },
  {
    id: 'silabas',
    title: 'Sílabas',
    icon: '🔵',
    color: 'bg-blue-600',
    component: Module2Silabas,
    phaseColors: { learn: 'bg-blue-600', practice: 'bg-blue-500', test: 'bg-blue-700' },
    description: 'Consonante + Vocal = Sílaba. Aprende las combinaciones del sistema de escritura maya.',
    phaseSubtitles: {
      learn: '📖 Conoce las sílabas mayas y sus familias',
      practice: '🎯 Practica con emparejamiento y memoria',
      test: '🏆 Demuestra lo que aprendiste',
    },
  },
  {
    id: 'bloques',
    title: 'Bloques',
    icon: '🟣',
    color: 'bg-purple-600',
    component: Module3Bloques,
    phaseColors: { learn: 'bg-purple-600', practice: 'bg-purple-500', test: 'bg-purple-700' },
    description: 'Las sílabas se combinan en bloques de glifos. Aprende las posiciones y el orden.',
    phaseSubtitles: {
      learn: '📖 Cómo se organizan los glifos en bloques',
      practice: '🎯 Construye y arma bloques',
      test: '🏆 Demuestra lo que aprendiste',
    },
  },
  {
    id: 'lectura',
    title: 'Lectura',
    icon: '🟠',
    color: 'bg-orange-600',
    component: Module4Lectura,
    phaseColors: { learn: 'bg-orange-600', practice: 'bg-orange-500', test: 'bg-orange-700' },
    description: 'Lee inscripciones mayas completas. Orden de lectura, logogramas y significados.',
    phaseSubtitles: {
      learn: '📖 Aprende a leer bloques mayas',
      practice: '🎯 Practica traducir y completar',
      test: '🏆 Examen de lectura',
    },
  },
  {
    id: 'escritura',
    title: 'Escritura',
    icon: '🔴',
    color: 'bg-red-600',
    component: Module5Escritura,
    phaseColors: { learn: 'bg-red-600', practice: 'bg-red-500', test: 'bg-red-700' },
    description: 'Escribe tu nombre y palabras en maya. Usa todo lo que has aprendido.',
    phaseSubtitles: {
      learn: '📖 Guía para escribir en maya',
      practice: '🎯 Escribe tu nombre y palabras',
      test: '🏆 Crea tu inscripción',
    },
  },
]

const activeModule = ref('vocales')
const activePhase = ref('learn')
const showRules = ref(false)
const showDashboard = ref(false)
const showStudyTools = ref(false)

const writingRules = getWritingRules()

const currentModuleData = computed(() => {
  return modules.find(m => m.id === activeModule.value)
})

const currentModuleComponent = computed(() => {
  return currentModuleData.value.component
})

const phaseSubtitle = computed(() => {
  return currentModuleData.value.phaseSubtitles[activePhase.value] || ''
})

const phaseSubtitleColor = computed(() => {
  const colors = {
    learn: 'text-green-600',
    practice: 'text-blue-600',
    test: 'text-orange-600',
  }
  return colors[activePhase.value] || 'text-gray-600'
})

const totalPhases = computed(() => modules.length * 3)

const overallProgress = computed(() => {
  return Math.round((store.completedPhases.size / totalPhases.value) * 100)
})

// Adaptive remediation
const remediationActive = computed(() => {
  const key = `${activeModule.value}:${activePhase.value}`
  return store.adaptiveRemediation[key] && store.adaptiveRemediation[key].active
})

const remediationExplanation = computed(() => {
  const map = {
    'vocales:test': 'Parece que las vocales te están costando un poco. Repasemos: cada vocal tiene su propio glifo y sonido.',
    'silabas:test': 'Las sílabas se forman con consonante + vocal. Vamos a repasar las familias.',
    'bloques:test': 'Los bloques se leen de arriba hacia abajo y de izquierda a derecha. Repasemos las posiciones.',
    'lectura:test': 'Los logogramas representan palabras completas. Repasemos cómo leerlos.',
    'escritura:test': 'Para escribir en maya se combinan logogramas y sílabas. Repasemos las reglas.',
  }
  return map[`${activeModule.value}:${activePhase.value}`] || 'Repasemos este concepto para asegurar que lo dominas.'
})

const remediationExample = computed(() => {
  const map = {
    'vocales:test': 'A = glifo de la vocal A. Cada vocal tiene un sonido distinto.',
    'silabas:test': 'BA = B + A. La sílaba siempre termina en vocal.',
    'bloques:test': 'Un bloque con BA arriba y LA abajo se lee BA-LA.',
    'lectura:test': 'TUUN = piedra. Un solo glifo representa toda la palabra.',
    'escritura:test': "CH'OK se escribe ch'o-ko (armonía vocálica).",
  }
  return map[`${activeModule.value}:${activePhase.value}`] || ''
})

function clearRemediation() {
  const key = `${activeModule.value}:${activePhase.value}`
  store.clearRemediation(activeModule.value, activePhase.value)
}

function selectModule(id) {
  activeModule.value = id
  activePhase.value = 'learn'
}

function onPhaseComplete({ module, phase, stars }) {
  store.markPhaseComplete(module, phase, stars)
  // Adaptive: if test score is low, trigger remediation
  if (phase === 'test' && stars < 2) {
    store.setRemediation(module, phase, 'low-score')
  }
}

function nextPhase() {
  const phaseOrder = ['learn', 'practice', 'test']
  const idx = phaseOrder.indexOf(activePhase.value)
  if (idx < phaseOrder.length - 1) {
    activePhase.value = phaseOrder[idx + 1]
  }
}

watch(activeModule, () => {
  activePhase.value = 'learn'
})

// Sync store active module/phase
watch([activeModule, activePhase], ([m, p]) => {
  store.activeModule = m
  store.activePhase = p
})

// Reading time tracking
let phaseStartTime = Date.now()
watch([activeModule, activePhase], ([m, p]) => {
  const elapsed = Date.now() - phaseStartTime
  store.recordReadingTime(activeModule.value, activePhase.value, elapsed)
  phaseStartTime = Date.now()
})

onBeforeUnmount(() => {
  const elapsed = Date.now() - phaseStartTime
  store.recordReadingTime(activeModule.value, activePhase.value, elapsed)
})
</script>

<style>
/* Dyslexia-friendly mode */
.dyslexia-mode {
  letter-spacing: 0.05em;
  word-spacing: 0.15em;
  line-height: 1.8;
}
.dyslexia-mode p,
.dyslexia-mode div,
.dyslexia-mode span {
  line-height: 1.8;
}

/* High contrast mode */
.high-contrast {
  filter: contrast(1.15) saturate(1.1);
}
.high-contrast .bg-white {
  background-color: #fff;
}
</style>
