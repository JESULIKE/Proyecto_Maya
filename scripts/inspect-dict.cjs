// Inspección rápida del diccionario Thompson del proyecto
const fs = require('fs')
const m = JSON.parse(fs.readFileSync('data/thompson-mapping.json', 'utf8'))
const byNum = {}
const inconsistent = []
const bySyl = {}
for (const [k, vs] of Object.entries(m.syllabograms)) {
  const numMatch = k.match(/\d+/)
  if (numMatch) {
    const num = numMatch[0]
    byNum[num] = byNum[num] || new Set()
    for (const v of vs) byNum[num].add(v.syllable)
  }
  for (const v of vs) (bySyl[v.syllable] = bySyl[v.syllable] || []).push(k)
}
for (const [n, s] of Object.entries(byNum)) {
  if (s.size > 1) inconsistent.push(n + '->' + [...s].join(','))
}
console.log('Numeros con silabas multiples:', inconsistent.length ? inconsistent.join(' | ') : 'ninguno')
console.log('\nClaves por silaba:')
for (const s of Object.keys(bySyl).sort()) {
  console.log('  ' + s.padEnd(6) + ': ' + bySyl[s].join(', '))
}
