// Reproduce los resultados publicados en el paper (Uxul, Stela 17) con el audit portado a JS.
import { describe, it, expect } from 'vitest'
import { runAudit, compare, canonString, mutations } from '../lib/maya/tei/audit.js'
import { clone, iter, T, toXML } from '../lib/maya/tei/tree.js'
import { loadUxul, uxulBlocks, parse } from './helpers.js'

const root = loadUxul()
const result = runAudit(root, parse)

describe('audit: reproduce las cifras del paper', () => {
  it('32 bloques y round trip JSON completo', () => {
    expect(result.blocks).toBe(32)
    expect(result.roundTripPass).toBe(32)
  })
  it('333 alteraciones: I=102, L=188, C=270, E=333, R=333', () => {
    expect(result.mutations).toEqual({ n: 333, I: 102, L: 188, C: 270, E: 333, R: 333 })
  })
  it('C no distingue las 63 alteraciones de damage, supplied y gap', () => {
    const f = result.families
    const blind = ['change_damage_degree', 'remove_damage_wrapper', 'change_gap_extent', 'change_supplied_evidence', 'remove_supplied_wrapper']
    expect(blind.reduce((n, k) => n + f[k].n - f[k].C, 0)).toBe(63)
  })
  it('607 borrados de atributo: L=258, C=390, E=527, R=607', () => {
    expect(result.deletions).toEqual({ n: 607, L: 258, C: 390, E: 527, R: 607 })
  })
  it('E no ve 80 borrados: block xml:id, block type y group type', () => {
    expect(Object.values(result.editorialBlindSpots).reduce((a, b) => a + b, 0)).toBe(80)
    expect(result.editorialBlindSpots['ab/@type']).toBe(32)
    expect(result.editorialBlindSpots['ab/@id']).toBe(32)
    expect(result.editorialBlindSpots['seg/@type']).toBe(16)
  })
  it('96 controles de serialización sin alertas', () => {
    expect(result.controls).toEqual({ n: 96, L: 0, C: 0, E: 0, R: 0 })
  })
})

describe('audit: casos concretos del paper', () => {
  const blocks = uxulBlocks()
  it('Cp6: cambiar evidence de supplied lo ven E y R pero no L ni C', () => {
    const b = blocks.Cp6
    const m = clone(b)
    iter(m).find((e) => e.tag === T('supplied')).attrs.evidence = 'altered'
    expect(compare(b, m)).toEqual({ L: false, C: false, E: true, R: true })
  })
  it('borrar @type del bloque: E no lo ve, R sí', () => {
    const b = blocks.Cp6
    const m = clone(b)
    delete m.attrs.type
    expect(compare(b, m)).toEqual({ L: false, C: false, E: false, R: true })
  })
  it('la sangría no cuenta pero el texto significativo sí', () => {
    const b = blocks.Zp1
    expect(canonString(b)).toBe(canonString(parse(toXML(b, { indent: '\t' }))))
    const x = parse('<ab><g> x </g></ab>')
    const y = clone(x)
    y.children[0].text = 'x'
    expect(canonString(x)).not.toBe(canonString(y))
  })
  it('toda mutación cambia el árbol completo', () => {
    for (const b of Object.values(blocks)) for (const m of mutations(b)) expect(canonString(b)).not.toBe(canonString(m.candidate))
  })
})
