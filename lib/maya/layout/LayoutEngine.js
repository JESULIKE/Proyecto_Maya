// lib/maya/layout/LayoutEngine.js

export class LayoutEngine {
  constructor(config = {}) {
    this.canvasWidth = config.width || 200;
    this.canvasHeight = config.height || 200;
    this.padding = config.padding || 5;
  }

  /**
   * Parsea un string DSL (ej. "1548st^178bh_130bh<21ex>") en un AST de Slots.
   */
  parseToAST(dsl) {
    if (!dsl) return null;
    
    // Tokenizador que respeta los operadores del DSL Maya
    const regex = /(<<|>>|\[|\]|\{|\}|\/|\+|_|\^|<|>|:|\@|-|[\w´']+)/g;
    const tokens = dsl.match(regex)?.filter(t => t.trim() !== '') || [];
    
    let index = 0;

    const parseNode = () => {
      if (index >= tokens.length) return null;
      let token = tokens[index];

      if (token === '[') {
        index++; // skip '['
        const children = [];
        let type = 'hstack'; // default
        
        while (index < tokens.length && tokens[index] !== ']') {
          let t = tokens[index];
          if (t === '/') {
            type = 'vstack';
            index++;
          } else if (t === '+') {
            type = 'hstack';
            index++;
          } else {
            const child = parseNode();
            if (child) children.push(child);
          }
        }
        if (tokens[index] === ']') index++;
        return { type, children };
      }

      // Base glyph
      const node = { type: 'glyph', code: token };
      index++;
      return node;
    };

    // Construcción del bloque con slots canónicos
    let root = { 
      type: 'block', 
      core: null, 
      above: [], 
      beneath: [], 
      left: [], 
      right: [], 
      infixed: [] 
    };

    let expectRelation = null;

    while (index < tokens.length) {
      let token = tokens[index];
      
      if (['^', '_', '@', '<', '>', '+', '/', '-', ':'].includes(token)) {
        expectRelation = token;
        if (token === '@') expectRelation = '<'; // normalizamos a infix internamente
        if (token === '-') expectRelation = '+'; // - se mapea a horizontal
        if (token === ':') expectRelation = '/'; // : se mapea a vertical
        index++;
      } else if (token === '[' || token.match(/[\w´']/)) {
        const node = parseNode();
        if (!node) continue;
        
        if (!root.core) {
          root.core = node;
        } else {
          if (expectRelation === '^') root.above.push(node);
          else if (expectRelation === '_') root.beneath.push(node);
          else if (expectRelation === '+') {
             // Heurística de balanceo: si el core actual es un átomo, pero recibimos un grupo a la derecha,
             // promovemos el grupo a Core y movemos el antiguo core a la izquierda (Prefijo).
             if ((node.type === 'vstack' || node.type === 'hstack') && root.core.type === 'glyph') {
                 root.left.push(root.core);
                 root.core = node;
             } else {
                 root.right.push(node);
             }
          }
          else if (expectRelation === '<') root.infixed.push(node);
          else {
             // Default a right
             root.right.push(node);
          }
        }
        expectRelation = null;
      } else {
        index++; // skip unhandled tokens
      }
    }

    return root;
  }

  /**
   * Calcula las coordenadas absolutas (x, y, w, h) para cada nodo del AST.
   */
  calculate(ast) {
    if (!ast || !ast.core) return { width: this.canvasWidth, height: this.canvasHeight, elements: [] };

    const elements = [];
    const cw = this.canvasWidth - this.padding * 2;
    const ch = this.canvasHeight - this.padding * 2;
    const cx = this.padding;
    const cy = this.padding;

    let coreX = cx;
    let coreY = cy;
    let coreW = cw;
    let coreH = ch;

    const hasAbove = ast.above.length > 0;
    const hasBeneath = ast.beneath.length > 0;
    const hasRight = ast.right.length > 0;
    const hasLeft = ast.left.length > 0;

    // Helper recursivo para procesar nodos compuestos en un área dada
    const renderNode = (node, x, y, w, h, position) => {
      if (node.type === 'glyph') {
        elements.push({ ...node, x, y, width: w, height: h, position });
      } else if (node.type === 'vstack') {
        const step = h / node.children.length;
        node.children.forEach((child, i) => {
          renderNode(child, x, y + (i * step), w, step, position);
        });
      } else if (node.type === 'hstack') {
        const step = w / node.children.length;
        node.children.forEach((child, i) => {
          renderNode(child, x + (i * step), y, step, h, position);
        });
      }
    };

    // Reservar espacio para prefijos/sufijos horizontales
    if (hasLeft) {
      const affixW = cw * 0.35;
      coreX += affixW;
      coreW -= affixW;
      
      const step = ch / ast.left.length;
      ast.left.forEach((node, i) => {
        renderNode(node, cx, cy + (i * step), affixW, step, 'left');
      });
    }

    if (hasRight) {
      const affixW = cw * 0.35;
      coreW -= affixW;
      
      const step = ch / ast.right.length;
      ast.right.forEach((node, i) => {
        renderNode(node, coreX + coreW, cy + (i * step), affixW, step, 'right');
      });
    }

    // Reservar espacio para afijos verticales
    if (hasAbove) {
      const affixH = ch * 0.35;
      coreY += affixH;
      coreH -= affixH;
      
      const step = coreW / ast.above.length;
      ast.above.forEach((node, i) => {
        renderNode(node, coreX + (i * step), cy, step, affixH, 'above');
      });
    }

    if (hasBeneath) {
      const affixH = ch * 0.35;
      coreH -= affixH;
      
      const step = coreW / ast.beneath.length;
      ast.beneath.forEach((node, i) => {
        renderNode(node, coreX + (i * step), coreY + coreH, step, affixH, 'beneath');
      });
    }

    // Insertar Core recursivamente
    renderNode(ast.core, coreX, coreY, coreW, coreH, 'core');

    // Calcular Infijos
    if (ast.infixed.length > 0) {
      const infixW = coreW * 0.35;
      const infixH = coreH * 0.35;
      ast.infixed.forEach((node, i) => {
        renderNode(node, coreX + (coreW * 0.05) + (i * (infixW + 2)), coreY + (coreH * 0.05), infixW, infixH, 'infixed');
      });
    }

    return {
      width: this.canvasWidth,
      height: this.canvasHeight,
      elements
    };
  }
}
