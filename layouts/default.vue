<template>
  <div class="flex min-h-screen flex-col">
    <a href="#contenido" class="skip-link">Saltar al contenido</a>

    <header class="sticky top-0 z-50 border-b-4 border-kin-ocre bg-amber-900 text-kin-crema shadow-kin">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Principal">
        <NuxtLink to="/" class="group flex items-center gap-3 rounded-lg" aria-label="Laboratorio Maya, ir al inicio">
          <!-- Marca: numeral maya (barra y puntos) -->
          <svg class="h-10 w-10 shrink-0" viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="9" fill="#E29A35" />
            <circle cx="14" cy="12" r="3.6" fill="#3F1B06" />
            <circle cx="26" cy="12" r="3.6" fill="#3F1B06" />
            <rect x="7" y="19" width="26" height="5.5" rx="2.7" fill="#3F1B06" />
            <rect x="7" y="27.5" width="26" height="5.5" rx="2.7" fill="#3F1B06" />
          </svg>
          <span class="leading-tight">
            <span class="block text-lg font-extrabold">Laboratorio Maya</span>
            <span class="hidden text-xs text-amber-200 sm:block">Escritura · B'alam Ajaw</span>
          </span>
        </NuxtLink>

        <ul class="hidden items-center gap-1 md:flex">
          <li v-for="item in links" :key="item.to">
            <NuxtLink :to="item.to" class="nav-link" :aria-current="isActive(item.to) ? 'page' : undefined" :class="{ 'nav-link-active': isActive(item.to) }">
              {{ item.label }}
            </NuxtLink>
          </li>
          <li>
            <span class="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-300/50 px-3 py-1 text-sm text-amber-200" title="El calendario K'in se construye el próximo semestre">
              Calendario K'in · pronto
            </span>
          </li>
        </ul>

        <button
          type="button"
          class="inline-flex min-h-target min-w-target items-center justify-center rounded-lg text-kin-crema hover:bg-amber-800 md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="menu-movil"
          :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="menuOpen = !menuOpen"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="!menuOpen" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </nav>

      <ul v-if="menuOpen" id="menu-movil" class="space-y-1 border-t border-amber-700 px-4 pb-4 pt-2 md:hidden">
        <li v-for="item in links" :key="item.to">
          <NuxtLink :to="item.to" class="nav-link block" :aria-current="isActive(item.to) ? 'page' : undefined" :class="{ 'nav-link-active': isActive(item.to) }">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </header>

    <main id="contenido" class="flex-1" tabindex="-1">
      <slot />
    </main>

    <footer class="border-t-4 border-kin-borde bg-kin-crema2 text-kin-texto">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <section>
          <h2 class="text-kin-terracota text-lg">Laboratorio Maya</h2>
          <p class="mt-2 text-base text-kin-pardo">
            Herramientas para aprender, escribir y preservar la escritura maya, con rigor sobre lo que dice la piedra y lo que
            propone un editor.
          </p>
        </section>
        <nav aria-label="Pie de página">
          <h2 class="text-kin-terracota text-lg">Explorar</h2>
          <ul class="mt-2 space-y-1 text-base">
            <li v-for="item in links" :key="item.to">
              <NuxtLink :to="item.to" class="inline-flex min-h-target items-center text-kin-maya underline underline-offset-4 hover:text-kin-terracota">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <section>
          <h2 class="text-kin-terracota text-lg">Origen</h2>
          <p class="mt-2 text-base text-kin-pardo">
            Proyecto del semillero LABSIE (grupo EDUTLAN), Universidad de Córdoba, Colombia, en colaboración con la Universidad
            de Bonn. Los datos de ejemplo del testigo TEI provienen del TWKM (CC BY 4.0).
          </p>
        </section>
      </div>
      <p class="border-t border-kin-borde py-4 text-center text-sm text-kin-pardo">
        © {{ year }} Laboratorio Maya · Versión en desarrollo ·
        <NuxtLink to="/estilo" class="underline underline-offset-4 hover:text-kin-terracota">Guía de estilo</NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const route = useRoute()
const menuOpen = ref(false)
const year = new Date().getFullYear()

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/textbook', label: 'Libro' },
  { to: '/assembler', label: 'Ensamblador' },
  { to: '/converter', label: 'Traductor' }
]

const isActive = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

// Cierra el menú móvil al navegar
watch(() => route.path, () => { menuOpen.value = false })
</script>

<style scoped>
.nav-link {
  @apply inline-flex min-h-target items-center rounded-lg px-4 py-2 font-semibold text-amber-100 transition-colors hover:bg-amber-800 hover:text-white;
}
.nav-link-active {
  @apply bg-amber-800 text-white underline decoration-kin-ambar decoration-4 underline-offset-8;
}
</style>
