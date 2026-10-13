import { describe, it, expect } from 'vitest'
import { buildBlock, patchBlock, importBlock, evidenceCounts } from '../lib/maya/tei/blockModel.js'
import { compare, canonString, diffTrees } from '../lib/maya/tei/audit.js'
import { toXML, iter, localName, XML_ID } from '../lib/maya/tei/tree.js'
import { uxulBlocks, parse } from './helpers.js'

const blocks = uxulBlocks()
const resolve = (code) => `/glifos_maya/${code}.svg`

describe('ensamblador ↔ TEI: preservar la fuente', () => {
  it('importar y exportar sin editar deja los 32 bloques idénticos a la fuente (R)', () => {
    for (const [id, b] of Object.entries(blocks)) {
      const { block } = patchBlock(b, importBlock(b, resolve))
      expect(canonString(block), id).toBe(canonString(b))
    }
  })

  it('marcar un signo como dañado solo añade un damage; L y C no lo ven, E y R sí', () => {
    const b = blocks.Cp5
    const glyphs = importBlock(b, resolve)
    const target = glyphs.find((g) => g.kind === 'glyph' && g.evidence === 'normal')
    target.evidence = 'damaged'
    target.damageDegree = 0.75
    const { block } = patchBlock(b, glyphs)
    expect(compare(b, block)).toEqual({ L: false, C: false, E: true, R: true })
    expect(diffTrees(b, block).length).toBeGreaterThan(0)
    expect(evidenceCounts(block).damage).toBe(evidenceCounts(b).damage + 1)
  })

  it('quitar el daño de un signo elimina el envoltorio y nada más', () => {
    const b = blocks.Cp5
    const glyphs = importBlock(b, resolve)
    const target = glyphs.find((g) => g.evidence === 'damaged')
    target.evidence = 'normal'
    const { block } = patchBlock(b, glyphs)
    expect(evidenceCounts(block).damage).toBe(evidenceCounts(b).damage - 1)
    expect(evidenceCounts(block).signs).toBe(evidenceCounts(b).signs)
  })

  it('cambiar el grado de daño modifica solo @degree', () => {
    const b = blocks.Cp5
    const glyphs = importBlock(b, resolve)
    const target = glyphs.find((g) => g.evidence === 'damaged')
    target.damageDegree = 1
    const { block } = patchBlock(b, glyphs)
    const diffs = diffTrees(b, block)
    expect(diffs).toHaveLength(1)
    expect(diffs[0].kind).toBe('attr-changed')
  })

  it('no toca evidencia anidada (Cp6) y avisa en vez de corromperla', () => {
    const b = blocks.Cp6
    const glyphs = importBlock(b, resolve)
    glyphs.find((g) => g.sourceId === 'Cp6G3').evidence = 'normal'
    const { block, warnings } = patchBlock(b, glyphs)
    expect(warnings.length).toBe(1)
    expect(canonString(block)).toBe(canonString(b))
  })

  it('eliminar un signo quita también su envoltorio vacío', () => {
    const b = blocks.Cp5
    const glyphs = importBlock(b, resolve)
    const i = glyphs.findIndex((g) => g.evidence === 'damaged')
    const gone = glyphs.splice(i, 1)[0]
    const { block } = patchBlock(b, glyphs)
    expect(iter(block).some((n) => n.attrs[XML_ID] === gone.sourceId)).toBe(false)
    for (const n of iter(block)) {
      if (['damage', 'supplied'].includes(localName(n.tag))) expect(n.children.length).toBeGreaterThan(0)
    }
  })
})

// PRNG determinista para que el fuzz sea reproducible
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)

describe('red-team: lienzos aleatorios → TEI → lienzo', () => {
  const EVIDENCE = ['normal', 'damaged', 'supplied']

  it('la evidencia de cada glifo sobrevive a exportar, reanalizar e importar (500 lienzos)', () => {
    const rand = rng(42)
    for (let n = 0; n < 500; n++) {
      const count = 1 + Math.floor(rand() * 6)
      const glyphs = Array.from({ length: count }, (_, i) => ({
        kind: rand() < 0.15 ? 'gap' : 'glyph',
        syllable: `s${i}`,
        src: `/glifos_maya/X/${100 + i}st.svg`,
        x: rand() * 400,
        y: rand() * 400,
        width: 40 + rand() * 200,
        height: 40 + rand() * 200,
        rotation: 0,
        zIndex: i,
        evidence: EVIDENCE[Math.floor(rand() * 3)],
        damageDegree: [0.25, 0.5, 0.75, 1][Math.floor(rand() * 4)]
      }))
      const block = buildBlock(glyphs, `F${n}`)
      const reparsed = parse(toXML(block))
      expect(canonString(reparsed)).toBe(canonString(block))
      const back = importBlock(reparsed, () => null)
      const signs = glyphs.filter((g) => g.kind === 'glyph')
      const backSigns = back.filter((g) => g.kind === 'glyph')
      expect(backSigns.length).toBe(signs.length)
      expect(back.filter((g) => g.kind === 'gap').length).toBe(glyphs.filter((g) => g.kind === 'gap').length)
      const key = (code, ev, deg) => `${code}|${ev}|${ev === 'damaged' ? deg : ''}`
      const a = signs.map((g) => key(g.src.split('/').pop().replace('.svg', ''), g.evidence, g.damageDegree)).sort()
      const b = backSigns.map((g) => key(g.syllable, g.evidence, g.damageDegree)).sort()
      expect(b).toEqual(a)
    }
  })

  it('un bloque vacío o con un solo signo no rompe la exportación', () => {
    expect(() => buildBlock([], 'E0')).not.toThrow()
    const one = buildBlock([{ kind: 'glyph', syllable: 'a', src: '/x/1st.svg', x: 0, y: 0, width: 10, height: 10, evidence: 'normal' }], 'E1')
    expect(iter(one).filter((n) => localName(n.tag) === 'g')).toHaveLength(1)
  })

  it('coordenadas degeneradas (NaN, 0, negativas, Infinity) no producen XML inválido', () => {
    const weird = [NaN, 0, -50, Infinity, 1e12].map((v, i) => ({
      kind: 'glyph', syllable: 'a', src: `/x/${i}st.svg`, x: v, y: v, width: v, height: v, evidence: 'normal'
    }))
    expect(() => parse(toXML(buildBlock(weird, 'W')))).not.toThrow()
  })

  it('caracteres especiales en sílabas se escapan y vuelven iguales', () => {
    const text = 'a"<&>\''
    const nasty = [{ kind: 'glyph', syllable: text, src: '', x: 0, y: 0, width: 10, height: 10, evidence: 'normal' }]
    const back = parse(toXML(buildBlock(nasty, 'S')))
    expect(iter(back).find((n) => localName(n.tag) === 'g').attrs.n).toBe(text)
  })
})

describe('red-team: huecos (gap) de la fuente', () => {
  it('un gap importado no se duplica y un gap eliminado desaparece', () => {
    const b = blocks.Cp1
    const glyphs = importBlock(b, resolve)
    expect(glyphs.every((g) => g.kind === 'gap')).toBe(true)
    expect(canonString(patchBlock(b, glyphs).block)).toBe(canonString(b))
    const { block } = patchBlock(b, [])
    expect(evidenceCounts(block).gap).toBe(0)
  })
})
