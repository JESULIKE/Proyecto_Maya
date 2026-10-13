<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMaya } from '~/composables/useMaya'
import MayaBlockSVG from '~/components/MayaBlockSVG.vue'
import { parseXML, findBlocks, XML_ID } from '~/lib/maya/tei/tree'
import { describeLoss } from '~/lib/maya/tei/audit'

const { 
  loadData,
  teiToDsl,
  dslToTEI,
  getRenderableGlyphs,
  updateDocumentWithDSL,
  validateDSL
} = useMaya()

// --- ESTADO ---
// Documento TEI XML completo simulando el Digital Corpus of Classic Mayan
const defaultXML = `<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt><title>Inscripción de Palenque, Tablero de la Cruz</title></titleStmt>
      <publicationStmt><p>Digital Corpus of Classic Mayan (DCCM)</p></publicationStmt>
      <sourceDesc><p>Monumento de piedra calcárea, 692 d.C.</p></sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <div type="textpart">
        <!-- Bloque epigráfico u-ti-ya (utiya: "sucedió") -->
        <ab xml:id="blockTest" type="glyph-block">
          <seg>
            <!-- Signo principal: ti -->
            <g n="TI 1" xml:id="blockTest_g1"></g>
            <!-- Prefijo izquierdo: u -->
            <g n="1bh" xml:id="blockTest_g2" corresp="#blockTest_g1" rend="left_beside"></g>
            <!-- Subfijo abajo: ya (marcado como dañado) -->
            <damage>
              <g n="YA 1" xml:id="blockTest_g3" corresp="#blockTest_g1" rend="beneath"></g>
            </damage>
          </seg>
        </ab>
      </div>
    </body>
  </text>
</TEI>`

const xmlInput = ref(defaultXML)
const dslOutput = ref('')
const dslInput = ref('') 
const dslErrors = ref([])

// Para mostrar qué extrae nuestro parseador de atributos (<damage> detection)
// El DOMParser solo existe en el navegador: hasta montar, servidor y cliente renderizan lo mismo
const mounted = ref(false)
const renderableGlyphs = computed(() => (mounted.value ? getRenderableGlyphs(xmlInput.value) : []))

// Validación computada
const isDslValid = computed(() => {
  const result = validateDSL(dslInput.value)
  dslErrors.value = result.errors
  return result.valid
})

// --- FUNCIONES ---
const extractDSLfromXML = () => {
  dslOutput.value = teiToDsl(xmlInput.value)
  // Sincronizamos el input del panel 2 para que estén unidos
  dslInput.value = dslOutput.value
}

// Compara el bloque original con el regenerado desde el DSL (árbol completo, ver paper de preservación)
const firstBlock = (xml) => {
  const root = parseXML(xml)
  return findBlocks(root)[0] || null
}

const pendingXml = ref('')
const lossReport = ref(null)
const lossError = ref('')

const applyXml = (xml) => {
  xmlInput.value = xml
  dslOutput.value = dslInput.value
  pendingXml.value = ''
  lossReport.value = null
}

const updateOriginalXML = () => {
  lossError.value = ''
  const blockId = firstBlock(xmlInput.value)?.attrs[XML_ID] || 'blockTest'
  const candidate = updateDocumentWithDSL(xmlInput.value, blockId, dslInput.value)
  try {
    const before = firstBlock(xmlInput.value)
    const after = firstBlock(candidate)
    if (before && after) {
      const report = describeLoss(before, after)
      if (!report.identical) {
        // No se aplica en silencio: el DSL no expresa daño, suplidos, huecos ni la mayoría de atributos
        pendingXml.value = candidate
        lossReport.value = report
        return
      }
    }
  } catch (e) {
    // Si no se puede auditar, no se aplica: es mejor conservar el original que arriesgarlo
    lossError.value = `No se aplicó el cambio porque no se pudo auditar la preservación: ${e.message}`
    return
  }
  applyXml(candidate)
}

const cancelUpdate = () => {
  pendingXml.value = ''
  lossReport.value = null
}

// Inicializar en primera carga, asegurando que corre del lado del cliente (evita error DOMParser)
onMounted(async () => {
  mounted.value = true
  await loadData() // el parser necesita los datos cargados antes de extraer
  extractDSLfromXML()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-8">
      <h1 class="page-title">Traductor TEI ↔ DSL</h1>
      <p class="page-lead">Convierte entre TEI XML y notación DSL, y revisa qué información editorial se perdería antes de aplicar un cambio.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- ================= PANEL 1: XML -> DSL ================= -->
      <div class="space-y-6">
        <div class="card-pad">
          <h2 class="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <span class="bg-blue-600 text-white px-2 py-1 rounded text-sm shadow">1</span> 
            TEI XML → DSL Notación
          </h2>
          <p class="text-sm text-gray-500 mb-3">Edita el XML (usa <code>&lt;damage&gt;</code> para ver cómo se aplica el filtro CSS).</p>
          
          <textarea 
            v-model="xmlInput" 
            rows="10" 
            class="field font-mono text-sm"
          ></textarea>
          
          <button 
            @click="extractDSLfromXML" 
            class="btn-brand mt-4"
          >
            Extraer y Parsear a DSL
          </button>

          <div v-if="dslOutput" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-xs uppercase tracking-widest text-blue-800 font-bold mb-2">Resultado DSL:</h3>
            <code class="text-xl text-blue-900 font-mono">{{ dslOutput }}</code>
          </div>
        </div>

        <!-- Renderizador Visual 1 (Desde XML) -->
        <div class="card-pad">
          <h2 class="text-xl font-bold mb-4 text-indigo-700">Composición SVG Visual</h2>
          <p class="text-sm text-gray-500 mb-4">Muestra el layout derivado automáticamente del DSL extraído. El glifo dañado (12st) hereda un filtro CSS en gris.</p>
          
          <div class="flex items-center justify-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300">
             <!-- Se le inyecta el DSL para que use MayaBlockSVG con LayoutEngine -->
             <ClientOnly><MayaBlockSVG v-if="dslOutput" :dsl="dslOutput" :width="220" :height="220" /></ClientOnly>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
            <div v-for="g in renderableGlyphs" :key="g.id" 
                 class="p-3 border rounded shadow-sm transition-colors" 
                 :class="g.damaged ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'">
              <div class="mb-1"><span class="font-bold text-gray-500 uppercase">Code:</span> <span class="text-gray-900 font-semibold text-sm">{{ g.code }}</span></div>
              <div class="mb-1"><span class="font-bold text-gray-500 uppercase">Valor:</span> {{ g.transliteration }}</div>
              <div v-if="g.damaged" class="text-red-600 mt-2 font-bold bg-red-100 inline-block px-2 py-0.5 rounded">GLIFO DAÑADO</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= PANEL 2: DSL -> XML ================= -->
      <div class="space-y-6">
        <div class="card-pad">
          <h2 class="text-xl font-bold mb-4 text-emerald-700 flex items-center gap-2">
            <span class="bg-emerald-600 text-white px-2 py-1 rounded text-sm shadow">2</span> 
            DSL Notación → TEI XML
          </h2>
          <p class="text-sm text-gray-500 mb-3">Cambia la notación estructural (^, _, +, &lt; &gt;) usando otros códigos (ej. 1548st, 178bh).</p>
          
          <input 
            v-model="dslInput" 
            type="text" 
            class="field font-mono text-lg"
            placeholder="Ej: 211ti^12st_130bh"
          />
          
          <div v-if="!isDslValid" class="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
            <p class="font-bold mb-1">Errores de Validación detectados:</p>
            <ul class="list-disc pl-5">
              <li v-for="(err, i) in dslErrors" :key="i">{{ err }}</li>
            </ul>
          </div>
          
          <button 
            @click="updateOriginalXML" 
            :disabled="!isDslValid || !dslInput.trim()"
            class="btn-primary mt-4 w-full"
          >
            <span class="block">🔄 Inyectar en el Documento Original</span>
            <span class="block text-xs font-normal opacity-80">(Re-generar nodo &lt;ab&gt; y mantener teiHeader)</span>
          </button>

          <p v-if="lossError" class="mt-3 text-sm text-red-700">{{ lossError }}</p>

          <!-- Aviso de pérdida de evidencia editorial -->
          <div v-if="lossReport" class="mt-4 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg text-sm">
            <p class="font-bold text-amber-900 mb-1">⚠ Esta actualización no conserva el bloque original</p>
            <p class="text-amber-800 mb-2">
              El DSL describe posición y códigos, pero no daño, suplidos, huecos ni los demás atributos del TEI.
              Al reemplazar el bloque se perdería la información que ves abajo.
            </p>
            <div class="flex flex-wrap gap-2 mb-2 text-xs">
              <span v-for="k in ['L','C','E','R']" :key="k" class="px-2 py-1 rounded border" :class="lossReport.verdict[k] ? 'bg-amber-200 border-amber-500' : 'bg-white border-gray-300 text-gray-500'">
                {{ k }}: {{ lossReport.verdict[k] ? 'cambia' : 'igual' }}
              </span>
            </div>
            <ul class="text-xs font-mono max-h-40 overflow-auto space-y-1 mb-3">
              <li v-for="(d, i) in lossReport.diffs.slice(0, 25)" :key="i"><span class="text-gray-500">{{ d.path }}</span> — {{ d.detail }}</li>
              <li v-if="lossReport.diffs.length > 25" class="text-gray-500">… y {{ lossReport.diffs.length - 25 }} más</li>
            </ul>
            <div class="flex gap-2">
              <button @click="cancelUpdate" class="btn-secondary">Cancelar y conservar el original</button>
              <button @click="applyXml(pendingXml)" class="btn-brand">Aplicar de todos modos</button>
            </div>
          </div>
        </div>

        <!-- Renderizador Visual 2 (Desde input manual) -->
        <div class="card-pad">
          <h2 class="text-xl font-bold mb-4 text-indigo-700">Renderizador al vuelo (LayoutEngine)</h2>
          <p class="text-sm text-gray-500 mb-4">A medida que alteres el DSL superior, el LayoutEngine SVG repinta geométricamente el lienzo en tiempo real.</p>
          
          <div class="flex items-center justify-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300">
             <ClientOnly><MayaBlockSVG :dsl="dslInput" :width="220" :height="220" /></ClientOnly>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>