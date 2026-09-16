export const useGlyphBuilder = () => {
  const { getSyllableProportion, isSquare } = useGlyphDatabase();
  
  // Determinar cuál sílaba debe ser el signo principal
  // PRIORIDAD: Glifos cuadrados primero
  const determineMainSignIndex = (syllables) => {
    const count = syllables.length;
    
    if (count === 1) return 0;
    
    // 1. Buscar el glifo más cuadrado
    let bestIndex = -1;
    let bestSquareness = 0;
    
    syllables.forEach((syllable, index) => {
      if (isSquare(syllable)) {
        const proportion = getSyllableProportion(syllable);
        // Mientras más cercano a 1.0, más cuadrado
        const squareness = 1 - Math.abs(1.0 - proportion);
        
        if (squareness > bestSquareness) {
          bestSquareness = squareness;
          bestIndex = index;
        }
      }
    });
    
    // Si encontramos un glifo cuadrado, usarlo
    if (bestIndex !== -1) {
      console.log(`✓ Glifo cuadrado encontrado: "${syllables[bestIndex]}" en posición ${bestIndex}`);
      return bestIndex;
    }
    
    // 2. Si no hay cuadrados, usar reglas mayas clásicas
    console.log('⚠ No se encontró glifo cuadrado, usando reglas clásicas');
    if (count === 2) return 0;
    if (count === 3 || count === 5) return Math.floor(count / 2);
    if (count === 4 || count === 6) return Math.floor(count / 2) - 1;
    return Math.floor(count / 2);
  };

  const buildGlyphPositions = (syllables, mainIndex) => {
    const positions = [];
    const affixPositions = ['top', 'left', 'right', 'bottom'];
    let affixIndex = 0;

    syllables.forEach((syllable, index) => {
      if (index === mainIndex) {
        positions.push({
          syllable,
          position: 'main',
          gridArea: 'main',
          size: 1
        });
      } else {
        const pos = affixPositions[affixIndex % 4];
        positions.push({
          syllable,
          position: pos,
          gridArea: pos,
          size: 0.5
        });
        affixIndex++;
      }
    });

    return positions;
  };

  return {
    determineMainSignIndex,
    buildGlyphPositions
  };
};