// lib/maya/tei/tree.js
// Representación completa de un bloque TEI como árbol de objetos planos.
// Conserva todos los elementos, atributos (con nombre expandido), texto, cola y orden.
// Es la «representación R» (complemento de fuente) del paper de preservación editorial.

export const TEI_NS = 'http://www.tei-c.org/ns/1.0'
export const XML_NS = 'http://www.w3.org/XML/1998/namespace'
export const XMLNS_NS = 'http://www.w3.org/2000/xmlns/'

export const T = (local) => `{${TEI_NS}}${local}`
export const XML_ID = `{${XML_NS}}id`

export const localName = (tag) => tag.split('}').pop()

const expanded = (uri, local) => (uri ? `{${uri}}${local}` : local)

// Límite defensivo: evita que una entrada hostil bloquee la interfaz
export const MAX_XML_CHARS = 2_000_000

/**
 * Convierte un elemento DOM en árbol plano.
 * Los comentarios e instrucciones de proceso quedan fuera (ver límites en el paper).
 */
export const MAX_DEPTH = 200

export function fromDOM(el, depth = 0) {
  if (depth > MAX_DEPTH) throw new Error('El XML está demasiado anidado.')
  const node = { tag: expanded(el.namespaceURI, el.localName), attrs: {}, text: '', tail: '', children: [] }
  for (const a of Array.from(el.attributes || [])) {
    if (a.namespaceURI === XMLNS_NS || a.name === 'xmlns' || a.name.startsWith('xmlns:')) continue
    node.attrs[expanded(a.namespaceURI, a.localName)] = a.value
  }
  let last = null
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 1) {
      last = fromDOM(child, depth + 1)
      node.children.push(last)
    } else if (child.nodeType === 3 || child.nodeType === 4) {
      if (last) last.tail += child.nodeValue
      else node.text += child.nodeValue
    }
  }
  return node
}

/** Analiza XML y devuelve el árbol del elemento raíz. Lanza Error si el XML es inválido. */
export function parseXML(xml, DOMParserImpl = globalThis.DOMParser) {
  if (typeof xml !== 'string' || !xml.trim()) throw new Error('El XML está vacío.')
  if (xml.length > MAX_XML_CHARS) throw new Error('El XML es demasiado grande.')
  // Las DTD y entidades externas no se necesitan para TEI y son un vector de ataque conocido.
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Los documentos con DOCTYPE o ENTITY no se admiten.')
  const errors = []
  const parser = new DOMParserImpl({ onError: (level, msg) => { if (level !== 'warning') errors.push(msg) } })
  let doc
  try {
    doc = parser.parseFromString(xml, 'text/xml')
  } catch (e) {
    throw new Error('XML mal formado.')
  }
  const root = doc && doc.documentElement
  if (!root || errors.length || (root.getElementsByTagName && root.getElementsByTagName('parsererror').length) || root.localName === 'parsererror') {
    throw new Error('XML mal formado.')
  }
  return fromDOM(root)
}

/** Recorre el árbol en preorden (equivalente a Element.iter()). */
export function iter(node, out = []) {
  out.push(node)
  for (const c of node.children) iter(c, out)
  return out
}

export const clone = (node) => JSON.parse(JSON.stringify(node))

export function findParent(root, target) {
  for (const n of iter(root)) if (n.children.includes(target)) return n
  return null
}

const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => escText(s).replace(/"/g, '&quot;').replace(/\n/g, '&#10;').replace(/\t/g, '&#9;')

/**
 * Serializa el árbol a XML.
 * options: { indent: string|null, reverseAttrs, prefix } (los dos últimos son para controles de serialización)
 */
export function toXML(root, options = {}) {
  const { indent = null, reverseAttrs = false, prefix = null } = options
  const namespaces = new Map() // uri -> prefijo
  const nsFor = (uri) => {
    if (uri === XML_NS) return 'xml'
    if (!namespaces.has(uri)) namespaces.set(uri, uri === TEI_NS && !prefix ? '' : prefix || `ns${namespaces.size}`)
    return namespaces.get(uri)
  }
  const split = (name) => {
    const m = /^\{([^}]*)\}(.*)$/.exec(name)
    return m ? { uri: m[1], local: m[2] } : { uri: '', local: name }
  }
  const qName = (name, isAttr) => {
    const { uri, local } = split(name)
    if (!uri) return local
    const p = nsFor(uri)
    if (isAttr && p === '') return local
    return p ? `${p}:${local}` : local
  }

  const render = (n, depth) => {
    const pad = indent !== null ? `\n${indent.repeat(depth)}` : ''
    let attrEntries = Object.entries(n.attrs)
    if (reverseAttrs) attrEntries = attrEntries.reverse()
    const attrs = attrEntries.map(([k, v]) => ` ${qName(k, true)}="${escAttr(v)}"`).join('')
    const name = qName(n.tag, false)
    let inner = ''
    if (n.children.length || n.text) {
      inner += escText(n.text)
      for (const c of n.children) inner += render(c, depth + 1) + escText(c.tail)
      if (indent !== null && n.children.length) inner += `\n${indent.repeat(depth)}`
    }
    const open = `${depth > 0 ? pad : ''}<${name}${attrs}`
    return n.children.length || n.text ? `${open}>${inner}</${name}>` : `${open}/>`
  }

  // Primera pasada para recolectar prefijos; la segunda escribe las declaraciones en la raíz
  render(root, 0)
  const decls = [...namespaces.entries()]
    .filter(([uri]) => uri !== XML_NS)
    .map(([uri, p]) => (p ? ` xmlns:${p}="${escAttr(uri)}"` : ` xmlns="${escAttr(uri)}"`))
    .join('')
  const body = render(root, 0)
  const firstEnd = body.search(/[ />]/)
  return body.slice(0, firstEnd) + decls + body.slice(firstEnd)
}

/** Devuelve los bloques <ab type="glyph-block"> de un árbol de documento. */
export function findBlocks(root) {
  return iter(root).filter((n) => localName(n.tag) === 'ab' && n.attrs.type === 'glyph-block')
}
