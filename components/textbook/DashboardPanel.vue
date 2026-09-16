<template>
  <div class="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
    <h3 class="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
      <span>📊</span> Panel de Progreso
    </h3>

    <!-- Overall mastery -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-semibold text-gray-700">Dominio general</span>
        <span class="text-sm font-bold text-amber-700">{{ store.getOverallMastery() }}%</span>
      </div>
      <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
          :style="{ width: store.getOverallMastery() + '%' }"></div>
      </div>
    </div>

    <!-- Per-module mastery -->
    <div class="space-y-3 mb-6">
      <div v-for="mod in store.MODULES" :key="mod.id" class="flex items-center gap-3">
        <span class="w-6 text-center">{{ mod.icon }}</span>
        <div class="flex-1">
          <div class="flex justify-between text-xs mb-0.5">
            <span class="font-semibold text-gray-700">{{ mod.title }}</span>
            <span class="text-gray-500">{{ store.getModuleMastery(mod.id) }}%</span>
          </div>
          <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="masteryBarColor(store.getModuleMastery(mod.id))"
              :style="{ width: store.getModuleMastery(mod.id) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge gaps -->
    <div class="mb-6">
      <h4 class="font-bold text-gray-700 mb-2">🔍 Lagunas de conocimiento</h4>
      <div v-if="gaps.length === 0" class="text-sm text-green-600 bg-green-50 rounded-lg p-3">
        🎉 ¡No hay lagunas! Estás dominando todos los conceptos.
      </div>
      <div v-else class="space-y-2">
        <div v-for="gap in gaps" :key="gap.module + '-' + gap.concept"
          class="flex items-center justify-between bg-red-50 rounded-lg p-2.5 border border-red-100">
          <div>
            <span class="text-sm font-semibold text-red-700">{{ gap.moduleTitle }}:</span>
            <span class="text-sm text-red-600 ml-1">{{ gap.concept }}</span>
          </div>
          <span class="text-xs font-bold text-red-500">{{ gap.mastery }}%</span>
        </div>
      </div>
    </div>

    <!-- Reading time -->
    <div>
      <h4 class="font-bold text-gray-700 mb-2">⏱️ Tiempo de lectura</h4>
      <div class="space-y-1.5">
        <div v-for="mod in store.MODULES" :key="mod.id" class="flex justify-between text-sm">
          <span class="text-gray-600">{{ mod.icon }} {{ mod.title }}</span>
          <span class="text-gray-500 font-mono">{{ formatTime(totalModuleTime(mod.id)) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTextbookStore } from '~/composables/useTextbookStore'

const store = useTextbookStore()

const gaps = computed(() => store.getKnowledgeGaps())

function masteryBarColor(m) {
  if (m >= 80) return 'bg-green-500'
  if (m >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

function totalModuleTime(moduleId) {
  let total = 0
  for (const phase of ['learn', 'practice', 'test']) {
    total += store.getReadingTime(moduleId, phase)
  }
  return total
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs}s`
}
</script>
