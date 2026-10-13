<template>
  <div :class="['book-root', { 'book-spacing': prefs.spacing, 'book-contrast': prefs.contrast }]" :style="{ fontSize: `${prefs.size}%` }">
    <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <slot />
    </div>

    <!-- Preferencias de lectura -->
    <div class="fixed bottom-4 right-4 z-40">
      <button
        type="button"
        class="btn-brand shadow-kin"
        :aria-expanded="open"
        aria-controls="panel-lectura"
        @click="open = !open"
      >
        Aa Lectura
      </button>
      <div v-if="open" id="panel-lectura" class="card-pad absolute bottom-14 right-0 w-72 space-y-4" role="dialog" aria-label="Preferencias de lectura">
        <div>
          <p class="font-bold text-kin-terracota">Tamaño de letra</p>
          <div class="mt-2 flex gap-2" role="group" aria-label="Tamaño de letra">
            <button
              v-for="s in sizes"
              :key="s"
              type="button"
              class="btn-sm flex-1 rounded-lg border-2 font-bold"
              :class="prefs.size === s ? 'border-kin-terracota bg-kin-terracota text-white' : 'border-kin-control bg-white'"
              :aria-pressed="prefs.size === s"
              @click="prefs.size = s"
            >{{ s }}%</button>
          </div>
        </div>
        <label class="flex min-h-target cursor-pointer items-center gap-3">
          <input v-model="prefs.spacing" type="checkbox" class="h-5 w-5 accent-kin-terracota" />
          <span>Más espacio entre letras y líneas</span>
        </label>
        <label class="flex min-h-target cursor-pointer items-center gap-3">
          <input v-model="prefs.contrast" type="checkbox" class="h-5 w-5 accent-kin-terracota" />
          <span>Más contraste</span>
        </label>
        <label v-if="canSpeak" class="flex min-h-target cursor-pointer items-center gap-3">
          <input v-model="prefs.voice" type="checkbox" class="h-5 w-5 accent-kin-terracota" />
          <span>Leer los textos en voz alta</span>
        </label>
        <button type="button" class="btn-secondary btn-sm w-full" @click="open = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookPrefs } from '~/composables/useBookPrefs'

const { prefs, sizes, canSpeak } = useBookPrefs()
const open = ref(false)
</script>
