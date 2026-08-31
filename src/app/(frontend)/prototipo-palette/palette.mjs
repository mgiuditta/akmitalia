// PROTOTIPO USA E GETTA — issue #5. Converte oklch in sRGB e calcola i rapporti
// WCAG di ogni coppia che la pagina usa davvero. Nessuna dipendenza.
//   pnpm prototipo:palette-contrasti
const cbrt = Math.cbrt

export function oklchToRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180)
  const b = C * Math.sin((h * Math.PI) / 180)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)))
  const enc = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)
  return { lin, hex: '#' + lin.map(enc).map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('') }
}

const lum = ({ lin }) => 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
export function contrasto(c1, c2) {
  const [a, b] = [lum(c1), lum(c2)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

export const VARIANTI = {
  a: {
    nome: 'Foglio chiaro',
    strategia:
      'Il fondo e quasi bianco e tutto il lavoro lo fa l inchiostro: il contrasto del testo corrente e altissimo, il verde resta un verde riconoscibile. E la segnaletica pubblica: massima leggibilita, il colore entra solo dove classifica.',
    colori: {
      carta:      [0.985, 0.006, 150],
      cartaAlta:  [0.998, 0.002, 150],
      inchiostro: [0.22,  0.014, 152],
      grafite:    [0.505, 0.012, 152],
      riga:       [0.785, 0.010, 150],
      verde:      [0.44,  0.075, 152],
      rosso:      [0.46,  0.105, 36],
      errore:     [0.50,  0.19,  25],
    },
  },
  b: {
    nome: 'Tesserino',
    strategia:
      'La Carta e una carta vera, tinta e visibile, e tutta la scala si comprime verso il centro: meno contrasto, piu materia. E il tesserino federale, la modulistica stampata. Il rischio e che il grigio dei metadati arrivi al pelo dell AA.',
    colori: {
      carta:      [0.945, 0.010, 148],
      cartaAlta:  [0.975, 0.007, 148],
      inchiostro: [0.29,  0.020, 150],
      grafite:    [0.505, 0.016, 150],
      riga:       [0.750, 0.014, 148],
      verde:      [0.475, 0.088, 150],
      rosso:      [0.495, 0.115, 38],
      errore:     [0.52,  0.20,  25],
    },
  },
  c: {
    nome: 'Inchiostro verde',
    strategia:
      'Il verde scende quasi dentro l inchiostro: da lontano e un nero, da vicino e verde. Massimo rigore, il colore si nota solo quando lo cerchi. Il rischio e opposto: un percorso che non si distingue piu a colpo d occhio.',
    colori: {
      carta:      [0.975, 0.005, 152],
      cartaAlta:  [0.995, 0.003, 152],
      inchiostro: [0.19,  0.022, 154],
      grafite:    [0.47,  0.014, 154],
      riga:       [0.780, 0.008, 152],
      verde:      [0.355, 0.070, 154],
      rosso:      [0.395, 0.095, 34],
      errore:     [0.48,  0.19,  25],
    },
  },
}

/** Le coppie che la pagina usa davvero, non tutte le combinazioni possibili. */
const COPPIE = [
  ['inchiostro', 'carta', 4.5, 'testo corrente'],
  ['grafite', 'carta', 4.5, 'metadati, etichette'],
  ['verde', 'carta', 4.5, 'CTA come testo, link'],
  ['rosso', 'carta', 4.5, 'etichetta percorso antiaggressione'],
  ['errore', 'carta', 4.5, 'errore di form'],
  ['carta', 'verde', 4.5, 'testo su CTA piena'],
  ['cartaAlta', 'verde', 4.5, 'testo su CTA piena, fondo alto'],
  ['inchiostro', 'cartaAlta', 4.5, 'testo su superficie alta'],
  ['grafite', 'cartaAlta', 4.5, 'metadati su superficie alta'],
  ['riga', 'carta', 1.8, 'divisore a 1px (non testo, serve visibile)'],
  ['verde', 'cartaAlta', 4.5, 'link su superficie alta'],
]

export function tabella(chiave) {
  const { colori } = VARIANTI[chiave]
  const rgb = Object.fromEntries(Object.entries(colori).map(([k, v]) => [k, oklchToRgb(...v)]))
  return COPPIE.map(([f, s, min, uso]) => {
    const r = contrasto(rgb[f], rgb[s])
    return { fronte: f, sfondo: s, uso, min, rapporto: Math.round(r * 100) / 100, passa: r >= min }
  })
}

export const hexDi = (chiave) =>
  Object.fromEntries(
    Object.entries(VARIANTI[chiave].colori).map(([k, v]) => [k, oklchToRgb(...v).hex]),
  )


const VAR_CSS = {
  carta: '--carta',
  cartaAlta: '--carta-alta',
  inchiostro: '--inchiostro',
  grafite: '--grafite',
  riga: '--riga',
  verde: '--verde',
  rosso: '--rosso',
  errore: '--errore',
}

/** I token della variante come blocco :root, da iniettare nella pagina del prototipo. */
export function cssDi(chiave) {
  const righe = Object.entries(VARIANTI[chiave].colori)
    .map(([k, [L, C, h]]) => `  ${VAR_CSS[k]}: oklch(${L} ${C} ${h});`)
    .join('\n')
  return `:root {\n${righe}\n}`
}

/** I valori oklch in forma leggibile, per la tabella e per DESIGN.md. */
export const oklchDi = (chiave) =>
  Object.fromEntries(
    Object.entries(VARIANTI[chiave].colori).map(([k, [L, C, h]]) => [k, `oklch(${L} ${C} ${h})`]),
  )

if (process.argv[1]?.endsWith('palette.mjs')) {
  for (const k of Object.keys(VARIANTI)) {
    console.log(`\n=== ${k.toUpperCase()} ${VARIANTI[k].nome}`)
    const hex = hexDi(k)
    console.log(Object.entries(hex).map(([n, h]) => `${n}=${h}`).join('  '))
    for (const r of tabella(k)) {
      console.log(
        `${r.passa ? 'ok  ' : 'NO  '}${r.rapporto.toFixed(2).padStart(6)}:1  (min ${r.min})  ${r.fronte} su ${r.sfondo}  — ${r.uso}`,
      )
    }
  }
}
