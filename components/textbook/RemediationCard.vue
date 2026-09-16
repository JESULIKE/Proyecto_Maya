<template>
  <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-4">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-2xl">🔄</span>
      <h4 class="font-bold text-blue-900">Repasemos este concepto</h4>
    </div>
    <p class="text-sm text-blue-800 mb-3">{{ explanation }}</p>
    <div v-if="example" class="bg-white rounded-lg border border-blue-200 p-3 text-sm text-blue-900 mb-3">
      <span class="font-bold">Ejemplo:</span> {{ example }}
    </div>
    <div class="flex gap-2">
      <button @click="$emit('retry')"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
        ✅ Entendido, intentar de nuevo
      </button>
      <button @click="$emit('skip')"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-bold transition-colors">
        Saltar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  explanation: { type: String, default: '' },
  example: { type: String, default: '' },
})
defineEmits(['retry', 'skip'])
</script>
