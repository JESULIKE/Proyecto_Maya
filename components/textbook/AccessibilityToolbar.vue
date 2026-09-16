<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
    <!-- Main toggle button -->
    <button
      @click="open = !open"
      class="w-12 h-12 rounded-full bg-amber-700 text-white shadow-lg flex items-center justify-center text-xl hover:bg-amber-800 transition-colors"
      :aria-label="acc.t('accessibility')"
      :title="acc.t('accessibility')"
    >
      ♿
    </button>

    <!-- Panel -->
    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="open" class="bg-white rounded-2xl shadow-2xl border border-amber-200 p-4 w-72">
        <h3 class="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span>♿</span> {{ acc.t('accessibility') }}
        </h3>

        <!-- Text to speech -->
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <div class="text-sm font-semibold text-gray-700">🔊 Leer en voz alta</div>
            <div class="text-xs text-gray-500">Narración de texto</div>
          </div>
          <button
            @click="acc.settings.ttsEnabled = !acc.settings.ttsEnabled"
            class="relative w-11 h-6 rounded-full transition-colors"
            :class="acc.settings.ttsEnabled ? 'bg-green-500' : 'bg-gray-300'"
            role="switch"
            :aria-checked="acc.settings.ttsEnabled"
          >
            <span class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              :class="acc.settings.ttsEnabled ? 'left-5' : 'left-0.5'"></span>
          </button>
        </div>

        <!-- TTS rate -->
        <div v-if="acc.settings.ttsEnabled" class="py-2 border-b border-gray-100">
          <div class="text-sm font-semibold text-gray-700 mb-1">Velocidad de voz</div>
          <input type="range" min="0.5" max="1.5" step="0.1" v-model.number="acc.settings.ttsRate"
            class="w-full accent-amber-600" />
        </div>

        <!-- Font size -->
        <div class="py-2 border-b border-gray-100">
          <div class="text-sm font-semibold text-gray-700 mb-1">Tamaño de letra</div>
          <div class="flex items-center gap-2">
            <button @click="changeFont(-10)" class="px-2 py-1 bg-gray-100 rounded text-sm">A-</button>
            <div class="flex-1 text-center text-sm text-gray-600">{{ acc.settings.fontSize }}%</div>
            <button @click="changeFont(10)" class="px-2 py-1 bg-gray-100 rounded text-sm">A+</button>
          </div>
        </div>

        <!-- Dyslexia mode -->
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <div class="text-sm font-semibold text-gray-700">📖 Modo dislexia</div>
            <div class="text-xs text-gray-500">Mayor espaciado y altura de línea</div>
          </div>
          <button
            @click="acc.settings.dyslexiaMode = !acc.settings.dyslexiaMode"
            class="relative w-11 h-6 rounded-full transition-colors"
            :class="acc.settings.dyslexiaMode ? 'bg-blue-500' : 'bg-gray-300'"
            role="switch"
            :aria-checked="acc.settings.dyslexiaMode"
          >
            <span class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              :class="acc.settings.dyslexiaMode ? 'left-5' : 'left-0.5'"></span>
          </button>
        </div>

        <!-- High contrast -->
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <div class="text-sm font-semibold text-gray-700">🌓 Alto contraste</div>
            <div class="text-xs text-gray-500">Mejor visibilidad</div>
          </div>
          <button
            @click="acc.settings.highContrast = !acc.settings.highContrast"
            class="relative w-11 h-6 rounded-full transition-colors"
            :class="acc.settings.highContrast ? 'bg-purple-500' : 'bg-gray-300'"
            role="switch"
            :aria-checked="acc.settings.highContrast"
          >
            <span class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              :class="acc.settings.highContrast ? 'left-5' : 'left-0.5'"></span>
          </button>
        </div>

        <!-- Language -->
        <div class="py-2">
          <div class="text-sm font-semibold text-gray-700 mb-1">🌐 Idioma</div>
          <div class="flex gap-2">
            <button @click="acc.settings.language = 'es'"
              class="flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors"
              :class="acc.settings.language === 'es' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'">
              Español
            </button>
            <button @click="acc.settings.language = 'en'"
              class="flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors"
              :class="acc.settings.language === 'en' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'">
              English
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAccessibility } from '~/composables/useAccessibility'

const acc = useAccessibility()
const open = ref(false)

function changeFont(delta) {
  acc.settings.fontSize = Math.max(80, Math.min(150, acc.settings.fontSize + delta))
}
</script>
