/**
 * Sistema de diseño de Laboratorio Maya, tomado del diseño de K'in (E2 v1.1).
 *
 * Tokens semánticos (úsalos en código nuevo):
 *   kin-terracota  marca, títulos, encabezados      kin-esmeralda  acción, acierto, avance
 *   kin-maya       ayuda, información               kin-ocre       acentos (solo texto grande)
 *   kin-ambar      intento y advertencia (NUNCA rojo, principio P1 de E2)
 *   kin-crema / kin-crema2  fondos                 kin-texto / kin-pardo / kin-marron  textos
 *   kin-borde      bordes decorativos              kin-control  borde de controles (3:1 sobre crema)
 *
 * Compatibilidad: las paletas de Tailwind usadas por el código heredado
 * (amber, green, blue, red, purple, gray…) se redefinen abajo con los colores de K'in,
 * así todo el sitio comparte la misma identidad sin reescribir cada clase.
 * `red` es una escala ámbar/ocre a propósito: el producto no usa rojo.
 */
const scale = (c50, c100, c200, c300, c400, c500, c600, c700, c800, c900) => ({
  50: c50, 100: c100, 200: c200, 300: c300, 400: c400, 500: c500, 600: c600, 700: c700, 800: c800, 900: c900
})

const terracota = scale('#FBF1EA', '#F5DFD0', '#EBBFA3', '#DC9A70', '#C87444', '#A9531E', '#8B3E0F', '#6F300B', '#572609', '#3F1B06')
const esmeralda = scale('#EAF6EF', '#CFEBDB', '#A3D7BB', '#6FBE96', '#3FA070', '#2A8A5C', '#1F7A4D', '#186040', '#134B32', '#0E3825')
const mayaAzul = scale('#EEF2F9', '#DBE4F3', '#B8C8E6', '#8EA6D2', '#6482B8', '#4A69A3', '#36558F', '#2B4474', '#213459', '#18263F')
const ocre = scale('#FFF4E5', '#FCE5C4', '#F7CC90', '#EEAE5C', '#DB8A2B', '#C7650A', '#A85208', '#8A4306', '#6B3305', '#4F2503')
const ambar = scale('#FFF8E8', '#FDEBC8', '#F9D79A', '#F1BE69', '#E29A35', '#C7841F', '#A66A12', '#85520D', '#663F0A', '#4A2D07')
const pardo = scale('#FFFBF2', '#F7EEDC', '#E9DEC8', '#C9B79A', '#8A7358', '#765E4A', '#5C4A3A', '#4A3A2D', '#3B2A20', '#291C15')

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        kin: {
          terracota: '#8B3E0F',
          esmeralda: '#1F7A4D',
          maya: '#36558F',
          ocre: '#C7650A',
          ambar: '#E29A35',
          crema: '#FFF8E8',
          crema2: '#F7EEDC',
          texto: '#3B2A20',
          pardo: '#765E4A',
          marron: '#5C321C',
          borde: '#C9B79A',
          control: '#8A7358'
        },
        // Paletas heredadas → identidad K'in
        amber: terracota,
        orange: ocre,
        yellow: ambar,
        green: esmeralda,
        emerald: esmeralda,
        teal: esmeralda,
        blue: mayaAzul,
        sky: mayaAzul,
        cyan: mayaAzul,
        indigo: mayaAzul,
        violet: mayaAzul,
        purple: terracota,
        fuchsia: terracota,
        pink: terracota,
        rose: ocre,
        red: ocre,
        gray: pardo,
        slate: pardo,
        zinc: pardo,
        stone: pardo,
        neutral: pardo,
        // Alias de la versión anterior
        maya: { primary: '#8B3E0F', secondary: '#C7650A', accent: '#E29A35', dark: '#5C321C', light: '#F7EEDC' }
      },
      fontFamily: {
        sans: ['"Nunito Variable"', 'Nunito', 'Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
        maya: ['"Nunito Variable"', 'Nunito', 'serif']
      },
      // Cuerpo ≥ 16 px (E2): los tamaños pequeños heredados suben un escalón para no quedar ilegibles
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.45' }],
        sm: ['1rem', { lineHeight: '1.55' }]
      },
      minHeight: { target: '2.75rem' }, // 44 px: tamaño mínimo de objetivo táctil
      minWidth: { target: '2.75rem' },
      boxShadow: {
        kin: '0 1px 2px rgba(59,42,32,.08), 0 4px 12px rgba(59,42,32,.08)'
      }
    }
  },
  plugins: []
}

