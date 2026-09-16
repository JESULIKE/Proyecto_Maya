<template>
  <div class="min-h-screen bg-stone-50">
    <div class="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

      <!-- Título de la página -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-amber-900 font-maya">
          Compositor de Glifos
        </h1>
        <p class="mt-2 text-amber-700 text-sm">
          Escribe una transcripción en latín maya y visualiza su glifo correspondiente.
        </p>
      </header>

      <!-- ==================== ZONA 1: Área de escritura + Autocomplete ==================== -->
      <section class="bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span class="bg-amber-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
          Área de Escritura
        </h2>

        <!-- Input principal con ghost text -->
        <div class="relative" ref="inputContainerRef">
          <!-- Ghost text overlay -->
          <div
            v-if="ghostText && input.length > 0"
            class="absolute inset-0 flex items-center px-5 py-4 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <span class="text-xl font-mono text-transparent select-none whitespace-pre">{{ input }}</span>
            <span class="text-xl font-mono text-amber-400/50 whitespace-pre">{{ ghostText }}</span>
          </div>

          <!-- Input real -->
          <input
            ref="inputRef"
            v-model="input"
            type="text"
            :placeholder="inputPlaceholder"
            class="relative w-full px-5 py-4 text-xl font-mono bg-transparent border-2 border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-stone-400 z-10"
            :class="ghostText ? 'text-stone-900' : 'text-stone-900'"
            autocomplete="off"
            spellcheck="false"
            @keydown="handleKeydown"
            @input="onInput"
          />
          <!-- Botón limpiar -->
          <button
            v-if="input.length > 0"
            @click="clear"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors z-20"
            title="Limpiar (Escape)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Dropdown de autocomplete -->
          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="showDropdown"
              class="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden z-30"
            >
              <!-- Predicción principal (ghost) -->
              <button
                v-if="ghostText && ghostSuggestion"
                @click="acceptGhost"
                class="w-full text-left px-4 py-3 border-b border-stone-100 hover:bg-amber-50 transition-colors flex items-center gap-3 focus:outline-none focus:bg-amber-50"
              >
                <span class="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded shrink-0">Tab</span>
                <span class="font-mono text-base text-stone-900 truncate">
                  {{ input }}<span class="text-amber-600 font-semibold">{{ ghostText }}</span>
                </span>
              </button>

              <!-- Lista de sugerencias -->
              <button
                v-for="(sug, i) in dropdownSuggestions"
                :key="sug.transcription"
                @click="acceptSuggestion(sug)"
                class="w-full text-left px-4 py-2.5 hover:bg-amber-50 transition-colors flex items-center justify-between gap-3 border-b border-stone-50 last:border-0 focus:outline-none focus:bg-amber-50"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="font-mono text-sm text-stone-800 truncate">{{ sug.transcription }}</span>
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                    :class="matchTypeClass(sug.matchType)"
                  >
                    {{ matchTypeLabel(sug.matchType) }}
                  </span>
                </div>
                <span class="text-[11px] text-stone-400 shrink-0">{{ sug.segments.join(' · ') }}</span>
              </button>

              <!-- Hint -->
              <div class="px-4 py-1.5 bg-stone-50 text-[11px] text-stone-400 flex items-center gap-3">
                <span><kbd class="font-mono bg-stone-200 px-1 rounded">Tab</kbd> completar</span>
                <span><kbd class="font-mono bg-stone-200 px-1 rounded">→</kbd> siguiente sílaba</span>
                <span><kbd class="font-mono bg-stone-200 px-1 rounded">Enter</kbd> aceptar</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- Chips de segmentos parseados -->
        <div v-if="parsed.segments.length > 0" class="mt-4 flex flex-wrap gap-2 items-center">
          <span
            v-for="(seg, i) in parsed.segments"
            :key="i"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors"
            :class="isSegmentInWord(seg, i)
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-stone-100 border-stone-200 text-stone-600'"
          >
            {{ seg }}
          </span>
          <!-- Indicador del segmento actual (si se está escribiendo) -->
          <span
            v-if="currentSegment && !input.endsWith('-')"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-amber-400 text-amber-700 bg-amber-50"
          >
            {{ currentSegment }}<span class="animate-pulse ml-0.5">|</span>
          </span>
        </div>

        <!-- Estado de transcripción -->
        <p class="mt-3 text-xs text-stone-500">
          <span v-if="displayState === 'empty'">
            Escribe para comenzar. Usa <code class="bg-stone-100 px-1 rounded">-</code> para separar segmentos (ej: <code class="bg-stone-100 px-1 rounded">k'al-aw-tuun</code>).
          </span>
          <span v-else-if="displayState === 'matched'" class="text-amber-700 font-medium">
            Transcripción reconocida: {{ interpretedTranscription }}
          </span>
          <span v-else-if="displayState === 'partial'">
            Predicción disponible — presiona <kbd class="font-mono bg-stone-100 px-1 rounded">Tab</kbd> para autocompletar.
          </span>
          <span v-else>
            Escribiendo… usa <code class="bg-stone-100 px-1 rounded">-</code> para separar segmentos.
          </span>
        </p>
      </section>

      <!-- ==================== ZONA 2: Glifo visualizado ==================== -->
      <section
        v-if="matchedWord"
        class="bg-white rounded-xl shadow-sm border border-amber-200 p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span class="bg-amber-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
          Glifo — {{ matchedWord.transcription }}
        </h2>

        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Imagen del glifo -->
          <div class="flex-shrink-0 w-full md:w-80">
            <div class="bg-stone-50 rounded-lg border border-stone-200 p-4 flex items-center justify-center" style="min-height: 300px;">
              <img
                :src="matchedWord.glyphPath"
                :alt="'Glifo ' + matchedWord.transcription"
                class="max-w-full max-h-72 object-contain"
                @error="onImageError"
              />
            </div>
            <p v-if="imageLoadError" class="mt-2 text-xs text-red-600 text-center">
              Imagen no disponible: {{ matchedWord.glyphPath }}
            </p>
          </div>

          <!-- Info del glifo -->
          <div class="flex-1 min-w-0">
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="font-medium text-stone-500">Transcripción</dt>
                <dd class="font-mono text-lg text-stone-900 mt-1">{{ matchedWord.transcription }}</dd>
              </div>
              <div>
                <dt class="font-medium text-stone-500">Segmentos</dt>
                <dd class="flex flex-wrap gap-1.5 mt-1">
                  <span
                    v-for="seg in matchedWord.segments"
                    :key="seg"
                    class="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded text-sm font-medium"
                  >
                    {{ seg }}
                  </span>
                </dd>
              </div>
              <div v-if="matchedWord.metadata">
                <div v-if="matchedWord.metadata.meaning">
                  <dt class="font-medium text-stone-500">Significado</dt>
                  <dd class="text-stone-800 mt-1">{{ matchedWord.metadata.meaning }}</dd>
                </div>
                <div v-if="matchedWord.metadata.language" class="mt-2">
                  <dt class="font-medium text-stone-500">Lengua</dt>
                  <dd class="text-stone-800 mt-1">{{ matchedWord.metadata.language }}</dd>
                </div>
                <div v-if="matchedWord.metadata.notes" class="mt-2">
                  <dt class="font-medium text-stone-500">Notas</dt>
                  <dd class="text-stone-600 mt-1 text-xs leading-relaxed">{{ matchedWord.metadata.notes }}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- ==================== Estado vacío ==================== -->
      <section
        v-if="displayState === 'empty'"
        class="bg-white rounded-xl shadow-sm border border-stone-200 p-8"
      >
        <div class="text-center max-w-md mx-auto">
          <div class="text-5xl mb-4"> Maya</div>
          <h3 class="text-lg font-semibold text-stone-800 mb-2">Escribe tu primera transcripción</h3>
          <p class="text-stone-500 text-sm leading-relaxed mb-6">
            El compositor convierte transcripciones en latín maya a sus glifos correspondientes.
            Escribe segmentos separados por guiones, por ejemplo:
          </p>
          <div class="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <code class="font-mono text-amber-800 text-base">k'al-aw-tuun</code>
            <p class="text-xs text-stone-400 mt-2">Press Enter o haz clic en una sugerencia para ver el glifo</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTranscription } from '~/composables/useTranscription.js'

const {
  input,
  parsed,
  currentSegment,
  completedSegments,
  suggestions,
  matchedWord,
  displayState,
  interpretedTranscription,
  ghostText,
  ghostFullText,
  ghostSuggestion,
  clear,
  acceptSuggestion: acceptFromEngine,
  acceptGhost: acceptGhostFromEngine,
  handleKeydown: engineKeydown,
} = useTranscription()

const inputRef = ref(null)
const inputContainerRef = ref(null)
const imageLoadError = ref(false)
const isDropdownOpen = ref(false)

const inputPlaceholder = 'Ej: k\'al-aw-tuun'

// Show dropdown when there are suggestions and input is not empty and not matched
const showDropdown = computed(() => {
  return isDropdownOpen.value
    && input.value.length > 0
    && displayState.value !== 'matched'
    && suggestions.value.length > 0
})

// Suggestions for the dropdown (exclude the exact match ghost, show up to 4)
const dropdownSuggestions = computed(() => {
  const all = suggestions.value
  // If ghost is active, filter out the ghost suggestion from the list
  if (ghostText.value && ghostSuggestion.value) {
    return all.filter(s => s.transcription !== ghostSuggestion.value.transcription).slice(0, 4)
  }
  return all.slice(0, 5)
})

// ---------- Event handlers ----------

function acceptSuggestion(sug) {
  imageLoadError.value = false
  acceptFromEngine(sug)
  closeDropdown()
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
  })
}

function acceptGhost() {
  imageLoadError.value = false
  acceptGhostFromEngine()
  closeDropdown()
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
  })
}

function handleKeydown(event) {
  imageLoadError.value = false

  // Close dropdown on Escape (handled by engine, but close here too)
  if (event.key === 'Escape') {
    closeDropdown()
  }

  engineKeydown(event)
}

function onInput() {
  isDropdownOpen.value = true
}

function closeDropdown() {
  isDropdownOpen.value = false
}

// Close dropdown when clicking outside
function onClickOutside(event) {
  if (inputContainerRef.value && !inputContainerRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  // Open dropdown on focus
  if (inputRef.value) {
    inputRef.value.addEventListener('focus', () => {
      if (input.value.length > 0 && displayState.value !== 'matched') {
        isDropdownOpen.value = true
      }
    })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true)
})

function onImageError() {
  imageLoadError.value = true
}

function isSegmentInWord(seg, index) {
  if (!matchedWord.value) return false
  return matchedWord.value.segments[index]?.toLowerCase() === seg.toLowerCase()
}

function matchTypeClass(type) {
  switch (type) {
    case 'exact':        return 'bg-green-100 text-green-800'
    case 'prefix':       return 'bg-blue-100 text-blue-800'
    case 'continuation': return 'bg-amber-100 text-amber-800'
    case 'possible':     return 'bg-stone-100 text-stone-600'
    default:             return 'bg-stone-100 text-stone-600'
  }
}

function matchTypeLabel(type) {
  switch (type) {
    case 'exact':        return 'exacta'
    case 'prefix':       return 'prefijo'
    case 'continuation': return 'continuación'
    case 'possible':     return 'posible'
    default:             return type
  }
}

useHead({
  title: 'Compositor de Glifos — Escritura Maya',
  meta: [
    { name: 'description', content: 'Escribe transcripciones mayas y visualiza sus glifos correspondientes.' }
  ]
})
</script>
