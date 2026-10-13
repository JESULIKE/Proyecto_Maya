// lib/maya/tei/audit.js
// Auditoría de preservación de evidencia editorial (portada del notebook Maya_TEI_Audit_Colab).
//
// Compara un bloque fuente S con un candidato T bajo cuatro representaciones:
//   L  layout            (g/seg, xml:id, rend, corresp)
//   C  catálogo          (L + n/ref de cada nodo y n del bloque)
//   E  contexto editorial (C + padre estructural, ancestros damage/supplied/unclear y gaps)
//   R  árbol completo    (todo: elementos, atributos, texto, cola y orden)
// Un cambio en R que L, C o E no ven es información que esa proyección pierde.
// «Cambió» no significa «está mal»: solo que el candidato ya no es equivalente a la fuente.

import { XML_ID, localName, iter, clone, findParent, findBlocks, toXML, parseXML } from './tree.js'

// Las seis relaciones de posición del perfil TEI de TWKM y su inversa
export const REL = {
  above: 'beneath',
  beneath: 'above',
  left_beside: 'right_beside',
  right_beside: 'left_beside',
  encloses: 'infixed_in',
  infixed_in: 'encloses'
}

const nonBlank = (s) => (s && s.trim() ? s : '')

/** Forma canónica R: nombres expandidos, atributos ordenados, hijos en orden; se ignora la sangría. */
export function canon(n) {
  return [
    n.tag,
    Object.entries(n.attrs).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
    nonBlank(n.text),
    n.children.map(canon),
    nonBlank(n.tail)
  ]
}

export const canonString = (n) => JSON.stringify(canon(n))

/** Proyección de un bloque: level 0 = L, 1 = C, 2 = E. */
export function project(block, level) {
  const nodes = []
  const gaps = []
  const visit = (e, parent = null, contexts = []) => {
    const local = localName(e.tag)
    let ctx = contexts
    if (['damage', 'supplied', 'unclear'].includes(local)) {
      ctx = [...contexts, [local, Object.entries(e.attrs).sort(([a], [b]) => (a < b ? -1 : 1))]]
    }
    if (local === 'g' || local === 'seg') {
      const keys = [XML_ID, 'rend', 'corresp', ...(level >= 1 ? ['ref', 'n'] : [])]
      const row = [local, keys.map((k) => [k, e.attrs[k] ?? null])]
      if (level >= 2) row.push(parent, ctx)
      nodes.push(row)
      parent = e.attrs[XML_ID] ?? null
    }
    if (local === 'gap' && level >= 2) gaps.push([parent, ctx, canon(e)])
    for (const c of e.children) visit(c, parent, ctx)
  }
  visit(block)
  const out = { nodes }
  if (level >= 1) out.block_n = block.attrs.n ?? null
  if (level >= 2) out.gaps = gaps
  return out
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/** Indica qué representaciones distinguen S de T. */
export function compare(source, candidate) {
  return {
    L: !same(project(source, 0), project(candidate, 0)),
    C: !same(project(source, 1), project(candidate, 1)),
    E: !same(project(source, 2), project(candidate, 2)),
    R: canonString(source) !== canonString(candidate)
  }
}

/**
 * Lista legible de diferencias entre dos árboles. Alinea por posición de hijos.
 * Cada elemento: { path, kind, detail }.
 */
export function diffTrees(a, b, path = '') {
  const out = []
  const label = (n) => `${localName(n.tag)}${n.attrs[XML_ID] ? '#' + n.attrs[XML_ID] : ''}`
  const here = `${path}/${label(a)}`
  if (a.tag !== b.tag) {
    const EV = ['damage', 'supplied', 'unclear']
    const wrapsA = EV.includes(localName(b.tag)) && b.children.length === 1 && b.children[0].tag === a.tag
    const wrapsB = EV.includes(localName(a.tag)) && a.children.length === 1 && a.children[0].tag === b.tag
    if (wrapsA) {
      out.push({ path: here, kind: 'wrapper-added', detail: `se añadió <${localName(b.tag)}> alrededor de <${localName(a.tag)}>` })
      return out.concat(diffTrees(a, b.children[0], path))
    }
    if (wrapsB) {
      out.push({ path: here, kind: 'wrapper-removed', detail: `se quitó <${localName(a.tag)}> de alrededor de <${localName(b.tag)}>` })
      return out.concat(diffTrees(a.children[0], b, path))
    }
    out.push({ path: here, kind: 'tag', detail: `${localName(a.tag)} → ${localName(b.tag)}` })
    return out
  }
  const names = new Set([...Object.keys(a.attrs), ...Object.keys(b.attrs)])
  for (const k of names) {
    const attr = localName(k)
    if (!(k in b.attrs)) out.push({ path: here, kind: 'attr-removed', detail: `@${attr}="${a.attrs[k]}" eliminado` })
    else if (!(k in a.attrs)) out.push({ path: here, kind: 'attr-added', detail: `@${attr}="${b.attrs[k]}" añadido` })
    else if (a.attrs[k] !== b.attrs[k]) out.push({ path: here, kind: 'attr-changed', detail: `@${attr}: "${a.attrs[k]}" → "${b.attrs[k]}"` })
  }
  if (nonBlank(a.text) !== nonBlank(b.text)) out.push({ path: here, kind: 'text', detail: 'texto distinto' })
  const n = Math.max(a.children.length, b.children.length)
  for (let i = 0; i < n; i++) {
    const ca = a.children[i]
    const cb = b.children[i]
    if (!ca) out.push({ path: here, kind: 'child-added', detail: `<${localName(cb.tag)}> añadido` })
    else if (!cb) out.push({ path: here, kind: 'child-removed', detail: `<${localName(ca.tag)}> eliminado` })
    else out.push(...diffTrees(ca, cb, here))
  }
  return out
}

/** Diferencias entre S y T con una descripción corta de su impacto evidencial. */
export function describeLoss(source, candidate) {
  const verdict = compare(source, candidate)
  const diffs = diffTrees(source, candidate)
  const evidential = diffs.filter((d) => /\/(damage|supplied|gap|unclear)|damage|supplied|gap/.test(d.path + d.detail))
  return { verdict, diffs, evidentialCount: evidential.length, identical: !verdict.R }
}

// ---------- Mutaciones (suite orientada a dominio del paper: 333 casos en 10 familias) ----------

/** Genera una alteración por cada ocurrencia aplicable. Cada caso cambia R. */
export function* mutations(block) {
  const original = iter(block)
  for (let index = 0; index < original.length; index++) {
    const e = original[index]
    const local = localName(e.tag)
    const cases = []
    if (e.attrs.rend in REL) cases.push(['reverse_relation', 'rend', REL[e.attrs.rend]])
    if (e.attrs.corresp) cases.push(['dangling_target', 'corresp', '#AUDIT_MISSING'])
    if (e.attrs.ref) cases.push(['replace_catalog_ref', 'ref', 'textgrid:AUDIT_ALTERNATIVE'])
    if (local === 'damage') cases.push(['change_damage_degree', 'degree', '0.25'], ['remove_damage_wrapper', null, null])
    if (local === 'supplied') cases.push(['change_supplied_evidence', 'evidence', 'AUDIT_ALTERNATIVE'], ['remove_supplied_wrapper', null, null])
    if (local === 'gap') cases.push(['change_gap_extent', 'extent', 'AUDIT_ALTERNATIVE'])
    if (local === 'seg') cases.push(['remove_group', null, null])
    if (e === block) cases.push(['change_block_transcription', 'n', (block.attrs.n || '') + 'AUDIT_ALTERNATIVE'])
    for (const [family, attr, value] of cases) {
      const m = clone(block)
      const target = iter(m)[index]
      if (attr) target.attrs[attr] = value
      else {
        const parent = findParent(m, target)
        const loc = parent.children.indexOf(target)
        parent.children.splice(loc, 1, ...target.children)
      }
      yield { family, index, elementId: e.attrs[XML_ID] || '', candidate: m }
    }
  }
}

/** Prueba de estrés: elimina cada atributo una vez (607 casos en el testigo del paper). */
export function* attributeDeletions(block) {
  const original = iter(block)
  for (let index = 0; index < original.length; index++) {
    const e = original[index]
    for (const attr of Object.keys(e.attrs).sort()) {
      const m = clone(block)
      delete iter(m)[index].attrs[attr]
      yield { element: localName(e.tag), attribute: localName(attr), index, candidate: m }
    }
  }
}

/** Controles negativos: cambios solo de serialización que NO deben alterar ninguna representación. */
export function serializationControls(block, parse = parseXML) {
  const modes = {
    attribute_order: { reverseAttrs: true },
    namespace_prefix: { prefix: 'audit' },
    indentation: { indent: '    ' }
  }
  return Object.entries(modes).map(([mode, options]) => ({
    mode,
    candidate: parse(toXML(block, options))
  }))
}

/** Chequeos de integridad ligeros (no sustituyen un validador del esquema de Bonn). */
export function integrityChecks(block, documentIds) {
  const found = []
  const ids = iter(block).map((e) => e.attrs[XML_ID]).filter(Boolean)
  if (new Set(ids).size !== ids.length) found.push('duplicate_id')
  for (const e of iter(block)) {
    for (const target of (e.attrs.corresp || '').split(/\s+/).filter(Boolean)) {
      if (target.startsWith('#') && !documentIds.has(target.slice(1))) found.push(`unresolved:${e.attrs[XML_ID]}:${target}`)
    }
    if (e.attrs.rend && !(e.attrs.rend in REL)) found.push('unknown_relation')
  }
  return found
}

const tally = (rows, keys) => Object.fromEntries(keys.map((k) => [k, rows.filter((r) => r[k]).length]))

/**
 * Ejecuta el audit completo sobre un documento TEI ya convertido a árbol.
 * Devuelve los mismos conteos que el notebook original.
 */
export function runAudit(documentRoot, parse = parseXML) {
  const blocks = findBlocks(documentRoot)
  const allIds = new Set(iter(documentRoot).map((e) => e.attrs[XML_ID]).filter(Boolean))
  const mutationRows = []
  const deletionRows = []
  const controlRows = []
  let roundTripPass = 0

  for (const b of blocks) {
    if (canonString(b) === canonString(JSON.parse(JSON.stringify(b)))) roundTripPass++
    const blockIds = new Set(iter(b).map((e) => e.attrs[XML_ID]).filter(Boolean))
    const base = new Set(integrityChecks(b, allIds))
    for (const m of mutations(b)) {
      const verdict = compare(b, m.candidate)
      const docIds = new Set([...allIds].filter((i) => !blockIds.has(i)))
      iter(m.candidate).forEach((e) => e.attrs[XML_ID] && docIds.add(e.attrs[XML_ID]))
      const alerts = integrityChecks(m.candidate, docIds).filter((x) => !base.has(x))
      mutationRows.push({ family: m.family, I: alerts.length > 0, ...verdict })
    }
    for (const d of attributeDeletions(b)) {
      deletionRows.push({ element: d.element, attribute: d.attribute, ...compare(b, d.candidate) })
    }
    for (const c of serializationControls(b, parse)) controlRows.push({ mode: c.mode, ...compare(b, c.candidate) })
  }

  const families = {}
  for (const r of mutationRows) (families[r.family] ||= []).push(r)
  const blindSpots = {}
  for (const r of deletionRows) if (!r.E) blindSpots[`${r.element}/@${r.attribute}`] = (blindSpots[`${r.element}/@${r.attribute}`] || 0) + 1

  return {
    blocks: blocks.length,
    roundTripPass,
    mutations: { n: mutationRows.length, ...tally(mutationRows, ['I', 'L', 'C', 'E', 'R']) },
    families: Object.fromEntries(Object.entries(families).map(([k, v]) => [k, { n: v.length, ...tally(v, ['I', 'L', 'C', 'E', 'R']) }])),
    deletions: { n: deletionRows.length, ...tally(deletionRows, ['L', 'C', 'E', 'R']) },
    editorialBlindSpots: blindSpots,
    controls: { n: controlRows.length, ...tally(controlRows, ['L', 'C', 'E', 'R']) }
  }
}

export { findBlocks }
