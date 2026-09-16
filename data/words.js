/**
 * Glyph Registry
 *
 * Central data structure mapping Maya transcriptions to their glyph SVGs.
 * Each entry represents a word, logogram, or syllabogram in the writing system.
 *
 * Architecture:
 * - The default export is an array of word objects for easy iteration/rendering.
 * - Helper functions (findByTranscription, searchByPrefix, getAll) provide
 *   query access without requiring consumers to filter manually.
 * - To add a new glyph, append an object following the schema below to the
 *   `words` array and place the corresponding SVG in /glifos/.
 *
 * Word object schema:
 *   {
 *     id:            string   — unique slug identifier
 *     transcription: string   — Latin-alphabet Maya transcription
 *     type:          "word" | "logogram" | "syllabogram"
 *     segments:      string[] — individual morpheme / sign segments
 *     glyphPath:     string   — relative path to the SVG file
 *     metadata:      object   — extensible bag for dates, notes, references
 *   }
 */

const words = [
  {
    id: "kal-aw-tuun",
    transcription: "k'al-aw-tuun",
    type: "word",
    segments: ["k'al", "aw", "tuun"],
    glyphPath: "/escritura_maya/escritura%20maya%20mejorada/K%C2%B4AL-wi-TUUN.svg",
    metadata: {
      language: "Classic Ch'olti'an",
      meaning: "he raises the stone / stone-raising",
      notes: "Verbal expression: k'al (to raise/set up) + wi (phonetic complement) + tuun (stone). Common formula in stela erection inscriptions.",
      source: "GlifosMayasLibro1.pdf — Mark Pitts",
    },
  },

  // ---- Plantilla para futuras entradas ----
  // Copia este bloque y ajusta los campos:
  // {
  //   id: "slug-unico",           // identificador kebab-case
  //   transcription: "ba-la-m(a)", // transcripción tal como se escribe
  //   type: "word",               // "word" | "logogram" | "syllabogram"
  //   segments: ["ba", "la", "ma"],// sílabas que forman la palabra
  //   glyphPath: "/escritura_maya/escritura%20maya%20mejorada/ARCHIVO.svg",
  //   metadata: {
  //     language: "Classic Ch'olti'an",
  //     meaning: "jaguar / significado",
  //     notes: "Notas adicionales sobre la palabra.",
  //   },
  // },
  //
  // Convenciones de carpetas en /public/escritura_maya/escritura maya mejorada/:
  //   B VOCALES/      → ba, be, bi, bo, bu
  //   CH VOCALES/     → cha, che, chi, cho, chu
  //   CH' VOCALES/    → ch'a, ch'e, ch'i
  //   H VOCALES/      → ha, he, hi, ho, hu
  //   J VOCALES/      → ja, je, ji, jo, ju
  //   K VOCALES/      → ka, ke
  //   K' VOCALES/     → k'a, k'e, k'i, k'o, k'u
  //   L VOCALES/      → la, le, li, lo, lu
  //   M VOCALES/      → ma, me, mi, mo, mu
  //   N VOCALES/      → na, ne, ni, no, nu
  //   P VOCALES/      → pa, pe, pi, po, pu
  //   S VOCALES/      → sa
  //   T VOCALES/      → (pendiente)
  //   T' VOCALES/     → (pendiente)
  //   TZ VOCALES/     → (pendiente)
  //   TZ' VOCALES/    → tz'a
  //   W VOCALES/      → wi
  //   Y VOCALES/      → ya, ye, yi, yo, yu
  //   vocales puras/  → a, e, i, o, u
  //
  // Reglas de escritura maya (GlifosMayasLibro1.pdf):
  //   1. Las sílabas siempre terminan en vocal (CV)
  //   2. La vocal muda final debe ser idéntica a la vocal anterior (armonía)
  //   3. El apóstrofe (') marca oclusión glotal: t'o ≠ to
  //   4. Los logogramas representan palabras completas
  //   5. Complemento fonético: sílabas de ayuda junto al logograma
  //   6. Orden de lectura: dos columnas simultáneas, arriba→abajo, izq→der
  //   7. Sustituciones: r→l, d→t, f→p, g→k, c(s)→s, c(k)→k, v→b, z→tz, q→k
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Find a word by exact transcription match (case-insensitive).
 * @param {string} input — transcription to look up
 * @returns {object|undefined}
 */
export function findByTranscription(input) {
  const normalised = input.trim().toLowerCase();
  return words.find((w) => w.transcription.toLowerCase() === normalised);
}

/**
 * Return all words whose transcription starts with the given prefix.
 * @param {string} prefix — leading characters to match
 * @returns {object[]}
 */
export function searchByPrefix(prefix) {
  const normalised = prefix.trim().toLowerCase();
  return words.filter((w) => w.transcription.toLowerCase().startsWith(normalised));
}

/**
 * Return the full word list.
 * @returns {object[]}
 */
export function getAll() {
  return words;
}

export default words;
