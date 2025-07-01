<template>
  <div class="min-h-screen bg-gray-100">
    <div class="h-screen flex flex-col">
      <div class="flex-1 grid grid-cols-1 md:grid-cols-3">
        <!-- Sección 1: Sílabas -->
        <section class="bg-white p-4 flex flex-col">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
            Sílabas Disponibles
          </h2>
          <p class="text-sm text-gray-600 mb-4">Arrastra las sílabas a la cuadrícula para formar palabras</p>
          <div class="flex-1 overflow-auto">
            <SyllableList />
          </div>
        </section>
        
        <!-- Sección 2: Cuadrícula -->
        <section class="bg-white p-4 flex flex-col border-l border-r border-gray-200">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
            Cuadrícula de Composición
          </h2>
          <p class="text-sm text-gray-600 mb-4">Organiza y redimensiona los glifos, luego guárdalos</p>
          <div class="flex-1 overflow-auto">
            <GlyphGrid @save-glyph="saveGlyph" />
          </div>
        </section>
        
        <!-- Sección 3: Historia -->
        <section class="bg-white p-4 flex flex-col">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span class="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
            Tu Historia Maya
          </h2>
          <p class="text-sm text-gray-600 mb-4">Visualiza tu historia completa en orden de lectura maya</p>
          <div class="flex-1 overflow-auto">
            <GlyphBlock 
              :glyph-history="glyphHistory" 
              @remove-glyph="removeGlyph"
              @clear-all="clearAllGlyphs"
            />
          </div>
        </section>
      </div>
      
      <!-- Estadísticas - Barra inferior -->
      <footer class="bg-white p-4 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600">{{ glyphHistory.length }}</div>
            <div class="text-sm text-gray-600">Glifos Creados</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600">{{ totalWords }}</div>
            <div class="text-sm text-gray-600">Palabras Totales</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600">{{ totalSyllables }}</div>
            <div class="text-sm text-gray-600">Sílabas Usadas</div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Notificación flotante -->
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SyllableList from '~/components/SyllableList.vue'
import GlyphGrid from '~/components/GlyphGrid.vue'
import GlyphBlock from '~/components/GlyphBlock.vue'

// Estado principal - array de glifos que forman la historia
const glyphHistory = ref([])

// Estadísticas computadas
const totalWords = computed(() => glyphHistory.value.length)
const totalSyllables = computed(() => {
  return glyphHistory.value.reduce((total, glyph) => {
    return total + glyph.glyphs.length
  }, 0)
})

// Guardar un nuevo glifo en la historia
const saveGlyph = (glyphData) => {
  console.log('Guardando glifo:', glyphData)
  glyphHistory.value.push(glyphData)
  
  // Opcional: mostrar confirmación
  showNotification('¡Glifo guardado exitosamente!')
}

// Eliminar un glifo específico de la historia
const removeGlyph = (index) => {
  if (index >= 0 && index < glyphHistory.value.length) {
    const removedGlyph = glyphHistory.value.splice(index, 1)[0]
    showNotification(`Glifo "${removedGlyph.word}" eliminado`)
  }
}

// Limpiar toda la historia
const clearAllGlyphs = () => {
  const count = glyphHistory.value.length
  glyphHistory.value = []
  showNotification(`${count} glifos eliminados`)
}

// Sistema de notificaciones simple
const notification = ref('')
const showNotification = (message) => {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

// Título de la página
useHead({
  title: 'Escritura Maya Interactiva',
  meta: [
    { name: 'description', content: 'Aplicación interactiva para crear historias usando glifos mayas' }
  ]
})
</script>

<style scoped>
/* Animaciones suaves */
section {
  transition: transform 0.2s ease;
}

/* Notificación flotante */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>