<template>
  <details class="mt-4 bg-white rounded-lg border-2 border-indigo-300" :open="open" @toggle="open = $event.target.open">
    <summary class="px-3 py-2 font-medium text-indigo-900 cursor-pointer">
      TEI y evidencia editorial
      <span v-if="source" class="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">fuente cargada</span>
    </summary>

    <div class="p-3 space-y-4 text-sm">
      <!-- Importar -->
      <section>
        <p class="font-medium text-gray-700 mb-1">1. Importar un bloque TEI (opcional)</p>
        <p class="text-xs text-gray-500 mb-2">
          Pega un <code>&lt;ab type="glyph-block"&gt;</code> o un documento completo. Se conserva el árbol original
          y al exportar solo se cambia lo que edites aquí.
        </p>
        <textarea v-model="importText" rows="4" class="w-full font-mono text-xs p-2 border rounded bg-gray-50" placeholder="<ab xml:id=&quot;Cp5&quot; type=&quot;glyph-block&quot;>…"></textarea>
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <select v-if="candidates.length > 1" v-model="chosen" class="border rounded px-2 py-1 text-xs">
            <option v-for="(b, i) in candidates" :key="i" :value="i">{{ b.label }}</option>
          </select>
          <button @click="doImport" :disabled="!importText.trim()" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">Importar al lienzo</button>
          <button v-if="source" @click="$emit('reset-source')" class="px-3 py-1 border rounded hover:bg-gray-100">Olvidar fuente</button>
        </div>
        <p v-if="importError" class="text-red-600 text-xs mt-1">{{ importError }}</p>
        <p v-if="notFound.length" class="text-amber-700 text-xs mt-1">
          Códigos sin imagen en el catálogo (se muestran como cuadro con el código): {{ notFound.join(', ') }}
        </p>
      </section>

      <!-- Exportar -->
      <section>
        <p class="font-medium text-gray-700 mb-1">2. TEI del lienzo</p>
        <p v-if="!glyphs.length" class="text-xs text-gray-500">Coloca glifos dentro del marco para generar el TEI.</p>
        <template v-else>
          <p v-if="excluded" class="text-amber-700 text-xs mb-1">
            {{ excluded }} signo(s) de la fuente están fuera del marco: no aparecerán en el TEI exportado.
          </p>
          <textarea readonly :value="exported.xml" rows="8" class="w-full font-mono text-xs p-2 border rounded bg-gray-50"></textarea>
          <div class="flex gap-2 mt-2">
            <button @click="copy" class="px-3 py-1 border rounded hover:bg-gray-100">{{ copied ? '✓ Copiado' : 'Copiar' }}</button>
            <button @click="download" class="px-3 py-1 border rounded hover:bg-gray-100">Descargar .xml</button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            La posición, el tamaño y el giro son solo visuales y no se guardan en TEI. Las relaciones
            (arriba, abajo, al lado, infijo) se infieren de la geometría.
          </p>
        </template>
      </section>

      <!-- Auditoría -->
      <section v-if="glyphs.length">
        <p class="font-medium text-gray-700 mb-1">3. ¿Se perdió algo?</p>

        <div class="p-2 rounded border" :class="selfCheck.ok ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'">
          <p class="text-xs font-medium" :class="selfCheck.ok ? 'text-green-800' : 'text-red-800'">
            {{ selfCheck.ok ? '✓' : '✗' }} Comprobación de ida y vuelta: {{ selfCheck.message }}
          </p>
        </div>

        <div v-if="source" class="mt-2">
          <p class="text-xs text-gray-600 mb-1">Comparación con la fuente importada:</p>
          <div class="flex flex-wrap gap-2 mb-2">
            <span v-for="(label, key) in levels" :key="key" class="px-2 py-1 rounded text-xs border" :class="report.verdict[key] ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-gray-100 border-gray-300 text-gray-600'" :title="label.hint">
              {{ key }} · {{ label.name }}: {{ report.verdict[key] ? 'cambió' : 'igual' }}
            </span>
          </div>
          <p v-if="report.identical" class="text-xs text-green-700">El TEI exportado es idéntico a la fuente (árbol completo).</p>
          <template v-else>
            <p v-if="report.verdict.R && !report.verdict.C" class="text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded p-2 mb-2">
              Estos cambios son invisibles para una vista de solo posición y códigos (L y C). Por eso el árbol completo (R) se conserva como complemento de la fuente.
            </p>
            <ul class="text-xs space-y-1 max-h-40 overflow-auto">
              <li v-for="(d, i) in report.diffs.slice(0, 30)" :key="i" class="font-mono"><span class="text-gray-500">{{ d.path }}</span> — {{ d.detail }}</li>
              <li v-if="report.diffs.length > 30" class="text-gray-500">… y {{ report.diffs.length - 30 }} más</li>
            </ul>
          </template>
          <p class="text-xs text-gray-500 mt-2">
            «Cambió» no significa «incorrecto»: indica que el candidato ya no es equivalente a la fuente. Decidir si el cambio es válido le corresponde a quien edita.
          </p>
        </div>
        <ul v-if="exported.warnings.length" class="mt-2 text-xs text-amber-800 list-disc pl-5">
          <li v-for="(w, i) in exported.warnings" :key="i">{{ w }}</li>
        </ul>
      </section>
    </div>
  </details>
</template>

<script setup>
import { ref, computed } from 'vue'
import { parseXML, findBlocks, localName, XML_ID } from '~/lib/maya/tei/tree'
import { compare, diffTrees, canonString } from '~/lib/maya/tei/audit'
import { importBlock, exportXML, evidenceCounts } from '~/lib/maya/tei/blockModel'
import { useMaya } from '~/composables/useMaya'

const props = defineProps({
  glyphs: { type: Array, default: () => [] },
  source: { type: Object, default: null },
  excluded: { type: Number, default: 0 }
})
const emit = defineEmits(['import', 'reset-source'])

const { getGlyphImageFromThompson } = useMaya()

const open = ref(false)
const importText = ref('')
const importError = ref('')
const notFound = ref([])
const candidates = ref([])
const chosen = ref(0)
const copied = ref(false)

const levels = {
  L: { name: 'posición', hint: 'Nodos g/seg con id, rend y corresp' },
  C: { name: 'catálogo', hint: 'L más códigos n/ref del catálogo' },
  E: { name: 'contexto editorial', hint: 'C más daño, suplido y huecos' },
  R: { name: 'árbol completo', hint: 'Todos los elementos, atributos y texto' }
}

const readCandidates = () => {
  const root = parseXML(importText.value)
  const list = localName(root.tag) === 'ab' ? [root] : findBlocks(root)
  return list.map((b, i) => ({ tree: b, label: b.attrs[XML_ID] || `bloque ${i + 1}` }))
}

const doImport = () => {
  importError.value = ''
  notFound.value = []
  try {
    candidates.value = readCandidates()
    if (!candidates.value.length) throw new Error('No se encontró ningún <ab type="glyph-block">.')
    if (chosen.value >= candidates.value.length) chosen.value = 0
    const block = candidates.value[chosen.value].tree
    const imported = importBlock(block, getGlyphImageFromThompson)
    if (!imported.length) throw new Error('El bloque no contiene signos <g> ni huecos <gap>.')
    notFound.value = imported.filter((g) => g.kind === 'glyph' && !g.src && g.syllable).map((g) => g.syllable)
    emit('import', { source: block, glyphs: imported })
  } catch (e) {
    importError.value = e.message || 'No se pudo importar el XML.'
  }
}

const exported = computed(() => {
  if (!props.glyphs.length) return { xml: '', block: null, warnings: [] }
  try {
    return exportXML(props.glyphs, props.source)
  } catch (e) {
    return { xml: '', block: null, warnings: [`No se pudo generar el TEI: ${e.message}`] }
  }
})

const report = computed(() => {
  const block = exported.value.block
  if (!props.source || !block) return { verdict: { L: false, C: false, E: false, R: false }, diffs: [], identical: true }
  const verdict = compare(props.source, block)
  return { verdict, diffs: diffTrees(props.source, block), identical: !verdict.R }
})

// Comprobación propia: lo exportado se puede volver a leer sin pérdida y trae la misma evidencia que el lienzo
const selfCheck = computed(() => {
  const block = exported.value.block
  if (!block) return { ok: false, message: 'no hay TEI que comprobar.' }
  try {
    const again = parseXML(exported.value.xml)
    if (canonString(again) !== canonString(block)) return { ok: false, message: 'el XML exportado no coincide al volver a leerlo.' }
    const counts = evidenceCounts(again)
    const canvas = {
      damage: props.glyphs.filter((g) => g.kind !== 'gap' && g.evidence === 'damaged').length,
      supplied: props.glyphs.filter((g) => g.kind !== 'gap' && g.evidence === 'supplied').length
    }
    if (!props.source && (counts.damage !== canvas.damage || counts.supplied !== canvas.supplied)) {
      return { ok: false, message: 'la evidencia del lienzo no coincide con el XML.' }
    }
    return { ok: true, message: `${counts.signs} signo(s), ${counts.damage} dañado(s), ${counts.supplied} suplido(s), ${counts.gap} hueco(s) conservados.` }
  } catch (e) {
    return { ok: false, message: e.message }
  }
})

const copy = async () => {
  try {
    await navigator.clipboard.writeText(exported.value.xml)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch (e) { /* sin permiso de portapapeles */ }
}

const download = () => {
  const blob = new Blob([exported.value.xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.source?.attrs?.[XML_ID] || 'bloque'}.xml`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
