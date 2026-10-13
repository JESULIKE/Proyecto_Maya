<template>
  <div>
    <p class="text-xl font-bold text-kin-texto">{{ item.prompt }}</p>
    <p class="mt-1 text-base text-kin-pardo">Cada bloque tiene su código (A1, B1…): la letra es la columna y el número, la fila.</p>

    <ol class="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-3" aria-label="Bloques de glifos">
      <li v-for="b in item.blocks" :key="b.id">
        <button
          type="button"
          class="tile relative aspect-[5/4] w-full"
          :class="[orderOf(b.id) ? 'is-done' : '', nextHint === b.id ? 'is-hint' : '']"
          :disabled="locked || !!orderOf(b.id)"
          :aria-label="`Bloque ${b.id}${orderOf(b.id) ? `, lugar ${orderOf(b.id)}` : ''}`"
          @click="tap(b.id)"
        >
          <img :src="b.image" alt="" class="h-full w-full object-contain p-2" />
          <span class="absolute left-2 top-2 rounded-full bg-kin-crema2 px-2 text-sm font-bold text-kin-pardo">{{ b.id }}</span>
          <span v-if="orderOf(b.id)" class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-kin-esmeralda text-base font-extrabold text-white">{{ orderOf(b.id) }}</span>
        </button>
      </li>
    </ol>

    <div class="mt-3 flex justify-center">
      <button type="button" class="btn-secondary btn-sm" :disabled="!taps.length || locked" @click="taps = []">Empezar de nuevo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  hintLevel: { type: Number, default: 0 },
  locked: { type: Boolean, default: false }
})
const emit = defineEmits(['wrong', 'solved'])

const taps = ref([])

const orderOf = (id) => {
  const i = taps.value.indexOf(id)
  return i === -1 ? 0 : i + 1
}

// Pista 2: marca cuál es el siguiente bloque. Pista 3: completa el orden.
const nextHint = computed(() => (props.hintLevel >= 2 ? props.item.correct[taps.value.length] || '' : ''))

watch(
  () => props.hintLevel,
  (lv) => {
    if (lv >= 3) {
      taps.value = [...props.item.correct]
      emit('solved')
    }
  }
)

const tap = (id) => {
  const expected = props.item.correct[taps.value.length]
  if (id === expected) {
    taps.value = [...taps.value, id]
    if (taps.value.length === props.item.correct.length) emit('solved')
  } else {
    emit('wrong', props.item.explain())
  }
}
</script>

<style scoped>
.tile {
  @apply flex items-center justify-center rounded-2xl border-2 border-kin-control bg-white shadow-kin transition-colors;
}
.tile:hover:not(:disabled) {
  @apply border-kin-terracota bg-kin-crema2;
}
.tile.is-done {
  @apply border-kin-esmeralda bg-green-50;
}
.tile.is-hint {
  @apply border-kin-maya bg-blue-50 ring-4 ring-kin-maya/30;
}
</style>
