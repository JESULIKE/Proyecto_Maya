<template>
  <div>
    <p class="text-xl font-bold text-kin-texto"><RichText :text="item.prompt" /></p>

    <div v-if="item.promptImage" class="my-4 flex justify-center">
      <div class="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-kin-borde bg-white shadow-kin">
        <img :src="item.promptImage" alt="Glifo que debes leer" class="h-full w-full object-contain p-3" />
      </div>
    </div>
    <div v-if="item.block" class="my-4">
      <BlockView :parts="item.block.parts" :labels="true" :highlight="revealed ? item.reveal.highlight : ''" />
    </div>

    <ul class="mt-4 grid gap-3" :class="item.kind === 'glyph' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'">
      <li v-for="(o, i) in item.options" :key="i">
        <button
          type="button"
          class="option"
          :class="stateOf(i)"
          :disabled="locked || solved || eliminated(i)"
          :aria-label="o.image ? o.alt : undefined"
          @click="pick(i)"
        >
          <img v-if="o.image" :src="o.image" :alt="o.alt" class="h-24 w-full object-contain sm:h-28" />
          <span v-else class="text-lg font-bold">{{ o.text }}</span>
          <span v-if="solved && i === item.answer" class="mt-1 text-sm font-bold text-green-800">✓ Correcto</span>
          <span v-else-if="wrong.has(i)" class="mt-1 text-sm font-bold text-orange-800">Prueba otra</span>
          <span v-else-if="eliminated(i)" class="mt-1 text-sm text-kin-pardo">Descartada</span>
          <span v-else-if="revealed && i === item.answer && !solved" class="mt-1 text-sm font-bold text-green-800">Esta es</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RichText from '~/components/book/RichText.vue'
import BlockView from '~/components/book/BlockView.vue'

const props = defineProps({
  item: { type: Object, required: true },
  hintLevel: { type: Number, default: 0 },
  locked: { type: Boolean, default: false }
})
const emit = defineEmits(['wrong', 'solved'])

const wrong = ref(new Set())
const solved = ref(false)

const revealed = computed(() => props.hintLevel >= 3)
const eliminated = (i) => props.hintLevel >= 2 && props.item.eliminate.includes(i) && !solved.value

const stateOf = (i) => {
  if (solved.value && i === props.item.answer) return 'is-right'
  if (wrong.value.has(i)) return 'is-wrong'
  if (revealed.value && i === props.item.answer) return 'is-reveal'
  if (eliminated(i)) return 'is-off'
  return ''
}

const pick = (i) => {
  if (i === props.item.answer) {
    solved.value = true
    emit('solved')
  } else {
    wrong.value = new Set([...wrong.value, i])
    emit('wrong', props.item.explain(i))
  }
}
</script>

<style scoped>
.option {
  @apply flex min-h-[4rem] w-full flex-col items-center justify-center rounded-2xl border-2 border-kin-control bg-white px-3 py-3 text-kin-texto shadow-kin transition-colors;
}
.option:hover:not(:disabled) {
  @apply border-kin-terracota bg-kin-crema2;
}
.option.is-right {
  @apply border-kin-esmeralda bg-green-50;
}
.option.is-wrong {
  @apply border-kin-ocre bg-orange-50;
}
.option.is-reveal {
  @apply border-kin-maya bg-blue-50 ring-4 ring-kin-maya/30;
}
.option.is-off {
  @apply border-dashed opacity-50;
}
</style>
