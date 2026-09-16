<template>
  <div class="glyph-block">
    <div class="glyph-container">
      <svg
        viewBox="0 0 100 100"
        class="glyph-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Renderizar cada glifo en su posición -->
        <g v-for="(glyph, index) in variant.glyphs" :key="index">
          <image
            v-if="glyph.image"
            :href="glyph.image"
            :x="calculateX(glyph)"
            :y="calculateY(glyph)"
            :width="calculateWidth(glyph)"
            :height="calculateHeight(glyph)"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>

    <!-- Información de la variante -->
    <div class="variant-info">
      <span class="variant-label">Variante {{ variant.id }}</span>
      <span class="layout-type">{{ layoutName }}</span>
    </div>

    <!-- Botón de selección (opcional) -->
    <button
      v-if="showButton"
      @click="$emit('select', variant)"
      class="select-button"
    >
      Agregar a historia
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: Object,
    required: true
  },
  size: {
    type: Number,
    default: 280
  },
  showButton: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

// Nombre legible del layout
const layoutName = computed(() => {
  const names = {
    'classic': 'Clásico',
    'compact': 'Compacto',
    'expanded': 'Expandido'
  };
  return names[props.variant.layout] || props.variant.layout;
});

// Sistema de coordenadas normalizado (0-100)
const calculateX = (glyph) => {
  const positions = {
    'main': 25,      // Centrado en el medio
    'top': 37.5,     // Centrado arriba
    'left': 2,       // Pegado a la izquierda
    'right': 73,     // Pegado a la derecha
    'bottom': 37.5   // Centrado abajo
  };
  return positions[glyph.position] || 25;
};

const calculateY = (glyph) => {
  const positions = {
    'main': 25,      // Centrado en el medio
    'top': 2,        // Pegado arriba
    'left': 37.5,    // Centrado a la izquierda
    'right': 37.5,   // Centrado a la derecha
    'bottom': 73     // Pegado abajo
  };
  return positions[glyph.position] || 25;
};

const calculateWidth = (glyph) => {
  // Main = 50%, Afijos = 25%
  const baseWidth = glyph.position === 'main' ? 50 : 25;
  return baseWidth * glyph.size;
};

const calculateHeight = (glyph) => {
  // Main = 50%, Afijos = 25%
  const baseHeight = glyph.position === 'main' ? 50 : 25;
  return baseHeight * glyph.size;
};
</script>

<style scoped>
.glyph-block {
  display: flex;
  flex-direction: column;
  background: white;
  border: 3px solid #d97706;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.glyph-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.glyph-container {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 1rem;
  position: relative;
}

.glyph-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.variant-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: white;
  border-top: 2px solid #fcd34d;
}

.variant-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #92400e;
}

.layout-type {
  font-size: 0.75rem;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
}

.select-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-button:hover {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  transform: translateY(-1px);
}

.select-button:active {
  transform: translateY(0);
}
</style>