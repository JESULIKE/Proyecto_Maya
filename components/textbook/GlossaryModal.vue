<template>
  <transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="acc.settings.glossaryOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="acc.closeGlossary()">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold text-amber-900">📖 Glosario</h3>
          <button @click="acc.closeGlossary()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div v-if="acc.settings.glossaryTerm" class="mb-4">
          <div class="text-xl font-bold text-amber-800 mb-1">{{ acc.settings.glossaryTerm }}</div>
          <p class="text-gray-600">{{ definition }}</p>
        </div>
        <div class="border-t border-gray-100 pt-3">
          <div class="text-sm font-semibold text-gray-700 mb-2">Otros términos:</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="g in acc.glossary" :key="g.term" @click="acc.openGlossary(g.term)"
              class="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full text-sm transition-colors">
              {{ g.term }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAccessibility } from '~/composables/useAccessibility'

const acc = useAccessibility()
const definition = computed(() => acc.getGlossaryDefinition(acc.settings.glossaryTerm) || '')
</script>
