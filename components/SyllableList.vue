<template>
  <div class="w-full max-w-7xl mx-auto p-4">
    <!-- Pestañas -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-1 border-b border-amber-300 max-h-32 overflow-y-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-3 py-2 font-medium text-xs rounded-t-lg transition-colors flex-shrink-0',
            activeTab === tab.key
              ? 'bg-amber-200 text-amber-900 border-b-2 border-amber-500'
              : 'text-amber-700 hover:bg-amber-100'
          ]"
        >
          {{ tab.label }}
          <span class="ml-1 text-xs text-amber-600">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Contenido de la pestaña activa -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-amber-50 rounded-lg min-h-[500px] max-h-[600px] overflow-y-auto">
      <div
        v-for="(syllable, index) in filteredSyllables"
        :key="`${syllable.syllable}-${index}`"
        ref="syllableElements"
        draggable="true"
        @dragstart="(event) => handleDragStart(event, syllable)"
        @dragend="handleDragEnd"
        @touchstart="(event) => handleTouchStart(event, $event.currentTarget, syllable)"
        @touchmove="handleTouchMove"
        @touchend="(event) => handleTouchEnd(event, handleMobileDrop)"
        :class="[
          'bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-move transition-all min-h-[120px]',
          isDragging && draggedData?.syllable === syllable.syllable 
            ? 'opacity-50 scale-95' 
            : 'hover:bg-amber-200 hover:scale-105'
        ]"
      >
        <div class="flex-1 flex items-center justify-center mb-3">
          <img
            :src="syllable.image"
            :alt="`Glifo para ${syllable.syllable}`"
            class="w-20 h-20 object-contain pointer-events-none"
            @error="onImageError"
          />
        </div>
        <span class="text-base font-medium text-gray-800 text-center pointer-events-none">
          {{ syllable.syllable }}
        </span>
      </div>
    </div>

    <!-- Información de la pestaña activa -->
    <div class="mt-4 text-center text-sm text-amber-700">
      Mostrando {{ filteredSyllables.length }} glifos de {{ getCurrentTabLabel() }}
    </div>

    <!-- Instrucciones para móvil -->
    <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 md:hidden">
      <p class="font-medium mb-1">📱 En móvil:</p>
      <p>Mantén presionado un glifo por un momento, luego arrástralo hasta la cuadrícula para colocarlo.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import syllablesData from '~/data/syllables.json'
import { useDragAndDrop } from '~/composables/useDragAndDrop'

// Drag and drop functionality
const { 
  isDragging, 
  draggedData, 
  handleDragStart, 
  handleDragEnd, 
  handleTouchStart, 
  handleTouchMove, 
  handleTouchEnd 
} = useDragAndDrop()

// Estado de la pestaña activa
const activeTab = ref('vocales')
const syllableElements = ref([])

// Definición de pestañas y su lógica de filtrado
const tabs = [
  { key: 'vocales', label: 'Vocales', filter: (s) => ['a', 'e', 'i', 'o', 'u'].includes(s.syllable) },
  { key: 'b', label: 'B', filter: (s) => s.syllable.startsWith('ba') || s.syllable.startsWith('bi') || s.syllable.startsWith('bo') || s.syllable.startsWith('bu') },
  { key: 'ch', label: 'CH', filter: (s) => s.syllable.startsWith('cha') || s.syllable.startsWith('che') || s.syllable.startsWith('chi') || s.syllable.startsWith('cho') || s.syllable.startsWith('chu') },
  { key: 'ch_glotal', label: "CH'", filter: (s) => s.syllable.startsWith('ch´') },
  { key: 'h', label: 'H', filter: (s) => s.syllable.startsWith('ha') || s.syllable.startsWith('he') || s.syllable.startsWith('hi') || s.syllable.startsWith('ho') || s.syllable.startsWith('hu') },
  { key: 'j', label: 'J', filter: (s) => s.syllable.startsWith('ja') || s.syllable.startsWith('je') || s.syllable.startsWith('ji') || s.syllable.startsWith('jo') || s.syllable.startsWith('ju') },
  { key: 'k', label: 'K', filter: (s) => (s.syllable.startsWith('ka') || s.syllable.startsWith('ke') || s.syllable.startsWith('ki') || s.syllable.startsWith('ko') || s.syllable.startsWith('ku')) && !s.syllable.startsWith('k´') },
  { key: 'k_glotal', label: "K'", filter: (s) => s.syllable.startsWith('k´') },
  { key: 'l', label: 'L', filter: (s) => s.syllable.startsWith('la') || s.syllable.startsWith('le') || s.syllable.startsWith('li') || s.syllable.startsWith('lo') || s.syllable.startsWith('lu') },
  { key: 'm', label: 'M', filter: (s) => s.syllable.startsWith('ma') || s.syllable.startsWith('me') || s.syllable.startsWith('mi') || s.syllable.startsWith('mo') || s.syllable.startsWith('mu') },
  { key: 'n', label: 'N', filter: (s) => s.syllable.startsWith('na') || s.syllable.startsWith('ne') || s.syllable.startsWith('ni') || s.syllable.startsWith('no') || s.syllable.startsWith('nu') },
  { key: 'p', label: 'P', filter: (s) => s.syllable.startsWith('pa') || s.syllable.startsWith('pi') || s.syllable.startsWith('po') || s.syllable.startsWith('pu') },
  { key: 's', label: 'S', filter: (s) => s.syllable.startsWith('sa') || s.syllable.startsWith('se') || s.syllable.startsWith('si') },
  { key: 't', label: 'T', filter: (s) => (s.syllable.startsWith('ta') || s.syllable.startsWith('te') || s.syllable.startsWith('ti') || s.syllable.startsWith('to') || s.syllable.startsWith('tu')) && !s.syllable.startsWith('t´') && !s.syllable.startsWith('tz') },
  { key: 't_glotal', label: "T'", filter: (s) => s.syllable.startsWith('t´') },
  { key: 'tz', label: 'TZ', filter: (s) => s.syllable.startsWith('tza') || s.syllable.startsWith('tze') || s.syllable.startsWith('tzi') || s.syllable.startsWith('tzu') },
  { key: 'tz_glotal', label: "TZ'", filter: (s) => s.syllable.startsWith('tz´') },
  { key: 'w', label: 'W', filter: (s) => s.syllable.startsWith('wa') || s.syllable.startsWith('we') || s.syllable.startsWith('wi') || s.syllable.startsWith('wo') },
  { key: 'x', label: 'X', filter: (s) => s.syllable.startsWith('xa') || s.syllable.startsWith('xi') || s.syllable.startsWith('xo') || s.syllable.startsWith('xu') },
  { key: 'y', label: 'Y', filter: (s) => s.syllable.startsWith('ya') || s.syllable.startsWith('ye') || s.syllable.startsWith('yi') || s.syllable.startsWith('yo') || s.syllable.startsWith('yu') }
]

// Agregar conteos a las pestañas
tabs.forEach(tab => {
  tab.count = syllablesData.filter(tab.filter).length
})

// Computed para filtrar sílabas según la pestaña activa
const filteredSyllables = computed(() => {
  const currentTab = tabs.find(tab => tab.key === activeTab.value)
  return currentTab ? syllablesData.filter(currentTab.filter) : []
})

// Obtener el nombre de la pestaña actual
const getCurrentTabLabel = () => {
  const currentTab = tabs.find(tab => tab.key === activeTab.value)
  return currentTab ? currentTab.label : ''
}

// Handler para drop en móvil - buscar el grid
const handleMobileDrop = (data, position) => {
  // Emitir evento personalizado que será capturado por el componente padre
  const event = new CustomEvent('mobile-syllable-drop', {
    detail: { data, position },
    bubbles: true
  })
  document.dispatchEvent(event)
}

// Fallback for missing images
const onImageError = (event) => {
  event.target.src = '/escritura_maya/placeholder.png'
}
</script>