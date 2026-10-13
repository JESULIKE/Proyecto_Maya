<template>
  <div
    class="mx-auto grid aspect-square w-full max-w-[17rem] gap-1.5 rounded-2xl border-2 border-kin-borde bg-kin-crema p-2"
    style="grid-template-columns: 1fr 1.7fr 1fr; grid-template-rows: 1fr 1.7fr 1fr"
    role="img"
    :aria-label="ariaLabel"
  >
    <div
      v-for="cell in cells"
      :key="cell.pos"
      class="relative flex items-center justify-center rounded-lg"
      :class="[
        cell.part ? 'bg-white shadow-kin' : 'border border-dashed border-kin-borde/70',
        cell.part && highlight === cell.part.letter ? 'ring-4 ring-kin-esmeralda' : ''
      ]"
      :style="{ gridColumn: cell.col, gridRow: cell.row }"
    >
      <img v-if="cell.part" :src="cell.part.image" :alt="cell.part.syllable ? `Glifo ${label(cell.part.syllable)}` : ''" class="h-full w-full object-contain p-1" />
      <span
        v-if="cell.part && labels && cell.part.letter"
        class="absolute left-1 top-1 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-kin-terracota px-1 text-sm font-extrabold text-white"
      >{{ cell.part.letter }}</span>
      <span
        v-if="cell.part && roles"
        class="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-kin-borde bg-kin-crema2 px-2 text-xs font-bold text-kin-terracota"
      >{{ roleOf(cell.part.pos) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { label } from '~/lib/maya/textbook/curriculum'

const props = defineProps({
  parts: { type: Array, required: true }, // [{ pos: 'main'|'left'|'right'|'top'|'bottom', image, syllable, letter }]
  labels: { type: Boolean, default: false }, // letras A, B, C sobre cada signo
  roles: { type: Boolean, default: false }, // etiquetas «principal», «antes», «después»
  highlight: { type: String, default: '' } // letra a resaltar
})

const GRID = {
  top: { col: 2, row: 1 }, left: { col: 1, row: 2 }, main: { col: 2, row: 2 }, right: { col: 3, row: 2 }, bottom: { col: 2, row: 3 }
}

const cells = computed(() =>
  ['top', 'left', 'main', 'right', 'bottom'].map((pos) => ({ pos, ...GRID[pos], part: props.parts.find((p) => p.pos === pos) || null }))
)

const roleOf = (pos) => (pos === 'main' ? 'principal' : pos === 'left' || pos === 'top' ? 'antes' : 'después')

const ariaLabel = computed(() => {
  const names = { main: 'centro', left: 'izquierda', right: 'derecha', top: 'arriba', bottom: 'abajo' }
  return 'Bloque de glifos: ' + props.parts.map((p) => `${p.syllable ? label(p.syllable) : 'signo'} en ${names[p.pos]}`).join(', ')
})
</script>
