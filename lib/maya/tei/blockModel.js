// lib/maya/tei/blockModel.js
// Puente entre el lienzo del ensamblador (glifos con posición y evidencia) y un bloque TEI.
//
// Regla de diseño del paper: la posición visual NO es evidencia. Si el bloque viene de una fuente
// TEI se conserva el árbol completo y solo se «parchea» lo que el usuario cambió
// (evidencia, glifos eliminados o añadidos). Así se separa visualización de preservación.

import { T, XML_ID, TEI_NS, localName, iter, clone, findParent, toXML } from './tree.js'
import { REL } from './audit.js'

const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d)

/** Código del catálogo a partir de la ruta de la imagen: /glifos_maya/B_VOCALES/21vl.svg → 21vl */
export const codeFromImage = (src) => {
  if (!src) return ''
  const file = String(src).split('/').pop().split('?')[0]
  return decodeURIComponent(file).replace(/\.svg$/i, '')
}

const area = (g) => Math.max(0, g.width) * Math.max(0, g.height)

/** Relación de `g` respecto a `main` según la geometría del lienzo. */
export function relationOf(g, main) {
  const cx = g.x + g.width / 2
  const cy = g.y + g.height / 2
  const mx = main.x + main.width / 2
  const my = main.y + main.height / 2
  // ¿Está (casi) dentro del principal? → infijo
  const ix = Math.max(0, Math.min(g.x + g.width, main.x + main.width) - Math.max(g.x, main.x))
  const iy = Math.max(0, Math.min(g.y + g.height, main.y + main.height) - Math.max(g.y, main.y))
  if (area(g) > 0 && (ix * iy) / area(g) >= 0.7 && area(g) < area(main)) return 'infixed_in'
  const dx = (cx - mx) / Math.max(1, main.width / 2)
  const dy = (cy - my) / Math.max(1, main.height / 2)
  if (Math.abs(dy) > Math.abs(dx)) return dy < 0 ? 'above' : 'beneath'
  return dx < 0 ? 'left_beside' : 'right_beside'
}

const el = (tag, attrs = {}, children = []) => ({ tag: T(tag), attrs, text: '', tail: '', children })

const damageEl = (degree, children) =>
  el('damage', { agent: 'environment', unit: 'g', quantity: '1', degree: String(degree) }, children)
const suppliedEl = (children) => el('supplied', { reason: 'damage', evidence: 'conjecture' }, children)
const gapEl = () => el('gap', { extent: 'unknown', reason: 'effaced', unit: 'g' })

/** Aplica el estado de evidencia a un nodo de signo y devuelve el nodo que va en el bloque. */
const withEvidence = (node, evidence, degree) => {
  if (evidence === 'damaged') return damageEl(degree ?? 0.5, [node])
  if (evidence === 'supplied') return suppliedEl([node])
  return node
}

const WRAPPERS = ['damage', 'supplied']

/** Evidencia actual de un signo en el árbol: busca el envoltorio más cercano. */
export function evidenceOf(root, g) {
  let evidence = 'normal'
  let degree = 0.5
  let node = g
  while (node && node !== root) {
    const parent = findParent(root, node)
    if (!parent) break
    const l = localName(parent.tag)
    if (l === 'damage') { evidence = 'damaged'; degree = num(parent.attrs.degree, 0.5); break }
    if (l === 'supplied') { evidence = 'supplied'; break }
    if (!WRAPPERS.includes(l)) break
    node = parent
  }
  return { evidence, degree }
}

/**
 * Convierte glifos del lienzo en un bloque <ab> nuevo (sin fuente previa).
 * `glyphs` deben ser solo los que están dentro del marco.
 */
export function buildBlock(glyphs, blockId = 'ab1') {
  const signs = glyphs.filter((g) => g.kind !== 'gap')
  const gaps = glyphs.filter((g) => g.kind === 'gap')
  const main = [...signs].sort((a, b) => area(b) - area(a))[0]
  const ordered = main
    ? [main, ...signs.filter((g) => g !== main).sort((a, b) => a.y - b.y || a.x - b.x)]
    : []

  const ids = new Map()
  ordered.forEach((g, i) => ids.set(g, `${blockId}G${i + 1}`))

  const children = []
  for (const g of ordered) {
    const attrs = { [XML_ID]: ids.get(g), n: codeFromImage(g.src) || g.syllable || '??' }
    if (g !== main) {
      attrs.rend = relationOf(g, main)
      attrs.corresp = `#${ids.get(main)}`
    }
    children.push(withEvidence(el('g', attrs), g.evidence, g.damageDegree))
  }
  gaps.forEach(() => children.push(gapEl()))

  const compact = ordered.map((g) => codeFromImage(g.src) || g.syllable || '??').concat(gaps.map(() => '??')).join(':')
  const block = el('ab', { [XML_ID]: blockId, type: 'glyph-block', n: compact }, children)
  return block
}

/**
 * Aplica sobre una COPIA del bloque fuente solo los cambios del usuario.
 * Devuelve { block, warnings }.
 */
export function patchBlock(source, glyphs) {
  const block = clone(source)
  const warnings = []
  const byId = new Map()
  for (const n of iter(block)) if (n.attrs[XML_ID]) byId.set(n.attrs[XML_ID], n)

  const present = new Set(glyphs.filter((g) => g.sourceId).map((g) => g.sourceId))

  // 1. Signos eliminados
  for (const [id, node] of byId) {
    if (localName(node.tag) !== 'g' || present.has(id)) continue
    removeWithWrappers(block, node)
  }

  // 1b. Huecos eliminados (los gap de la fuente no tienen xml:id: se identifican por orden)
  const sourceGaps = iter(block).filter((n) => localName(n.tag) === 'gap')
  const keptGaps = new Set(glyphs.filter((g) => g.kind === 'gap' && g.sourceGapIndex != null).map((g) => g.sourceGapIndex))
  sourceGaps.forEach((node, i) => {
    if (!keptGaps.has(i)) removeWithWrappers(block, node)
  })

  // 2. Evidencia modificada en signos existentes
  for (const g of glyphs) {
    if (!g.sourceId || g.kind === 'gap') continue
    const node = byId.get(g.sourceId)
    if (!node || !iter(block).includes(node)) continue
    const current = evidenceOf(block, node)
    const wanted = g.evidence || 'normal'
    const degree = g.damageDegree ?? 0.5
    if (current.evidence === wanted && (wanted !== 'damaged' || current.degree === degree)) continue
    const parent = findParent(block, node)
    const parentIsWrapper = parent && WRAPPERS.includes(localName(parent.tag))
    const outer = parentIsWrapper ? findParent(block, parent) : null
    if (outer && WRAPPERS.includes(localName(outer.tag))) {
      warnings.push(`El signo ${g.sourceId} tiene evidencia anidada (damage y supplied); no se modificó.`)
      continue
    }
    if (parentIsWrapper && parent.children.length > 1) {
      warnings.push(`El signo ${g.sourceId} comparte envoltorio con otros signos; su evidencia no se modificó.`)
      continue
    }
    if (parentIsWrapper) {
      if (wanted === 'damaged' && localName(parent.tag) === 'damage') parent.attrs.degree = String(degree)
      else {
        const gp = findParent(block, parent)
        gp.children[gp.children.indexOf(parent)] = node
        node.tail = parent.tail
        if (wanted !== 'normal') gp.children[gp.children.indexOf(node)] = withEvidence(node, wanted, degree)
      }
    } else if (wanted !== 'normal') {
      parent.children[parent.children.indexOf(node)] = withEvidence(node, wanted, degree)
    }
  }

  // 3. Signos nuevos: se enlazan con el signo principal existente
  const fresh = glyphs.filter((g) => !g.sourceId && g.kind !== 'gap')
  const anchor = glyphs.find((g) => g.sourceId && g.kind !== 'gap')
  const usedIds = new Set(byId.keys())
  let counter = 1
  const nextId = () => {
    let id
    do id = `${source.attrs[XML_ID] || 'ab'}N${counter++}`
    while (usedIds.has(id))
    usedIds.add(id)
    return id
  }
  for (const g of fresh) {
    const attrs = { [XML_ID]: nextId(), n: codeFromImage(g.src) || g.syllable || '??' }
    if (anchor) {
      attrs.rend = relationOf(g, anchor)
      attrs.corresp = `#${anchor.sourceId}`
    } else warnings.push('El bloque no tiene signos de la fuente a los que enlazar el nuevo signo.')
    block.children.push(withEvidence(el('g', attrs), g.evidence, g.damageDegree))
  }
  // Los gap nuevos no tienen posición en TEI: se añaden como elementos vacíos
  glyphs.filter((g) => g.kind === 'gap' && g.sourceGapIndex == null).forEach(() => block.children.push(gapEl()))
  return { block, warnings }
}

function removeWithWrappers(root, node) {
  let target = node
  let parent = findParent(root, target)
  while (parent && WRAPPERS.includes(localName(parent.tag)) && parent.children.length === 1) {
    target = parent
    parent = findParent(root, target)
  }
  if (parent) parent.children.splice(parent.children.indexOf(target), 1)
}

/**
 * Importa un bloque TEI al modelo del lienzo.
 * `resolveImage(code)` devuelve la ruta de la imagen del catálogo o null.
 * Devuelve glifos con `sourceId` para poder parchear después.
 */
export function importBlock(block, resolveImage = () => null, center = { x: 450, y: 360 }) {
  const signs = iter(block).filter((n) => ['g', 'gap'].includes(localName(n.tag)))
  const real = signs.filter((n) => localName(n.tag) === 'g')
  // Principal: el signo al que apuntan los demás con más frecuencia; si no hay, el primero
  const votes = new Map()
  real.forEach((n) => (n.attrs.corresp || '').split(/\s+/).forEach((t) => t.startsWith('#') && votes.set(t.slice(1), (votes.get(t.slice(1)) || 0) + 1)))
  const mainId = [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  const main = real.find((n) => n.attrs[XML_ID] === mainId) || real[0]

  const slots = {}
  const out = []
  let z = 0
  const SIZE = { main: 240, side: 150 }

  for (const n of signs) {
    const isGap = localName(n.tag) === 'gap'
    const { evidence, degree } = evidenceOf(block, n)
    const code = n.attrs.n || ''
    const src = !isGap && code ? resolveImage(code) : null
    let rel = n === main ? null : isGap ? null : n.attrs.rend
    // Relación respecto al principal: si el signo apunta a otro, se aproxima con su propia rend
    const size = n === main ? SIZE.main : SIZE.side
    let x = center.x - size / 2
    let y = center.y - size / 2
    if (rel) {
      const k = (slots[rel] = (slots[rel] || 0) + 1) - 1
      const step = 40 * k
      const dist = (SIZE.main + SIZE.side) / 2 - 10
      if (rel === 'above') y -= dist + step
      else if (rel === 'beneath') y += dist + step
      else if (rel === 'left_beside') x -= dist + step
      else if (rel === 'right_beside') x += dist + step
      else if (rel === 'infixed_in' || rel === 'encloses') { x += step; y += step; }
    } else if (isGap) {
      const k = (slots.gap = (slots.gap || 0) + 1) - 1
      x = center.x + 170 + 20 * k
      y = center.y + 170 + 20 * k
    }
    out.push({
      kind: isGap ? 'gap' : 'glyph',
      syllable: code,
      src: src || '',
      x, y,
      width: isGap ? 100 : size,
      height: isGap ? 100 : size,
      rotation: 0,
      zIndex: z++,
      evidence: isGap ? 'normal' : evidence,
      damageDegree: degree,
      sourceId: n.attrs[XML_ID] || null,
      sourceGapIndex: isGap ? signs.filter((s) => localName(s.tag) === 'gap').indexOf(n) : null,
      rel: rel && rel in REL ? rel : null
    })
  }
  return out
}

/** Cuenta elementos de evidencia para comprobar que el lienzo y el XML coinciden. */
export function evidenceCounts(block) {
  const all = iter(block)
  const count = (name) => all.filter((n) => localName(n.tag) === name).length
  return { damage: count('damage'), supplied: count('supplied'), gap: count('gap'), signs: count('g') }
}

export const TEI_NAMESPACE = TEI_NS

/**
 * Exporta los glifos del lienzo a TEI. Con fuente, parchea una copia de su árbol;
 * sin fuente, construye un bloque nuevo. Devuelve { block, xml, warnings }.
 */
export function exportXML(glyphs, source = null, blockId = 'ab1') {
  const { block, warnings } = source ? patchBlock(source, glyphs) : { block: buildBlock(glyphs, blockId), warnings: [] }
  return { block, warnings, xml: toXML(block, { indent: '  ' }) }
}
