/**
 * Catálogo de Glifos — Mapeo completo de SVGs a códigos Thompson
 *
 * Generado escaneando /public/escritura_maya/escritura maya mejorada/
 * y cruzando con syllables.json + thompson-mapping.json
 *
 * Thompson codes (TWKM 2025):
 * - st = standard
 * - bt = bottom
 * - tt = top
 * - bh = bipartite horizontal
 * - bb = bipartite bottom
 * - bv = bipartite vertical
 * - bl = bipartite left
 * - hh = head human
 * - hc = head creature
 * - ex = pars pro toto
 * - vl = vertical left
 * - vs = vertical stack
 * - ta = top-a
 * - ti = top-i
 * - md = middle
 * - mp = middle part
 * - tv = top vertical
 * - br = bottom right
 */

export const glyphCatalog = {
  // -----------------------------------------------------------------------
  // VOWELS — vocales puras/
  // -----------------------------------------------------------------------
  vowels: [
    { thompson: '12st', syllable: 'a', family: 'A', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/12st.svg' },
    { thompson: '229bh', syllable: 'a', family: 'A', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/229bh.svg' },
    { thompson: '229bl', syllable: 'a', family: 'A', variant: 'bipartite-left', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/229bl.svg' },
    { thompson: '238st', syllable: 'a', family: 'A', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/238st.svg' },
    { thompson: 'A4', syllable: 'a', family: 'A', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/A/A4.svg' },
    { thompson: '542st', syllable: 'e', family: 'E', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/E/542st.svg' },
    { thompson: '542ex', syllable: 'e', family: 'E', variant: 'pars-pro-toto', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/E/542ex.svg' },
    { thompson: '679st', syllable: 'i', family: 'I', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/I/679st.svg' },
    { thompson: '237bh', syllable: 'i', family: 'I', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/I/237bh.svg' },
    { thompson: '99hc', syllable: 'o', family: 'O', variant: 'head-creature', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/99hc.svg' },
    { thompson: '99ex', syllable: 'o', family: 'O', variant: 'pars-pro-toto', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/99ex.svg' },
    { thompson: 'O2', syllable: 'o', family: 'O', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/O/O2.svg' },
    { thompson: '1bh', syllable: 'u', family: 'U', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1bh.svg' },
    { thompson: '1ex', syllable: 'u', family: 'U', variant: 'pars-pro-toto', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/1ex.svg' },
    { thompson: '204bt', syllable: 'u', family: 'U', variant: 'bottom', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/204bt.svg' },
    { thompson: '211ta', syllable: 'u', family: 'U', variant: 'top-a', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/211ta.svg' },
    { thompson: '211ti', syllable: 'u', family: 'U', variant: 'top-i', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/211ti.svg' },
    { thompson: '513bt', syllable: 'u', family: 'U', variant: 'bottom', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/513bt.svg' },
    { thompson: '760st', syllable: 'u', family: 'U', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/760st.svg' },
    { thompson: 'U6', syllable: 'u', family: 'U', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/vocales%20puras/U/U6.svg' },
  ],

  // -----------------------------------------------------------------------
  // B FAMILY — B VOCALES/
  // -----------------------------------------------------------------------
  B: [
    { thompson: '21vl', syllable: 'ba', family: 'B', variant: 'vertical-left', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/21vl.svg' },
    { thompson: '21vs', syllable: 'ba', family: 'B', variant: 'vertical-stack', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/21vs.svg' },
    { thompson: '301st', syllable: 'ba', family: 'B', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/301st.svg' },
    { thompson: '501hh', syllable: 'ba', family: 'B', variant: 'head-human', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/501hh.svg' },
    { thompson: '501st', syllable: 'ba', family: 'B', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/501st.svg' },
    { thompson: '519st', syllable: 'ba', family: 'B', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/519st.svg' },
    { thompson: '585hc', syllable: 'ba', family: 'B', variant: 'head-creature', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/585hc.svg' },
    { thompson: '585st', syllable: 'ba', family: 'B', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/585st.svg' },
    { thompson: '757st', syllable: 'ba', family: 'B', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/B%20VOCALES/757st.svg' },
  ],

  // -----------------------------------------------------------------------
  // CH FAMILY — CH VOCALES/
  // -----------------------------------------------------------------------
  CH: [
    { thompson: '108md', syllable: 'cha', family: 'CH', variant: 'middle', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/108md.svg' },
    { thompson: '145st', syllable: 'cha', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/145st.svg' },
    { thompson: '512st', syllable: 'che', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/512st.svg' },
    { thompson: '590', syllable: 'cha', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/590.svg' },
    { thompson: '668st', syllable: 'cha', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/668st.svg' },
    { thompson: '671st', syllable: 'cha', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/671st.svg' },
    { thompson: '796st', syllable: 'cha', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/796st.svg' },
    { thompson: '1557bv', syllable: 'cha', family: 'CH', variant: 'bipartite-vertical', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/1557bv.svg' },
    { thompson: 'CHA_2', syllable: 'cha', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/CHA_2.svg' },
    { thompson: 'CHE_2', syllable: 'che', family: 'CH', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%20VOCALES/CHE_2.svg' },
  ],

  // -----------------------------------------------------------------------
  // CH' FAMILY — CH' VOCALES/
  // -----------------------------------------------------------------------
  "CH'": [
    { thompson: '758st', syllable: "ch'a", family: "CH'", variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/CH%27%20VOCALES/758st.svg' },
    { thompson: '93bh', syllable: "ch'a", family: "CH'", variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/CH%27%20VOCALES/93bh.svg' },
    { thompson: '93bl', syllable: "ch'a", family: "CH'", variant: 'bipartite-left', image: '/escritura_maya/escritura%20maya%20mejorada/CH%27%20VOCALES/93bl.svg' },
  ],

  // -----------------------------------------------------------------------
  // H FAMILY — H VOCALES/
  // -----------------------------------------------------------------------
  H: [
    { thompson: '574st', syllable: 'ha', family: 'H', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/H%20VOCALES/574st.svg' },
    { thompson: '672st', syllable: 'ha', family: 'H', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/H%20VOCALES/672st.svg' },
    { thompson: '1042bh', syllable: 'ha', family: 'H', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/H%20VOCALES/1042bh.svg' },
    { thompson: '1559st', syllable: 'ha', family: 'H', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/H%20VOCALES/1559st.svg' },
    { thompson: '186bv', syllable: 'ha', family: 'H', variant: 'bipartite-vertical', image: '/escritura_maya/escritura%20maya%20mejorada/H%20VOCALES/186bv.svg' },
    { thompson: '186bt', syllable: 'ha', family: 'H', variant: 'bottom', image: '/escritura_maya/escritura%20maya%20mejorada/H%20VOCALES/186bt.svg' },
  ],

  // -----------------------------------------------------------------------
  // J FAMILY — J VOCALES/
  // -----------------------------------------------------------------------
  J: [
    { thompson: '69bb', syllable: 'ja', family: 'J', variant: 'bipartite-bottom', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/69bb.svg' },
    { thompson: '69bv', syllable: 'ja', family: 'J', variant: 'bipartite-vertical', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/69bv.svg' },
    { thompson: '88st', syllable: 'ja', family: 'J', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/88st.svg' },
    { thompson: '181bh', syllable: 'ja', family: 'J', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/181bh.svg' },
    { thompson: '181br', syllable: 'ja', family: 'J', variant: 'bottom-right', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/181br.svg' },
    { thompson: '181hh', syllable: 'ja', family: 'J', variant: 'head-human', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/181hh.svg' },
    { thompson: '266st', syllable: 'ja', family: 'J', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/266st.svg' },
    { thompson: '607bt', syllable: 'ja', family: 'J', variant: 'bottom', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/607bt.svg' },
    { thompson: '607bv', syllable: 'ja', family: 'J', variant: 'bipartite-vertical', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/607bv.svg' },
    { thompson: '136mp', syllable: 'ja', family: 'J', variant: 'middle-part', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/136mp.svg' },
    { thompson: '1521st', syllable: 'ja', family: 'J', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/J%20VOCALES/1521st.svg' },
  ],

  // -----------------------------------------------------------------------
  // K FAMILY — K VOCALES/
  // -----------------------------------------------------------------------
  K: [
    { thompson: '738bh', syllable: 'ke', family: 'K', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/738bh.svg' },
    { thompson: 'KE_2', syllable: 'ke', family: 'K', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/K%20VOCALES/KE_2.svg' },
  ],

  // -----------------------------------------------------------------------
  // L FAMILY — L VOCALES/
  // -----------------------------------------------------------------------
  L: [
    { thompson: '24st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/24st.svg' },
    { thompson: '82st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/82st.svg' },
    { thompson: '178bh', syllable: 'la', family: 'L', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/178bh.svg' },
    { thompson: '178st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/178st.svg' },
    { thompson: '188st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/188st.svg' },
    { thompson: '568st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/568st.svg' },
    { thompson: '580st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/580st.svg' },
    { thompson: '827st', syllable: 'la', family: 'L', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/L%20VOCALES/827st.svg' },
  ],

  // -----------------------------------------------------------------------
  // M FAMILY — M VOCALES/
  // -----------------------------------------------------------------------
  M: [
    { thompson: '19vl', syllable: 'ma', family: 'M', variant: 'vertical-left', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/19vl.svg' },
    { thompson: '19vs', syllable: 'ma', family: 'M', variant: 'vertical-stack', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/19vs.svg' },
    { thompson: '173st', syllable: 'ma', family: 'M', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/173st.svg' },
    { thompson: '502st', syllable: 'ma', family: 'M', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/502st.svg' },
    { thompson: '582ex', syllable: 'ma', family: 'M', variant: 'pars-pro-toto', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/582ex.svg' },
    { thompson: '74tb', syllable: 'ma', family: 'M', variant: 'top-bottom', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/74tb.svg' },
    { thompson: '74tt', syllable: 'ma', family: 'M', variant: 'top-top', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/74tt.svg' },
    { thompson: '74tv', syllable: 'ma', family: 'M', variant: 'top-vertical', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/74tv.svg' },
    { thompson: '1501br', syllable: 'ma', family: 'M', variant: 'bottom-right', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/1501br.svg' },
    { thompson: '1592st', syllable: 'ma', family: 'M', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/M%20VOCALES/1592st.svg' },
  ],

  // -----------------------------------------------------------------------
  // N FAMILY — N VOCALES/
  // -----------------------------------------------------------------------
  N: [
    { thompson: '4vb', syllable: 'na', family: 'N', variant: 'vertical-bottom', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/4vb.svg' },
    { thompson: 'NA_2', syllable: 'na', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NA_2.svg' },
    { thompson: 'NA_3', syllable: 'na', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NA_3.svg' },
    { thompson: 'NE_1', syllable: 'ne', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NE_1.svg' },
    { thompson: 'NE_2', syllable: 'ne', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NE_2.svg' },
    { thompson: 'NE_3', syllable: 'ne', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NE_3.svg' },
    { thompson: 'NI_1', syllable: 'ni', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NI_1.svg' },
    { thompson: 'NI_2', syllable: 'ni', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NI_2.svg' },
    { thompson: 'NI_3', syllable: 'ni', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NI_3.svg' },
    { thompson: 'NO_1', syllable: 'no', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NO_1.svg' },
    { thompson: 'NO_2', syllable: 'no', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NO_2.svg' },
    { thompson: 'NU_1', syllable: 'nu', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NU_1.svg' },
    { thompson: 'NU_2', syllable: 'nu', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NU_2.svg' },
    { thompson: 'NU_3', syllable: 'nu', family: 'N', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/N%20VOCALES/NU_3.svg' },
  ],

  // -----------------------------------------------------------------------
  // P FAMILY — P VOCALES/
  // -----------------------------------------------------------------------
  P: [
    { thompson: '177bb', syllable: 'pa', family: 'P', variant: 'bipartite-bottom', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/177bb.svg' },
    { thompson: '177bl', syllable: 'pa', family: 'P', variant: 'bipartite-left', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/177bl.svg' },
    { thompson: '586hh', syllable: 'po', family: 'P', variant: 'head-human', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/586hh.svg' },
    { thompson: '586st', syllable: 'po', family: 'P', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/586st.svg' },
    { thompson: '692st', syllable: 'po', family: 'P', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/692st.svg' },
    { thompson: '622', syllable: 'pa', family: 'P', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/calle%20622.svg' },
    { thompson: 'PO_2', syllable: 'po', family: 'P', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/P%20VOCALES/PO_2.svg' },
  ],

  // -----------------------------------------------------------------------
  // S FAMILY — S VOCALES/
  // -----------------------------------------------------------------------
  S: [
    { thompson: 'SA_1', syllable: 'sa', family: 'S', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/S%20VOCALES/SA_1.svg' },
    { thompson: 'SA_2', syllable: 'sa', family: 'S', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/S%20VOCALES/SA_2.svg' },
    { thompson: 'SA_3', syllable: 'sa', family: 'S', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/S%20VOCALES/SA_3.svg' },
    { thompson: 'SA_4', syllable: 'sa', family: 'S', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/S%20VOCALES/SA_4.svg' },
  ],

  // -----------------------------------------------------------------------
  // TZ' FAMILY — TZ' VOCALES/
  // -----------------------------------------------------------------------
  "TZ'": [
    { thompson: '68tv', syllable: "tz'a", family: "TZ'", variant: 'top-vertical', image: '/escritura_maya/escritura%20maya%20mejorada/TZ%27%20VOCALES/68tv.svg' },
  ],

  // -----------------------------------------------------------------------
  // W FAMILY — W VOCALES/
  // -----------------------------------------------------------------------
  W: [
    { thompson: '130bh', syllable: 'wi', family: 'W', variant: 'bipartite-horizontal', image: '/escritura_maya/escritura%20maya%20mejorada/W%20VOCALES/130bh.svg' },
  ],

  // -----------------------------------------------------------------------
  // Y FAMILY — Y VOCALES/
  // -----------------------------------------------------------------------
  Y: [
    { thompson: 'YA_1', syllable: 'ya', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YA_1.svg' },
    { thompson: 'YA_2', syllable: 'ya', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YA_2.svg' },
    { thompson: 'YE_1', syllable: 'ye', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YE_1.svg' },
    { thompson: 'YE_2', syllable: 'ye', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YE_2.svg' },
    { thompson: 'YI_1', syllable: 'yi', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YI_1.svg' },
    { thompson: 'YI_2', syllable: 'yi', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YI_2.svg' },
    { thompson: 'YO_1', syllable: 'yo', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YO_1.svg' },
    { thompson: 'YO_2', syllable: 'yo', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YO_2.svg' },
    { thompson: 'YU', syllable: 'yu', family: 'Y', variant: 'standard', image: '/escritura_maya/escritura%20maya%20mejorada/Y%20VOCALES/YU.svg' },
  ],

  // -----------------------------------------------------------------------
  // TOP-LEVEL COMPOUND GLYPHS
  // -----------------------------------------------------------------------
  compounds: [
    { thompson: "K'AL", syllable: "k'al", family: 'compound', variant: 'logogram', image: '/escritura_maya/escritura%20maya%20mejorada/K%27AL.svg', meaning: 'levantar/erigir' },
    { thompson: 'TUUN', syllable: 'tuun', family: 'compound', variant: 'logogram', image: '/escritura_maya/escritura%20maya%20mejorada/TUUN.svg', meaning: 'piedra' },
    { thompson: "K'AL-wi-TUUN", syllable: "k'al-aw-tuun", family: 'compound', variant: 'word', image: '/escritura_maya/escritura%20maya%20mejorada/K%C2%B4AL-wi-TUUN.svg', meaning: 'él levanta la piedra' },
    { thompson: 'WI', syllable: 'wi', family: 'compound', variant: 'logogram', image: '/escritura_maya/escritura%20maya%20mejorada/WI.svg', meaning: 'complemento fonético' },
  ],
}

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get all glyphs in a flat array
 */
export function getAllGlyphs() {
  const all = []
  for (const family of Object.values(glyphCatalog)) {
    all.push(...family)
  }
  return all
}

/**
 * Get glyphs by consonant family
 */
export function getGlyphsByFamily(family) {
  return glyphCatalog[family] || []
}

/**
 * Get all family names
 */
export function getFamilyNames() {
  return Object.keys(glyphCatalog).filter(k => k !== 'vowels' && k !== 'compounds')
}

/**
 * Get a glyph by Thompson code
 */
export function getGlyphByThompson(code) {
  for (const family of Object.values(glyphCatalog)) {
    const found = family.find(g => g.thompson === code)
    if (found) return found
  }
  return null
}

/**
 * Get a random variant of a syllable
 */
export function getRandomGlyphForSyllable(syllable) {
  const all = getAllGlyphs()
  const matches = all.filter(g => g.syllable === syllable)
  if (matches.length === 0) return null
  return matches[Math.floor(Math.random() * matches.length)]
}

/**
 * Search glyphs by syllable (partial match)
 */
export function searchGlyphs(query) {
  const q = query.toLowerCase()
  return getAllGlyphs().filter(g =>
    g.syllable.toLowerCase().includes(q) ||
    g.thompson.toLowerCase().includes(q) ||
    (g.meaning && g.meaning.toLowerCase().includes(q))
  )
}

/**
 * Get total count of SVGs
 */
export function getTotalGlyphCount() {
  return getAllGlyphs().length
}

export default glyphCatalog
