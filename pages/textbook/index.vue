<template>
  <BookFrame>
    <ClientOnly>
      <!-- Bienvenida (apodo opcional, anónimo) -->
      <section v-if="!learner.alias.value" class="card-pad mb-6" aria-labelledby="bienvenida">
        <h1 id="bienvenida" class="page-title !text-3xl">Bienvenida al taller de escribas</h1>
        <p class="mt-2 text-lg">
          Aquí aprenderás a leer y escribir con glifos mayas, paso a paso. Tú decides por dónde ir; el libro te sugiere el camino y te ayuda cuando lo necesites.
        </p>
        <form class="mt-4" @submit.prevent="start">
          <label for="apodo" class="block font-bold">¿Cómo quieres que te llame?</label>
          <p class="text-base text-kin-pardo">Usa un apodo inventado, no tu nombre real. Tu avance se guarda solo en este dispositivo.</p>
          <div class="mt-2 flex flex-wrap gap-3">
            <input id="apodo" v-model="nickname" class="field max-w-xs" maxlength="24" autocomplete="off" placeholder="Por ejemplo: Jaguar" />
            <button type="submit" class="btn-primary">Empezar</button>
            <button type="button" class="btn-ghost" @click="learner.rename('Escriba')">Seguir sin apodo</button>
          </div>
        </form>
      </section>

      <template v-else>
        <header class="mb-6">
          <h1 class="page-title">Tu ruta de escriba</h1>
          <p class="page-lead">Hola, <strong>{{ learner.alias.value }}</strong>. Cada lección revela un glifo nuevo en tu libro.</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="chip-brand">Nivel: {{ learner.level.value }}</span>
            <span class="chip-ok">{{ learner.masteredCount.value }} de {{ learner.conceptIds.length }} glifos revelados</span>
          </div>
        </header>

        <!-- Glifos por revelar -->
        <section class="card-pad mb-6" aria-labelledby="reveal">
          <h2 id="reveal" class="text-xl text-kin-terracota">Glifos por revelar</h2>
          <ul class="mt-4 flex flex-wrap justify-center gap-4">
            <li v-for="c in concepts" :key="c.id">
              <ConceptGlyph :concept="c.id" :mastery="learner.masteryOf(c.id)" :mastered="learner.isMastered(c.id)" size="md" />
            </li>
          </ul>
        </section>

        <!-- Siguiente paso -->
        <section v-if="recommended" class="card-pad mb-4 border-2 !border-kin-esmeralda" aria-labelledby="sigue">
          <p class="chip-ok mb-2">Sigue por aquí</p>
          <h2 id="sigue" class="text-2xl text-kin-terracota">{{ recommended.title }}</h2>
          <p class="mt-1 text-base">{{ recommended.goal }} · {{ recommended.minutes }} min</p>
          <NuxtLink :to="`/textbook/${recommended.id}`" class="btn-primary mt-4">
            {{ learner.status(recommended) === 'nueva' ? 'Empezar' : 'Continuar' }}
          </NuxtLink>
        </section>
        <section v-else class="callout-info mb-4">
          <p class="font-bold">¡Completaste toda la ruta!</p>
          <p>Mantén tus glifos frescos con el repaso o compón bloques libremente en el ensamblador.</p>
        </section>

        <!-- Repaso -->
        <section class="card-pad mb-8" aria-labelledby="repaso">
          <h2 id="repaso" class="text-xl text-kin-terracota">Repaso</h2>
          <template v-if="dueCount">
            <p class="mt-1 text-base">Hay {{ dueCount }} tema{{ dueCount > 1 ? 's' : '' }} listo{{ dueCount > 1 ? 's' : '' }} para recordar. Son pocas preguntas y ayudan a que no se te olvide.</p>
            <NuxtLink to="/textbook/repaso" class="btn-brand mt-3">Repasar ahora</NuxtLink>
          </template>
          <p v-else class="mt-1 text-base text-kin-pardo">Todavía no hay nada que repasar. Cuando estudies una lección, el repaso te avisará en el momento justo.</p>
        </section>

        <!-- Lecciones por unidad -->
        <section v-for="u in units" :key="u.id" class="mb-8" :aria-labelledby="`u-${u.id}`">
          <h2 :id="`u-${u.id}`" class="mb-3 text-2xl text-kin-terracota">{{ u.title }}</h2>
          <ul class="space-y-3">
            <li v-for="l in lessonsOf(u.id)" :key="l.id" class="card-pad flex flex-wrap items-center gap-4">
              <ConceptGlyph :concept="l.concepts[0]" :mastery="learner.masteryOf(l.concepts[0])" :mastered="learner.isMastered(l.concepts[0])" size="sm" :caption="false" />
              <div class="min-w-0 flex-1">
                <h3 class="text-lg text-kin-terracota">{{ l.title }}</h3>
                <p class="text-base text-kin-pardo">{{ l.goal }} · {{ l.minutes }} min</p>
                <p v-if="advice(l)" class="chip-info mt-1">Te ayuda saber antes: {{ advice(l) }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="chip" :class="STATUS[learner.status(l)].chip">{{ STATUS[learner.status(l)].text }}</span>
                <NuxtLink :to="`/textbook/${l.id}`" class="btn-secondary btn-sm">{{ learner.status(l) === 'nueva' ? 'Empezar' : 'Repetir' }}</NuxtLink>
              </div>
            </li>
          </ul>
        </section>

        <!-- Mi progreso (modelo abierto del estudiante) -->
        <section class="card-pad mb-8" aria-labelledby="progreso">
          <h2 id="progreso" class="text-2xl text-kin-terracota">Mi progreso</h2>
          <p class="mt-1 text-base text-kin-pardo">
            Las pistas se retiran solas cuando aciertas 3 veces seguidas. Si algo se complica, la ayuda vuelve: es parte de aprender.
          </p>
          <ul class="mt-4 space-y-4">
            <li v-for="c in concepts" :key="c.id" class="flex items-center gap-3">
              <ConceptGlyph :concept="c.id" :mastery="learner.masteryOf(c.id)" :mastered="learner.isMastered(c.id)" size="sm" :caption="false" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="font-bold">{{ c.title }}</p>
                  <span class="chip-brand">{{ learner.levelName(c.id) }}</span>
                </div>
                <div class="mt-1 h-3 overflow-hidden rounded-full bg-kin-crema2" role="progressbar" :aria-valuenow="pct(c.id)" aria-valuemin="0" aria-valuemax="100" :aria-label="`Dominio de ${c.title}`">
                  <div class="h-full rounded-full bg-kin-esmeralda transition-all duration-500" :style="{ width: pct(c.id) + '%' }"></div>
                </div>
                <p class="mt-1 text-sm text-kin-pardo">{{ pct(c.id) }} %</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="callout-rule mb-6">
          <p class="font-bold">¿Quieres practicar a tu manera?</p>
          <p class="text-base">En el ensamblador puedes componer bloques de glifos libremente.</p>
          <NuxtLink to="/assembler" class="btn-secondary btn-sm mt-2">Ir al ensamblador</NuxtLink>
        </section>
      </template>

      <footer class="mt-10 border-t border-kin-borde pt-4 text-sm text-kin-pardo">
        <p>Contenido educativo en validación epigráfica. Tu progreso se guarda solo en este dispositivo y no se envía a ningún servidor.</p>
        <div v-if="learner.alias.value" class="mt-3">
          <button v-if="!confirmReset" type="button" class="btn-ghost btn-sm" @click="confirmReset = true">Borrar mi progreso</button>
          <span v-else class="inline-flex flex-wrap items-center gap-2">
            <span class="font-bold text-kin-texto">¿Seguro? Se borrará todo tu avance.</span>
            <button type="button" class="btn-secondary btn-sm" @click="confirmReset = false">Mejor no</button>
            <button type="button" class="btn-brand btn-sm" @click="doReset">Sí, borrar</button>
          </span>
        </div>
      </footer>

      <template #fallback>
        <p class="py-16 text-center text-lg text-kin-pardo">Preparando tu libro…</p>
      </template>
    </ClientOnly>
  </BookFrame>
</template>

<script setup>
import { ref, computed } from 'vue'
import BookFrame from '~/components/book/BookFrame.vue'
import ConceptGlyph from '~/components/book/ConceptGlyph.vue'
import { useLearner } from '~/composables/useLearner'
import { CONCEPTS, UNITS, LESSONS, conceptById } from '~/lib/maya/textbook/curriculum'

useHead({ title: 'Libro interactivo · Laboratorio Maya', meta: [{ name: 'description', content: 'Aprende a leer y escribir glifos mayas con ayudas que se adaptan a ti.' }] })

const learner = useLearner()
const concepts = CONCEPTS
const units = UNITS
const nickname = ref('')
const confirmReset = ref(false)

const STATUS = {
  nueva: { text: 'Nueva', chip: 'chip-info' },
  'en-curso': { text: 'En curso', chip: 'chip-warn' },
  completada: { text: 'Completada', chip: 'chip-brand' },
  dominada: { text: 'Dominada', chip: 'chip-ok' }
}

const recommended = computed(() => learner.recommended.value)
const dueCount = computed(() => learner.due().length)
const lessonsOf = (unit) => LESSONS.filter((l) => l.unit === unit)
const pct = (id) => Math.round(learner.masteryOf(id) * 100)

// Prerrequisitos pendientes: se sugieren, nunca se bloquea el acceso
const advice = (lesson) => {
  const missing = [...new Set(lesson.concepts.flatMap((c) => learner.missing(c)))]
  return missing.map((id) => conceptById(id)?.title).filter(Boolean).join(', ')
}

const start = () => learner.rename(nickname.value.trim() || 'Escriba')
const doReset = () => {
  learner.reset()
  confirmReset.value = false
}
</script>
