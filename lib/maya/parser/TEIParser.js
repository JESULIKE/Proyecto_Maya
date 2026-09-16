// lib/maya/parser/TEIParser.js
export class TEIParser {
  constructor(thompsonMapping) {
    this.mapping = thompsonMapping || { syllabograms: {}, logograms: {} };
    this.thompsonIndex = this.buildThompsonIndex();
  }

  buildThompsonIndex() {
    const index = new Map();
    Object.entries(this.mapping.syllabograms || {}).forEach(([translit, variants]) => {
      variants.forEach(variant => {
        index.set(variant.thompson, {
          transliteration: translit.toUpperCase(),
          type: 'syllabogram',
          ...variant
        });
      });
    });

    Object.entries(this.mapping.logograms || {}).forEach(([logogram, variants]) => {
      variants.forEach(variant => {
        index.set(variant.thompson, {
          transliteration: logogram,
          type: 'logogram',
          ...variant
        });
      });
    });
    return index;
  }

  parseBlock(blockElement) {
    // Ya no usamos parseCompactNotation (el atributo @n), 
    // sino que obligamos al Visitor a recorrer siempre el árbol DOM real
    // para mapear los atributos @rend y extraer la jerarquía profunda.
    return this.parseXMLStructure(blockElement);
  }

  parseCompactNotation(notation) {
    let result = notation;
    result = result.replace(/\?\?\.?/g, '').replace(/\*+/g, '').replace(/#/g, '');

    // Infixación
    result = result.replace(/\[([^\[\]:°.+]+)°([^\[\]:°.+]+)\]/g, (m, host, infix) => {
      return `${this.lookupTranslit(host)}<|${this.lookupTranslit(infix)}|>`;
    });

    // Vertical triple
    result = result.replace(/\[([^:\[\].]+):([^:\[\].]+):([^:\[\].]+)\]/g, (m, t, m2, b) => {
      return `${this.lookupTranslit(t)}^{${this.lookupTranslit(m2)}}_${this.lookupTranslit(b)}`;
    });

    // Vertical simple
    result = result.replace(/\[([^\[\]:°.+]+):([^\[\]:°.+]+)\]/g, (m, a, b) => {
      return this.decideVerticalRelation(a, b);
    });

    result = this.translateAllCodes(result);
    result = result.replace(/\.(?![^\[]*\])/g, '-');
    return result;
  }

  decideVerticalRelation(code1, code2) {
    const info1 = this.thompsonIndex.get(code1);
    const info2 = this.thompsonIndex.get(code2);
    const t1 = this.lookupTranslit(code1);
    const t2 = this.lookupTranslit(code2);

    if (info2?.frequency === 'very-high' && info1?.frequency !== 'very-high') {
      return `${t2}^{${t1}}`;
    }
    return `${t1}_${t2}`;
  }

  parseXMLStructure(blockElement) {
    return this.parseDOMNode(blockElement);
  }

  parseDOMNode(node) {
    let result = '';

    const processChildren = (parent) => {
      const children = Array.from(parent.children);
      for (const child of children) {
        const tag = child.tagName.toLowerCase();
        
        if (tag === 'damage' || tag === 'supplied') {
          // Unwrap visual elements transparently
          processChildren(child);
        } else if (tag === 'gap') {
          addToken('###', child.getAttribute('rend'));
        } else if (tag === 'g') {
          let childDSL = child.getAttribute('n') || '';
          if (childDSL === '') childDSL = '??';
          addToken(childDSL, child.getAttribute('rend'));
        } else if (tag === 'seg') {
          const segDSL = this.parseSegNode(child);
          addToken(segDSL, child.getAttribute('rend'));
        }
      }
    };

    const addToken = (childDSL, rend) => {
      if (!childDSL) return;
      if (result === '') {
        result = childDSL;
      } else {
        if (rend === 'above') result = `${childDSL}:${result}`; // child is above
        else if (rend === 'beneath') result = `${result}:${childDSL}`; // child is beneath
        else if (rend === 'infixed_in') result = `${result}@${childDSL}`;
        else if (rend === 'encloses') result = `${result}-${childDSL}`;
        else if (rend === 'left_beside') result = `${childDSL}-${result}`;
        else result = `${result}-${childDSL}`; // right_beside or default
      }
    };

    if (node.tagName.toLowerCase() === 'seg') {
      return this.parseSegNode(node);
    } else {
      processChildren(node);
    }

    return result;
  }

  parseSegNode(segNode) {
    const glyphs = [];
    
    const gatherGlyphs = (n) => {
      for (const child of Array.from(n.children)) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'damage' || tag === 'supplied') {
          gatherGlyphs(child);
        } else if (tag === 'gap') {
          glyphs.push({ code: '###', rend: child.getAttribute('rend') });
        } else if (tag === 'g') {
          let code = child.getAttribute('n') || '';
          if (code === '') code = '??';
          glyphs.push({ code, rend: child.getAttribute('rend') });
        } else if (tag === 'seg') {
          const segDSL = this.parseSegNode(child);
          glyphs.push({ code: segDSL, rend: child.getAttribute('rend') });
        }
      }
    };
    
    gatherGlyphs(segNode);

    if (glyphs.length === 0) return '';
    if (glyphs.length === 1) return glyphs[0].code;

    let result = '';
    glyphs.forEach(g => {
      const childDSL = g.code;
      if (result === '') {
        result = childDSL;
      } else {
        if (g.rend === 'above') result = `${childDSL}:${result}`;
        else if (g.rend === 'beneath') result = `${result}:${childDSL}`;
        else if (g.rend === 'infixed_in') result = `${result}@${childDSL}`;
        else if (g.rend === 'encloses') result = `${result}-${childDSL}`;
        else if (g.rend === 'left_beside') result = `${childDSL}-${result}`;
        else result = `${result}-${childDSL}`;
      }
    });

    // Envolver el grupo en corchetes para preservar la recursividad del nodo seg
    return `[${result}]`;
  }

  lookupTranslit(code) {
    if (!code) return null;
    const info = this.thompsonIndex.get(code);
    return info ? info.transliteration : code;
  }

  translateAllCodes(str) {
    return str.replace(/\b(\d+[a-z]{2})\b/gi, (match) => this.lookupTranslit(match) || match);
  }
}