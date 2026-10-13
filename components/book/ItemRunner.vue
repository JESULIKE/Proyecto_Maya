<template>
  <section aria-live="polite">
    <!-- Aprendiz: la primera pista ya está a la vista (se retira tras 3 aciertos seguidos) -->
    <p v-if="scaffold === 2 && !solved" class="callout-info mb-4 flex items-start gap-2 text-base">
      <span class="font-extrabold" aria-hidden="true">i</span>
      <span><strong>Pista:</strong> {{ item.hints[0] }}</span>
    </p>

    <component :is="comp" :item="item" :hint-level="hintLevel" :locked="solved" @wrong="onWrong" @solved="onSolved" />

    <!-- Retroalimentación: color + ícono + texto, siempre amable -->
    <p v-if="feedback" role="status" :class="feedback.ok ? 'alert-ok' : 'alert-warn'" class="mt-5">
      <span class="font-extrabold" aria-hidden="true">{{ feedback.ok ? '✓' : '!' }}</span>
      <span>{{ feedback.text }}</span>
    </p>

    <!-- Escalera de pistas -->
    <div v-if="!solved" class="mt-5">
      <p v-for="n in shownHints" :key="n" class="callout-info mb-2 text-base">
        <strong>Ayuda {{ n }}:</strong> {{ item.hints[n - 1] }}
      </p>
      <button v-if="hintLevel < 3" type="button" class="btn-secondary btn-sm" @click="moreHelp">
        {{ helpLabel }}
      </button>
    </div>

    <div v-if="solved" class="mt-5 flex justify-end">
      <button ref="nextBtn" type="button" class="btn-primary" @click="$emit('next')">{{ nextLabel }}</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ChoiceItem from '~/components/book/items/ChoiceItem.vue'
import MatchItem from '~/components/book/items/MatchItem.vue'
import OrderItem from '~/components/book/items/OrderItem.vue'
import BuildItem from '~/components/book/items/BuildItem.vue'
import { useLearner } from '~/composables/useLearner'

const props = defineProps({
  item: { type: Object, required: true },
  nextLabel: { type: String, default: 'Continuar' }
})
const emit = defineEmits(['next', 'finished'])

const learner = useLearner()
const COMPONENTS = { choice: ChoiceItem, match: MatchItem, order: OrderItem, build: BuildItem }
const comp = computed(() => COMPONENTS[props.item.type])

// Nivel de andamiaje calculado al abrir el ejercicio (no cambia a mitad de la pregunta).
// En Aprendiz la primera pista ya está a la vista: cuenta como punto de partida, no como ayuda pedida.
const scaffold = learner.scaffold(props.item.concept)
const baseline = scaffold === 2 ? 1 : 0

const hintLevel = ref(baseline)
const wrongCount = ref(0)
const solved = ref(false)
const feedback = ref(null)
const nextBtn = ref(null)

// Ayudas ya pedidas (la pista inicial de Aprendiz se muestra aparte)
const shownHints = computed(() => Array.from({ length: hintLevel.value - baseline }, (_, i) => i + 1 + baseline))
// Lo que se registra en el modelo: revelar la solución pesa más que una pista
const hintsUsed = () => (hintLevel.value >= 3 ? 3 : Math.max(0, hintLevel.value - baseline))
const helpLabel = computed(() => (scaffold === 2 ? 'Más ayuda' : scaffold === 1 ? 'Pista' : 'Necesito ayuda'))

const PRAISE = ['¡Muy bien!', '¡Eso es!', '¡Buen ojo!', '¡Lo lograste!', '¡Correcto!']

const moreHelp = () => {
  hintLevel.value = Math.min(3, hintLevel.value + 1)
}

const onWrong = (explanation) => {
  // Cada error ofrece más ayuda, nunca menos (E3). El fallo se registra una sola vez por ejercicio.
  if (wrongCount.value === 0) learner.answer(props.item.concept, { correct: false })
  wrongCount.value += 1
  if (hintLevel.value < 2) hintLevel.value = Math.max(hintLevel.value + 1, baseline + 1)
  feedback.value = { ok: false, text: `Casi. ${explanation}` }
}

const onSolved = async () => {
  if (solved.value) return
  solved.value = true
  if (wrongCount.value === 0) learner.answer(props.item.concept, { correct: true, hints: hintsUsed() })
  const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)]
  feedback.value = {
    ok: true,
    text: wrongCount.value === 0 && hintsUsed() === 0 ? `${praise}` : `${praise} Con práctica te saldrá sin ayuda.`
  }
  emit('finished', { clean: wrongCount.value === 0 && hintsUsed() === 0 })
  await nextTick()
  nextBtn.value?.focus()
}
</script>
