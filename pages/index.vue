<template>
  <div>
    <!-- Portada -->
    <section class="border-b border-kin-borde bg-gradient-to-b from-kin-crema to-kin-crema2">
      <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <p class="chip-brand mb-4">Laboratorio de escritura maya</p>
          <h1 class="page-title !text-4xl sm:!text-5xl">Aprende, escribe y preserva los glifos mayas</h1>
          <p class="page-lead">
            Un espacio para entender cómo se escribía en maya clásico: estudia los signos, arma bloques de glifos
            y conserva siempre la diferencia entre lo que se lee en la piedra y lo que propone un editor.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/textbook" class="btn-primary">Empezar con el libro</NuxtLink>
            <NuxtLink to="/assembler" class="btn-secondary">Abrir el ensamblador</NuxtLink>
          </div>
        </div>

        <HeroGlyphs />
      </div>
    </section>

    <!-- Herramientas -->
    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="herramientas">
      <h2 id="herramientas" class="text-kin-terracota text-3xl">Herramientas</h2>
      <p class="page-lead">Cada herramienta resuelve una parte del recorrido, desde aprender un signo hasta documentarlo con rigor.</p>

      <ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="t in tools" :key="t.title" class="card-pad flex flex-col">
          <span class="chip mb-3 self-start" :class="t.chip">{{ t.status }}</span>
          <h3 class="text-kin-terracota text-xl">{{ t.title }}</h3>
          <p class="mt-2 flex-1 text-base text-kin-pardo">{{ t.text }}</p>
          <NuxtLink v-if="t.to" :to="t.to" class="btn-brand mt-5">{{ t.cta }}</NuxtLink>
          <span v-else class="mt-5 inline-flex min-h-target items-center text-sm font-semibold text-kin-pardo">{{ t.cta }}</span>
        </li>
      </ul>
    </section>

    <!-- Cómo se lee -->
    <section class="bg-white py-14" aria-labelledby="lectura">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="lectura" class="text-kin-terracota text-3xl">Cómo funciona la escritura maya</h2>
        <ol class="mt-8 grid gap-5 md:grid-cols-2">
          <li v-for="(s, i) in steps" :key="s.title" class="flex gap-4 rounded-2xl border border-kin-borde bg-kin-crema p-5">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-kin-terracota text-xl font-extrabold text-white" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3 class="text-kin-terracota text-xl">{{ s.title }}</h3>
              <p class="mt-1 text-base text-kin-texto">{{ s.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Evidencia editorial -->
    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="evidencia">
      <div class="card-pad grid gap-8 lg:grid-cols-2">
        <div>
          <h2 id="evidencia" class="text-kin-terracota text-3xl">Lo que dice la piedra y lo que propone un editor</h2>
          <p class="mt-3 text-base">
            Un signo puede estar dañado, repuesto por un editor o ser un hueco. Si una representación guarda el código
            del signo pero olvida ese estado, el mismo glifo parece distinto de lo que era la evidencia.
            El ensamblador y el traductor conservan esa información y avisan cuando algo se pierde.
          </p>
          <NuxtLink to="/assembler" class="btn-brand mt-6">Probarlo en el ensamblador</NuxtLink>
        </div>
        <ul class="space-y-3" aria-label="Estados de un signo">
          <li v-for="e in evidence" :key="e.name" class="callout flex items-start gap-3" :class="e.border">
            <svg class="mt-1 h-8 w-8 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="3" y="3" width="26" height="26" rx="4" fill="#fff" :stroke="e.stroke" stroke-width="3" :stroke-dasharray="e.dash" />
            </svg>
            <div>
              <p class="font-bold">{{ e.name }}</p>
              <p class="text-sm text-kin-pardo">{{ e.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Laboratorio Maya · Escritura maya',
  meta: [{ name: 'description', content: 'Aprende, escribe y preserva los glifos mayas con rigor sobre la evidencia editorial.' }]
})

const tools = [
  { title: 'Libro interactivo', status: 'Disponible', chip: 'chip-ok', text: 'Módulos guiados de vocales, sílabas, bloques, lectura y escritura, con ayudas que se retiran a medida que avanzas.', to: '/textbook', cta: 'Abrir el libro' },
  { title: 'Ensamblador', status: 'Disponible', chip: 'chip-ok', text: 'Arma bloques de glifos libremente, marca daño o suplidos y exporta a TEI sin perder la evidencia.', to: '/assembler', cta: 'Abrir el ensamblador' },
  { title: 'Traductor TEI', status: 'Para investigación', chip: 'chip-info', text: 'Convierte entre TEI XML y notación DSL y avisa qué información se perdería al hacerlo.', to: '/converter', cta: 'Abrir el traductor' },
  { title: 'Calendario K\'in', status: 'Pronto', chip: 'chip-warn', text: 'Tzolk\'in y Haab\' con tutoría adaptativa y sin castigo. Se construye el próximo semestre.', to: null, cta: 'En diseño' }
]

const steps = [
  { title: 'Bloques de glifos', text: 'Los glifos se organizan en bloques. Cada bloque agrupa signos que se leen juntos siguiendo un patrón de posición.' },
  { title: 'Orden de lectura', text: 'Los bloques se leen en pares de columnas, de izquierda a derecha y de arriba hacia abajo, como un zigzag descendente.' },
  { title: 'Silabogramas', text: 'Signos que representan una sílaba (consonante + vocal), como «ba», «la» o «ma». Se combinan para formar palabras.' },
  { title: 'Logogramas', text: 'Signos que representan una palabra completa. Un mismo concepto puede escribirse de varias formas.' }
]

const evidence = [
  { name: 'Legible', text: 'El signo se lee directamente en el monumento.', stroke: '#8A7358', dash: '0', border: 'border-kin-control' },
  { name: 'Dañado', text: 'Hay desgaste. Se anota el grado de daño.', stroke: '#C7650A', dash: '6 3', border: 'border-kin-ocre' },
  { name: 'Suplido', text: 'Un editor lo repuso. Es una propuesta, no una lectura directa.', stroke: '#36558F', dash: '1.5 4', border: 'border-kin-maya' },
  { name: 'Hueco', text: 'Falta el signo y no se puede reponer con certeza.', stroke: '#765E4A', dash: '5 5', border: 'border-kin-terracota' }
]
</script>
