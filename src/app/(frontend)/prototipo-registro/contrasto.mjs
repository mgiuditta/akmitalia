/**
 * PROTOTIPO USA E GETTA — issue #35.
 *
 * Ogni rapporto citato nella risoluzione del ticket viene da qui, non da una
 * stima a occhio: le tre direzioni introducono tre palette nuove, e WCAG 2.2 AA
 * e' un punto fisso della mappa #34.
 *
 *   node src/app/(frontend)/prototipo-registro/contrasto.mjs
 *
 * oklch -> sRGB -> contrasto WCAG 2.x
 */
const f = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055)
function oklch(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180
  const a = C * Math.cos(h), b = C * Math.sin(h)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ]
}
const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const ratio = (A, B) => {
  const [a, b] = [lum(oklch(...A)), lum(oklch(...B))].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}
const hex = (c) => '#' + oklch(...c).map((x) => Math.round(Math.min(1, Math.max(0, f(x))) * 255).toString(16).padStart(2, '0')).join('')

const P = {
  // A
  'A ground':  [0.975, 0.004, 165], 'A ink': [0.2, 0.02, 158], 'A muto': [0.48, 0.015, 158],
  'A campo':   [0.33, 0.07, 155],   'A sopra': [0.985, 0.006, 150],
  'A prova':   [0.86, 0.02, 155],   'A mattone': [0.5, 0.12, 38], 'A campofilo': [0.56, 0.05, 155],
  // B
  'B ground':  [0.955, 0.012, 155], 'B foglio': [0.995, 0.004, 155], 'B ink': [0.24, 0.02, 155],
  'B muto':    [0.5, 0.015, 155],   'B verde': [0.44, 0.075, 152], 'B mattone': [0.46, 0.105, 36],
  'B sopra':   [0.99, 0.004, 155],
  // C
  'C ground':  [0.966, 0.009, 128], 'C foglio': [0.995, 0.004, 128], 'C ink': [0.25, 0.03, 130],
  'C muto':    [0.47, 0.02, 130],   'C verde': [0.4, 0.08, 152], 'C sopra': [0.985, 0.006, 150],
  'C lav-verde': [0.925, 0.045, 150], 'C lav-carta': [0.935, 0.035, 88], 'C lav-rosso': [0.925, 0.04, 42],
}
const coppie = [
  ['A ink', 'A ground', 'testo corrente'],
  ['A muto', 'A ground', 'occhiello e secondaria'],
  ['A sopra', 'A campo', 'testo sul campo verde'],
  ['A prova', 'A campo', 'prova sul campo verde'],
  ['A sopra', 'A ink', 'azione in hover'],
  ['A mattone', 'A sopra', 'pastiglia DONNE'],
  ['A campofilo', 'A campo', 'arco divisore (non testo)'],
  ['B ink', 'B ground', 'testo corrente'],
  ['B muto', 'B ground', 'sommario e meta'],
  ['B verde', 'B ground', 'occhiello e target'],
  ['B mattone', 'B ground', 'target DONNE'],
  ['B mattone', 'B foglio', 'riquadro assenza'],
  ['B sopra', 'B verde', 'testo nel turno adulti'],
  ['B sopra', 'B ink', 'testo nel turno bambini'],
  ['C ink', 'C ground', 'testo corrente'],
  ['C muto', 'C ground', 'meta'],
  ['C muto', 'C foglio', 'testo dei punti'],
  ['C verde', 'C ground', 'occhiello'],
  ['C sopra', 'C verde', 'azione piena'],
  ['C ink', 'C lav-verde', 'testo sul lavaggio verde'],
  ['C ink', 'C lav-carta', 'testo sul lavaggio carta'],
  ['C ink', 'C lav-rosso', 'testo sul lavaggio rosso'],
  ['C muto', 'C lav-verde', 'meta sul lavaggio verde'],
]
let ko = 0
for (const [a, b, che] of coppie) {
  const r = ratio(P[a], P[b])
  const ok = r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large/UI' : 'SOTTO'
  if (r < 4.5) ko++
  console.log(`${r.toFixed(2).padStart(6)}:1  ${ok.padEnd(12)} ${a} su ${b}  — ${che}`)
}
console.log('\nhex:', Object.entries(P).map(([k, v]) => `${k}=${hex(v)}`).join('  '))
console.log(`\n${ko} coppie sotto 4,5:1`)
