import { describe, it, expect } from 'vitest'
import { parse } from './helpers.js'

describe('red-team: entradas hostiles al importar TEI', () => {
  it('rechaza vacío, texto plano y XML mal formado', () => {
    for (const bad of ['', '   ', 'hola', '<ab><g></ab>', '<ab', null, undefined, 42]) {
      expect(() => parse(bad)).toThrow()
    }
  })

  it('rechaza DOCTYPE y ENTITY (XXE / billion laughs)', () => {
    const xxe = '<!DOCTYPE a [<!ENTITY x SYSTEM "file:///etc/passwd">]><a>&x;</a>'
    const laughs = '<?xml version="1.0"?><!DOCTYPE l [<!ENTITY a "aaaa"><!ENTITY b "&a;&a;&a;&a;">]><l>&b;</l>'
    expect(() => parse(xxe)).toThrow(/DOCTYPE|ENTITY/)
    expect(() => parse(laughs)).toThrow()
  })

  it('limita el tamaño y la profundidad', () => {
    expect(() => parse('<a>' + 'x'.repeat(2_100_000) + '</a>')).toThrow(/grande/)
    expect(() => parse('<a>'.repeat(5000) + '</a>'.repeat(5000))).toThrow(/anidado|mal formado/)
  })

  it('un atributo con HTML queda como texto inerte', () => {
    const t = parse('<ab n="&lt;script&gt;alert(1)&lt;/script&gt;" xmlns="http://www.tei-c.org/ns/1.0"/>')
    expect(t.attrs.n).toBe('<script>alert(1)</script>')
  })
})
