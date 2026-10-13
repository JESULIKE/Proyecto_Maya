import { describe, it, expect } from 'vitest'
import {
  createLearner, recordAnswer, scaffoldLevel, isMastered, masteryOf, overallLevel, dueConcepts,
  normalizeLearner, recommendLesson, markLessonDone, missingPrereqs, lessonStatus, levelName, DAY_MS, setAlias
} from '../lib/maya/textbook/learner.js'

const NOW = 1_700_000_000_000
const ok = (s, id, hints = 0, t = NOW) => recordAnswer(s, id, { correct: true, hints }, t)
const bad = (s, id, t = NOW) => recordAnswer(s, id, { correct: false }, t)

describe('andamiaje (RF-04 de K\'in)', () => {
  it('empieza en Aprendiz con pista visible', () => {
    const s = createLearner(NOW)
    expect(scaffoldLevel(s, 'c')).toBe(2)
    expect(levelName(s, 'c')).toBe('Aprendiz')
  })
  it('las pistas se reducen tras 3 aciertos seguidos y desaparecen tras 6', () => {
    let s = createLearner(NOW)
    for (let i = 0; i < 2; i++) s = ok(s, 'c')
    expect(scaffoldLevel(s, 'c')).toBe(2)
    s = ok(s, 'c')
    expect(scaffoldLevel(s, 'c')).toBe(1)
    expect(levelName(s, 'c')).toBe('Autónomo')
    for (let i = 0; i < 3; i++) s = ok(s, 'c')
    expect(scaffoldLevel(s, 'c')).toBe(0)
    expect(levelName(s, 'c')).toBe('Súper Pro')
  })
  it('un fallo siempre devuelve más ayuda, nunca menos', () => {
    let s = createLearner(NOW)
    for (let i = 0; i < 6; i++) s = ok(s, 'c')
    const before = scaffoldLevel(s, 'c')
    s = bad(s, 'c')
    expect(scaffoldLevel(s, 'c')).toBeGreaterThan(before)
    expect(scaffoldLevel(s, 'c')).toBe(2)
  })
  it('un acierto con la solución revelada (3 pistas) no cuenta para retirar pistas', () => {
    let s = createLearner(NOW)
    for (let i = 0; i < 5; i++) s = ok(s, 'c', 3)
    expect(scaffoldLevel(s, 'c')).toBe(2)
  })
})

describe('dominio sin castigo', () => {
  it('sube con aciertos propios más que con ayuda', () => {
    const a = ok(createLearner(NOW), 'c', 0)
    const b = ok(createLearner(NOW), 'c', 1)
    expect(masteryOf(a, 'c')).toBeGreaterThan(masteryOf(b, 'c'))
  })
  it('un fallo baja el dominio solo un poco', () => {
    let s = createLearner(NOW)
    for (let i = 0; i < 5; i++) s = ok(s, 'c')
    const before = masteryOf(s, 'c')
    s = bad(s, 'c')
    expect(masteryOf(s, 'c')).toBeGreaterThan(before * 0.8)
  })
  it('se domina con dominio alto y 3 aciertos seguidos', () => {
    let s = createLearner(NOW)
    for (let i = 0; i < 6; i++) s = ok(s, 'c')
    expect(isMastered(s, 'c')).toBe(true)
  })
  it('es inmutable', () => {
    const s = createLearner(NOW)
    const t = ok(s, 'c')
    expect(s.concepts.c).toBeUndefined()
    expect(t).not.toBe(s)
  })
})

describe('repaso espaciado', () => {
  it('un acierto sin ayuda aleja el repaso; un fallo lo trae a la próxima sesión', () => {
    let s = ok(createLearner(NOW), 'c')
    expect(dueConcepts(s, ['c'], NOW)).toEqual([])
    expect(dueConcepts(s, ['c'], NOW + 2 * DAY_MS)).toEqual(['c'])
    s = bad(s, 'c', NOW + 3 * DAY_MS)
    expect(dueConcepts(s, ['c'], NOW + 3 * DAY_MS)).toEqual(['c'])
  })
  it('lo que nunca se vio no aparece en el repaso', () => {
    expect(dueConcepts(createLearner(NOW), ['x'], NOW + 99 * DAY_MS)).toEqual([])
  })
  it('los intervalos crecen con aciertos sucesivos', () => {
    let s = createLearner(NOW)
    const gaps = []
    for (let i = 0; i < 4; i++) {
      s = ok(s, 'c', 0, NOW)
      gaps.push(s.concepts.c.due - NOW)
    }
    expect(gaps).toEqual([...gaps].sort((a, b) => a - b))
    expect(gaps[3]).toBeGreaterThan(gaps[0])
  })
})

describe('nivel general y currículo', () => {
  const curriculum = {
    concepts: [{ id: 'a', prereq: [] }, { id: 'b', prereq: ['a'] }],
    lessons: [{ id: 'l1', concepts: ['a'] }, { id: 'l2', concepts: ['b'] }]
  }
  it('el nivel general sube con los conceptos', () => {
    let s = createLearner(NOW)
    expect(overallLevel(s, ['a', 'b'])).toBe('Aprendiz')
    for (let i = 0; i < 3; i++) s = ok(s, 'a')
    expect(overallLevel(s, ['a', 'b'])).toBe('Autónomo')
    for (let i = 0; i < 6; i++) { s = ok(s, 'a'); s = ok(s, 'b') }
    expect(overallLevel(s, ['a', 'b'])).toBe('Súper Pro')
  })
  it('recomienda la primera lección con prerrequisitos cubiertos, sin bloquear las demás', () => {
    let s = createLearner(NOW)
    expect(recommendLesson(s, curriculum).id).toBe('l1')
    expect(missingPrereqs(s, curriculum, 'b')).toEqual(['a'])
    s = markLessonDone(s, 'l1')
    expect(recommendLesson(s, curriculum).id).toBe('l2')
    s = markLessonDone(s, 'l2')
    expect(recommendLesson(s, curriculum)).toBeNull()
  })
  it('estados de lección', () => {
    let s = createLearner(NOW)
    expect(lessonStatus(s, curriculum, curriculum.lessons[0])).toBe('nueva')
    s = ok(s, 'a')
    expect(lessonStatus(s, curriculum, curriculum.lessons[0])).toBe('en-curso')
    s = markLessonDone(s, 'l1')
    expect(lessonStatus(s, curriculum, curriculum.lessons[0])).toBe('completada')
  })
})

describe('red-team: almacenamiento dañado o manipulado', () => {
  it('descarta basura y versiones desconocidas', () => {
    for (const bad of [null, undefined, 42, 'x', [], { v: 99 }, { v: 1, concepts: 'no' }]) {
      const s = normalizeLearner(bad, NOW)
      expect(s.concepts).toEqual({})
    }
  })
  it('sanea valores fuera de rango, NaN y claves peligrosas', () => {
    const raw = {
      v: 1, alias: '  '.padEnd(80, 'x'),
      concepts: {
        ok: { p: 5, attempts: -3, correct: 99, streak: NaN, box: 77, due: 'x', seen: 'yes' },
        '__proto__': { p: 1 }, 'a b': { p: 1 }, constructor: null
      },
      lessons: { l: { done: 'true', completions: Infinity } }
    }
    const s = normalizeLearner(raw, NOW)
    expect(s.alias.length).toBeLessThanOrEqual(24)
    expect(Object.keys(s.concepts)).toEqual(['ok'])
    expect(s.concepts.ok).toMatchObject({ p: 1, attempts: 0, correct: 0, streak: 0, box: 4, seen: false })
    expect(s.lessons.l.done).toBe(false)
    expect({}.polluted).toBeUndefined()
  })
  it('un estado válido sobrevive a JSON', () => {
    let s = setAlias(createLearner(NOW), '  Sofía ')
    s = ok(s, 'c')
    expect(normalizeLearner(JSON.parse(JSON.stringify(s)), NOW)).toEqual(s)
  })
  it('respuestas con pistas absurdas no rompen el modelo', () => {
    let s = createLearner(NOW)
    s = recordAnswer(s, 'c', { correct: true, hints: -5 }, NOW)
    s = recordAnswer(s, 'c', { correct: true, hints: 99 }, NOW)
    s = recordAnswer(s, 'c', { correct: true, hints: NaN }, NOW)
    const c = s.concepts.c
    expect(c.p).toBeGreaterThanOrEqual(0)
    expect(c.p).toBeLessThanOrEqual(1)
    expect(Number.isFinite(c.due)).toBe(true)
  })
})
