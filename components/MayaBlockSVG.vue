<template>
  <div class="maya-block-svg relative inline-block" :style="{ width: `${width}px`, height: `${height}px` }">
    <svg :width="width" :height="height" xmlns="http://www.w3.org/2000/svg" class="border border-gray-200 rounded-md shadow-sm bg-white overflow-visible">
      <g v-for="el in layoutElements" :key="el.id || el.code">
        <!-- Fondo opcional para visualización de los slots geométricos -->
        <rect 
          :x="el.x" 
          :y="el.y" 
          :width="el.width" 
          :height="el.height" 
          fill="transparent" 
          stroke="#e2e8f0" 
          stroke-dasharray="2,2" 
        />
        
        <!-- Renderizado de la imagen SVG/PNG -->
        <image
          v-if="el.image"
          :href="el.image"
          :x="el.x"
          :y="el.y"
          :width="el.width"
          :height="el.height"
          preserveAspectRatio="xMidYMid meet"
          :class="{
            'opacity-40 filter grayscale': el.damaged,
            'cursor-pointer hover:scale-105 transition-transform origin-center': true
          }"
          :style="`transform-origin: ${el.x + el.width/2}px ${el.y + el.height/2}px;`"
          @click="$emit('glyph-click', el)"
        >
          <title>{{ el.code }} ({{ el.position }})</title>
        </image>
        
        <!-- Fallback de texto si no se encuentra la imagen en base de datos -->
        <g v-else>
          <rect
            :x="el.x"
            :y="el.y"
            :width="el.width"
            :height="el.height"
            fill="#fef2f2"
            stroke="#ef4444"
            stroke-dasharray="4,4"
            rx="4"
          />
          <text
            :x="el.x + el.width / 2"
            :y="el.y + el.height / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            class="text-[10px] font-mono fill-red-600 font-bold"
          >
            {{ el.code }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LayoutEngine } from '~/lib/maya/layout/LayoutEngine'
import { useMaya } from '~/composables/useMaya'

const props = defineProps({
  dsl: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 160
  },
  height: {
    type: Number,
    default: 160
  }
})

const emit = defineEmits(['glyph-click'])

const { getGlyphImageFromThompson } = useMaya()

const layoutElements = computed(() => {
  const engine = new LayoutEngine({ width: props.width, height: props.height, padding: 8 })
  const ast = engine.parseToAST(props.dsl)
  const result = engine.calculate(ast)
  
  return result.elements.map(el => {
    // Si el nodo en el DSL estaba envuelto por un tag especial de <damage>, podríamos capturarlo.
    // Por simplicidad, asumimos que se inyecta desde fuera o se marca en el AST.
    return {
      ...el,
      id: Math.random().toString(36).substr(2, 9),
      image: getGlyphImageFromThompson(el.code),
      damaged: false // Propiedad lista para conectar con el parser
    }
  })
})
</script>

<style scoped>
.maya-block-svg {
  display: inline-block;
}
</style>
