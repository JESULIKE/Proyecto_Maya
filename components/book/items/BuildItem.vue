<template>
  <div>
    <p class="text-xl font-bold text-kin-texto">{{ item.prompt }}</p>

    <p v-if="item.meaning" class="mt-2">
      <span class="chip-brand">Significa: {{ item.meaning }}</span>
    </p>
    <p v-if="!item.real" class="callout-pending mt-3 text-base">Es solo práctica de sonidos: no es una palabra maya.</p>
    <p v-if="item.showSounds" class="mt-3 text-2xl font-extrabold text-kin-terracota" aria-label="Sonidos de la palabra">
      {{ item.target.map(label).join(' – ') }}
    </p>

    <!-- Espacios donde se escribe -->
    <ol class="mt-4 flex flex-wrap justify-center gap-3" aria-label="Tu palabra">
      <li v-for="(s, i) in slots" :key="i">
        <button
          type="button"
          class="slot"
          :class="[s.locked ? 'is-given' : '', s.key && !s.locked ? 'is-filled' : '', checked && s.key && s.key !== item.target[i] ? 'is-off' : '']"
          :disabled="s.locked || locked || !s.key"
          :aria-label="s.key ? `Lugar ${i + 1}: ${label(s.key)}${s.locked ? ', ya puesto' : ', toca para quitar'}` : `Lugar ${i + 1} vacío`"
          @click="remove(i)"
        >
          <img v-if="s.key" :src="imageOf(s.key)" :alt="label(s.key)" class="h-full w-full object-contain p-1" />
          <span v-else class="text-2xl font-bold text-kin-borde">{{ i + 1 }}</span>
        </button>
      </li>
    </ol>

    <!-- Fichas -->
    <p class="mt-5 text-base font-bold text-kin-pardo">Glifos disponibles</p>
    <ul class="mt-2 flex flex-wrap gap-3" aria-label="Glifos disponibles">
      <li v-for="t in visibleTiles" :key="t.key">
        <button
          type="button"
          class="tile"
          :class="[hint2 && t.need ? 'is-hint' : '', used.has(t.key) ? 'is-used' : '']"
          :disabled="locked || used.has(t.key)"
          :aria-label="`Glifo ${t.text}`"
          @click="add(t.key)"
        >
          <img :src="t.image" alt="" class="h-full w-full object-contain p-1" />
        </button>
      </li>
    </ul>

    <div class="mt-5">
      <button type="button" class="btn-primary" :disabled="locked || !complete" @click="check">Comprobar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { label } from '~/lib/maya/textbook/curriculum'

const props = defineProps({
  item: { type: Object, required: true },
  hintLevel: { type: Number, default: 0 },
  locked: { type: Boolean, default: false }
})
const emit = defineEmits(['wrong', 'solved'])

const placed = ref(props.item.target.map((s, i) => (i < props.item.given ? s : '')))
const checked = ref(false)

const imageOf = (key) => props.item.tiles.find((t) => t.key === key)?.image
const hint2 = computed(() => props.hintLevel >= 2)

const slots = computed(() => placed.value.map((key, i) => ({ key, locked: i < props.item.given })))
const used = computed(() => new Set(placed.value.filter(Boolean)))
const complete = computed(() => placed.value.every(Boolean))

// Pista 2: marca las fichas necesarias y quita las que sobran
const visibleTiles = computed(() =>
  props.item.tiles
    .map((t) => ({ ...t, need: props.item.target.includes(t.key) }))
    .filter((t) => props.hintLevel < 2 || t.need)
)

watch(
  () => props.hintLevel,
  (lv) => {
    if (lv >= 3) {
      placed.value = [...props.item.target]
      emit('solved')
    }
  }
)

const add = (key) => {
  const i = placed.value.indexOf('', props.item.given)
  if (i === -1) return
  checked.value = false
  placed.value = placed.value.map((v, j) => (j === i ? key : v))
}

const remove = (i) => {
  if (i < props.item.given) return
  checked.value = false
  placed.value = placed.value.map((v, j) => (j === i ? '' : v))
}

const check = () => {
  checked.value = true
  if (placed.value.every((s, i) => s === props.item.target[i])) emit('solved')
  else emit('wrong', props.item.explain())
}
</script>

<style scoped>
.slot {
  @apply flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-kin-control bg-white;
}
.slot.is-filled {
  @apply border-solid border-kin-terracota;
}
.slot.is-given {
  @apply border-solid border-kin-esmeralda bg-green-50;
}
.slot.is-off {
  @apply border-kin-ocre bg-orange-50;
}
.tile {
  @apply flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-kin-control bg-white shadow-kin transition-colors;
}
.tile:hover:not(:disabled) {
  @apply border-kin-terracota bg-kin-crema2;
}
.tile.is-used {
  @apply opacity-30;
}
.tile.is-hint {
  @apply border-kin-maya bg-blue-50 ring-4 ring-kin-maya/30;
}
</style>
