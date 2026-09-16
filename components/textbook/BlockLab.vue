<template>
  <div class="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
    <h3 class="text-lg font-bold text-amber-900 mb-1 flex items-center gap-2">
      <span>🧪</span> Laboratorio de Bloques
    </h3>
    <p class="text-sm text-gray-500 mb-4">
      Arma un bloque maya eligiendo sílabas y observa cómo se forma la palabra.
    </p>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Controls -->
      <div>
        <div class="mb-3">
          <label class="text-sm font-semibold text-gray-700">Sílaba principal:</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <button v-for="s in availableSyllables" :key="s.id" @click="main = s"
              class="px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border-2"
              :class="main && main.id === s.id ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-gray-200 hover:border-amber-400'">
              {{ s.syllable.toUpperCase() }}
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label class="text-sm font-semibold text-gray-700">Complemento (opcional):</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <button v-for="s in availableSyllables" :key="s.id" @click="toggleComplement(s)"
              class="px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border-2"
              :class="complement && complement.id === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 hover:border-blue-400'">
              {{ s.syllable.toUpperCase() }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700">Posición del complemento:</label>
          <div class="flex gap-2 mt-1">
            <button v-for="pos in ['left', 'right', 'below']" :key="pos" @click="position = pos"
              class="px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
              :class="position === pos ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
              {{ pos === 'left' ? 'Izquierda' : pos === 'right' ? 'Derecha' : 'Abajo' }}
            </button>
          </div>
        </div>

        <div class="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
          <span class="font-bold">Lectura:</span>
          <span class="font-mono">{{ reading }}</span>
        </div>
      </div>

      <!-- Block preview -->
      <div class="flex items-center justify-center">
        <div class="relative w-48 h-48 bg-amber-50 rounded-2xl border-2 border-amber-200">
          <div class="absolute inset-0 flex items-center justify-center">
            <img v-if="main" :src="main.image" class="w-28 h-28 object-contain" />
            <span v-else class="text-gray-300 text-4xl">?</span>
          </div>
          <div v-if="complement && position === 'left'" class="absolute left-1 top-1/2 -translate-y-1/2">
            <img :src="complement.image" class="w-12 h-12 object-contain" />
          </div>
          <div v-if="complement && position === 'right'" class="absolute right-1 top-1/2 -translate-y-1/2">
            <img :src="complement.image" class="w-12 h-12 object-contain" />
          </div>
          <div v-if="complement && position === 'below'" class="absolute bottom-1 left-1/2 -translate-x-1/2">
            <img :src="complement.image" class="w-12 h-12 object-contain" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { syllables, vowels } from '~/data/mayaDictionary'

const availableSyllables = computed(() => [...vowels, ...syllables])
const main = ref(null)
const complement = ref(null)
const position = ref('left')

function toggleComplement(s) {
  if (complement.value && complement.value.id === s.id) {
    complement.value = null
  } else {
    complement.value = s
  }
}

const reading = computed(() => {
  const parts = []
  if (main.value) parts.push(main.value.syllable.toUpperCase())
  if (complement.value) parts.push(complement.value.syllable.toUpperCase())
  return parts.length > 0 ? parts.join('-') : '—'
})
</script>
