<template>
  <div class="inline-flex flex-col items-center" :title="`${title}: ${statusText}`">
    <div
      class="relative flex items-center justify-center rounded-2xl border-2 bg-white"
      :class="[mastered ? 'border-kin-esmeralda' : 'border-kin-borde', sizeClass]"
    >
      <img
        v-if="image"
        :src="image"
        :alt="mastered ? `Glifo revelado: ${title}` : ''"
        class="h-full w-full object-contain p-1.5 transition-all duration-500"
        :style="{ filter: mastered ? 'none' : `brightness(0) opacity(${0.12 + mastery * 0.5})` }"
      />
      <span v-if="!mastered" class="absolute text-xl font-extrabold text-kin-pardo" aria-hidden="true">{{ mastery > 0 ? '' : '?' }}</span>
      <span v-if="mastered" class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-kin-esmeralda text-sm font-bold text-white" aria-hidden="true">✓</span>
    </div>
    <span v-if="caption" class="mt-1 max-w-[7rem] text-center text-sm font-semibold text-kin-texto">{{ title }}</span>
    <span class="sr-only">{{ statusText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import syllables from '~/data/syllables.json'
import { glyphIndex, conceptById } from '~/lib/maya/textbook/curriculum'

// Glifo que se «revela» a medida que se domina un concepto (indicador de nivel de K'in E2)
const props = defineProps({
  concept: { type: String, required: true },
  mastery: { type: Number, default: 0 },
  mastered: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  caption: { type: Boolean, default: true }
})

const images = glyphIndex(syllables)
const info = computed(() => conceptById(props.concept))
const image = computed(() => images[info.value?.reveal])
const title = computed(() => info.value?.title || props.concept)
const sizeClass = computed(() => ({ sm: 'h-14 w-14', md: 'h-20 w-20', lg: 'h-28 w-28' }[props.size] || 'h-20 w-20'))
const statusText = computed(() =>
  props.mastered ? 'revelado' : props.mastery > 0 ? `en progreso, ${Math.round(props.mastery * 100)} %` : 'aún por descubrir'
)
</script>
