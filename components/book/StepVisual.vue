<template>
  <div class="my-4">
    <!-- Fila de glifos con su sílaba -->
    <ul v-if="visual.type === 'glyphs'" class="flex flex-wrap items-center justify-center gap-3" :aria-label="`Glifos: ${visual.syllables.map(label).join(', ')}`">
      <template v-for="(s, i) in visual.syllables" :key="s">
        <li v-if="visual.arrows && i > 0" class="text-2xl font-bold text-kin-ocre" aria-hidden="true">→</li>
        <li>
          <button type="button" class="glyph-card" :class="{ 'is-on': focus === s }" @click="focus = focus === s ? '' : s">
            <img :src="img(s)" :alt="`Glifo ${label(s)}`" class="h-20 w-20 object-contain sm:h-24 sm:w-24" :class="{ 'scale-110': focus === s }" />
            <span class="mt-1 text-lg font-extrabold text-kin-terracota">{{ label(s) }}</span>
          </button>
        </li>
      </template>
    </ul>

    <!-- Familias de sílabas -->
    <div v-else-if="visual.type === 'families'" class="space-y-3">
      <ul v-for="(row, r) in visual.rows" :key="r" class="flex flex-wrap justify-center gap-2">
        <li v-for="s in row" :key="s" class="glyph-card">
          <img :src="img(s)" :alt="`Glifo ${label(s)}`" class="h-16 w-16 object-contain sm:h-20 sm:w-20" />
          <span class="mt-1 text-lg font-extrabold text-kin-terracota"><span class="text-kin-ocre">{{ s[0] }}</span>{{ s.slice(1) }}</span>
        </li>
      </ul>
    </div>

    <!-- Bloque -->
    <BlockView v-else-if="visual.type === 'block'" :parts="blockParts" :roles="visual.labels" :labels="false" />

    <!-- Zigzag de lectura -->
    <figure v-else-if="visual.type === 'zigzag'" class="mx-auto w-full max-w-xs">
      <svg viewBox="0 0 240 300" class="w-full" role="img" aria-label="Seis bloques en dos columnas, numerados de 1 a 6 en zigzag descendente">
        <g v-for="(c, i) in zig" :key="i">
          <rect :x="c.x" :y="c.y" width="90" height="80" rx="10" fill="#fff" stroke="#8A7358" stroke-width="2" />
          <circle :cx="c.x + 45" :cy="c.y + 40" r="22" fill="#8B3E0F" />
          <text :x="c.x + 45" :y="c.y + 48" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">{{ i + 1 }}</text>
        </g>
        <polyline :points="path" fill="none" stroke="#C7650A" stroke-width="3" stroke-dasharray="6 6" />
      </svg>
    </figure>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import syllables from '~/data/syllables.json'
import { glyphIndex, label } from '~/lib/maya/textbook/curriculum'
import BlockView from '~/components/book/BlockView.vue'

const props = defineProps({ visual: { type: Object, required: true } })

const images = glyphIndex(syllables)
const img = (s) => images[s]
const focus = ref('')

const blockParts = computed(() => (props.visual.parts || []).map((p, i) => ({ ...p, image: images[p.syllable], letter: ['A', 'B', 'C'][i] })))

// Dos columnas × tres filas; las flechas unen los centros en orden de lectura
const zig = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 20 + (i % 2) * 110, y: 10 + Math.floor(i / 2) * 95 }))
const path = computed(() => zig.map((c) => `${c.x + 45},${c.y + 40}`).join(' '))
</script>

<style scoped>
.glyph-card {
  @apply flex min-h-target flex-col items-center rounded-xl border-2 border-kin-borde bg-white px-3 py-2 shadow-kin transition-colors;
}
button.glyph-card:hover,
.glyph-card.is-on {
  @apply border-kin-terracota bg-kin-crema2;
}
</style>
