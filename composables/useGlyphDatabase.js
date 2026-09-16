export const useGlyphDatabase = () => {
  const syllablesData = useState('syllablesData', () => []);
  
  // Metadata aproximada de proporciones
  // 1.0 = cuadrado, > 1.0 = vertical, < 1.0 = horizontal
  const syllableProportions = {
    // Vocales puras - tienden a ser cuadradas
    'a': 1.0,
    'e': 0.9,
    'i': 1.1,
    'o': 1.0,
    'u': 0.9,
    
    // Consonantes con vocales
    'ba': 1.0,
    'bi': 0.9,
    'bo': 1.0,
    'bu': 1.1,
    
    'cha': 0.9,
    'che': 1.0,
    'chi': 0.9,
    'cho': 1.1,
    'chu': 1.0,
    
    'ha': 1.0,
    'he': 0.9,
    'hi': 1.0,
    'ho': 1.1,
    'hu': 0.9,
    
    'ja': 0.9,
    'je': 1.0,
    'ji': 0.9,
    'jo': 1.0,
    'ju': 1.1,
    
    'ka': 1.0,
    'ke': 0.9,
    'ki': 1.0,
    'ko': 1.1,
    'ku': 0.9,
    
    'la': 0.9,
    'le': 1.0,
    'li': 0.9,
    'lo': 1.0,
    'lu': 1.1,
    
    'ma': 1.0,
    'me': 0.9,
    'mi': 1.0,
    'mo': 1.1,
    'mu': 0.9,
    
    'na': 0.9,
    'ne': 1.0,
    'ni': 0.9,
    'no': 1.0,
    'nu': 1.1,
    
    'pa': 1.0,
    'pi': 0.9,
    'po': 1.0,
    'pu': 1.1,
    
    'sa': 0.9,
    'se': 1.0,
    'si': 0.9,
    
    'ta': 1.0,
    'te': 0.9,
    'ti': 1.0,
    'to': 0.9,
    'tu': 1.1,
    
    'tza': 0.8,
    'tze': 0.9,
    'tzi': 1.0,
    'tzu': 0.8,
    
    'tz´a': 1.0,
    'tz´i': 0.9,
    'tz´u': 1.0,
    
    'wa': 0.9,
    'we': 1.0,
    'wi': 0.9,
    'wo': 1.1,
    
    'xa': 1.0,
    'xi': 0.9,
    'xo': 1.0,
    'xu': 1.1,
    
    'ya': 0.9,
    'ye': 1.0,
    'yi': 0.9,
    'yo': 1.0,
    'yu': 1.1,
  };

  const loadSyllables = async () => {
    if (syllablesData.value.length > 0) return;
    
    try {
      const data = await import('~/data/syllables.json');
      syllablesData.value = data.default || data;
      console.log('Sílabas cargadas:', syllablesData.value.length);
    } catch (error) {
      console.error('Error cargando sílabas:', error);
    }
  };

  const getSyllableVariants = (syllable) => {
    return syllablesData.value.filter(
      item => item.syllable.toLowerCase() === syllable.toLowerCase()
    );
  };

  const getVariantByIndex = (syllable, index) => {
    const variants = getSyllableVariants(syllable);
    if (variants.length === 0) return null;
    return variants[index % variants.length];
  };

  const getRandomVariant = (syllable) => {
    const variants = getSyllableVariants(syllable);
    if (variants.length === 0) return null;
    return variants[Math.floor(Math.random() * variants.length)];
  };
  
  const getSyllableProportion = (syllable) => {
    return syllableProportions[syllable.toLowerCase()] || 0.8;
  };
  
  const isSquare = (syllable) => {
    const proportion = getSyllableProportion(syllable);
    return proportion >= 0.9 && proportion <= 1.1;
  };

  return {
    syllablesData,
    loadSyllables,
    getSyllableVariants,
    getVariantByIndex,
    getRandomVariant,
    getSyllableProportion,
    isSquare
  };
};