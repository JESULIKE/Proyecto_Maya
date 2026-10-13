# Diseño de Laboratorio Maya

Sistema visual heredado del diseño de K'in (E2 v1.1, bóveda de Jesús). Vista en vivo: `/estilo`.

## Reglas
- **P1 Sin castigo:** no hay rojo, «X», vidas, cronómetros ni rankings. Intento, daño y advertencias van en ámbar u ocre.
- **Nunca solo color** (WCAG 1.4.1): la retroalimentación lleva color + ícono + texto.
- **Cuerpo ≥ 16 px**, objetivos táctiles ≥ 44 px, foco visible (WCAG 2.2).
- **P3 Fidelidad cultural:** sin iconografía «azteca» decorativa. La marca es un numeral maya (barra y puntos).
- Tipografía: Nunito (paquete `@fontsource-variable/nunito`, sin CDN: funciona sin conexión).

## Colores (tokens `kin-*` en `tailwind.config.js`)
| Token | Hex | Uso |
|---|---|---|
| `kin-terracota` | `#8B3E0F` | Marca, títulos |
| `kin-esmeralda` | `#1F7A4D` | Acción, acierto |
| `kin-maya` | `#36558F` | Ayuda, información |
| `kin-ocre` | `#C7650A` | Acentos (texto grande), advertencia |
| `kin-ambar` | `#E29A35` | Intento, hitos |
| `kin-crema` / `kin-crema2` | `#FFF8E8` / `#F7EEDC` | Fondos |
| `kin-texto` / `kin-pardo` / `kin-marron` | `#3B2A20` / `#765E4A` / `#5C321C` | Textos |
| `kin-borde` / `kin-control` | `#C9B79A` / `#8A7358` | Bordes decorativos / de controles |

**Compatibilidad:** las paletas de Tailwind usadas por código anterior (`amber`, `green`, `blue`, `red`, `purple`, `gray`…) se redefinen con estos colores, así que clases como `bg-green-600` ya son esmeralda y `red-*` es ocre. En código nuevo usa los tokens `kin-*` y los componentes de abajo.

## Componentes (`assets/css/tailwind.css`)
`btn-primary`, `btn-brand`, `btn-secondary`, `btn-ghost`, `btn-sm` · `card`, `card-pad` · `chip-ok|info|warn|brand` · `alert-ok|info|warn` · `callout-info|pending|rule` · `field` · `page-title`, `page-lead` · `skip-link`.

## Cómo seguir
- Páginas nuevas: usa `page-title`/`page-lead` en el encabezado y `card-pad` para bloques.
- Encabezados `h1–h4` heredan color; en fondo claro añade `text-kin-terracota`.
- El libro (`components/textbook/*`) conserva su maquetación y ya usa la paleta por compatibilidad; falta migrarlo a los componentes.
