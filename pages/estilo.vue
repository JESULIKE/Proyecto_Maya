<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <header class="mb-10">
      <h1 class="page-title">Guía de estilo</h1>
      <p class="page-lead">
        Tokens y componentes base del Laboratorio Maya, tomados del diseño de K'in (E2). Reúso estos antes de crear estilos nuevos.
      </p>
    </header>

    <section class="mb-12" aria-labelledby="colores">
      <h2 id="colores" class="mb-4 text-2xl text-kin-terracota">Colores</h2>
      <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <li v-for="c in colors" :key="c.name" class="card overflow-hidden">
          <div class="h-16" :style="{ background: c.hex }"></div>
          <div class="p-3">
            <p class="font-bold">{{ c.name }}</p>
            <p class="font-mono text-sm text-kin-pardo">{{ c.hex }}</p>
            <p class="text-sm text-kin-pardo">{{ c.use }}</p>
          </div>
        </li>
      </ul>
      <p class="callout-rule mt-4">No se usa rojo. El intento, el daño y las advertencias usan ámbar u ocre, siempre con ícono y texto.</p>
    </section>

    <section class="mb-12" aria-labelledby="botones">
      <h2 id="botones" class="mb-4 text-2xl text-kin-terracota">Botones</h2>
      <div class="flex flex-wrap items-center gap-3">
        <button class="btn-primary">Acción principal</button>
        <button class="btn-brand">Marca</button>
        <button class="btn-secondary">Secundario</button>
        <button class="btn-ghost">Discreto</button>
        <button class="btn-primary" disabled>Deshabilitado</button>
        <button class="btn-secondary btn-sm">Pequeño</button>
      </div>
      <p class="mt-3 text-sm text-kin-pardo">Objetivo táctil mínimo de 44 px. Foco visible con anillo azul maya.</p>
    </section>

    <section class="mb-12" aria-labelledby="chips">
      <h2 id="chips" class="mb-4 text-2xl text-kin-terracota">Chips y retroalimentación</h2>
      <div class="mb-5 flex flex-wrap gap-2">
        <span class="chip-ok">Disponible</span>
        <span class="chip-info">Pista</span>
        <span class="chip-warn">Intento</span>
        <span class="chip-brand">Etiqueta</span>
      </div>
      <div class="space-y-3">
        <p class="alert-ok"><span aria-hidden="true" class="font-bold">✓</span><span>¡Muy bien! Lo lograste.</span></p>
        <p class="alert-info"><span aria-hidden="true" class="font-bold">i</span><span>Pista: mira la posición del signo principal.</span></p>
        <p class="alert-warn"><span aria-hidden="true" class="font-bold">!</span><span>Casi. Prueba otra posición.</span></p>
      </div>
    </section>

    <section class="mb-12" aria-labelledby="recuadros">
      <h2 id="recuadros" class="mb-4 text-2xl text-kin-terracota">Recuadros, tarjetas y campos</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="callout-info">Convención o información de apoyo (azul maya).</div>
        <div class="callout-pending">Pendiente o por verificar (ocre).</div>
        <div class="callout-rule">Restricción o regla (terracota).</div>
        <div class="card-pad">Tarjeta con borde crema y sombra suave.</div>
      </div>
      <label class="mt-5 block">
        <span class="mb-1 block font-bold">Campo de texto</span>
        <input class="field" type="text" placeholder="Escribe aquí" />
      </label>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'Guía de estilo · Laboratorio Maya', meta: [{ name: 'robots', content: 'noindex' }] })

const colors = [
  { name: 'Terracota', hex: '#8B3E0F', use: 'Marca, títulos' },
  { name: 'Esmeralda', hex: '#1F7A4D', use: 'Acción, acierto' },
  { name: 'Azul maya', hex: '#36558F', use: 'Ayuda, información' },
  { name: 'Ocre', hex: '#C7650A', use: 'Acentos, advertencia' },
  { name: 'Ámbar', hex: '#E29A35', use: 'Intento, hitos' },
  { name: 'Crema', hex: '#FFF8E8', use: 'Fondo' },
  { name: 'Crema oscuro', hex: '#F7EEDC', use: 'Superficies' },
  { name: 'Texto', hex: '#3B2A20', use: 'Cuerpo' },
  { name: 'Gris pardo', hex: '#765E4A', use: 'Ayuda, pies' },
  { name: 'Borde de control', hex: '#8A7358', use: 'Campos y botones' }
]
</script>
