<template>
  <div>
    
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
          :aria-label="`Eliminar glifo ${glyph.word}`"
          class="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-kin-ocre bg-orange-50 text-lg font-bold text-orange-900 transition-colors hover:bg-orange-100"
        >
          ×
        </button>
        
        <!-- Contenedor del glifo -->
        <div class="relative w-full aspect-square bg-gray-200 border-2 border-gray-400 rounded overflow-hidden">
          
          <!-- Renderizado para glifos tipo SVG (nuevo sistema) -->
          <div v-if="glyph.gridType === 'svg'" class="w-full h-full relative">
            <svg
              class="w-full h-full"
              :viewBox="`0 0 ${glyph.frame?.width || 800} ${glyph.frame?.height || 600}`"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <clipPath :id="`frame-${glyph.id}`">
                  <rect x="0" y="0" :width="glyph.frame?.width || 800" :height="glyph.frame?.height || 600" />
                </clipPath>
              </defs>
              <rect width="100%" height="100%" fill="#fffbeb" />

              <g :clip-path="`url(#frame-${glyph.id})`">
                <g
                  v-for="(subGlyph, i) in sortedByLayer(glyph.glyphs)"
                  :key="`${glyph.id}-${i}`"
                  :transform="`rotate(${subGlyph.rotation || 0} ${subGlyph.x + subGlyph.width / 2} ${subGlyph.y + subGlyph.height / 2})`"
                  class="pointer-events-none"
                >
                  <rect
                    v-if="subGlyph.kind === 'gap'"
                    :x="subGlyph.x" :y="subGlyph.y" :width="subGlyph.width" :height="subGlyph.height"
                    fill="#fff" fill-opacity="0.6" stroke="#78716c" stroke-width="3" stroke-dasharray="8,6"
                  />
                  <image
                    v-else
                    :href="subGlyph.image"
                    :x="subGlyph.x" :y="subGlyph.y" :width="subGlyph.width" :height="subGlyph.height"
                    preserveAspectRatio="xMidYMid meet"
                    :opacity="subGlyph.evidence === 'damaged' ? 0.7 : 1"
                  />
                  <rect
                    v-if="subGlyph.evidence === 'damaged' || subGlyph.evidence === 'supplied'"
                    :x="subGlyph.x" :y="subGlyph.y" :width="subGlyph.width" :height="subGlyph.height"
                    fill="none" stroke-width="3"
                    :stroke="subGlyph.evidence === 'damaged' ? '#dc2626' : '#2563eb'"
                    :stroke-dasharray="subGlyph.evidence === 'damaged' ? '10,5' : '2,5'"
                  />
                </g>
              </g>
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

const sortedByLayer = (items) => [...items].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

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