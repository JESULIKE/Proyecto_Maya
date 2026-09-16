<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Patrón decorativo de fondo -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 border-4 border-amber-800 rounded-lg transform rotate-12"></div>
        <div class="absolute top-40 right-20 w-24 h-24 border-4 border-amber-800 rounded-full"></div>
        <div class="absolute bottom-20 left-1/4 w-28 h-28 border-4 border-amber-800 transform -rotate-6"></div>
        <div class="absolute bottom-40 right-1/3 w-20 h-20 border-4 border-amber-800 rounded-lg"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <!-- Título principal con efecto -->
          <div class="mb-6">
            <h1 class="text-5xl md:text-7xl font-bold text-amber-900 mb-4 animate-fade-in">
              Escritura Maya
            </h1>
            <div class="flex items-center justify-center gap-3 text-3xl md:text-4xl text-amber-700">
              <div class="w-12 h-1 bg-amber-600"></div>
              <span class="font-semibold">Tz'ib'</span>
              <div class="w-12 h-1 bg-amber-600"></div>
            </div>
          </div>

          <!-- Subtítulo -->
          <p class="text-xl md:text-2xl text-amber-800 max-w-3xl mx-auto mb-12 leading-relaxed">
            Descubre el fascinante mundo de los glifos mayas. Crea historias usando uno de los sistemas de escritura más sofisticados de la antigüedad.
          </p>

          <!-- Características destacadas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <div class="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg border-2 border-amber-200 hover:shadow-xl transition-shadow">
              <div class="text-4xl mb-3">📜</div>
              <h3 class="text-lg font-bold text-amber-900 mb-2">Sistema Logográfico</h3>
              <p class="text-sm text-amber-700">Combina logogramas y silabogramas para formar palabras complejas</p>
            </div>
            <div class="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg border-2 border-amber-200 hover:shadow-xl transition-shadow">
              <div class="text-4xl mb-3">🏛️</div>
              <h3 class="text-lg font-bold text-amber-900 mb-2">Historia Milenaria</h3>
              <p class="text-sm text-amber-700">Utilizado por más de 2000 años en toda Mesoamérica</p>
            </div>
            <div class="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg border-2 border-amber-200 hover:shadow-xl transition-shadow">
              <div class="text-4xl mb-3">🎨</div>
              <h3 class="text-lg font-bold text-amber-900 mb-2">Arte y Escritura</h3>
              <p class="text-sm text-amber-700">Cada glifo es una obra de arte con significado profundo</p>
            </div>
          </div>

          <!-- Botones de navegación principales -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <NuxtLink
              to="/compositor"
              class="group relative px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
            >
              <div class="flex items-center justify-center gap-3">
                <span class="text-2xl">✨</span>
                <div class="text-left">
                  <div class="font-bold text-lg">Compositor de Glifos</div>
                  <div class="text-sm opacity-90">Crea glifos palabra por palabra</div>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/assembler"
              class="group relative px-8 py-4 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
            >
              <div class="flex items-center justify-center gap-3">
                <span class="text-2xl">🎯</span>
                <div class="text-left">
                  <div class="font-bold text-lg">Ensamblador Interactivo</div>
                  <div class="text-sm opacity-90">Arrastra y organiza sílabas</div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección informativa -->
    <section class="bg-white/60 backdrop-blur py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-amber-900 text-center mb-12">
          ¿Cómo funciona la escritura maya?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Bloques de glifos -->
          <div class="bg-gradient-to-br from-amber-100 to-yellow-100 p-8 rounded-2xl border-2 border-amber-300 shadow-lg">
            <div class="flex items-start gap-4">
              <div class="bg-amber-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 class="text-xl font-bold text-amber-900 mb-3">Bloques de Glifos</h3>
                <p class="text-amber-800 leading-relaxed">
                  Los glifos se organizan en bloques rectangulares. Cada bloque puede contener de 1 a 5 signos que se leen siguiendo un patrón específico.
                </p>
              </div>
            </div>
          </div>

          <!-- Orden de lectura -->
          <div class="bg-gradient-to-br from-orange-100 to-amber-100 p-8 rounded-2xl border-2 border-orange-300 shadow-lg">
            <div class="flex items-start gap-4">
              <div class="bg-orange-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 class="text-xl font-bold text-amber-900 mb-3">Orden de Lectura</h3>
                <p class="text-amber-800 leading-relaxed">
                  Los bloques se leen en pares de columnas, de izquierda a derecha y de arriba hacia abajo, como un zigzag descendente.
                </p>
              </div>
            </div>
          </div>

          <!-- Silabogramas -->
          <div class="bg-gradient-to-br from-yellow-100 to-amber-100 p-8 rounded-2xl border-2 border-yellow-300 shadow-lg">
            <div class="flex items-start gap-4">
              <div class="bg-yellow-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 class="text-xl font-bold text-amber-900 mb-3">Silabogramas</h3>
                <p class="text-amber-800 leading-relaxed">
                  Signos que representan sílabas individuales (consonante + vocal). Ejemplo: "ba", "la", "ma". Se combinan para formar palabras.
                </p>
              </div>
            </div>
          </div>

          <!-- Logogramas -->
          <div class="bg-gradient-to-br from-red-100 to-orange-100 p-8 rounded-2xl border-2 border-red-300 shadow-lg">
            <div class="flex items-start gap-4">
              <div class="bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 class="text-xl font-bold text-amber-900 mb-3">Logogramas</h3>
                <p class="text-amber-800 leading-relaxed">
                  Signos que representan palabras completas. Un mismo concepto puede escribirse de múltiples formas usando diferentes combinaciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action final -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="bg-gradient-to-r from-amber-800 to-amber-700 rounded-3xl p-10 shadow-2xl text-white">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Comienza tu viaje en la escritura maya
          </h2>
          <p class="text-lg mb-8 opacity-90">
            Elige una herramienta y empieza a crear tus propias historias en glifos
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/compositor"
              class="px-6 py-3 bg-white text-amber-800 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Ir al Compositor →
            </NuxtLink>
            <NuxtLink
              to="/assembler"
              class="px-6 py-3 bg-amber-900 text-white rounded-lg font-semibold hover:bg-amber-950 transition-colors border-2 border-white/30"
            >
              Ir al Ensamblador →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Escritura Maya - B\'alam Ajaw',
  meta: [
    { 
      name: 'description', 
      content: 'Aprende y crea historias usando glifos mayas. Sistema interactivo para componer y ensamblar escritura maya.' 
    }
  ]
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>