<template>
  <BookFrame>
    <div v-if="!lesson" class="card-pad text-center">
      <h1 class="page-title !text-3xl">No encontré esa lección</h1>
      <NuxtLink to="/textbook" class="btn-primary mt-4">Volver al mapa</NuxtLink>
    </div>

    <ClientOnly v-else>
      <header class="mb-5">
        <NuxtLink to="/textbook" class="btn-ghost btn-sm -ml-3">← Mapa</NuxtLink>
        <h1 class="mt-1 text-2xl text-kin-terracota">{{ lesson.title }}</h1>
        <div v-if="!finished && steps.length" class="mt-3">
          <div class="h-3 overflow-hidden rounded-full bg-kin-crema2" role="progressbar" :aria-valuenow="index + 1" aria-valuemin="1" :aria-valuemax="steps.length" :aria-label="`Paso ${index + 1} de ${steps.length}`">
            <div class="h-full rounded-full bg-kin-esmeralda transition-all duration-500" :style="{ width: ((index + 1) / steps.length) * 100 + '%' }"></div>
          </div>
          <p class="mt-1 text-sm text-kin-pardo">Paso {{ index + 1 }} de {{ steps.length }}</p>
        </div>
      </header>

      <!-- Explicación -->
      <article v-if="!finished && current && current.kind === 'explain'" :key="`e${index}`" class="card-pad">
        <h2 class="text-2xl text-kin-terracota">{{ current.title }}</h2>
        <p v-for="(p, i) in current.body" :key="i" class="mt-3 text-lg"><RichText :text="p" /></p>
        <StepVisual v-if="current.visual" :visual="current.visual" />
        <p v-if="current.note" class="callout-info mt-3 text-base">{{ current.note }}</p>
        <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button v-if="prefs.voice" type="button" class="btn-secondary btn-sm" @click="read(current)">Escuchar</button>
          <span v-else></span>
          <div class="flex gap-2">
            <button v-if="index > 0" type="button" class="btn-ghost" @click="index--">Atrás</button>
            <button type="button" class="btn-primary" @click="next">Siguiente</button>
          </div>
        </div>
      </article>

      <!-- Ejercicio -->
      <article v-else-if="!finished && current && current.kind === 'item'" :key="`i${index}`" class="card-pad">
        <ItemRunner :item="current.item" :next-label="index === steps.length - 1 ? 'Terminar' : 'Continuar'" @next="next" />
      </article>

      <!-- Final de la lección -->
      <article v-else-if="finished" class="card-pad text-center" aria-labelledby="fin">
        <h2 id="fin" class="text-3xl text-kin-terracota">¡Lección completada!</h2>
        <p class="mt-2 text-lg">Esto es lo que llevas en esta lección:</p>
        <ul class="mt-4 flex flex-wrap justify-center gap-5">
          <li v-for="id in lesson.concepts" :key="id" class="text-center">
            <ConceptGlyph :concept="id" :mastery="learner.masteryOf(id)" :mastered="learner.isMastered(id)" size="lg" />
            <p class="mt-1 text-base font-bold">{{ learner.isMastered(id) ? '¡Glifo revelado!' : 'Va tomando forma' }}</p>
            <p class="text-sm text-kin-pardo">Nivel: {{ learner.levelName(id) }}</p>
          </li>
        </ul>
        <p v-if="lesson.concepts.some((c) => !learner.isMastered(c))" class="callout-info mx-auto mt-5 max-w-md text-left text-base">
          Para terminar de revelar el glifo, vuelve a practicar esta lección o espera al repaso: con 3 aciertos seguidos se completa.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink v-if="nextLesson" :to="`/textbook/${nextLesson.id}`" class="btn-primary">Siguiente: {{ nextLesson.title }}</NuxtLink>
          <button type="button" class="btn-secondary" @click="restart">Practicar otra vez</button>
          <NuxtLink to="/textbook" class="btn-ghost">Volver al mapa</NuxtLink>
        </div>
      </article>

      <template #fallback>
        <p class="py-16 text-center text-lg text-kin-pardo">Preparando la lección…</p>
      </template>
    </ClientOnly>
  </BookFrame>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import BookFrame from '~/components/book/BookFrame.vue'
import ItemRunner from '~/components/book/ItemRunner.vue'
import StepVisual from '~/components/book/StepVisual.vue'
import RichText from '~/components/book/RichText.vue'
import ConceptGlyph from '~/components/book/ConceptGlyph.vue'
import syllables from '~/data/syllables.json'
import { lessonById, buildLessonSteps } from '~/lib/maya/textbook/curriculum'
import { useLearner } from '~/composables/useLearner'
import { useBookPrefs } from '~/composables/useBookPrefs'

const route = useRoute()
const learner = useLearner()
const { prefs, speak, stop } = useBookPrefs()

const lesson = computed(() => lessonById(String(route.params.lesson)))
const steps = ref([])
const index = ref(0)
const finished = ref(false)

const current = computed(() => steps.value[index.value])
const nextLesson = computed(() => {
  const all = learner.curriculum.lessons
  const i = all.findIndex((l) => l.id === lesson.value?.id)
  return i >= 0 ? all[i + 1] || null : null
})

const build = () => {
  if (!lesson.value) return
  // Semilla distinta en cada visita: los ejercicios varían, pero una vez abiertos no cambian
  steps.value = buildLessonSteps(lesson.value, syllables, (Date.now() % 1_000_000) + 1)
  index.value = 0
  finished.value = false
}

const next = () => {
  stop()
  if (index.value < steps.value.length - 1) {
    index.value++
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    finished.value = true
    learner.finishLesson(lesson.value.id)
  }
}

const restart = () => build()

const read = (step) => speak([step.title, ...step.body, step.note || ''].join('. '))

onMounted(build)
watch(() => route.params.lesson, build)
onUnmounted(stop)

useHead(() => ({ title: `${lesson.value?.title || 'Lección'} · Libro interactivo` }))
</script>
