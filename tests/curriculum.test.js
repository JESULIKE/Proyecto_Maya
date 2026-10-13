import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import {
  CONCEPTS, LESSONS, POOLS, buildLessonSteps, makeItemForConcept, makeRng, glyphIndex, lessonById
} from '../lib/maya/textbook/curriculum.js'

const catalog = JSON.parse(readFileSync(new URL('../data/syllables.json', import.meta.url), 'utf8'))
const images = glyphIndex(catalog)

describe('currículo: coherencia', () => {
  it('todos los conceptos de las lecciones existen y los prerrequisitos no forman ciclos', () => {
    const ids = new Set(CONCEPTS.map((c) => c.id))
    for (const l of LESSONS) for (const c of l.concepts) expect(ids.has(c), `${l.id}:${c}`).toBe(true)
    for (const c of CONCEPTS) for (const p of c.prereq) expect(ids.has(p)).toBe(true)
    const visiting = new Set()
    const visit = (id) => {
      expect(visiting.has(id), `ciclo en ${id}`).toBe(false)
      visiting.add(id)
      CONCEPTS.find((c) => c.id === id).prereq.forEach(visit)
      visiting.delete(id)
    }
    CONCEPTS.forEach((c) => visit(c.id))
  })
  it('cada concepto se enseña en al menos una lección', () => {
    for (const c of CONCEPTS) expect(LESSONS.some((l) => l.concepts.includes(c.id)), c.id).toBe(true)
  })
  it('todas las sílabas de las familias y del «reveal» tienen signo completo y archivo en disco', () => {
    const all = new Set([...Object.values(POOLS).flat(), ...CONCEPTS.map((c) => c.reveal)])
    for (const s of all) {
      expect(images[s], `falta signo standard de ${s}`).toBeTruthy()
      expect(existsSync(new URL(`../public${images[s]}`, import.meta.url)), images[s]).toBe(true)
    }
  })
  it('las sílabas de las visuales de las lecciones existen', () => {
    for (const l of LESSONS) for (const st of l.steps) {
      const sy = [...(st.visual?.syllables || []), ...(st.visual?.rows?.flat() || []), ...(st.visual?.parts?.map((p) => p.syllable) || []), ...(st.target || [])]
      for (const s of sy) expect(images[s], `${l.id}:${s}`).toBeTruthy()
    }
  })
})

describe('ejercicios generados', () => {
  const lessonSteps = (lesson, seed) => buildLessonSteps(lesson, catalog, seed).filter((s) => s.kind === 'item').map((s) => s.item)

  it('cada lección genera pasos y ejercicios', () => {
    for (const l of LESSONS) {
      const steps = buildLessonSteps(l, catalog, 7)
      expect(steps.length, l.id).toBeGreaterThan(1)
    }
  })

  it('invariantes de los ejercicios de elección (300 semillas)', () => {
    for (let seed = 1; seed <= 300; seed++) {
      for (const l of LESSONS) {
        for (const it of lessonSteps(l, seed).filter((i) => i.type === 'choice')) {
          expect(it.answer).toBeGreaterThanOrEqual(0)
          expect(it.answer).toBeLessThan(it.options.length)
          const keys = it.options.map((o) => o.key ?? o.text)
          expect(new Set(keys).size, `${l.id}#${seed} opciones repetidas`).toBe(keys.length)
          for (const o of it.options) if (o.image) expect(o.image).toMatch(/^\/glifos_maya\//)
          // La pista de eliminar nunca quita la respuesta y deja al menos un distractor
          expect(it.eliminate).not.toContain(it.answer)
          expect(it.eliminate.length).toBe(it.options.length - 2)
          expect(it.hints).toHaveLength(3)
          expect(typeof it.explain(it.answer === 0 ? 1 : 0)).toBe('string')
        }
      }
    }
  }, 30000)

  it('el ejercicio de glifo nunca pide un glifo cuya imagen no está entre las opciones', () => {
    for (let seed = 1; seed <= 200; seed++) {
      for (const it of lessonSteps(lessonById('silabas-con-a'), seed).filter((i) => i.kind === 'glyph')) {
        expect(it.options[it.answer].image).toBe(it.reveal.image)
      }
    }
  })

  it('«una consonante, cinco vocales» usa distractores de la misma familia', () => {
    for (let seed = 1; seed <= 100; seed++) {
      for (const it of lessonSteps(lessonById('una-consonante-cinco-vocales'), seed).filter((i) => i.type === 'choice')) {
        const firsts = new Set(it.options.map((o) => (o.key || o.text)[0]))
        expect(firsts.size).toBe(1)
      }
    }
  })

  it('el orden de lectura correcto es A1, B1, A2, B2…', () => {
    for (let seed = 1; seed <= 50; seed++) {
      for (const it of lessonSteps(lessonById('orden-de-lectura'), seed)) {
        expect(it.type).toBe('order')
        expect(it.correct.slice(0, 4)).toEqual(['A1', 'B1', 'A2', 'B2'])
        expect(new Set(it.blocks.map((b) => b.syllable)).size).toBe(it.blocks.length)
      }
    }
  })

  it('las preguntas de bloque tienen respuesta coherente con la posición', () => {
    for (let seed = 1; seed <= 300; seed++) {
      for (const it of lessonSteps(lessonById('bloques-de-glifos'), seed)) {
        const letter = it.options[it.answer].key
        const part = it.block.parts.find((p) => p.letter === letter)
        if (it.prompt.includes('principal')) expect(part.pos).toBe('main')
      }
    }
  })

  it('los ejercicios de escritura incluyen la respuesta entre las fichas', () => {
    for (const it of lessonSteps(lessonById('escribe-palabras'), 3)) {
      for (const s of it.target) expect(it.tiles.some((t) => t.key === s)).toBe(true)
      expect(it.given).toBeLessThan(it.target.length)
    }
  })

  it('son reproducibles por semilla y varían entre semillas', () => {
    const a = JSON.stringify(lessonSteps(lessonById('vocales'), 11).map((i) => i.options?.map((o) => o.key)))
    const b = JSON.stringify(lessonSteps(lessonById('vocales'), 11).map((i) => i.options?.map((o) => o.key)))
    const c = JSON.stringify(lessonSteps(lessonById('vocales'), 12).map((i) => i.options?.map((o) => o.key)))
    expect(a).toBe(b)
    expect(a).not.toBe(c)
  })

  it('makeItemForConcept sirve para todos los conceptos (repaso)', () => {
    for (const c of CONCEPTS) for (let seed = 1; seed <= 50; seed++) {
      const it = makeItemForConcept(c.id, catalog, makeRng(seed))
      expect(it, c.id).toBeTruthy()
      expect(it.concept).toBe(c.id)
    }
    expect(makeItemForConcept('no-existe', catalog, makeRng(1))).toBeNull()
  })
})
