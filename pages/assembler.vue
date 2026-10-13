<template>
  <div class="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-6">
      <h1 class="page-title">Ensamblador de glifos</h1>
      <p class="page-lead">
        Elige una sílaba, colócala en el lienzo y compón un bloque. Todo lo que quede dentro del marco ámbar es lo que se guarda.
      </p>
    </header>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1fr)]">
      <!-- 1 · Sílabas -->
      <section class="card-pad" aria-labelledby="paso-1">
        <h2 id="paso-1" class="step-title"><span class="step-num bg-kin-maya">1</span> Sílabas</h2>
        <p class="step-help">Arrastra una sílaba al lienzo. En el móvil, mantén presionado y suelta.</p>
        <SyllableList />
      </section>

      <!-- 2 · Lienzo -->
      <section class="card-pad" aria-labelledby="paso-2">
        <h2 id="paso-2" class="step-title"><span class="step-num bg-kin-esmeralda">2</span> Lienzo</h2>
        <p class="step-help">Mueve, agranda y gira los glifos. Puedes superponerlos, como en la escritura real.</p>
        <GlyphGrid @save-glyph="saveGlyph" />
      </section>

      <!-- 3 · Historia -->
      <section class="card-pad" aria-labelledby="paso-3">
        <h2 id="paso-3" class="step-title"><span class="step-num bg-kin-terracota">3</span> Tu historia</h2>
        <p class="step-help">Los glifos guardados aparecen aquí en orden de lectura.</p>

        <dl class="mb-4 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-xl bg-kin-crema2 p-2">
            <dt class="text-sm text-kin-pardo">Glifos</dt>
            <dd class="text-2xl font-extrabold text-kin-maya">{{ glyphHistory.length }}</dd>
          </div>
          <div class="rounded-xl bg-kin-crema2 p-2">
            <dt class="text-sm text-kin-pardo">Palabras</dt>
            <dd class="text-2xl font-extrabold text-kin-esmeralda">{{ totalWords }}</dd>
          </div>
          <div class="rounded-xl bg-kin-crema2 p-2">
            <dt class="text-sm text-kin-pardo">Sílabas</dt>
            <dd class="text-2xl font-extrabold text-kin-terracota">{{ totalSyllables }}</dd>
          </div>
        </dl>

        <GlyphBlock :glyph-history="glyphHistory" @remove-glyph="removeGlyph" @clear-all="clearAllGlyphs" />
      </section>
    </div>

    <!-- Notificación -->
    <div v-if="notification" role="status" class="alert-ok fixed right-4 top-20 z-50 shadow-kin">
      <span aria-hidden="true" class="font-bold">✓</span>
      <span>{{ notification }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import SyllableList from '~/components/SyllableList.vue'
import GlyphGrid from '~/components/GlyphGrid.vue'
import GlyphBlock from '~/components/GlyphBlock.vue'

// Glifos guardados (la historia)
const glyphHistory = ref([])

const totalWords = computed(() => glyphHistory.value.length)
const totalSyllables = computed(() =>
  glyphHistory.value.reduce((total, glyph) => total + glyph.glyphs.filter((g) => g.kind !== 'gap').length, 0)
)

const notification = ref('')
let notificationTimer = null
const showNotification = (message) => {
  notification.value = message
  clearTimeout(notificationTimer)
  notificationTimer = setTimeout(() => { notification.value = '' }, 3000)
}
onUnmounted(() => clearTimeout(notificationTimer))

const saveGlyph = (glyphData) => {
  glyphHistory.value.push(glyphData)
  showNotification('Glifo guardado')
}

const removeGlyph = (index) => {
  if (index < 0 || index >= glyphHistory.value.length) return
  const [removed] = glyphHistory.value.splice(index, 1)
  showNotification(`Glifo «${removed.word}» eliminado`)
}

const clearAllGlyphs = () => {
  const count = glyphHistory.value.length
  glyphHistory.value = []
  showNotification(`${count} glifos eliminados`)
}

useHead({
  title: 'Ensamblador · Laboratorio Maya',
  meta: [{ name: 'description', content: 'Compón bloques de glifos mayas y exporta a TEI conservando la evidencia editorial.' }]
})
</script>

<style scoped>
.step-title { @apply mb-1 flex items-center gap-3 text-xl text-kin-terracota; }
.step-num { @apply flex h-9 w-9 items-center justify-center rounded-full text-base font-extrabold text-white; }
.step-help { @apply mb-4 text-base text-kin-pardo; }
</style>
