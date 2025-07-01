<template>
  <div class="p-4 bg-amber-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-2 text-gray-800">Cuadrícula 3x3</h3>
    <div class="mb-4">
      <button
        @click="clearGrid"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Limpiar Cuadrícula
      </button>
    </div>
    
    <!-- Contenedor responsive para la cuadrícula -->
    <div class="w-full max-w-full overflow-auto">
      <div 
        ref="gridContainer"
        class="relative bg-gray-200 border-2 border-gray-400 rounded mx-auto"
        :style="gridContainerStyle"
      >
        <!-- Celdas de fondo -->
        <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1" :style="{ gap: `${cellGap}px` }">
          <div 
            v-for="n in 9" 
            :key="n" 
            class="bg-white border border-gray-300 rounded"
          ></div>
        </div>
        
        <!-- Zonas de drop -->
        <div
          v-for="(cell, index) in dropZones"
          :key="`drop-${index}`"
          :data-drop-zone="index"
          @dragover="handleDragOver"
          @drop="(event) => handleDrop(event, index, onDrop)"
          class="absolute cursor-pointer"
          :class="[
            isDragging ? 'bg-blue-200 bg-opacity-50 border-2 border-blue-400 border-dashed' : '',
            isPositionOccupied(index) ? 'pointer-events-none' : ''
          ]"
          :style="getDropZoneStyle(index)"
        ></div>
        
        <!-- Glifos activos -->
        <div
          v-for="glyph in activeGlyphs"
          :key="`glyph-${glyph.id}`"
          class="absolute"
          :style="getGlyphStyle(glyph)"
        >
          <img
            :src="glyph.image"
            :alt="glyph.syllable"
            class="w-full h-full object-contain transition-transform duration-300"
            :style="{ 
              transform: `rotate(${glyph.rotation || 0}deg) scale(${glyph.scale || 1})` 
            }"
          />
          
          <!-- Botones de control -->
          <div class="absolute -top-2 -right-2 flex flex-wrap gap-1 max-w-40" style="z-index: 25;">
            <!-- Botón eliminar -->
            <button
              @click="removeGlyph(glyph.id)"
              class="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Eliminar"
            >
              ×
            </button>
            
            <!-- Botón rotar -->
            <button
              @click="rotateGlyph(glyph.id)"
              class="bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-yellow-600 transition-colors"
              title="Rotar 90°"
            >
              ↻
            </button>
            
            <!-- Controles de escala -->
            <button
              @click="scaleGlyph(glyph.id, -0.1)"
              class="bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-purple-600 transition-colors"
              title="Reducir tamaño"
            >
              −
            </button>
            <button
              @click="scaleGlyph(glyph.id, 0.1)"
              class="bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-purple-600 transition-colors"
              title="Aumentar tamaño"
            >
              +
            </button>
            
            <!-- Botones de expansión -->
            <button
              v-if="glyph.size === '1x1' && canExpand(glyph, '2x1')"
              @click="expandGlyph(glyph.id, '2x1')"
              class="bg-blue-500 text-white text-xs rounded px-1 py-0.5 hover:bg-blue-600 transition-colors"
              title="Expandir 2x1"
            >
              2×1
            </button>
            <button
              v-if="glyph.size === '1x1' && canExpand(glyph, '1x2')"
              @click="expandGlyph(glyph.id, '1x2')"
              class="bg-blue-500 text-white text-xs rounded px-1 py-0.5 hover:bg-blue-600 transition-colors"
              title="Expandir 1x2"
            >
              1×2
            </button>
            <button
              v-if="glyph.size === '1x1' && canExpand(glyph, '3x1')"
              @click="expandGlyph(glyph.id, '3x1')"
              class="bg-blue-500 text-white text-xs rounded px-1 py-0.5 hover:bg-blue-600 transition-colors"
              title="Expandir 3x1"
            >
              3×1
            </button>
            <button
              v-if="glyph.size === '1x1' && canExpand(glyph, '1x3')"
              @click="expandGlyph(glyph.id, '1x3')"
              class="bg-blue-500 text-white text-xs rounded px-1 py-0.5 hover:bg-blue-600 transition-colors"
              title="Expandir 1x3"
            >
              1×3
            </button>
            <button
              v-if="glyph.size === '1x1' && canExpand(glyph, '2x2')"
              @click="expandGlyph(glyph.id, '2x2')"
              class="bg-blue-500 text-white text-xs rounded px-1 py-0.5 hover:bg-blue-600 transition-colors"
              title="Expandir 2x2"
            >
              2×2
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <p class="mt-4 text-gray-800">Palabra formada: <span class="font-semibold">{{ formedWord }}</span></p>
    <p v-if="errorMessage" class="mt-2 text-red-600">{{ errorMessage }}</p>
    <button
      @click="saveGlyph"
      class="mt-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      :disabled="!formedWord"
    >
      Guardar Glifo
    </button>

    <!-- Instrucciones para móvil -->
    <div class="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800 md:hidden">
      <p class="font-medium mb-1">✅ Zona de destino:</p>
      <p>Los glifos que arrastres desde la lista de sílabas aparecerán aquí automáticamente.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDragAndDrop } from '~/composables/useDragAndDrop'

// Drag and drop functionality
const { isDragging, handleDragOver, handleDrop } = useDragAndDrop()

const glyphs = ref([])
const errorMessage = ref('')
const gridContainer = ref(null)
const containerWidth = ref(400)
const emit = defineEmits(['save-glyph'])
let glyphIdCounter = 0

// Dimensiones responsive
const cellSize = computed(() => {
  const maxSize = Math.min(containerWidth.value - 40, 500) // -40 para padding
  return Math.floor((maxSize - 20) / 3) // -20 para gaps
})

const cellGap = computed(() => Math.max(2, Math.floor(cellSize.value * 0.02)))

const gridContainerStyle = computed(() => {
  const totalSize = cellSize.value * 3 + cellGap.value * 4 + 4 // +4 para padding interno
  return {
    width: `${totalSize}px`,
    height: `${totalSize}px`,
    padding: `${cellGap.value}px`
  }
})

// Función para actualizar el ancho del contenedor
const updateContainerWidth = () => {
  if (gridContainer.value?.parentElement) {
    containerWidth.value = gridContainer.value.parentElement.clientWidth
  }
}

// Listener para resize y eventos móviles
onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
  
  // Escuchar eventos personalizados de móvil
  document.addEventListener('mobile-syllable-drop', handleMobileSyllableDrop)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
  document.removeEventListener('mobile-syllable-drop', handleMobileSyllableDrop)
})

// Handler para drops desde móvil
const handleMobileSyllableDrop = (event) => {
  const { data, position } = event.detail
  
  // Encontrar una posición libre si no se especifica una
  let targetPosition = position
  if (targetPosition === undefined || isPositionOccupied(targetPosition)) {
    targetPosition = findFirstAvailablePosition()
  }
  
  if (targetPosition !== null && !isPositionOccupied(targetPosition)) {
    onDrop(data, targetPosition)
  } else {
    errorMessage.value = 'No hay espacio disponible en la cuadrícula.'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Encontrar primera posición disponible
const findFirstAvailablePosition = () => {
  for (let i = 0; i < 9; i++) {
    if (!isPositionOccupied(i)) {
      return i
    }
  }
  return null
}

const dropZones = computed(() => Array(9).fill(null))
const activeGlyphs = computed(() => glyphs.value)
const formedWord = computed(() => {
  const sortedGlyphs = [...glyphs.value].sort((a, b) => {
    const aRow = Math.floor(a.position / 3)
    const bRow = Math.floor(b.position / 3)
    const aCol = a.position % 3
    const bCol = b.position % 3
    if (aRow !== bRow) return aRow - bRow
    return aCol - bCol
  })
  return sortedGlyphs.map(g => g.syllable).join('')
})

const getDropZoneStyle = (index) => {
  const row = Math.floor(index / 3)
  const col = index % 3
  const size = cellSize.value
  const gap = cellGap.value
  
  // Solo mostrar zona de drop si la posición está vacía
  const isOccupied = isPositionOccupied(index)
  
  return {
    left: `${gap + col * (size + gap)}px`,
    top: `${gap + row * (size + gap)}px`,
    width: `${size}px`,
    height: `${size}px`,
    'z-index': isOccupied ? -1 : 20, // Solo z-index alto si está vacía
    'pointer-events': isOccupied ? 'none' : 'auto' // Desactivar eventos si está ocupada
  }
}

const getGlyphStyle = (glyph) => {
  const row = Math.floor(glyph.position / 3)
  const col = glyph.position % 3
  const size = cellSize.value
  const gap = cellGap.value
  
  let width = size
  let height = size
  
  if (glyph.size === '2x1') width = size * 2 + gap
  else if (glyph.size === '1x2') height = size * 2 + gap
  else if (glyph.size === '3x1') width = size * 3 + gap * 2
  else if (glyph.size === '1x3') height = size * 3 + gap * 2
  else if (glyph.size === '2x2') {
    width = size * 2 + gap
    height = size * 2 + gap
  }
  
  return {
    left: `${gap + col * (size + gap)}px`,
    top: `${gap + row * (size + gap)}px`,
    width: `${width}px`,
    height: `${height}px`,
    'z-index': 10
  }
}

const isPositionOccupied = (position, excludeGlyphId = null) => {
  return glyphs.value.some(glyph => {
    if (excludeGlyphId && glyph.id === excludeGlyphId) return false
    return getOccupiedPositions(glyph).includes(position)
  })
}

const getOccupiedPositions = (glyph) => {
  const row = Math.floor(glyph.position / 3)
  const col = glyph.position % 3
  const positions = [glyph.position]
  
  if (glyph.size === '2x1' && col < 2) positions.push(glyph.position + 1)
  else if (glyph.size === '1x2' && row < 2) positions.push(glyph.position + 3)
  else if (glyph.size === '3x1' && col < 1) positions.push(glyph.position + 1, glyph.position + 2)
  else if (glyph.size === '1x3' && row < 1) positions.push(glyph.position + 3, glyph.position + 6)
  else if (glyph.size === '2x2' && row < 2 && col < 2) positions.push(glyph.position + 1, glyph.position + 3, glyph.position + 4)
  
  return positions.filter(p => p >= 0 && p < 9)
}

const canExpand = (glyph, newSize) => {
  const row = Math.floor(glyph.position / 3)
  const col = glyph.position % 3
  let requiredPositions = []
  
  if (newSize === '2x1' && col < 2) requiredPositions = [glyph.position + 1]
  else if (newSize === '1x2' && row < 2) requiredPositions = [glyph.position + 3]
  else if (newSize === '3x1' && col < 1) requiredPositions = [glyph.position + 1, glyph.position + 2]
  else if (newSize === '1x3' && row < 1) requiredPositions = [glyph.position + 3, glyph.position + 6]
  else if (newSize === '2x2' && row < 2 && col < 2) requiredPositions = [glyph.position + 1, glyph.position + 3, glyph.position + 4]
  else return false
  
  return requiredPositions.every(pos => pos < 9 && !isPositionOccupied(pos, glyph.id))
}

// Función unificada para drops (desktop y móvil)
const onDrop = (data, position) => {
  errorMessage.value = ''
  
  if (!isPositionOccupied(position)) {
    const newGlyph = {
      id: ++glyphIdCounter,
      syllable: data.syllable,
      image: data.image,
      position: position,
      size: '1x1',
      rotation: 0,
      scale: 1
    }
    glyphs.value.push(newGlyph)
  } else {
    errorMessage.value = 'No se puede colocar el glifo aquí: celda ocupada.'
  }
}

// Función para rotar glifos
const rotateGlyph = (glyphId) => {
  const glyph = glyphs.value.find(g => g.id === glyphId)
  if (glyph) {
    glyph.rotation = (glyph.rotation || 0) + 90
    if (glyph.rotation >= 360) glyph.rotation = 0
  }
}

// Función para escalar glifos
const scaleGlyph = (glyphId, scaleChange) => {
  const glyph = glyphs.value.find(g => g.id === glyphId)
  if (glyph) {
    const newScale = Math.max(0.3, Math.min(2, (glyph.scale || 1) + scaleChange))
    glyph.scale = Math.round(newScale * 10) / 10 // Redondear a 1 decimal
  }
}

const expandGlyph = (glyphId, newSize) => {
  const glyph = glyphs.value.find(g => g.id === glyphId)
  if (glyph && canExpand(glyph, newSize)) {
    glyph.size = newSize
    errorMessage.value = ''
  } else {
    errorMessage.value = `No se puede expandir el glifo a ${newSize}: posición inválida o celdas ocupadas.`
  }
}

const removeGlyph = (glyphId) => {
  const index = glyphs.value.findIndex(g => g.id === glyphId)
  if (index !== -1) {
    glyphs.value.splice(index, 1)
    errorMessage.value = ''
  }
}

const clearGrid = () => {
  glyphs.value = []
  errorMessage.value = ''
}

const saveGlyph = () => {
  if (formedWord.value) {
    const composedGlyph = {
      id: Date.now(),
      word: formedWord.value,
      glyphs: glyphs.value.map(glyph => ({
        syllable: glyph.syllable,
        image: glyph.image,
        position: glyph.position,
        size: glyph.size,
        rotation: glyph.rotation || 0,
        scale: glyph.scale || 1
      })),
      timestamp: new Date().toISOString()
    }
    
    console.log('Emitting composed glyph:', composedGlyph)
    emit('save-glyph', composedGlyph)
    clearGrid()
  }
}
</script>