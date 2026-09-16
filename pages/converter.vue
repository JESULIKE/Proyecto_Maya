<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMaya } from '~/composables/useMaya'
import MayaBlockSVG from '~/components/MayaBlockSVG.vue'

const { 
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
const renderableGlyphs = computed(() => getRenderableGlyphs(xmlInput.value))

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

const updateOriginalXML = () => {
  // Re-genera el nodo <ab> y lo inyecta en el documento original sin romper el teiHeader
  xmlInput.value = updateDocumentWithDSL(xmlInput.value, 'blockTest', dslInput.value)
  // Forzamos que se vuelva a extraer para sincronizar el panel visual 1
  dslOutput.value = dslInput.value
}

// Inicializar en primera carga, asegurando que corre del lado del cliente (evita error DOMParser)
onMounted(() => {
  extractDSLfromXML()
})
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto font-sans text-gray-800 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-extrabold mb-8 pb-4 border-b border-gray-300 text-gray-900">
      Plataforma Epigráfica Maya
      <span class="block text-sm font-normal text-gray-500 mt-2">Prueba de Traductor Bidireccional & Layout Engine SVG</span>
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- ================= PANEL 1: XML -> DSL ================= -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 class="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <span class="bg-blue-600 text-white px-2 py-1 rounded text-sm shadow">1</span> 
            TEI XML → DSL Notación
          </h2>
          <p class="text-sm text-gray-500 mb-3">Edita el XML (usa <code>&lt;damage&gt;</code> para ver cómo se aplica el filtro CSS).</p>
          
          <textarea 
            v-model="xmlInput" 
            rows="10" 
            class="w-full font-mono text-sm p-4 border border-gray-200 rounded bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-inner"
          ></textarea>
          
          <button 
            @click="extractDSLfromXML" 
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors"
          >
            Extraer y Parsear a DSL
          </button>

          <div v-if="dslOutput" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-xs uppercase tracking-widest text-blue-800 font-bold mb-2">Resultado DSL:</h3>
            <code class="text-xl text-blue-900 font-mono">{{ dslOutput }}</code>
          </div>
        </div>

        <!-- Renderizador Visual 1 (Desde XML) -->
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 class="text-xl font-bold mb-4 text-indigo-700">Composición SVG Visual</h2>
          <p class="text-sm text-gray-500 mb-4">Muestra el layout derivado automáticamente del DSL extraído. El glifo dañado (12st) hereda un filtro CSS en gris.</p>
          
          <div class="flex items-center justify-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300">
             <!-- Se le inyecta el DSL para que use MayaBlockSVG con LayoutEngine -->
             <MayaBlockSVG v-if="dslOutput" :dsl="dslOutput" :width="220" :height="220" />
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
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 class="text-xl font-bold mb-4 text-emerald-700 flex items-center gap-2">
            <span class="bg-emerald-600 text-white px-2 py-1 rounded text-sm shadow">2</span> 
            DSL Notación → TEI XML
          </h2>
          <p class="text-sm text-gray-500 mb-3">Cambia la notación estructural (^, _, +, &lt; &gt;) usando otros códigos (ej. 1548st, 178bh).</p>
          
          <input 
            v-model="dslInput" 
            type="text" 
            class="w-full font-mono text-lg p-4 border border-gray-200 rounded bg-gray-50 focus:ring-2 focus:ring-emerald-400 outline-none transition-all shadow-inner"
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
            :disabled="!isDslValid"
            class="mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors w-full"
          >
            <span class="block">🔄 Inyectar en el Documento Original</span>
            <span class="block text-xs font-normal opacity-80">(Re-generar nodo &lt;ab&gt; y mantener teiHeader)</span>
          </button>
        </div>

        <!-- Renderizador Visual 2 (Desde input manual) -->
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 class="text-xl font-bold mb-4 text-indigo-700">Renderizador al vuelo (LayoutEngine)</h2>
          <p class="text-sm text-gray-500 mb-4">A medida que alteres el DSL superior, el LayoutEngine SVG repinta geométricamente el lienzo en tiempo real.</p>
          
          <div class="flex items-center justify-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300">
             <MayaBlockSVG :dsl="dslInput" :width="220" :height="220" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>