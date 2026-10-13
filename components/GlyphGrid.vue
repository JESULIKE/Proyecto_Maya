<template>
  <div class="rounded-2xl bg-kin-crema2 p-4">
    <!-- Barra superior: ayuda y deshacer -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div class="flex gap-2">
        <button @click="undo" :disabled="!canUndo" title="Deshacer (Ctrl+Z)" class="btn-secondary btn-sm">↶ Deshacer</button>
        <button @click="redo" :disabled="!canRedo" title="Rehacer (Ctrl+Y)" class="btn-secondary btn-sm">↷ Rehacer</button>
      </div>
      <div class="flex gap-2">
        <button @click="loadExample" class="btn-secondary btn-sm">✨ Cargar ejemplo</button>
        <button @click="startTutorial" class="btn-brand btn-sm">❓ Cómo se usa</button>
      </div>
    </div>

    <!-- Tutorial interactivo -->
    <div v-if="tutorialStep !== null" class="mb-3 p-4 bg-white border-2 border-amber-500 rounded-lg shadow">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold text-amber-700 mb-1">Paso {{ tutorialStep + 1 }} de {{ tutorialSteps.length }}</p>
          <h4 class="font-bold text-gray-800">{{ tutorialSteps[tutorialStep].title }}</h4>
          <p class="text-sm text-gray-700 mt-1">{{ tutorialSteps[tutorialStep].text }}</p>
          <p v-if="tutorialSteps[tutorialStep].done()" class="text-sm text-green-700 font-medium mt-2">✓ ¡Listo! Pasa al siguiente paso.</p>
        </div>
        <button @click="closeTutorial" class="text-gray-400 hover:text-gray-700 text-xl leading-none" aria-label="Cerrar tutorial">×</button>
      </div>
      <div class="flex justify-between items-center mt-3">
        <button @click="tutorialStep = Math.max(0, tutorialStep - 1)" :disabled="tutorialStep === 0" class="btn-secondary btn-sm">← Anterior</button>
        <div class="flex gap-1">
          <span v-for="(s, i) in tutorialSteps" :key="i" class="w-2 h-2 rounded-full" :class="i === tutorialStep ? 'bg-amber-600' : 'bg-gray-300'"></span>
        </div>
        <button v-if="tutorialStep < tutorialSteps.length - 1" @click="tutorialStep++" class="btn-brand btn-sm">Siguiente →</button>
        <button v-else @click="closeTutorial" class="btn-primary btn-sm">Terminar</button>
      </div>
    </div>

    <!-- Lienzo SVG -->
    <div class="mb-4">
      <div class="w-full aspect-[5/4] bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden relative">
        <svg
          class="w-full h-full cursor-default select-none"
          style="touch-action: none"
          :viewBox="`0 0 ${CANVAS.w} ${CANVAS.h}`"
          preserveAspectRatio="xMidYMid meet"
          ref="svgElement"
          data-drop-zone="0"
          @dragover.prevent
          @drop="onDrop"
          @pointerdown="deselectGlyph"
        >
          <defs>
            <pattern id="guide-pattern" :width="GUIDE" :height="GUIDE" patternUnits="userSpaceOnUse" :x="FRAME.x" :y="FRAME.y">
              <path :d="`M ${GUIDE} 0 L 0 0 0 ${GUIDE}`" fill="none" stroke="#C9B79A" stroke-width="1" />
            </pattern>
          </defs>

          <!-- Zona de guardado (marco) -->
          <rect :x="FRAME.x" :y="FRAME.y" :width="FRAME.w" :height="FRAME.h" fill="#FFF8E8" />
          <rect v-if="showGuides" :x="FRAME.x" :y="FRAME.y" :width="FRAME.w" :height="FRAME.h" fill="url(#guide-pattern)" class="pointer-events-none" />

          <!-- Glifos (ordenados por capa) -->
          <g v-for="glyph in layered" :key="glyph.id" :transform="rotationOf(glyph)">
            <rect
              v-if="glyph.kind === 'gap'"
              :x="glyph.x" :y="glyph.y" :width="glyph.width" :height="glyph.height"
              fill="#ffffff" fill-opacity="0.6" stroke="#765E4A" stroke-width="2" stroke-dasharray="8,6"
              @pointerdown.stop="startDrag(glyph, $event)"
            />
            <text
              v-if="glyph.kind === 'gap'"
              :x="glyph.x + glyph.width / 2" :y="glyph.y + glyph.height / 2 + 6"
              text-anchor="middle" font-size="22" fill="#765E4A" class="pointer-events-none"
            >hueco</text>
            <g v-else-if="!glyph.src" @pointerdown.stop="startDrag(glyph, $event)" class="cursor-grab">
              <rect :x="glyph.x" :y="glyph.y" :width="glyph.width" :height="glyph.height" fill="#fff" stroke="#8A7358" stroke-width="2" stroke-dasharray="4,4" />
              <text :x="glyph.x + glyph.width / 2" :y="glyph.y + glyph.height / 2 + 7" text-anchor="middle" font-size="22" fill="#3B2A20" class="pointer-events-none">{{ glyph.syllable || '?' }}</text>
            </g>
            <image
              v-else
              :href="glyph.src"
              :x="glyph.x" :y="glyph.y" :width="glyph.width" :height="glyph.height"
              preserveAspectRatio="xMidYMid meet"
              :opacity="glyph.evidence === 'damaged' ? 0.7 : 1"
              class="cursor-grab"
              @pointerdown.stop="startDrag(glyph, $event)"
            />
            <!-- Marca de evidencia editorial -->
            <rect
              v-if="glyph.evidence === 'damaged' || glyph.evidence === 'supplied'"
              :x="glyph.x" :y="glyph.y" :width="glyph.width" :height="glyph.height"
              fill="none" stroke-width="3" class="pointer-events-none"
              :stroke="glyph.evidence === 'damaged' ? '#C7650A' : '#36558F'"
              :stroke-dasharray="glyph.evidence === 'damaged' ? '10,5' : '2,5'"
            />
          </g>

          <!-- Todo lo que cae fuera del marco se atenúa -->
          <path
            :d="`M0 0 H${CANVAS.w} V${CANVAS.h} H0 Z M${FRAME.x} ${FRAME.y} V${FRAME.y + FRAME.h} H${FRAME.x + FRAME.w} V${FRAME.y} Z`"
            fill="#3B2A20" fill-opacity="0.35" fill-rule="evenodd" class="pointer-events-none"
          />
          <rect :x="FRAME.x" :y="FRAME.y" :width="FRAME.w" :height="FRAME.h" fill="none" stroke="#8B3E0F" stroke-width="3" class="pointer-events-none" />
          <text :x="FRAME.x" :y="FRAME.y - 12" font-size="20" fill="#8B3E0F" font-weight="bold" class="pointer-events-none">
            Marco del glifo: solo se guarda lo de adentro
          </text>

          <!-- Selección y controles (giran junto al glifo) -->
          <g v-if="selectedGlyph" :transform="rotationOf(selectedGlyph)">
            <rect
              :x="selectedGlyph.x - 3" :y="selectedGlyph.y - 3" :width="selectedGlyph.width + 6" :height="selectedGlyph.height + 6"
              fill="none" stroke="#36558F" stroke-width="2" stroke-dasharray="6,4" class="pointer-events-none"
            />
            <line
              :x1="selectedGlyph.x + selectedGlyph.width / 2" :y1="selectedGlyph.y - 3"
              :x2="selectedGlyph.x + selectedGlyph.width / 2" :y2="selectedGlyph.y - 34"
              stroke="#36558F" stroke-width="2" class="pointer-events-none"
            />
            <circle
              :cx="selectedGlyph.x + selectedGlyph.width / 2" :cy="selectedGlyph.y - 42" r="13"
              fill="#1F7A4D" stroke="white" stroke-width="3" class="cursor-grab"
              @pointerdown.stop="startRotate(selectedGlyph, $event)"
            >
              <title>Arrastra para girar</title>
            </circle>
            <rect
              :x="selectedGlyph.x + selectedGlyph.width - 12" :y="selectedGlyph.y + selectedGlyph.height - 12"
              width="24" height="24" rx="4" fill="#36558F" stroke="white" stroke-width="3" class="cursor-nwse-resize"
              @pointerdown.stop="startResize(selectedGlyph, $event)"
            >
              <title>Arrastra para cambiar el tamaño</title>
            </rect>
          </g>

          <!-- Lienzo vacío -->
          <g v-if="!glyphs.length" class="pointer-events-none">
            <text :x="CANVAS.w / 2" :y="CANVAS.h / 2 - 8" text-anchor="middle" font-size="26" fill="#765E4A">
              Arrastra una sílaba aquí
            </text>
            <text :x="CANVAS.w / 2" :y="CANVAS.h / 2 + 26" text-anchor="middle" font-size="18" fill="#8A7358">
              o pulsa «Cargar ejemplo»
            </text>
          </g>
        </svg>
      </div>
      <p class="text-xs text-gray-600 mt-1">
        Puedes superponer glifos: el que está encima tapa un poco al de abajo, como en la escritura maya real.
      </p>
    </div>

    <div class="mb-4 space-y-4">
      <!-- Opciones del lienzo -->
      <div class="p-3 bg-white rounded-lg border-2 border-amber-300 flex flex-wrap gap-4 items-center">
        <label class="flex items-center">
          <input type="checkbox" v-model="showGuides" class="mr-2" />
          <span class="text-sm">Mostrar guías</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="snapToGuides" class="mr-2" />
          <span class="text-sm">Ajustar a las guías</span>
        </label>
        <button @click="addGap" class="btn-secondary btn-sm ml-auto" title="Marca un espacio donde el glifo está perdido o ilegible">＋ Añadir hueco</button>
      </div>

      <!-- Panel del glifo seleccionado -->
      <div v-if="selectedGlyph" class="p-3 bg-white rounded-lg border-2 border-blue-300 space-y-3">
        <h4 class="text-md font-medium text-gray-700">
          Glifo seleccionado: <span class="font-bold">{{ selectedGlyph.kind === 'gap' ? 'hueco' : selectedGlyph.syllable }}</span>
        </h4>
        <div class="flex flex-wrap gap-2">
          <button @click="rotateBy(-90)" class="btn-secondary btn-sm">⟲ Girar 90°</button>
          <button @click="rotateBy(90)" class="btn-secondary btn-sm">⟳ Girar 90°</button>
          <button @click="bringForward" :disabled="isAtFront" class="btn-secondary btn-sm">Traer adelante</button>
          <button @click="sendBackward" :disabled="isAtBack" class="btn-secondary btn-sm">Enviar atrás</button>
          <button @click="deleteSelectedGlyph" class="btn btn-sm border-2 border-kin-ocre bg-orange-50 text-orange-900 hover:bg-orange-100">Eliminar</button>
        </div>
        <div v-if="selectedGlyph.kind !== 'gap'" class="border-t pt-3">
          <p class="text-sm font-medium text-gray-700 mb-1">Estado del signo en la inscripción</p>
          <div class="flex flex-wrap gap-4 text-sm">
            <label class="flex items-center gap-1"><input type="radio" value="normal" :checked="selectedGlyph.evidence === 'normal'" @change="setEvidence('normal')" /> Legible</label>
            <label class="flex items-center gap-1"><input type="radio" value="damaged" :checked="selectedGlyph.evidence === 'damaged'" @change="setEvidence('damaged')" /> <span class="font-semibold text-orange-800">Dañado</span></label>
            <label class="flex items-center gap-1"><input type="radio" value="supplied" :checked="selectedGlyph.evidence === 'supplied'" @change="setEvidence('supplied')" /> <span class="text-blue-700">Suplido por el editor</span></label>
          </div>
          <label v-if="selectedGlyph.evidence === 'damaged'" class="flex items-center gap-2 text-sm mt-2">
            Grado de daño:
            <select :value="selectedGlyph.damageDegree" @change="setDamageDegree(Number($event.target.value))" class="border rounded px-2 py-1">
              <option :value="0.25">Leve (0.25)</option>
              <option :value="0.5">Medio (0.5)</option>
              <option :value="0.75">Fuerte (0.75)</option>
              <option :value="1">Casi perdido (1)</option>
            </select>
          </label>
          <p class="text-xs text-gray-500 mt-2">
            Esto se guarda con el glifo para no perder la diferencia entre lo que se lee en la piedra y lo que un editor reconstruyó.
          </p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex flex-wrap gap-2">
        <button @click="clearGrid" :disabled="!glyphs.length" class="btn border-2 border-kin-ocre bg-orange-50 text-orange-900 hover:bg-orange-100">
          Limpiar lienzo
        </button>
        <button
          @click="saveGlyph"
          :disabled="!insideGlyphs.length"
          class="btn-primary"
        >
          Guardar glifo
        </button>
      </div>
    </div>

    <!-- Estado -->
    <div class="space-y-1">
      <p class="text-gray-800">
        Palabra formada:
        <span class="font-semibold">{{ formedWord }}</span>
      </p>
      <p class="text-sm text-gray-600">
        Dentro del marco: {{ insideGlyphs.length }}
        <span v-if="outsideCount" class="text-amber-700 font-medium"> · {{ outsideCount }} fuera del marco (no se guardará{{ outsideCount > 1 ? 'n' : '' }})</span>
      </p>
      <p v-if="message" role="status" :class="messageIsError ? 'alert-warn' : 'alert-ok'">
        <span aria-hidden="true" class="font-bold">{{ messageIsError ? '!' : '✓' }}</span>
        <span>{{ message }}</span>
      </p>
    </div>

    <TEIPanel
      :glyphs="insideGlyphs"
      :source="teiSource"
      :excluded="excludedSourceCount"
      @import="importFromTEI"
      @reset-source="teiSource = null"
    />

    <!-- Atajos -->
    <details class="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
      <summary class="font-medium cursor-pointer">Atajos y consejos</summary>
      <ul class="space-y-1 text-xs mt-2">
        <li>• Arrastra el glifo para moverlo; el cuadro azul cambia el tamaño y el círculo verde lo gira.</li>
        <li>• El tamaño conserva las proporciones; mantén Shift para estirarlo libremente.</li>
        <li>• El giro va de 15° en 15°; mantén Shift para girar libre.</li>
        <li>• Flechas: mover (Shift = más rápido) · Supr: eliminar · Ctrl+Z / Ctrl+Y: deshacer / rehacer.</li>
        <li>• Lo que quede fuera del marco no se guarda; lo que lo cruce se recorta.</li>
      </ul>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import syllablesData from '~/data/syllables.json'
import TEIPanel from '~/components/TEIPanel.vue'
import { exportXML } from '~/lib/maya/tei/blockModel'

const emit = defineEmits(['save-glyph'])

// Lienzo más grande que el marco; solo el marco se guarda
const CANVAS = { w: 900, h: 720 }
const FRAME = { x: 170, y: 90, w: 560, h: 560 }
const GUIDE = 20
const MIN_SIZE = 24
const MAX_SIZE = FRAME.w * 1.5
const HISTORY_LIMIT = 60

// Estado principal
const glyphs = ref([])
const selectedGlyphId = ref(null)
const svgElement = ref(null)
const message = ref('')
const messageIsError = ref(false)
let glyphIdCounter = 0
let messageTimer = null

// Bloque TEI importado (árbol completo): complemento de la fuente
const teiSource = ref(null)

const showGuides = ref(true)
const snapToGuides = ref(false)

// Interacción
const interaction = ref(null) // { type, id, ... }

// Historial
const undoStack = ref([])
const redoStack = ref([])
const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)

// ---------- Utilidades ----------
const flash = (text, isError = false) => {
  message.value = text
  messageIsError.value = isError
  clearTimeout(messageTimer)
  messageTimer = setTimeout(() => { message.value = '' }, 3500)
}

const getSVGCoordinates = (clientX, clientY) => {
  const svg = svgElement.value
  if (!svg) return { x: 0, y: 0 }
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const p = pt.matrixTransform(svg.getScreenCTM().inverse())
  return { x: p.x, y: p.y }
}

const snap = (v) => (snapToGuides.value ? Math.round(v / GUIDE) * GUIDE : v)
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const normAngle = (a) => {
  let r = ((a % 360) + 540) % 360 - 180
  return r === -180 ? 180 : r
}
const rotationOf = (g) => `rotate(${g.rotation || 0} ${g.x + g.width / 2} ${g.y + g.height / 2})`
const centerOf = (g) => ({ x: g.x + g.width / 2, y: g.y + g.height / 2 })

// Caja envolvente del glifo ya girado
const bounds = (g) => {
  const c = centerOf(g)
  const a = ((g.rotation || 0) * Math.PI) / 180
  const cos = Math.abs(Math.cos(a))
  const sin = Math.abs(Math.sin(a))
  const w = g.width * cos + g.height * sin
  const h = g.width * sin + g.height * cos
  return { x0: c.x - w / 2, y0: c.y - h / 2, x1: c.x + w / 2, y1: c.y + h / 2 }
}

const isInsideFrame = (g) => {
  const b = bounds(g)
  return b.x1 > FRAME.x && b.x0 < FRAME.x + FRAME.w && b.y1 > FRAME.y && b.y0 < FRAME.y + FRAME.h
}

// ---------- Computadas ----------
const selectedGlyph = computed(() => glyphs.value.find((g) => g.id === selectedGlyphId.value) || null)
const layered = computed(() => [...glyphs.value].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)))
const insideGlyphs = computed(() => glyphs.value.filter(isInsideFrame))
const outsideCount = computed(() => glyphs.value.length - insideGlyphs.value.length)
const excludedSourceCount = computed(() => glyphs.value.filter((g) => (g.sourceId || g.sourceGapIndex != null) && !isInsideFrame(g)).length)

const formedWord = computed(() => {
  const sorted = [...insideGlyphs.value].sort((a, b) => {
    const yDiff = a.y - b.y
    if (Math.abs(yDiff) > 50) return yDiff
    return a.x - b.x
  })
  return sorted.map((g) => (g.kind === 'gap' ? '[…]' : g.syllable)).join('')
})

const isAtFront = computed(() => {
  if (!selectedGlyph.value) return true
  return (selectedGlyph.value.zIndex || 0) >= Math.max(...glyphs.value.map((g) => g.zIndex || 0))
})
const isAtBack = computed(() => {
  if (!selectedGlyph.value) return true
  return (selectedGlyph.value.zIndex || 0) <= Math.min(...glyphs.value.map((g) => g.zIndex || 0))
})

// ---------- Historial ----------
const snapshot = () => JSON.stringify({ glyphs: glyphs.value, source: teiSource.value })
const pushHistory = () => {
  undoStack.value.push(snapshot())
  if (undoStack.value.length > HISTORY_LIMIT) undoStack.value.shift()
  redoStack.value = []
}
const restore = (json) => {
  const state = JSON.parse(json)
  glyphs.value = state.glyphs
  teiSource.value = state.source
  if (!glyphs.value.some((g) => g.id === selectedGlyphId.value)) selectedGlyphId.value = null
}
const undo = () => {
  if (!canUndo.value) return
  redoStack.value.push(snapshot())
  restore(undoStack.value.pop())
}
const redo = () => {
  if (!canRedo.value) return
  undoStack.value.push(snapshot())
  restore(redoStack.value.pop())
}

// ---------- Glifos ----------
const nextZ = () => (glyphs.value.length ? Math.max(...glyphs.value.map((g) => g.zIndex || 0)) + 1 : 0)

const addGlyph = (data) => {
  pushHistory()
  const g = {
    id: ++glyphIdCounter,
    kind: data.kind || 'glyph',
    syllable: data.syllable || '',
    src: data.src || data.image || '',
    x: data.x,
    y: data.y,
    width: data.width,
    height: data.height,
    rotation: data.rotation || 0,
    zIndex: nextZ(),
    evidence: data.evidence || 'normal',
    damageDegree: data.damageDegree ?? 0.5
  }
  glyphs.value.push(g)
  selectedGlyphId.value = g.id
  return g
}

const patchGlyph = (id, patch) => {
  const i = glyphs.value.findIndex((g) => g.id === id)
  if (i !== -1) glyphs.value[i] = { ...glyphs.value[i], ...patch }
}

const selectGlyph = (g) => { selectedGlyphId.value = g.id }
const deselectGlyph = () => { selectedGlyphId.value = null }

const deleteSelectedGlyph = () => {
  if (!selectedGlyph.value) return
  pushHistory()
  glyphs.value = glyphs.value.filter((g) => g.id !== selectedGlyphId.value)
  selectedGlyphId.value = null
}

const clearGrid = () => {
  if (!glyphs.value.length) return
  pushHistory()
  glyphs.value = []
  teiSource.value = null
  selectedGlyphId.value = null
}

const bringForward = () => {
  if (!selectedGlyph.value) return
  pushHistory()
  patchGlyph(selectedGlyph.value.id, { zIndex: nextZ() })
}
const sendBackward = () => {
  if (!selectedGlyph.value) return
  pushHistory()
  patchGlyph(selectedGlyph.value.id, { zIndex: Math.min(...glyphs.value.map((g) => g.zIndex || 0)) - 1 })
}

const rotateBy = (deg) => {
  if (!selectedGlyph.value) return
  pushHistory()
  patchGlyph(selectedGlyph.value.id, { rotation: normAngle((selectedGlyph.value.rotation || 0) + deg) })
}

const setEvidence = (evidence) => {
  if (!selectedGlyph.value) return
  pushHistory()
  patchGlyph(selectedGlyph.value.id, { evidence })
}
const setDamageDegree = (damageDegree) => {
  if (!selectedGlyph.value) return
  pushHistory()
  patchGlyph(selectedGlyph.value.id, { damageDegree })
}

const addGap = () => {
  addGlyph({
    kind: 'gap',
    x: FRAME.x + FRAME.w / 2 - 50,
    y: FRAME.y + FRAME.h / 2 - 50,
    width: 100,
    height: 100
  })
}

// ---------- Mover ----------
const startInteraction = (type, glyph, event, extra = {}) => {
  if (interaction.value) return
  event.preventDefault()
  selectGlyph(glyph)
  pushHistory()
  interaction.value = { type, id: glyph.id, ...extra }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopInteraction)
  window.addEventListener('pointercancel', stopInteraction)
}

const startDrag = (glyph, event) => {
  const p = getSVGCoordinates(event.clientX, event.clientY)
  startInteraction('drag', glyph, event, { dx: p.x - glyph.x, dy: p.y - glyph.y })
}
const startResize = (glyph, event) => {
  startInteraction('resize', glyph, event, { aspect: glyph.width / glyph.height })
}
const startRotate = (glyph, event) => {
  startInteraction('rotate', glyph, event)
}

const onPointerMove = (event) => {
  const it = interaction.value
  if (!it) return
  const g = glyphs.value.find((x) => x.id === it.id)
  if (!g) return
  const p = getSVGCoordinates(event.clientX, event.clientY)

  if (it.type === 'drag') {
    // El centro nunca sale del lienzo
    const x = clamp(p.x - it.dx, -g.width / 2, CANVAS.w - g.width / 2)
    const y = clamp(p.y - it.dy, -g.height / 2, CANVAS.h - g.height / 2)
    patchGlyph(g.id, { x: snap(x), y: snap(y) })
  } else if (it.type === 'resize') {
    // Se mide en el marco del glifo (ya girado) y desde su centro
    const c = centerOf(g)
    const a = (-(g.rotation || 0) * Math.PI) / 180
    const vx = p.x - c.x
    const vy = p.y - c.y
    const lx = vx * Math.cos(a) - vy * Math.sin(a)
    const ly = vx * Math.sin(a) + vy * Math.cos(a)
    let w = Math.max(MIN_SIZE, 2 * lx)
    let h = Math.max(MIN_SIZE, 2 * ly)
    if (!event.shiftKey) {
      const scale = Math.max(w / it.aspect, h) // mantiene proporción
      h = Math.max(MIN_SIZE, scale)
      w = Math.max(MIN_SIZE, scale * it.aspect)
    }
    w = Math.min(w, MAX_SIZE)
    h = Math.min(h, MAX_SIZE)
    patchGlyph(g.id, { width: w, height: h, x: c.x - w / 2, y: c.y - h / 2 })
  } else if (it.type === 'rotate') {
    const c = centerOf(g)
    let angle = (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI + 90
    if (!event.shiftKey) angle = Math.round(angle / 15) * 15
    patchGlyph(g.id, { rotation: normAngle(angle) })
  }
}

const stopInteraction = () => {
  interaction.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopInteraction)
  window.removeEventListener('pointercancel', stopInteraction)
}

// ---------- Guardar ----------
const saveGlyph = () => {
  if (!insideGlyphs.value.length) {
    flash('No hay glifos dentro del marco.', true)
    return
  }
  const dropped = outsideCount.value

  let tei = ''
  try { tei = exportXML(insideGlyphs.value, teiSource.value).xml } catch (e) { /* el TEI es opcional */ }

  const composed = {
    id: Date.now(),
    tei,
    word: formedWord.value,
    gridType: 'svg',
    // Lo guardado es exactamente el marco; las coordenadas son relativas a él
    frame: { width: FRAME.w, height: FRAME.h },
    glyphs: insideGlyphs.value.map((g) => ({
      kind: g.kind,
      syllable: g.syllable,
      image: g.src,
      x: g.x - FRAME.x,
      y: g.y - FRAME.y,
      width: g.width,
      height: g.height,
      rotation: g.rotation || 0,
      zIndex: g.zIndex || 0,
      evidence: g.evidence,
      damageDegree: g.evidence === 'damaged' ? g.damageDegree : undefined
    })),
    timestamp: new Date().toISOString()
  }

  emit('save-glyph', composed)
  glyphs.value = []
  teiSource.value = null
  selectedGlyphId.value = null
  undoStack.value = []
  redoStack.value = []
  flash(dropped ? `Glifo guardado. ${dropped} elemento(s) fuera del marco se descartaron.` : '¡Glifo guardado!')
}

// ---------- Soltar desde la lista ----------
const placeNew = (data, cx, cy) => {
  const size = 120
  return addGlyph({
    syllable: data.syllable,
    src: data.image,
    x: clamp(cx - size / 2, -size / 2, CANVAS.w - size / 2),
    y: clamp(cy - size / 2, -size / 2, CANVAS.h - size / 2),
    width: size,
    height: size
  })
}

const onDrop = (event) => {
  event.preventDefault()
  let data = null
  try {
    const json = event.dataTransfer.getData('application/json')
    if (json) data = JSON.parse(json)
  } catch (e) {
    console.warn('No se pudo leer el glifo arrastrado')
  }
  if (!data || !data.image) return
  const p = getSVGCoordinates(event.clientX, event.clientY)
  placeNew(data, snap(p.x), snap(p.y))
}

const handleMobileSyllableDrop = (event) => {
  const { data, point } = event.detail
  if (point) {
    const p = getSVGCoordinates(point.x, point.y)
    placeNew(data, snap(p.x), snap(p.y))
  } else {
    // Toque o teclado: se coloca en el centro del marco
    placeNew(data, FRAME.x + FRAME.w / 2, FRAME.y + FRAME.h / 2)
  }
}

// ---------- TEI ----------
const importFromTEI = ({ source, glyphs: imported }) => {
  pushHistory()
  glyphs.value = imported.map((g, i) => ({ ...g, id: ++glyphIdCounter, zIndex: i }))
  teiSource.value = source
  selectedGlyphId.value = null
  flash(`Bloque importado: ${imported.length} elemento(s). Edita la evidencia y revisa el panel TEI.`)
}

// ---------- Ejemplo ----------
const findSyllable = (name) => syllablesData.find((s) => s.syllable === name)

const loadExample = () => {
  const main = findSyllable('ba')
  const left = findSyllable('u')
  const below = findSyllable('ya')
  if (!main || !left || !below) {
    flash('No se encontraron los glifos del ejemplo.', true)
    return
  }
  pushHistory()
  glyphs.value = []
  teiSource.value = null
  const cx = FRAME.x + FRAME.w / 2
  const cy = FRAME.y + FRAME.h / 2
  const mk = (s, x, y, w, h) => ({
    id: ++glyphIdCounter, kind: 'glyph', syllable: s.syllable, src: s.image,
    x, y, width: w, height: h, rotation: 0, zIndex: glyphs.value.length, evidence: 'normal', damageDegree: 0.5
  })
  glyphs.value.push(mk(main, cx - 110, cy - 150, 260, 260))
  glyphs.value.push(mk(left, cx - 215, cy - 100, 160, 160))
  glyphs.value.push(mk(below, cx - 90, cy + 40, 200, 140))
  selectedGlyphId.value = null
  flash('Ejemplo cargado. Prueba moverlos, agrandarlos o girarlos.')
}

// ---------- Tutorial ----------
const tutorialStep = ref(null)
const tutorialSteps = [
  {
    title: 'Arrastra una sílaba',
    text: 'En la columna 1 elige una sílaba y suéltala sobre el lienzo. También puedes pulsar «Cargar ejemplo».',
    done: () => glyphs.value.length > 0
  },
  {
    title: 'Selecciona y mueve',
    text: 'Haz clic en el glifo para seleccionarlo y arrástralo. Con el cuadro azul cambias el tamaño y con el círculo verde lo giras. Puedes superponer unos sobre otros.',
    done: () => !!selectedGlyph.value
  },
  {
    title: 'Respeta el marco',
    text: 'El rectángulo ámbar es el glifo final. Solo se guarda lo que está dentro; lo que se sale se recorta o se descarta. Mira el contador «fuera del marco».',
    done: () => glyphs.value.length > 0 && outsideCount.value === 0
  },
  {
    title: 'Marca la evidencia y guarda',
    text: 'Si un signo está dañado o fue repuesto por un editor, márcalo en el panel azul. Cuando estés listo pulsa «Guardar glifo».',
    done: () => !!selectedGlyph.value && selectedGlyph.value.evidence !== 'normal'
  }
]

const TUTORIAL_KEY = 'maya-assembler-tutorial-seen'
const startTutorial = () => { tutorialStep.value = 0 }
const closeTutorial = () => {
  tutorialStep.value = null
  try { localStorage.setItem(TUTORIAL_KEY, '1') } catch (e) { /* sin almacenamiento */ }
}

// ---------- Teclado ----------
const onKeyDown = (event) => {
  const tag = event.target?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  const mod = event.ctrlKey || event.metaKey
  if (mod && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    event.shiftKey ? redo() : undo()
    return
  }
  if (mod && event.key.toLowerCase() === 'y') {
    event.preventDefault()
    redo()
    return
  }
  if (!selectedGlyph.value) return
  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault()
    deleteSelectedGlyph()
    return
  }
  const step = event.shiftKey ? 20 : 5
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
  if (moves[event.key]) {
    event.preventDefault()
    pushHistory()
    const [dx, dy] = moves[event.key]
    patchGlyph(selectedGlyph.value.id, { x: selectedGlyph.value.x + dx, y: selectedGlyph.value.y + dy })
  }
}

onMounted(() => {
  document.addEventListener('mobile-syllable-drop', handleMobileSyllableDrop)
  window.addEventListener('keydown', onKeyDown)
  let seen = false
  try { seen = localStorage.getItem(TUTORIAL_KEY) === '1' } catch (e) { /* sin almacenamiento */ }
  if (!seen) tutorialStep.value = 0
})

onUnmounted(() => {
  document.removeEventListener('mobile-syllable-drop', handleMobileSyllableDrop)
  window.removeEventListener('keydown', onKeyDown)
  stopInteraction()
  clearTimeout(messageTimer)
})
</script>

