export const useGlyphVariants = () => {
  const { getVariantByIndex, getSyllableVariants } = useGlyphDatabase();
  const { determineMainSignIndex, buildGlyphPositions } = useGlyphBuilder();

  const generateVariants = (syllables) => {
    if (syllables.length === 0) return [];

    // Crear un mapa de variantes para cada sílaba
    const syllableVariants = {};
    syllables.forEach(syllable => {
      syllableVariants[syllable] = getSyllableVariants(syllable);
    });

    // Determinar el índice del signo principal (priorizando cuadrados)
    const mainIndex = determineMainSignIndex(syllables);

    console.log(`Signo principal seleccionado: ${syllables[mainIndex]} (índice ${mainIndex})`);

    const variants = [];

    // VARIANTE 1: Disposición clásica, primeras versiones de SVG
    const positions1 = buildGlyphPositions(syllables, mainIndex);
    const glyphs1 = positions1.map(pos => ({
      ...pos,
      image: getVariantByIndex(pos.syllable, 0)?.image || null
    }));
    variants.push({
      id: 1,
      glyphs: glyphs1,
      layout: 'classic',
      syllables: [...syllables]
    });

    // VARIANTE 2: Versiones intermedias, afijos más compactos
    const positions2 = buildGlyphPositions(syllables, mainIndex).map(pos => ({
      ...pos,
      size: pos.position === 'main' ? 1 : 0.45
    }));
    const glyphs2 = positions2.map(pos => ({
      ...pos,
      image: getVariantByIndex(pos.syllable, 1)?.image || null
    }));
    variants.push({
      id: 2,
      glyphs: glyphs2,
      layout: 'compact',
      syllables: [...syllables]
    });

    // VARIANTE 3: Últimas versiones, main más grande
    const positions3 = buildGlyphPositions(syllables, mainIndex).map(pos => ({
      ...pos,
      size: pos.position === 'main' ? 1.1 : 0.48
    }));
    const glyphs3 = positions3.map(pos => ({
      ...pos,
      image: getVariantByIndex(pos.syllable, 2)?.image || null
    }));
    variants.push({
      id: 3,
      glyphs: glyphs3,
      layout: 'expanded',
      syllables: [...syllables]
    });

    return variants;
  };

  return {
    generateVariants
  };
};