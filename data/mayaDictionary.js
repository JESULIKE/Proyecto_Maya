/**
 * Diccionario Maya para Intelligent Textbook
 *
 * Fuentes verificables:
 * - GlifosMayasLibro1.pdf (Mark Pitts) — reglas de escritura, sílabas, ejemplos
 * - Maya_G01_Springer_Nature.pdf (Prager, Wagner, Krempel, Mercer, Grube 2025) — catálogo Thompson
 * - Proyecto_Maya.docx — marco COIL
 *
 * Convenciones (GlifosMayasLibro1.pdf §1-7):
 *  1. Las sílabas siempre terminan en vocal (CV)
 *  2. Vocal muda final = vocal anterior (armonía vocálica)
 *  3. Apóstrofe (') = oclusión glotal: t'o ≠ to
 *  4. Logogramas = palabras completas + complementos fonéticos
 *  5. Orden de lectura: dos columnas, arriba→abajo, izquierda→derecha
 *  6. Sustituciones: r→l, d→t, f→p, g→k, c(s)→s, c(k)→k, v→b, z→tz, q→k
 *  7. Maya clásico = Ch'olti'an
 *
 * Thompson codes (TWKM 2025):
 *  - 482 signos válidos (de 862 originales de Thompson)
 *  - Códigos de variante: st=standard, bt=bottom, tt=top, bh=bipartite horizontal,
 *    hh=head human, fc=full creature, ex=pars pro toto, bb=bipartite bottom,
 *    bv=bipartite vertical, etc.
 */

// ---------------------------------------------------------------------------
// VOCALS — GlifosMayasLibro1.pdf: "Las cinco vocales del maya"
// Thompson: T12(a), T542(e), T237(i), T99(o), T1(u)
// ---------------------------------------------------------------------------

export const vowels = [
  {
    id: 'a',
    syllable: 'a',
    type: 'vowel',
    thompson: '12st',
    image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/12st.svg',
    variants: [
      { thompson: '12st', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/12st.svg', variant: 'standard' },
      { thompson: '229bh', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/229bh.svg', variant: 'bipartite-horizontal' },
      { thompson: '229bl', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/229bl.svg', variant: 'bipartite-left' },
      { thompson: '238st', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/238st.svg', variant: 'standard' },
      { thompson: 'A4', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/A4.svg', variant: 'standard' },
    ],
    description: 'Vocal "a" — uno de los sonidos básicos del maya',
    source: 'GlifosMayasLibro1.pdf, p.12-15',
  },
  {
    id: 'e',
    syllable: 'e',
    type: 'vowel',
    thompson: '542st',
    image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/E/542st.svg',
    variants: [
      { thompson: '542st', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/E/542st.svg', variant: 'standard' },
      { thompson: '542ex', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/E/542ex.svg', variant: 'pars-pro-toto' },
    ],
    description: 'Vocal "e"',
    source: 'GlifosMayasLibro1.pdf, p.12-15',
  },
  {
    id: 'i',
    syllable: 'i',
    type: 'vowel',
    thompson: '679st',
    image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/I/679st.svg',
    variants: [
      { thompson: '679st', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/I/679st.svg', variant: 'standard' },
      { thompson: '237bh', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/I/237bh.svg', variant: 'bipartite-horizontal' },
    ],
    description: 'Vocal "i"',
    source: 'GlifosMayasLibro1.pdf, p.12-15',
  },
  {
    id: 'o',
    syllable: 'o',
    type: 'vowel',
    thompson: '99st',
    image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/99hc.svg',
    variants: [
      { thompson: '99hc', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/99hc.svg', variant: 'head-creature' },
      { thompson: '99ex', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/99ex.svg', variant: 'pars-pro-toto' },
      { thompson: 'O2', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/O2.svg', variant: 'standard' },
    ],
    description: 'Vocal "o"',
    source: 'GlifosMayasLibro1.pdf, p.12-15',
  },
  {
    id: 'u',
    syllable: 'u',
    type: 'vowel',
    thompson: '1st',
    image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1bh.svg',
    variants: [
      { thompson: '1bh', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1bh.svg', variant: 'bipartite-horizontal' },
      { thompson: '1ex', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1ex.svg', variant: 'pars-pro-toto' },
      { thompson: '204bt', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/204bt.svg', variant: 'bottom' },
      { thompson: '211ta', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/211ta.svg', variant: 'top-a' },
      { thompson: '211ti', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/211ti.svg', variant: 'top-i' },
      { thompson: '513bt', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/513bt.svg', variant: 'bottom' },
      { thompson: '760st', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/760st.svg', variant: 'standard' },
      { thompson: 'U6', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/U6.svg', variant: 'standard' },
    ],
    description: 'Vocal "u" — también funciona como prefijo posesivo "su"',
    source: 'GlifosMayasLibro1.pdf, p.12-15',
  },
]

// ---------------------------------------------------------------------------
// SYLLABLES — Consonant + Vowel combinations
// From syllables.json and SVG folders on disk
// ---------------------------------------------------------------------------

export const syllables = [
  // B family
  {
    id: 'ba',
    syllable: 'ba',
    type: 'syllable',
    consonant: 'B',
    vowel: 'a',
    thompson: '21',
    image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg',
    variants: [
      { thompson: '21', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/21vl.svg', variant: 'vertical-left' },
      { thompson: '301', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg', variant: 'standard' },
    ],
    description: 'Sílaba "ba" — familia B',
    source: 'GlifosMayasLibro1.pdf, p.20',
  },
  // CH family
  {
    id: 'cha',
    syllable: 'cha',
    type: 'syllable',
    consonant: 'CH',
    vowel: 'a',
    thompson: '145',
    image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/CHA_2.svg',
    variants: [
      { thompson: '145', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/145st.svg', variant: 'standard' },
      { thompson: 'CHA_2', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/CHA_2.svg', variant: 'standard' },
    ],
    description: 'Sílaba "cha" — familia CH',
    source: 'GlifosMayasLibro1.pdf, p.22',
  },
  {
    id: 'che',
    syllable: 'che',
    type: 'syllable',
    consonant: 'CH',
    vowel: 'e',
    thompson: '512',
    image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/CHE_2.svg',
    variants: [
      { thompson: '512', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/512st.svg', variant: 'standard' },
      { thompson: 'CHE_2', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/CHE_2.svg', variant: 'standard' },
    ],
    description: 'Sílaba "che" — familia CH',
    source: 'GlifosMayasLibro1.pdf, p.22',
  },
  // K family
  {
    id: 'ke',
    syllable: 'ke',
    type: 'syllable',
    consonant: 'K',
    vowel: 'e',
    thompson: '738',
    image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/KE_2.svg',
    variants: [
      { thompson: '738', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/738bh.svg', variant: 'bipartite-horizontal' },
      { thompson: 'KE_2', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/KE_2.svg', variant: 'standard' },
    ],
    description: 'Sílaba "ke" — familia K',
    source: 'GlifosMayasLibro1.pdf, p.24',
  },
  // L family
  {
    id: 'la',
    syllable: 'la',
    type: 'syllable',
    consonant: 'L',
    vowel: 'a',
    thompson: '24',
    image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg',
    variants: [
      { thompson: '24', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg', variant: 'standard' },
      { thompson: '82', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/82st.svg', variant: 'standard' },
      { thompson: '178', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/178st.svg', variant: 'standard' },
    ],
    description: 'Sílaba "la" — familia L',
    source: 'GlifosMayasLibro1.pdf, p.26',
  },
  // M family
  {
    id: 'ma',
    syllable: 'ma',
    type: 'syllable',
    consonant: 'M',
    vowel: 'a',
    thompson: '173',
    image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg',
    variants: [
      { thompson: '173', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg', variant: 'standard' },
      { thompson: '502', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/502st.svg', variant: 'standard' },
      { thompson: '19', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/19vl.svg', variant: 'vertical-left' },
    ],
    description: 'Sílaba "ma" — familia M',
    source: 'GlifosMayasLibro1.pdf, p.28',
  },
  // N family
  {
    id: 'na',
    syllable: 'na',
    type: 'syllable',
    consonant: 'N',
    vowel: 'a',
    thompson: '279',
    image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NA_2.svg',
    variants: [
      { thompson: '279', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NA_2.svg', variant: 'standard' },
      { thompson: 'NA_3', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NA_3.svg', variant: 'standard' },
    ],
    description: 'Sílaba "na" — familia N',
    source: 'GlifosMayasLibro1.pdf, p.30',
  },
  // P family
  {
    id: 'po',
    syllable: 'po',
    type: 'syllable',
    consonant: 'P',
    vowel: 'o',
    thompson: '586',
    image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/PO_2.svg',
    variants: [
      { thompson: '586', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/586st.svg', variant: 'standard' },
      { thompson: 'PO_2', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/PO_2.svg', variant: 'standard' },
    ],
    description: 'Sílaba "po" — familia P',
    source: 'GlifosMayasLibro1.pdf, p.32',
  },
  // W family
  {
    id: 'wi',
    syllable: 'wi',
    type: 'syllable',
    consonant: 'W',
    vowel: 'i',
    thompson: '130',
    image: '/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg',
    variants: [
      { thompson: '130', image: '/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg', variant: 'bipartite-horizontal' },
    ],
    description: 'Sílaba "wi" — familia W. Complemento fonético común.',
    source: 'GlifosMayasLibro1.pdf, p.34',
  },
]

// ---------------------------------------------------------------------------
// LOGOGRAMS — Words represented by a single glyph
// From GlifosMayasLibro1.pdf examples and words.js
// ---------------------------------------------------------------------------

export const logograms = [
  {
    id: 'tuun',
    word: 'TUUN',
    syllables: ['tu', 'un'],
    meaning: 'piedra',
    meaningEs: 'piedra',
    thompson: 'TUUN',
    image: '/escritura_maya/escritura%20maya%20mejorada/TUUN.svg',
    description: 'Logograma TUUN — representa la palabra completa "piedra". Thompson T177.',
    source: 'GlifosMayasLibro1.pdf — Pitts',
  },
  {
    id: 'kal',
    word: "K'AL",
    syllables: ["k'al"],
    meaning: 'levantar / erigir',
    meaningEs: 'levantar / erigir',
    thompson: "K'AL",
    image: '/escritura_maya/escritura%20maya%20mejorada/K%27AL.svg',
    description: "Logograma K'AL — 'levantar, erigir'. Fórmula común en inscripciones de erección de estelas.",
    source: 'GlifosMayasLibro1.pdf — Pitts',
  },
  {
    id: 'chan',
    word: 'CHAN',
    syllables: ['chan'],
    meaning: 'cielo',
    meaningEs: 'cielo',
    thompson: 'T530',
    image: null, // Need to find or create
    description: 'Logograma CHAN — cielo. También puede significar "serpiente" en otros contextos.',
    source: 'GlifosMayasLibro1.pdf, p.45',
  },
]

// ---------------------------------------------------------------------------
// WORDS — Complete transcriptions with meanings
// From GlifosMayasLibro1.pdf examples
// ---------------------------------------------------------------------------

export const words = [
  {
    id: 'kal-aw-tuun',
    transcription: "k'al-aw-tuun",
    reading: "K'AL-wi-TUUN",
    meaning: 'él levanta la piedra / erección de piedra',
    meaningEs: 'él levanta la piedra / erección de piedra',
    type: 'verbal',
    components: ["k'al", 'wi', 'tuun'],
    componentDetails: [
      { syllable: "k'al", role: 'verbo', meaning: 'levantar/erigir', thompson: "K'AL" },
      { syllable: 'wi', role: 'complemento fonético', meaning: '(ayuda a leer)', thompson: '130' },
      { syllable: 'tuun', role: 'nombre', meaning: 'piedra', thompson: 'TUUN' },
    ],
    glyphPath: '/escritura_maya/escritura%20maya%20mejorada/K%C2%B4AL-wi-TUUN.svg',
    description: 'Expresión verbal común en inscripciones de erección de estelas. El verbo k\'al (levantar) + complemento fonético wi + nombre tuun (piedra).',
    source: 'GlifosMayasLibro1.pdf — Mark Pitts',
    writingRules: [
      'Logograma K\'AL representa el verbo completo',
      'WI es complemento fonético (ayuda a pronunciar)',
      'TUUN es el nombre "piedra"',
      'Orden: verbo + complemento + nombre',
    ],
  },
  {
    id: 'baltan',
    transcription: 'bal-tan',
    reading: 'BAHLAM',
    meaning: 'jaguar',
    meaningEs: 'jaguar',
    type: 'logogram + phonetic complements',
    components: ['ba', 'la', 'ma'],
    componentDetails: [
      { syllable: 'ba', role: 'prefijo', meaning: 'ayuda a leer', thompson: 'T21' },
      { syllable: 'la', role: 'prefijo', meaning: 'ayuda a leer', thompson: 'T24' },
      { syllable: 'ma', role: 'sufijo', meaning: 'ayuda a leer', thompson: 'T177' },
    ],
    glyphPath: null,
    description: 'El logograma BAHLAM (jaguar) tiene complementos fonéticos que ayudan a pronunciarlo: BA-LA-MA. La /h/ no se escribía en maya antiguo.',
    source: 'GlifosMayasLibro1.pdf, p.42 — TWKM 2025',
    writingRules: [
      'Logograma = imagen de jaguar',
      'BA (T21) = prefijo fonético',
      'LA (T24) = prefijo fonético',
      'MA (T177) = sufijo fonético',
      'Lectura: B\'A-LA-M(a) → BAHLAM',
    ],
  },
  {
    id: 'chok',
    transcription: "ch'o-ko",
    reading: "CH'OK",
    meaning: 'joven / muchacho',
    meaningEs: 'joven / muchacho',
    type: 'syllabic spelling',
    components: ["ch'o", 'ko'],
    componentDetails: [
      { syllable: "ch'o", role: 'sílaba 1', meaning: 'ch\' (con oclusión glotal)', thompson: 'T93' },
      { syllable: 'ko', role: 'sílaba 2', meaning: 'ko (armonía vocálica)', thompson: 'T738' },
    ],
    glyphPath: null,
    description: 'Ejemplo de armonía vocálica: CH\'OK se escribe ch\'o-ko (ambas vocales "o"). La vocal final "o" es muda pero idéntica a la anterior.',
    source: 'GlifosMayasLibro1.pdf, p.18 — TWKM 2025',
    writingRules: [
      'Regla de armonía: vocal muda final = vocal anterior',
      "CH'OK → ch'o-ko (ambas 'o')",
      "Si fuera disharmónico como USIIJ → u-si-ja (vocal distinta indica vocal larga o glotalizada)",
    ],
  },
  {
    id: 'usij',
    transcription: 'u-si-ja',
    reading: 'USIIJ',
    meaning: 'buitre',
    meaningEs: 'buitre',
    type: 'syllabic spelling',
    components: ['u', 'si', 'ja'],
    componentDetails: [
      { syllable: 'u', role: 'prefijo posesivo', meaning: 'su (él/ella)', thompson: 'T1' },
      { syllable: 'si', role: 'sílaba 1', meaning: 'si', thompson: 'SA' },
      { syllable: 'ja', role: 'sílaba 2', meaning: 'ja', thompson: 'T266' },
    ],
    glyphPath: null,
    description: 'Ejemplo de disharmonía: USIIJ se escribe u-si-ja. La última vocal "a" es diferente de la anterior "i", lo que indica vocal larga o glotalizada.',
    source: 'TWKM 2025, p.3',
    writingRules: [
      'Disharmonía vocal = la última vocal es diferente',
      'Indica vocal larga o glotalizada',
      'U- = prefijo posesivo "su"',
    ],
  },
]

// ---------------------------------------------------------------------------
// WRITING RULES — From GlifosMayasLibro1.pdf
// ---------------------------------------------------------------------------

export const writingRules = [
  {
    id: 'cv-structure',
    rule: 'Las sílabas siempre terminan en vocal',
    description: 'Toda sílaba maya tiene estructura CV (Consonante + Vocal). No existen sílabas que terminen en consonante.',
    example: 'ba, cha, ke, la, ma — todas terminan en vocal',
    source: 'GlifosMayasLibro1.pdf, §1',
  },
  {
    id: 'vowel-harmony',
    rule: 'Armonía vocálica: la vocal muda final es idéntica a la vocal anterior',
    description: 'Cuando una palabra termina en vocal muda, esa vocal debe ser igual a la última vocal sonora.',
    example: 'CH\'OK → ch\'o-ko (ambas vocales "o")',
    source: 'GlifosMayasLibro1.pdf, §2 — TWKM 2025',
  },
  {
    id: 'glottal-stop',
    rule: "El apóstrofe (') marca oclusión glotal",
    description: "El apóstrofe indica una pausa brusca en la garganta. Cambia el significado.",
    example: "t'o ≠ to — son palabras diferentes",
    source: 'GlifosMayasLibro1.pdf, §3',
  },
  {
    id: 'logograms',
    rule: 'Los logogramas representan palabras completas',
    description: 'Un logograma es una imagen que representa una palabra entera. A menudo tiene complementos fonéticos para ayudar a la lectura.',
    example: 'BAHLAM = logograma de jaguar + BA-LA-MA (complementos)',
    source: 'GlifosMayasLibro1.pdf, §4',
  },
  {
    id: 'reading-order',
    rule: 'Orden de lectura: dos columnas, arriba→abajo, izquierda→derecha',
    description: 'Los bloques de glifos se leen en dos columnas simultáneas, de arriba hacia abajo, y de izquierda a derecha.',
    example: 'Bloque de 4 glifos: columna izquierda arriba→abajo, luego columna derecha arriba→abajo',
    source: 'GlifosMayasLibro1.pdf, §5',
  },
  {
    id: 'substitutions',
    rule: 'Sustituciones consonánticas entre maya y español',
    description: 'Al escribir palabras mayas con el alfabeto latino, se usan estas equivalencias:',
    example: 'r→l, d→t, f→p, g→k, c(s)→s, c(k)→k, v→b, z→tz, q→k',
    source: 'GlifosMayasLibro1.pdf, §6',
  },
]

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get all vowels
 */
export function getVowels() {
  return vowels
}

/**
 * Get all syllables
 */
export function getSyllables() {
  return syllables
}

/**
 * Get syllables by consonant family
 */
export function getSyllablesByFamily(family) {
  return syllables.filter(s => s.consonant === family)
}

/**
 * Get all consonant families
 */
export function getConsonantFamilies() {
  const families = [...new Set(syllables.map(s => s.consonant))]
  return families.sort()
}

/**
 * Get logograms
 */
export function getLogograms() {
  return logograms
}

/**
 * Get words
 */
export function getWords() {
  return words
}

/**
 * Get a word by ID
 */
export function getWordById(id) {
  return words.find(w => w.id === id)
}

/**
 * Get writing rules
 */
export function getWritingRules() {
  return writingRules
}

/**
 * Get all syllables and vowels combined (for activities)
 */
export function getAllSyllables() {
  return [...vowels, ...syllables]
}

/**
 * Get a random variant of a syllable
 */
export function getRandomVariant(syllable) {
  if (!syllable.variants || syllable.variants.length === 0) return syllable
  const idx = Math.floor(Math.random() * syllable.variants.length)
  return syllable.variants[idx]
}

export default {
  vowels,
  syllables,
  logograms,
  words,
  writingRules,
  getVowels,
  getSyllables,
  getSyllablesByFamily,
  getConsonantFamilies,
  getLogograms,
  getWords,
  getWordById,
  getWritingRules,
  getAllSyllables,
  getRandomVariant,
}
