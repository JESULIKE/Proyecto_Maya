// scripts/sync-glyph-data.mjs
// Sincroniza data/syllables.json y data/thompson-mapping.json con los archivos
// reales que existen en public/escritura_maya/.
//
// Uso:
//   node scripts/sync-glyph-data.mjs            -> modo reporte (no escribe nada)
//   node scripts/sync-glyph-data.mjs --apply    -> reescribe los JSON (crea .bak)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public', 'escritura_maya')
const APPLY = process.argv.includes('--apply')

// ---------- utilidades ----------
const IMAGE_EXT = new Set(['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'])

function walk(dir, base = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      out.push(...walk(abs, rel))
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push({
        abs,
        rel,
        url: `/${encodeURI('escritura_maya/' + rel).replace(/%20/g, '%20')}`,
        stem: path.basename(entry.name, path.extname(entry.name)),
        folder: path.dirname(rel),
      })
    }
  }
  return out
}

// ---------- cargar datos actuales ----------
const mappingPath = path.join(ROOT, 'data', 'thompson-mapping.json')
const syllablesPath = path.join(ROOT, 'data', 'syllables.json')
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'))
const syllablesOld = JSON.parse(fs.readFileSync(syllablesPath, 'utf8'))

// Índice: código (thompson o clave) -> variante conocida
const codeIndex = new Map()
for (const [key, variants] of Object.entries(mapping.syllabograms || {})) {
  for (const v of variants) {
    const info = {
      syllable: v.syllable,
      variant: v.variant || 'standard',
      frequency: v.frequency || null,
      key,
      thompson: v.thompson || key,
    }
    if (v.thompson) codeIndex.set(String(v.thompson).toLowerCase(), info)
    codeIndex.set(key.toLowerCase(), info)
  }
}

// Sílabas válidas conocidas (para la heurística por carpeta/nombre)
const validSyllables = new Set(['a', 'e', 'i', 'o', 'u'])
for (const v of codeIndex.values()) validSyllables.add(v.syllable.toLowerCase())
for (const item of syllablesOld) validSyllables.add(item.syllable.toLowerCase())

// Índice por número Thompson: "568st" y "568bh" comparten número -> mismo signo
const byThompsonNumber = new Map()
for (const [key, variants] of Object.entries(mapping.syllabograms || {})) {
  const num = key.match(/\d+/)?.[0]
  if (!num) continue
  if (!byThompsonNumber.has(num)) byThompsonNumber.set(num, new Map())
  for (const v of variants) {
    const m = byThompsonNumber.get(num)
    m.set(v.syllable, (m.get(v.syllable) || 0) + 1)
  }
}

// ---------- inventario en disco ----------
const files = walk(PUBLIC_DIR)
console.log(`Archivos de imagen en disco: ${files.length}`)
console.log(`Claves en thompson-mapping: ${Object.keys(mapping.syllabograms || {}).length}`)
console.log(`Entradas en syllables.json: ${syllablesOld.length}\n`)

// ---------- atribución de sílaba por archivo ----------
function attribute(file) {
  // 1. Coincidencia exacta del nombre (sin extensión) contra el diccionario
  const hit = codeIndex.get(file.stem.toLowerCase())
  if (hit) return { ...hit, how: 'diccionario' }

  // 2. Carpeta de vocales puras: vocales puras/A/archivo.svg -> "a"
  const vowelMatch = file.folder.match(/vocales puras[/\\]([AEIOU])$/i)
  if (vowelMatch) {
    return {
      syllable: vowelMatch[1].toLowerCase(),
      variant: 'standard',
      frequency: null,
      how: 'carpeta-vocal',
    }
  }

  // 3. Heurística: letras del nombre (soporta KE_2, PO_2, TZ A, CH´A_1...)
  const letters = file.stem.replace(/[^a-zA-Z´']/g, '').toLowerCase()
  if (validSyllables.has(letters)) return { syllable: letters, variant: 'standard', frequency: null, how: 'nombre' }

  // 4. Mismo número Thompson que una clave conocida -> misma sílaba
  //    (el sufijo solo indica la variante gráfica: 21vl/21vs/21 = T21)
  const num = file.stem.match(/\d+/)?.[0]
  if (num && byThompsonNumber.has(num)) {
    const candidates = [...byThompsonNumber.get(num).entries()]
    if (candidates.length === 1) {
      const [syllable] = candidates[0]
      return { syllable, variant: 'standard', frequency: null, how: 'numero-thompson' }
    }
  }

  return null
}

const resolved = [] // {file, info}
const unresolved = []
for (const f of files) {
  const info = attribute(f)
  if (info) resolved.push({ ...f, info })
  else unresolved.push(f)
}

// ---------- referencias rotas en los JSON actuales ----------
const existsOnDisk = (p) => {
  if (!p) return false
  const clean = decodeURIComponent(p.replace(/^\//, ''))
  return fs.existsSync(path.join(ROOT, 'public', clean))
}
const brokenMapping = []
for (const [key, variants] of Object.entries(mapping.syllabograms || {})) {
  for (const v of variants) if (!existsOnDisk(v.image)) brokenMapping.push({ key, image: v.image })
}
const brokenSyllables = syllablesOld.filter((s) => !existsOnDisk(s.image))

console.log(`--- DIAGNÓSTICO ---`)
console.log(`Refs rotas en thompson-mapping.json: ${brokenMapping.length}`)
console.log(`Refs rotas en syllables.json:        ${brokenSyllables.length}/${syllablesOld.length}`)
console.log(`Archivos en disco atribuibles:       ${resolved.length}`)
console.log(`Archivos en disco SIN sílaba clara:  ${unresolved.length}`)
if (unresolved.length) {
  console.log('\nSin atribución (revisar manualmente):')
  unresolved.forEach((f) => console.log(`  - ${f.rel}`))
}
const byHow = {}
resolved.forEach((r) => (byHow[r.info.how] = (byHow[r.info.how] || 0) + 1))
console.log('\nAtribución por método:', JSON.stringify(byHow))

// ---------- construir nuevos datos ----------
// Ruta URL real en disco para un código dado
const diskByStem = new Map(files.map((f) => [f.stem.toLowerCase(), f]))

const newSyllables = resolved
  .map(({ info, url, stem }) => ({
    syllable: info.syllable,
    image: url,
    ...(info.how === 'diccionario' ? { thompson: info.thompson } : {}),
    _stem: stem,
  }))
  .sort((a, b) => a.syllable.localeCompare(b.syllable) || a.image.localeCompare(b.image))
  .map(({ _stem, ...rest }) => rest)

// thompson-mapping: se conservan TODAS las claves (sirven de diccionario para
// validación y transliteración), pero se corrige la ruta de imagen cuando el
// archivo existe en disco con ese mismo nombre.
const newMapping = { syllabograms: {}, logograms: mapping.logograms || {} }
let fixedPaths = 0
for (const [key, variants] of Object.entries(mapping.syllabograms || {})) {
  newMapping.syllabograms[key] = variants.map((v) => {
    const disk = diskByStem.get(String(v.thompson || key).toLowerCase())
    if (disk && !existsOnDisk(v.image)) {
      fixedPaths++
      return { ...v, image: disk.url }
    }
    return v
  })
}

console.log(`\n--- PROPUESTA ---`)
console.log(`syllables.json nuevo:       ${newSyllables.length} entradas (todas con archivo real)`)
console.log(`Rutas corregidas en mapping: ${fixedPaths}`)

const distBySyl = {}
for (const s of newSyllables) distBySyl[s.syllable] = (distBySyl[s.syllable] || 0) + 1
console.log(`\nDistribución por sílaba:`)
Object.entries(distBySyl)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([syl, n]) => console.log(`  ${syl.padEnd(5)} ${n}`))

if (APPLY) {
  fs.copyFileSync(mappingPath, mappingPath + '.bak')
  fs.copyFileSync(syllablesPath, syllablesPath + '.bak')
  fs.writeFileSync(mappingPath, JSON.stringify(newMapping, null, 4) + '\n', 'utf8')
  fs.writeFileSync(
    syllablesPath,
    JSON.stringify(newSyllables, null, 2).replace(/\n  \{/g, '\n\n  {').replace(/\n\]/g, '\n') + '\n',
    'utf8'
  )
  console.log('\n✅ Escritos data/thompson-mapping.json y data/syllables.json (backups .bak)')
} else {
  console.log('\n(modo reporte: usa --apply para escribir los cambios)')
}
