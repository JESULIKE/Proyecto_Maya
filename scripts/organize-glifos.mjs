import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'public', 'escritura_maya', 'escritura maya mejorada')
const DEST_DIR = path.join(ROOT, 'public', 'glifos_maya')

// Clean folder mapping
const FOLDER_MAP = {
  'B VOCALES': 'B_VOCALES',
  'CH VOCALES': 'CH_VOCALES',
  'H VOCALES': 'H_VOCALES',
  'J VOCALES': 'J_VOCALES',
  'K VOCALES': 'K_VOCALES',
  'L VOCALES': 'L_VOCALES',
  'M VOCALES': 'M_VOCALES',
  'N VOCALES': 'N_VOCALES',
  'P VOCALES': 'P_VOCALES',
  'S VOCALES': 'S_VOCALES',
  'T VOCALES': 'T_VOCALES',
  'TZ VOCALES': 'TZ_VOCALES',
  'W VOCALES': 'W_VOCALES',
  'Y VOCALES': 'Y_VOCALES',
  'vocales puras': 'vocales_puras'
}

function getCleanFolderName(origName) {
  if (FOLDER_MAP[origName]) return FOLDER_MAP[origName]
  if (origName.includes('CH') && (origName.includes('´') || origName.includes("'"))) return 'CH_glotal_VOCALES'
  if (origName.includes('K') && (origName.includes('´') || origName.includes("'"))) return 'K_glotal_VOCALES'
  if (origName.includes('TZ') && (origName.includes('´') || origName.includes("'"))) return 'TZ_glotal_VOCALES'
  if (origName.includes('T') && (origName.includes('´') || origName.includes("'"))) return 'T_glotal_VOCALES'
  return origName.replace(/\s+/g, '_')
}

// 1. Load glyph catalog mapping
const { glyphCatalog } = await import('../data/glyphCatalog.js')
const catalogItems = []
for (const [key, list] of Object.entries(glyphCatalog)) {
  if (Array.isArray(list)) {
    for (const item of list) {
      if (item.family !== 'compound') {
        catalogItems.push(item)
      }
    }
  }
}
console.log(`Loaded ${catalogItems.length} glyph items from glyphCatalog.js`)

// Ensure clean DEST_DIR exists
if (fs.existsSync(DEST_DIR)) {
  fs.rmSync(DEST_DIR, { recursive: true, force: true })
}
fs.mkdirSync(DEST_DIR, { recursive: true })

// 2. Walk SRC_DIR and copy each file to clean DEST_DIR path
const syllables = []
let copiedCount = 0

function walkAndCopy(dir, relPath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const srcEntryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const cleanSub = getCleanFolderName(entry.name)
      const nextRel = relPath ? `${relPath}/${cleanSub}` : cleanSub
      fs.mkdirSync(path.join(DEST_DIR, nextRel), { recursive: true })
      walkAndCopy(srcEntryPath, nextRel)
    } else if (entry.name.endsWith('.svg')) {
      const cleanFileName = entry.name === 'calle 622.svg' ? '622.svg' : entry.name.replace(/\s+/g, '_')
      const destFilePath = path.join(DEST_DIR, relPath, cleanFileName)
      fs.copyFileSync(srcEntryPath, destFilePath)
      copiedCount++

      const stem = path.basename(entry.name, '.svg').toLowerCase()
      // Find matching item in catalog
      const catalogMatch = catalogItems.find(c => {
        const catStem = path.basename(c.image, '.svg').toLowerCase()
        return catStem === stem || String(c.thompson).toLowerCase() === stem || (stem === 'calle 622' && c.thompson === '622')
      })

      const relUrl = `/glifos_maya/${relPath}/${cleanFileName}`

      if (catalogMatch) {
        syllables.push({
          syllable: catalogMatch.syllable,
          image: relUrl,
          thompson: catalogMatch.thompson || path.basename(cleanFileName, '.svg'),
          family: catalogMatch.family,
          variant: catalogMatch.variant || 'standard'
        })
      } else {
        let syl = 'desconocido'
        if (relPath.includes('vocales_puras')) {
          const v = relPath.split('/').pop().toLowerCase()
          syl = v
        }
        syllables.push({
          syllable: syl,
          image: relUrl,
          thompson: path.basename(cleanFileName, '.svg')
        })
      }
    }
  }
}

walkAndCopy(SRC_DIR)
console.log(`Copied ${copiedCount} files to ${DEST_DIR}`)

// Sort syllables logically: by syllable then thompson
syllables.sort((a, b) => a.syllable.localeCompare(b.syllable) || a.thompson.localeCompare(b.thompson))

console.log(`Generated ${syllables.length} syllable entries`)

// 3. Write data/syllables.json
const jsonPath = path.join(ROOT, 'data', 'syllables.json')
fs.writeFileSync(jsonPath, JSON.stringify(syllables, null, 2) + '\n', 'utf8')
console.log(`Wrote ${jsonPath}`)
