<template>
  <BookFrame>
    <ClientOnly>
      <header class="mb-5">
        <NuxtLink to="/textbook" class="btn-ghost btn-sm -ml-3">← Mapa</NuxtLink>
        <h1 class="mt-1 text-2xl text-kin-terracota">Repaso</h1>
        <p v-if="items.length && !finished" class="text-base text-kin-pardo">Pregunta {{ index + 1 }} de {{ items.length }}</p>
      </header>

      <article v-if="!items.length" class="card-pad text-center">
        <h2 class="text-2xl text-kin-terracota">Por ahora no hay nada que repasar</h2>
        <p class="mt-2 text-lg">Cuando estudies una lección, aquí aparecerán preguntas en el momento justo para que no se te olviden.</p>
        <NuxtLink to="/textbook" class="btn-primary mt-5">Volver al mapa</NuxtLink>
      </article>

      <article v-else-if="!finished" :key="index" class="card-pad">
        <ItemRunner :item="items[index]" :next-label="index === items.length - 1 ? 'Terminar' : 'Continuar'" @next="next" />
      </article>

      <article v-else class="card-pad text-center">
        <h2 class="text-3xl text-kin-terracota">¡Repaso terminado!</h2>
        <p class="mt-2 text-lg">Recordar poco a poco es la mejor forma de que los glifos se queden contigo.</p>
        <div class="mt-5 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/textbook" class="btn-primary">Volver al mapa</NuxtLink>
        </div>
      </article>

      <template #fallback>
        <p class="py-16 text-center text-lg text-kin-pardo">Preparando tu repaso…</p>
      </template>
    </ClientOnly>
  </BookFrame>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookFrame from '~/components/book/BookFrame.vue'
import ItemRunner from '~/components/book/ItemRunner.vue'
import syllables from '~/data/syllables.json'
import { makeItemForConcept, makeRng, shuffle } from '~/lib/maya/textbook/curriculum'
import { useLearner } from '~/composables/useLearner'

useHead({ title: 'Repaso · Libro interactivo' })

const MAX_ITEMS = 6
const learner = useLearner()
const items = ref([])
const index = ref(0)
const finished = ref(false)

onMounted(() => {
  const rng = makeRng((Date.now() % 1_000_000) + 1)
  const due = shuffle(learner.due(), rng)
  const out = []
  // Una pregunta por tema pendiente, repartidas de forma pareja, hasta el máximo
  for (let i = 0; out.length < MAX_ITEMS && due.length; i++) {
    const item = makeItemForConcept(due[i % due.length], syllables, rng)
    if (item) out.push(item)
    if (i > MAX_ITEMS * 3) break
  }
  items.value = out
})

const next = () => {
  if (index.value < items.value.length - 1) index.value++
  else finished.value = true
}
</script>
