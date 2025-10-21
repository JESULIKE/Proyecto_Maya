<template>
  <div class="p-4 bg-amber-100 rounded-lg">
    
    <!-- Canvas SVG -->
    <div class="mb-4">
      <div class="w-full h-96 bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden">
        <svg 
          class="w-full h-full cursor-default" 
          @dragover.prevent 
          @drop="onDrop" 
          @click="deselectGlyph" 
          ref="svgElement"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Grid Lines -->
          <g v-if="gridSettings.showGrid" class="grid-lines pointer-events-none">
            <defs>
              <pattern id="grid" :width="gridSettings.gridSize" :height="gridSettings.gridSize" patternUnits="userSpaceOnUse">
                <path :d="`M ${gridSettings.gridSize} 0 L 0 0 0 ${gridSettings.gridSize}`" fill="none" stroke="#e5e7eb" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </g>

          <!-- Glyphs -->
          <g 
            v-for="glyph in glyphs" 
            :key="glyph.id"
            :class="{ 'selected-glyph': selectedGlyphId === glyph.id }"
            class="glyph-group cursor-grab"
            :style="{ zIndex: glyph.zIndex || 0 }"
          >
            <image
              :href="glyph.src"
              :x="glyph.x"
              :y="glyph.y"
              :width="glyph.width"
              :height="glyph.height"
              :transform="`rotate(${glyph.rotation || 0} ${glyph.x + glyph.width / 2} ${glyph.y + glyph.height / 2})`"
              @mousedown.stop="startDrag(glyph, $event)"
              @click.stop="selectGlyph(glyph)"
            />
            
            <!-- Selection outline and handles for selected glyph -->
            <g v-if="selectedGlyphId === glyph.id">
              <!-- Selection outline -->
              <rect
                :x="glyph.x - 2"
                :y="glyph.y - 2"
                :width="glyph.width + 4"
                :height="glyph.height + 4"
                fill="none"
                stroke="#3b82f6"
                stroke-width="2"
                stroke-dasharray="5,5"
                class="pointer-events-none"
              />
              
              <!-- Resize Handle (bottom-right) -->
              <rect
                :x="glyph.x + glyph.width - 8"
                :y="glyph.y + glyph.height - 8"
                width="16"
                height="16"
                fill="#3b82f6"
                stroke="white"
                stroke-width="2"
                rx="2"
                class="cursor-nwse-resize hover:fill-blue-600"
                @mousedown.stop="startResize(glyph, $event)"
              />
              
              <!-- Rotation Handle (top-center) -->
              <circle
                :cx="glyph.x + glyph.width / 2"
                :cy="glyph.y - 25"
                r="10"
                fill="#10b981"
                stroke="white"
                stroke-width="2"
                class="cursor-grab hover:fill-green-600"
                @mousedown.stop="startRotate(glyph, $event)"
              />
              
              <!-- Connection line to rotation handle -->
              <line
                :x1="glyph.x + glyph.width / 2"
                :y1="glyph.y"
                :x2="glyph.x + glyph.width / 2"
                :y2="glyph.y - 15"
                stroke="#3b82f6"
                stroke-width="1"
                class="pointer-events-none"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>

    <!-- Controles superiores -->
    <div class="mb-4 space-y-4">
      <!-- Configuración de rejilla -->
      <div class="p-3 bg-white rounded-lg border-2 border-amber-300">
        <h4 class="text-md font-medium mb-3 text-gray-700">Configuración de Rejilla:</h4>
        <div class="flex flex-wrap gap-4 items-center">
          <label class="flex items-center">
            <input type="checkbox" v-model="gridSettings.showGrid" class="mr-2" />
            <span class="text-sm">Mostrar Rejilla</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="gridSettings.snapToGrid" class="mr-2" />
            <span class="text-sm">Ajustar a Rejilla</span>
          </label>
        </div>
      </div>
      
      <!-- Panel de control del glifo seleccionado -->
      <div v-if="selectedGlyph" class="p-3 bg-white rounded-lg border-2 border-blue-300">
        <h4 class="text-md font-medium mb-2 text-gray-700">Editar Glifo Seleccionado:</h4>
        <div class="flex flex-wrap gap-2">
          <button
            @click="bringForward"
            :disabled="isAtFront"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            Traer Adelante
          </button>
          <button
            @click="sendBackward"
            :disabled="isAtBack"
            class="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            Enviar Atrás
          </button>
          <button
            @click="deleteSelectedGlyph"
            class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="clearGrid"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Limpiar Cuadrícula
        </button>
        <button
          @click="saveGlyph"
          :disabled="!formedWord"
          class="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Guardar Glifo
        </button>
      </div>
    </div>
    
    <!-- Información y estadísticas -->
    <div class="space-y-2">
      <p class="text-gray-800">
        Palabra formada: 
        <span class="font-semibold">{{ formedWord }}</span>
      </p>
      <p class="text-sm text-gray-600">
        Glifos en cuadrícula: {{ glyphs.length }}
      </p>
      <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
    </div>

    <!-- Instrucciones -->
    <div class="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
      <p class="font-medium mb-2">Instrucciones:</p>
      <ul class="space-y-1 text-xs">
        <li>• Arrastra sílabas desde la lista para añadirlas al canvas</li>
        <li>• Haz clic en un glifo para seleccionarlo</li>
        <li>• Arrastra para mover, usa los controles para redimensionar/rotar</li>
        <li>• Mantén Shift mientras redimensionas para mantener proporciones</li>
        <li>• Mantén Shift mientras rotas para ajustar en incrementos de 15°</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['save-glyph'])

// Estado principal
const glyphs = ref([])
const selectedGlyphId = ref(null)
const errorMessage = ref('')
const svgElement = ref(null)
let glyphIdCounter = 0

// Configuración de rejilla
const gridSettings = ref({
  showGrid: true,
  snapToGrid: false,
  gridSize: 80
})

// Estados de interacción
const draggingGlyph = ref(null)
const resizingGlyph = ref(null)
const rotatingGlyph = ref(null)
const offset = ref({ x: 0, y: 0 })
const initialGlyphState = ref(null)

// Computadas
const selectedGlyph = computed(() => {
  return glyphs.value.find(g => g.id === selectedGlyphId.value) || null
})

const formedWord = computed(() => {
  if (glyphs.value.length === 0) return ''
  
  // Ordenar glifos por posición (izquierda a derecha, arriba a abajo)
  const sortedGlyphs = [...glyphs.value].sort((a, b) => {
    const yDiff = a.y - b.y
    if (Math.abs(yDiff) > 50) { // Si la diferencia en Y es significativa
      return yDiff // Ordenar por Y (arriba a abajo)
    }
    return a.x - b.x // Si están en la misma "fila", ordenar por X (izquierda a derecha)
  })
  
  return sortedGlyphs.map(g => g.syllable).join('')
})

const isAtFront = computed(() => {
  if (!selectedGlyph.value || glyphs.value.length === 0) return true
  const maxZ = Math.max(...glyphs.value.map(g => g.zIndex || 0))
  return (selectedGlyph.value.zIndex || 0) >= maxZ
})

const isAtBack = computed(() => {
  if (!selectedGlyph.value || glyphs.value.length === 0) return true
  const minZ = Math.min(...glyphs.value.map(g => g.zIndex || 0))
  return (selectedGlyph.value.zIndex || 0) <= minZ
})

// Funciones de utilidad
const getSVGCoordinates = (clientX, clientY) => {
  if (!svgElement.value) return { x: 0, y: 0 }
  
  const svg = svgElement.value
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
  return { x: svgP.x, y: svgP.y }
}

const snap = (value) => {
  if (!gridSettings.value.snapToGrid) return value
  return Math.round(value / gridSettings.value.gridSize) * gridSettings.value.gridSize
}

// Funciones de interacción con glifos
const selectGlyph = (glyph) => {
  selectedGlyphId.value = glyph.id
}

const deselectGlyph = () => {
  selectedGlyphId.value = null
}

const addGlyph = (glyphData) => {
  errorMessage.value = ''
  
  const newGlyph = {
    id: ++glyphIdCounter,
    syllable: glyphData.syllable,
    src: glyphData.src || glyphData.image, // Compatibilidad con ambos nombres
    x: glyphData.x,
    y: glyphData.y,
    width: glyphData.width,
    height: glyphData.height,
    rotation: glyphData.rotation || 0,
    zIndex: glyphs.value.length
  }
  
  glyphs.value.push(newGlyph)
}

const updateGlyph = (updatedGlyph) => {
  const index = glyphs.value.findIndex(g => g.id === updatedGlyph.id)
  if (index !== -1) {
    glyphs.value[index] = { ...glyphs.value[index], ...updatedGlyph }
    errorMessage.value = ''
  }
}

const deleteGlyph = (glyphId) => {
  const index = glyphs.value.findIndex(g => g.id === glyphId)
  if (index !== -1) {
    glyphs.value.splice(index, 1)
    if (selectedGlyphId.value === glyphId) {
      selectedGlyphId.value = null
    }
    errorMessage.value = ''
  }
}

// Funciones de drag and drop
const startDrag = (glyph, event) => {
  if (resizingGlyph.value || rotatingGlyph.value) return
  
  draggingGlyph.value = glyph
  const svgCoords = getSVGCoordinates(event.clientX, event.clientY)
  offset.value.x = svgCoords.x - glyph.x
  offset.value.y = svgCoords.y - glyph.y
  
  document.body.style.cursor = 'grabbing'
  window.addEventListener("mousemove", onDrag)
  window.addEventListener("mouseup", stopDrag)
}

const onDrag = (event) => {
  if (!draggingGlyph.value) return
  
  const svgCoords = getSVGCoordinates(event.clientX, event.clientY)
  let newX = svgCoords.x - offset.value.x
  let newY = svgCoords.y - offset.value.y

  newX = snap(Math.max(0, Math.min(800 - draggingGlyph.value.width, newX)))
  newY = snap(Math.max(0, Math.min(600 - draggingGlyph.value.height, newY)))

  updateGlyph({ ...draggingGlyph.value, x: newX, y: newY })
}

const stopDrag = () => {
  draggingGlyph.value = null
  document.body.style.cursor = 'default'
  window.removeEventListener("mousemove", onDrag)
  window.removeEventListener("mouseup", stopDrag)
}

// Funciones de redimensionamiento
const startResize = (glyph, event) => {
  if (draggingGlyph.value || rotatingGlyph.value) return
  
  resizingGlyph.value = glyph
  initialGlyphState.value = { 
    width: glyph.width, 
    height: glyph.height, 
    aspectRatio: glyph.width / glyph.height 
  }
  
  const svgCoords = getSVGCoordinates(event.clientX, event.clientY)
  offset.value.x = svgCoords.x
  offset.value.y = svgCoords.y
  
  document.body.style.cursor = 'nwse-resize'
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

const onResize = (event) => {
  if (!resizingGlyph.value) return
  
  const svgCoords = getSVGCoordinates(event.clientX, event.clientY)
  const dx = svgCoords.x - offset.value.x
  const dy = svgCoords.y - offset.value.y
  
  let newWidth = initialGlyphState.value.width + dx
  let newHeight = initialGlyphState.value.height + dy
  
  // Maintain aspect ratio if shift is held
  if (event.shiftKey) {
    newHeight = newWidth / initialGlyphState.value.aspectRatio
  }

  // Minimum size constraints
  newWidth = Math.max(20, newWidth)
  newHeight = Math.max(20, newHeight)
  
  // Boundary constraints
  newWidth = Math.min(newWidth, 800 - resizingGlyph.value.x)
  newHeight = Math.min(newHeight, 600 - resizingGlyph.value.y)

  updateGlyph({ ...resizingGlyph.value, width: newWidth, height: newHeight })
}

const stopResize = () => {
  resizingGlyph.value = null
  document.body.style.cursor = 'default'
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}

// Funciones de rotación
const startRotate = (glyph, event) => {
  if (draggingGlyph.value || rotatingGlyph.value) return
  
  rotatingGlyph.value = glyph
  document.body.style.cursor = 'grabbing'
  window.addEventListener('mousemove', onRotate)
  window.addEventListener('mouseup', stopRotate)
}

const onRotate = (event) => {
  if (!rotatingGlyph.value) return
  
  const glyph = rotatingGlyph.value
  const svgCoords = getSVGCoordinates(event.clientX, event.clientY)
  const centerX = glyph.x + glyph.width / 2
  const centerY = glyph.y + glyph.height / 2
  
  let angle = Math.atan2(svgCoords.y - centerY, svgCoords.x - centerX) * (180 / Math.PI) + 90
  
  angle = Math.round(angle / 90) * 90
  
  updateGlyph({ ...glyph, rotation: angle })
}

const stopRotate = () => {
  rotatingGlyph.value = null
  document.body.style.cursor = 'default'
  window.removeEventListener('mousemove', onRotate)
  window.removeEventListener('mouseup', stopRotate)
}

// Funciones de control de glifos
const bringForward = () => {
  if (!selectedGlyph.value) return
  const maxZ = Math.max(...glyphs.value.map(g => g.zIndex || 0))
  updateGlyph({ ...selectedGlyph.value, zIndex: maxZ + 1 })
}

const sendBackward = () => {
  if (!selectedGlyph.value) return
  const minZ = Math.min(...glyphs.value.map(g => g.zIndex || 0))
  updateGlyph({ ...selectedGlyph.value, zIndex: Math.max(0, minZ - 1) })
}

const deleteSelectedGlyph = () => {
  if (selectedGlyph.value) {
    deleteGlyph(selectedGlyph.value.id)
  }
}

const clearGrid = () => {
  glyphs.value = []
  selectedGlyphId.value = null
  errorMessage.value = ''
}

const saveGlyph = () => {
  if (!formedWord.value) {
    errorMessage.value = 'No hay glifos para guardar.'
    return
  }
  
  const composedGlyph = {
    id: Date.now(),
    word: formedWord.value,
    gridType: 'svg', // Marcador para identificar el tipo SVG
    glyphs: glyphs.value.map(glyph => ({
      syllable: glyph.syllable,
      image: glyph.src,
      x: glyph.x,
      y: glyph.y,
      width: glyph.width,
      height: glyph.height,
      rotation: glyph.rotation || 0,
      zIndex: glyph.zIndex || 0
    })),
    timestamp: new Date().toISOString()
  }
  
  console.log('Emitiendo glifo SVG:', composedGlyph)
  emit('save-glyph', composedGlyph)
  clearGrid()
  
  // Mostrar confirmación temporal
  errorMessage.value = ''
  const originalMessage = errorMessage.value
  errorMessage.value = '¡Glifo guardado exitosamente!'
  setTimeout(() => {
    errorMessage.value = originalMessage
  }, 2000)
}

// Drop functionality
const onDrop = (event) => {
  event.preventDefault()
  
  let glyphData = null
  
  try {
    const jsonData = event.dataTransfer.getData('application/json')
    if (jsonData) {
      glyphData = JSON.parse(jsonData)
    }
  } catch (e) {
    console.warn('Could not parse dropped data as JSON')
  }
  
  if (!glyphData && event.detail?.data) {
    glyphData = event.detail.data
  }
  
  if (!glyphData) return
  
  const svgCoords = getSVGCoordinates(event.clientX, event.clientY)
  let x = svgCoords.x
  let y = svgCoords.y

  const defaultSize = 100
  x -= defaultSize / 2
  y -= defaultSize / 2
  
  x = snap(Math.max(0, Math.min(800 - defaultSize, x)))
  y = snap(Math.max(0, Math.min(600 - defaultSize, y)))

  addGlyph({
    syllable: glyphData.syllable,
    src: glyphData.image,
    x: x,
    y: y,
    width: defaultSize,
    height: defaultSize,
    rotation: 0
  })
}

// Manejo de eventos móviles
const handleMobileSyllableDrop = (event) => {
  const { data } = event.detail
  
  // Para el grid SVG, colocamos en el centro del canvas
  const centerX = 400 - 50 // Centro del canvas SVG menos la mitad del glifo
  const centerY = 300 - 50
  
  addGlyph({
    syllable: data.syllable,
    src: data.image,
    x: centerX,
    y: centerY,
    width: 100,
    height: 100,
    rotation: 0
  })
}

// Event listeners
onMounted(() => {
  document.addEventListener('mobile-syllable-drop', handleMobileSyllableDrop)
})

onUnmounted(() => {
  document.removeEventListener('mobile-syllable-drop', handleMobileSyllableDrop)
  window.removeEventListener("mousemove", onDrag)
  window.removeEventListener("mouseup", stopDrag)
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('mousemove', onRotate)
  window.removeEventListener('mouseup', stopRotate)
})
</script>

<style scoped>
.glyph-group:active {
  cursor: grabbing;
}

.selected-glyph image {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}
</style>