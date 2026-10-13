# Maya Writing App

App Nuxt 3 + Tailwind para aprender y componer escritura maya.

## Páginas
- `/` inicio
- `/textbook` libro interactivo adaptativo (ver `docs/libro-interactivo.md`)
- `/assembler` ensamblador de sílabas
- `/converter` conversor de transcripción TEI a bloques

## Desarrollo
```bash
npm install
npm run dev
```

`scripts/sync-glyph-data.mjs` sincroniza `data/*.json` con los SVG de `public/` (`--apply` para escribir).

## Pruebas

```bash
npm test
```

- `tests/audit.test.js` reproduce las cifras del paper (333 alteraciones, 607 borrados de atributo, 96 controles) sobre `tests/fixtures/uxul-stela17.xml` (TWKM, CC BY 4.0).
- `tests/blockModel.test.js` verifica que el ensamblador conserva la fuente TEI y prueba 500 lienzos aleatorios (red-team).
- `tests/learner.test.js` y `tests/curriculum.test.js` cubren el modelo del estudiante y la coherencia de los ejercicios del libro.
- `tests/parser-hostile.test.js` prueba entradas hostiles (XXE, XML gigante o mal formado).

El código está en `lib/maya/tei/` (`tree.js`, `audit.js`, `blockModel.js`).
