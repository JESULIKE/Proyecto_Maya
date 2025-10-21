<template>
  <div class="p-4 bg-amber-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-2 text-gray-800">Bloque de Glifos</h3>
    
    <!-- Grid de glifos guardados -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-4">
      <div 
        v-for="(glyph, index) in glyphHistory" 
        :key="glyph.id" 
        class="bg-white p-3 rounded shadow relative"
      >
        <!-- Botón de eliminar -->
        <button
          @click="removeGlyph(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-20 transition-colors"
        >
          ×
        </button>
        
        <!-- Contenedor del glifo -->
        <div class="relative w-full aspect-square bg-gray-200 border-2 border-gray-400 rounded overflow-hidden">
          
          <!-- Renderizado para glifos tipo SVG (nuevo sistema) -->
          <div v-if="glyph.gridType === 'svg'" class="w-full h-full relative">
            <svg 
              class="w-full h-full" 
              viewBox="0 0 800 600" 
              preserveAspectRatio="xMidYMid meet"
            >
              <!-- Grid de fondo para referencia -->
              <defs>
                <pattern id="preview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#preview-grid)" />
              
              <!-- Glifos individuales -->
              <image
                v-for="subGlyph in glyph.glyphs"
                :key="`${glyph.id}-${subGlyph.x}-${subGlyph.y}`"
                :href="subGlyph.image"
                :x="subGlyph.x"
                :y="subGlyph.y"
                :width="subGlyph.width"
                :height="subGlyph.height"
                :transform="`rotate(${subGlyph.rotation || 0} ${subGlyph.x + subGlyph.width / 2} ${subGlyph.y + subGlyph.height / 2})`"
                class="pointer-events-none"
              />
            </svg>
          </div>
          
          <!-- Renderizado para glifos tipo cuadrícula 3x3 (sistema anterior) -->
          <div v-else class="w-full h-full relative">
            <!-- Grid de fondo para referencia -->
            <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px p-1">
              <div v-for="n in 9" :key="n" class="bg-white border border-gray-300 opacity-30"></div>
            </div>
            
            <!-- Glifos individuales en el sistema de cuadrícula -->
            <div
              v-for="subGlyph in glyph.glyphs"
              :key="`${glyph.id}-${subGlyph.position}`"
              class="absolute"
              :style="getGridGlyphStyle(subGlyph)"
            >
              <img
                :src="subGlyph.image"
                :alt="subGlyph.syllable"
                class="w-full h-full object-contain"
                :style="{ 
                  transform: `rotate(${subGlyph.rotation || 0}deg) scale(${subGlyph.scale || 1})` 
                }"
              />
            </div>
          </div>
        </div>
        
        <!-- Información del glifo -->
        <div class="mt-2">
          <p class="text-center text-sm text-gray-800 font-medium">{{ glyph.word }}</p>
          <p class="text-center text-xs text-gray-500">{{ formatDate(glyph.timestamp) }}</p>
          <div class="text-xs text-gray-400 text-center mt-1 flex justify-between items-center">
            <span>{{ glyph.glyphs.length }} sílaba{{ glyph.glyphs.length !== 1 ? 's' : '' }}</span>
            <span class="px-2 py-1 bg-gray-200 rounded text-xs">
              {{ glyph.gridType === 'svg' ? 'SVG' : '3x3' }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay glifos -->
      <div v-if="!glyphHistory.length" class="col-span-full text-center text-gray-500 py-8">
        <div class="text-4xl mb-2">📜</div>
        <p>No hay glifos guardados aún</p>
        <p class="text-xs mt-1">Crea tu primer glifo en la cuadrícula</p>
      </div>
    </div>
    
    <!-- Historia completa -->
    <div class="mt-4 p-4 bg-white rounded border-2 border-gray-300">
      <h4 class="text-md font-semibold text-gray-800 mb-3 flex items-center">
        <span class="mr-2">📖</span>
        Historia Maya Completa:
      </h4>
      <div class="bg-gray-50 p-3 rounded border min-h-16">
        <p class="text-gray-800 leading-relaxed text-justify">
          {{ fullHistory || 'La historia se construirá conforme agregues glifos...' }}
        </p>
      </div>
      <div class="mt-3 text-xs text-gray-500 flex flex-wrap justify-between items-center gap-2">
        <span>Total de glifos: {{ glyphHistory.length }}</span>
        <span>Palabras: {{ wordCount }}</span>
        <span>Caracteres: {{ characterCount }}</span>
        <span v-if="svgGlyphCount > 0" class="px-2 py-1 bg-blue-100 rounded">
          SVG: {{ svgGlyphCount }}
        </span>
        <span v-if="gridGlyphCount > 0" class="px-2 py-1 bg-green-100 rounded">
          3x3: {{ gridGlyphCount }}
        </span>
      </div>
    </div>
    
    <!-- Botón para limpiar toda la historia -->
    <div class="mt-4 flex justify-center">
      <button
        v-if="glyphHistory.length > 0"
        @click="clearAllGlyphs"
        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors flex items-center gap-2"
      >
        <span>🗑️</span>
        Limpiar toda la historia
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  glyphHistory: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove-glyph', 'clear-all'])

// Historia completa leyendo de izquierda a derecha, arriba hacia abajo (como se lee en maya)
const fullHistory = computed(() => {
  return props.glyphHistory.map(glyph => glyph.word).join(' ')
})

// Estadísticas computadas
const wordCount = computed(() => {
  const text = fullHistory.value.trim()
  return text ? text.split(' ').filter(w => w.length > 0).length : 0
})

const characterCount = computed(() => fullHistory.value.length)

const svgGlyphCount = computed(() => {
  return props.glyphHistory.filter(glyph => glyph.gridType === 'svg').length
})

const gridGlyphCount = computed(() => {
  return props.glyphHistory.filter(glyph => glyph.gridType !== 'svg').length
})

// Obtener el estilo para cada sub-glifo dentro del glifo compuesto (sistema 3x3)
const getGridGlyphStyle = (subGlyph) => {
  const row = Math.floor(subGlyph.position / 3)
  const col = subGlyph.position % 3
  
  // Usar porcentajes para que sea completamente responsive
  const cellSizePercent = 33.333 // 100% / 3 = 33.333%
  const gapPercent = 0.5 // Gap mínimo
  
  let widthPercent = cellSizePercent - gapPercent
  let heightPercent = cellSizePercent - gapPercent
  
  // Ajustar tamaño según el size del sub-glifo
  if (subGlyph.size === '2x1') widthPercent = (cellSizePercent * 2) - gapPercent
  else if (subGlyph.size === '1x2') heightPercent = (cellSizePercent * 2) - gapPercent
  else if (subGlyph.size === '3x1') widthPercent = (cellSizePercent * 3) - gapPercent
  else if (subGlyph.size === '1x3') heightPercent = (cellSizePercent * 3) - gapPercent
  else if (subGlyph.size === '2x2') {
    widthPercent = (cellSizePercent * 2) - gapPercent
    heightPercent = (cellSizePercent * 2) - gapPercent
  }
  
  return {
    left: `${col * cellSizePercent + gapPercent/2}%`,
    top: `${row * cellSizePercent + gapPercent/2}%`,
    width: `${widthPercent}%`,
    height: `${heightPercent}%`,
    zIndex: 10
  }
}

// Formatear fecha para mostrar
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('es-ES', { 
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Eliminar un glifo específico
const removeGlyph = (index) => {
  emit('remove-glyph', index)
}

// Limpiar toda la historia
const clearAllGlyphs = () => {
  if (confirm('¿Estás seguro de que quieres eliminar toda la historia de glifos?')) {
    emit('clear-all')
  }
}
</script>