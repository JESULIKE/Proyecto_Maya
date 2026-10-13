import { readFileSync } from 'node:fs'
import { DOMParser } from '@xmldom/xmldom'
import { parseXML, findBlocks } from '../lib/maya/tei/tree.js'

export const parse = (xml) => parseXML(xml, DOMParser)
export const loadUxul = () => parse(readFileSync(new URL('./fixtures/uxul-stela17.xml', import.meta.url), 'utf8'))
export const uxulBlocks = () => Object.fromEntries(findBlocks(loadUxul()).map((b) => [b.attrs['{http://www.w3.org/XML/1998/namespace}id'], b]))
