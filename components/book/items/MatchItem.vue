<template>
  <div>
    <p class="text-xl font-bold text-kin-texto">{{ item.prompt }}</p>
    <p class="mt-1 text-base text-kin-pardo">Toca un glifo y luego su sonido.</p>

    <div class="mt-4 grid grid-cols-2 gap-4">
      <ul class="space-y-3" aria-label="Glifos">
        <li v-for="p in item.pairs" :key="p.key">
          <button
            type="button"
            class="tile h-24 w-full"
            :class="[matched.has(p.key) ? 'is-done' : '', picked === p.key ? 'is-picked' : '', hintKey === p.key && !matched.has(p.key) ? 'is-hint' : '']"
            :disabled="matched.has(p.key) || locked"
            :aria-label="`Glifo ${p.text}`"
            @click="pickGlyph(p.key)"
          >
            <img :src="p.image" alt="" class="h-full w-full object-contain p-1" />
          </button>
        </li>
      </ul>
      <ul class="space-y-3" aria-label="Sonidos">
        <li v-for="k in item.order" :key="k">
          <button
            type="button"
            class="tile h-24 w-full text-2xl font-extrabold"
            :class="[matched.has(k) ? 'is-done' : '', hintKey === k && !matched.has(k) ? 'is-hint' : '']"
            :disabled="matched.has(k) || locked"
            @click="pickSound(k)"
          >
            {{ textOf(k) }}
            <span v-if="matched.has(k)" class="ml-2 text-base text-green-800" aria-hidden="true">✓</span>
          </button>
        </li>
      </ul>
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

const matched = ref(new Set())
const picked = ref('')

const textOf = (k) => props.item.pairs.find((p) => p.key === k)?.text

// Pista 2: resalta una pareja sin resolver. Pista 3: completa todas.
const hintKey = computed(() => {
  if (props.hintLevel < 2) return ''
  return props.item.pairs.find((p) => !matched.value.has(p.key))?.key || ''
})

const check = () => {
  if (matched.value.size === props.item.pairs.length) emit('solved')
}

watch(
  () => props.hintLevel,
  (lv) => {
    if (lv >= 3) {
      matched.value = new Set(props.item.pairs.map((p) => p.key))
      check()
    }
  }
)

const pickGlyph = (key) => { picked.value = picked.value === key ? '' : key }

const pickSound = (key) => {
  if (!picked.value) return
  if (picked.value === key) {
    matched.value = new Set([...matched.value, key])
    picked.value = ''
    check()
  } else {
    picked.value = ''
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
.tile.is-picked {
  @apply border-kin-terracota bg-amber-100 ring-4 ring-kin-terracota/25;
}
.tile.is-done {
  @apply border-kin-esmeralda bg-green-50;
}
.tile.is-hint {
  @apply border-kin-maya bg-blue-50 ring-4 ring-kin-maya/30;
}
</style>
