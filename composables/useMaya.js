// composables/useMaya.js
import { ref, computed, onMounted, watch } from 'vue'
import { TEIParser } from '~/lib/maya/parser/TEIParser'

// Estado global compartido entre todos los componentes
const syllablesData = ref([])
const thompsonMapping = ref({ syllabograms: {}, logograms: {} })
const teiParser = ref(null)
const isLoaded = ref(false)

// Caches globales
const translitToThompsonCache = ref(new Map())
const thompsonToTranslitCache = ref(new Map())
const syllableImageCache = ref(new Map())

export const useMaya = () => {
  // Cargar archivos JSON
  const loadData = async () => {
    if (isLoaded.value) return
    try {
      const [syllablesModule, mappingModule] = await Promise.all([
        import('~/data/syllables.json'),
        import('~/data/thompson-mapping.json')
      ])

      syllablesData.value = syllablesModule.default || syllablesModule
      thompsonMapping.value = mappingModule.default || mappingModule

      // Crear parser una vez cargados los datos
      teiParser.value = new TEIParser(thompsonMapping.value)

      isLoaded.value = true
      initializeCaches()
      console.log('✅ Datos Maya cargados correctamente')
    } catch (error) {
      console.error('❌ Error cargando archivos JSON:', error)
    }
  }

  // Disparar carga si es necesario
  if (!isLoaded.value && typeof window !== 'undefined') {
    loadData()
  }

  const initializeCaches = () => {
    if (!thompsonMapping.value.syllabograms) return

    // Syllabograms
    Object.entries(thompsonMapping.value.syllabograms || {}).forEach(([translit, variants]) => {
      const key = translit.toLowerCase()
      translitToThompsonCache.value.set(key, variants || [])

      variants.forEach(variant => {
        thompsonToTranslitCache.value.set(variant.thompson, {
          transliteration: translit.toUpperCase(),
          ...variant
        })
      })
    })

    // Logograms
    Object.entries(thompsonMapping.value.logograms || {}).forEach(([logogram, variants]) => {
      const key = logogram.toLowerCase()
      translitToThompsonCache.value.set(key, variants || [])

      variants.forEach(variant => {
        thompsonToTranslitCache.value.set(variant.thompson, {
          transliteration: logogram,
          ...variant
        })
      })
    })

    // Imágenes desde syllables.json
    syllablesData.value.forEach((item, index) => {
      const key = (item.syllable || '').toLowerCase().trim()
      if (!syllableImageCache.value.has(key)) {
        syllableImageCache.value.set(key, [])
      }
      syllableImageCache.value.get(key).push({
        image: item.image,
        index
      })
    })
  }

  // Ejecutar caches cuando cambien los datos
  watch([syllablesData, thompsonMapping], initializeCaches, { deep: true })

  // ==================== FUNCIONES ====================
  const translitToThompson = (transliteration) => {
    if (!transliteration) return null
    return translitToThompsonCache.value.get(transliteration.toLowerCase().trim())?.[0] || null
  }

  const thompsonToTranslit = (code) => {
    return thompsonToTranslitCache.value.get(code) || null
  }

  const getSyllableImages = (syllable) => {
    return syllableImageCache.value.get(syllable?.toLowerCase().trim()) || []
  }

  const getCatalogStats = () => ({
    totalImages: syllablesData.value.length,
    uniqueSyllables: syllableImageCache.value.size,
    totalThompsonCodes: thompsonToTranslitCache.value.size
  })

  const getVariants = (transliteration) => {
    if (!transliteration) return []
    return translitToThompsonCache.value.get(transliteration.toLowerCase().trim()) || []
  }

  // Mapeo: Thompson -> Valor Fonético -> Ruta de la Imagen
  const getGlyphImageFromThompson = (thompsonCode) => {
    if (!thompsonCode) return null;
    
    const info = thompsonToTranslit(thompsonCode);
    if (info && info.transliteration) {
      const images = getSyllableImages(info.transliteration);
      if (images.length > 0) {
        // Intenta priorizar la imagen que contiene el código Thompson en el nombre del archivo
        const exactMatch = images.find(img => img.image.toLowerCase().includes(thompsonCode.toLowerCase()));
        return exactMatch ? exactMatch.image : images[0].image;
      }
    }
    
    // Fallback: busca en todas las imágenes si el código coincide con el nombre de archivo
    const fallbackImage = syllablesData.value.find(item => item.image.toLowerCase().includes(thompsonCode.toLowerCase()));
    return fallbackImage ? fallbackImage.image : null;
  }

  // Extrae glifos del XML con su estado de daño para el motor de renderizado
  const getRenderableGlyphs = (xmlString) => {
    if (!xmlString) return [];
    if (typeof window === 'undefined') return []; // Prevención SSR
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const glyphs = Array.from(doc.querySelectorAll('g[n]'));
      
      return glyphs.map(g => {
        const code = g.getAttribute('n');
        // Identifica si está dentro de un tag <damage>
        const isDamaged = g.closest('damage') !== null;
        
        return {
          id: g.getAttribute('xml:id') || Math.random().toString(36).substr(2, 9),
          code,
          transliteration: thompsonToTranslit(code)?.transliteration || code,
          image: getGlyphImageFromThompson(code),
          damaged: isDamaged,
          rend: g.getAttribute('rend') || null,
          corresp: g.getAttribute('corresp') || null
        };
      });
    } catch (e) {
      console.error('Error parsing renderable glyphs:', e);
      return [];
    }
  }

  // ==================== RETURN ====================
  return {
    teiParser: computed(() => teiParser.value),
    loadData,

    translitToThompson,
    thompsonToTranslit,
    getSyllableImages,
    getCatalogStats,
    getVariants,
    getGlyphImageFromThompson,
    getRenderableGlyphs,

    // Placeholder para las funciones que aún no implementamos completamente
    processDocument: (xmlString) => {
      if (!teiParser.value) return null;
      if (typeof window === 'undefined') return null;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');
        const blocks = Array.from(doc.querySelectorAll('ab[type="glyph-block"]'));
        if (blocks.length === 0 && doc.documentElement.tagName === 'ab') {
          return teiParser.value.parseBlock(doc.documentElement);
        }
        const results = blocks.map(block => teiParser.value.parseBlock(block));
        return results.length === 1 ? results[0] : results;
      } catch (e) {
        console.error('Error procesando XML:', e);
        return null;
      }
    },
    teiToDsl: (xmlString) => {
      if (!teiParser.value) return '';
      if (typeof window === 'undefined') return '';
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');
        // Usar selector robusto agnóstico de namespace
        let blocks = Array.from(doc.getElementsByTagNameNS('*', 'ab'));
        if (blocks.length === 0) blocks = Array.from(doc.getElementsByTagName('ab'));
        
        if (blocks.length > 0) {
          return teiParser.value.parseBlock(blocks[0]);
        } else if (doc.documentElement.localName === 'ab') {
          return teiParser.value.parseBlock(doc.documentElement);
        }
        return '';
      } catch (e) {
        return '';
      }
    },
    dslToTEI: (dsl, blockId = 'block1') => {
      if (!dsl) return '';
      
      const regex = /(<<|>>|\[|\]|\{|\}|\/|\+|_|\^|<|>|:|\@|-|[\w´']+)/g;
      const tokens = dsl.match(regex)?.filter(t => t.trim() !== '') || [];
      
      let xml = `<ab xml:id="${blockId}" type="glyph-block" n="${dsl}">\n`;
      let gId = 1;
      let index = 0;
      let baseId = `${blockId}_g1`;
      let expectRelation = null;

      const parseNode = (relation, currentBaseId) => {
        if (index >= tokens.length) return '';
        let token = tokens[index];

        if (token === '[') {
          index++;
          const children = [];
          let type = 'hstack';
          while (index < tokens.length && tokens[index] !== ']') {
            let t = tokens[index];
            if (t === '/' || t === ':') { type = 'vstack'; index++; }
            else if (t === '+' || t === '-') { type = 'hstack'; index++; }
            else {
              children.push(tokens[index]); 
              index++; 
            }
          }
          if (tokens[index] === ']') index++;
          
          let groupCorresp = currentBaseId ? ` corresp="#${currentBaseId}"` : '';
          let relRend = '';
          if (relation === '_' || relation === ':') relRend = 'beneath';
          else if (relation === '^') relRend = 'above';
          else if (relation === '@' || relation === '<') relRend = 'infixed_in';
          else if (relation === '+' || relation === '-') relRend = 'right_beside';
          
          const baseRend = type === 'vstack' ? 'above_beneath' : 'left_right';
          const finalRend = relRend ? `${baseRend} ${relRend}` : baseRend;
          
          let groupXml = `  <seg type="glyph-group" rend="${finalRend}"${groupCorresp}>\n`;
          children.forEach((childToken, i) => {
            if (!childToken.match(/[\w´']/)) return; // saltar si es basura
            const currentId = `${blockId}_g${gId++}`;
            let childRend = '';
            if (type === 'vstack') childRend = i === 0 ? 'above' : 'beneath';
            else childRend = i === 0 ? 'left_beside' : 'right_beside';
            
            groupXml += `    <g n="${childToken}" xml:id="${currentId}" rend="${childRend}"></g>\n`;
          });
          groupXml += `  </seg>\n`;
          return groupXml;
        }

        const code = token;
        const currentId = `${blockId}_g${gId++}`;
        index++;
        
        let rend = '';
        let corresp = currentBaseId ? ` corresp="#${currentBaseId}"` : '';
        if (relation === '_' || relation === ':') rend = 'beneath';
        else if (relation === '^') rend = 'above';
        else if (relation === '@' || relation === '<') rend = 'infixed_in';
        else if (relation === '+' || relation === '-') rend = 'right_beside';

        const rendAttr = rend ? ` rend="${rend}"` : '';
        return `  <g n="${code}" xml:id="${currentId}"${corresp}${rendAttr}></g>\n`;
      };
      
      while (index < tokens.length) {
         let token = tokens[index];
         if (['^', '_', '<', '>', '+', '/', '@', '-', ':'].includes(token)) {
           expectRelation = token;
           index++;
         } else if (token === '[' || token.match(/[\w´']/)) {
           xml += parseNode(expectRelation, expectRelation ? baseId : null);
           expectRelation = null;
         } else {
           index++; // Ignorar otros caracteres para no romper el loop
         }
      }
      
      xml += `</ab>`;
      return xml;
    },
    validateDSL: (dsl) => {
      const errors = [];
      if (!dsl) return { valid: true, errors };

      // 1. Validación Sintáctica
      let parens = 0, infixes = 0, brackets = 0;
      for (let char of dsl) {
        if (char === '(') parens++;
        if (char === ')') parens--;
        if (char === '<') infixes++;
        if (char === '>') infixes--;
        if (char === '[') brackets++;
        if (char === ']') brackets--;
        if (parens < 0 && !errors.includes('Paréntesis de cierre ")" sin abrir.')) errors.push('Paréntesis de cierre ")" sin abrir.');
        if (infixes < 0 && !errors.includes('Delimitador de infijo ">" sin abrir.')) errors.push('Delimitador de infijo ">" sin abrir.');
        if (brackets < 0 && !errors.includes('Corchete de cierre "]" sin abrir.')) errors.push('Corchete de cierre "]" sin abrir.');
      }
      if (parens > 0) errors.push('Falta cerrar uno o más paréntesis "(".');
      if (infixes > 0) errors.push('Falta cerrar uno o más delimitadores de infijo "<".');
      if (brackets > 0) errors.push('Falta cerrar uno o más corchetes "[".');

      if (/^[_\^+\<>)]/.test(dsl) && !dsl.startsWith('(') && !dsl.startsWith('<') && !dsl.startsWith('[')) {
        errors.push('La expresión no puede comenzar con un operador.');
      }
      if (/[_\^+\<]$/.test(dsl)) {
        errors.push('La expresión no puede terminar con un operador huérfano.');
      }
      if (/([_\^+]{2,})/.test(dsl)) {
        errors.push('Existen operadores duplicados consecutivos.');
      }

      // 2. Validación Epigráfica (Infijos)
      const infixRegex = /([A-Za-z0-9']+)<([^>]+)>/g;
      let match;
      while ((match = infixRegex.exec(dsl)) !== null) {
        const hostCode = match[1];
        const guestCode = match[2];
        
        // Regla epigráfica: afijos pequeños (terminan en bh o ex) rara vez pueden ser anfitriones de un infijo
        if (hostCode.endsWith('bh') || hostCode.endsWith('ex')) {
          errors.push(`Validación Epigráfica: El signo [${hostCode}] es un afijo demasiado estrecho para alojar el infijo [${guestCode}].`);
        }
        
        // Chequeo en diccionario si la variante no admite infijos
        const hostInfo = thompsonToTranslitCache.value.get(hostCode);
        if (hostInfo && hostInfo.variant && hostInfo.variant !== 'standard') {
           errors.push(`Validación Epigráfica: La variante '${hostInfo.variant}' del signo [${hostCode}] típicamente no admite infijos.`);
        }
      }

      return { valid: errors.length === 0, errors };
    },
    updateDocumentWithDSL: (originalXml, blockId, newDsl) => {
      if (typeof window === 'undefined') return originalXml;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(originalXml, 'text/xml');
        
        // Buscar el bloque de forma agnóstica al namespace
        let blocks = Array.from(doc.getElementsByTagNameNS('*', 'ab'));
        if (blocks.length === 0) blocks = Array.from(doc.getElementsByTagName('ab'));
        
        const targetBlock = blocks.find(b => b.getAttribute('xml:id') === blockId || b.id === blockId);
        
        if (!targetBlock) {
          console.warn(`Bloque con ID ${blockId} no encontrado en el documento original.`);
          return originalXml;
        }

        // Recuperar namespace si existe (para TEI XML)
        const ns = targetBlock.namespaceURI;
        
        // Generar el nuevo bloque como texto y parsearlo
        const tempDoc = parser.parseFromString(useMaya().dslToTEI(newDsl, blockId), 'text/xml');
        let newBlock = tempDoc.documentElement;
        
        // Si hay namespace, importarlo y recrear los nodos para preservarlo sin xmlns=""
        if (ns) {
          const recreateWithNS = (node) => {
            if (node.nodeType === 3) return doc.createTextNode(node.nodeValue);
            const newNode = doc.createElementNS(ns, node.localName);
            Array.from(node.attributes).forEach(attr => newNode.setAttribute(attr.name, attr.value));
            Array.from(node.childNodes).forEach(child => newNode.appendChild(recreateWithNS(child)));
            return newNode;
          };
          newBlock = recreateWithNS(newBlock);
        } else {
          newBlock = doc.importNode(newBlock, true);
        }
        
        targetBlock.parentNode.replaceChild(newBlock, targetBlock);
        
        const serializer = new XMLSerializer();
        // Formatear un poco la salida para que no quede todo en una línea si no tenía sangría
        let result = serializer.serializeToString(doc);
        result = result.replace(/><g/g, '>\n      <g').replace(/><\/ab>/g, '>\n    </ab>');
        return result;
      } catch (e) {
        console.error('Error actualizando documento XML:', e);
        return originalXml;
      }
    }
  }
}