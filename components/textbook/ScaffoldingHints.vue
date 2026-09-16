<template>
  <div class="mt-3">
    <!-- Hint button -->
    <button
      v-if="hintLevel < hints.length"
      @click="hintLevel++"
      class="text-sm text-amber-600 hover:text-amber-800 font-semibold underline decoration-dotted transition-colors"
    >
      💡 ¿Necesitas una pista? ({{ hintLevel + 1 }}/{{ hints.length }})
    </button>

    <!-- Progressive hints -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="hintLevel > 0" class="mt-2 space-y-2">
        <div v-for="(hint, i) in hints.slice(0, hintLevel)" :key="i"
          class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <span class="font-bold">Pista {{ i + 1 }}:</span> {{ hint }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  hints: { type: Array, default: () => [] },
  resetKey: { type: [String, Number], default: '' },
})

const hintLevel = ref(0)

// Reset hints when the question changes
watch(() => props.resetKey, () => {
  hintLevel.value = 0
})
</script>
