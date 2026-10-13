<template>
  <span>
    <template v-for="(p, i) in parts" :key="i">
      <strong v-if="p.kind === 'b'" class="font-extrabold">{{ p.text }}</strong>
      <em v-else-if="p.kind === 'i'" class="italic">{{ p.text }}</em>
      <template v-else>{{ p.text }}</template>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue'

// Mini-formato seguro (sin v-html): **negrita** y *cursiva*
const props = defineProps({ text: { type: String, default: '' } })

const parts = computed(() =>
  props.text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) return { kind: 'b', text: chunk.slice(2, -2) }
      if (chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2) return { kind: 'i', text: chunk.slice(1, -1) }
      return { kind: 't', text: chunk }
    })
)
</script>
