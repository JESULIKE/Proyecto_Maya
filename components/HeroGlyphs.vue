<template>
  <figure class="mx-auto w-full max-w-sm" aria-labelledby="hero-glyphs-cap">
    <!-- Cuadro fijo: lo único que cambia es el glifo (sin movimiento ni cambios de texto) -->
    <div class="card relative aspect-square w-full bg-white">
      <img
        v-for="(s, i) in pool"
        :key="s.image"
        :src="s.image"
        :alt="i === current ? `Glifo maya que se lee ${s.syllable}` : ''"
        :aria-hidden="i !== current"
        width="320"
        height="320"
        class="glyph absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] object-contain"
        :class="{ 'is-on': i === current }"
      />
    </div>

    <figcaption id="hero-glyphs-cap" class="mt-3 flex items-center justify-between gap-3">
      <span class="text-base text-kin-pardo">Cada glifo se lee como una sílaba.</span>
      <button type="button" class="btn-secondary btn-sm shrink-0" :aria-pressed="paused" @click="paused = !paused">
        {{ paused ? 'Reanudar' : 'Pausar' }}
      </button>
    </figcaption>
  </figure>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import syllables from '~/data/syllables.json'

// Solo variantes «standard» (signo completo), no las formas parciales de afijo
const POOL = ['ba', 'ma', 'la', 'na', 'pa', 'sa', 'ya', 'cha']
const STEP_MS = 4000

const pool = POOL.map((name) => syllables.find((s) => s.syllable === name && s.variant === 'standard')).filter(Boolean)

const current = ref(0)
const paused = ref(false)
let timer = null

onMounted(() => {
  // Con «reducir movimiento» no se inicia el cambio automático
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) paused.value = true
  timer = setInterval(() => {
    if (!paused.value) current.value = (current.value + 1) % pool.length
  }, STEP_MS)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
/* Solo opacidad: el tamaño y la posición no cambian. El que sale se desvanece
   primero y el que entra aparece después, así nunca se ven dos glifos a la vez. */
.glyph {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.glyph.is-on {
  opacity: 1;
  transition-delay: 0.3s;
}
@media (prefers-reduced-motion: reduce) {
  .glyph {
    transition: none;
  }
}
</style>
