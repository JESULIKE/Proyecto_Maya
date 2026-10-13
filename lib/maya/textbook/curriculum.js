// lib/maya/textbook/curriculum.js
// Modelo del dominio y del contenido del libro interactivo (datos puros).
//
// Dominio: conceptos con prerrequisitos (blandos: aconsejan, no bloquean).
// Contenido: lecciones etiquetadas con los conceptos que cubren.
// Los hechos sobre la escritura maya se limitan a lo básico y establecido (escritura logosilábica,
// bloques, orden de lectura en columnas pareadas, b'alam como logograma o b'a-la-ma).
// Contenido educativo en validación epigráfica: ver nota al pie del libro.

export const CONCEPTS = [
  { id: 'glifo', title: 'Qué es un glifo', prereq: [], reveal: 'ba' },
  { id: 'vocales', title: 'Las vocales', prereq: [], reveal: 'a' },
  { id: 'silabas-a', title: 'Sílabas con A', prereq: ['vocales'], reveal: 'ma' },
  { id: 'cv', title: 'Consonante + vocal', prereq: ['silabas-a'], reveal: 'ni' },
  { id: 'bloques', title: 'Bloques de glifos', prereq: ['glifo'], reveal: 'la' },
  { id: 'lectura', title: 'Orden de lectura', prereq: ['bloques'], reveal: 'sa' },
  { id: 'escribir', title: 'Escribir con glifos', prereq: ['cv', 'lectura'], reveal: 'ya' }
]

export const UNITS = [
  { id: 'u1', title: 'Conoce los glifos', color: 'maya' },
  { id: 'u2', title: 'Los sonidos', color: 'esmeralda' },
  { id: 'u3', title: 'Bloques y lectura', color: 'terracota' },
  { id: 'u4', title: 'Escribe tú', color: 'ocre' }
]

// Familias de sílabas del catálogo (solo signos completos «standard»)
export const POOLS = {
  vocales: ['a', 'e', 'i', 'o', 'u'],
  'silabas-a': ['ba', 'la', 'ma', 'na', 'pa', 'sa', 'ya', 'ha', 'ja', 'cha'],
  'familia-n': ['na', 'ne', 'ni', 'no', 'nu'],
  'familia-y': ['ya', 'ye', 'yi', 'yo', 'yu']
}

/**
 * Pasos de cada lección.
 *  explain: contenido breve con una visual.   item: ejercicios generados (itemType, count).
 *  example: ejemplo resuelto que se va desvaneciendo (steps de tipo build con `given`).
 */
export const LESSONS = [
  {
    id: 'que-es-un-glifo', unit: 'u1', title: '¿Qué es un glifo?', minutes: 4, concepts: ['glifo'],
    goal: 'Distinguir un logograma de un silabograma.',
    steps: [
      { kind: 'explain', title: 'Dibujos que son lenguaje',
        body: ['Hace más de mil años, los mayas escribían con **glifos**: signos que parecen dibujos pero representan palabras y sonidos.',
          'Los tallaban en piedra y los pintaban en libros de corteza de árbol.'],
        visual: { type: 'glyphs', syllables: ['ba', 'la', 'ma'] }, note: 'Estos tres glifos son sílabas. Más adelante aprenderás a leerlos.' },
      { kind: 'explain', title: 'Dos tipos de glifo',
        body: ['Un **logograma** es un signo que representa una palabra entera. Por ejemplo, un signo con cabeza de jaguar se lee *b\'alam*, «jaguar».',
          'Un **silabograma** representa una sílaba, como *ba* o *la*. Combinando silabogramas se puede escribir cualquier palabra.'] },
      { kind: 'explain', title: 'Una palabra, varias formas',
        body: ['La palabra *b\'alam* (jaguar) se podía escribir con un solo logograma, o sílaba por sílaba: *b\'a-la-ma*.',
          'Los escribas elegían la forma que mejor cabía y se veía.'],
        visual: { type: 'glyphs', syllables: ['ba', 'la', 'ma'], arrows: true } },
      { kind: 'item', itemType: 'text', concept: 'glifo', count: 4 }
    ]
  },
  {
    id: 'vocales', unit: 'u2', title: 'Las cinco vocales', minutes: 5, concepts: ['vocales'],
    goal: 'Reconocer los glifos de a, e, i, o, u.',
    steps: [
      { kind: 'explain', title: 'Cinco vocales, cinco glifos',
        body: ['El maya clásico se escribe con cinco vocales: **a, e, i, o, u**. Cada una tiene su glifo.',
          'Un mismo sonido puede tener varios glifos distintos (variantes). Aquí ves una de cada.'],
        visual: { type: 'glyphs', syllables: ['a', 'e', 'i', 'o', 'u'] }, note: 'Toca un glifo para fijarte bien en su forma.' },
      { kind: 'item', itemType: 'sound', concept: 'vocales', pool: 'vocales', count: 3 },
      { kind: 'item', itemType: 'glyph', concept: 'vocales', pool: 'vocales', count: 3 },
      { kind: 'item', itemType: 'match', concept: 'vocales', pool: 'vocales', count: 1 }
    ]
  },
  {
    id: 'silabas-con-a', unit: 'u2', title: 'Sílabas: consonante + a', minutes: 6, concepts: ['silabas-a'],
    goal: 'Leer glifos de sílaba con la vocal a.',
    steps: [
      { kind: 'explain', title: 'Un glifo, una sílaba',
        body: ['Casi todos los silabogramas son **consonante + vocal**. Por ejemplo, *ba* es la consonante *b* con la vocal *a*.',
          'Cada glifo guarda las dos partes en un solo signo.'],
        visual: { type: 'glyphs', syllables: ['ba', 'la', 'ma', 'na', 'pa', 'sa'] } },
      { kind: 'item', itemType: 'glyph', concept: 'silabas-a', pool: 'silabas-a', count: 4 },
      { kind: 'item', itemType: 'sound', concept: 'silabas-a', pool: 'silabas-a', count: 3 },
      { kind: 'item', itemType: 'match', concept: 'silabas-a', pool: 'silabas-a', count: 1 }
    ]
  },
  {
    id: 'una-consonante-cinco-vocales', unit: 'u2', title: 'Una consonante, cinco vocales', minutes: 6, concepts: ['cv'],
    goal: 'Ver que cambiar la vocal cambia el glifo.',
    steps: [
      { kind: 'explain', title: 'La familia de la N',
        body: ['Mira la familia de la **n**: *na, ne, ni, no, nu*. Todas empiezan con el mismo sonido y cambian la vocal.',
          'Y lo mismo pasa con la **y**: *ya, ye, yi, yo, yu*. Cada cambio de vocal es un glifo distinto.'],
        visual: { type: 'families', rows: [['na', 'ne', 'ni', 'no', 'nu'], ['ya', 'ye', 'yi', 'yo', 'yu']] } },
      { kind: 'item', itemType: 'glyph', concept: 'cv', pool: ['familia-n', 'familia-y'], count: 4, sameFamily: true },
      { kind: 'item', itemType: 'sound', concept: 'cv', pool: ['familia-n', 'familia-y'], count: 3, sameFamily: true },
      { kind: 'item', itemType: 'match', concept: 'cv', pool: ['familia-n', 'familia-y'], count: 1, sameFamily: true }
    ]
  },
  {
    id: 'bloques-de-glifos', unit: 'u3', title: 'Bloques de glifos', minutes: 6, concepts: ['bloques'],
    goal: 'Encontrar el signo principal y el orden dentro de un bloque.',
    steps: [
      { kind: 'explain', title: 'Los glifos se agrupan en bloques',
        body: ['Los mayas no escribían en una fila: juntaban varios glifos en un **bloque**, como un pequeño rompecabezas.'],
        visual: { type: 'block', parts: [{ pos: 'main', syllable: 'ba' }, { pos: 'left', syllable: 'u' }, { pos: 'bottom', syllable: 'ya' }], labels: false },
        note: 'Es un ejemplo para entender la idea; los bloques reales cambian de forma.' },
      { kind: 'explain', title: 'Signo principal y afijos',
        body: ['El **signo principal** es el más grande. Los más pequeños que lo rodean son **afijos**.',
          'Los que van a la izquierda o arriba se leen antes; los que van a la derecha o abajo, después.'],
        visual: { type: 'block', parts: [{ pos: 'main', syllable: 'ba' }, { pos: 'left', syllable: 'u' }, { pos: 'bottom', syllable: 'ya' }], labels: true } },
      { kind: 'explain', title: 'Cómo se lee un bloque',
        body: ['Dentro de un bloque se lee **de arriba hacia abajo y de izquierda a derecha**.'] },
      { kind: 'item', itemType: 'block', concept: 'bloques', count: 4 }
    ]
  },
  {
    id: 'orden-de-lectura', unit: 'u3', title: 'El zigzag de la lectura', minutes: 5, concepts: ['lectura'],
    goal: 'Seguir el orden de lectura de varios bloques.',
    steps: [
      { kind: 'explain', title: 'Leer en columnas de a dos',
        body: ['Los bloques se leen **de dos en dos columnas**: primero el de arriba a la izquierda, luego el de su derecha, y bajas a la siguiente fila.',
          'Es un zigzag descendente: 1, 2, 3, 4, 5, 6.'],
        visual: { type: 'zigzag' },
        note: 'A veces el texto iba en una sola columna, en una fila o en forma de L, según el espacio de la piedra.' },
      { kind: 'item', itemType: 'order', concept: 'lectura', count: 3 }
    ]
  },
  {
    id: 'escribe-palabras', unit: 'u4', title: 'Escribe con glifos', minutes: 8, concepts: ['escribir'],
    goal: 'Escribir una palabra sílaba por sílaba.',
    steps: [
      { kind: 'explain', title: 'Escribamos «jaguar»',
        body: ['En maya, jaguar se dice *b\'alam*. Vamos a escribirlo con silabogramas: **b\'a – la – ma**.',
          'Se escribe sílaba por sílaba, y al terminar los glifos se leen en orden.'],
        visual: { type: 'glyphs', syllables: ['ba', 'la', 'ma'], arrows: true }, note: 'Primero te lo muestro entero; después tú completas cada vez más.' },
      { kind: 'build', concept: 'escribir', target: ['ba', 'la', 'ma'], given: 2, prompt: 'Completa b\'alam: ya están b\'a y la. ¿Qué sílaba falta?', meaning: 'jaguar', real: true },
      { kind: 'build', concept: 'escribir', target: ['ba', 'la', 'ma'], given: 0, prompt: 'Ahora escribe b\'alam entero: b\'a – la – ma.', meaning: 'jaguar', real: true },
      { kind: 'build', concept: 'escribir', target: ['ma', 'na', 'pa'], given: 0, prompt: 'Práctica con sonidos: ma – na – pa.', real: false },
      { kind: 'build', concept: 'escribir', target: ['ba', 'la', 'ma'], given: 0, prompt: 'Sin ayuda: escribe «jaguar» en maya con sílabas.', meaning: 'jaguar', real: true, hideSounds: true }
    ]
  }
]

export const CURRICULUM = { concepts: CONCEPTS, units: UNITS, lessons: LESSONS }

// ---------- Utilidades ----------

/** Generador pseudoaleatorio reproducible (mulberry32). */
export function makeRng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle(list, rng) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pick = (list, rng) => list[Math.floor(rng() * list.length)]

/** Mapa sílaba → imagen del signo completo («standard») del catálogo. */
export function glyphIndex(catalog) {
  const map = {}
  for (const s of catalog) if (s.variant === 'standard' && !map[s.syllable]) map[s.syllable] = s.image
  return map
}

/** Sílaba para mostrar: en transliteración maya la b es glotalizada (b'a). */
export const label = (syl) => (syl === 'ba' ? "b'a" : syl)

const poolList = (spec) => (Array.isArray(spec) ? spec.flatMap((p) => POOLS[p] || []) : POOLS[spec] || [])

// ---------- Generadores de ejercicios ----------

const HINT_TEXT = {
  glifo: 'Piensa en lo que acabas de leer: ¿el signo representa una palabra completa o solo un sonido?',
  vocales: 'Solo hay cinco vocales: a, e, i, o, u. Pronuncia cada una y compara con la forma del glifo.',
  'silabas-a': 'Cada glifo es consonante + a. Fíjate primero en la consonante que oyes.',
  cv: 'Las opciones comparten la consonante. La diferencia está en la vocal: escúchala bien.'
}

const eliminable = (options, answerIdx, rng) => {
  const wrong = options.map((_, i) => i).filter((i) => i !== answerIdx)
  return shuffle(wrong, rng).slice(0, Math.max(0, wrong.length - 1))
}

function distractors(answer, pool, n, rng, sameFamily) {
  let candidates = pool.filter((s) => s !== answer)
  if (sameFamily) {
    const family = candidates.filter((s) => s[0] === answer[0])
    if (family.length >= n) candidates = family
  }
  return shuffle(candidates, rng).slice(0, n)
}

function choiceGlyph(concept, syllable, pool, images, rng, opts) {
  const others = distractors(syllable, pool.filter((s) => images[s]), 3, rng, opts.sameFamily)
  const syllables = shuffle([syllable, ...others], rng)
  const answer = syllables.indexOf(syllable)
  return {
    type: 'choice', concept, kind: 'glyph',
    prompt: `¿Cuál glifo se lee «${label(syllable)}»?`,
    options: syllables.map((s) => ({ image: images[s], alt: `Glifo ${label(s)}`, key: s })),
    answer,
    hints: [HINT_TEXT[concept] || 'Piensa en el sonido y compara las formas.', 'Quité dos opciones que no son.', 'Te muestro la respuesta: míralo y recuerda su forma.'],
    eliminate: eliminable(syllables, answer, rng),
    explain: (pickedIdx) => `Ese glifo se lee «${label(syllables[pickedIdx])}». Busca el que se lee «${label(syllable)}».`,
    reveal: { image: images[syllable], text: label(syllable) }
  }
}

function choiceSound(concept, syllable, pool, images, rng, opts) {
  const others = distractors(syllable, pool.filter((s) => images[s]), 3, rng, opts.sameFamily)
  const syllables = shuffle([syllable, ...others], rng)
  const answer = syllables.indexOf(syllable)
  return {
    type: 'choice', concept, kind: 'sound',
    prompt: '¿Cómo se lee este glifo?',
    promptImage: images[syllable],
    options: syllables.map((s) => ({ text: label(s), key: s })),
    answer,
    hints: [HINT_TEXT[concept] || 'Piensa en el sonido y compara las formas.', 'Quité dos opciones que no son.', 'Te muestro la respuesta: míralo y recuerda su forma.'],
    eliminate: eliminable(syllables, answer, rng),
    explain: (pickedIdx) => `Casi. Ese glifo se lee «${label(syllable)}», no «${label(syllables[pickedIdx])}».`,
    reveal: { image: images[syllable], text: label(syllable) }
  }
}

function matchItem(concept, pool, images, rng, opts) {
  const base = opts.sameFamily ? pool.filter((s) => s[0] === pool[0][0]) : pool
  const syllables = shuffle(base.filter((s) => images[s]), rng).slice(0, 4)
  return {
    type: 'match', concept,
    prompt: 'Une cada glifo con su sonido.',
    pairs: syllables.map((s) => ({ key: s, image: images[s], text: label(s) })),
    order: shuffle(syllables, rng),
    hints: ['Empieza por el que mejor reconozcas.', 'Te resalto una pareja.', 'Te muestro todas las parejas.'],
    explain: () => 'Esa no es pareja. Inténtalo con otro sonido.'
  }
}

const TEXT_BANK = [
  { q: 'Un **silabograma** representa…', options: ['Una sílaba', 'Una palabra completa', 'Una letra del alfabeto español'], answer: 0, why: 'Un silabograma es un signo que vale por una sílaba, como ba o la.' },
  { q: 'Un **logograma** representa…', options: ['Una palabra completa', 'Solo un sonido', 'Un número'], answer: 0, why: 'Un logograma vale por una palabra entera, por ejemplo b\'alam («jaguar»).' },
  { q: '¿Cómo se podía escribir *b\'alam* (jaguar)?', options: ['Con un logograma o con silabogramas', 'Solo con un logograma', 'Solo con silabogramas'], answer: 0, why: 'Se podía con un logograma o sílaba por sílaba: b\'a-la-ma.' },
  { q: 'Verdadero o falso: los glifos son solo adornos y no representan lenguaje.', options: ['Falso', 'Verdadero'], answer: 0, why: 'Falso: son signos de un sistema de escritura que representa palabras y sonidos.' },
  { q: 'Mezclando silabogramas se puede escribir…', options: ['Cualquier palabra', 'Solo nombres de dioses', 'Solo números'], answer: 0, why: 'Con sílabas se puede escribir cualquier palabra de la lengua.' }
]

function textItem(concept, index, rng) {
  const q = TEXT_BANK[index % TEXT_BANK.length]
  const order = shuffle(q.options.map((text, i) => ({ text, ok: i === q.answer })), rng)
  const answer = order.findIndex((o) => o.ok)
  return {
    type: 'choice', concept, kind: 'text',
    prompt: q.q,
    options: order.map((o) => ({ text: o.text })),
    answer,
    hints: [HINT_TEXT.glifo, 'Quité una opción que no es.', 'Te muestro la respuesta y por qué.'],
    eliminate: eliminable(order, answer, rng),
    explain: () => q.why,
    reveal: { text: q.why }
  }
}

// Bloque con 2 o 3 signos para preguntas de signo principal y orden dentro del bloque
const BLOCK_LAYOUTS = [
  { parts: [{ pos: 'main' }, { pos: 'left' }, { pos: 'bottom' }], first: 'left', last: 'bottom' },
  { parts: [{ pos: 'main' }, { pos: 'top' }, { pos: 'right' }], first: 'top', last: 'right' },
  { parts: [{ pos: 'main' }, { pos: 'left' }], first: 'left', last: 'main' },
  { parts: [{ pos: 'main' }, { pos: 'bottom' }], first: 'main', last: 'bottom' },
  { parts: [{ pos: 'main' }, { pos: 'left' }, { pos: 'right' }], first: 'left', last: 'right' }
]

function blockItem(concept, images, rng, variant) {
  const layout = pick(BLOCK_LAYOUTS, rng)
  const names = shuffle(Object.keys(images).filter((s) => s.length > 1), rng).slice(0, layout.parts.length)
  const letters = ['A', 'B', 'C']
  const parts = layout.parts.map((p, i) => ({ ...p, syllable: names[i], image: images[names[i]], letter: letters[i] }))
  const kinds = ['main', 'first', 'last']
  const kind = variant || pick(kinds, rng)
  const prompts = {
    main: '¿Cuál es el signo principal (el más grande)?',
    first: 'Dentro del bloque, ¿qué signo se lee primero?',
    last: 'Dentro del bloque, ¿qué signo se lee al final?'
  }
  const target = kind === 'main' ? 'main' : kind === 'first' ? layout.first : layout.last
  const answerPart = parts.find((p) => p.pos === target)
  const answerLetter = answerPart.letter
  const options = parts.map((p) => ({ text: `Signo ${p.letter}`, key: p.letter }))
  const answer = options.findIndex((o) => o.key === answerLetter)
  const hintsByKind = {
    main: 'El signo principal es el que ocupa más espacio y está en el centro.',
    first: 'Se lee de arriba hacia abajo y de izquierda a derecha: busca el que queda más arriba o más a la izquierda.',
    last: 'Se lee de arriba hacia abajo y de izquierda a derecha: busca el que queda más abajo o más a la derecha.'
  }
  return {
    type: 'choice', concept, kind: 'block',
    prompt: prompts[kind],
    block: { parts, labels: true },
    options, answer,
    hints: [hintsByKind[kind], 'Quité una opción que no es.', 'Te muestro la respuesta en el bloque.'],
    eliminate: eliminable(options, answer, rng),
    explain: () => hintsByKind[kind],
    reveal: { text: `Signo ${answerLetter}`, highlight: answerLetter }
  }
}

function orderItem(concept, images, rng, size) {
  const cols = 2
  const rows = size / cols
  const names = shuffle(Object.keys(images).filter((s) => s.length > 1), rng).slice(0, size)
  const colLabel = ['A', 'B']
  const blocks = names.map((s, i) => {
    const r = Math.floor(i / cols)
    const c = i % cols
    return { id: `${colLabel[c]}${r + 1}`, syllable: s, image: images[s], row: r, col: c }
  })
  // Orden correcto: A1, B1, A2, B2, …
  const correct = blocks.map((b) => b.id)
  return {
    type: 'order', concept,
    prompt: 'Toca los bloques en el orden en que se leen.',
    cols, rows, blocks,
    correct,
    hints: ['Empieza por el bloque de arriba a la izquierda y ve de a dos columnas.', 'Te marco el siguiente bloque.', 'Te muestro el orden completo.'],
    explain: () => 'Se lee de dos en dos columnas: A1, B1, luego A2, B2, y así hacia abajo.'
  }
}

function buildItem(step, images, rng) {
  const target = step.target
  const distract = shuffle(Object.keys(images).filter((s) => !target.includes(s) && s.length > 1), rng).slice(0, 3)
  const tiles = shuffle([...new Set([...target, ...distract])], rng)
  return {
    type: 'build', concept: step.concept,
    prompt: step.prompt,
    target,
    given: step.given || 0,
    meaning: step.meaning || '',
    real: step.real !== false,
    showSounds: !step.hideSounds,
    tiles: tiles.map((s) => ({ key: s, image: images[s], text: label(s) })),
    hints: [step.hideSounds ? 'b\'alam suena «b\'a – la – ma»: son tres sílabas.' : 'Se escribe sílaba por sílaba, de izquierda a derecha.', 'Dejé solo las sílabas que necesitas.', 'Te muestro cómo se escribe.'],
    explain: () => 'Revisa el orden: se escribe sílaba por sílaba, de izquierda a derecha.'
  }
}

/** Crea un ejercicio suelto para un concepto (se usa en el repaso espaciado). */
export function makeItemForConcept(conceptId, catalog, rng) {
  const images = glyphIndex(catalog)
  switch (conceptId) {
    case 'glifo': return textItem('glifo', Math.floor(rng() * TEXT_BANK.length), rng)
    case 'vocales':
    case 'silabas-a':
    case 'cv': {
      const pool = conceptId === 'vocales' ? POOLS.vocales : conceptId === 'silabas-a' ? POOLS['silabas-a'] : [...POOLS['familia-n'], ...POOLS['familia-y']]
      const usable = pool.filter((s) => images[s])
      const syl = pick(usable, rng)
      const opts = { sameFamily: conceptId === 'cv' }
      return rng() < 0.5 ? choiceGlyph(conceptId, syl, usable, images, rng, opts) : choiceSound(conceptId, syl, usable, images, rng, opts)
    }
    case 'bloques': return blockItem('bloques', images, rng)
    case 'lectura': return orderItem('lectura', images, rng, rng() < 0.5 ? 4 : 6)
    case 'escribir': return buildItem({ concept: 'escribir', target: ['ba', 'la', 'ma'], prompt: 'Escribe b\'alam (jaguar): b\'a – la – ma.', meaning: 'jaguar', real: true }, images, rng)
    default: return null
  }
}

/**
 * Convierte los pasos de una lección en una lista concreta de pasos del reproductor.
 * Los ejercicios se generan con la semilla dada, así una misma partida es reproducible.
 */
export function buildLessonSteps(lesson, catalog, seed = 1) {
  const rng = makeRng(seed)
  const images = glyphIndex(catalog)
  const out = []
  for (const step of lesson.steps) {
    if (step.kind === 'explain') out.push({ ...step })
    else if (step.kind === 'build') out.push({ kind: 'item', item: buildItem(step, images, rng) })
    else if (step.kind === 'item') {
      const pool = poolList(step.pool).filter((s) => images[s])
      const opts = { sameFamily: !!step.sameFamily }
      const used = new Set()
      for (let i = 0; i < step.count; i++) {
        let item
        if (step.itemType === 'glyph' || step.itemType === 'sound') {
          // Evita repetir la misma sílaba mientras queden sin usar
          const fresh = pool.filter((s) => !used.has(s))
          const syl = pick(fresh.length ? fresh : pool, rng)
          used.add(syl)
          item = step.itemType === 'glyph' ? choiceGlyph(step.concept, syl, pool, images, rng, opts) : choiceSound(step.concept, syl, pool, images, rng, opts)
        } else if (step.itemType === 'match') item = matchItem(step.concept, pool, images, rng, opts)
        else if (step.itemType === 'text') item = textItem(step.concept, i, rng)
        else if (step.itemType === 'block') item = blockItem(step.concept, images, rng, ['main', 'first', 'last', 'main'][i % 4])
        else if (step.itemType === 'order') item = orderItem(step.concept, images, rng, i === 0 ? 4 : 6)
        if (item) out.push({ kind: 'item', item })
      }
    }
  }
  return out
}

export const conceptById = (id) => CONCEPTS.find((c) => c.id === id)
export const lessonById = (id) => LESSONS.find((l) => l.id === id)
