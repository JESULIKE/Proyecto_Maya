<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navegación superior -->
    <nav class="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo y nombre -->
          <NuxtLink 
            to="/" 
            class="flex items-center gap-3 group"
          >
            <div class="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span class="text-2xl">📜</span>
            </div>
            <div class="hidden sm:block">
              <div class="text-white font-bold text-lg">Escritura Maya</div>
              <div class="text-amber-300 text-xs">Tz'ib'</div>
            </div>
          </NuxtLink>

          <!-- Menú de navegación desktop -->
          <div class="hidden md:flex items-center gap-2">
            <NuxtLink
              to="/"
              class="px-4 py-2 text-amber-100 hover:text-white hover:bg-amber-800 rounded-lg transition-colors font-medium"
              :class="{ 'bg-amber-800 text-white': $route.path === '/' }"
            >
              Inicio
            </NuxtLink>
            <NuxtLink
              to="/textbook"
              class="px-4 py-2 text-amber-100 hover:text-white hover:bg-amber-800 rounded-lg transition-colors font-medium"
              :class="{ 'bg-amber-800 text-white': $route.path === '/textbook' }"
            >
              📚 Libro
            </NuxtLink>
            <NuxtLink
              to="/assembler"
              class="px-4 py-2 text-amber-100 hover:text-white hover:bg-amber-800 rounded-lg transition-colors font-medium"
              :class="{ 'bg-amber-800 text-white': $route.path === '/assembler' }"
            >
              🎮 Ensamblador
            </NuxtLink>
            <NuxtLink
              to="/converter"
              class="px-4 py-2 text-amber-100 hover:text-white hover:bg-amber-800 rounded-lg transition-colors font-medium"
              :class="{ 'bg-amber-800 text-white': $route.path === '/converter' }"
            >
              📋 Traductor
            </NuxtLink>
          </div>

          <!-- Botón menú móvil -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-amber-100 hover:bg-amber-800 transition-colors"
            aria-label="Abrir menú"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú móvil desplegable -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden bg-amber-800 border-t border-amber-700">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <NuxtLink
              to="/"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-700 hover:text-white transition-colors font-medium"
              :class="{ 'bg-amber-700 text-white': $route.path === '/' }"
            >
              🏠 Inicio
            </NuxtLink>
            <NuxtLink
              to="/textbook"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-700 hover:text-white transition-colors font-medium"
              :class="{ 'bg-amber-700 text-white': $route.path === '/textbook' }"
            >
              📚 Intelligent Textbook
            </NuxtLink>
            <NuxtLink
              to="/assembler"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-700 hover:text-white transition-colors font-medium"
              :class="{ 'bg-amber-700 text-white': $route.path === '/assembler' }"
            >
              🎮 Ensamblador
            </NuxtLink>
            <NuxtLink
              to="/converter"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-700 hover:text-white transition-colors font-medium"
              :class="{ 'bg-amber-700 text-white': $route.path === '/converter' }"
            >
              📋 Traductor
            </NuxtLink>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Contenido principal -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Columna 1: Info -->
          <div>
            <h3 class="font-bold text-lg mb-3 text-amber-200">Escritura Maya</h3>
            <p class="text-amber-300 text-sm leading-relaxed">
              Una herramienta interactiva para aprender y crear con el sistema de escritura maya, 
              uno de los más sofisticados de la antigüedad.
            </p>
          </div>

          <!-- Columna 2: Enlaces rápidos -->
          <div>
            <h3 class="font-bold text-lg mb-3 text-amber-200">Enlaces Rápidos</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/" class="text-amber-300 hover:text-white transition-colors">
                  → Página Principal
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/textbook" class="text-amber-300 hover:text-white transition-colors">
                  → 📚 Intelligent Textbook
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/assembler" class="text-amber-300 hover:text-white transition-colors">
                  → 🎮 Ensamblador
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Columna 3: Sobre el proyecto -->
          <div>
            <h3 class="font-bold text-lg mb-3 text-amber-200">Acerca de</h3>
            <p class="text-amber-300 text-sm leading-relaxed">
              Proyecto educativo para preservar y difundir el conocimiento de la escritura maya 
              a través de herramientas digitales interactivas.
            </p>
          </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-amber-700 mt-8 pt-6 text-center">
          <p class="text-amber-400 text-sm">
            © {{ currentYear }} Escritura Maya. Hecho con 💛 para preservar la cultura maya.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mobileMenuOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())

// Cerrar menú móvil cuando cambia la ruta
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>